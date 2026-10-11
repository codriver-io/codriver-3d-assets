import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { ALIGNMENT_DATA as A } from './pont-de-la-fonderie-alignment.js';

// A swing bridge closes flush with its quays: the model is the mapped 22.78 m span only. The quay
// streets either side (and their bend, junctions, stop lines and crossings) stay ordinary roads, so
// live HD pavement and paint are never buried under authored approach ramps.
export const STRUCTURE_START = 0;
const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, width: 10.7, palette: PALETTES.light,
  centerline: A.road, roadEdges: [[-3,3]], terrainPolicy: 'bank-fit', buildingFootprints: [], clipStandardEnds: true,
  profile: ({length}) => [[0,'start'],[length,'end']],
});
export const STRUCTURE_LENGTH = base.BRIDGE_LENGTH;
export const STRUCTURE_END = STRUCTURE_START+STRUCTURE_LENGTH;
// Authored deck surface: 0.10 m proud of the quay grade, enough to stay above the flat Cityscape
// ground without a visible step at the joints.
export const DECK_H = .1;
// The mapped bridge rectangle is skewed 0.5 m relative to its roadway, not rotated off-axis.
export const deckEdges = s => { const t=Math.max(0,Math.min(1,(s-STRUCTURE_START)/STRUCTURE_LENGTH));return [-5.12+.50*t,4.73+.50*t]; };
export const PIVOT_S = STRUCTURE_START+5.0; // photographic bank-side estimate, not a surveyed pier station
// The deck spans straight between the two live quay datums, DECK_H above them.
function deckHeight(s,approaches=[0,0]) {
  const t=Math.max(0,Math.min(1,s/base.BRIDGE_LENGTH));
  return approaches[0]+(approaches[1]-approaches[0])*t+DECK_H;
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
function bridgeRoadHeight(lng,lat,heading,approaches,joins,sections) {
  // Preserve the shared corridor, heading and live-width acceptance exactly.
  if(base.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;
  const q=base.bridgeLocal(lng,lat);return deckHeight(base.projectBridge(q.x,q.z).s,approaches);
}
export const PROFILE = {...base,deckHeight,bridgePoint,bridgeRoadHeight};
PROFILE.surfaceStep=1;
PROFILE.meshStep=1;
PROFILE.ownershipMargin=.25;
