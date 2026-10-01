// Site frame for SFMOMA, measured from OpenStreetMap (read 2026-10-01) and put in the model frame:
// +X east, +Y up, +Z south, origin = area centroid of the OSM hull (way 41692824).
//
// Design frame (u, v, y): u runs along Third Street toward the south-east, v runs inward (north-east,
// away from Third Street), y is up, and (0, 0) is the north-west end of the Third Street frontage (the
// Third and Minna corner). The street grid is not cardinal: u bears 135.4 degrees, v bears 45.4 degrees,
// measured from the two long edges of the mapped Botta body (65.2 m frontage and the 56.9 m back wall).
// The rotation is baked here: nothing downstream rotates the model.
const A = [-61.09, 2.49];   // OSM hull vertex 0, local metres from the origin: north-west frontage corner
const B = [-15.30, 48.92];  // OSM hull vertex 1: south-east frontage corner (65.2 m away)
const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
export const U = [(B[0] - A[0]) / L, (B[1] - A[1]) / L];
export const V = [U[1], -U[0]];
export const GRID_DEG = Math.atan2(U[0], -U[1]) * 180 / Math.PI;
export const uv = (u, v) => [A[0] + u * U[0] + v * V[0], A[1] + u * U[1] + v * V[1]];
export const F = (u, y, v) => { const [x, z] = uv(u, v); return [x, y, z]; };
export const xzToUv = (x, z) => [(x - A[0]) * U[0] + (z - A[1]) * U[1], (x - A[0]) * V[0] + (z - A[1]) * V[1]];

// Botta's building (1995). Plan from OSM parts 1365384415/10/12/13/14.
export const BOTTA = {
  w: 65.2, depth: 49.0,
  glassV: 3.0,                  // recessed glazing line of the ground floor
  groundH: 6.2,                 // ground storey (estimate from the night photograph)
  t1: { v1: 11.0, top: 19.5 },  // front wall, estimated
  band: { top: 24.5 },          // second tier: full-width band behind the front wall (the wings stop here), estimated
  t2: { top: 29.5, u: [8.1, 52.7] }, // third tier over the middle 44.6 m, estimated
  t3: { v0: 34.8, top: 40.5 },  // the two end towers (OSM parts 412/413 start at v 34.8)
  towers: [[8.1, 18.7], [42.6, 52.7]],  // brick part of each tower (OSM squares 8.1-22.5 and 38.9-52.7, inner slit glazed)
  slit: [18.7, 42.6],           // the dark block between the towers, behind the turret
  notch: [26.1, 35.1],          // the notch in the second tier through which the turret shows
  columns: [3.5, 16.2, 28.9, 41.6, 54.3],
  slotU: [30.0, 31.2],
  turret: { u: 30.6, v: 31.1, r: 9.57, rIn: 6.6, y0: 19.5, low: 27.6, slope: 0.95 },
};

// Snohetta's expansion (2016). Plan from OSM part 1365384411 and the annex 1365384416.
export const EXP = {
  sw: [[0, 49.0], [65.2, 49.0], [108.6, 49.1]],                 // face toward Third Street / Natoma
  se: [[108.6, 49.1], [108.1, 75.7]],                           // end wall toward Howard Street
  ne: [[108.1, 75.7], [88.7, 77.6], [68.7, 79.4], [48.8, 80.0], [40.7, 80.1], [27.1, 79.1], [15.1, 78.3], [-0.4, 76.8]],
  nw: [[-0.4, 76.8], [0, 49.0]],                                // end wall toward Minna Street
  annex: [[-0.4, 76.8], [-0.5, 84.3], [14.9, 84.5], [48.8, 84.8], [48.8, 80.0], [40.7, 80.1], [27.1, 79.1], [15.1, 78.3]],
  annexTop: 10.5,
  // roof height along u (estimate: 46 m at the Minna end, 62 m sourced at the Howard end)
  top: [[-0.5, 46], [8, 50], [22, 54], [45, 57.5], [65, 60.5], [85, 62], [109, 62]],
  ledge: 45.8,                                                  // the smooth lower white wall seen from Third Street ends here
};

export function lerpTable(table, x) {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) if (x <= table[i][0]) { const [x0, y0] = table[i - 1], [x1, y1] = table[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); }
  return table[table.length - 1][1];
}
export const expTop = (u) => lerpTable(EXP.top, u);
