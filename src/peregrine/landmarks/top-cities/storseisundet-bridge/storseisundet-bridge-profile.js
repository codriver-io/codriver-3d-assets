import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, STRUCTURAL_ENDPOINTS, OUTLINE } from './storseisundet-bridge-mapped.js';
const raw = createBridgeProfile({ ...SPEC, width: 7.4, centerline: CENTERLINE,
  roadEdges: [[-3.1, 3.1]], profile: ({length}) => [[0,0],[length,0]] });
export const STRUCTURE = STRUCTURAL_ENDPOINTS.map(ll => raw.stationAt(ll));
export const CROWN = (STRUCTURE[0]+STRUCTURE[1])/2;
export const PIERS = [CROWN-65, CROWN+65];
export const DECK = 25.2;
export const HALF = 3.7;
export const PROFILE = createBridgeProfile({
  ...SPEC, palette: PALETTES.light, centerline: CENTERLINE, width: 7.4,
  roadEdges: [[-3.1, 3.1]], terrainPolicy: 'absolute-deck',
  buildingFootprints: [OUTLINE], clipStandardEnds: true,
  profile: ({length}) => [[0,'start'],[STRUCTURE[0],13],[CROWN,DECK],[STRUCTURE[1],13],[length,'end']],
});
// Variable-depth cantilever box, not a separate arch: deep at the pier roots.
export function boxDepth(s) {
  if(s<STRUCTURE[0] || s>STRUCTURE[1]) return 0.48;
  const dist=Math.min(...PIERS.map(t=>Math.abs(t-s)));
  return 2.05 + 5.35 * Math.max(0,1-dist/65)**2;
}
