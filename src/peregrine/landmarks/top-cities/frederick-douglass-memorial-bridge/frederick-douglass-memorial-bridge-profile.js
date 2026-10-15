import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, ROAD_WAYS } from './frederick-douglass-memorial-bridge-alignment.js';
const base = createBridgeProfile({ ...SPEC, centerline:CENTERLINE, width:68, roadEdges:[[-12.9,-.6],[.6,12.9]], profile:({length})=>[[0,'start'],[200,14.6],[length-200,14.6],[length,'end']] });
export const LENGTH = base.BRIDGE_LENGTH;
export const START = (LENGTH-440.6392)/2, END = LENGTH-START;
export const PIERS = [START+138.0236,END-138.0236];
export const HALF = 18.669, ROAD_HALF = 12.9;
export const ARCHES = [
  {a:START,c:PIERS[0],peak:44.196}, {a:PIERS[0],c:PIERS[1],peak:50.1396}, {a:PIERS[1],c:END,peak:44.196},
];
const clamp=t=>Math.max(0,Math.min(1,t));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
// Each ordinary-street ribbon follows the mapped one-way branch entering its oval.
// The river carriageways stay rigid, including when HD samples are incomplete.
const branches = [
  [...ROAD_WAYS[130927057],...ROAD_WAYS[910656491],...ROAD_WAYS[1122669898]],
  [...ROAD_WAYS[1128409674].slice().reverse(),...ROAD_WAYS[910656490].slice().reverse(),...ROAD_WAYS[1122670727].slice().reverse()],
].map(line=>line.map(ll=>{
  const q=base.bridgeLocal(...ll),a=base.ALIGNMENT[0],t=base.bridgePoint(0);
  // Keep stations outside the profile when interpolating curved branches: projectBridge
  // intentionally clamps for navigation, which would collapse every oval point to s=0.
  const dx=q.x-a.x,dz=q.z-a.z;
  return {s:dx*t.tx+dz*t.tz,lateral:-t.tz*dx+t.tx*dz};
}).sort((a,b)=>a.s-b.s));
function branchAt(list,s) {
  let i=1;while(i<list.length-1&&list[i].s<s)i++;
  const a=list[i-1],b=list[i],t=clamp((s-a.s)/Math.max(.001,b.s-a.s));
  return a.lateral+(b.lateral-a.lateral)*t;
}
export function roadEdgesAt(s) {
  const v=s<START?smooth((START-s)/START):s>END?smooth((s-END)/(LENGTH-END)):0;
  return branches.map((list,i)=>{
    const ideal=i?6.75:-6.75,center=ideal+(branchAt(list,s)-ideal)*v,half=6.15-1.05*v;
    return [center-half,center+half];
  }).sort((a,b)=>a[0]-b[0]);
}
export function outerAt(s,side) {
  const edges=roadEdgesAt(s),e=side<0?edges[0][0]:edges[1][1];
  if(s<START||s>END){const f=s<START?smooth(s/START):smooth((LENGTH-s)/(LENGTH-END));return e+side*(2.2+(HALF-ROAD_HALF-2.2)*f);}
  const bulb=Math.max(...PIERS.map(q=>Math.max(0,1-Math.abs(s-q)/15)));
  return side*(HALF+(25.2984-HALF)*bulb);
}
// Variable hexagonal steel ribs, sloping outward 4.6 degrees; estimated from supplied photos.
export function archAt(arch,t,side) {
  const s=arch.a+(arch.c-arch.a)*t;
  const a=arch.a===START?base.deckHeight(START)-.5:3.4;
  const c=arch.c===END?base.deckHeight(END)-.5:3.4;
  const y=a+(c-a)*t+(arch.peak-(a+c)/2)*4*t*(1-t);
  return [s,side*(15.3+.08*(y-14.6)),y];
}
export const PROFILE = createBridgeProfile({
  ...SPEC, palette:PALETTES.light, modelDir:'bridges', centerline:CENTERLINE, width:68,
  roadEdges:[[-12.9,-.6],[.6,12.9]], roadEdgesAt,
  terrainPolicy:'absolute-deck', lateralBankFit:{blendM:70,terrainClamp:true,clearanceM:.03},
  profile:({length})=>[[0,'start'],[200,14.6],[length-200,14.6],[length,'end']],
});
PROFILE.fittedLateral=(s,d)=>d;
// Navigation uses exactly the authored rigid ribbons; no widening from fragmentary HD joins.
PROFILE.roadEdges=s=>roadEdgesAt(s);
PROFILE.meshStep=2.5;
// Query the same rigid authored road ribbons that are drawn. HD lane samples may be sparse
// or include the adjacent oval branch; neither may narrow or laterally shift navigation.
PROFILE.bridgeRoadHeight=(lng,lat,heading,approaches)=>{
  const local=PROFILE.bridgeLocal(lng,lat),q=PROFILE.projectBridge(local.x,local.z);
  if(q.beyond||!roadEdgesAt(q.s).some(([a,c])=>q.lateral>=a-.6&&q.lateral<=c+.6))return null;
  if(Number.isFinite(heading)){const r=heading*Math.PI/180;if(Math.abs(Math.sin(r)*q.tx-Math.cos(r)*q.tz)<.8)return null;}
  return PROFILE.deckHeight(q.s,approaches);
};
