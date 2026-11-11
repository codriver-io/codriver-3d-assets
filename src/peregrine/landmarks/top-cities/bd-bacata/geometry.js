import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './bd-bacata-parts.js';
export const SOUTH_STEPS=[{z:14.52,h:54,glaze:13},{z:1.08,h:81,glaze:15},{z:-5.67,h:108,glaze:24},{z:-12.03,h:135,glaze:32},{z:-18.34,h:162,glaze:41},{z:-24.78,h:189,glaze:50},{z:-30.88,h:207,glaze:59}];
export const LINK_LEVELS=[45,80];
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,poly,bar}=k;
 k.shell('stone',LOCAL_RINGS,0,13,[.65,4.8,8.9],near?4:6);
 const rects=[];
 for(let i=0;i<SOUTH_STEPS.length;i++){
  const t=SOUTH_STEPS[i];rects.push({x0:10.45,x1:24.05,z0:i===6?-36.51:SOUTH_STEPS[i+1].z,z1:t.z,h:t.h,glaze:t.glaze,south:true});
 }
 rects.push({x0:-33.6,x1:-11,z0:-24.7,z1:-11.85,h:167,glaze:13},
  {x0:-11,x1:-.75,z0:-32.2,z1:-11.85,h:150.4,glaze:13},
  {x0:-33.6,x1:-25.45,z0:-11.85,z1:-3.65,h:120,glaze:13},
  {x0:-33.6,x1:-25.45,z0:-3.65,z1:4.5,h:100,glaze:13},
  {x0:-25.45,x1:-10.85,z0:-11.85,z1:4.5,h:100,glaze:13},
  {x0:-33.6,x1:-25.45,z0:4.5,z1:12.7,h:80,glaze:13},
  {x0:-25.45,x1:-10.85,z0:4.5,z1:20.9,h:60,glaze:13},
  {x0:-33.6,x1:-25.45,z0:12.7,z1:20.9,h:60,glaze:13});
 rects.unshift({x0:10.45,x1:24.05,z0:-36.51,z1:-34.5,h:207,glaze:Infinity,south:true});
 const xs=[...new Set(rects.flatMap(r=>[r.x0,r.x1]))].sort((a,b)=>a-b),zs=[...new Set(rects.flatMap(r=>[r.z0,r.z1]))].sort((a,b)=>a-b);
 const cells=xs.slice(0,-1).map((x,i)=>zs.slice(0,-1).map((z,j)=>rects.filter(r=>(x+xs[i+1])/2>r.x0&&(x+xs[i+1])/2<r.x1&&(z+zs[j+1])/2>r.z0&&(z+zs[j+1])/2<r.z1).sort((a,b)=>b.h-a.h)[0]));
 const facades=[];
 const facade=(...v)=>facades.push(v);
 function emitFacade(w,x,z,a,y0,h,t,plain=false){
  const step=near?3.2:6.4,bands=t.south?[]:[[92.8,94.8],[153.2,155.2]],cuts=[y0,h,...bands.flat().filter(y=>y>y0&&y<h)].sort((a,b)=>a-b);
  for(let i=0;i<cuts.length-1;i++){
   const lo=cuts[i],hi=cuts[i+1],dark=bands.some(([a,b])=>(lo+hi)/2>a&&(lo+hi)/2<b),holes=[];
   if(!plain&&!dark&&w>1.1)for(let y=Math.ceil(Math.max(lo,t.glaze)/step)*step+.2;y+step-.45<hi-.3;y+=step)holes.push({u:0,y,w:w-.65,h:step-.45,mat:'glass'});
   wall(dark?'shadow':'stone',w,lo,hi,.65,x,z,a,holes);
   // Original integral facade muntin strips, not detached structural members or image textures.
   if(near&&!plain&&!dark&&w>3){const count=Math.floor(w/2.4),yy=Math.max(lo,t.glaze);if(yy<hi-.5)for(let j=1;j<count;j++){const u=-w/2+j*w/count,point=(xx,y)=>[x+xx*Math.cos(a)+.65*Math.sin(a),y,z-xx*Math.sin(a)+.65*Math.cos(a)];poly('stone',[point(u-.045,yy),point(u+.045,yy),point(u+.045,hi),point(u-.045,hi)],[0,1,2,0,2,3]);}}

  }
 }
 for(let i=0;i<xs.length-1;i++)for(let j=0;j<zs.length-1;j++){
  const t=cells[i][j];if(!t)continue;const x0=xs[i],x1=xs[i+1],z0=zs[j],z1=zs[j+1],h=t.h;
  poly('stone',[[x0,h,z0],[x0,h,z1],[x1,h,z1],[x1,h,z0]],[0,1,2,0,2,3]);
  const ns=[cells[i]?.[j-1],cells[i]?.[j+1],cells[i-1]?.[j],cells[i+1]?.[j]],ys=ns.map(n=>Math.max(13,n?.h||13));
  if(ys[0]<h)facade(x1-x0,(x0+x1)/2,z0+.65,Math.PI,ys[0],h,t,t.south&&z0<-36);
  if(ys[1]<h)facade(x1-x0,(x0+x1)/2,z1-.65,0,ys[1],h,t);
  if(ys[2]<h)facade(z1-z0,x0+.65,(z0+z1)/2,-Math.PI/2,ys[2],h,t);
  if(ys[3]<h)facade(z1-z0,x1-.65,(z0+z1)/2,Math.PI/2,ys[3],h,t);
 }
 // Coalesce coplanar exposed cell faces before adding windows; the grid never multiplies their rhythm.
 const groups=new Map();for(const f of facades){const [w,x,z,a,y0,h,t,plain]=f,side=Math.abs(Math.sin(a))>.5,plane=side?x:z,mid=side?z:x,key=[a,plane,y0,h,t.glaze,t.south,plain].join('|');if(!groups.has(key))groups.set(key,[]);groups.get(key).push({lo:mid-w/2,hi:mid+w/2,f,side});}
 for(const rows of groups.values()){rows.sort((a,b)=>a.lo-b.lo);let r=rows[0];const emit=r=>{const f=r.f.slice();f[0]=r.hi-r.lo;f[r.side?2:1]=(r.hi+r.lo)/2;emitFacade(...f);};for(const q of rows.slice(1)){if(Math.abs(q.lo-r.hi)<.0001)r.hi=q.hi;else{emit(r);r=q;}}emit(r);}
 // Pale rear concrete spine and the real open concrete crown above the south glass cascade.

 k.block('stone',17.25,-33.695,13.6,5.63,207,216,{south:[{u:0,y:208,w:11.2,h:5.9}],north:[{u:0,y:208,w:11.2,h:5.9}]});
 // Main floor bearings of the two high pedestrian links. Their plan is separate from the link member.
 for(const y of LINK_LEVELS){
  box('stone',-5.875,y+.05,-22.0,10.25,.3,20.3);
  box('stone',17.25,y+.05,-24.25,13.6,.3,24.5);
  const x0=-1.1,x1=10.8,z0=-24.4,z1=-13.0;
  box('stone',(x0+x1)/2,y+.05,(z0+z1)/2,x1-x0,.3,z1-z0);
  box('stone',(x0+x1)/2,y+3.1,(z0+z1)/2,x1-x0,.3,z1-z0);
  for(const [zz,a]of [[z1,0],[z0,Math.PI]])wall('stone',x1-x0,y+.2,y+3,.3,(x0+x1)/2,zz-(a===0?.3:-.3),a,[{u:0,y:y+.25,w:x1-x0-.8,h:2.65,mat:'glass'}]);
 }
 return k.finish();
}
