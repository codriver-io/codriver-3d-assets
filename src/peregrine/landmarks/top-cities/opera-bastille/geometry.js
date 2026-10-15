import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { COLUMN } from './footprint.js';
import { PARTS as MAPPED_PARTS } from './opera-bastille-parts.js';

const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const area=p=>p.reduce((s,a,i)=>s+a[0]*p[(i+1)%p.length][1]-a[1]*p[(i+1)%p.length][0],0)/2;
const inside=(p,r)=>{let yes=false;for(let i=0,j=r.length-1;i<r.length;j=i++)if((r[i][1]>p[1])!==(r[j][1]>p[1])&&p[0]<(r[j][0]-r[i][0])*(p[1]-r[i][1])/(r[j][1]-r[i][1])+r[i][0])yes=!yes;return yes;};
const height=p=>Math.max(0,...PARTS.filter(q=>inside(p,q.ring)).map(q=>q.h));
function half(poly,a,b,positive){const out=[];for(let i=0;i<poly.length;i++){
 const p=poly[i],q=poly[(i+1)%poly.length],u=cross(a,b,p)*(positive?1:-1),v=cross(a,b,q)*(positive?1:-1);
 if(u>=-1e-8)out.push(p);if((u>1e-8&&v< -1e-8)||(u< -1e-8&&v>1e-8)){const t=u/(u-v);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}
 }return out;}
// The mapped step polygons are ramps, not solid rectangular podium blocks.
// Author their connected stair run below and clip the low infill at its back.
const PARTS=MAPPED_PARTS.filter(p=>![255526599,255526607,255526608].includes(p.id)).map(p=>p.id===78149064?{...p,ring:half(p.ring,[-39,-79.268],[-30.34,-84.268],true)}:[255664245,255664250,255664248].includes(p.id)?{...p,h:36}:p);
function subtract(poly,tri){let remaining=poly;const out=[];for(let i=0;i<3&&remaining.length>=3;i++){
 const a=tri[i],b=tri[(i+1)%3],piece=half(remaining,a,b,false);if(piece.length>=3&&Math.abs(area(piece))>.005)out.push(piece);remaining=half(remaining,a,b,true);
 }return out;}
