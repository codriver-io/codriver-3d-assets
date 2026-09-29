// Site frame and mapped plan of the Rogers Centre.
//
// Authoring axes: u runs across the stadium (east-ish), v runs along it (south-ish,
// toward the lake and the home-plate end), y is up. site() rotates (u, y, v) into the
// exported frame (+X east, +Y up, +Z south) exactly as the other Toronto landmarks do.
// The mapped west and east walls (OSM way 7969701) run 16.1 degrees off true north,
// which is the frame's whole rotation: the model is authored square to its own walls.
//
// Every polygon below was read from OpenStreetMap (retrieved 2026-09-29; © OpenStreetMap
// contributors, ODbL 1.0), projected with the facade's own mercator maths about the
// origin in config.js, rotated by THETA and rounded to 0.1 m. u east, v south, so a
// ring listed here is clockwise on the map.
export const THETA = 16.1 * Math.PI / 180;
const C = Math.cos(THETA), S = Math.sin(THETA);
export const site = (u, y, v) => [u * C + v * S, y, -u * S + v * C];
export const unsite = (x, z) => [x * C - z * S, x * S + z * C];

// OSM way 7969701: the whole building envelope (concrete ring, hotel end, entrance
// block, prows). 76 vertices, clockwise on the map.
export const OUTLINE = [[29.2, -108.1], [34.8, -106.5], [36.3, -110.7], [43.8, -107.9], [49.9, -105.3], [51.1, -107.9], [58.8, -103.9], [64.6, -100.4], [67.7, -105.3], [70.9, -103.1], [74.7, -100.4], [78.5, -97.0], [81.9, -94.0], [85.6, -94.0], [85.5, -99.7], [85.4, -106.3], [96.5, -106.4], [96.5, -109.5], [108.9, -109.5], [108.8, -99.4], [107.8, -5.5], [107.7, 5.1], [110.2, 5.3], [110.2, 6.8], [109.5, 52.6], [109.4, 57.3], [97.9, 57.0], [96.0, 60.9], [86.8, 73.8], [79.8, 68.1], [70.8, 77.2], [59.6, 86.0], [47.8, 92.8], [34.9, 98.2], [21.4, 101.7], [22.8, 108.0], [1.9, 110.2], [-0.8, 109.9], [-20.8, 107.9], [-19.7, 102.1], [-33.1, 98.6], [-45.9, 93.4], [-57.9, 86.5], [-69.3, 78.2], [-70.5, 77.0], [-78.7, 68.9], [-84.3, 74.1], [-94.5, 60.9], [-96.6, 57.0], [-106.7, 57.0], [-106.8, 52.2], [-107.6, 4.8], [-107.8, -4.3], [-107.8, -4.9], [-107.8, -36.2], [-108.0, -93.6], [-108.1, -105.3], [-85.5, -105.9], [-85.6, -99.9], [-85.6, -91.4], [-82.6, -91.4], [-75.5, -98.1], [-67.8, -103.8], [-64.6, -99.1], [-57.8, -103.5], [-51.2, -107.2], [-49.7, -104.4], [-43.0, -107.9], [-36.1, -110.3], [-34.5, -106.0], [-28.3, -108.1], [-21.5, -109.7], [-11.3, -111.6], [-0.2, -111.8], [11.7, -111.4], [21.0, -110.1]];

// The hotel's glass terraces on the north end, OSM building:part ways with their mapped
// heights (metres above grade). They stand on the 32 m concrete ring and rise above it.
export const HOTEL = [
  { way: 1104121997, top: 53, ring: [[-40.6, -103.9], [-34.5, -106.0], [-28.3, -108.1], [-21.5, -109.7], [-11.3, -111.6], [-0.2, -111.8], [11.7, -111.4], [21.0, -110.1], [29.2, -108.1], [34.8, -106.5], [40.7, -104.3], [48.8, -100.6], [44.8, -91.8], [43.8, -90.0], [31.7, -95.2], [19.0, -98.7], [6.3, -100.5], [-5.9, -100.4], [-19.2, -98.3], [-31.4, -94.7], [-43.2, -89.8], [-44.3, -91.6], [-48.5, -100.2]] },
  { way: 1104121996, top: 41, ring: [[34.8, -106.5], [36.3, -110.7], [43.8, -107.9], [49.9, -105.3], [56.8, -101.6], [63.7, -97.3], [55.9, -85.9], [44.8, -91.8], [48.8, -100.6], [40.7, -104.3]] },
  { way: 1104121998, top: 41, ring: [[-63.4, -96.7], [-56.9, -100.8], [-49.7, -104.4], [-43.0, -107.9], [-36.1, -110.3], [-34.5, -106.0], [-40.6, -103.9], [-48.5, -100.2], [-44.3, -91.6], [-55.4, -84.9]] },
  { way: 1104121995, top: 38, ring: [[49.9, -105.3], [51.1, -107.9], [58.8, -103.9], [64.6, -100.4], [72.0, -94.9], [79.6, -88.4], [85.6, -82.4], [88.3, -79.7], [94.4, -71.9], [96.6, -65.1], [89.8, -62.0], [92.3, -56.7], [86.8, -53.6], [83.4, -58.9], [75.7, -69.0], [66.1, -77.9], [55.9, -85.9], [63.7, -97.3], [56.8, -101.6]] },
  { way: 1104122005, top: 38, ring: [[-86.2, -52.7], [-91.7, -55.7], [-89.0, -60.9], [-96.2, -64.2], [-93.8, -71.3], [-85.1, -81.5], [-76.5, -90.1], [-64.6, -99.1], [-57.8, -103.5], [-51.2, -107.2], [-49.7, -104.4], [-56.9, -100.8], [-63.4, -96.7], [-55.4, -84.9], [-65.8, -76.9], [-75.1, -67.6], [-83.1, -57.3]] },
];

// Heights (metres above grade, y = 0 at the street and concourse). The concrete ring is
// 32 m in the OSM parts and the crown is the published and mapped 86 m. Two distant
// photographs (Toronto Islands, the CN Tower as the scale bar) put the crown about 55 m
// over the top of the concrete wall, which agrees with 86 m over a 32 m ring
// (docs/3d-toronto-rogers-centre.md).
export const RING_TOP = 32;

// The closed retractable roof. Four panels along the rails (v runs the length of the
// stadium): the fixed north cap, two sliding arch panels and the rotating south cap.
// Panels nest, so each one further north stands proud of its southern neighbour by
// `lap`; every step faces south. R is the mapped roof radius (a circle fitted to the OSM
// dome part, 97.7-98.5 m); the rails sit further out, at railU.
export const ROOF = {
  R: 99, crown: 86, crownV: -8,
  spring: 33,        // roof edge on the south, east and west, just above the ring top
  hotelSpring: 53,   // north end: the roof edge rests on the hotel terraces (53 m part)
  k: 0.15,           // 0 = parabola; larger = rounder dome (slope at the springing)
  seams: [-52, 0, 52], // v of the joints between the four panels (rails run about -52..52)
  laps: [4.5, 0, -4.5, -9], // north cap, arch 2, arch 3, south cap
  railU: 105, railV: 52,
};
