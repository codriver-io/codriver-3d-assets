// A road-carrying bridge replaces no building extrusion (spec.footprintless): the deck is fitted to the
// provider's OWN roads by the road layer (layer.js), not to a footprint. OSM_WAYS records the mapped ways
// the alignment came from (pont-pierre-laporte-alignment.js) and the bridge outline (974494218).
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import alignment from './pont-pierre-laporte-alignment.js';

export const FOOTPRINTS = [];
export const OSM_WAYS = [...new Set([
  ...alignment.bridge.northbound.ways, ...alignment.bridge.southbound.ways,
  ...alignment.north.northbound.ways, ...alignment.north.southbound.ways, ...alignment.south.northbound.ways, ...alignment.south.southbound.ways,
  974494218, 974494217,
])].map((id) => `way/${id}`);
