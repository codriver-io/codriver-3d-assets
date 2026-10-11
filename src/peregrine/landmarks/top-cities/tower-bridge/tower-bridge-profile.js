import { createBridgeProfile } from '../../bridge-profile.js';
import { CENTERLINE, TOWER_POINTS } from './tower-bridge-alignment.js';
import { FOOTPRINTS } from './footprint.js';
import { SPEC, PALETTES } from './config.js';
export const DECK_H = 8.5;
export const WALK_H = DECK_H + 33.5;
export const PROFILE = createBridgeProfile({
  ...SPEC, width: 16.5, roadEdges: [[-4.2, 4.2]], palette: PALETTES.light,
  centerline: CENTERLINE, terrainPolicy: 'absolute-deck', buildingFootprints: FOOTPRINTS.slice(1),
  // Mapped approaches stop before the split carriageways; peak grade 11.4%.
  profile: ({ length }) => [[0, 'start'], [112, DECK_H], [length - 112, DECK_H], [length, 'end']],
});
export const TOWER_S = TOWER_POINTS.map(p => PROFILE.stationAt(p));
export const CENTRE_S = (TOWER_S[0] + TOWER_S[1]) / 2;
export const SIDE_SPAN = 82;
export const ABUTMENT_S = [TOWER_S[0] - 5.5 - SIDE_SPAN, TOWER_S[1] + 5.5 + SIDE_SPAN];
export const STRUCTURE_START = ABUTMENT_S[0] - 12;
export const STRUCTURE_END = ABUTMENT_S[1] + 12;
export default PROFILE;
