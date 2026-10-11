// OpenStreetMap extrusions the Cathedral of Saint Mary model replaces, read 2026-10-01 through the shared Overpass
// queue (way/relation geometry around 37.7842,-122.4255; © OpenStreetMap contributors, ODbL 1.0).
// The cathedral is mapped as a building=cathedral multipolygon (relation 7814696, outer way 256900649, height 18.9)
// that covers the cathedral square AND the parish buildings south of it, plus three building:part ways for the 63 m
// ground block and the 35.6 m tower (their height tags, 60 m and 77.7 m, are mapping slips: 77.7 m is the 255 ft
// width). The model draws the cathedral and a plain annex mass (outer ring south of the cathedral, OSM height
// 18.9 m) so removing the whole relation leaves nothing unaccounted for. Courtyards (inner ways 547205110-113)
// stay holes and are not listed.
export const FOOTPRINTS = [
  // 256900649: outer ring of relation 7814696 (building=cathedral, height 18.9)
  [[-122.4248614, 37.7838503], [-122.4246961, 37.7838711], [-122.4246741, 37.7837617], [-122.4246298, 37.7835418], [-122.4252776, 37.7834602], [-122.4258233, 37.7833915], [-122.4258286, 37.7834175], [-122.4258894, 37.7837194], [-122.4257218, 37.7837405], [-122.4257403, 37.7838321], [-122.4257947, 37.7841023], [-122.4258263, 37.7842588], [-122.4258790, 37.7845206], [-122.4256767, 37.7845461], [-122.4252274, 37.7846026], [-122.4250183, 37.7846289], [-122.4249662, 37.7843703], [-122.4249343, 37.7842121], [-122.4248804, 37.7839446], [-122.4248712, 37.7838990], [-122.4248614, 37.7838503]],
  // 436473547: 63 m ground block (building:part, layer 2, tagged height 60)
  [[-122.4257966, 37.7844700], [-122.4250920, 37.7845592], [-122.4249787, 37.7840005], [-122.4256833, 37.7839113], [-122.4257966, 37.7844700]],
  // 436473546: 35.6 m tower base outline with the four fin tips (building:part, layer 3)
  [[-122.4256187, 37.7843692], [-122.4254221, 37.7844046], [-122.4252193, 37.7844205], [-122.4251734, 37.7842618], [-122.4251555, 37.7841028], [-122.4253530, 37.7840649], [-122.4255541, 37.7840530], [-122.4256025, 37.7842082], [-122.4256187, 37.7843692]],
  // 435831007: the cross of four 3 m blades, 40.8 m tip to tip (building:part, layer 4, tagged height 77.7)
  [[-122.4256176, 37.7842195], [-122.4254070, 37.7842461], [-122.4254408, 37.7844133], [-122.4254070, 37.7844176], [-122.4253731, 37.7842503], [-122.4251597, 37.7842772], [-122.4251544, 37.7842509], [-122.4253678, 37.7842239], [-122.4253341, 37.7840574], [-122.4253680, 37.7840531], [-122.4254018, 37.7842196], [-122.4256123, 37.7841930], [-122.4256176, 37.7842195]],
];
export const OSM_WAYS = ['relation/7814696', 'way/256900649', 'way/436473547', 'way/436473546', 'way/435831007'];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
