import pc from 'polygon-clipping';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { MAPPED } from './footprint.js';
import { marineMesh } from './marine-building-mesh.js';
const metres=111319.49079327358,cos=Math.cos(SPEC.origin[1]*Math.PI/180);
export const RINGS=Object.fromEntries(Object.entries(MAPPED).map(([id,ring])=>[id,ring.map(([x,z])=>[(x-SPEC.origin[0])*metres*cos,(SPEC.origin[1]-z)*metres])]));
const closed=r=>[...r,r[0]];
const area=r=>r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0);
function edges(r) {
  const sign=Math.sign(area(r));
  return r.map((p,i)=>{const q=r[(i+1)%r.length],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz);return {p,q,len,t:[dx/len,dz/len],n:[sign*dz/len,-sign*dx/len]};}).filter(e=>e.len>.05);
}
export const ENTRANCE=(()=>{
  const p=RINGS[360437839].at(-1),q=RINGS[360437839][0],len=Math.hypot(q[0]-p[0],q[1]-p[1]),t=[(q[0]-p[0])/len,(q[1]-p[1])/len];
  return {center:[(p[0]+q[0])/2,(p[1]+q[1])/2],t,n:[-t[1],t[0]],width:7.2,spring:7.2};
})();
const rectangle=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d],[a,c]];
export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),m=marineMesh(b);
  const masses=[[125579375,22],[360575460,8],[360575454,26],[360437838,40],[360437839,68],[360575455,74],[360437840,80],[360437841,88]].map(([id,top])=>({id,top,ring:closed(RINGS[id])}));
  const base=pc.difference([masses[0].ring],[closed(RINGS[360575460])]);
  const levels=[0,8,22,26,40,68,74,80,88];
  const active=y=>pc.union(...masses.filter(s=>s.top>y+.01).map(s=>s.id===125579375?base:[s.ring]));
  const wallSpans=[];
  for(let i=0;i<levels.length-1;i++) {
    const y0=levels[i],y1=levels[i+1],shape=active(y0);
    for(const poly of shape)for(const ring of poly)for(const e of edges(ring.slice(0,-1)))wallSpans.push({e,y0,y1});
    const upper=y1<88?active(y1):[[closed(RINGS[360437841])]];
    for(const poly of pc.difference(shape,upper))m.polygon('roof',poly,(x,z)=>[x,y1,z],[0,1,0]);
  }
  // Split collinear segments at every mapped endpoint, then merge their vertical spans.
  // A setback on one side must not introduce a blank floor on the continuous opposite wall.
  const endpoints=wallSpans.flatMap(({e})=>[e.p,e.q]), joined=new Map();
  for(const {e,y0,y1} of wallSpans) {
    const cuts=[0,e.len];
    for(const p of endpoints) {
      const u=(p[0]-e.p[0])*e.t[0]+(p[1]-e.p[1])*e.t[1];
      const d=(p[0]-e.p[0])*e.n[0]+(p[1]-e.p[1])*e.n[1];
      if(Math.abs(d)<.002&&u>.002&&u<e.len-.002)cuts.push(u);
    }
    const sorted=[...new Set(cuts.map(v=>Math.round(v*1e5)/1e5))].sort((a,b)=>a-b);
    for(let j=0;j<sorted.length-1;j++) {
      const a=sorted[j],c=sorted[j+1];if(c-a<.05)continue;
      const p=[e.p[0]+a*e.t[0],e.p[1]+a*e.t[1]],q=[e.p[0]+c*e.t[0],e.p[1]+c*e.t[1]];
      const key=[...p,...q,...e.n].map(v=>Math.round(v*1000)).join(',');
      const entry=joined.get(key)||{e:{...e,p,q,len:c-a},spans:[]};entry.spans.push([y0,y1]);joined.set(key,entry);
    }
  }
  for(const {e,spans} of joined.values()) {
    spans.sort((a,b)=>a[0]-b[0]);let [a,c]=spans[0];
    for(const [lo,hi] of spans.slice(1)){if(Math.abs(lo-c)<.01)c=hi;else{facade(e,a,c);[a,c]=[lo,hi];}}facade(e,a,c);
  }
  const crown=RINGS[360437841],mast=RINGS[360575458];
  const apex=[mast.reduce((s,p)=>s+p[0],0)/mast.length,96,mast.reduce((s,p)=>s+p[1],0)/mast.length];
  for(const e of edges(crown)) {
    const a=[e.p[0],88,e.p[1]],c=[e.q[0],88,e.q[1]];m.triangle('green',a,c,apex,normal(a,c,apex));
  }
  b.box('stone',[apex[0],96.6,apex[2]],[1.4,1.2,1.4]);
  b.box('green',[apex[0],97.35,apex[2]],[1.15,.3,1.15]);
  b.box('bronze',[apex[0],97.75,apex[2]],[.24,.5,.24]);
  portal();return m.finish();
  function facade(e,y0,y1) {
    const {p,t,n,len}=e,point=(u,y,d=0)=>[p[0]+t[0]*u+n[0]*d,y,p[1]+t[1]*u+n[1]*d],N=[n[0],0,n[1]];
    const center=ENTRANCE.center,c=(center[0]-p[0])*t[0]+(center[1]-p[1])*t[1];
    const isFront=n[0]*ENTRANCE.n[0]+n[1]*ENTRANCE.n[1]>.995&&Math.abs((center[0]-p[0])*n[0]+(center[1]-p[1])*n[1])<.12;
    const portalPoly=[];
    if(isFront&&c>3.6&&c<len-3.6&&y0<10.8) {
      portalPoly.push([c-3.6,0],[c+3.6,0],[c+3.6,7.2]);
      for(let j=1;j<=16;j++){const a=j*Math.PI/16;portalPoly.push([c+3.6*Math.cos(a),7.2+3.6*Math.sin(a)]);}portalPoly.push([c-3.6,0]);
    }
    const openings=[],count=Math.max(1,Math.floor(len/(near?2.9:3.8))),pitch=len/count,width=Math.min(near?1.65:2.05,pitch*.61);
    for(let row=0;row<23;row++) {
      const y=2+row*3.85,h=row===0?3.25:2.35;if(y<y0+.4||y+h>y1-1.1)continue;
      for(let k=0;k<count;k++) {
        const u=(k+.5)*pitch;if(portalPoly.length&&Math.abs(u-c)<4.8&&y<11)continue;
        openings.push({u,y,w:width,h,mat:(k+row*3)%7===0?'glow':'glass'});
      }
    }
    if(!openings.length&&len>3&&y0>=60&&y1-y0>3.5) {
      for(let k=0;k<count;k++)openings.push({u:(k+.5)*pitch,y:y0+1.1,w:width,h:Math.min(2.2,y1-y0-2.4),mat:k%7===0?'glow':'glass'});
    }
    const cuts=[...openings.map(o=>[rectangle(o.u-o.w/2,o.u+o.w/2,o.y,o.y+o.h)]),...(portalPoly.length?[[portalPoly]]:[])];
    // Partition the wall, so terra-cotta replaces brick instead of overlaying it.
    // The central group climbs through the shaft; every setback has a framed frieze.
    const panel=[rectangle(0,len,y0,y1)],solid=cuts.length?pc.difference(panel,...cuts):[panel];
    const terra=[],jade=[],piers=[];
    for(const [lo,hi] of [[y0,Math.min(y1,1.1)],[10.9,12],[y1-(y1>=60?2.25:1.1),y1]]) {
      const a=Math.max(y0,lo),c=Math.min(y1,hi);if(c>a)terra.push([rectangle(0,len,a,c)]);
    }
    if(y1-y0>20&&len>8)for(let k=1;k<count;k++) {
      const u=k*pitch,central=isFront&&Math.abs(u-c)<pitch*1.7;
      const lo=Math.max(12,y0),hi=y1-.7,w=central?.72:.34;
      if(hi>lo){const r=[rectangle(u-w/2,u+w/2,lo,hi)];piers.push(r);if(central)terra.push(r);}
    }
    if(y1>=60&&len>3)for(let k=1;k<count;k++) {
      const u=k*pitch;
      // Stepped pendant terra-cotta frames articulate every crown shoulder.
      terra.push([rectangle(u-.48,u+.48,y1-3.55,y1)]);
      const y=y1-1.9;
      jade.push([[[u-.28,y],[u+.28,y],[u+.28,y+.36],[u+.12,y+.60],[u-.12,y+.60],[u-.28,y+.36],[u-.28,y]]]);
    }
    if(y1>=26&&len>3)jade.push([rectangle(.18,len-.18,y1-1.05,y1-.5)]);
    for(const o of openings)if(o.y>12&&(isFront&&Math.abs(o.u-c)<pitch*1.8||o.y>y1-6))
      jade.push([rectangle(o.u-o.w/2,o.u+o.w/2,o.y-.65,o.y-.18)]);
    const terracotta=terra.length?pc.intersection(solid,pc.union(...terra)):[];
    const green=jade.length?pc.intersection(solid,pc.union(...jade)):[];
    const pale=green.length?pc.difference(terracotta,green):terracotta;
    const brick=pc.difference(solid,...(terracotta.length?[terracotta]:[]),...(green.length?[green]:[]));
    const raised=near&&piers.length?pc.difference(pc.union(...piers),...(green.length?[green]:[])):[];
    for(const [mat,polys] of [['brick',brick],['stone',pale],['green',green]]) {
      const front=raised.length?pc.intersection(polys,raised):[];
      const flush=front.length?pc.difference(polys,front):polys;
      for(const poly of flush)m.polygon(mat,poly,(u,y)=>point(u,y),N);
      for(const poly of front){
        m.polygon(mat,poly,(u,y)=>point(u,y,.22),N);
        for(const ring of poly)for(let i=0;i<ring.length-1;i++){
          const a=ring[i],c=ring[i+1],dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy);
          if(l)m.quad(mat,point(...a),point(...c),point(...c,.22),point(...a,.22),[t[0]*dy/l,-dx/l,t[1]*dy/l]);
        }
      }
    }
    for(const o of openings) {
      const u0=o.u-o.w/2,u1=o.u+o.w/2,y=o.y,h=o.h,d=near?-.18:0;
      m.quad(o.mat,point(u0,y,d),point(u1,y,d),point(u1,y+h,d),point(u0,y+h,d),N);
      const corners=[[u0,y],[u1,y],[u1,y+h],[u0,y+h]];
      if(near)for(let k=0;k<4;k++){const a=corners[k],c=corners[(k+1)%4],hint=k===0?[0,1,0]:k===2?[0,-1,0]:k===1?[-t[0],0,-t[1]]:[t[0],0,t[1]];m.quad('stone',point(...a),point(...c),point(...c,d),point(...a,d),hint);}
      if(near) {
        m.quad('bronze',point(o.u-.035,y,d+.12),point(o.u+.035,y,d+.12),point(o.u+.035,y+h,d+.12),point(o.u-.035,y+h,d+.12),N);

      }
    }
  }
  function portal() {
    const {center,t,n,spring}=ENTRANCE,P=(u,y,d=0)=>[center[0]+t[0]*u+n[0]*d,y,center[1]+t[1]*u+n[1]*d],N=[n[0],0,n[1]];
    const prof=[[-3.6,0],[3.6,0],[3.6,spring]],seg=near?24:12;
    for(let i=1;i<=seg;i++){const a=i*Math.PI/seg;prof.push([3.6*Math.cos(a),spring+3.6*Math.sin(a)]);}
    m.polygon('glass',[[...prof,prof[0]]],(u,y)=>P(u,y,-1),N);
    for(let i=0;i<prof.length;i++){
      const a=prof[i],c=prof[(i+1)%prof.length],dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy);if(!l)continue;
      m.quad('stone',P(...a),P(...c),P(...c,-1),P(...a,-1),[t[0]*-dy/l,dx/l,t[1]*-dy/l]);
    }
    for(const u of [-3.9,3.9])localBox('stone',u,5.3,.25,.6,10.6,.5);
    for(let i=0;i<seg;i++) {
      const a=i*Math.PI/seg,c=(i+1)*Math.PI/seg;
      const mat=i%3===1?'green':'stone',inner=q=>[3.6*Math.cos(q),spring+3.6*Math.sin(q)],outer=q=>[4.25*Math.cos(q),spring+4.25*Math.sin(q)];
      m.quad(mat,P(...inner(a),.35),P(...outer(a),.35),P(...outer(c),.35),P(...inner(c),.35),N);
      // Solid carved voussoirs join the masonry and their continuous inner reveal.
      m.quad(mat,P(...outer(a)),P(...outer(c)),P(...outer(c),.35),P(...outer(a),.35),[t[0]*Math.cos((a+c)/2),Math.sin((a+c)/2),t[1]*Math.cos((a+c)/2)]);
      m.quad(mat,P(...inner(c)),P(...inner(a)),P(...inner(a),.35),P(...inner(c),.35),[-t[0]*Math.cos((a+c)/2),-Math.sin((a+c)/2),-t[1]*Math.cos((a+c)/2)]);
    }
    for(const u of [-2.8,0,2.8])localBox('bronze',u,2.25,-.6,.16,4.5,.16);
    for(const y of [.12,4.55])localBox('bronze',0,y,-.6,5.75,.2,.2);
    for(const u of [-2.8,-1.4,0,1.4,2.8])localBox('bronze',u,6.05,-.6,.1,2.8,.12);
    localBox('bronze',0,7.45,-.6,6.6,.13,.12);
    if(near)for(let i=0;i<9;i++){
      const a=i*Math.PI/8;b.bar('bronze',P(0,4.65,-.6),P(3.6*Math.cos(a),7.2+3.6*Math.sin(a),-.6),.08);
    }
    for(const u of [-4,4])for(const y of [1.4,3.4,5.4,7.4]){
      const g=[[u-.22,y],[u+.22,y],[u+.3,y+.28],[u,y+.55],[u-.3,y+.28]];m.polygon('green',[[...g,g[0]]],(x,h)=>P(x,h,.56),N);
    }
    if(near) {
    const hull=[[-.8,5.15],[.8,5.15],[.48,4.85],[-.48,4.85],[-.8,5.15]];m.polygon('stone',[hull],(u,y)=>P(u,y,-.35),N);
    localBox('stone',0,5.75,-.35,.09,1.2,.15);
    m.triangle('stone',P(-.04,6.3,-.35),P(-.04,5.3,-.35),P(-.65,5.3,-.35),N);
    }
    function localBox(mat,u,y,d,w,h,depth){b.box(mat,P(u,y,d),[w,h,depth],-Math.atan2(t[1],t[0]));}
  }
}
function normal(a,b,c) {
  const u=b.map((v,i)=>v-a[i]),v=c.map((w,i)=>w-a[i]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  if(n[1]<0)n=n.map(v=>-v);const l=Math.hypot(...n);return n.map(v=>v/l);
}
