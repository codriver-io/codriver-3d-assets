// A bridge superstructure replaces no building extrusion (config.js sets `footprintless`), with two
// small exceptions: the provider extrudes the mapped operator's house and the watchman's hut on their
// piers as buildings, and the model draws both of them itself. Those two outlines are the only rings.
export const FOOTPRINTS = [
  // OSM way 579664204: building=transportation, 1051 3rd Street, 2 levels. The operator's house and its
  // pier platform at the south-east end, with the watchman's hut beside the leaf's toe.
  [[-122.3899694, 37.7766357], [-122.3899859, 37.7766556], [-122.3899459, 37.7766762], [-122.3899071, 37.776629], [-122.3898729, 37.7766466], [-122.3898455, 37.7766133], [-122.389809, 37.7765681], [-122.3898652, 37.7765399], [-122.3899044, 37.7765203], [-122.3899583, 37.7765879], [-122.389939, 37.7765976]],
  // OSM way 1006830800: building=service. The second small hut at the north-west (heel) end.
  [[-122.3903264, 37.7771273], [-122.3903681, 37.7771063], [-122.3903203, 37.777047], [-122.3902786, 37.777068], [-122.3903123, 37.7771098]],
];
export const OSM_WAYS = [
  { id: 1088314479, type: 'way', note: 'man_made=bridge, bridge:movable=bascule, bridge:structure=truss, name=Lefty O\'Doul Bridge (wikidata Q14629128): the mapped bridge outline (leaf 44.6 m long, 24.5 m wide). Fixes the leaf centre, the axis and the 52.5 m north-west extent of the counterweight tail. Not extruded by the provider, so not a footprint ring.' },
  { id: 27656674, type: 'way', note: 'highway=primary, bridge=movable, name=3rd Street, oneway: north-west carriageway (bearing 328.0).' },
  { id: 674496104, type: 'way', note: 'highway=primary, bridge=movable, oneway: south-east carriageway (bearing 326.8).' },
  { id: 1006830791, type: 'way', note: 'highway=primary, bridge=movable, lanes=2 (bearing 327.4). With the two ways above: the roadway the trusses flank.' },
  { id: 834052363, type: 'way', note: 'highway=cycleway, bridge=movable, is_sidepath of 3rd Street: the protected bike track (east side).' },
  { id: 675874822, type: 'way', note: 'highway=footway, footway=sidewalk, bridge=movable (east sidewalk, centre line 11.3 m from the road centre).' },
  { id: 675874825, type: 'way', note: 'highway=footway, footway=sidewalk, bridge=movable (west sidewalk).' },
  { id: 579664204, type: 'way', note: 'building=transportation, building:levels=2, roof:shape=pyramidal, 1051 3rd Street: the operator\'s house, its pier platform and the watchman\'s hut. FOOTPRINT ring 1.' },
  { id: 1006830800, type: 'way', note: 'building=service: the small hut beside the heel tower. FOOTPRINT ring 2.' },
];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
