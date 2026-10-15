import { Shape, ExtrudeGeometry, SphereGeometry, BufferGeometry, Float32BufferAttribute } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, MAIN_START as A, MAIN_END as Z, PIER_S as P, SOUTH_BEARING, NORTH_BEARING, soffit, roadEdgesAt } from './pont-de-l-alma-profile.js';

export function create({detail='near'}={}) {
 const near=detail==='near',construction={...p,deckHeight:s=>p.deckHeight(s)+7.9},b=bridgeBuilder({...construction,meshStep:near?2:4},detail),L=p.BRIDGE_LENGTH;
 const ck=s=>0,foot=y=>y<0.01?0:Math.max(0,Math.min(1,y/3.55));
 function prism(points,d,width,mat='steel',lift=1) {
  const sh=new Shape();sh.moveTo(...points[0]);for(const pt of points.slice(1))sh.lineTo(...pt);sh.closePath();
  const g=new ExtrudeGeometry(sh,{depth:width,steps:1,bevelEnabled:false}),pos=g.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setXYZ(i,...b.xyz(pos.getX(i),d-width/2+pos.getZ(i),pos.getY(i)));
  g.deleteAttribute('uv');g.computeVertexNormals();const indexed=mergeVertices(g,0.0001);g.dispose();b.put(indexed,mat,ck(points[0][0]),lift);
 }
 // Four continuous variable-depth steel caissons. The two spans share one
 // eccentric pier; the smooth haunch is not a masonry arch or a truss.
 const samples=[...new Set([A,P,Z,...Array.from({length:near?72:24},(_,i)=>A+(Z-A)*i/(near?71:23))])].sort((a,c)=>a-c);
 for(const d of [-16,-5,5,16])prism([[A,7.45],[Z,7.45],...samples.slice().reverse().map(s=>[s,soffit(s)])],d,8);
 b.strip('steel',A,Z,-21,21,-0.28,0.3);
 // Pier and pointed upstream stone cutwater; independent y=0 ground feet.
 b.box('stone',P,0,1.78,5.8,42,3.56,0,foot);
 for(const d of [-21.8,21.8]) {
  prism([[P-2.9,0],[P+2.9,0],[P+2.35,3.65],[P-2.35,3.65]],d,2.0,'stone',foot);
 }
 // Plinth beneath the Zouave, on the upstream/eastern face near the right bank.
 b.box('stone',P,23,0.8,3.65,3.9,1.6,0,foot);
 b.box('stone',P,23,1.68,2.7,3.0,0.3,0,foot);
 for(const s of [SOUTH_BEARING,NORTH_BEARING]) {
  b.box('stone',s,0,3.25,1,41,6.5,ck(s),y=>y<0.01?0:Math.max(0,Math.min(1,y/6.5)));
  for(const d of [-16,-5,5,16])b.box('steel',s,d,6.55,0.9,3.0,0.2,ck(s));
 }

 function ribbon(mat,a,z,edges,offset,thickness=0) {
  const n=Math.ceil((z-a)/(near?2:4)),pos=[],ix=[],stride=thickness?4:2;
  for(let i=0;i<=n;i++) {
   const s=a+(z-a)*i/n,[l,r]=edges(s),h=construction.deckHeight(s)+offset;
   for(const [d,y] of thickness?[[l,h],[r,h],[l,h-thickness],[r,h-thickness]]:[[l,h],[r,h]])pos.push(...b.xyz(s,d,y));
   if(i){const u=(i-1)*stride,v=i*stride;ix.push(u,u+1,v,u+1,v+1,v);if(thickness)ix.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);}
  }
  if(thickness){const v=n*stride;ix.push(0,2,1,1,2,3,v,v+1,v+2,v+1,v+3,v+2);}
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,mat,ck((a+z)/2));
 }
 // Pavement ends at the abutments. Quays and places remain provider streets.
 for(let side=0;side<2;side++)ribbon('asphalt',0,L,s=>roadEdgesAt(s)[side],0);
 // Four-lane fallback per mapped roadway. Live HD pavement/paint is retained
 // above this by the shared surface layer when its provider is available.
 if(near)for(let side=0;side<2;side++)for(let lane=1;lane<4;lane++)for(let s=0;s<L;s+=9) {
  ribbon('paint',s,Math.min(s+3,L),v=>{const [l,r]=roadEdgesAt(v)[side],d=l+(r-l)*lane/4;return [d-0.075,d+0.075];},0.025);
 }
 ribbon('trim',A,Z,()=>[-1,1],0.16,0.16);
 for(const side of [-1,1]) {
  ribbon('trim',A,Z,()=>side<0?[-21,-15]:[15,21],0.16,0.28);
  // Thin open railings with a broad mint-grey fascia, square end posts.
  b.strip('trim',A,Z,side*20.7-0.13,side*20.7+0.13,0.45,0.2);
  b.strip('trim',A,Z,side*20.7-0.14,side*20.7+0.14,1.2,0.13);
  b.strip('trim',A,Z,side*20.7-0.07,side*20.7+0.07,0.85,0.08);
  const count=near?114:38;
  for(let i=0;i<=count;i++)b.box('trim',A+(Z-A)*i/count,side*20.7,8.8,0.1,0.14,0.65,0);
  for(const s of [A,Z])b.box('trim',s,side*20.7,8.65,0.45,0.58,1.3,0);
 }
 // The characteristic forked, tulip-shaped Paris lamp heads on the walks
 // and central refuge. The poles have explicit walkway/median contacts.
 for(const d of [-18.4,0,18.4])for(let s=A+12;s<Z;s+=32) {
  b.box('iron',s,d,10.95,0.13,0.13,5.6,0);
  b.box('iron',s,d,8.28,0.33,0.33,0.25,0);
  for(const sign of [-1,1])b.beam('iron',[s,d,13.66],[s+sign*0.32,d,14.6],0.11,0.11);
  b.box('lamp',s,d,14.2,0.55,0.3,0.7,0);
  b.box('iron',s,d,14.61,0.9,0.5,0.08,0);
 }
 // Original low-poly limestone human silhouette: loose trousers, gaiters,
 // short jacket, sash, folded arms, shoulder cape, bearded head and fez.
 // Statue feet start on the plinth; component overlaps are same material.
 function ell(s,d,y,x,h,z) {
  const g=new SphereGeometry(1,near?12:7,near?8:5);g.scale(x,h,z);g.rotateY(-Math.atan2(p.bridgePoint(P).tz,p.bridgePoint(P).tx));g.translate(...b.xyz(s,d,y));b.put(g,'statue',0,foot);
 }
 for(const q of [-0.44,0.44]) {
  b.box('statue',P+q,23.35,1.96,0.56,1.2,0.3,0,foot);
  ell(P+q,23.05,2.55,0.32,0.67,0.42);
  ell(P+q,22.92,3.31,0.5,0.77,0.55);
 }
 ell(P,22.95,4.45,0.86,1.0,0.55);
 ell(P,22.58,4.35,1.0,1.27,0.42);
 b.box('statue',P,23.1,3.9,1.7,0.95,0.32,0,foot);
 b.beam('statue',[P-0.85,23.08,4.9],[P-0.6,23.7,4.1],0.43,0.46,0,foot);
 b.beam('statue',[P-0.6,23.7,4.1],[P+0.4,23.68,4.85],0.38,0.42,0,foot);
 b.beam('statue',[P+0.8,23.0,4.9],[P+0.55,23.64,4.15],0.43,0.46,0,foot);
 b.beam('statue',[P+0.55,23.64,4.15],[P-0.1,23.66,5.2],0.33,0.38,0,foot);
 ell(P,23.0,5.46,0.3,0.36,0.3);
 ell(P,23.06,6.02,0.46,0.62,0.43);
 ell(P,23.36,5.8,0.3,0.28,0.3);
 ell(P,23.49,6.08,0.12,0.17,0.17);
 ell(P,23.02,6.55,0.48,0.3,0.46);
 if(near)for(let i=-2;i<=2;i++)b.beam('statue',[P+i*0.17,22.2,3.35],[P+i*0.22,22.25,5.1],0.12,0.12,0,foot);
 const model=b.finish();
 // y=0 is the live upper quay. No DEM or absolute elevation is baked into the GLB.
 // Buried supports retain their below-grade depth; the layer hides them in Cityscape.
 for(const mesh of model.children) {
  const pos=mesh.geometry.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setY(i,pos.getY(i)-7.9);
  mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();
 }

 // Float32 projection must match navigation exactly at every fallback vertex.
 for(const mesh of model.children.filter(m=>m.material.name==='asphalt')) {
  const pos=mesh.geometry.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setY(i,p.deckHeight(p.projectBridge(pos.getX(i),pos.getZ(i)).s));
  mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();
 }
 return model;
}
