import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './pyramid-cestius-parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),near=detail!=='far';let ring=LOCAL_RINGS[0].slice(0,-1);
 const quad=(m,a,b,c,d)=>{
  const pts=[a,b,c,d],ix=[];
  for(const t of [[0,1,2],[0,2,3]]){const [p,q,r]=t.map(i=>pts[i]);const u=q.map((v,i)=>v-p[i]),v=r.map((v,i)=>v-p[i]);if(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-9)ix.push(...t);}
  if(ix.length)k.poly(m,pts,ix);
 };
 const area=ring.reduce((s,p,i)=>{const q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1];},0);if(area>0)ring.reverse();
 k.prism('stone',ring,0,.2);
 const H=36.4,base=.2,N=near?44:22;
 for(let face=0;face<ring.length;face++){
  const a=ring[face],b=ring[(face+1)%ring.length];
  const p=(u,t)=>[(a[0]+(b[0]-a[0])*u)*(1-t),base+(H-base)*t,(a[1]+(b[1]-a[1])*u)*(1-t)];
  for(let row=0;row<N;row++){
   const t0=row/N,t1=(row+1)/N,seam=near?.00085:.0015,top=Math.min(t1,t0+seam);
   if(row)quad('joint',p(0,t0),p(1,t0),p(1,top),p(0,top));
   const from=row?top:t0,n=Math.max(1,Math.floor((1-(t0+t1)/2)*Math.hypot(b[0]-a[0],b[1]-a[1])/(near?3.2:6.4)));
   for(let col=0;col<n;col++){
    const u0=col/n,u1=(col+1)/n,edge=near?.0012:.002;
    quad('stone',p(u0,from),p(Math.max(u0,u1-edge),from),p(Math.max(u0,u1-edge),t1),p(u0,t1));
    quad('joint',p(Math.max(u0,u1-edge),from),p(u1,from),p(u1,t1),p(Math.max(u0,u1-edge),t1));
   }
  }
 }
 const model=k.finish();model.userData.features=['steep four-sided marble pyramid','single apex','partitioned marble courses'];return model;
}
