import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { LANDING_LINES } from './vincent-thomas-bridge-landings.js';
import { CENTERLINE, MAPPED_TOWERS } from './vincent-thomas-bridge-alignment.js';
export const MAIN_SPAN = 457.2, SIDE_SPAN = 154.2288, DECK_H = 60;
export const DECK_HALF = 11.1, CABLE_D = 10.4, ROAD_HALF = 15.8496 / 2;
const raw = createBridgeProfile({ ...SPEC, width: DECK_HALF*2, roadEdges: [[-ROAD_HALF, ROAD_HALF]], centerline: CENTERLINE, profile: ({length}) => [[0,0],[length,0]] });
const mid = raw.stationAt(SPEC.origin);
export const TOWER_S = [mid-MAIN_SPAN/2,mid+MAIN_SPAN/2];
export const ANCHOR_S = [TOWER_S[0]-SIDE_SPAN,TOWER_S[1]+SIDE_SPAN];
export const MAPPED_STATIONS = MAPPED_TOWERS.map(ll=>raw.stationAt(ll));
// The last 180 m split into the connected two-lane carriageways. The
// suspension spans and the elevated viaduct cross-section remain rigid.
export const LANDING_M = 180, LANDING_HALF = 3.725;
export const landingWeight = s => { const t=Math.max(0,Math.min(1,Math.min(s,raw.BRIDGE_LENGTH-s)/LANDING_M));return t*t*(3-2*t); };
const segments=LANDING_LINES.flatMap(line=>line.slice(1).map((ll,i)=>[raw.bridgeLocal(...line[i]),raw.bridgeLocal(...ll)]));
export function landingCentres(s) {
  const q=raw.bridgePoint(s),hits=[];
  for(const [a,b] of segments){
    const u=(a.x-q.x)*q.tx+(a.z-q.z)*q.tz,v=(b.x-q.x)*q.tx+(b.z-q.z)*q.tz;
    if(u*v>0||Math.abs(v-u)<1e-6)continue;
    const t=-u/(v-u),d=-q.tz*(a.x+(b.x-a.x)*t-q.x)+q.tx*(a.z+(b.z-a.z)*t-q.z);
    if(Math.abs(d)<25)hits.push(d);
  }
  // Shared frame projected onto both connected carriageway lines.
  return [-1,1].map(side=>hits.filter(d=>d*side>0).sort((a,b)=>Math.abs(a)-Math.abs(b))[0]??side*3.9);
}
export function roadEdgesAt(s) {
  const w=landingWeight(s);if(w===1)return [[-ROAD_HALF,0],[0,ROAD_HALF]];
  const centres=landingCentres(s);
  return [-1,1].map((side,i)=>{
    const centre=centres[i]*(1-w)+side*ROAD_HALF/2*w,half=LANDING_HALF*(1-w)+ROAD_HALF/2*w;
    return [centre-half,centre+half];
  });
}
// Remap authored deck widths only inside the landing, retaining the original
// steel margins inland; those margins vanish at the road handoff.
export function authoredLateral(s,d) {
  const i=d<0?0:1,[a,b]=roadEdgesAt(s)[i],old=i?[0,ROAD_HALF]:[-ROAD_HALF,0];
  if(d<old[0])return a+(d-old[0])*landingWeight(s);
  if(d>old[1])return b+(d-old[1])*landingWeight(s);
  return a+(d-old[0])/(old[1]-old[0])*(b-a);
}
export const PROFILE = createBridgeProfile({
  ...SPEC, modelDir: 'bridges', width: DECK_HALF*2, roadEdges: [[-ROAD_HALF, 0],[0,ROAD_HALF]], roadEdgesAt, clipStandardEnds: true, lateralBankFit: { blendM: LANDING_M, terrainClamp: true, clearanceM: .12 },
  centerline: CENTERLINE, palette: PALETTES.light, buildingFootprints: FOOTPRINTS,
  profile: ({length})=>[[0,'start'],[ANCHOR_S[0],DECK_H],[ANCHOR_S[1],DECK_H],[length,'end']],
});
// Rigid steel cross-section: incomplete HD tile samples cannot squeeze it.
PROFILE.fittedLateral = (_s,d)=>d;
const half = MAIN_SPAN/2, sag=44.8;
let low=100,high=2000;
for(let i=0;i<60;i++){const a=(low+high)/2;if(a*(Math.cosh(half/a)-1)>sag)low=a;else high=a;}
const catA=(low+high)/2;
export function cableHeight(s) {
  if(s>=TOWER_S[0]&&s<=TOWER_S[1])return 66+catA*(Math.cosh((s-mid)/catA)-1);
  const west=s<TOWER_S[0],t=west?s-ANCHOR_S[0]:ANCHOR_S[1]-s,a=160,L=SIDE_SPAN;
  const x0=L/2-a*Math.asinh((110.8-14)/(2*a*Math.sinh(L/(2*a))));
  return 14+a*(Math.cosh((t-x0)/a)-Math.cosh(x0/a));
}
