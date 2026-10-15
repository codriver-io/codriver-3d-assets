// OpenStreetMap extrusions the George C. King Bridge model replaces: only the mapped bridge outline (way 1328870003,
// man_made=bridge), about 8 m wide at the piers: the plan of the arches and the deck. The footways and cycleways are
// highways (flat lines the provider draws itself), not extrusions.
export const FOOTPRINTS = [
  [[-114.0474212, 51.0474964], [-114.0473657, 51.0474836], [-114.0473072, 51.04747], [-114.046827, 51.0482813], [-114.0467161, 51.048431], [-114.0466799, 51.048489], [-114.0466565, 51.0485367], [-114.046611, 51.0486255], [-114.0465736, 51.0487092], [-114.0465188, 51.0488017], [-114.0464604, 51.0488824], [-114.0463651, 51.0490076], [-114.0464267, 51.0490239], [-114.0464845, 51.0490393], [-114.0465912, 51.04882], [-114.0466741, 51.0486945], [-114.046757, 51.0485918], [-114.0467838, 51.0485624], [-114.0468107, 51.0485309], [-114.0468317, 51.0484977], [-114.0468556, 51.0484593], [-114.046875, 51.0484187], [-114.0469033, 51.0483353], [-114.0469317, 51.0482819], [-114.0473493, 51.0476021]],
];
export const OSM_WAYS = [
  { id: 1328870003, type: 'way', note: 'name=George C. King Bridge, man_made=bridge, layer=1 (wikidata Q29561169): the mapped outline of the whole structure, 182.6 m long and 7 to 11 m wide (arch plan). FOOTPRINT ring 1: the provider may extrude it as a box.' },
  { id: 206004051, type: 'way', note: 'name=George C. King Bridge, highway=cycleway, bridge=yes, layer=1: the central path over the three spans. Its five nodes run 182.55 m on bearing 21.10 deg (local plane); the middle of the two end nodes is the model origin.' },
  { id: 779639382, type: 'way', note: 'highway=footway, bridge=yes, layer=1: the 78 m ramp that leaves the deck at u = 23.9 m, the middle of the 31 m span, down to St Patrick\'s Island. MODELLED as a slab on a steel girder with rails and three concrete supports (a bridge way, not an extrusion, so it needs no footprint ring; the provider draws the flat path under it).' },
  { id: 1328870004, type: 'way', note: 'highway=cycleway: the south approach path onto the bridge. The provider draws it.' },
];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
