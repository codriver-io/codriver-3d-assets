// Bryggen quay frame. +u runs along the wharf toward the south-east (the right hand of
// someone on the quay facing the gables). +d runs inland, up the tenements, bearing 39.1°.
// The gables face the harbour, bearing 219.1°. y is up. Metres, east/up/south at SPEC.origin.
// Plan rectangles are inset from each mapped outline so shared walls do not touch.
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';

export const FRONT_BEARING = 129.1;
const front = (FRONT_BEARING * Math.PI) / 180;
const inland = front - Math.PI / 2;
/** Unit (x east, z south) along the quay toward the south-east, and inland (north-east). */
export const R = [Math.sin(front), -Math.cos(front)];
export const D = [Math.sin(inland), -Math.cos(inland)];
export const WATER = [-D[0], 0, -D[1]];
export const INLAND = [D[0], 0, D[1]];
export const RIGHT = [R[0], 0, R[1]];
export const UP = [0, 1, 0];
export const DOWN = [0, -1, 0];

const k = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]);
const oy = latToMercY(SPEC.origin[1]);

/** [lng, lat] -> [u along the quay, d inland]. */
export function toQuay(lng, lat) {
  const x = (lngToMercX(lng) - ox) / k;
  const z = (oy - latToMercY(lat)) / k;
  return [x * R[0] + z * R[1], x * D[0] + z * D[1]];
}
/** [u, d, y] -> [x east, y, z south]. No shear and no lean. */
export function toWorld(u, d, y = 0) {
  return [u * R[0] + d * D[0], y, u * R[1] + d * D[1]];
}

// ridge / roofH are metres. OSM `height` is the ridge; `roof:height` is the gable above the eave.
// body is the painted wall. shear is du/dd of a skewed outline (0 when the tenement is square
// to the quay). lean is a vertical settle, du per metre of height, alternating so the row
// does not stand like a new build. Ways 331274562 and 331274575 have no height or colour tag.
// Way 0 is the unmapped closure between 292320261 and 331274562: no waterfront polygon, but
// the quay photographs are one unbroken line, so the gap is filled with one estimated gable.
export const HOUSES = [
  { way: 488690084, body: 'brown', ridge: 16, roofH: 6, roof: 'roofDark', u0: -71.35, u1: -62.05, d0: -9.2, depth: 23, shear: -0.109, lean: 0.007 },
  { way: 331274578, body: 'ochre', ridge: 16, roofH: 6, roof: 'roof', u0: -60.94, u1: -51.7, d0: -9.38, depth: 18.3, shear: 0, lean: -0.006 },
  { way: 331274560, body: 'red', ridge: 13, roofH: 3, roof: 'roof', u0: -51.5, u1: -45.68, d0: -9.39, depth: 17.05, shear: 0, lean: 0.009 },
  { way: 331274567, body: 'brown', ridge: 16, roofH: 7, roof: 'roof', u0: -45.48, u1: -36.77, d0: -9.39, depth: 17.05, shear: 0, lean: -0.01 },
  { way: 292320260, body: 'white', ridge: 14, roofH: 5, roof: 'roof', u0: -36.57, u1: -29.2, d0: -9.39, depth: 15.8, shear: 0, lean: 0.005 },
  { way: 292320261, body: 'white', ridge: 14, roofH: 5, roof: 'roof', u0: -29, u1: -21.9, d0: -9.39, depth: 15.8, shear: 0, lean: -0.008 },
  { way: 0, body: 'ochre', ridge: 14, roofH: 5, roof: 'roof', u0: -21.48, u1: -15.02, d0: -9.32, depth: 15, shear: -0.02, lean: 0.007, estimated: true },
  { way: 331274562, body: 'red', ridge: 15, roofH: 5, roof: 'roof', u0: -14.6, u1: -8.9, d0: -8.6, depth: 16, shear: -0.04, lean: 0.006, estimated: true },
  { way: 331274574, body: 'pink', ridge: 13, roofH: 5, roof: 'roof', u0: -7.21, u1: 1.36, d0: -9.04, depth: 10.8, shear: 0, lean: -0.008 },
  { way: 331274575, body: 'red', ridge: 13, roofH: 4, roof: 'roof', u0: 1.82, u1: 7.72, d0: -8.52, depth: 6.85, shear: 0, lean: -0.005, estimated: true },
  { way: 331274541, body: 'brown', ridge: 12, roofH: 4, roof: 'roofDark', u0: 8.25, u1: 14.1, d0: -8.15, depth: 11.1, shear: 0, lean: 0.009 },
  { way: 331274582, body: 'ochre', ridge: 14, roofH: 5, roof: 'roof', u0: 15.4, u1: 22.55, d0: -7.55, depth: 17.6, shear: -0.045, lean: -0.006 },
  { way: 488690088, body: 'white', ridge: 13, roofH: 4, roof: 'roof', u0: 23.11, u1: 29.91, d0: -7.57, depth: 14.3, shear: -0.014, lean: 0.004 },
  { way: 488690087, body: 'white', ridge: 13, roofH: 4, roof: 'roof', u0: 30.11, u1: 36.27, d0: -7.59, depth: 14.3, shear: -0.014, lean: -0.009 },
  { way: 292320275, body: 'red', ridge: 13, roofH: 4, roof: 'roof', u0: 36.83, u1: 45.03, d0: -8.06, depth: 18.05, shear: -0.013, lean: 0.006 },
  { way: 292320266, body: 'red', ridge: 14, roofH: 5, roof: 'roofDark', u0: 45.8, u1: 53.9, d0: -8.15, depth: 18.2, shear: 0.085, lean: -0.006 },
];

