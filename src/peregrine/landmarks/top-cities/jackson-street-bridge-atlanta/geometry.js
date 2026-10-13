import { BufferGeometry, Float32BufferAttribute } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, A, B, L, roadHalf, edgeAt, deckHeight as h } from './jackson-street-bridge-atlanta-profile.js';
export const LAMP_STATIONS=[A+4,B-4];
export const PIER=(A+B)/2;
export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder(p,detail);
 // Closed lofted ribbons: variable width only on approach slabs and connected sidewalks.
 function ribbon(mat,a,z,left,right,offset,thickness=0,lift=1) {
  const stations=[...new Set([a,z,A,B,...Array.from({length:Math.ceil(L/(near?2:4))},(_,i)=>i*(near?2:4))].filter(s=>s>=a&&s<=z))].sort((u,v)=>u-v);
  const positions=[],indices=[],stride=thickness?4:2;
  stations.forEach((s,i)=>{
   const ds=[left(s),right(s)];
   for(const [d,dy] of thickness?[[ds[0],0],[ds[1],0],[ds[0],-thickness],[ds[1],-thickness]]:[[ds[0],0],[ds[1],0]])positions.push(...b.xyz(s,d,h(s)+offset+dy));
   if(!i)return;const x=(i-1)*stride,y=i*stride;
   indices.push(x,x+1,y,x+1,y+1,y);
   if(thickness)indices.push(x+2,y+2,x+3,x+3,y+2,y+3,x,y,x+2,x+2,y,y+2,x+1,x+3,y+1,x+3,y+3,y+1);
  });
  if(thickness){const e=(stations.length-1)*4;indices.push(0,2,1,1,2,3,e,e+1,e+2,e+1,e+3,e+2);}
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,mat,0,lift);
 }
 // Structure stops at mapped abutments; ordinary streets get only the tapered ramp pavement and walks.
 ribbon('fascia',A,B,s=>edgeAt(s,-1),s=>edgeAt(s,1),-.28,.65);
 ribbon('asphalt',0,L,s=>-roadHalf(s),roadHalf,0);
 for(const side of [-1,1]) {
  const inner=s=>side*roadHalf(s),outer=s=>edgeAt(s,side);
  ribbon('concrete',0,L,side<0?outer:inner,side<0?inner:outer,.18,.24);
  const wallInner=s=>edgeAt(s,side)-side*.38;
  ribbon('concrete',A,B,side<0?outer:wallInner,side<0?wallInner:outer,.73,.55);
  // Two open horizontal guardrails on angled metal posts, preserving the skyline overlook.
  const d=side*9.48;
  for(const up of [.97,1.25])ribbon('rail',A+.16,B-.16,()=>d-.055,()=>d+.055,up,.11);
  for(let s=A+.18;s<=B-.1;s+=near?3.05:6.1) {
   b.beam('rail',[s,d,h(s)+.71],[s,d-side*.14,h(s)+1.26],.11,.14);
  }
  // Terminal rails embed in supported posts, never terminate free at an asset boundary.
  for(const s of [A+.16,B-.16])b.box('rail',s,d,h(s)+.99,.18,.18,.56);
 }
 // Ramp fill meets flat ground rather than leaving an elevated ribbon in the air.
 for(const [a,z] of [[0,A],[B,L]]) {
  const stations=Array.from({length:Math.ceil((z-a)/3)+1},(_,i)=>a+(z-a)*i/Math.ceil((z-a)/3));
  const pos=[],idx=[],weights=[];
  stations.forEach((s,i)=>{
   const top=h(s)-.3;
   for(const [d,y,w] of [[edgeAt(s,-1),top,1],[edgeAt(s,1),top,1],[edgeAt(s,-1),-.35,0],[edgeAt(s,1),-.35,0]]){pos.push(...b.xyz(s,d,y));weights.push(w);}
   if(!i)return;const x=(i-1)*4,y=i*4;
   idx.push(x,y,x+2,x+2,y,y+2,x+1,x+3,y+1,x+3,y+3,y+1,x,x+1,y,x+1,y+1,y);
  });
  const e=(stations.length-1)*4;idx.push(0,2,1,1,2,3,e,e+1,e+2,e+1,e+3,e+2);
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,'concrete',0);
  // assetBuilder overwrites attachment weights, so override the stored geometry after put.
  g.setAttribute('bridgeLift',new Float32BufferAttribute(weights,1));
 }
 // Six longitudinal concrete girders, bearing directly on each abutment and the median cap.
 for(const d of [-7.9,-4.7,-1.55,1.55,4.7,7.9])b.strip('fascia',A+.55,B-.55,d-.28,d+.28,-.93,.52);
 for(const s of [A+.65,PIER,B-.65]) {
  const top=h(s)-1.43;
  if(s===PIER) {
   b.box('concrete',s,0,top-.32,1.4,18.2,.64);
   for(const d of [-6.8,0,6.8])b.box('concrete',s,d,(top-.64)/2,1.1,1.2,top-.64,0,y=>Math.max(0,y/(top-.64)));
  } else {
   b.box('concrete',s,0,top/2,1.6,19.4,top,0,y=>Math.max(0,y/top));
   // Short wing walls into the slope, wholly connected to abutment faces.
   for(const side of [-1,1])b.box('concrete',s+(s<PIER?-2:2),side*9.4,top/2,4, .45,top,0,y=>Math.max(0,y/top));
  }
 }
 // Two understated davit street lights, outside the carriageway, retained in both LODs.
 LAMP_STATIONS.forEach((s,i)=>{
  const d=(i?1:-1)*8.9,inward=i?-1:1;
  b.box('rail',s,d,h(s)+.35,.45,.45,.36);
  b.beam('rail',[s,d,h(s)+.18],[s,d,h(s)+8.4],near?.16:.2);
  b.beam('rail',[s,d,h(s)+8.4],[s,d+inward*1.6,h(s)+8.62],.13);
  b.box('lamp',s,d+inward*1.6,h(s)+8.58,.75,.34,.18);
 });
 if(near) {
  // Geometry paint is inspector fallback; the running app retains and drapes provider HD paint.
  for(const d of [-.13,.13])ribbon('yellow',0,L,()=>d-.055,()=>d+.055,.12);
  for(const side of [-1,1])ribbon('paint',0,L,s=>side*(roadHalf(s)-1.5)-.055,s=>side*(roadHalf(s)-1.5)+.055,.12);
 }
 return b.finish();
}
