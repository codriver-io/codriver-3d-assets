// A road-carrying bridge replaces no building extrusion (spec.footprintless): the deck is fitted to
// the provider's OWN roads by the road layer (layer.js), not to a footprint. OSM_WAYS records the
// mapped ways the alignment and the structure positions came from (golden-gate-bridge-alignment.js).
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import alignment from './golden-gate-bridge-alignment.js';

export const FOOTPRINTS = [];
const st = alignment.structure;
export const OSM_WAYS = [...new Set([
  ...alignment.bridge.northbound.ways, ...alignment.bridge.southbound.ways,
  ...alignment.south.northbound.ways, ...alignment.south.southbound.ways, ...alignment.north.northbound.ways, ...alignment.north.southbound.ways,
  ...st.southTower.ways, ...st.northTower.ways, ...Object.values(st.pylons).flatMap((v) => v.ways),
  st.anchorages.south.way, st.anchorages.north.way, st.fender.way,
])].map((id) => `way/${id}`);
