// © OpenStreetMap contributors, ODbL 1.0. Literal mapped controls from way 119016167.
import { SPEC } from './config.js';
const R=111319.49079327358, C=Math.cos(SPEC.origin[1]*Math.PI/180);
export const local=([lng,lat])=>[(lng-SPEC.origin[0])*R*C,(SPEC.origin[1]-lat)*R];
export const lngLat=([x,z])=>[SPEC.origin[0]+x/(R*C),SPEC.origin[1]-z/R];
const mapped=[[14.407146000000001, 50.08717355], [14.40731249317405, 50.087147222821486], [14.407714848902094, 50.08704676664314], [14.408128213961913, 50.086978084707], [14.408551806337993, 50.08689889460724], [14.408966443073975, 50.0868106703441], [14.409409109392433, 50.08674021057918], [14.409813528192249, 50.08667897712537], [14.410233437034872, 50.08663046777599], [14.410659572951383, 50.08658040143925], [14.411089325258828, 50.08652932811072], [14.41150663922971, 50.086480562838865], [14.411932177691046, 50.08643189969655], [14.41236846616151, 50.08637930270741], [14.412773827888216, 50.08631663181451], [14.413192917779543, 50.086247644719656], [14.413607, 50.086173], [14.41398035, 50.08613425]];
export const ALIGNMENT=mapped.map(local).map(([x,z],i,all)=>({x,z,s:all.slice(1,i+1).reduce((s,p,j)=>s+Math.hypot(p[0]-all[j][0],p[1]-all[j][1]),0)}));
export const LENGTH=ALIGNMENT.at(-1).s;
export const PIERS=ALIGNMENT.slice(1,-2).map(p=>p.s);
export const WIDTH=9.5, DECK_Y=12;
export function point(s,d=0,y=0) {
 let i=ALIGNMENT.findIndex(p=>p.s>=s);if(i<0)i=ALIGNMENT.length-1;else if(i===0)i=1;
 const a=ALIGNMENT[i-1],c=ALIGNMENT[i],l=c.s-a.s,t=(s-a.s)/l,tx=(c.x-a.x)/l,tz=(c.z-a.z)/l;
 return [a.x+(c.x-a.x)*t-tz*d,y,a.z+(c.z-a.z)*t+tx*d];
}
export const ARCHES=ALIGNMENT.slice(0,-2).map((p,i)=>{
 const a=p.s+(i===0?3:4.2),c=ALIGNMENT[i+1].s-(i===15?4.5:4.2);
 return {a,c,mid:(a+c)/2,width:c-a,spring:2.8,rise:8.05};
});
export const TOWERS={
 old:{center:local([14.413607,50.086173]),angle:-.258,along:10.9,across:13.5,wall:29,top:47},
 lesser:{center:local([14.406855,50.087310]),angle:.027,along:10,across:11,wall:27,top:43.5},
 judith:{center:local([14.406850,50.087142]),angle:0,along:9.2,across:11.1,wall:17,top:29.3},
 gate:{center:local([14.406850,50.087228]),angle:.025,along:9.7,across:6.45,wall:12}
};
export function towerPoint(t,x,y,z){const c=Math.cos(t.angle),s=Math.sin(t.angle);return [t.center[0]+x*c+z*s,y,t.center[1]-x*s+z*c];}
