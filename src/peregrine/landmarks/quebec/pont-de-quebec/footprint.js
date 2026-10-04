// A road-carrying bridge replaces no building extrusion (spec.footprintless): the deck is fitted to the
// provider's OWN roads by the road layer (layer.js), not to a footprint. OSM_WAYS records the mapped ways
// the alignment came from (pont-de-quebec-alignment.js), the track and walkway placed on the structure and
// the bridge outline (487189031).
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import alignment from './pont-de-quebec-alignment.js';

export const FOOTPRINTS = [];
export const OSM_WAYS = [...new Set([
  ...alignment.bridge.ways, ...alignment.north.ways, ...alignment.south.ways,
  ...alignment.rail.ways, ...alignment.footway.ways, ...alignment.outline.ways,
])].map((id) => `way/${id}`);
