// A road-carrying bridge replaces no building extrusion (spec.footprintless): the deck is fitted to
// the provider's OWN roads by the road layer (layer.js), not to a footprint. OSM_WAYS records the
// mapped ways the alignment, deck outline, sidewalks and subway tracks came from
// (prince-edward-viaduct-alignment.js); the roads, rail and river under the deck are listed there too.
export const FOOTPRINTS = [];
export const OSM_WAYS = ['way/4282643', 'way/195248139', 'way/43654690', 'way/43654691', 'way/5134874', 'way/195244983'];
