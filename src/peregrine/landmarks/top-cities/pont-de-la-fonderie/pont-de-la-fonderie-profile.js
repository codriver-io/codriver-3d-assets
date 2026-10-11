import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { ALIGNMENT_DATA as A } from './pont-de-la-fonderie-alignment.js';

const frame = createBridgeProfile({ origin: SPEC.origin, width: 10, roadEdges: [[-3, 3]], centerline: A.road, profile: ({length}) => [[0,0],[length,0]] });
function head(line, distance) {
  const out=[line[0]]; let used=0;
  for(let i=1;i<line.length;i++) {
    const a=frame.bridgeLocal(...line[i-1]),b=frame.bridgeLocal(...line[i]),len=Math.hypot(a.x-b.x,a.z-b.z);
    if(used+len>=distance){const t=(distance-used)/len;out.push(line[i-1].map((v,k)=>v+(line[i][k]-v)*t));return out;}
    used+=len;out.push(line[i]);
  }
  throw new Error('Mapped approach too short');
}
export const STRUCTURE_START = 22;
export const STRUCTURE_LENGTH = frame.BRIDGE_LENGTH;
export const STRUCTURE_END = STRUCTURE_START+STRUCTURE_LENGTH;
export const DECK_H = 1.55;
// The mapped bridge rectangle is skewed 0.5 m relative to its roadway, not rotated off-axis.
export const deckEdges = s => { const t=Math.max(0,Math.min(1,(s-STRUCTURE_START)/STRUCTURE_LENGTH));return [-5.12+.50*t,4.73+.50*t]; };
export const PIVOT_S = STRUCTURE_START+5.0; // photographic bank-side estimate, not a surveyed pier station
const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, width: 10.7, palette: PALETTES.light,
  centerline: [...head([...A.northwest].reverse(),22).slice(1).reverse(),...A.road,...head(A.southeast,22).slice(1)],
  roadEdges: [[-3,3]], terrainPolicy: 'bank-fit', buildingFootprints: [], clipStandardEnds: true,
  profile: ({length}) => [[0,'start'],[STRUCTURE_START,DECK_H],[STRUCTURE_END,DECK_H],[length,'end']],
});
// A constant tangent grade between one-metre parabolic vertical curves.
// Same endpoint datums as the shared profile, without its 1.5× smoothstep grade peak.
const CURVE_M=1;
function rampFraction(u,length) {
  u=Math.max(0,Math.min(length,u));const slope=1/(length-CURVE_M);
  if(u<CURVE_M)return slope*u*u/(2*CURVE_M);
  if(u>length-CURVE_M)return 1-slope*(length-u)**2/(2*CURVE_M);
  return slope*(u-CURVE_M/2);
}
function deckHeight(s,approaches=[0,0]) {
  if(s<STRUCTURE_START)return approaches[0]+(DECK_H-approaches[0])*rampFraction(s,STRUCTURE_START);
  if(s>STRUCTURE_END)return approaches[1]+(DECK_H-approaches[1])*rampFraction(base.BRIDGE_LENGTH-s,base.BRIDGE_LENGTH-STRUCTURE_END);
  return DECK_H;
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
function bridgeRoadHeight(lng,lat,heading,approaches,joins,sections) {
  // Preserve the shared corridor, heading and live-width acceptance exactly.
  if(base.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;
  const q=base.bridgeLocal(lng,lat);return deckHeight(base.projectBridge(q.x,q.z).s,approaches);
}
export const approachEdges=s=>{
  if(s>=STRUCTURE_START&&s<=STRUCTURE_END)return deckEdges(s);
  const start=s<STRUCTURE_START,edges=deckEdges(start?STRUCTURE_START:STRUCTURE_END);
  const u=Math.min(1,Math.max(0,(start?s:base.BRIDGE_LENGTH-s)/8)),t=u*u*(3-2*u);
  return [-3+(edges[0]+3)*t,3+(edges[1]-3)*t];
};
export const PROFILE = {...base,deckHeight,bridgePoint,bridgeRoadHeight};
PROFILE.surfaceStep=1;
PROFILE.meshStep=1;
PROFILE.ownershipMargin=.25;
