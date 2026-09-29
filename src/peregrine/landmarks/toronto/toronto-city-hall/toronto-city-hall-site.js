// Site data for Toronto City Hall, measured from OpenStreetMap (read 2026-09-29) and put in the
// model frame: +X east, +Y up, +Z south, origin = the chamber's central column.
//
// Two frames are used. POLAR: both towers and the chamber are concentric about the origin, so a tower
// is two curves r(theta) (theta measured from +X toward +Z, i.e. clockwise on a north-up map). SITE:
// the square is laid out on Toronto's street grid, which is rotated GRID degrees north of east; there
// u runs along the grid's east and v along its south, and every pool, arch, walkway and podium edge
// becomes axis-aligned (the OSM nodes agree to 0.3 m once rotated by 16.7 degrees).
export const GRID = 16.7 * Math.PI / 180;
const gc = Math.cos(GRID), gs = Math.sin(GRID);
// (u, v) on the grid -> model x, z
export const uv = (u, v) => [u * gc + v * gs, -u * gs + v * gc];
export const xzToUv = (x, z) => [x * gc - z * gs, x * gs + z * gc];
export const polar = (theta, r) => [r * Math.cos(theta * Math.PI / 180), r * Math.sin(theta * Math.PI / 180)];

// Piecewise-linear lookup in an ascending table [[x, y], ...], clamped at the ends.
export function lerpTable(table, x) {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    if (x <= table[i][0]) { const [x0, y0] = table[i - 1], [x1, y1] = table[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); }
  }
  return table[table.length - 1][1];
}

// Each tower is a crescent: OUTER = the ribbed convex back (OSM outer way 27767543 / 27767544), GLASS =
// the innermost plane facing the chamber (the inner strip ways 963504341 / 963504342). Tables are
// [theta, r] in degrees / metres; the east tower's angles are unwrapped past 360. `S` is the end that
// faces the square (south), `N` the far end; phi runs from S to N. Both towers have their ribbed
// pylon at S and a smooth end block at N (photographs), sectors in degrees of phi.
export const TOWERS = {
  west: {
    label: 'West Tower', roof: 79.4, floors: 20, thetaS: 127.4, dir: +1, span: 111.8,
    outer: [[127.6, 40.0], [128.5, 40.5], [136.5, 39.7], [145.4, 39.4], [152.7, 39.6], [160.4, 40.0], [170.8, 40.9], [180.4, 41.4],
      [190.8, 41.2], [199.5, 41.1], [210, 40.3], [223, 39.9], [235.9, 40.9], [238.6, 40.4], [239.1, 38.5]],
    glass: [[129.6, 30.9], [145.9, 29.2], [159.2, 28.8], [169.5, 28.8], [176.1, 28.8], [182.9, 28.7], [188.6, 28.7], [196.9, 28.7],
      [203.2, 28.9], [211.2, 29.1], [220.8, 29.4], [236.7, 31.2]],
    pylon: 15.5, slot: 4.5, block: 17,
    dark: [12, 13, 14], louvre: [18, 19],
  },
  east: {
    label: 'East Tower', roof: 99.5, floors: 27, thetaS: 390.9, dir: -1, span: 134.5,
    outer: [[256.4, 41.8], [258.9, 43.3], [268.8, 41.9], [281.8, 41.3], [292.4, 41.6], [301, 42.4], [308.9, 42.9], [314.6, 43.5],
      [319.6, 43.5], [325, 43.6], [329.9, 43.4], [335.8, 42.8], [342.2, 42.3], [348.4, 41.6], [355, 41.1], [359.8, 40.8],
      [364.4, 40.6], [372.2, 40.8], [380.1, 41.4], [389.2, 42.7], [390.9, 41.9]],
    glass: [[257.5, 33.8], [270.9, 31.0], [278.2, 30.1], [284.2, 29.6], [291.8, 29.4], [297.2, 29.5], [302.5, 29.3], [311, 29.4],
      [318.1, 29.4], [325.6, 29.3], [328.2, 29.2], [333.3, 29.3], [339.9, 29.3], [346.9, 29.3], [358.5, 29.3], [365.7, 29.7],
      [374.7, 30.6], [389.8, 33.0]],
    pylon: 14.8, slot: 4.3, block: 17,
    dark: [15, 16, 17], louvre: [25, 26],
  },
};
// Re-express a tower's tables in phi (degrees from the S end toward N) so both towers share one code path.
for (const t of Object.values(TOWERS)) {
  for (const key of ['outer', 'glass']) t[key] = t[key].map(([th, r]) => [Math.abs(th - t.thetaS), r]).sort((a, b) => a[0] - b[0]);
  t.theta = (phi) => t.thetaS + t.dir * phi;
  t.at = (phi, r) => polar(t.theta(phi), r);
  t.rOuter = (phi) => lerpTable(t.outer, phi);
  t.rGlass = (phi) => lerpTable(t.glass, phi);
}

// The chamber: saucer 23.7 m radius (OSM way 27767545), drum 13 m (963504345), column 3 m (293907515).
export const CHAMBER = { column: 3.0, drum: 13.2, saucer: 23.7, crown: 25, floor: 13 };

