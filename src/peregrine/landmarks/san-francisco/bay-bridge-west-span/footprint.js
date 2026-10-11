// A road-carrying bridge replaces no building extrusion through FOOTPRINTS (spec.footprintless): the deck
// is fitted to the provider's own roads by the road layer (layer.js). OSM_WAYS records the mapped ways the
// alignment and support positions came from (bay-bridge-west-span-alignment.js): both I-80 carriageways,
// the San Francisco anchorage, W1, the towers W2, W3, W5, W6 (building=tower), the central anchorage W4
// (building=anchorage) and the island anchorage W7.
export const FOOTPRINTS = [];
export const OSM_WAYS = [
  'way/8921938', 'way/661905446', 'way/1343738800', 'way/120813417', 'way/202485364', 'way/1343730967', 'way/617730080',
  'way/23874736', 'way/11415208', 'way/1136339258', 'way/236373807', 'way/432712476', 'way/432712477', 'way/236374789',
  'way/432712478', 'way/432712479', 'way/1136339259',
];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
