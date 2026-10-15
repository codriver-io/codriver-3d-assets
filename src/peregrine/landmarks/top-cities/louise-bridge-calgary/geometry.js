import { Shape,ExtrudeGeometry,BufferGeometry,Float32BufferAttribute } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, A,Z,L,PIERS,ARCHES,SPRING,RISE,edgesAt,blend,point } from './louise-bridge-calgary-profile.js';
export const archY=(arch,s)=>SPRING+RISE*Math.sqrt(Math.max(0,1-((s-arch.mid)/((arch.z-arch.a)/2))**2));
export function create({detail='near'}={}){
 const near=detail==='near',b=bridgeBuilder(p,detail),n=near?40:16;
 const weight=y=>Math.max(0,Math.min(1,y/7.2));
 // One solid concrete barrel per bay; genuine five elliptical openings with closed spandrel walls.
 for(const arch of ARCHES){
  const sh=new Shape();sh.moveTo(arch.a,SPRING);
  for(let i=1;i<=n;i++){const t=Math.PI*i/n;sh.lineTo(arch.mid-(arch.z-arch.a)/2*Math.cos(t),SPRING+RISE*Math.sin(t));}
  sh.lineTo(arch.z,6.4);sh.lineTo(arch.a,6.4);sh.closePath();
  const g=new ExtrudeGeometry(sh,{depth:16.8,bevelEnabled:false,steps:1});
  const pos=g.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setXYZ(i,...point(pos.getX(i),pos.getZ(i)-8.4,pos.getY(i)));
  g.computeVertexNormals();g.deleteAttribute('uv');const indexed=mergeVertices(g,1e-4);g.dispose();b.put(indexed,'concrete',0,weight);
 }
 for(const s of PIERS){
  // Broad wall piers stand on local grade; side pilasters articulate the spandrel without invented holes.
  b.box('concrete',s,0,3.2,3,16.8,6.4,0,weight);
  for(const side of [-1,1]){
   b.box('concrete',s,side*8.9,3.2,2.25,1.1,6.4,0,weight);
   b.box('concrete',s,side*9.15,7.72,1.25,1.05,1.86);
   if(near)b.box('concrete',s,side*9.15,8.7,1.4,1.18,0.12);
  }
 }
 // Deck support and cornice: all concrete, avoiding coplanar material overlays.
 b.strip('concrete',A,Z,-9.8,9.8,-.15,.75);
 for(const side of [-1,1])b.strip('concrete',A,Z,side*9.8-.14,side*9.8+.14,-.15,.30);
 function ribbon(mat,a,z,edges,offset,thickness=0){
  const stations=new Set([a,z]);for(let s=Math.ceil(a/(near?2:8))*(near?2:8);s<z;s+=near?2:8)stations.add(s);
  for(const q of p.ALIGNMENT)if(q.s>a&&q.s<z)stations.add(q.s);
  const list=[...stations].sort((a,b)=>a-b),pos=[],ix=[];
  list.forEach((s,i)=>{
   const [l,r]=edges(s),h=p.deckHeight(s)+offset(s),th=typeof thickness==='function'?thickness(s):thickness;
   for(const [d,y] of [[l,h],[r,h],[l,h-th],[r,h-th]])pos.push(...point(s,d,y));
   if(i){const a=(i-1)*4,c=i*4;ix.push(a,a+1,c,a+1,c+1,c,a+2,c+2,a+3,a+3,c+2,c+3,a,c,a+2,a+2,c,c+2,a+1,a+3,c+1,a+3,c+3,c+1);}
  });
  const last=(list.length-1)*4;ix.push(0,2,1,1,2,3,last,last+1,last+2,last+1,last+3,last+2);
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,mat);
 }
 // Two separated two-lane southern ribbons collapse to the continuous four-lane river deck.
 for(let i=0;i<2;i++)ribbon('asphalt',0,L,s=>edgesAt(s)[i],()=>0,.15);
 for(const side of [-1,1])for(const [a,z,mat] of [[0,A-12,'asphalt'],[A-12,Z+12,'concrete'],[Z+12,L,'asphalt']])ribbon(mat,a,z,s=>{
  const e=edgesAt(s),edge=side<0?e[0][0]:e[1][1],w=2.52*(1-blend(s))+.18;
  return side<0?[edge-w,edge]:[edge,edge+w];
 },s=>.2*(1-blend(s)),s=>.35*(1-blend(s))+.01);
 // Open pale balustrade: upper/lower rails land in the six substantial pier/end posts.
 for(const side of [-1,1]){
  const d=side*9.5;
  for(const [a,z] of PIERS.slice(0,-1).map((s,i)=>[s,PIERS[i+1]])){
   b.strip('rail',a,z,d-.13,d+.13,1.30,.18);
   b.strip('rail',a,z,d-.13,d+.13,.42,.14);
   const count=Math.ceil((z-a)/(near?.62:1.24));
   for(let j=1;j<count;j++)b.box('rail',a+(z-a)*j/count,d,8.0,.13,.18,.88);
  }
 }
 // Fallback lane paint remains under the runtime HD overlay; no authored paint on approaches.
 for(const d of [-6.9,0,6.9])b.strip('paint',A,Z,d-.06,d+.06,.025);
 if(near)for(let s=A+2;s<Z-3;s+=10)for(const d of [-3.55,3.55])b.strip('paint',s,s+3,d-.06,d+.06,.025);
 return b.finish();
}
