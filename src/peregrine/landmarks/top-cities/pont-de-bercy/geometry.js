import { Shape, ExtrudeGeometry, BufferGeometry, Float32BufferAttribute } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, MAIN_START as A, MAIN_END as Z, UPPER_H, UPPER_PIERS, ARCH_STARTS, PIER_S, roadEdgesAt } from './pont-de-bercy-profile.js';

export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder({...p,meshStep:near?2:4},detail),L=p.BRIDGE_LENGTH;
 const ck=s=>near&&s>(A+Z)/2?1:0,lift=y=>Math.max(0,Math.min(1,y/7.5));
 function prism(points,d,width,mat='stone',weight=1) {
  const sh=new Shape();sh.moveTo(...points[0]);for(const pt of points.slice(1))sh.lineTo(...pt);sh.closePath();
  const g=new ExtrudeGeometry(sh,{depth:width,steps:1,bevelEnabled:false}),pos=g.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setXYZ(i,...b.xyz(pos.getX(i),d-width/2+pos.getZ(i),pos.getY(i)));
  g.deleteAttribute('uv');g.computeVertexNormals();const indexed=mergeVertices(g,0.0001);g.dispose();b.put(indexed,mat,ck(points[0][0]),weight);
 }
 // Closed spandrels with real elliptical openings, not painted arches.
 function arch(a,z,spring,rise,top,d,width,segments,weight=1,mat='stone') {
  const pts=[[a,top],[a,spring]];
  for(let i=1;i<=segments;i++){const t=Math.PI-i*Math.PI/segments;pts.push([(a+z)/2+(z-a)/2*Math.cos(t),spring+rise*Math.sin(t)]);}
  pts.push([z,top]);prism(pts,d,width,mat,weight);
 }
 for(const a of ARCH_STARTS)arch(a,a+29,0.85,5.45,7.45,0,40,near?32:16,lift);
 for(const [s,len] of [[A+2.3,4.6],[Z-2.3,4.6],...PIER_S.map(s=>[s,5.2])]) {
  b.box('stone',s,0,3.725,len,40,7.45,ck(s),lift);
  if(PIER_S.includes(s))for(const side of [-1,1]) {
   const sh=new Shape();sh.moveTo(-2.6,0);sh.lineTo(2.6,0);sh.lineTo(1.55,2.1);sh.lineTo(0,2.9);sh.lineTo(-1.55,2.1);sh.closePath();
   const g=new ExtrudeGeometry(sh,{depth:2.7,bevelEnabled:false}),pos=g.attributes.position;
   for(let i=0;i<pos.count;i++)pos.setXYZ(i,...b.xyz(s+pos.getX(i),side*(20+pos.getY(i)),pos.getZ(i)));
   // Positive lateral side reverses the extrusion determinant.
   if(side>0){const ix=Array.from({length:pos.count},(_,i)=>i);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.setIndex(ix);}
   g.deleteAttribute('uv');g.computeVertexNormals();b.put(mergeVertices(g,0.0001),'stone',ck(s),lift);g.dispose();
  }
 }
 b.strip('stone',A,Z,-20,20,-0.22,0.33);
 // Main slab only spans the river; landings are separated tapered ribbons.
 function ribbon(mat,a,z,edges,off,thickness=0) {
  const n=Math.ceil((z-a)/(near?2:4)),pos=[],ix=[],stride=thickness?4:2;
  for(let i=0;i<=n;i++) {
   const s=a+(z-a)*i/n,[l,r]=edges(s),h=p.deckHeight(s)+off;
   for(const [d,y] of thickness?[[l,h],[r,h],[l,h-thickness],[r,h-thickness]]:[[l,h],[r,h]])pos.push(...b.xyz(s,d,y));
   if(i){const u=(i-1)*stride,v=i*stride;ix.push(u,u+1,v,u+1,v+1,v);if(thickness)ix.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);}
  }
  if(thickness){const v=n*stride;ix.push(0,2,1,1,2,3,v,v+1,v+2,v+1,v+3,v+2);}
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,mat,ck((a+z)/2));
 }
 ribbon('asphalt',A,Z,()=>[-19.55,19.55],0);
 for(const [a,z] of [[0,A],[Z,L]])for(const side of [0,1]) {
  ribbon('asphalt',a,z,s=>roadEdgesAt(s)[side],0);
  for(const inner of [false,true])ribbon('trim',a,z,s=>{
   const e=roadEdgesAt(s)[side][inner?(side?0:1):(side?1:0)],sign=inner?(side?-1:1):(side?1:-1);
   const t=Math.max(0,Math.min(1,s<A?s/100:(L-s)/100)),width=inner?0.7:0.7+2.5*t*t*(3-2*t);
   return [Math.min(e,e+sign*width),Math.max(e,e+sign*width)];
  },0.12,0.2);
 }
 for(const side of [-1,1]) {
  b.strip('trim',A,Z,side<0?-19.55:16.55,side<0?-16.55:19.55,0.13,0.13);
  b.strip('trim',A,Z,side*19.5-0.22,side*19.5+0.22,0.4,0.25);
  b.strip('trim',A,Z,side*19.5-0.32,side*19.5+0.32,1.28,0.25);
  for(let s=A;s<=Z+0.001;s+=near?1.25:2.5) {
   b.box('trim',s,side*19.5,8.85,0.2,0.2,0.82,ck(s));
   if(near&&s+1.25<=Z){b.beam('trim',[s,side*19.5,8.52],[s+1.25,side*19.5,9.17],0.09);b.beam('trim',[s,side*19.5,9.17],[s+1.25,side*19.5,8.52],0.09);}
  }
  for(const s of [A,Z])b.box('trim',s,side*19.5,8.72,0.6,0.75,1.44,ck(s));
 }
 // 41 semicircular openings on each flank; central cycle passage stays empty.
 for(const d of [-3,3]) {
  for(const s of UPPER_PIERS) {
   if(near)for(let c=0;c<7;c++)b.box('arcade',s,d,8.2+(c+0.5)*0.4,1.3+(c%2?0.08:0),1.45,0.4,ck(s));
   else b.box('arcade',s,d,9.52,1.36,1.45,2.8,ck(s));
   b.box('arcade',s,d,8.1,1.65,1.72,0.2,ck(s));
   b.box('arcade',s,d,12.27,1.3,1.45,2.7,ck(s));
   b.box('arcade',s,d,10.98,1.65,1.72,0.16,ck(s));
  }
  for(let i=0;i<41;i++) {
   const a=UPPER_PIERS[i]+0.65,z=UPPER_PIERS[i+1]-0.65;
   arch(a,z,10.92,(z-a)/2,13.62,d,1.45,near?12:8,1,'arcade');
   if(near){const c=(a+z)/2,r=(z-a)/2;for(let v=0;v<9;v++) {
    const t0=v*Math.PI/9+0.012,t1=(v+1)*Math.PI/9-0.012;
    prism([[c+r*Math.cos(t0),10.92+r*Math.sin(t0)],[c+(r+0.24)*Math.cos(t0),10.92+(r+0.24)*Math.sin(t0)],[c+(r+0.24)*Math.cos(t1),10.92+(r+0.24)*Math.sin(t1)],[c+r*Math.cos(t1),10.92+r*Math.sin(t1)]],d+Math.sign(d)*0.785,0.12,'arcade');
   }}
  }
 }
 b.strip('arcade',A,Z,-2.4,2.4,5.64,0.28);
 b.strip('arcade',A,Z,-3.9,3.9,UPPER_H,0.48);
 b.strip(near?'ballast':'arcade',A,Z,-3.52,3.52,UPPER_H+0.12,0.12);
 for(const c of [-1.55,1.55])for(const d of [c-0.72,c+0.72])b.strip('rail',A,Z,d-0.08,d+0.08,UPPER_H+0.24,0.12);
 for(const side of [-1,1]) {
  b.strip('metro',A,Z,side*3.7-0.17,side*3.7+0.17,UPPER_H+0.42,0.2);
  b.strip('metro',A,Z,side*3.7-0.24,side*3.7+0.24,UPPER_H+1.25,0.2);
  for(let s=A;s<=Z+0.001;s+=near?0.85:1.7)b.box('metro',s,side*3.7,14.91,0.12,0.17,0.66,ck(s));
  for(const s of [A,Z])b.box('metro',s,side*3.7,14.82,0.5,0.55,1.06,ck(s));
  for(let s=A+8;s<Z;s+=26){const d=side*18.7;b.box('steel',s,d,10.5,0.11,0.11,4.75,ck(s));b.box('steel',s,d,12.9,0.4,0.4,0.12,ck(s));b.box('lamp',s,d,13.21,0.3,0.3,0.5,ck(s));b.box('steel',s,d,13.5,0.42,0.42,0.1,ck(s));}
 }
 const model=b.finish();
 for(const m of model.children)if(m.material.name==='asphalt'){
  const pos=m.geometry.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,p.deckHeight(p.projectBridge(pos.getX(i),pos.getZ(i)).s));
  m.geometry.computeVertexNormals();m.geometry.computeBoundingBox();m.geometry.computeBoundingSphere();
 }
 return model;
}
