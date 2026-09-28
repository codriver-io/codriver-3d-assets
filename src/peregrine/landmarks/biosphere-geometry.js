import * as THREE from 'three';
import { BIOSPHERE } from './montreal-profiles.js';
import { assetBuilder } from './asset-geometry.js';

/** Open double-layer geodesic shell, as it stands after the acrylic skin was
 * lost. Frequencies and museum volumes are visual approximations, not scans. */
export function createBiosphere({detail='near'}={}) {
  const b=assetBuilder(BIOSPHERE,detail),radius=BIOSPHERE.diameter/2,cy=BIOSPHERE.height-radius;
  const clip=(a,c)=>{
    if(a[1]<0 && c[1]<0)return null;
    const v=[a.slice(),c.slice()];
    for(let i=0;i<2;i++)if(v[i][1]<0){const p=v[i],q=v[1-i],t=-p[1]/(q[1]-p[1]);v[i]=p.map((x,j)=>x+(q[j]-x)*t);}
    return v;
  };
  const shell=(r,frequency,width,material)=>{
    const g=new THREE.IcosahedronGeometry(r,frequency-1);
    // Put one icosahedral vertex at the apex, avoiding a latitude/longitude
    // grid that would collapse into a star of poles instead of geodesic cells.
    const top=new THREE.Vector3(0,1,(1+Math.sqrt(5))/2).normalize();
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(top,new THREE.Vector3(0,1,0)));
    const p=g.attributes.position,seen=new Set(),nodes=new Map(),edges=[];
    const key=v=>v.map(n=>Math.round(n*1e5)).join(',');
    for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){
      const a=[p.getX(i+j),p.getY(i+j)+cy,p.getZ(i+j)],k=(j+1)%3,c=[p.getX(i+k),p.getY(i+k)+cy,p.getZ(i+k)];
      nodes.set(key(a),a);nodes.set(key(c),c);
      const id=[key(a),key(c)].sort().join(':');if(seen.has(id))continue;seen.add(id);
      const pair=clip(a,c);if(pair){b.bar(material,...pair,width,width,0,true,0);edges.push(pair);}
    }
    g.dispose();return {nodes:[...nodes.values()].filter(v=>v[1]>=0),edges};
  };
  const outer=shell(radius,detail==='near'?16:8,detail==='near'?0.085:0.14,'lattice');
  if(detail==='near'){
    const inner=shell(radius-2,8,0.11,'lattice');
    for(const p of inner.nodes){
      // Radial tetrahedral ties give the visible shell its depth.
      const closest=outer.nodes.map(q=>({q,d:(q[0]-p[0])**2+(q[1]-p[1])**2+(q[2]-p[2])**2})).sort((a,c)=>a.d-c.d).slice(0,3);
      for(const {q} of closest)b.bar('lattice',p,q,0.065,0.065,0,true,0);
    }
  }
  const baseR=Math.sqrt(radius*radius-cy*cy);
  for(let i=0;i<96;i++){
    const a=i*Math.PI/48,c=(i+1)*Math.PI/48;
    b.bar('lattice',[Math.cos(a)*baseR,0.18,Math.sin(a)*baseR],[Math.cos(c)*baseR,0.18,Math.sin(c)*baseR],0.15,0.15,0,true,0);
    if(detail==='near' && i%4===0)b.box('concrete',[Math.cos(a)*baseR,-0.1,Math.sin(a)*baseR],[1.25,0.5,1.25],0,0,0);
  }
  // The pavilion occupies the lower shell; leaving open air above matters.
  const angle=-0.42;
  const local=(x,y,z)=>[x*Math.cos(angle)+z*Math.sin(angle),y,-x*Math.sin(angle)+z*Math.cos(angle)];
  const box=(mat,x,y,z,w,h,d)=>b.box(mat,local(x,y,z),[w,h,d],angle,1,0);
  box('concrete',0,0.1,0,46,0.4,40);
  box('museum',-5,7,1,25,14,24);
  box('glass',10,8.2,-3,12,16.4,17);
  box('museum',-8,17,-3,18,6,16);
  box('roof',-8,20.15,-3,19,0.35,17);
  box('roof',-5,14.15,1,26,0.35,25);
  box('roof',10,16.6,-3,13,0.4,18);
  box('glass',-4,3.4,16,27,6.6,6);
  box('roof',-4,6.9,17,29,0.4,8);
  box('museum',17,4,8,6,8,13);
  if(detail==='near'){
    for(let y=2;y<=12;y+=3.5){
      box('glass',-5,y,13.05,23,1.7,0.08);
      for(let x=-15;x<=5;x+=4)box('concrete',x,y,13.13,0.16,2.6,0.14);
    }
    for(let x=-16;x<=8;x+=3)box('lattice',x,3.5,19.1,0.1,6.5,0.1);
    for(let y=4;y<=15;y+=4)box('lattice',10,y,5.55,12,0.12,0.12);
    for(let x=5;x<=15;x+=2.5)box('lattice',x,8.2,5.55,0.12,16,0.12);
    // External stairs/terraces remain below the shell's equator.
    for(let i=0;i<10;i++)box('concrete',-17,0.2+i*0.22,18-i*0.42,5,0.3,0.6);
  }
  return b.finish();
}
