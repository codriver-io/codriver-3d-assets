// Averaged OSM light-rail ways 75517167 / 255019640, dossier 2026-10-13.
// Local metric east/up/south; latitude scale is applied once here.
import { SPEC } from './config.js';
export const CONTROL = [[35.1995325, 31.78786195], [35.19963955, 31.7883667], [35.1996721, 31.78850505], [35.1996937, 31.788564700000002], [35.1997228, 31.7886311], [35.199776549999996, 31.788734050000002], [35.1998268, 31.7888046], [35.19986435, 31.7888545], [35.19994095, 31.7889302], [35.200015500000006, 31.78898855], [35.2000929, 31.789031], [35.200176799999994, 31.789067850000002], [35.2002927, 31.78910535], [35.200382000000005, 31.78912435], [35.2004828, 31.78913525], [35.2005939, 31.78913525], [35.20068295, 31.7891258], [35.20076095, 31.7891116], [35.200860899999995, 31.78908325], [35.20096505, 31.789044699999998], [35.20133215, 31.7888886]];
const R=6378137, rad=Math.PI/180;
export const local=([lng,lat])=>[(lng-SPEC.origin[0])*rad*R*Math.cos(SPEC.origin[1]*rad),(SPEC.origin[1]-lat)*rad*R];
export const lngLat=([x,z])=>[SPEC.origin[0]+x/(rad*R*Math.cos(SPEC.origin[1]*rad)),SPEC.origin[1]-z/(rad*R)];
const mapped=CONTROL.map(local);
const mappedLength=mapped.slice(1).reduce((s,q,i)=>s+Math.hypot(q[0]-mapped[i][0],q[1]-mapped[i][1]),0);
export const SOUTH_RAMP=55, EAST_RAMP=360-mappedLength-SOUTH_RAMP;
function extend(q,c,len){const dx=q[0]-c[0],dz=q[1]-c[1],k=len/Math.hypot(dx,dz);return [q[0]+dx*k,q[1]+dz*k];}
const points=[extend(mapped[0],mapped[1],SOUTH_RAMP),...mapped,extend(mapped.at(-1),mapped.at(-2),EAST_RAMP)];
export const ALIGNMENT=points.map((q,i)=>({x:q[0],z:q[1],s:points.slice(1,i+1).reduce((s,v,k)=>s+Math.hypot(v[0]-points[k][0],v[1]-points[k][1]),0)}));
export const LENGTH=ALIGNMENT.at(-1).s;
export const DECK_H=7;
export function heightAt(s){if(s<SOUTH_RAMP)return .3+6.7*s/SOUTH_RAMP;if(s>LENGTH-EAST_RAMP)return .3+6.7*(LENGTH-s)/EAST_RAMP;return DECK_H;}
export function pointAt(s,d=0,y=heightAt(s)){
 const i=Math.max(1,ALIGNMENT.findIndex(v=>v.s>=Math.min(s,LENGTH-.00001))),a=ALIGNMENT[i-1],b=ALIGNMENT[i];
 const f=(s-a.s)/(b.s-a.s),dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz);
 return [a.x+dx*f-dz/l*d,y,a.z+dz*f+dx/l*d];
}
export const MAST_STATION=165;
const base=pointAt(MAST_STATION,6.0,0);
export function mastAt(y){const t=y/118;return [base[0]-26*t, y, base[2]-28*t];}
export const stations=(step)=>[...new Set([0,LENGTH,...ALIGNMENT.map(v=>v.s),...Array.from({length:Math.floor(LENGTH/step)},(_,i)=>(i+1)*step)])].sort((a,b)=>a-b);
