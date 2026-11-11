import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './prime-tower-zurich-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const heights=[28,35,91,56],core=LOCAL_RINGS[1],parts=LOCAL_RINGS.slice(2);
 const close=(a,c)=>Math.hypot(a[0]-c[0],a[1]-c[1])<.03;
 const attached=(r,i)=>core.findIndex((a,j)=>{const c=core[(j+1)%core.length],u=r[i],v=r[(i+1)%r.length];return close(a,v)&&close(c,u)||close(a,u)&&close(c,v);});
 function facade(r,i,lo,hi){const f=frame(r,i),rr=rows(lo+.4,hi-.1,near?3.5:7,near?3.1:6.3),n=Math.max(1,Math.round(f.l/(near?1.6:3.2))),step=f.l/n;let base=lo;for(const [a,c]of rr){patch('frame',f,0,f.l,base,a);for(let j=0;j<n;j++){const u=j*step,v=(j+1)*step,pad=step*.03;patch('frame',f,u,u+pad,a,c);patch('glass',f,u+pad,v-pad,a,c);patch('frame',f,v-pad,v,a,c);}base=c;}patch('frame',f,0,f.l,base,hi);}
 core.forEach((_,i)=>{let top=126;parts.forEach((r,k)=>{if(r.some((_,j)=>attached(r,j)===i))top=Math.min(top,heights[k]);});facade(core,i,0,top);});cap('roof',core,126);cap('frame',core,0,-1);
 parts.forEach((r,k)=>{r.forEach((_,i)=>{if(attached(r,i)<0)facade(r,i,heights[k],126);});cap('roof',r,126);cap('frame',r,heights[k],-1);});

return finish();
}
