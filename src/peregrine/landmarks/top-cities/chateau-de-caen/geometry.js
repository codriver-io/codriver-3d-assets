// Original present-day castle exterior, geographic orientation already in the mapped vertices.
import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES,TERRAIN_OFFSET_M} from './config.js';
import {OUTER,CHEMISE,PARTS} from './chateau-de-caen-plan.js';
import {BAILEY_LEVEL,TOWERS,museumBlocks,offsetRing} from './chateau-de-caen-revisions.js';
import {kit,edges,center,simplify,inside,distance,area} from './chateau-de-caen-kit.js';
export const GATES=[{id:226316851,c:[75,-64],t:[.638,.770],w:2},{id:768543041,c:[77,136],t:[.882,-.471],w:1.65}];
function offset(r,d){const es=edges(r);return r.map((p,i)=>{const a=es[(i+es.length-1)%es.length].n,c=es[i%es.length].n,x=a[0]+c[0],z=a[1]+c[1],den=Math.max(.4,x*c[0]+z*c[1]);return [p[0]+x*d/den,p[1]+z*d/den];});}
function clip(r,c,t,value,sign){const out=[];for(let i=0;i<r.length;i++){const a=r[i],b=r[(i+1)%r.length],u=(a[0]-c[0])*t[0]+(a[1]-c[1])*t[1]-value,v=(b[0]-c[0])*t[0]+(b[1]-c[1])*t[1]-value;if(u*sign>=0)out.push(a);if(u*v<0){const f=u/(u-v);out.push([a[0]+f*(b[0]-a[0]),a[1]+f*(b[1]-a[1])]);}}return out;}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const streetPut=b.put;
 b.put=(g,mat,...args)=>{g.translate(0,BAILEY_LEVEL,0);streetPut(g,mat,...args);};
 const k=kit(b),base=kit({put:streetPut});
 const towers=TOWERS;
 const buildings=PARTS.filter(p=>['hall','modern','gate','tower'].includes(p.role));

 function scarp(input,width=2.25,batter=3.2){
  const r=simplify(input,.15),foot=offsetRing(r,batter),waist=offsetRing(r,batter*.484375),inner=offsetRing(r,-width),es=edges(r);
  for(let i=0;i<r.length;i++){
   const j=(i+1)%r.length,e=es[i],m=[(e.a[0]+e.c[0])/2,(e.a[1]+e.c[1])/2];
   if(towers.some(p=>inside(p.ring,m)))continue;
   const P=(ring,i,y)=>[ring[i][0],y,ring[i][1]];
   base.quad('course',P(foot,i,0),P(foot,j,0),P(waist,j,2.8),P(waist,i,2.8),[e.n[0],.5,e.n[1]]);
   base.quad('stone',P(waist,i,2.8),P(waist,j,2.8),P(r,j,BAILEY_LEVEL),P(r,i,BAILEY_LEVEL),[e.n[0],.3,e.n[1]]);
   base.quad('stone',P(inner,j,0),P(inner,i,0),P(inner,i,BAILEY_LEVEL),P(inner,j,BAILEY_LEVEL),[-e.n[0],0,-e.n[1]]);
   base.quad('stone',P(r,i,BAILEY_LEVEL),P(r,j,BAILEY_LEVEL),P(inner,j,BAILEY_LEVEL),P(inner,i,BAILEY_LEVEL),[0,1,0]);
   base.quad('stone',P(foot,i,0),P(inner,i,0),P(inner,i,BAILEY_LEVEL),P(r,i,BAILEY_LEVEL),[-e.t[0],0,-e.t[1]]);
   base.quad('stone',P(foot,j,0),P(r,j,BAILEY_LEVEL),P(inner,j,BAILEY_LEVEL),P(inner,j,0),[e.t[0],0,e.t[1]]);
   if(near&&e.L>3)for(let y=.65;y<2.5;y+=.75){const f=y/2.8,d=batter+(batter*.484375-batter)*f;const ep={...e,a:[e.a[0]+e.n[0]*d,e.a[1]+e.n[1]*d]};base.panel('stone',ep,e.L/2,y,e.L,.07,.17);}
  }
 }
 // A separate coloured ground surface is not a provider-building replacement footprint.
 base.cap(offsetRing(simplify(OUTER,.2),-2.7),BAILEY_LEVEL-.08,'bailey');
 const path=[[65,117],[0,50],[50,-35],[75,-64]];
 const tangents=path.slice(0,-1).map((a,i)=>{const c=path[i+1],L=Math.hypot(c[0]-a[0],c[1]-a[1]);return [(c[0]-a[0])/L,(c[1]-a[1])/L];});
 const margins=path.map((p,i)=>{const a=tangents[Math.max(0,i-1)],c=tangents[Math.min(i,tangents.length-1)],x=a[1]+c[1],z=-a[0]-c[0],den=Math.max(.5,x*c[1]-z*c[0]);return [x*2.5/den,z*2.5/den];});
 const pathRing=path.map((p,i)=>[p[0]+margins[i][0],p[1]+margins[i][1]]).concat(path.map((p,i)=>[p[0]-margins[i][0],p[1]-margins[i][1]]).reverse());
 base.prism(pathRing,BAILEY_LEVEL-.08,BAILEY_LEVEL-.005,'gravel');
 for(const [a,end]of [[[-75,75],[0,50]],[[-100,-15],[50,-35]]]){const full=Math.hypot(end[0]-a[0],end[1]-a[1]),t=[(end[0]-a[0])/full,(end[1]-a[1])/full],c=[end[0]-t[0]*4,end[1]-t[1]*4],n=[t[1]*2.5,-t[0]*2.5];const r=[[a[0]+n[0],a[1]+n[1]],[c[0]+n[0],c[1]+n[1]],[c[0]-n[0],c[1]-n[1]],[a[0]-n[0],a[1]-n[1]]];base.prism(r,BAILEY_LEVEL-.08,BAILEY_LEVEL-.005,'gravel');}

 function masonry(e,lo,hi){
  if(!near||e.L<1)return;
  for(let y=lo+.75;y+.72<hi;y+=.8){
   k.panel('course',e,e.L/2,y,e.L,.045,.16);
   const pitch=2.1,row=Math.round(y/.8);
   for(let u=1+(row%2)*1.05;u<e.L-.2;u+=pitch)k.panel('course',e,u,y+.08,.035,.64,.16);
  }
 }
 function hollow(input,h,width,opts={}){
  const r=simplify(input,near?.08:.24),inner=offset(r,-width),foot=offset(r,.55);const es=edges(r);
  for(let i=0;i<r.length;i++){
   const j=(i+1)%r.length,e=es[i],m=[(e.a[0]+e.c[0])/2,(e.a[1]+e.c[1])/2];
   if(opts.skip?.(m,e))continue;
   const P=(r,i,y)=>[r[i][0],y,r[i][1]],low=h*.35;
   k.quad('stone',P(foot,i,0),P(foot,j,0),P(r,j,low),P(r,i,low),[e.n[0],.2,e.n[1]]);
   k.quad('stone',P(r,i,low),P(r,j,low),P(r,j,h-.28),P(r,i,h-.28),[e.n[0],0,e.n[1]]);
   k.quad('stone',P(inner,j,0),P(inner,i,0),P(inner,i,h-.28),P(inner,j,h-.28),[-e.n[0],0,-e.n[1]]);
   k.quad('trim',P(r,i,h-.28),P(r,j,h-.28),P(r,j,h),P(r,i,h),[e.n[0],0,e.n[1]]);
   k.quad('trim',P(inner,j,h-.28),P(inner,i,h-.28),P(inner,i,h),P(inner,j,h),[-e.n[0],0,-e.n[1]]);
   k.quad('trim',P(r,i,h),P(r,j,h),P(inner,j,h),P(inner,i,h),[0,1,0]);
   // Closure ends are important wherever a tower or portal interrupts the enceinte.
   k.quad('stone',P(r,i,0),P(r,i,h),P(inner,i,h),P(inner,i,0),[-e.t[0],0,-e.t[1]]);
   k.quad('stone',P(r,j,0),P(inner,j,0),P(inner,j,h),P(r,j,h),[e.t[0],0,e.t[1]]);
   masonry(e,low,h-.4);
   if(near&&e.L>7&&h>4){
    for(let u=3;u<e.L-1;u+=7){k.panel('glass',e,u,h-2.2,.22,1.05,.22);k.panel('trim',e,u-.2,h-2.3,.11,1.25,.25);}
    // Thin modern safety rail on the inside walk, instead of invented continuous crenellation.
    b.bar('iron',P(inner,i,h+.95),P(inner,j,h+.95),.055);
    for(let u=0;u<=e.L;u+=3.5){const f=u/e.L,x=inner[i][0]*(1-f)+inner[j][0]*f,z=inner[i][1]*(1-f)+inner[j][1]*f;b.bar('iron',[x,h,z],[x,h+.95,z],.055);}
   }
  }
 }
 scarp(OUTER);
 hollow(OUTER,10,2.25,{skip:m=>GATES.some(g=>distance(PARTS.find(p=>p.id===g.id).ring,m)<1.5)||towers.some(p=>inside(p.ring,m)||distance(p.ring,m)<.8)||distance(CHEMISE,m)<1.1});
 hollow(CHEMISE,10.6,2.4);
 // Exposed scarp margins make the dry fossé a real open strip; no baked terrain or water plane.
 const moat=[[ -67,-109],[-52,-65],[0,-81],[-10,-127]];
 for(let i=0;i<3;i++){const a=moat[i],c=moat[i+1],L=Math.hypot(c[0]-a[0],c[1]-a[1]),t=[(c[0]-a[0])/L,(c[1]-a[1])/L],n=[t[1],-t[0]],r=[a,c,[c[0]+n[0]*1.2,c[1]+n[1]*1.2],[a[0]+n[0]*1.2,a[1]+n[1]*1.2]];k.prism(r,0,1.8,'course');}
 // Keep is a low ruin, with an open centre and surviving internal cross wall.
 const t=[.946,-.325],n=[.325,.946],at=(u,v)=>[-32+u*t[0]+v*n[0],-97+u*t[1]+v*n[1]];
 const ruin=[at(-12,-13),at(12,-13),at(12,13),at(-12,13)];hollow(ruin,1.3,3.2);
 const rr=[at(-1.3,-10),at(1.3,-10),at(1.3,10),at(-1.3,10)];k.prism(rr,0,.9,'stone');
 if(near)for(const e of edges(ruin))for(let u=3;u<e.L-2;u+=6){const c=[e.a[0]+e.t[0]*u,e.a[1]+e.t[1]*u];b.box('stone',[c[0],.95,c[1]],[2.4,1.9,4.5],-Math.atan2(e.t[1],e.t[0]));}
 function roof(r,eave,rise){
  const long=edges(r).sort((a,c)=>c.L-a.L)[0],t=long.t,n=[-t[1],t[0]],uv=r.map(p=>[p[0]*t[0]+p[1]*t[1],p[0]*n[0]+p[1]*n[1]]),vm=(Math.min(...uv.map(p=>p[1]))+Math.max(...uv.map(p=>p[1])))/2,hw=(Math.max(...uv.map(p=>p[1]))-Math.min(...uv.map(p=>p[1])))/2;
  const at=p=>[p[0]*t[0]+p[1]*n[0],eave+rise*(1-Math.abs(p[1]-vm)/hw),p[0]*t[1]+p[1]*n[1]];
  for(const face of THREE.ShapeUtils.triangulateShape(uv.map(p=>new THREE.Vector2(...p)),[]))for(const s of [-1,1]){let out=[];const poly=face.map(i=>uv[i]);for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],ai=s*(a[1]-vm)>=0,ci=s*(c[1]-vm)>=0;if(ai)out.push(a);if(ai!==ci){const f=(vm-a[1])/(c[1]-a[1]);out.push([a[0]+f*(c[0]-a[0]),vm]);}}for(let i=1;i<out.length-1;i++)k.tri('slate',at(out[0]),at(out[i]),at(out[i+1]),[0,1,0]);}
  for(const e of edges(r)){const a=[e.a[0]*t[0]+e.a[1]*t[1],e.a[0]*n[0]+e.a[1]*n[1]],c=[e.c[0]*t[0]+e.c[1]*t[1],e.c[0]*n[0]+e.c[1]*n[1]];let seg=[[a,c]];if((a[1]-vm)*(c[1]-vm)<0){const f=(vm-a[1])/(c[1]-a[1]),m=[a[0]+f*(c[0]-a[0]),vm];seg=[[a,m],[m,c]];}for(const [a,c]of seg)k.quad('stone',[at(a)[0],eave,at(a)[2]],[at(c)[0],eave,at(c)[2]],at(c),at(a),[e.n[0],0,e.n[1]]);}
 }
 function gate(p){
  const g=GATES.find(g=>g.id===p.id),r=simplify(p.ring,.1),c=g.c,t=g.t,n=[-t[1],t[0]],w=g.w,spring=3.6,H=p.h;
  for(const s of [-1,1])k.prism(clip(r,c,t,s*w,s),0,H,'stone');
  const mid=clip(clip(r,c,t,-w,1),c,t,w,-1);k.prism(mid,spring+w,H,'stone');
  const ds=r.map(p=>(p[0]-c[0])*n[0]+(p[1]-c[1])*n[1]),d0=Math.min(...ds),d1=Math.max(...ds),P=(u,d,y)=>[c[0]+u*t[0]+d*n[0],y,c[1]+u*t[1]+d*n[1]],steps=near?12:6;
  for(let i=0;i<steps;i++){const a=Math.PI-i*Math.PI/steps,z=Math.PI-(i+1)*Math.PI/steps,ua=w*Math.cos(a),ub=w*Math.cos(z),ya=spring+w*Math.sin(a),yb=spring+w*Math.sin(z);for(const d of [d0,d1])k.quad('stone',P(ua,d,ya),P(ub,d,yb),P(ub,d,spring+w+.01),P(ua,d,spring+w+.01),[n[0]*Math.sign(d),0,n[1]*Math.sign(d)]);k.quad('stone',P(ua,d0,ya),P(ua,d1,ya),P(ub,d1,yb),P(ub,d0,yb),[0,-1,0]);}
  for(const e of edges(r)){masonry(e,0,H);if(near&&e.L>2){k.panel('glass',e,e.L/2,H-3,.32,1.1,.12);}}
  if(p.id===226316851){
   // Machicolation corbels and small surviving battlements read on the east approach.
   for(const e of edges(r))if(e.L>2){const count=Math.ceil(e.L/1.8);for(let i=0;i<count;i++){const u=(i+.5)*e.L/count;const x=e.a[0]+u*e.t[0],z=e.a[1]+u*e.t[1];b.box('stone',[x,H+.55,z],[.85,1.1,.6],-Math.atan2(e.t[1],e.t[0]));if(near)b.box('trim',[x+e.n[0]*.15,H-1.2,z+e.n[1]*.15],[.38,.7,.65],-Math.atan2(e.t[1],e.t[0]));}}
  }
 }
 for(const original of PARTS){const p=original.role==='tower'?towers.find(p=>p.id===original.id):original;const r=simplify(p.ring,near?.1:.22);
  if(p.role==='gate'){gate(p);continue;}
  if(p.role==='barbican'){
   // Three lobed turrets remain open courts, with entrance gaps rather than a solid slab.
   scarp(r,1.35,1.2);base.cap(offsetRing(r,-1.5),BAILEY_LEVEL-.08,'gravel');
   hollow(r,p.h,1.35,{skip:(m,e)=>p.id===92032457?m[1]>166&&m[0]<87:e.L>5&&m[0]>105&&m[1]<-83});continue;
  }
  if(p.role==='tower'){
   base.prism(offsetRing(r,.6),0,BAILEY_LEVEL,'course',()=>true,'stone');
   k.prism(r,0,p.h-.3,'stone');k.prism(r,p.h-.3,p.h,'trim');
   for(const e of edges(r)){masonry(e,0,p.h-.35);if(near)k.panel('glass',e,e.L/2,p.h-3,.22,1.2,.12);}
   if(p.round){for(const e of edges(r)){if(e.L<.5)continue;const u=e.L/2;b.box('stone',[e.a[0]+e.t[0]*u-e.n[0]*.25,p.h+.45,e.a[1]+e.t[1]*u-e.n[1]*.25],[Math.min(1.1,e.L*.65),.9,.6],-Math.atan2(e.t[1],e.t[0]));}}
   continue;
  }
  if(p.role==='modern'){
   for(const block of museumBlocks(p)){const rr=simplify(block.ring,.1);if(rr.length<3)continue;k.prism(rr,0,block.h,'modern',()=>true,'slate');
    for(const e of edges(rr))if(e.L>6){k.panel('glass',e,e.L/2,block.h-1.9,e.L-1.5,1.1,.12);if(near)for(let u=2;u<e.L-1;u+=3.2)k.panel('modern',e,u,block.h-1.95,.16,1.25,.2);}
   }continue;
  }
  const isModern=p.role==='modern',rise=p.roof==='gabled'?3.4:0,eave=p.h-rise;
  // Keep linked museum outlines, reserve slabs and halls at their mapped location.
  k.prism(r,0,eave,isModern?'modern':'stone',e=>!buildings.some(q=>q!==p&&q.h>=eave&&inside(q.ring,[(e.a[0]+e.c[0])/2+e.n[0]*.1,(e.a[1]+e.c[1])/2+e.n[1]*.1])));
  if(rise)roof(r,eave,rise);
  for(const e of edges(r)){
   if(e.L<2.5)continue;
   if(isModern){if(e.L>10)k.panel('glass',e,e.L/2,eave-1.6,e.L-2,.95,.12);continue;}
   if(p.h<2)continue;
   const pitch=p.id===1344377751?5:3.8;for(let u=pitch/2;u<e.L-1;u+=near?pitch:pitch*2){for(let y=2;y<eave-1.2;y+=3.3){k.panel('glass',e,u,y,p.id===155641653?.65:.8,1.45,.12);if(near){k.panel('trim',e,u,y-.17,1.08,.17,.18);k.panel('trim',e,u-.48,y,.12,1.6,.18);k.panel('trim',e,u+.48,y,.12,1.6,.18);}}}
   if(near&&e.L>4){k.panel('trim',e,e.L/2,eave-.3,e.L,.22,.18);masonry(e,0,eave-.5);}
  }
 }
 k.flush();base.flush();const root=b.finish();
 // Runtime restores original vertices when Cityscape is enabled. One uniform
 // offset keeps the scarp, walls, towers, halls and ground rigid in world mode.
 root.traverse(o=>{if(o.isMesh)o.userData.terrainOffsets=[[0,o.geometry.attributes.position.count,TERRAIN_OFFSET_M]];});
 return root;
}