export const SHOP = 3.22;

/** A point of house h. t is metres inland of the gable line; u is the front-line coordinate. */
export function point(h, u, t, y) {
  const uu = u + (h.shear || 0) * t + (h.lean || 0) * y;
  const d = h.d0 + t;
  return [uu * R[0] + d * D[0], y, uu * R[1] + d * D[1]];
}

/** Window and shop rhythm shared by the mesh and the tests. */
export function facade(h) {
  const width = h.u1 - h.u0;
  const eave = h.ridge - h.roofH;
  const bays = Math.max(3, Math.min(7, Math.round(width / 1.28)));
  const gap = 0.15;
  const winW = Math.min(0.9, (width - 0.48) / bays - gap);
  const span = bays * winW + (bays - 1) * gap;
  const centers = [];
  let x = h.u0 + (width - span) / 2 + winW / 2;
  for (let i = 0; i < bays; i++) { centers.push(x); x += winW + gap; }
  // One row of small panes per storey, from the shop head up to the eave.
  const bands = [];
  const winH = 1.18;
  const pitch = 1.7;
  const top = eave - 0.36;
  for (let y = SHOP + 0.36; y + winH <= top + 0.06 && bands.length < 4; y += pitch) bands.push([y, y + winH]);
  if (!bands.length) bands.push([SHOP + 0.42, Math.max(SHOP + 1.7, eave - 0.42)]);
  // Gable windows step in as the triangle narrows. Peak of the wall is 0.22 m under the ridge.
  const gables = [];
  const peak = h.ridge - 0.22;
  const half = width / 2 - 0.4;
  const rise = peak - eave;
  const place = (frac, wFrac) => {
    const y0 = eave + rise * frac;
    const avail = half * (1 - (y0 - eave) / rise) * 2;
    const w = Math.min(winW * wFrac, avail - 0.3);
    const hgt = Math.min(1.02, rise * 0.32);
    if (w > 0.4 && y0 + hgt < peak - 0.35) gables.push([y0, y0 + hgt, w]);
  };
  if (rise > 2.2) place(0.1, 0.95);
  if (rise > 4.2) place(0.46, 0.62);
  return { width, eave, rows: bands.length, bays, winW, centers, bands, gables, doorAt: h.way % 2 ? centers.length - 1 : 0 };
}

/** Sides that face a lane or the end of the row, so they can carry windows. */
export function sideFaces() {
  const faces = [];
  for (let i = 0; i < HOUSES.length; i++) {
    const h = HOUSES[i];
    const prev = HOUSES[i - 1];
    const next = HOUSES[i + 1];
    if (!prev || h.u0 - prev.u1 > 0.7) faces.push({ h, side: -1 });
    if (!next || next.u0 - h.u1 > 0.7) faces.push({ h, side: 1 });
  }
  return faces;
}

export function litWindow(way, i) {
  const n = (Math.imul(way, 374761393) ^ Math.imul(i + 1, 668265263)) >>> 0;
  return n % 4 === 0;
}
