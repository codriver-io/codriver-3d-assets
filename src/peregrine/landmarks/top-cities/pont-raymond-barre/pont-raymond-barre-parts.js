import { FOOTPRINTS } from './footprint.js';
export const ORIGIN = [4.82013, 45.73273];
const R = 6378137, DEG = Math.PI / 180, SCALE = Math.cos(ORIGIN[1] * DEG);
export const local = ([lon, lat]) => [R * DEG * (lon - ORIGIN[0]) * SCALE, -R * SCALE * Math.log(Math.tan(Math.PI / 4 + lat * DEG / 2) / Math.tan(Math.PI / 4 + ORIGIN[1] * DEG / 2))];
export const geographic = ([x,z]) => [ORIGIN[0] + x / (R * DEG * SCALE), (2 * Math.atan(Math.tan(Math.PI / 4 + ORIGIN[1] * DEG / 2) * Math.exp(-z / (R * SCALE))) - Math.PI / 2) / DEG];
// Straight main crossing from the dossier's T1 way 193465144. Offset 1.6 m
// downstream from that rail centre to the two-track centre. +d is downstream.
const A = local([4.8196539,45.7333602]), Z = local([4.8210749,45.7322368]);
const length = Math.hypot(Z[0]-A[0],Z[1]-A[1]);
export const AXIS = [(Z[0]-A[0])/length,(Z[1]-A[1])/length];
export const BEARING = Math.atan2(AXIS[0],-AXIS[1]) / DEG;
export const P1 = [A[0]+AXIS[0]*22-AXIS[1]*1.6,A[1]+AXIS[1]*22+AXIS[0]*1.6];
export const project = ([x,z]) => ({s:(x-P1[0])*AXIS[0]+(z-P1[1])*AXIS[1],d:-(x-P1[0])*AXIS[1]+(z-P1[1])*AXIS[0]});
export const point = (s,d,y) => [P1[0]+AXIS[0]*s-AXIS[1]*d,y,P1[1]+AXIS[1]*s+AXIS[0]*d];
export const OUTLINE = FOOTPRINTS[0].slice(0,-1).map(local).map(project);
export const S0 = Math.min(...OUTLINE.map(p=>p.s)), S1 = Math.max(...OUTLINE.map(p=>p.s));
// Track centres: actual mapped curved T1 line, shifted halfway to the other track.
const trackGeo = [[4.8191062,45.7336101],[4.8192608,45.733567],[4.8193467,45.7335423],[4.8194412,45.7335054],[4.8195166,45.7334637],[4.8195851,45.7334147],[4.8196539,45.7333602],[4.8210749,45.7322368],[4.8212554,45.7320942],[4.8212962,45.732062],[4.821419,45.7319876],[4.8215361,45.7319425],[4.821684,45.731909],[4.82226,45.73177]];
export const TRACK = trackGeo.map(local).map(project).map(p=>({...p,d:p.d+1.6}));
export function trackD(s) {
  const i = Math.max(0,Math.min(TRACK.length-2,TRACK.findIndex((p,j)=>j<TRACK.length-1 && TRACK[j+1].s>=s)));
  const a=TRACK[i], b=TRACK[i+1];
  if(s>TRACK.at(-1).s)return TRACK.at(-1).d;
  return a.d+(b.d-a.d)*(s-a.s)/(b.s-a.s);
}
export function edges(s) {
  const ds=[];
  for(let i=0;i<OUTLINE.length;i++) {
    const a=OUTLINE[i],b=OUTLINE[(i+1)%OUTLINE.length];
    if((s>=a.s&&s<=b.s)||(s>=b.s&&s<=a.s)) {if(Math.abs(b.s-a.s)>1e-8)ds.push(a.d+(b.d-a.d)*(s-a.s)/(b.s-a.s));}
  }
  return [Math.min(...ds),Math.max(...ds)];
}
// Flat-map convention, not NGF: feet y=0, main deck 7.5 m; ramps meet
// grade at both mapped landings. Full-world datum/approach fitting is separate.
export function deckY(s) {
  if(s<0)return 0.55+6.95*(s-S0)/(-S0);
  if(s<=150)return 7.5;
  return 7.5-6.95*(s-150)/(S1-150);
}
export const archRise = t => 16.25 * 4*t*(1-t);
export const archPoint = (s,side) => {const h=archRise(s/150);return point(s,side*(4.3+h*Math.tan(10*DEG)),7.5+h);};
export const archSectionHeight = t => 1.6+0.9*Math.sin(Math.PI*t);
export const ABUTMENTS = [point(S0+3,trackD(S0+3)+3,0),point(S1-3,trackD(S1-3)+3,0)];
export const padRing = p => [[-4,-4],[4,-4],[4,4],[-4,4],[-4,-4]].map(([x,z])=>geographic([p[0]+x,p[2]+z]));
