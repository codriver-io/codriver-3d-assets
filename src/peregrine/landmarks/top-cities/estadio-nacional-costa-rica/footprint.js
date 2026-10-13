import { MAPPED } from './estadio-nacional-costa-rica-mapped.js';
// Relation 9130067 owns outer way 222243861; its inner way is the open arena, not a building part.
export const OSM_WAYS = Object.keys(MAPPED).map(Number);
export const OSM_RELATIONS = [9130067];
export const FOOTPRINTS = OSM_WAYS.map(id => MAPPED[id].ring);
