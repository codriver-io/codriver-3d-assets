import { SPEC } from './config.js';
export const local = ([lng,lat]) => [(lng-SPEC.origin[0])*111319.49079327358*Math.cos(SPEC.origin[1]*Math.PI/180), -(lat-SPEC.origin[1])*111319.49079327358];
// Locations surveyed from the mapped outlines; y dimensions below are photographic estimates.
export const MILLS = [
 {name:'De Huisman', way:285321223, anchor:[4.816612,52.473257], sides:8, stage:5.0, hub:12.2, radius:6.6, baseR:2.5, topR:1.45, body:'thatch', angle:-1.047, phase:0.08},
 {name:'De Gekroonde Poelenburg', way:285317878, anchor:[4.817609,52.474213], sides:4, stage:3.3, hub:12.4, radius:10.3, baseR:3.7, topR:2.1, body:'green', angle:-1.047, phase:0.05, paltrok:true},
 {name:'De Kat', way:285317879, anchor:[4.817837,52.475003], sides:8, stage:7.2, hub:19.8, radius:11.7, baseR:4.15, topR:2.25, body:'thatch', angle:-1.047, phase:0.68},
 {name:'De Zoeker', way:837624418, anchor:[4.817557,52.476009], sides:8, stage:6.8, hub:18.4, radius:11.2, baseR:4.25, topR:2.2, body:'thatch', angle:-1.047, phase:0.20},
 {name:'Het Jonge Schaap', way:285317884, anchor:[4.816548,52.476169], sides:6, stage:6.5, hub:19.0, radius:11.5, baseR:4.35, topR:2.3, body:'thatch', angle:-1.047, phase:0.62},
];
export function point(m,u,y,v) {const [x,z]=local(m.anchor),c=Math.cos(m.angle),s=Math.sin(m.angle);return [x+u*c+v*s,y,z-u*s+v*c];}
// Explicit contacts of load-bearing gallery braces and tail poles, for focused regression tests.
export function members(m) {
 const a=[];
 if(!m.paltrok)for(let i=0;i<m.sides;i++){const t=(i+0.5)*2*Math.PI/m.sides,r=m.baseR+1.7;
 a.push({name:'gallery brace',a:point(m,Math.sin(t)*(m.baseR-0.15),m.stage-2.2,Math.cos(t)*(m.baseR-0.15)),b:point(m,Math.sin(t)*r,m.stage-0.12,Math.cos(t)*r),supportA:'tower',supportB:'gallery'});}
 if(!m.paltrok)for(const sign of [-1,1])a.push({name:'tail pole',a:point(m,sign*3.2,m.hub-1.2,-0.8),b:point(m,0,m.stage+0.3,-m.baseR-1.2),supportA:'cap crossbeam',supportB:'tail foot'});
 return a;
}
