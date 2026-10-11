import {PARTS} from './chateau-de-caen-plan.js';
import {center,edges} from './chateau-de-caen-kit.js';
// Architectural retaining terrace measured from local street grade, not absolute terrain altitude.
export const BAILEY_LEVEL=8;
export function towerPlan(p){
 const c=center(p.ring),L=Math.hypot(...c),out=[c[0]/L,c[1]/L],round=[768551277,768551276].includes(p.id);
 const shift=round?2.1:2.5,scale=round?1.2:1.18,cc=[c[0]+out[0]*shift,c[1]+out[1]*shift];
 const ring=p.ring.map(q=>[cc[0]+(q[0]-c[0])*scale,cc[1]+(q[1]-c[1])*scale]);
 return {...p,ring,h:p.h+4,round,c:cc};
}
export const TOWERS=PARTS.filter(p=>p.role==='tower').map(towerPlan);
export function clipPlan(r,c,t,value,sign){
 const out=[];for(let i=0;i<r.length;i++){const a=r[i],b=r[(i+1)%r.length],u=(a[0]-c[0])*t[0]+(a[1]-c[1])*t[1]-value,v=(b[0]-c[0])*t[0]+(b[1]-c[1])*t[1]-value;if(u*sign>=0)out.push(a);if(u*v<0){const f=u/(u-v);out.push([a[0]+f*(b[0]-a[0]),a[1]+f*(b[1]-a[1])]);}}return out;
}
export function museumBlocks(p){
 if(p.id!==155643207&&p.id!==155645605)return [p];
 const c=center(p.ring),t=edges(p.ring).sort((a,b)=>b.L-a.L)[0].t,us=p.ring.map(q=>(q[0]-c[0])*t[0]+(q[1]-c[1])*t[1]),lo=Math.min(...us),hi=Math.max(...us),cuts=p.id===155643207?[lo,lo+(hi-lo)*.3,lo+(hi-lo)*.68,hi]:[lo,(lo+hi)/2,hi],heights=p.id===155643207?[5.2,7.2,5.9]:[4.5,6.2];
 return heights.map((h,i)=>({...p,h,ring:clipPlan(clipPlan(p.ring,c,t,cuts[i],1),c,t,cuts[i+1],-1)}));
}
export function offsetRing(r,d){const es=edges(r);return r.map((p,i)=>{const a=es[(i+es.length-1)%es.length].n,c=es[i%es.length].n,x=a[0]+c[0],z=a[1]+c[1],den=Math.max(.4,x*c[0]+z*c[1]);return [p[0]+x*d/den,p[1]+z*d/den];});}
