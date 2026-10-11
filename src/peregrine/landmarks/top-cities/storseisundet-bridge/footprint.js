import { OUTLINE } from './storseisundet-bridge-mapped.js';
// No building ways in the dossier. Conservatively mask provider bridge extrusions.
// Fitting approaches are roadway corridors, not building replacement footprints.
export const FOOTPRINTS = [OUTLINE];
export const OSM_WAYS = [1159266079, 123498061, 123498060, 751715045];
