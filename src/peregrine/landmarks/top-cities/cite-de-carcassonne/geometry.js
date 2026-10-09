// Original procedural restored fortifications. Mapped polygons carry the orientation.
import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {PARTS,WALLS} from './cite-de-carcassonne-plan.js';
import {ROOF_BLOCKS,roofStrips} from './cite-de-carcassonne-roofscape.js';
import {meshKit,center,simplify,inside} from './cite-de-carcassonne-kit.js';
const BASE=-2.8;
const outer=p=>p.id>=54852915&&p.id<=54852956||[54920181,719473869,33056289,1066578212].includes(p.id);
const circle=(c,r,n)=>Array.from({length:n},(_,i)=>[c[0]+r*Math.cos(i*2*Math.PI/n),c[1]+r*Math.sin(i*2*Math.PI/n)]);
function edges(ring){const sign=Math.sign(ring.reduce((s,p,i)=>{const q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1];},0));return ring.map((a,i)=>{const c=ring[(i+1)%ring.length],L=Math.hypot(c[0]-a[0],c[1]-a[1]);return {a,c,L,t:[(c[0]-a[0])/L,(c[1]-a[1])/L],n:[sign*(c[1]-a[1])/L,-sign*(c[0]-a[0])/L]};}).filter(e=>e.L>0.15);}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=meshKit(b);
 function wall(p){
  const r=simplify(p.ring,near?0.1:0.6),h=outer(p)?8.2:12.8;k.prism(r,BASE,h,'stone',(a,c,n)=>((a[0]+c[0])/2+30)*n[0]+((a[1]+c[1])/2+10)*n[2]>0?'glow':'stone');
  for(const e of edges(r)){
   const mid=[(e.a[0]+e.c[0])/2,(e.a[1]+e.c[1])/2];
   if((mid[0]+30)*e.n[0]+(mid[1]+10)*e.n[1]<0||e.L<4)continue;
   const count=Math.max(1,Math.floor(e.L/(near?4:13))),step=e.L/count;
   for(let i=0;i<count;i++){const c=[e.a[0]+e.t[0]*(i+.5)*step-e.n[0]*.45,e.a[1]+e.t[1]*(i+.5)*step-e.n[1]*.45];b.box('stone',[c[0],h+.6,c[1]],[step*.52,1.2,.9],-Math.atan2(e.t[1],e.t[0]));}
   if(near){
    // Offset horizontal rubble courses and staggered blocks; two triangles each.
    for(let y=1.4;y<h-1;y+=2.1){k.panel('course',mid,e.t,e.n,e.L,.085,y,.075);const count=Math.floor(e.L/5);for(let j=0;j<count;j++){const u=(j+.5)*e.L/count+(Math.floor(y)%2?.7:-.7);const c=[e.a[0]+e.t[0]*u,e.a[1]+e.t[1]*u];k.panel('course',c,e.t,e.n,.08,.65,y+.15,.08);}}
    for(let u=5;u<e.L-2;u+=11)k.panel('glass',[e.a[0]+e.t[0]*u,e.a[1]+e.t[1]*u],e.t,e.n,.2,.85,h-2.2,.12);
   }
  }
 }
 function tower(p){
  const source=simplify(p.ring,near?.08:.4),c=center(source),isOuter=outer(p),square=[166444543,27666155].includes(p.id);
  const scale=p.id===166444543?1.45:1.18,r=source.map(q=>[c[0]+(q[0]-c[0])*scale,c[1]+(q[1]-c[1])*scale]);
  let h=square?(p.id===166444543?28:19):isOuter?12.5:18.2;
  if([54852938,26769972].includes(p.id))h=22;
  const cap=!square&&(!isOuter||[54852938,54852955,54852944].includes(p.id));
  k.prism(r,BASE,h,'stone',()=> 'glow');
  if(cap){
   if(near)k.loft(r,c,[[h-.28,1],[h+.1,1.04],[h+.4,1.04]],'trim');
   k.loft(r,c,[[near?h+.4:h-.05,1.04],[h+1,1],[h+(isOuter?9:10.2),0]],c[1]>-40&&c[0]>-125||c[0]>75&&c[1]>-140?'tile':'slate');
  }else{
   for(const e of edges(r).filter((_,i)=>near||i%2===0)){const count=Math.max(1,Math.round(e.L/(near?3.2:5)));for(let i=0;i<count;i++){const u=(i+.5)*e.L/count;b.box('stone',[e.a[0]+e.t[0]*u-e.n[0]*.35,h+.6,e.a[1]+e.t[1]*u-e.n[1]*.35],[Math.min(1.25,e.L/count*.6),1.2,.7],-Math.atan2(e.t[1],e.t[0]));}}
  }
  for(const e of edges(r))if(e.L>1){
   const mid=[(e.a[0]+e.c[0])/2,(e.a[1]+e.c[1])/2];
   if(near){k.panel('glass',mid,e.t,e.n,.35,1.1,h-2.8,.11);k.panel('trim',[mid[0]-.23*e.t[0],mid[1]-.23*e.t[1]],e.t,e.n,.1,1.25,h-2.88,.14);if(e.L>2.5)k.panel('glass',mid,e.t,e.n,.2,1.3,h-8,.1);}
   if(near)for(let y=1.3;y<h-1;y+=2.2)k.panel('course',mid,e.t,e.n,e.L,.06,y,.07);
  }
 }
 function gabled(r,lo,h,rise,mat='tile'){
   // Roof ridgeline follows the mapped longest edge, clipped into the outline.
   const E=edges(r).sort((a,b)=>b.L-a.L)[0],t=E.t,n=[-t[1],t[0]],uv=r.map(p=>[p[0]*t[0]+p[1]*t[1],p[0]*n[0]+p[1]*n[1]]),v0=Math.min(...uv.map(p=>p[1])),v1=Math.max(...uv.map(p=>p[1])),vm=(v0+v1)/2;
   k.prism(r,lo,h,'stone');
   // Clip triangles at the ridge so concave wing plans retain their footprint.
   const faces=THREE.ShapeUtils.triangulateShape(uv.map(p=>new THREE.Vector2(...p)),[]);
   const at=p=>[p[0]*t[0]+p[1]*n[0],h+rise*(1-Math.abs(p[1]-vm)/((v1-v0)/2)),p[0]*t[1]+p[1]*n[1]];
   for(const f of faces)for(const side of [-1,1]){
    let poly=f.map(i=>uv[i]),out=[];
    for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],ai=side*(a[1]-vm)>=0,ci=side*(c[1]-vm)>=0;if(ai)out.push(a);if(ai!==ci){const q=(vm-a[1])/(c[1]-a[1]);out.push([a[0]+q*(c[0]-a[0]),vm]);}}
    for(let i=1;i<out.length-1;i++)k.tri(mat,at(out[0]),at(out[i]),at(out[i+1]),[0,1,0]);
   }
   for(let i=0;i<uv.length;i++){const a=uv[i],c=uv[(i+1)%uv.length],split=(a[1]-vm)*(c[1]-vm)<0?[[a,[a[0]+(vm-a[1])/(c[1]-a[1])*(c[0]-a[0]),vm]],[[a[0]+(vm-a[1])/(c[1]-a[1])*(c[0]-a[0]),vm],c]]:[[a,c]];
    for(const [a,c]of split)k.quad('stone',[at(a)[0],h,at(a)[2]],[at(c)[0],h,at(c)[2]],at(c),at(a),[(at(c)[2]-at(a)[2])*Math.sign(r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0)),0,-(at(c)[0]-at(a)[0])*Math.sign(r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0))]);
   }
 }
 function gate(p,narbonnaise){
   const c=narbonnaise?[115.5,-60.6]:[-50.6,-78],t=narbonnaise?[.34,-.94]:[.25,-.968],n=[-t[1],t[0]],sep=narbonnaise?10.4:5.4,r=narbonnaise?8.6:3.6,h=narbonnaise?19:16,roof=narbonnaise?11:6;
   const at=(u,d,y)=>[c[0]+t[0]*u+n[0]*d,y,c[1]+t[1]*u+n[1]*d];
   for(const u of [-sep,sep]){
    const cc=[at(u,0,0)[0],at(u,0,0)[2]],ring=circle(cc,r,near?20:12);k.prism(ring,BASE,h,'stone',()=> 'glow');if(near)k.loft(ring,cc,[[h-.3,1],[h,1.05],[h+.25,1.05]],'trim');k.loft(ring,cc,[[near?h+.25:h-.05,1.05],[h+roof,0]],narbonnaise?'tile':'slate');
    for(const e of edges(ring))if(near){const m=[(e.a[0]+e.c[0])/2,(e.a[1]+e.c[1])/2];for(const y of [h-2.5,h-7,h-12])k.panel('glass',m,e.t,e.n,.32,1,y,.1);for(let y=1.6;y<h-1;y+=2.1)k.panel('course',m,e.t,e.n,e.L,.065,y,.08);}
   }
   // Real pass-through under the central block: arched intrados, solid spandrels.
   const w=narbonnaise?1.65:1.7,archTop=narbonnaise?7.2:5.5,spring=archTop-w,depth=narbonnaise?7:4,H=narbonnaise?18:13;
   const angle=-Math.atan2(t[1],t[0]);
   for(const s of [-1,1])b.box('stone',at(s*(w+1.4),0,(H+BASE)/2),[2.8,H-BASE,depth],angle);
   const count=near?12:8;
   for(let i=0;i<count;i++){
    const a=Math.PI-i*Math.PI/count,z=Math.PI-(i+1)*Math.PI/count,ua=w*Math.cos(a),ub=w*Math.cos(z),ya=spring+w*Math.sin(a),yb=spring+w*Math.sin(z);
    for(const d of [-depth/2,depth/2])k.quad('stone',at(ua,d,ya),at(ub,d,yb),at(ub,d,H),at(ua,d,H),[n[0]*Math.sign(d),0,n[1]*Math.sign(d)]);
    k.quad('stone',at(ua,-depth/2,ya),at(ua,depth/2,ya),at(ub,depth/2,yb),at(ub,-depth/2,yb),[0,-1,0]);
   }
   b.box('stone',at(0,0,H+.12),[w*2,.24,depth],angle);
   // The smaller restored gatehouse cap between the twin cones.
   const rr=[[-w-1,-depth/2],[w+1,-depth/2],[w+1,depth/2],[-w-1,depth/2]].map(([u,d])=>[at(u,d,H)[0],at(u,d,H)[2]]);k.loft(rr,c,[[H,1],[H+5,0]],narbonnaise?'tile':'slate');
 }
 for(const p of PARTS){
  if(p.role==='wall')wall(p);
  else if(p.role==='tower')tower(p);
  else if(p.role==='gate')gate(p,p.id===26769971);
  else if(p.role==='wing'){
    const source=simplify(p.ring,.12),c=center(source),scale=p.id===166444538?1.08:1,r=source.map(q=>[c[0]+(q[0]-c[0])*scale,c[1]+(q[1]-c[1])*scale]);gabled(r,BASE,p.id===166444538?24:13,p.id===166444538?6:4,'tile');
    if(near)for(const e of edges(r))if(e.L>5)for(let u=2;u<e.L-1;u+=3.6){const c=[e.a[0]+e.t[0]*u,e.a[1]+e.t[1]*u];k.panel('glass',c,e.t,e.n,.65,1.2,9.6,.12);k.panel('glass',c,e.t,e.n,.4,.9,4.7,.12);}
  }else if(p.role==='barbican')wall({...p,id:54852952});
  else if(p.role==='basilica'){
    const r=simplify(p.ring,.23);k.prism(r,BASE,10.8,'stone');
    // Nave and Gothic transept: local east axis derived from mapped church outline.
    const t=[.997,.077],n=[-.077,.997],c=[-97,123],at=(u,v)=>[c[0]+u*t[0]+v*n[0],c[1]+u*t[1]+v*n[1]];
    const rect=(a,z,w,d)=>[at(a-w/2,z-d/2),at(a+w/2,z-d/2),at(a+w/2,z+d/2),at(a-w/2,z+d/2)];
    gabled(rect(-8,-5,38,13),10.6,16,6,'tile');gabled(rect(13,0,11,43),10.6,16,6,'slate');
    gabled(rect(19,-2,11,9),10.6,15,5,'slate');
    if(near)for(const e of edges(r))if(e.L>2.5)k.panel('glass',[(e.a[0]+e.c[0])/2,(e.a[1]+e.c[1])/2],e.t,e.n,Math.min(1.2,e.L*.5),4,5.6,.12);
  }
 }
 for(const w of WALLS)for(let i=0;i<w.line.length-1;i++){
  const a=w.line[i],c=w.line[i+1],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz);if(L<1)continue;const n=[dz/L*.75,-dx/L*.75];wall({id:54852952,ring:[[a[0]+n[0],a[1]+n[1]],[c[0]+n[0],c[1]+n[1]],[c[0]-n[0],c[1]-n[1]],[a[0]-n[0],a[1]-n[1]]]});
 }
 for(const block of ROOF_BLOCKS)for(const strip of roofStrips(block))gabled(strip.ring,BASE,strip.eave,strip.rise,'tile');
 k.flush();return b.finish();
}
