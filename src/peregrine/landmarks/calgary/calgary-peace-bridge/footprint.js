// OpenStreetMap extrusions the Peace Bridge model replaces: only the mapped bridge outline (way 1313657677,
// building=bridge), which the provider may extrude as a 7.25 x 120.6 m box. The footways and the cycleway are
// highways (flat lines the provider draws itself), not extrusions.
export const FOOTPRINTS = [
  [[-114.0795267, 51.0542936], [-114.0783709, 51.0534898], [-114.0783574, 51.0534974], [-114.0783324, 51.0535117], [-114.0783084, 51.0535253], [-114.0782939, 51.0535336], [-114.07945, 51.0543372], [-114.0794632, 51.0543297], [-114.0794883, 51.0543154], [-114.0795101, 51.054303], [-114.0795267, 51.0542936]],
];
export const OSM_WAYS = [
  { id: 1313657677, type: 'way', note: 'name=Peace Bridge, building=bridge, bridge=covered, man_made=bridge, architect=Santiago Calatrava (wikidata Q3397285): the mapped outline, 120.6 x 7.25 m, centred on the origin; its axis fixes the bearing. FOOTPRINT ring 1: the provider may extrude it as a box.' },
  { id: 158753074, type: 'way', note: 'highway=cycleway, bridge=yes, bridge:name=Peace Bridge, lanes=2: the central two-way cycleway on the span. Its five nodes run 120.6 m on bearing 137.88 deg (Mercator); the middle node is the model origin.' },
  { id: 1313657678, type: 'way', note: 'highway=footway, footway=sidewalk, oneway=yes, bridge=yes: the north-east pedestrian way (about 2.9 m from the axis).' },
  { id: 1313657681, type: 'way', note: 'highway=footway, footway=sidewalk, oneway=yes, bridge=yes: the south-west pedestrian way.' },
  { id: 1313657685, type: 'way', note: 'highway=footway, footway=crossing, bridge=yes: the unmarked crossing of the cycleway at mid-span (and ways 1313657684, 1313657686 at the thirds).' },
  { id: 158753087, type: 'way', note: 'highway=cycleway: the north-west approach path onto the bridge (with 1313657687, 1313657680, 1313657682); 1313653895, 1313657679, 1313657683 are the south-east approaches. The provider draws them.' },
];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
