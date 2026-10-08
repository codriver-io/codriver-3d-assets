import { ROAD_WAYS } from './halogaland-bridge-alignment.js';
// No building-tagged tower extrusions in the dossier. The man_made=bridge polygon
// is road ownership, not a building replacement footprint. Never mask neighbours.
export const FOOTPRINTS = [];
export const OSM_WAYS = [...ROAD_WAYS,666112091,390633760];
