import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { WAYS } from './ponts-jumeaux-alignment.js';

// Three independent corridors: the original canal-side heritage frontage,
// the four-lane north boulevard, and the two-lane south boulevard. All share
// the same origin, but road navigation never uses the pedestrian heritage axis.
const metric = createBridgeProfile({ ...SPEC, width: 8, roadEdges: [], centerline: [[1.41866,43.61115],[1.41875,43.61093]], palette: PALETTES.light, profile: ({length}) => [[0,4.7],[length,4.7]] });
const distance = (a,b) => { const p=metric.bridgeLocal(...a),q=metric.bridgeLocal(...b); return Math.hypot(q.x-p.x,q.z-p.z); };
function head(line, metres) {
  const out=[line[0]];let total=0;
  for(let i=1;i<line.length;i++) { const n=distance(line[i-1],line[i]); if(total+n>=metres) { out.push(line[i-1].map((v,k)=>v+(line[i][k]-v)*(metres-total)/n));return out; }out.push(line[i]);total+=n; }
  return out;
}
const lengthOf = (line) => line.slice(1).reduce((n,p,i)=>n+distance(line[i],p),0);
export const RAMP_M = 60;
export const DECK_M = 4.2;
function road(part, width, bridge, before, after, lanes) {
  const west=head(before,RAMP_M),east=head(after,RAMP_M);
  const start=lengthOf(west),end=start+lengthOf(bridge);
  const centerline=[...west.slice(1).reverse(),...bridge,...east.slice(1)];
  const profile=createBridgeProfile({ ...SPEC, width, roadEdges:[[-width/2+1.25,width/2-1.25]],
    palette:PALETTES.light, centerline, terrainPolicy:'bank-fit', clipStandardEnds:true,
    profile:({length})=>[[0,'start'],[start,DECK_M],[end,DECK_M],[length,'end']],
  });
  profile.part=part;profile.structureStart=start;profile.structureEnd=end;profile.lanes=lanes;
  profile.ownershipMargin=0.5;
  return profile;
}
export const NORTH = road('north',16, [...WAYS[441406351]].reverse(), WAYS[123006657], [...WAYS[543503637]].reverse().concat([...WAYS[99272680]].reverse().slice(1)),4);
export const SOUTH = road('south',9, WAYS[22689673], [...WAYS[122192543]].reverse().concat([...WAYS[99274487]].reverse().slice(1)), WAYS[23044707].concat(WAYS[274541044].slice(1)),2);
export const HERITAGE = metric;
HERITAGE.part='heritage';
HERITAGE.CHAMPLAIN.terrainPolicy='bank-fit';
// Guard historical footway: it cannot claim any road or navigation surface.
export const PROFILES = [HERITAGE,NORTH,SOUTH];
export const PROFILE = { ...SOUTH, resampleBridgeLine: line => [NORTH,SOUTH].reduce((v,p)=>p.resampleBridgeLine(v),line) };
export const ARCHES = [
  { profile:HERITAGE, part:'heritage', s:13.0, half:5.7, rise:2.55, spring:.45 },
  { profile:SOUTH, part:'south', s:71.3, half:5.0, rise:2.45, spring:.45 },
];
const panelStart=HERITAGE.bridgePoint(HERITAGE.BRIDGE_LENGTH-4);
export const PANEL_FRAME = createBridgeProfile({ ...SPEC, width:1.4, roadEdges:[], centerline:[HERITAGE.bridgeLngLat(panelStart.x,panelStart.z),[1.41866,43.61081]], profile:({length})=>[[0,4.7],[length,4.7]] });
export const PANEL = { s:PANEL_FRAME.BRIDGE_LENGTH/2, length:18.7, bottom:.8, height:2.65, face:.68 };

// Short retaining return joins the relief wall to the outside of the south curb.
const wingEnd=SOUTH.bridgePoint(SOUTH.ALIGNMENT[8].s,-SOUTH.halfWidth+.05);
export const WING_FRAME=createBridgeProfile({ ...SPEC,width:1.2,roadEdges:[],centerline:[[1.41866,43.61081],SOUTH.bridgeLngLat(wingEnd.x,wingEnd.z)],profile:({length})=>[[0,4.7],[length,4.2]] });
