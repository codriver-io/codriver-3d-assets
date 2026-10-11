// A road-carrying bridge replaces no building extrusion (spec.footprintless): the deck is fitted to
// the provider's OWN roads by the road layer (layer.js), not to a footprint. OSM_WAYS records the
// mapped ways the alignment (upper roadway and its approaches), the lower roadway, the deck outline
// and its pier bays, and the sidewalks came from (centre-street-bridge-alignment.js / -mapped.js).
export const FOOTPRINTS = [];
export const OSM_WAYS = [
  'way/4637525', 'way/1323929195', 'way/467412727', 'way/55364903',          // upper deck and approaches
  'way/172273337', 'way/420030805', 'way/238136415', 'way/420067812',        // lower deck
  'way/1323929179', 'way/1472523831', 'way/1472523832',                      // outline, sidewalks
];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
