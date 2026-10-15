// Plan of the Stantec Tower block in model metres (+X east, +Z south) around SPEC.origin, from OSM ways 512154307
// (shaft), 512154306 (125.4 m block) and 476797578 / 512154308 (16.8 m podium), read at 1 decimal from the
// dossier extract. Derived data © OpenStreetMap contributors, ODbL 1.0.

// The 250.8 m shaft: a 20.5 x 52 m slab, long axis within a degree of north-south (the mapped colinear node on the south side is dropped).
export const SHAFT = [[9.7, 20.7], [-10.8, 20.6], [-9.8, -31.1], [10.2, -30.9]];

// The 125.4 m block MINUS the shaft: it wraps the shaft's east and south-east sides. The first two points lie on the shaft's walls.
export const SHOULDER = [[9.7, 20.7], [0.7, 20.7], [0.6, 28.1], [26.4, 28.2], [29, -35.7], [27.7, -37.1], [14.8, -37.3], [13.5, -30.8], [10.2, -30.9]];
// Edges of SHOULDER that coincide with the shaft's walls (index i is the edge from point i to i + 1): they are internal.
export const SHOULDER_SHARED = [0, 8];

// The 16.8 m podium. It reaches 67 m west of the shaft with a curved north-west plaza face, and has a notch on the south side.
export const PODIUM = [
  [-67, 0], [-66.5, -2.4], [-65.8, -4.2], [-65, -5.9], [-63.5, -7.6], [-47.8, -21.1], [-45.8, -22.5], [-43.2, -23.9],
  [-25.2, -31.7], [-20.6, -33.4], [-14.3, -35.1], [-8.7, -36.2], [-2.3, -37], [2.7, -37.3], [8.3, -37.6], [11.4, -37.8],
  [11.4, -39.8], [30, -39.5], [29.5, 32.4], [0.5, 32.2], [0.6, 28.1], [0.7, 20.7], [-3.2, 20.7], [-10.8, 20.6],
  [-11.3, 20.6], [-11.3, 32.4], [-67.3, 31.9], [-67.2, 20.9], [-67.2, 18.8], [-67.2, 17], [-67.1, 4.8], [-67.1, 2.3],
];
