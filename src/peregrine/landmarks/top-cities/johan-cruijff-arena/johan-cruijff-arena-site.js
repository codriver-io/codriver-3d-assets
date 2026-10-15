// Plan frame of the ArenA. The model is authored in (u, y, v): u along the pitch's long axis (bearing
// 151 degrees, toward the SSE), v across it (bearing 61 degrees, toward the ENE), y up. site() rotates it
// into the exported +X east, +Y up, +Z south. Axes measured from OSM way 57853514 (the pitch, 105 x 68 m
// plus run-off) and the outline of way 57853253.
const TH = (151 * Math.PI) / 180;
const SU = [Math.sin(TH), Math.cos(TH) * -1], SV = [Math.sin(TH - Math.PI / 2), -Math.cos(TH - Math.PI / 2)];
export const site = (u, y, v) => [u * SU[0] + v * SV[0], y, u * SU[1] + v * SV[1]];
export const unsite = (x, z) => [x * SU[0] + z * SU[1], x * SV[0] + z * SV[1]];

// The bowl is a superellipse (exponent 2.5): flat ends, rounded corners, centred 2 m toward +v of the pitch.
export const BOWL = { cv: 2, n: 2.5 };
export const RINGS = {
  ground: { a: 99, b: 80 },   // recessed ground-storey glazing
  wall: { a: 104, b: 85 },    // facade above the promenade deck
  eave: { a: 106.5, b: 87.5 }, // roof edge
  deck: { a: 111, b: 92 },    // promenade deck edge
  foot: { a: 111.6, b: 91.6 },  // strut feet
};
export const LEVELS = { deck: 9.6, deckBottom: 8.4, ledge: 25.8, roofRim: 33 };

// A point on a superellipse of half-axes a, b (x = cos^(2/n), z = sin^(2/n)), centred (0, cv).
export function seAt(a, b, t, scale = 1) {
  const c = Math.cos(t), s = Math.sin(t), e = 2 / BOWL.n;
  return [scale * a * Math.sign(c) * Math.abs(c) ** e, BOWL.cv + scale * b * Math.sign(s) * Math.abs(s) ** e];
}
export const seRing = (ring, count, scale = 1) => Array.from({ length: count }, (_, i) => seAt(ring.a, ring.b, (i / count) * Math.PI * 2, scale));

// ---- roof ---------------------------------------------------------------------------------------------
// Two sliding panels run between the arches (|v - cv| < ARCH.half); beyond them the fixed roof falls to the
// eave on the long sides, and the panels' parking ends fall away more gently.
export const ROOF = { rise: 22, plateauV: 42, outerV: 86, plateauU: 62, endU: 104, endKeep: 0.22 };
const smooth = (t) => t * t * (3 - 2 * t);
export function roofY(u, v) {
  const vr = Math.abs(v - BOWL.cv), au = Math.abs(u);
  const tv = Math.min(1, Math.max(0, (ROOF.outerV - vr) / (ROOF.outerV - ROOF.plateauV)));
  const f = 0.5 * tv + 0.5 * smooth(tv);
  const tu = Math.min(1, Math.max(0, (au - ROOF.plateauU) / (ROOF.endU - ROOF.plateauU)));
  const e = 1 - (1 - ROOF.endKeep) * smooth(tu);
  return LEVELS.roofRim + ROOF.rise * f * e;
}

// ---- the two arches ------------------------------------------------------------------------------------
// Each arch is a vertical truss in the plane v = cv +- half, spanning footU to -footU between the corner
// masts, crowning at the published 75 m.
export const ARCH = {
  half: 42, footU: 101, topFoot: 48, crown: 74.2,
  depthFoot: 3.6, depthCrown: 7.2, panels: 26, panelsFar: 13, bottomHalfWidth: 2.2,
};
const R_ARCH = (ARCH.footU ** 2 + (ARCH.crown - ARCH.topFoot) ** 2) / (2 * (ARCH.crown - ARCH.topFoot));
export const archTop = (u) => ARCH.crown - (R_ARCH - Math.sqrt(R_ARCH * R_ARCH - u * u));
export const archDepth = (u) => ARCH.depthFoot + (ARCH.depthCrown - ARCH.depthFoot) * (1 - (u / ARCH.footU) ** 2);
export const archBottom = (u) => archTop(u) - archDepth(u);
export const ARCH_V = [BOWL.cv - ARCH.half, BOWL.cv + ARCH.half];

// Corner masts: a tall one under the arch foot and a shorter one just outside, both on a grey core.
export const MAST = { tall: 49.5, short: 42, core: { u: 102.5, du: 9, dv: 8, top: 17 }, tallU: 101, shortU: 106 };
