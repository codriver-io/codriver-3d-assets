import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { ALIGNMENT_DATA as A } from './pont-de-la-fonderie-alignment.js';

// A swing bridge closes flush with its quays: the model is the mapped 22.78 m span only. The quay
// streets either side (and their bend, junctions, stop lines and crossings) stay ordinary roads, so
// live HD pavement and paint are never buried under authored approach ramps.
export const STRUCTURE_START = 0;
// The mapped bridge rectangle is skewed 0.5 m relative to its roadway, not rotated off-axis.
const skew = s => .50*Math.max(0,Math.min(1,s/22.77546));
export const deckEdges = s => [-5.12+skew(s),4.73+skew(s)];
// Inner faces of the two plate girders (web centre 0.14 m in from the deck edge, 0.09 m thick).
export const WEB_IN = .185;
// Asphalt runs girder to girder (aerial and 2023 photos: no raised walks; OSM's separate
// sidewalks are unraised strips at the girders). Two unmarked lanes on about 9.5 m.
export const carriageway = s => { const [l,r]=deckEdges(s);return [l+WEB_IN,r-WEB_IN]; };
const base = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, width: 10.7, palette: PALETTES.light,
  centerline: A.road, roadEdges: [carriageway(11.4)], roadEdgesAt: s => [carriageway(s)],
  terrainPolicy: 'bank-fit', buildingFootprints: [], clipStandardEnds: true,
  profile: ({length}) => [[0,'start'],[length,'end']],
});
export const STRUCTURE_LENGTH = base.BRIDGE_LENGTH;
export const STRUCTURE_END = STRUCTURE_START+STRUCTURE_LENGTH;
// Authored deck surface: 0.10 m proud of the quay grade, enough to stay above the flat Cityscape
// ground without a visible step at the joints.
export const DECK_H = .1;
export const PIVOT_S = STRUCTURE_START+5.0; // photographic bank-side estimate, not a surveyed pier station
// The deck spans straight between the two live quay datums, DECK_H above them.
function deckHeight(s,approaches=[0,0]) {
  const t=Math.max(0,Math.min(1,s/base.BRIDGE_LENGTH));
  return approaches[0]+(approaches[1]-approaches[0])*t+DECK_H;
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
// The riveted steel deck is rigid: its girders never move to follow the live HD pavement. The HD
// polygon here also arrives in fragments (a single 4.3 m half-road sample at the NW joint), which the
// shared fit would turn into a narrow, off-centre one-lane deck. Width and acceptance stay authored.
const roadEdges = s => base.roadEdges(s,null,null);
const fittedLateral = (s,d) => d;
function bridgeRoadHeight(lng,lat,heading,approaches) {
  // Shared corridor and heading acceptance, against the authored girder-to-girder carriageway.
  if(base.bridgeRoadHeight(lng,lat,heading,approaches,null,null)===null)return null;
  const q=base.bridgeLocal(lng,lat);return deckHeight(base.projectBridge(q.x,q.z).s,approaches);
}
export const PROFILE = {...base,deckHeight,bridgePoint,roadEdges,fittedLateral,bridgeRoadHeight};
PROFILE.surfaceStep=1;
PROFILE.meshStep=1;
PROFILE.ownershipMargin=.25;
