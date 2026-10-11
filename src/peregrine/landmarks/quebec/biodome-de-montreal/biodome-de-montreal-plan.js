// Plan of the Biodôme roof in the model's local metres (+X east, +Y up, +Z south), origin at the
// area centroid of OSM way 26699302 (retrieved 2026-10-04, © OpenStreetMap contributors, ODbL 1.0),
// rounded to 0.1 m. The ring is the roof's edge as mapped; the model's boundary is this ring.
//
// The plan is a kite: four feet (the four abutments W, X, Y, Z of Taillibert's prestressed shell, "172 m
// balanced on four support points") joined by two concave arches on the stadium side (B-C, C-D) and two
// long convex edges at the back (D-A, A-B). It is mirror symmetric about the C->A axis, which runs
// south-west to north-east at bearing 45.8 degrees.
export const RING = [
  [15.4, 84.6], [15.4, 82.3], [15.5, 80.7], [16.3, 79.0],
  [17.4, 77.8], [18.8, 76.5], [26.5, 69.7], [32.3, 63.7],
  [37.1, 57.9], [41.6, 52.1], [45.8, 46.0], [50.2, 38.7],
  [54.2, 31.1], [58.7, 21.2], [62.4, 11.2], [65.6, -0.1],
  [68.0, -11.2], [69.5, -23.0], [70.2, -35.0], [70.1, -44.2],
  [69.5, -52.9], [69.0, -56.6], [69.0, -58.1], [69.1, -59.6],
  [69.6, -60.6], [70.1, -61.6], [70.8, -62.4], [71.5, -63.1],
  [71.2, -63.8], [71.7, -64.5], [71.0, -65.7], [70.4, -66.8],
  [69.8, -67.7], [69.1, -68.5], [68.2, -69.4], [67.1, -70.2],
  [65.9, -71.0], [64.6, -71.6], [64.1, -71.3], [63.0, -71.5],
  [62.4, -70.9], [61.8, -70.3], [60.6, -69.6], [59.2, -69.1],
  [56.5, -69.0], [51.4, -69.7], [44.6, -69.9], [37.1, -69.8],
  [27.1, -69.2], [17.2, -68.2], [6.2, -66.2], [-4.5, -63.3],
  [-16.3, -59.7], [-27.1, -55.2], [-35.5, -50.9], [-46.1, -44.7],
  [-55.5, -38.4], [-64.0, -32.0], [-68.1, -28.8], [-72.4, -25.4],
  [-75.4, -22.5], [-77.9, -19.7], [-81.4, -17.7], [-85.6, -17.8],
  [-87.5, -15.8], [-88.5, -14.0], [-88.3, -12.1], [-87.3, -9.5],
  [-82.2, -8.1], [-79.7, -5.4], [-78.9, -3.8], [-76.5, 0.3],
  [-72.0, 8.4], [-68.6, 16.9], [-65.7, 25.2], [-63.3, 32.7],
  [-61.5, 40.4], [-60.9, 44.6], [-60.3, 47.8], [-60.1, 51.5],
  [-63.4, 55.0], [-63.0, 56.8], [-61.9, 58.7], [-60.1, 60.0],
  [-57.6, 60.9], [-53.5, 57.2], [-51.8, 57.4], [-37.5, 60.9],
  [-29.6, 63.3], [-21.9, 66.1], [-13.4, 69.7], [-5.5, 73.6],
  [3.1, 78.7], [4.1, 79.8], [5.4, 81.2], [5.6, 83.4],
  [5.7, 85.0], [7.4, 86.1], [9.6, 86.7], [12.6, 86.4],
  [14.3, 85.7],
];
// Indices into RING of the four feet (the pointed abutment tips).
export const FEET = { A: 33, B: 65, C: 82, D: 99 };
// Long axis C -> A: bearing 45.8 degrees (clockwise from north); u runs toward A, v toward the D side.
export const AXIS = (() => {
  const a = Math.atan2(RING[FEET.A][1] - RING[FEET.C][1], RING[FEET.A][0] - RING[FEET.C][0]);
  return { angle: a, u: [Math.cos(a), Math.sin(a)], v: [-Math.sin(a), Math.cos(a)] };
})();
