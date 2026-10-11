// A road-carrying bridge replaces no building extrusion (spec.footprintless): the deck is fitted to the
// provider's OWN roads by the road layer (layer.js), not to a footprint. OSM_WAYS records the mapped ways
// the alignment came from (pont-papineau-leblanc-alignment.js) and the bridge outline (relation 12989251).
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import alignment from './pont-papineau-leblanc-alignment.js';

export const FOOTPRINTS = [];
const carriageways = (end) => [...end.southbound.ways, ...end.northbound.ways];
export const OSM_WAYS = [...new Set([
  ...carriageways(alignment.bridge), ...carriageways(alignment.laval), ...carriageways(alignment.montreal), ...alignment.outline.ways,
])].map((id) => `way/${id}`).concat([`relation/${alignment.outline.relation}`]);
