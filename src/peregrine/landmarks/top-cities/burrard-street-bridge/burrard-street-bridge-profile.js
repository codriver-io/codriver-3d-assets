import { createBridgeProfile } from '../../bridge-profile.js';
import { CENTERLINE, OUTLINE } from './burrard-street-bridge-mapped.js';
import { SPEC, PALETTES } from './config.js';
// Station increases Kitsilano → downtown. Positive lateral is the False Creek (SE) side.
// Published support-centre spans registered to the mapped portal bays at s≈520/626.
export const PIERS = [397.1, 453.9, 524.6, 620.8, 691.5, 747.8];
export const MAIN = [PIERS[2], PIERS[3]];
export const DECK = 24;
export const HALF = 13.35;
export const ROAD_EDGES = [[-6.8, 6.8]];
export const PROFILE = createBridgeProfile({
  ...SPEC, palette: PALETTES.light, centerline: CENTERLINE, width: 30.8,
  roadEdges: ROAD_EDGES, deck: DECK, terrainPolicy: 'absolute-deck',
  buildingFootprints: [OUTLINE], clipStandardEnds: true,
  profile: ({ length, deck }) => [[0, 'start'], [PIERS[0], deck], [PIERS[4], deck], [length, 'end']],
});
