import { WAYS } from './high-level-bridge-edmonton-alignment.js';
// Road ownership uses the two precise profile corridors. No building extrusion is replaced.
export const FOOTPRINTS=[];
export const OSM_WAYS=[...new Set([...WAYS.map(w=>`way/${w.id}`),... [219620022,113767071,1474789002,461598599].map(id=>`way/${id}`)])];