let cached;
// Exterior height-field shell: subtract higher roofs, split shared edges and
// retain only exposed height differences. No stacked box skins or buried roofs.
function shell(){if(cached)return cached;const walls=[],roofs=[];
 const tris=PARTS.map(q=>THREE.ShapeUtils.triangulateShape(q.ring.map(v=>new THREE.Vector2(...v)),[]).map(t=>{const p=t.map(i=>q.ring[i]);return area(p)>0?p:p.reverse();}));
 for(let k=0;k<PARTS.length;k++){
  const part=PARTS[k],ring=area(part.ring)>0?part.ring:[...part.ring].reverse();
  for(let i=0;i<ring.length;i++){
   const a=ring[i],b=ring[(i+1)%ring.length],dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);if(L<.03)continue;
   const cuts=[0,1];for(const other of PARTS)for(let j=0;j<other.ring.length;j++){
    const c=other.ring[j],d=other.ring[(j+1)%other.ring.length],ex=d[0]-c[0],ez=d[1]-c[1],den=dx*ez-dz*ex;if(Math.abs(den)<1e-8)continue;
    const t=((c[0]-a[0])*ez-(c[1]-a[1])*ex)/den,u=((c[0]-a[0])*dz-(c[1]-a[1])*dx)/den;if(t>1e-6&&t<1-1e-6&&u>=-1e-6&&u<=1+1e-6)cuts.push(t);
   }
   cuts.sort((a,b)=>a-b);for(let j=1;j<cuts.length;j++){
    const lo=cuts[j-1],hi=cuts[j];if((hi-lo)*L<.025)continue;const mid=(lo+hi)/2,x=a[0]+dx*mid,z=a[1]+dz*mid;
    const hIn=height([x-dz/L*.005,z+dx/L*.005]),hOut=height([x+dz/L*.005,z-dx/L*.005]);
    if(Math.abs(hIn-part.h)>.01||hOut>=hIn-.01)continue;
    walls.push({a:[a[0]+dx*lo,a[1]+dz*lo],b:[a[0]+dx*hi,a[1]+dz*hi],low:hOut,high:hIn,glass:part.glass,id:part.id});
   }
  }
  let pieces=tris[k];for(let j=0;j<PARTS.length;j++)if(PARTS[j].h>part.h||(PARTS[j].h===part.h&&j>k)){
   const p=PARTS[j],xs=p.ring.map(v=>v[0]),zs=p.ring.map(v=>v[1]),bb=[Math.min(...xs),Math.max(...xs),Math.min(...zs),Math.max(...zs)];
   for(const tri of tris[j]){const next=[];for(const poly of pieces){if(poly.every(v=>v[0]<bb[0])||poly.every(v=>v[0]>bb[1])||poly.every(v=>v[1]<bb[2])||poly.every(v=>v[1]>bb[3]))next.push(poly);else next.push(...subtract(poly,tri));}pieces=next;}
  }
  for(const p of pieces)if(Math.abs(area(p))>.02)roofs.push({p,h:part.h});
 }
 return cached={walls,roofs:mergeRoofs(roofs)};
}
// Dissolve the clipping tessellation before export: collinear edge intervals
// cancel in opposite directions, leaving only the roof outline and its holes.
function mergeRoofs(roofs){
 const byH=new Map(),out=[];
 for(const r of roofs){if(!byH.has(r.h))byH.set(r.h,[]);byH.get(r.h).push(r.p);}
 const key=p=>p.map(v=>Math.round(v*100)).join(',');
 for(const [h,polys]of byH){
  const lines=new Map();
  for(const poly of polys)for(let i=0;i<poly.length;i++){
   const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);if(len<.001)continue;
   let ux=dx/len,uz=dz/len;if(ux<-.000001||(Math.abs(ux)<.000001&&uz<0)){ux=-ux;uz=-uz;}
   const off=-uz*a[0]+ux*a[1],lk=[Math.round(ux*10000),Math.round(uz*10000),Math.round(off*1000)].join(',');
   if(!lines.has(lk))lines.set(lk,{ux,uz,off,edges:[]});const t=a[0]*ux+a[1]*uz,u=b[0]*ux+b[1]*uz;
   lines.get(lk).edges.push([Math.min(t,u),Math.max(t,u),t<u?1:-1]);
  }
  const edges=[];
  for(const {ux,uz,off,edges:es}of lines.values()){
   const cuts=[...new Set(es.flatMap(e=>e.slice(0,2)).map(v=>Math.round(v*1000)/1000))].sort((a,b)=>a-b);
   for(let i=1;i<cuts.length;i++){const t=cuts[i-1],u=cuts[i],mid=(t+u)/2,sign=es.reduce((s,e)=>s+(mid>e[0]-.0001&&mid<e[1]+.0001?e[2]:0),0);if(!sign||u-t<.001)continue;
    const a=[ux*t-uz*off,uz*t+ux*off],b=[ux*u-uz*off,uz*u+ux*off];edges.push(sign>0?[a,b]:[b,a]);}
  }
  const starts=new Map();edges.forEach((e,i)=>{const k=key(e[0]);if(!starts.has(k))starts.set(k,[]);starts.get(k).push(i);});
  const used=new Set(),loops=[];
  for(let i=0;i<edges.length;i++){if(used.has(i))continue;const loop=[],first=key(edges[i][0]);let j=i;
   while(j!==undefined&&!used.has(j)){used.add(j);loop.push(edges[j][0]);const end=key(edges[j][1]);if(end===first)break;j=starts.get(end)?.find(k=>!used.has(k));if(j===undefined){const q=edges[loop.length? [...used].at(-1):i][1];j=edges.findIndex((e,k)=>!used.has(k)&&Math.hypot(e[0][0]-q[0],e[0][1]-q[1])<.035);if(j<0)j=undefined;}}
   if(loop.length>=3){for(let k=loop.length-1;k>=0;k--){const a=loop[(k+loop.length-1)%loop.length],b=loop[k],c=loop[(k+1)%loop.length];if(Math.abs(cross(a,b,c))<.015)loop.splice(k,1);}if(loop.length>=3)loops.push(loop);}
  }
  const outers=loops.filter(p=>area(p)>0),holes=loops.filter(p=>area(p)<0);
  for(const poly of outers){const hs=holes.filter(p=>inside(p[0],poly)),flat=[...poly,...hs.flat()];const ts=THREE.ShapeUtils.triangulateShape(poly.map(v=>new THREE.Vector2(...v)),hs.map(r=>r.map(v=>new THREE.Vector2(...v))));for(const t of ts)out.push({h,p:t.map(i=>flat[i])});}
 }
 return out;
}
export const PORCH={center:[-40,-81],u:[.8660254,-.5],v:[.5,.8660254],width:22,height:24,depth:4};
export function porchPoint(u,y,v=0){const p=PORCH;return [p.center[0]+p.u[0]*u+p.v[0]*v,y,p.center[1]+p.u[1]*u+p.v[1]*v];}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),batches=new Map();
 function face(mat,points){if(!batches.has(mat))batches.set(mat,[]);const p=batches.get(mat);for(let i=1;i<points.length-1;i++)p.push(...points[0],...points[i],...points[i+1]);}
 const {walls,roofs}=shell();
 for(const w of walls){
  const dx=w.b[0]-w.a[0],dz=w.b[1]-w.a[1],L=Math.hypot(dx,dz),H=w.high-w.low;
  const cols=Math.max(1,Math.ceil(L/(w.glass?(near?3.2:14):(near?12:40)))),rows=Math.max(1,Math.ceil(H/(w.glass?(near?3.2:8):(near?12:40))));
  const at=(t,y)=>[w.a[0]+dx*t,y,w.a[1]+dz*t];
  const quad=(mat,l,r,y,t)=>face(mat,[at(l,y),at(l,t),at(r,t),at(r,y)]);
  const local=p=>[(p[0]+40)*PORCH.u[0]+(p[1]+81)*PORCH.u[1],(p[0]+40)*PORCH.v[0]+(p[1]+81)*PORCH.v[1]];
  const [ua,va]=local(w.a),[ub,vb]=local(w.b);
  const xs=Array.from({length:cols+1},(_,i)=>i/cols),ys=Array.from({length:rows+1},(_,i)=>w.low+H*i/rows);
  // Cut the front shell itself for the recessed entrance: no glass overlay on
  // an opaque slab. Exact reveal boundaries also preserve the far opening.
  const entrance=Math.min(va,vb)<6&&Math.max(va,vb)>-2&&Math.min(ua,ub)<9&&Math.max(ua,ub)>-9;
  if(entrance){for(const u of [-9,9]){const t=(u-ua)/(ub-ua);if(t>0&&t<1)xs.push(t);}for(const y of [5.6,23])if(y>w.low&&y<w.high)ys.push(y);}
  if(w.id===255657724)for(const y of [Math.min(13,Math.max(7,13-Math.floor(((w.a[1]+w.b[1])/2+80)/14)*2)),31.4])if(y>w.low&&y<w.high)ys.push(y);
  xs.sort((a,b)=>a-b);ys.sort((a,b)=>a-b);
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){
   const l=xs[i],r=xs[i+1],y=ys[j],t=ys[j+1],u=ua+(ub-ua)*(l+r)/2,v=va+(vb-va)*(l+r)/2;
   if(r-l<1e-6||t-y<1e-6)continue;
   if(Math.abs(u)<9&&v> -2&&v<6&&y>=5.59&&t<=23.01){
    const back=(s,h)=>porchPoint(ua+(ub-ua)*s,h,6);
    if(Math.abs(y-5.6)<.001)face('granite',[at(l,y),at(r,y),back(r,y),back(l,y)]);
    if(Math.abs(t-23)<.001)face('granite',[at(r,t),at(l,t),back(l,t),back(r,t)]);
    if(Math.abs(ua+(ub-ua)*l+9)<.001)face('granite',[at(l,t),at(l,y),back(l,y),back(l,t)]);
    if(Math.abs(ua+(ub-ua)*r-9)<.001)face('granite',[at(r,y),at(r,t),back(r,t),back(r,y)]);
    continue;
   }
   // Pane, mullion and stone joint quads TILE the surface; no overlaid faces.
   const seam=w.glass?(near?.10:.22):(near?.025:.05),du=Math.min(seam/L,(r-l)*.15),dy=Math.min(seam,(t-y)*.15);
   let mat=w.glass?'glass':'stone';
   // Keep the photographed lower stepped stone panels, with the upper 60%
   // reading as the continuous curtain wall toward Place de la Bastille.
   const midZ=w.a[1]+dz*(l+r)/2;
   if(w.id===255657724&&(t<=Math.min(13,Math.max(7,13-Math.floor((midZ+80)/14)*2))||y>=31.4))mat='stone';
   if(!w.glass&&w.low>=25)mat='frame';
   // Ground-floor side/rear entrances are separate rectangular glazed bays.
   if(!w.glass&&w.low===0&&y<7&&L>10&&i%3!==0)mat='glass';
   if(!w.glass){quad(mat,l,r,y,t);continue;}
   quad(mat,l+du,r,y+dy,t);
   if(near)quad('frame',l,l+du,y,t);
   else if(j===0){
    if(Math.abs(u)<9&&v> -2&&v<6){if(w.low<5.6)quad('frame',l,l+du,w.low,5.6);if(w.high>23)quad('frame',l,l+du,23,w.high);}
    else quad('frame',l,l+du,w.low,w.high);
   }
   quad('frame',l+du,r,y,y+dy);
  }
 }
 for(const {p,h} of roofs)face(h>=40?'frame':'stone',[...p].reverse().map(v=>[v[0],h,v[1]]));
 // Dark glazing set six metres behind the square portal's centre plane.
 // Mullion and pane quads share edges; far uses one quiet dark glazed bay.
 const pc=near?6:1,pr=near?6:1;
 for(let i=0;i<pc;i++)for(let j=0;j<pr;j++){
  const u=-9+18*i/pc,r=-9+18*(i+1)/pc,y=5.6+17.4*j/pr,t=5.6+17.4*(j+1)/pr,s=near?.13:0;
  const q=(mat,a,c,h,k)=>face(mat,[porchPoint(a,h,6),porchPoint(a,k,6),porchPoint(c,k,6),porchPoint(c,h,6)]);
  q('glass',u+s,r,y+s,t);if(near){q('frame',u,u+s,y,t);q('frame',u+s,r,y,y+s);}
 }
 for(const [mat,positions]of batches){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();b.put(g,mat);}
 // Monumental square Lanhélin-granite porch, open above its stair landing.
 const angle=Math.PI/6;
 for(const u of [-10,10])b.box('granite',porchPoint(u,12),[2,24,4],angle);
 b.box('granite',porchPoint(0,24.5),[22,3,4],angle);
 // Connected stair treads reach the porch landing, entirely within its approach.
 const steps=near?18:9;
 for(let i=0;i<steps;i++){const h=5*(i+1)/steps;b.box('stone',porchPoint(0,h/2,-10+10*(i+.5)/steps),[17,h,10/steps],angle);}
 b.box('granite',porchPoint(0,5.3,1.5),[18,.6,7],angle);
 // Gilded July Column, separate from the opera. Photo-scaled tiers; total50.52m.
 const [cx,cz]=COLUMN,n=near?32:16;
 const cyl=(mat,y,r,h,rt=r,seg=n)=>{const g=new THREE.CylinderGeometry(rt,r,h,seg).translate(cx,y+h/2,cz);b.put(g,mat);};
 const lathe=(mat,p)=>{const g=new THREE.LatheGeometry(p.map(v=>new THREE.Vector2(...v)),n).translate(cx,0,cz);b.put(g,mat);};
 const box=(mat,y,w,h,d=w)=>b.box(mat,[cx,y+h/2,cz],[w,h,d],-.25);
 const ball=(mat,x,y,z,s)=>{const g=new THREE.SphereGeometry(1,near?8:5,near?6:3).scale(...s).translate(cx+x,y,cz+z);b.put(g,mat);};
 cyl('base',0,8.8,.35);cyl('base',.35,8.3,.35);cyl('base',.7,7.8,.35);cyl('base',1.05,7.3,1.35);
 box('bronze',2.4,8,1.0);box('bronze',3.4,6.6,5.1);box('bronze',8.5,7.1,.6);box('bronze',9.1,6.8,.55);
 lathe('bronze',[[0,9.65],[3.15,9.65],[3.15,10.1],[2.6,10.55],[2.45,11.1],[2.2,11.25],[2.08,12.1],[2.015,12.4],[1.88,40.5],[2.2,40.7],[2.35,41.3],[2.6,42.1],[3.4,42.9],[3.45,43.8],[3.1,44.05],[0,44.05]]);
 // Three inscription registers indicated by fine gold-green stud rows, not text.
 if(near)for(const y of [13,22,31,39.5])for(let i=0;i<24;i++){const a=i*Math.PI/12;ball('lamp',2.04*Math.sin(a),y,2.04*Math.cos(a),[.055,.06,.055]);}
 // Corinthian leaves join shaft and abacus; volutes read from four bearings.
 for(let i=0;i<(near?16:8);i++){const a=i*2*Math.PI/(near?16:8);ball('bronze',2.4*Math.sin(a),42.15,2.4*Math.cos(a),[.5,.9,.5]);}
 cyl('bronze',44.05,3.6,.3);cyl('bronze',44.35,2.8,.25);cyl('bronze',44.6,1.1,.9,.85);
 // Balcony posts and circumferential top ring have named platform supports.
 const railN=near?24:12;
 for(let i=0;i<railN;i++){const a=i*2*Math.PI/railN;b.bar('bronze',[cx+3.2*Math.sin(a),44.3,cz+3.2*Math.cos(a)],[cx+3.2*Math.sin(a),45.15,cz+3.2*Math.cos(a)],.065,.065,0,true);}
 const torus=new THREE.TorusGeometry(3.2,.075,near?5:3,railN).rotateX(Math.PI/2).translate(cx,45.15,cz);b.put(torus,'bronze');
 ball('lamp',0,45.75,0,[.75,.6,.75]);
 // Original grouped human silhouette: supported foot, raised leg, torso,
 // head, extended arm/flame and two feathered wings. No imported sculpture.
 const limb=(a,c,r)=>b.bar('lamp',[cx+a[0],a[1],cz+a[2]],[cx+c[0],c[1],cz+c[2]],r,r,0,true);
 limb([0,46.0,0],[.15,47.4,0],.18);limb([.15,47.4,0],[-.6,47.0,.2],.18);limb([-.6,47,.2],[-.9,47.5,.3],.13);
 ball('lamp',.12,47.9,0,[.38,.7,.26]);ball('lamp',.12,48.9,0,[.23,.3,.23]);
 limb([.35,48.2,0],[.85,48.8,0],.13);limb([.85,48.8,0],[1.05,49.7,0],.10);limb([1.05,49.7,0],[1.1,50.25,0],.09);
 ball('lamp',1.1,50.3,0,[.17,.22,.13]);limb([-.2,48.2,0],[-1.05,47.8,.1],.13);
 for(const s of [-1,1]){
  const g=new THREE.BufferGeometry();const ps=[[.1,48.4,.15],[s*1.6,49.7,.5],[s*1.25,48.5,.6],[s*.65,47.9,.3]];const pos=[];for(const ix of [[0,1,2],[0,2,3],[2,1,0],[3,2,0]])for(const i of ix)pos.push(cx+ps[i][0],ps[i][1],cz+ps[i][2]);g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();b.put(g,'lamp');
 }
 const model=b.finish();model.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');const old=o.geometry;o.geometry=mergeVertices(old,.0001);old.dispose();if(o.material.name==='glass'){o.material.roughness=.24;o.material.metalness=.38;}}});return model;
}
