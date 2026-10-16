import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// The mapped north/south side is N17E: rotation is baked once into all exports.
export const ROTATION = -17 * Math.PI / 180;
export const point = (x,y,z) => [Math.cos(ROTATION)*x+Math.sin(ROTATION)*z,y,-Math.sin(ROTATION)*x+Math.cos(ROTATION)*z];
export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const contacts=[];
  const box=(mat,x,y,z,w,h,d)=>b.box(mat,point(x,y,z),[w,h,d],ROTATION);
  function quad(mat,a,c,d,e) {
    const vs=[a,c,d,e].map(v=>point(...v));
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(vs.flat(),3));
    g.setIndex([0,2,1,0,3,2]);g.computeVertexNormals();b.put(g,mat);
  }
  // Tile each facade into real separate panes and flush metal joints, not overlays.
  function wall(x1,z1,x2,z2,y0,y1,seed=0,panes=true,core=false,opaque='concrete') {
    const len=Math.hypot(x2-x1,z2-z1), n=panes?Math.max(1,(near?Math.round(len/2.7):Math.ceil(len/9.5))):1;
    const at=(s,y)=>[x1+(x2-x1)*s/len,y,z1+(z2-z1)*s/len];
    for(let i=0;i<n;i++) {
      const lo=i*len/n,hi=(i+1)*len/n, joint=near?0.11:0.15;
      const strips=panes?[[lo,lo+joint,'aluminium'],[lo+joint,hi,'glass']]:[[lo,hi,opaque]];
      for(const [a,c,mat] of strips) quad(mat,at(a,y0),at(c,y0),at(c,y1),at(a,y1));
    }
  }
  function storey(x0,x1,z0,z1,y,h,seed) {
    // All caps and walls meet at edges; no glass box hidden behind cladding.
    box('concrete',(x0+x1)/2,y+0.45,(z0+z1)/2,x1-x0,0.9,z1-z0);
    const inset=1.15, a=x0+inset,c=x1-inset,d=z0+inset,e=z1-inset;
    // Cut out all service-core intersections instead of hiding an extra glass wall behind them.
    const parts=(lo,hi,holes)=>{let out=[[lo,hi]];for(const [u,v] of holes)out=out.flatMap(([a,c])=>v<=a||u>=c?[[a,c]]:[[a,Math.max(a,u)],[Math.min(c,v),c]].filter(([a,c])=>c-a>0.02));return out;};
    const eastParts=parts(d,e,[[-33.5,-20.5],[21.5,34.5]]);
    const westParts=parts(d,e,[[-36,-18],[19,37]]);
    for(const [u,v] of eastParts)wall(c,u,c,v,y+0.9,y+h,seed+2);
    for(const [u,v] of westParts)wall(a,v,a,u,y+0.9,y+h,seed+6);
    const northParts=parts(a,c,d<-46?[[-5,5]]:(d>18&&d<22?[[-32,-18],[21,33]]:[])),southParts=parts(a,c,e>50?[[-5,5]]:(e>-22&&e<-18?[[-32,-18],[21,33]]:[]));
    for(const [u,v] of northParts)wall(u,d,v,d,y+0.9,y+h,seed);
    for(const [u,v] of southParts)wall(v,e,u,e,y+0.9,y+h,seed+4);
    // Exposed vertical sunshade fins are rooted in each floor slab.
    const step=near?2.8:24.0;
    for(const x of [x0+0.48,x1-0.48]) for(let z=z0+1.4;z<z1-1;z+=step) {
      if(x<0?((z>=-36&&z<=-18)||(z>=19&&z<=37)):((z>=-33.5&&z<=-20.5)||(z>=21.5&&z<=34.5)))continue;
      box('aluminium',x,y+0.9+(h-0.9)/2,z,0.42,h-0.9,0.18);
      contacts.push({name:'vertical sunshade fin',support:'concrete floor slabs',a:point(x,y+0.9,z),c:point(x,y+h,z)});
    }
  }
  // North and south office wings: thirteen office tiers, terraced over the last three.
  for(const [z0,z1] of [[-56,-18],[18,60]]) {
    for(let i=0;i<13;i++) {
      const setback=Math.max(0,i-9)*1.4;
      storey(-32+setback,31-setback,z0+setback*0.45,z1-setback*0.45,i*4.15,4.15,i);
    }
    box('concrete',-0.5,54.15,(z0+z1)/2,54,0.4,z1-z0-3.8);
  }
  // Central offices stand on two rows of pilotis, with a recessed two-storey lobby.
  for(let i=0;i<11;i++) storey(-29,20,-18,18,12.45+i*4.15,4.15,i+3);
  box('concrete',-4.5,58.35,0,49,0.5,36);
  // The front colonnade remains open; a glazed lobby sits 8 m behind the span edge.
  for(const x of [-26,18])for(const z of [-12,0,12]) {
    box('concrete',x,6.225,z,1.5,12.45,1.5);
    contacts.push({name:'plaza piloti',support:'ground and central office slab',a:point(x,0,z),c:point(x,12.45,z)});
  }
  for(let i=0;i<2;i++)storey(-21,15,-16,16,i*4.15,4.15,i);
  box('concrete',-3,8.45,0,36,0.3,32);
  // Broad entrance canopy, structurally joined to the two west service cores.
  box('concrete',-28,12.45,0,10,1.2,48);
  contacts.push({name:'entrance canopy north end',support:'north west service core',a:point(-28,12.45,-24),c:point(-28,12.45,24),axis:'z'});
  // Four main external service towers; broad pale bands alternate with inset glazing.
  for(const x of [-27,27]) for(const z of [-27,28]) {
    const front=x<0, cx=front?-25:x, width=front?14:12, depth=front?18:13;
    const towerMat=front?'core':'concrete', tier=front?4.7:4.15;
    const coreWall=(...args)=>wall(...args,false,false,towerMat);
    for(let i=0;i<14;i++) {
      const y=i*tier;
      box(towerMat,cx,y+0.55,z,width,1.1,depth);
      const a=cx-width/2,c=cx+width/2,d=z-depth/2,e=z+depth/2;
      coreWall(a,d,c,d,y+1.1,y+tier,i);
      coreWall(c,e,a,e,y+1.1,y+tier,i);
      // Two opaque cheeks and central inset panel give the service towers their vertical register.
      for(const side of [-1,1]) {
        const xx=side<0?a:c;
        if(side<0) {
          coreWall(xx,d+3,xx,d,y+1.1,y+tier,i);
          coreWall(xx,e,xx,e-3,y+1.1,y+tier,i);
        } else {
          coreWall(xx,d,xx,d+3,y+1.1,y+tier,i);
          coreWall(xx,e-3,xx,e,y+1.1,y+tier,i);
        }
        // Glazing is inset 0.7 m, cheeks are closed at the recess edges.
        const inner=xx-side*0.7;
        if(side<0) {
          wall(inner,e-3,inner,d+3,y+1.1,y+2.2,i,true,true);
          coreWall(inner,e-3,inner,d+3,y+2.2,y+tier,i);
          coreWall(xx,d+3,inner,d+3,y+1.1,y+tier,i);
          coreWall(inner,e-3,xx,e-3,y+1.1,y+tier,i);
        } else {
          wall(inner,d+3,inner,e-3,y+1.1,y+2.2,i,true,true);
          coreWall(inner,d+3,inner,e-3,y+2.2,y+tier,i);
          coreWall(inner,d+3,xx,d+3,y+1.1,y+tier,i);
          coreWall(xx,e-3,inner,e-3,y+1.1,y+tier,i);
        }
      }
    }
    // Open service crown: two cheeks and cap, leaving a dark horizontal notch.
    const crownBase=14*tier, crownTop=front?70:62;
    // Grounded open crown: buff piers and crossbars frame an actual perforated lattice.
    for(const side of [-1,1]) {
      const xx=cx+side*(width/2-0.6);
      for(const zz of [z-depth/2+0.6,z+depth/2-0.6])box(towerMat,xx,(crownBase+crownTop-0.6)/2,zz,1.2,crownTop-0.6-crownBase,1.2);
      for(const yy of [crownBase+0.45,crownTop-0.45])box(towerMat,xx,yy,z,1.2,0.9,depth-1.2);
      const count=near?7:4;
      for(let j=1;j<count;j++)box(towerMat,xx,(crownBase+crownTop)/2,z-depth/2+j*depth/count,0.5,crownTop-crownBase-0.9,0.35);
      box(towerMat,xx,(crownBase+crownTop)/2,z,0.5,0.3,depth-1.2);
    }
    box(towerMat,cx,crownTop-0.3,z,width,0.6,depth);
    // Prominent external cylindrical ducts touch their tower along the full height.
    for(const dz of [-depth/2,depth/2]) {
      const g=new THREE.CylinderGeometry(0.9,0.9,54,near?10:6);
      g.translate(cx+(front?-width/2+0.5:width/2-0.5),29,z+dz);g.rotateY(ROTATION);b.put(g,'aluminium');
    }
  }
  // Fifth and sixth short-end cores, set inside the mapped end caps.
  for(const z of [-51,55]) {
    box('concrete',0,28,z,10,56,9);
    box('aluminium',0,57.5,z,12,3,10);
  }
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){const old=o.geometry; o.geometry=mergeVertices(old,1e-4);old.dispose();}});
  root.userData.contacts=contacts;
  return root;
}
