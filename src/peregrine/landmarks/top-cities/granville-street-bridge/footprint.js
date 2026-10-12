import { footprintRing } from './granville-street-bridge-profile.js';
import { ROAD_WAYS } from './granville-street-bridge-mapped.js';
// Authored primary crossing envelope, including the mapped fitting approaches.
// The OSM man_made outline includes branch ramps that this asset does not replace.
export const FOOTPRINTS = [footprintRing()];
export const OSM_WAYS = ROAD_WAYS;
