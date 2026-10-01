// OpenStreetMap extrusions the model replaces: the stadium building outline (multipolygon
// relation 7330762, height=30, outer way 24352572). Its inner ring (the playing field, way
// 98224507) and the surface-parking inner ring stay provider. The building:part ways drawn
// over it (grandstand ring 499568642, light towers 499568643/-44/-46/-47/-48/-49, facade
// bands 499568645, 368215207/8, the Coca-Cola bottle 499568652) all lie inside this ring.
// Retrieved 2026-10-01 from the OSM API (map bbox call).
export const FOOTPRINTS = [
  [[-122.389288,37.779751],[-122.389421,37.779644],[-122.389449,37.779621],[-122.389957,37.779217],[-122.390135,37.779075],[-122.390412,37.778854],[-122.390878,37.778472],[-122.390974,37.778395],[-122.390859,37.778313],[-122.390838,37.778297],[-122.390869,37.778261],[-122.390824,37.778228],[-122.390898,37.778144],[-122.390997,37.778032],[-122.391181,37.777824],[-122.390795,37.77752],[-122.390747,37.777574],[-122.390653,37.777518],[-122.390626,37.777502],[-122.390498,37.777426],[-122.390453,37.777478],[-122.390321,37.77741],[-122.390261,37.777379],[-122.390193,37.777344],[-122.390054,37.7774],[-122.389882,37.777468],[-122.389855,37.777458],[-122.389231,37.777681],[-122.387969,37.778176],[-122.387992,37.778437],[-122.387957,37.778453],[-122.387928,37.778468],[-122.3879,37.778487],[-122.387875,37.77851],[-122.387852,37.778538],[-122.387834,37.778569],[-122.387821,37.778598],[-122.387828,37.778619],[-122.388384,37.779055],[-122.38885,37.77942],[-122.388876,37.779441],[-122.389184,37.77967],[-122.389288,37.779751]],
];
export const OSM_WAYS = [
  24352572, // outer ring of the building=stadium multipolygon (relation 7330762), height=30
  98224507, // inner ring (the field), left to the provider
  499568642, // building:part, height=60 (grandstand rim band)
  499568645, 368215207, 368215208, // building:part, heights 30/25/25 (west and south-west facade bands)
  499568643, 499568644, 499568646, 499568647, 499568648, 499568649, // building:part, heights 62-70 (light towers and scoreboard frame)
  499568652, // building:part, Coca-Cola bottle
  500283910, // leisure=pitch, baseball grass
];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
