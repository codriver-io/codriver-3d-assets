// Palacio Real de Madrid — plan in metres, building frame.
// +u east along the facades, +v south (out of the Plaza de la Armería front), y up.
// World: x = u cos TH − v sin TH, z = u sin TH + v cos TH. TH is the mapped wall bearing
// (the long walls run 4.7° east of north). Origin is the main-block centre; see config.js.
//
// Planes are the stone face, 0.95 m inside the outer ring of OSM relation 30399, measured
// in mercator metres (lngToMercX / latToMercY / mercStretch). A cornice 0.68 m proud of
// the stone then stays ~0.27 m inside the ring. The published side is ~131 m; the mapped
// square is 129.6 m north–south and 129.9 m east–west.

export const TH = 4.70 * Math.PI / 180;
const COS = Math.cos(TH), SIN = Math.sin(TH);

export function world(u, y, v) {
  return [u * COS - v * SIN, y, u * SIN + v * COS];
}

export function worldDir(ou, ov) {
  const [x, , z] = world(ou, 0, ov);
  return [x, 0, z];
}

// Courtyard hole (way 151240796). Inner face of the four ranges.
export const COURT = { u0: -26.13, u1: 25.13, v0: -31.02, v1: 20.17 };

// Facade runs. axis 'v' = a wall of constant v (north/south front); 'u' = constant u.
// `face` is the stone plane. `out` is the sign of the outward normal on that axis.
// `t0`/`t1` run along the wall. `gate` is the Prince's Gate bay.
export const WALLS = [
  // North, Sabatini gardens. Corner pavilions and a centre bay project ~5.4 m.
  { id: 'n-nw', axis: 'v', face: -65.37, out: -1, t0: -64.3, t1: -42.3 },
  { id: 'n-rw', axis: 'v', face: -60.11, out: -1, t0: -41.7, t1: -17.5 },
  { id: 'n-ct', axis: 'v', face: -65.57, out: -1, t0: -16.5, t1: 15.1 },
  { id: 'n-re', axis: 'v', face: -60.47, out: -1, t0: 16.2, t1: 39.9 },
  { id: 'n-ne', axis: 'v', face: -65.79, out: -1, t0: 41.2, t1: 62.6 },
  // South, Plaza de la Armería. End pavilions project; the gate is a shallow centre bay.
  { id: 's-sw', axis: 'v', face: 65.91, out: 1, t0: -53.3, t1: -41.8 },
  // The long south wall is mapped at v ≈ 61.8, with 2 m bites beside the gate.
  // Stone sits at 60.55 so a 0.68 m cornice clears those bites.
  { id: 's-wl', axis: 'v', face: 60.55, out: 1, t0: -40.8, t1: -12.5 },
  { id: 's-ct', axis: 'v', face: 60.55, out: 1, t0: -12.5, t1: 12.5, gate: true },
  { id: 's-wr', axis: 'v', face: 60.55, out: 1, t0: 12.5, t1: 40.5 },
  { id: 's-se', axis: 'v', face: 65.73, out: 1, t0: 41.5, t1: 53.7 },
  // East, Plaza de Oriente.
  { id: 'e-ne', axis: 'u', face: 63.03, out: 1, t0: -65.6, t1: -41.4 },
  { id: 'e-w', axis: 'u', face: 56.85, out: 1, t0: -40.4, t1: 40.2 },
  { id: 'e-se', axis: 'u', face: 63.55, out: 1, t0: 41.0, t1: 60.3 },
  // West, Campo del Moro.
  { id: 'w-nw', axis: 'u', face: -64.47, out: -1, t0: -65.2, t1: -40.6 },
  { id: 'w-w', axis: 'u', face: -57.35, out: -1, t0: -39.9, t1: 40.7 },
  { id: 'w-sw', axis: 'u', face: -63.91, out: -1, t0: 41.2, t1: 61.1 },
];

// Cheeks where a pavilion steps back to the recessed wall. Short, so no windows.
// Cheeks at the pavilion steps. `face` is 0.95 m inside the mapped step so the
// cornice, proud of that face, still lands inside the ring.
export const RETURNS = [
  { axis: 'u', face: -42.93, out: 1, t0: -65.1, t1: -60.4 }, // NW, east cheek
  { axis: 'u', face: -16.21, out: -1, t0: -65.3, t1: -60.4 }, // north centre, west cheek
  { axis: 'u', face: 14.66, out: 1, t0: -65.3, t1: -60.7 }, // north centre, east cheek
  { axis: 'u', face: 41.29, out: -1, t0: -65.5, t1: -60.7 }, // NE, west cheek
  { axis: 'u', face: -42.35, out: 1, t0: 60.8, t1: 65.5 }, // SW end pavilion, east cheek
  { axis: 'u', face: 41.93, out: -1, t0: 60.8, t1: 65.3 }, // SE end pavilion, west cheek
  { axis: 'v', face: -42.03, out: 1, t0: 57.2, t1: 62.6 }, // NE, south cheek
  { axis: 'v', face: 41.55, out: -1, t0: 57.2, t1: 63.0 }, // SE, north cheek
  { axis: 'v', face: -41.32, out: 1, t0: -64.1, t1: -58.1 }, // NW, south cheek
  { axis: 'v', face: 42.10, out: -1, t0: -63.2, t1: -58.0 }, // SW, north cheek
];

