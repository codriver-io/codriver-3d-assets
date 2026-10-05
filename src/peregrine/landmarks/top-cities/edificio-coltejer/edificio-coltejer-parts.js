// Edificio Coltejer, Medellín. Plan frame and the heights the geometry and the tests share.
// Local metres, +X east, +Y up, +Z south, origin at the OSM footprint's area centroid.
//
// The mapped outline (way 31973359) is a 36.4 m × 29.1 m parallelogram, corners on the ring,
// plus a 13 m wing off the north-east long wall (206 m²). s runs the long walls (bearing
// 119.8°, the finned faces). t runs the short walls (bearing 29.5°, the white gable ends).
// s=0 is the west-north-west end, t=0 is the south-south-west long face.

export const ORIGIN = [-75.5660596, 6.2501496];

// Ring vertices 1, 0, 2, 6. Bilinear corners of the tower: (s,t) = (0,0), (1,0), (0,1), (1,1).
export const C00 = [-25.889, 5.871];
export const C10 = [5.682, 23.960];
export const C01 = [-11.205, -20.089];
export const C11 = [19.248, -0.953];

// Wing vertices between ring vertices 2 and 6 (the t=1 wall), already in this frame.
export const WING = [
  [5.117, -8.846],
  [12.022, -21.080],
  [25.744, -12.553],
];

export const LONG_M = 36.18; // mean of the two long edges
export const SHORT_M = 29.10;

// Published architectural height is 175 m to the cima (Wikipedia, Skyscraper Center,
// Spanish Wikipedia "altura arquitectónica"). The concrete ridge is that cima.
// The alcaldía's flagstaffs were added later and are about 14 m; these are 8 m, so the
// mesh tops out at 183 while SPEC.height stays the cited 175.
export const APEX_Y = 175;
export const EAVE_Y = 143.2; // top of the vertical shaft; the gables rise above this
export const PODIUM_Y = 14.2; // three commercial floors under the office shaft
export const SHAFT_FLOORS = 32;
export const FLOOR_H = (EAVE_Y - PODIUM_Y) / SHAFT_FLOORS; // 4.03125 m
export const SPANDREL = 0.82;
// Floor 34's east/west lookout. Short and wide: at this height the gable is ~12 m
// across, and a tall opening collapsed to a square in the first sheet.
export const EYE_Y0 = 160.8;
export const EYE_Y1 = 162.6;
export const EYE_HALF_T = 0.22; // half-width in the unshrunk t parameter
export const POLE_TOP = 183;

export const CENTER = [-3.041, 2.197]; // plan centroid of the four tower corners

// Outward horizontals (unit, x east / z south), from the bilinear edges.
export const OUT_T0 = [-0.4857, 0.8741]; // long finned face, bearing ~210°
export const OUT_S0 = [-0.8574, -0.5146]; // gable end, bearing ~301°

export function plan(s, t) {
  const a = (1 - s) * (1 - t), b = s * (1 - t), c = (1 - s) * t, d = s * t;
  return [
    a * C00[0] + b * C10[0] + c * C01[0] + d * C11[0],
    a * C00[1] + b * C10[1] + c * C01[1] + d * C11[1],
  ];
}

// Shaft tapers 4.5% from the podium to the eave (the published "no two floors alike").
export function taper(y) {
  if (y <= PODIUM_Y) return 1;
  const f = Math.min(1, (y - PODIUM_Y) / (EAVE_Y - PODIUM_Y));
  return 1 - 0.045 * f;
}

export function xyz(s, t, y) {
  const k = taper(y);
  const [x, z] = plan(0.5 + (s - 0.5) * k, 0.5 + (t - 0.5) * k);
  return [x, y, z];
}

// Crown: t closes on 0.5 as y goes from the eave to the ridge, so each end becomes a needle.
export function crown(s, t, y) {
  const f = Math.max(0, Math.min(1, (y - EAVE_Y) / (APEX_Y - EAVE_Y)));
  return xyz(s, 0.5 + (t - 0.5) * (1 - f), y);
}

export function add(p, dir, metres) {
  return [p[0] + dir[0] * metres, p[1] + (dir[1] || 0) * metres, p[2] + dir[2] * metres];
}

export function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

export function norm(v) {
  const L = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / L, v[1] / L, v[2] / L];
}
