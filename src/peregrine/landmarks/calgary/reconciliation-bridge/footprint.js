// A road-carrying bridge replaces no building extrusion (spec.footprintless): the deck is fitted to the
// provider's OWN roads by the road layer (layer.js), not to a footprint. OSM_WAYS records the mapped ways
// the alignment, deck outline and sidewalks came from (reconciliation-bridge-alignment.js): the roadway,
// its two approach roads, the man_made=bridge outline and the two sidewalk (cycleway) bridges.
export const FOOTPRINTS = [];
export const OSM_WAYS = ['way/257636719', 'way/461162440', 'way/32526666', 'way/1325528737', 'way/172284463', 'way/172284473'];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
