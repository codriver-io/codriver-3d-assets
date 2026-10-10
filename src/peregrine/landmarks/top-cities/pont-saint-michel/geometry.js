import { Shape, ExtrudeGeometry } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, PIER_S, RIB_D, MAIN_END } from './pont-saint-michel-profile.js';
/** Original broad chamfered V-arm slabs below five longitudinal soffit beams. */
export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder({...p,meshStep:near?2:5},detail),L=p.BRIDGE_LENGTH;
 const chunk=s=>near&&s>L/2?1:0;
 const lift=y=>Math.max(0,Math.min(1,(y-0.55)/6.2));
 function prism(points,d,width,mat,ck,weight=lift,chamfer=false) {
  const sh=new Shape();sh.moveTo(...points[0]);for(const q of points.slice(1))sh.lineTo(...q);sh.closePath();
  const g=new ExtrudeGeometry(sh,{depth:width,steps:1,bevelEnabled:chamfer,bevelThickness:0.10,bevelSize:0.12,bevelSegments:1});
  const pos=g.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setXYZ(i,...b.xyz(pos.getX(i),d-width/2+pos.getZ(i),pos.getY(i)));
  g.deleteAttribute('uv');g.computeVertexNormals();const indexed=mergeVertices(g,0.0001);g.dispose();b.put(indexed,mat,ck,weight);
 }
 const strip=(mat,a,z,l,r,off,t=0)=>{
  const cuts=near&&a<L/2&&z>L/2?[a,L/2,z]:[a,z];
  for(let i=1;i<cuts.length;i++)b.strip(mat,cuts[i-1],cuts[i],l,r,off,t,chunk((cuts[i-1]+cuts[i])/2));
 };
 // Thin continuous slab; five separate visible soffits, not one solid box.
 strip('edge',0.02,L-0.02,-13,13,-0.16,0.55);
 for(const d of RIB_D)strip('concrete',0.02,L-0.02,d-0.65,d+0.65,-0.65,0.95);
 for(const s of PIER_S) {
  const ck=chunk(s),h=p.deckHeight(s),top=h-0.66;
  b.box('concrete',s,0,0.38,5.0,23.4,0.76,ck,0);
  for(const sign of [-1,1]) {
   // The daylight pier photograph reads as a broad plate, not five isolated
   // ladder-like legs. Its principal face rises 4.65 m over 3.7 m (~51°);
   // the upper knee turns into a short tapered haunch under the deck.
   const pts=[[1.3,0.58],[3.0,0.85],[6.7,top-1.85],[8.2,top-1.10],
    [9.7,top-0.72],[12.2,top-0.65],[12.2,top],[8.7,top],
    [6.9,top-0.64],[2.7,1.8],[1.3,1.65]];
   prism(pts.map(([u,y])=>[s+sign*u,y]),0,21.3,'concrete',ck,lift,true);
   // A tapered haunch for each of the five beam lines. Top faces sit inside
   // the existing beams; exposed lower edges show the thickened V nodes.
   for(const d of RIB_D)prism([[7.0,top-2.05],[9.2,top-1.25],
    [15.5,top-0.94],[15.5,top-0.18],[7.0,top-0.18]]
    .map(([u,y])=>[s+sign*u,y]),d,1.68,'concrete',ck,lift);
   // Narrow outer-face night wash: pale neutral grey in the day palette.
   for(const side of [-1,1])prism([[s+sign*2.5,1.07],[s+sign*7.3,top-1.30],
    [s+sign*7.55,top-1.12],[s+sign*2.5,1.25]],side*10.86,0.08,'glow',ck);
  }
  b.box('concrete',s,0,1.0,3.0,22.0,0.8,ck,lift);
 }
 // Short eastern river-arm spans: small transverse beam piers.
 for(const s of [MAIN_END+18,MAIN_END+70,MAIN_END+115]) {
  const h=p.deckHeight(s)-1.4;
  if(h>0.3)b.box('concrete',s,0,h/2,2.4,22,h,chunk(s),y=>Math.max(0,y/h));
 }
 strip('asphalt',0,L,-9.7,-5.1,0);strip('asphalt',0,L,5.1,9.7,0);
 strip('tram',0,L,-4.9,4.9,-0.015);
 for(const side of [-1,1]) {
  const edge=side*12.65;
  strip('edge',0,L,side<0?-13:9.85,side<0?-9.85:13,0.14,0.26);
  for(const h of near?[0.38,0.85,1.3]:[0.38,1.3])strip('steel',0,L,edge-0.045,edge+0.045,h,0.075);
  for(let s=0.5;s<L;s+=near?0.95:4.75)b.box('steel',s,edge,p.deckHeight(s)+0.72,0.075,0.075,1.15,chunk(s));
  strip('glow',0.02,L-0.02,side<0?-13.045:13.015,side<0?-13.015:13.045,-0.38,0.13);
  for(const d of [side*5.25,side*9.5])strip('paint',0,L,d-0.055,d+0.055,0.035);
 }
 // Two 1435 mm tram tracks. Rail corridor is excluded from vehicle ownership.
 for(const c of [-1.9,1.9])for(const d of [c-0.7175,c+0.7175])strip('steel',0,L,d-0.045,d+0.045,0.035,0.055);
 for(let s=17;s<L-10;s+=32) {
  const h=p.deckHeight(s),ck=chunk(s);
  for(const side of [-1,1]) {
   const d=side*11.85;
   b.beam('steel',[s,d,h+0.14],[s,d,h+5.6],0.13,0.13,ck);
   b.beam('steel',[s,d,h+5.6],[s+0.65,d-side*0.55,h+6.05],0.11,0.11,ck);
   b.box('lamp',s+0.75,d-side*0.65,h+6.02,0.65,0.26,0.16,ck);
  }
  b.beam('steel',[s,0,h],[s,0,h+6.9],0.17,0.17,ck);
  b.beam('steel',[s,-2.5,h+6.35],[s,2.5,h+6.35],0.1,0.1,ck);
  if(near&&s+32<L)for(const d of [-1.9,1.9])b.beam('steel',[s,d,h+5.7],[s+32,d,p.deckHeight(s+32)+5.7],0.025,0.025,ck);
 }
 const model=b.finish();
 // At curved nodes mesh heights use the same XY projection as navigation.
 for(const mesh of model.children)if(['asphalt','paint'].includes(mesh.material.name)) {
  const a=mesh.geometry.attributes.position;
  for(let i=0;i<a.count;i++)a.setY(i,p.deckHeight(p.projectBridge(a.getX(i),a.getZ(i)).s)+(mesh.material.name==='paint'?0.035:0));
  mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();
 }
 return model;
}
