// Royal Palace, Oslo (Det kongelige slott). Building frame in metres.
// +u runs along the south front (bearing 30°), +v faces Karl Johans gate (bearing 120°).
// Numbers are the mapped outline (relation 12267199) inset just inside the ring.
// Published sizes (kongehuset.no): main wing 100.8 × 24.1 × 23 m, wings 40.7 × 14.3 × 16 m, highest point 25 m.

const DEG = Math.PI / 180;
export const FRONT_BEARING = 120;
const U_BEARING = 30 * DEG;
const V_BEARING = FRONT_BEARING * DEG;
export const UX = Math.sin(U_BEARING), UZ = -Math.cos(U_BEARING);
export const VX = Math.sin(V_BEARING), VZ = -Math.cos(V_BEARING);

export function world(u, y, v) {
  return [u * UX + v * VX, y, u * UZ + v * VZ];
}
export function worldDir(du, dv) {
  return [du * UX + dv * VX, 0, du * UZ + dv * VZ];
}
export function toUV(x, y, z) {
  return { u: x * UX + z * UZ, y, v: x * VX + z * VZ };
}

// Main block. Walls are inset so the cornice stays inside the mapped ring.
// OSM outer span is 100.50 m along u; the front wall of the ring sits at v ≈ 22.2.
export const U0 = -49.4;
export const U1 = 49.7;
export const V_FRONT = 21.55;
// The mapped north wall sits at v ≈ −2.94. A wall at −2.55 leaves room for the
// court cornice and still gives the published 24.1 m depth (21.55 − −2.55).
export const V_BACK = -2.55;
// Centre of the north wall steps into the court (mapped, about 3 m).
export const RECESS = { u0: -11.7, u1: 12.0, v: -5.72 };

// Portico stylobate. The mapped projection runs to v ≈ 29.26 and u −12.50..12.89.
export const PORT = { u0: -12.42, u1: 12.7, vFront: 28.62 };

export const WING_W = { u0: -49.35, u1: -35.2, v0: -43.38, v1: -2.15 };
export const WING_E = { u0: 35.85, u1: 49.65, v0: -43.38, v1: -2.15 };

// Six Ionic columns on the portico front, from the mapped building:part centroids.
export const COL_U = [-11.81, -6.69, -1.49, 3.11, 7.56, 12.03];
export const COL_V = 28.55;
export const ANTAE_U = [-11.66, 12.36];
export const ANTAE_V = 22.74;

export const H = {
  wallTop: 19.85,
  baseTop: 7.4,
  string0: 7.22,
  string1: 8.08,
  mid0: 13.85,
  mid1: 14.55,
  cornice0: 19.62,
  cornice1: 21.18,
  parapet0: 21.02,
  parapet1: 22.55,
  eave: 21.35,
  ridge: 23.05,
  flag: 36.5,
  col0: 8.08,
  colShaft0: 8.42,
  colShaft1: 18.55,
  capital0: 18.42,
  capital1: 19.5,
  entab0: 19.38,
  entab1: 21.2,
  apex: 24.25,
  wingWall: 14.25,
  wingCorn0: 14.05,
  wingCorn1: 15.35,
  wingPar0: 15.2,
  wingPar1: 16.05,
  wingEave: 15.15,
  wingRidge: 16.55,
  balconyY: 8.04,
  balconyTop: 9.2,
};
