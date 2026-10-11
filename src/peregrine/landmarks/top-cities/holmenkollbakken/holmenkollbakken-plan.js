// Holmenkollbakken plan, in real metres. No Three.js.
//
// +u is downhill along OSM way 81176913 (the K120 centreline), +v is the
// jumper's right, +y is up. u = 0 is the take-off lip. y = 0 is the outrun,
// the flat Cityscape stand-in for the bottom of the bowl. The lip is placed so
// the back of the start deck lands on centreline point A.
//
// Inrun: 2022 FIS certificate (e = 95.65 m, 36° to an 11° table, r1 = 108.80 m,
// t = 6.60 m). Landing: the same certificate's angles along the slope (35.7° at
// P, 33.2° at K, 30.8° at L) with the start grade chosen so K is 59.10 m below
// the lip. Widths follow the mapped pitch and the steel slices, which are
// narrower than the 25.2 m K-width up high. Screen height and the 64 m tower
// are the 2010 faktaark.

import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';

const A_LL = [10.6645082, 59.9649524];
const C_LL = [10.6702897, 59.9632686];
const PLATFORM = 8.2; // flat deck uphill of the gate, kept inside the narrow top slice

export const CERT = {
  e: 95.65, r1: 108.8, table: 6.6, gamma: 36, alpha: 11,
  takeoff: 3, h: 59.1, n: 103.7, betaP: 35.7, betaK: 33.2, betaL: 30.8,
  k: 120, hs: 134, p: 105.6, trackW: 2.77, widthK: 25.2, tower: 64,
  screenLip: 2, screenMax: 12,
};

const rad = (d) => d * Math.PI / 180;
const DEG = 180 / Math.PI;
const round7 = (v) => Math.round(v * 1e7) / 1e7;

function groundAt(origin, lng, lat) {
  const k = mercStretch(origin[1]);
  return [
    (lngToMercX(lng) - lngToMercX(origin[0])) / k,
    (-latToMercY(lat) + latToMercY(origin[1])) / k,
  ];
}

const axis = groundAt(A_LL, C_LL[0], C_LL[1]);
const axisLen = Math.hypot(axis[0], axis[1]);
const D = [axis[0] / axisLen, axis[1] / axisLen];
const R = [-D[1], D[0]]; // jumper's right = forward × up
export const BEARING = Math.atan2(D[0], -D[1]) * DEG;
export const D_HAT = D;
export const R_HAT = R;

const GAMMA = rad(CERT.gamma), ALPHA = rad(CERT.alpha);
const ARC = CERT.r1 * (GAMMA - ALPHA);
const STRAIGHT = CERT.e - ARC - CERT.table;

function inrunAngle(s) {
  if (s <= STRAIGHT) return GAMMA;
  if (s >= STRAIGHT + ARC) return ALPHA;
  return GAMMA - (GAMMA - ALPHA) * ((s - STRAIGHT) / ARC);
}

const raw = [];
{
  let u = 0, y = 0, s = 0, ds = 0.05;
  raw.push({ s, u, y });
  while (s < CERT.e - 1e-9) {
    const step = Math.min(ds, CERT.e - s);
    const a = inrunAngle(s + step / 2);
    u += Math.cos(a) * step;
    y -= Math.sin(a) * step;
    s = Math.min(CERT.e, s + step);
    raw.push({ s, u, y });
  }
}
const lipU = raw[raw.length - 1].u;
const lipDrop = -raw[raw.length - 1].y;

