import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, OSM_WAYS } from './footprint.js';
import { angle, quad, cloudPoint, POST_CONTACTS, CABLE_CONTACTS, LIFT_CONTACTS } from './grande-arche-parts.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const put=(g,m)=>{g.rotateY(angle);b.put(g,m);};
  const face=(m,p,n)=>put(quad(p,n),m);
  const box=(m,p,s)=>{const g=new THREE.BoxGeometry(...s);g.translate(...p);put(g,m);};
  const member=(m,a,c,w)=>{
    const av=new THREE.Vector3(...a),dv=new THREE.Vector3(...c).sub(av);
    const g=new THREE.CylinderGeometry(w/2,w/2,dv.length(),near?6:4);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dv.clone().normalize()));
    g.translate(...av.add(dv.multiplyScalar(0.5)).toArray());put(g,m);
  };
  const W=SPEC.width/2,D=SPEC.depth/2,I=SPEC.openingWidth/2,Z=D-SPEC.bevelDepth;
  // Facades partition the shell itself: panes do not overlay an underlying white wall.
  // Interior windows have closed inset reveals; far retains coarser separate bays.
  function grid(m,map,normal,u0,u1,v0,v1,cols,rows,recess=0) {
    const du=(u1-u0)/cols,dv=(v1-v0)/rows,gu=m==='stone'?(near?0.36:0.45):(near?0.2:0.28),gv=m==='stone'?(near?0.32:0.45):(near?0.18:0.3);
    const q=(u,v,r=0)=>map(u,v,r);
    const rect=(mat,a,c,d,e,r=0)=>face(mat,[q(a,d,r),q(c,d,r),q(c,e,r),q(a,e,r)],normal);
    for(let row=0;row<rows;row++) {
      const v=v0+row*dv;rect(m,u0,u1,v,v+gv);
      for(let col=0;col<cols;col++) {
        const u=u0+col*du;rect(m,u,u+gu,v+gv,v+dv);rect('glass',u+gu,u+du,v+gv,v+dv,recess);
        if(recess) {
          const a=q(u+gu,v+gv),c=q(u+du,v+gv),d=q(u+du,v+dv),e=q(u+gu,v+dv);
          const aa=q(u+gu,v+gv,recess),cc=q(u+du,v+gv,recess),dd=q(u+du,v+dv,recess),ee=q(u+gu,v+dv,recess);
          for(const [p,n] of [[[a,c,cc,aa],[0,1,0]],[[c,d,dd,cc],[0,0,-1]],[[d,e,ee,dd],[0,-1,0]],[[e,a,aa,ee],[0,0,1]]])face(m,p,n);
        }
      }
    }
  }
  // Two wedge-ended office piers: white bevels descend from the outer lip into the void.
  for(const s of [-1,1]) {
    grid('frame',(z,y)=>[s*W,y,z],[s,0,0],-D,D,0,110,near?36:22,near?34:18);
    grid('stone',(z,y,r=0)=>[s*(I+r),y,z],[-s,0,0],-Z,Z,8.3,100,near?24:14,near?32:17,near?0.45:0);
    face('stone',[[s*I,0,-Z],[s*I,8.3,-Z],[s*I,8.3,Z],[s*I,0,Z]],[-s,0,0]);
    for(const f of [-1,1]) {
      const map=(u,y)=>[s*(W+(I-W)*u),y,f*(D+(Z-D)*u)];
      if(near) {
        const cols=8,rows=36,du=1/cols,dv=110/rows;
        for(let row=0;row<rows;row++)for(let col=0;col<cols;col++) {
          const u=col*du,y=row*dv,gap=0.0013;
          face('stone',[map(u,y+0.03),map(u+du-gap,y+0.03),map(u+du-gap,y+dv),map(u,y+dv)],[s,0,f]);
          face('joint',[map(u,y),map(u+du,y),map(u+du,y+0.03),map(u,y+0.03)],[s,0,f]);
          face('joint',[map(u+du-gap,y+0.03),map(u+du,y+0.03),map(u+du,y+dv),map(u+du-gap,y+dv)],[s,0,f]);
        }
      } else face('stone',[map(0,0),map(1,0),map(1,110),map(0,110)],[s,0,f]);
    }
    face('stone',[[s*W,0,-D],[s*W,0,D],[s*I,0,Z],[s*I,0,-Z]],[0,-1,0]);
  }
  // Structural cap: the central soffit is 100 m above grade, and both bevels reach 110 m.
  face('stone',[[-W,110,-D],[W,110,-D],[W,110,D],[-W,110,D]],[0,1,0]);
  if(near) {
    const nx=24,nz=20;
    for(let i=0;i<nx;i++)for(let j=0;j<nz;j++) {
      const x=-I+i*2*I/nx,z=-Z+j*2*Z/nz,dx=2*I/nx,dz=2*Z/nz;
      face('stone',[[x,100,z],[x+dx-0.035,100,z],[x+dx-0.035,100,z+dz-0.035],[x,100,z+dz-0.035]],[0,-1,0]);
      face('joint',[[x+dx-0.035,100,z],[x+dx,100,z],[x+dx,100,z+dz],[x+dx-0.035,100,z+dz]],[0,-1,0]);
      face('joint',[[x,100,z+dz-0.035],[x+dx-0.035,100,z+dz-0.035],[x+dx-0.035,100,z+dz],[x,100,z+dz]],[0,-1,0]);
    }
  } else face('stone',[[-I,100,-Z],[I,100,-Z],[I,100,Z],[-I,100,Z]],[0,-1,0]);
  for(const f of [-1,1]) {
    const q=(u,t)=>[(2*u-1)*(W+(I-W)*t),110-10*t,f*(D+(Z-D)*t)];
    const cols=1,rows=1;
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)face('stone',[q(i/cols,j/rows),q((i+1)/cols,j/rows),q((i+1)/cols,(j+1)/rows),q(i/cols,(j+1)/rows)],[0,-1,f]);
  }
  // Raised parvis with continuous steps, clipped to the widening passage at its outer lips.
  box('stone',[0,4.15,0],[2*I,8.3,2*Z]);
  const steps=near?48:24;
  for(const f of [-1,1])for(let i=0;i<steps;i++) {
    const z0=D-i*SPEC.bevelDepth/steps,z1=D-(i+1)*SPEC.bevelDepth/steps;
    const h=(i+1)*8.3/steps,x0=I+(W-I)*(z0-Z)/SPEC.bevelDepth,x1=I+(W-I)*(z1-Z)/SPEC.bevelDepth;
    face('stone',[[-x0,h,f*z0],[x0,h,f*z0],[x1,h,f*z1],[-x1,h,f*z1]],[0,1,0]);
    face('stone',[[-x0,i*8.3/steps,f*z0],[x0,i*8.3/steps,f*z0],[x0,h,f*z0],[-x0,h,f*z0]],[0,0,f]);
  }
  // Mapped rear/side terrace (975001872), only its exposed portions outside the cube.
  const ring=FOOTPRINTS[OSM_WAYS.indexOf(975001872)].slice(0,-1).map(([lng,lat])=>{
    const x=(lng-SPEC.origin[0])*111319.49*Math.cos(SPEC.origin[1]*Math.PI/180),z=-(lat-SPEC.origin[1])*111319.49;
    return [x*Math.cos(angle)-z*Math.sin(angle),x*Math.sin(angle)+z*Math.cos(angle)];
  });
  const minX=Math.min(...ring.map(p=>p[0])),minZ=Math.min(...ring.map(p=>p[1])),maxX=Math.max(...ring.map(p=>p[0]));
  box('stone',[(minX-W)/2,3.78,(minZ+1.68)/2],[-W-minX,7.56,1.68-minZ]);
  box('stone',[(maxX-W)/2,3.78,(minZ-D)/2],[maxX+W,7.56,-D-minZ]);
  // Closed, finite-thickness membrane with outward underside and scalloped elevation.
  const nx=near?24:12,nz=near?20:10,t=0.12;
  const q=(i,j,lower=false)=>{const p=cloudPoint(-1+2*i/nx,-1+2*j/nz);if(lower)p[1]-=t;return p;};
  for(let i=0;i<nx;i++)for(let j=0;j<nz;j++) {
    face('cloud',[q(i,j),q(i+1,j),q(i+1,j+1),q(i,j+1)],[0,1,0]);
    face('cloud',[q(i,j,true),q(i+1,j,true),q(i+1,j+1,true),q(i,j+1,true)],[0,-1,0]);
  }
  for(let i=0;i<nx;i++)for(const j of [0,nz])face('cloud',[q(i,j),q(i+1,j),q(i+1,j,true),q(i,j,true)],[0,0,j===0?-1:1]);
  for(let j=0;j<nz;j++)for(const i of [0,nx])face('cloud',[q(i,j),q(i,j+1),q(i,j+1,true),q(i,j,true)],[i===0?-1:1,0,0]);
  for(const m of [...POST_CONTACTS,...CABLE_CONTACTS,...LIFT_CONTACTS])member('steel',m.bottom,m.top,m.width);
  // Lift cars clasp four skeletal guides; there is no central wall across the passage.
  for(const y of near?[27,66]:[40])box('glass',[0,y,-13],[3.8,3.3,3.8]);
  return b.finish();
}
