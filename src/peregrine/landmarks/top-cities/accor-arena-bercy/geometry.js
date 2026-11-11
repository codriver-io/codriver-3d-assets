import * as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{PYLONS}from'./accor-arena-bercy-roofs.js';import{local,simplify,surfaces}from'./accor-arena-bercy-parts.js';
export const SUPPORTS=PYLONS.map(r=>{const p=local(r.slice(0,-1),SPEC.origin);return p.reduce((a,v)=>a.map((x,k)=>x+v[k]/p.length),[0,0]);});
const center=SUPPORTS.reduce((a,v)=>a.map((x,k)=>x+v[k]/4),[0,0]),ordered=SUPPORTS.slice().sort((a,c)=>Math.atan2(a[1]-center[1],a[0]-center[0])-Math.atan2(c[1]-center[1],c[0]-center[0]));
export function trusses(){return ordered.map((a,i)=>{const c=ordered[(i+1)%4],d=new THREE.Vector2(c[0]-a[0],c[1]-a[1]).normalize();return{a,c,start:[a[0]-d.x*19,a[1]-d.y*19],end:[c[0]+d.x*19,c[1]+d.y*19]};});}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 // Eight adjoining planes form the four grass cheeks and chamfered corners.
 // They share every edge, including the upper concrete eave, rather than
 // assigning incompatible per-part roof directions to cadastral fragments.
 const ring=[[ -1,-.66],[-.66,-1],[.66,-1],[1,-.66],[1,.66],[.66,1],[-.66,1],[-1,.66]],d=new THREE.Vector2(SUPPORTS[0][0]-SUPPORTS[1][0],SUPPORTS[0][1]-SUPPORTS[1][1]).normalize();
 const at=(p,r,y)=>[center[0]+r*(d.x*p[0]-d.y*p[1]),y,center[1]+r*(d.y*p[0]+d.x*p[1])];
 const roof=ring.map(p=>at(p,54,24));s.cap(roof.map(p=>[p[0],p[2]]),24,'roof');
 for(let i=0;i<ring.length;i++){
  const a=ring[i],c=ring[(i+1)%ring.length],long=Math.hypot(c[0]-a[0],c[1]-a[1])>1, cuts=long?[0,.47,.53,1]:[0,1];
  for(let j=0;j<cuts.length-1;j++){
   const lerp=t=>a.map((x,k)=>x+(c[k]-x)*t),v=lerp(cuts[j]),w=lerp(cuts[j+1]),entry=long&&j===1;
   s.quad(entry?'glass':'grass',at(v,86,.12),at(v,66,20),at(w,66,20),at(w,86,.12));
   s.quad('concrete',at(v,66,20),at(v,54,24),at(w,54,24),at(w,66,20));
  }
 }
 for(const [x,z]of SUPPORTS){const g=new THREE.CylinderGeometry(3,3,30,near?24:12);g.translate(x,15,z);b.put(g,'concrete');}
 // Four double-chord open Warren trusses extend as visible cantilevers past
 // their circular supports. Every web joins a chord; columns anchor the span.
 for(const t of trusses()){
  const n=near?14:8,pos=(u,y)=>[t.start[0]+(t.end[0]-t.start[0])*u,y,t.start[1]+(t.end[1]-t.start[1])*u];
  b.bar('steel',pos(0,24),pos(1,24),.42);b.bar('steel',pos(0,29.7),pos(1,29.7),.42);
  for(let i=0;i<n;i++){b.bar('steel',pos(i/n,i%2?29.7:24),pos((i+1)/n,i%2?24:29.7),.26);b.bar('steel',pos(i/n,24),pos(i/n,29.7),.22);}b.bar('steel',pos(1,24),pos(1,29.7),.22);
 }
 const m=s.finish();m.userData.identity='grass pyramid, four30 m circular pylons and blue cantilever roof trusses';return m;
}