// Landing, integrated along the slope. b0 is the only free grade: pick it so
// the drop from the snow (3 m under the lip) to K is 56.10 m.
function landAngle(w, b0) {
  const knots = [[0, b0], [CERT.p, CERT.betaP], [CERT.k, CERT.betaK], [CERT.hs, CERT.betaL], [172, 5], [214, 0]];
  if (w <= 0) return b0;
  for (let i = 1; i < knots.length; i++) {
    if (w <= knots[i][0]) {
      const [w0, a0] = knots[i - 1], [w1, a1] = knots[i];
      return a0 + (a1 - a0) * ((w - w0) / (w1 - w0));
    }
  }
  return 0;
}
function integrateLand(b0) {
  const pts = [{ u: 0, y: 0, w: 0, ang: b0 }];
  let u = 0, y = 0, w = 0;
  const ds = 0.5;
  while (w < 214 - 1e-9) {
    const a = rad(landAngle(w + ds / 2, b0));
    u += Math.cos(a) * ds;
    y -= Math.sin(a) * ds;
    w += ds;
    pts.push({ u, y, w, ang: landAngle(w, b0) });
  }
  return pts;
}
function dropAtK(b0) {
  const pts = integrateLand(b0);
  let best = pts[0];
  for (const p of pts) if (Math.abs(p.w - CERT.k) < Math.abs(best.w - CERT.k)) best = p;
  return -best.y;
}
let loB = 16, hiB = 28;
for (let i = 0; i < 24; i++) {
  const mid = (loB + hiB) / 2;
  if (dropAtK(mid) < CERT.h - CERT.takeoff) loB = mid; else hiB = mid;
}
const B0 = (loB + hiB) / 2;
const landRaw = integrateLand(B0);
const kPt = landRaw.reduce((a, p) => Math.abs(p.w - CERT.k) < Math.abs(a.w - CERT.k) ? p : a, landRaw[0]);
const fullDrop = -landRaw[landRaw.length - 1].y;
export const LIP_Y = CERT.takeoff + fullDrop + 0.45;
const land = landRaw.map((p) => ({ u: p.u, y: p.y + (LIP_Y - CERT.takeoff), w: p.w, ang: p.ang }));

export const K_U = kPt.u;
export const FLAT_U = land[land.length - 1].u;
export const OUTRUN_U = FLAT_U + 16;

export function landingY(u) {
  if (u <= land[0].u) return land[0].y;
  const last = land[land.length - 1];
  if (u >= last.u) return last.y;
  let a = 0, c = land.length - 1;
  while (c - a > 1) {
    const m = (a + c) >> 1;
    if (land[m].u < u) a = m; else c = m;
  }
  const f = (u - land[a].u) / (land[c].u - land[a].u || 1);
  return land[a].y + (land[c].y - land[a].y) * f;
}
export function landingSlope(u) {
  if (u <= land[0].u || u >= land[land.length - 1].u) return 0;
  let a = 0, c = land.length - 1;
  while (c - a > 1) {
    const m = (a + c) >> 1;
    if (land[m].u < u) a = m; else c = m;
  }
  return (land[c].y - land[a].y) / (land[c].u - land[a].u || 1);
}

// Snow half-width, inside mapped pitch 81176911. The pitch is ~11 m wide at
// the top and about 25 m near K (the certificate's 25.2 m); below the knoll
// it narrows again, so the outrun snow narrows with it.
export function landingHalf(u) {
  if (u <= 16) return 5.0;
  if (u <= 32) return 5.0 + 2.85 * ((u - 16) / 16);
  if (u <= 70) return 7.85 + 3.5 * ((u - 32) / 38);
  if (u <= 125) return 11.35 + 1.05 * ((u - 70) / 55);
  if (u <= 175) return 12.4 - 2.4 * ((u - 125) / 50);
  return 10;
}

// Blade half-width inside the metal slices: ±4.5 m up the tower, ±7 m at the lip.
export function bladeHalf(u) {
  if (u < -28) return 4.25;
  if (u < -6) return 4.25 + 2.7 * ((u + 28) / 22);
  return 6.95 - 0.7 * Math.min(1, (u + 6) / 10);
}

function parabola(y0, t1, y1, y2) {
  const c = ((y1 - y0) / t1 - (y2 - y0)) / (t1 - 1);
  const b = (y2 - y0) - c;
  return (t) => y0 + b * t + c * t * t;
}
const screenOf = parabola(8, 0.4, CERT.screenMax, CERT.screenLip);
const depthOf = parabola(2.15, 0.5, 3.15, 1.55);
export function screenH(s) { return screenOf(Math.max(0, Math.min(1, s / CERT.e))); }
export function depthW(s) { return depthOf(Math.max(0, Math.min(1, s / CERT.e))); }

const backDist = lipU + PLATFORM;
const kA = mercStretch(A_LL[1]);
export const ORIGIN = [
  round7(mercXToLng(lngToMercX(A_LL[0]) + backDist * D[0] * kA)),
  round7(mercYToLat(latToMercY(A_LL[1]) - backDist * D[1] * kA)),
];

