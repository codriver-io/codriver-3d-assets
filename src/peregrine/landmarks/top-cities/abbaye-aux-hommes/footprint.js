// Geographic replacement envelopes © OpenStreetMap contributors, ODbL 1.0.
import { MAPPED } from './abbaye-aux-hommes-plan.js';
// Three owned main outlines, plus all their mapped provider parts. The cloister is added separately.
export const FOOTPRINTS = Object.values(MAPPED).filter(v=>v.tags.role!=='inner').map(v=>v.ring);
export const OSM_WAYS = Object.keys(MAPPED).map(id=>'way/'+id).concat('relation/19644543');