// Inner courtyard faces. `out` points into the court.
export const COURT_WALLS = [
  { id: 'c-n', axis: 'v', face: COURT.v0, out: 1, t0: COURT.u0, t1: COURT.u1 },
  { id: 'c-s', axis: 'v', face: COURT.v1, out: -1, t0: COURT.u0, t1: COURT.u1 },
  { id: 'c-e', axis: 'u', face: COURT.u1, out: -1, t0: COURT.v0, t1: COURT.v1 },
  { id: 'c-w', axis: 'u', face: COURT.u0, out: 1, t0: COURT.v0, t1: COURT.v1 },
];

// Full-height stone boxes [u0, u1, v0, v1]. They overlap so the seams are buried.
// None of them enters the courtyard rectangle. The gate opening is the gap between
// the two south jambs, from `GATE.back` to the south face.
export const MASSES = [
  [-64.47, -42.60, -65.37, -40.50], // NW pavilion
  [-57.70, -26.13, -60.11, -31.02], // north range, west of court
  [-16.90, 15.40, -65.57, -31.02], // north centre
  [25.13, 56.85, -60.47, -31.02], // north range, east of court
  [40.90, 63.03, -65.79, -41.40], // NE pavilion
  [25.13, 56.85, -31.02, 20.17], // east range
  [40.20, 56.85, 20.17, 40.20], // east range, south of court
  [41.20, 63.40, 41.10, 60.30], // SE pavilion
  [-57.35, -26.13, -31.02, 20.17], // west range
  [-57.35, -42.20, 20.17, 40.80], // west range, south of court
  [-63.70, -42.40, 41.40, 61.10], // SW pavilion
  [-53.20, -26.13, 20.17, 60.55], // south-west body
  [25.13, 53.60, 20.17, 60.55], // south-east body
  [-40.60, 40.40, 20.17, 54.85], // south range, behind the portal
  [-40.60, -4.35, 54.85, 60.55], // gate jamb, west
  [4.35, 40.40, 54.85, 60.55], // gate jamb, east
  [-53.20, -41.90, 59.40, 65.75], // south-west end pavilion
  [41.55, 53.60, 59.40, 65.55], // south-east end pavilion
];

// South galleries of the Plaza de la Armería. The west gallery steps in between
// v 124 and 164 (a mapped notch). `plaza` is the sign of +u toward the plaza;
// 0 skips the colonnade (junction pieces buried against the palace).
export const WINGS = [
  { id: 'east', u0: 55.90, u1: 80.90, v0: 68.2, v1: 206.8, plaza: -1 },
  { id: 'east-link', u0: 65.2, u1: 77.3, v0: 62.2, v1: 68.6, plaza: 0 },
  { id: 'west-link', u0: -80.1, u1: -64.9, v0: 63.6, v1: 68.2, plaza: 0 },
  { id: 'west-a', u0: -81.10, u1: -55.50, v0: 67.6, v1: 123.4, plaza: 1 },
  { id: 'west-b', u0: -60.50, u1: -55.50, v0: 122.8, v1: 163.6, plaza: 1 },
  { id: 'west-c', u0: -80.05, u1: -55.50, v0: 164.6, v1: 207.6, plaza: 1 },
];

export const H = {
  baseTop: 10.42,
  stone0: 10.62,
  string0: 10.22,
  string1: 10.8,
  wallTop: 31.55,
  cornice0: 29.85,
  cornice1: 31.82,
  bal0: 31.62,
  bal1: 33.2, // the published facade height, 33 m, is this balustrade
  statue0: 33.25,
  statueTop: 36.7,
  crownTop: 40.4,
  roofRidge: 36.6,
  wingTop: 11.5,
  wingRoof: 14.7,
};

// Window rows on the outer fronts. `glow` is the piano nobile.
export const ROWS = [
  { y0: 1.7, y1: 3.55, w: 2.05, mat: 'glass', base: true },
  { y0: 6.05, y1: 8.55, w: 2.15, mat: 'glass', base: true },
  { y0: 12.15, y1: 17.7, w: 2.65, mat: 'glow' },
  { y0: 20.9, y1: 24.85, w: 2.35, mat: 'glass' },
  { y0: 27.35, y1: 29.15, w: 1.7, mat: 'glass' },
];

export const PITCH = 5.15;

export function bayCenters(t0, t1, pitch = PITCH) {
  const span = t1 - t0;
  if (span < 3.2) return [];
  const n = Math.max(1, Math.round(span / pitch));
  const step = span / n;
  const out = [];
  for (let i = 0; i < n; i++) out.push(t0 + step * (i + 0.5));
  return out;
}

// Prince's Gate. The opening is cut through the south centre bay; the door sits
// on the portal back wall, about 5.7 m behind the stone face.
export const GATE = {
  uL: -4.35, uR: 4.35, spring: 4.7, radius: 4.35, crown: 9.05,
  face: 60.55, back: 54.85,
};
