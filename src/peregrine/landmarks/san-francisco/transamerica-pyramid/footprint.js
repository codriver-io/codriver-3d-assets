// OpenStreetMap extrusions the Transamerica Pyramid model replaces, read 2026-10-01 through the shared
// Overpass queue (way(around:120) building and building:part; © OpenStreetMap contributors, ODbL 1.0).
// Way 24222973 is the tower outline; the rest are its building:part ways, which the provider may draw as
// separate extrusions. Nothing else is listed: Redwood Park's glass pavilion (way 1316030009, east of the
// tower, not drawn by this model) and every neighbouring building stay provider-owned.
export const FOOTPRINTS = [
  // 24222973: outline of the whole tower and its 54 m square base (building=yes, height 260, 48 levels, pyramidal)
  [[-122.4031399, 37.7953705], [-122.4030423, 37.7948854], [-122.4024647, 37.7949580], [-122.4024317, 37.7949621], [-122.4024573, 37.7950894], [-122.4024591, 37.7950985], [-122.4024953, 37.7952781], [-122.4024991, 37.7952971], [-122.4025002, 37.7953026], [-122.4025293, 37.7954472], [-122.4031399, 37.7953705]],
  // 451336902: the 46 m square pyramid (building:part, 30..260 m, pyramidal)
  [[-122.4030857, 37.7953371], [-122.4025696, 37.7954033], [-122.4024858, 37.7949955], [-122.4030019, 37.7949293], [-122.4030857, 37.7953371]],
  // 451336893: south base skillion (building:part, 0..30 m, roof:direction 170.8)
  [[-122.4030019, 37.7949293], [-122.4030423, 37.7948854], [-122.4024647, 37.7949580], [-122.4024317, 37.7949621], [-122.4024858, 37.7949955], [-122.4030019, 37.7949293]],
  // 451336895: north base skillion (building:part, roof:direction 350.8)
  [[-122.4031399, 37.7953705], [-122.4030857, 37.7953371], [-122.4025696, 37.7954033], [-122.4025293, 37.7954472], [-122.4031399, 37.7953705]],
  // 451336898: east base skillion (building:part, roof:direction 80.8)
  [[-122.4025696, 37.7954033], [-122.4025293, 37.7954472], [-122.4024573, 37.7950894], [-122.4024317, 37.7949621], [-122.4024858, 37.7949955], [-122.4025696, 37.7954033]],
  // 451336901: west base skillion (building:part, roof:direction 260.8)
  [[-122.4030857, 37.7953371], [-122.4031399, 37.7953705], [-122.4030423, 37.7948854], [-122.4030019, 37.7949293], [-122.4030857, 37.7953371]],
  // 136615987: the wing footprint, 27.9 x 6.5 m (building:part, concrete, height 215, gabled roof 5 m)
  [[-122.4029443, 37.7951753], [-122.4029324, 37.7951177], [-122.4026278, 37.7951570], [-122.4026396, 37.7952145], [-122.4029443, 37.7951753]],
];
export const OSM_WAYS = ['way/24222973', 'way/451336902', 'way/451336893', 'way/451336895', 'way/451336898', 'way/451336901', 'way/136615987'];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
