import { SPEC } from './config.js';
import { MAPPED_LINE, SCOTT_ROAD_LINE } from './skybridge-vancouver-alignment.js';
// Spherical local Mercator metres, latitude scale removed exactly once.
const R=6378137,rad=Math.PI/180,k=Math.cos(SPEC.origin[1]*rad);
const north=lat=>R*Math.log(Math.tan(Math.PI/4+lat*rad/2));
export const local=([lng,lat])=>[(lng-SPEC.origin[0])*rad*R*k,(north(SPEC.origin[1])-north(lat))*k];
export const lngLat=([x,z])=>[SPEC.origin[0]+x/(R*k*rad),(2*Math.atan(Math.exp((north(SPEC.origin[1])-z/k)/R))-Math.PI/2)/rad];
const points=[...MAPPED_LINE,...SCOTT_ROAD_LINE].map(local),ss=[0];
for(let i=1;i<points.length;i++)ss.push(ss.at(-1)+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
// The two long 340m main-span outline edges put pylons at centreline vertices 11/12.
const mid=(ss[11]+ss[12])/2;
export const LINE=points.map((p,i)=>({s:ss[i]-mid,x:p[0],z:p[1]}));
export const START=LINE[0].s,END=LINE.at(-1).s,TOWERS=[LINE[11].s,LINE[12].s];
export const MAIN_START=-308,MAIN_END=308;
export const OLD_END=LINE[MAPPED_LINE.length-1].s;
export const STATION_START=END-100;
export function point(s,d=0,y=0){
 let i=LINE.findIndex(q=>q.s>=s);i=Math.max(1,i<0?LINE.length-1:i);
 const a=LINE[i-1],b=LINE[i],t=(s-a.s)/(b.s-a.s),len=Math.hypot(b.x-a.x,b.z-a.z),tx=(b.x-a.x)/len,tz=(b.z-a.z)/len;
 return [a.x+(b.x-a.x)*t-tz*d,y,a.z+(b.z-a.z)*t+tx*d];
}
export const height=s=>s<MAIN_START?45-10*(MAIN_START-s)/(MAIN_START-START):s>MAIN_END?(s<=OLD_END?45-19*(s-MAIN_END)/(OLD_END-MAIN_END):26-14*(s-OLD_END)/(END-OLD_END)):45;
export const halfWidth=s=>s>MAIN_END?5.55-2.1*Math.min(1,(s-MAIN_END)/140):s<MAIN_START?5.55-1.3*Math.min(1,(MAIN_START-s)/100):5.55;
export const stations=[...new Set([START,END,MAIN_START,MAIN_END,...TOWERS,...LINE.map(q=>q.s),...Array.from({length:Math.ceil((END-START)/20)},(_,i)=>Math.min(END,START+i*20))])].sort((a,b)=>a-b);