// The podium in site (u, v) from OSM way 198500761 (height 8 m): a rectangle u -57.3..57.5, v -58.6..50, plus
// the curved corner of the ceremonial ramp on the south-east. Counter-clockwise on the map is not needed:
// the prism helper accepts either winding.
export const PODIUM = {
  roof: 8,
  ring: [[57.5, -58.6], [57, 32.6], [56.2, 32.7], [55.1, 32.9], [55.1, 55], [55, 74.5], [53.2, 70.8], [49, 65.4], [45.2, 61.4],
    [41, 57.8], [35.8, 54.7], [31, 52.3], [26.5, 51], [20.5, 50.2], [6.8, 50.1], [-17.2, 49.9], [-57.3, 40], [-57.2, 21.5], [-56.8, -58.1]],
  // The colonnaded fronts: [from, to] along the ring, the fascia leans out over the walk.
  fronts: [[[-57.3, 40], [-17.2, 49.9]], [[-17.2, 49.9], [20.5, 50.2]]],
};
// Green podium roof beds (OSM leisure=garden, layer 1), site u/v.
export const ROOF_GARDENS = [
  [[-53.4, 23.5], [-47.7, 23.5], [-46.8, 22.2], [-37, 22.3], [-40.3, 15.5], [-42.2, 9.9], [-44, 1.8], [-47.3, 1.8], [-47.3, 2.6], [-53.6, 2.5]],
  [[44, -14.9], [52.9, -14.5], [52.5, 15.4], [48.5, 15.5], [48.3, 14.7], [40.4, 15], [43, 9], [44.7, 2.5], [45.4, -3.2], [45.5, -7.8], [45.1, -11.9]],
  [[-53.5, -0.3], [-51.7, -0.3], [-51.8, -1], [-44.5, -1], [-44.6, -4.7], [-44.2, -9.6], [-42.4, -15.6], [-40.1, -20.4], [-36.8, -24.7], [-51.4, -25], [-51.5, -24.2], [-53.8, -24]],
  [[4, -47.3], [33.2, -47.4], [33.2, -45.2], [52.9, -44.6], [52.8, -17.4], [49.2, -17.4], [49.1, -18.7], [43.1, -18.4], [38, -26.1], [29.6, -32.9], [20.3, -38.7], [10.4, -43.1], [3.8, -45.7]],
  [[4, -49.9], [41.3, -49.9], [41.3, -47.4], [53.1, -47.4], [53.1, -53.7], [4, -53.6]],
  [[-53.3, -44.8], [-39.4, -44.6], [-39.4, -47.4], [-12.7, -47.1], [-12.6, -53.7], [-53.2, -54.2]],
  [[34, 27.5], [52.9, 27.7], [52.4, 18.5], [41, 18.5], [41.1, 17.6], [39.6, 17.4], [37.3, 21.3]],
  [[-52.6, -42.2], [-32.3, -42.7], [-32.1, -44.8], [-12.6, -44.5], [-12.9, -42], [-25.9, -34], [-34.7, -27.3], [-53.3, -27.3]],
  [[-53.9, 25.6], [-35.6, 25.5], [-31.2, 34.3], [-37.7, 34.4], [-37.9, 36.8], [-29.7, 37], [-27, 42.4], [-53.7, 35.5]],
  [[-27.8, 25.2], [-20.1, 31.7], [-11, 35.8], [-1.1, 37.4], [8.9, 36.1], [8.7, 49.6], [-23.7, 43.1], [-33.2, 25]],
];

// Nathan Phillips Square, OSM in site (u, v): the reflecting pool (way 25795356: 54.6 x 30.2 m), the three
// Freedom Arches (ways 239620642 / 239620645 / 239620643, foot pairs), the TORONTO sign (way 851806479).
export const POOL = { u0: -19.7, u1: 34.9, v0: 129.9, v1: 160.1 };
export const ARCHES = [
  { u: 12.0, v0: 127.4, v1: 162.9 }, { u: 20.6, v0: 127.7, v1: 161.9 }, { u: 29.1, v0: 128.2, v1: 161.8 },
];
export const SIGN = { u0: -18.3, u1: 8.1, v: 127.5 };

// The elevated walkway (OSM way 27944798, bridge, level 1): a loop round the square's south half, and the
// ceremonial ramp's centre line (way 43605455, incline up) from the plaza at the pool's east end to the podium.
export const WALKWAY = [[-64.2, 60.8], [-64.4, 83.9], [-64.3, 134], [-64.7, 175.8], [-39, 175.5], [38.7, 175.1], [64.3, 175], [64.4, 115.5], [64.5, 47.3]];
export const RAMP = [[51, 123.6], [51.4, 91.1], [51, 86.1], [49.5, 80.4], [48.1, 76.9], [46.5, 74], [44.7, 71.4], [42.4, 68.8], [38.3, 64.9], [34, 61.9], [29.7, 59.8], [25.6, 58.1], [21.2, 56.8]];
