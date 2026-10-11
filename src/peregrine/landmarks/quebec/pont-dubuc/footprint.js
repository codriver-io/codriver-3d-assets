// A road-carrying bridge replaces no building extrusion (spec.footprintless): the deck is fitted to the
// provider's OWN roads by the road layer (layer.js), not to a footprint. OSM_WAYS records the mapped ways
// the alignment came from (pont-dubuc-alignment.js) and the bridge outline (1387995469).
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import alignment from './pont-dubuc-alignment.js';

export const FOOTPRINTS = [];
const carriageways = (end) => [...end.northbound.ways, ...end.southbound.ways];
export const OSM_WAYS = [...new Set([
  ...carriageways(alignment.bridge), ...carriageways(alignment.south), ...carriageways(alignment.north), ...alignment.outline.ways,
])].map((id) => `way/${id}`);
