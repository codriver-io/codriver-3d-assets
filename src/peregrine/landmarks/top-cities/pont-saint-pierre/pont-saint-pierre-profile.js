import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { ALIGNMENT_DATA as A } from './pont-saint-pierre-alignment.js';

// Station south-west (La Grave) to north-east (Place Saint-Pierre), +d to the right.
const frame = createBridgeProfile({ origin: SPEC.origin, width: 13.2, roadEdges: [[-5.2, 2.8]], centerline: A.road, profile: ({ length }) => [[0, 0], [length, 0]] });
const gap = (a, b) => { const p=frame.bridgeLocal(...a), q=frame.bridgeLocal(...b); return Math.hypot(q.x-p.x,q.z-p.z); };
function head(line, metres) {
  const out=[line[0]]; let used=0;
  for(let i=1;i<line.length;i++) { const g=gap(line[i-1],line[i]); if(used+g>=metres){const t=(metres-used)/g;out.push(line[i-1].map((v,k)=>v+(line[i][k]-v)*t));return out;}used+=g;out.push(line[i]); }
  throw new Error('Mapped approach is too short');
}
export const STRUCTURE_START = 80;
export const STRUCTURE_LENGTH = frame.BRIDGE_LENGTH;
export const STRUCTURE_END = STRUCTURE_START + STRUCTURE_LENGTH;
export const DECK_H = 7.4;
export const DECK_CENTER = -1.2;
export const DECK_HALF = 6.6;
export const ROAD_EDGES = [[-5.2, 2.8]];
// Centres of the four paired pier notches on OSM bridge outline 1007478960.
export const PIER_S = [34.75, 89.70, 144.73, 199.85].map(s=>s+STRUCTURE_START);
export const SUPPORT_S = [STRUCTURE_START, ...PIER_S, STRUCTURE_END];
export const PROFILE = createBridgeProfile({
  id: SPEC.id, name: SPEC.name, origin: SPEC.origin, width: 19.8,
  centerline: [...head(A.south,80).slice(1).reverse(), ...A.road, ...head(A.north,60).slice(1)],
  roadEdges: ROAD_EDGES, palette: PALETTES.light, terrainPolicy: 'bank-fit',
  buildingFootprints: [], clipStandardEnds: true,
  profile: ({ length }) => [[0,'start'],[PIER_S[0],DECK_H],[PIER_S[3],DECK_H],[length,'end']],
});
PROFILE.surfaceStep = 2;
PROFILE.ownershipMargin = 0.6;
export default PROFILE;
