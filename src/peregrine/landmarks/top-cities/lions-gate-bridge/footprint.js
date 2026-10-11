import { ROAD_WAYS } from './lions-gate-bridge-alignment.js';
// No building=* or building:part=* extrusions are present on this bridge in the extract.
// The roadway and man_made=bridge polygon are road ownership, not building masks.
export const FOOTPRINTS = [];
export const OSM_WAYS = [...ROAD_WAYS, 497479010, 497479011, 497479012, 497479013];