export function world(u, v, y = 0) {
  return [u * D[0] + v * R[0], y, u * D[1] + v * R[1]];
}
export function toUV(x, z) {
  return [x * D[0] + z * D[1], x * R[0] + z * R[1]];
}
export function lngLat(u, v) {
  const [x, z] = [u * D[0] + v * R[0], u * D[1] + v * R[1]];
  const k = mercStretch(ORIGIN[1]);
  return [
    round7(mercXToLng(lngToMercX(ORIGIN[0]) + x * k)),
    round7(mercYToLat(latToMercY(ORIGIN[1]) - z * k)),
  ];
}
export function uvOfLngLat(lng, lat) {
  const k = mercStretch(ORIGIN[1]);
  const x = (lngToMercX(lng) - lngToMercX(ORIGIN[0])) / k;
  const z = (-latToMercY(lat) + latToMercY(ORIGIN[1])) / k;
  return toUV(x, z);
}

export function inrunAt(s) {
  const t = Math.max(0, Math.min(CERT.e, s));
  let i = 1;
  while (i < raw.length - 1 && raw[i].s < t) i++;
  const a = raw[i - 1], c = raw[i];
  const f = (t - a.s) / (c.s - a.s || 1);
  const u = a.u + (c.u - a.u) * f - lipU;
  const y = LIP_Y + lipDrop + a.y + (c.y - a.y) * f;
  return { s: t, u, y, ang: inrunAngle(t), half: bladeHalf(u), screen: screenH(t), depth: depthW(t) };
}

export const INRUN = [];
for (let s = 0; s <= CERT.e + 1e-6; s += 1.85) INRUN.push(inrunAt(Math.min(CERT.e, s)));
if (INRUN[INRUN.length - 1].s < CERT.e - 0.05) INRUN.push(inrunAt(CERT.e));

export const GATE = { u: -lipU, y: LIP_Y + lipDrop, s: 0 };
export const HOUSE = {
  u0: -lipU - 7.4,
  u1: -lipU - 0.3,
  v: 3.55,
  floor: GATE.y + 0.42,
  roof: GATE.y + 7.55,
};
HOUSE.rail = HOUSE.roof + 1.05;
HOUSE.grate = HOUSE.rail - CERT.tower;
export const CROWN = HOUSE.rail;

// Front wind-screen truss. Shallow in elevation: the crown sits just above
// the snow at the top of the landing and the feet drop `sag` metres. The
// foot height is NOT landingY — the hill falls ~20 m between crown and foot,
// and adding that fall turned the screen into a semicircle. Feet land on the
// mapped flares (u ≈ 62, v ≈ ±30).
export const ARCH = { uCrown: 18, uFoot: 62, v: 30, sag: 10, depth: 3.4 };

export function archNode(t, upper) {
  const v = -ARCH.v + 2 * ARCH.v * t;
  const k = 1 - (v / ARCH.v) ** 2;
  const u = ARCH.uFoot + (ARCH.uCrown - ARCH.uFoot) * k;
  const crown = landingY(ARCH.uCrown) + 3.6;
  const y = crown - ARCH.sag * (1 - k) + (upper ? ARCH.depth * (0.7 + 0.3 * k) : 0);
  return { u, v, y };
}

// Bowl stands, each a block that sits inside one mapped stand ring.
// sign +1 is the jumper's right. inner/outer are absolute v.
// Upper blocks are the 2010 stands beside the steep landing; the lower blocks
// are the outrun terraces (ways 173048162 / 173048163), which OSM draws as
// separate rings, so they are separate blocks.
export const STAND_BLOCKS = [
  { sign: -1, u0: 78, u1: 136, inner: 14.6, outer: 29 },
  { sign: -1, u0: 156, u1: 214, inner: 24, outer: 43 },
  { sign: 1, u0: 78, u1: 128, inner: 14.6, outer: 30 },
  { sign: 1, u0: 188, u1: 214, inner: 40, outer: 50 },
];

export const LETTER_U = 28;

export const PROFILE = {
  straight: STRAIGHT, arc: ARC, table: CERT.table, e: CERT.e, b0: B0,
  plan: lipU, drop: lipDrop, lipY: LIP_Y, gateU: GATE.u, gateY: GATE.y,
  crown: CROWN, grate: HOUSE.grate, flatU: FLAT_U, outrunU: OUTRUN_U,
  kU: K_U, kY: LIP_Y - CERT.h, bearing: BEARING, axis: axisLen,
};
