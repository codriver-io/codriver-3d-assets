// Kilden, Kristiansand. Mapped frame in real metres: +x east, +y up, +z south.
// The quay is west of way 273362400. The long edge C→D (bearing ~168°) is the
// harbour front; the oak lip sits on that edge and the hall lies landward.
import { lngToMercX, latToMercY, mercStretch, mercXToLng, mercYToLat } from '../../../facade/geo.js';

export const RING = [
  [7.9973040, 58.1395930], // A north
  [7.9962375, 58.1394727], // B
  [7.9961960, 58.1394680], // C harbour, north
  [7.9965260, 58.1386490], // D harbour, south
  [7.9977050, 58.1387810], // E south-east
  [7.9974000, 58.1395400], // F east
];

const centroid = (() => {
  const lat0 = RING.reduce((s, p) => s + p[1], 0) / RING.length;
  const lng0 = RING.reduce((s, p) => s + p[0], 0) / RING.length;
  const k = mercStretch(lat0);
  const ox = lngToMercX(lng0), oy = latToMercY(lat0);
  const xy = RING.map(([lng, lat]) => [(lngToMercX(lng) - ox) / k, (oy - latToMercY(lat)) / k]);
  let a = 0, cx = 0, cz = 0;
  for (let i = 0; i < xy.length; i++) {
    const j = (i + 1) % xy.length;
    const c = xy[i][0] * xy[j][1] - xy[j][0] * xy[i][1];
    a += c; cx += (xy[i][0] + xy[j][0]) * c; cz += (xy[i][1] + xy[j][1]) * c;
  }
  a *= 0.5; cx /= 6 * a; cz /= 6 * a;
  return [mercXToLng(ox + cx * k), mercYToLat(oy - cz * k)];
})();

export const ORIGIN = centroid;

const k = mercStretch(ORIGIN[1]);
const ox = lngToMercX(ORIGIN[0]);
const oy = latToMercY(ORIGIN[1]);
export const toLocal = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (oy - latToMercY(lat)) / k];

const pts = RING.map(toLocal);
// Harbour edge is the longest, C→D, indices 2→3.
const C = pts[2], D = pts[3];
const edgeX = D[0] - C[0], edgeZ = D[1] - C[1];
export const LENGTH = Math.hypot(edgeX, edgeZ);
export const ALONG = [edgeX / LENGTH, edgeZ / LENGTH];
// Landward points into the hall (east). Water is the opposite, toward the quay.
const landA = [ALONG[1], -ALONG[0]], landB = [-ALONG[1], ALONG[0]];
const mid = [(C[0] + D[0]) / 2, (C[1] + D[1]) / 2];
export const LAND = (landA[0] * -mid[0] + landA[1] * -mid[1]) > (landB[0] * -mid[0] + landB[1] * -mid[1]) ? landA : landB;
export const WATER = [-LAND[0], -LAND[1]];
export const FACADE_BEARING = (Math.atan2(WATER[0], -WATER[1]) * 180 / Math.PI + 360) % 360;

export const ROOF = 22;
export const LIP_DEPTH = 0.65;
export const GLASS_DEPTH = 26;
export const CANOPY = 25.55; // plan metres from the lip plane to just inside the glass line
export const THICK_LIP = 0.32;
export const THICK_BACK = 1.15;

// Lip height along the harbour edge, t=0 north, t=1 south. Two broad lobes and a
// small central nick. The south lobe is the deep one (photo 1's corner); even
// there the lip stays near half the facade so the glass below stays open.
export const LIP_KEYS = [
  [0.00, 18.6],
  [0.30, 14.8],
  [0.48, 18.4],
  [0.58, 16.6],
  [0.68, 19.0],
  [0.88, 11.0],
  [1.00, 14.2],
];

export function lipHeight(t) {
  const x = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < LIP_KEYS.length - 2 && LIP_KEYS[i + 1][0] < x) i++;
  const [t0, y0] = LIP_KEYS[i], [t1, y1] = LIP_KEYS[i + 1];
  const u = (x - t0) / (t1 - t0);
  const s = u * u * (3 - 2 * u);
  return y0 + (y1 - y0) * s;
}

export function place(along, depth) {
  return [C[0] + ALONG[0] * along + LAND[0] * depth, C[1] + ALONG[1] * along + LAND[1] * depth];
}

export function depthOf(p) {
  return (p[0] - C[0]) * LAND[0] + (p[1] - C[1]) * LAND[1];
}

// Soffit section. u=0 at the lip, u=1 at the hall. The sheet leaves the top of
// the dark hall, stays high, and curls down only in the outer quarter.
export function soffitSection(u, lipY) {
  const H = ROOF - THICK_BACK;
  const p0 = [0, lipY];
  const rise = Math.max(0.5, H - lipY);
  const p1 = [CANOPY * 0.20, lipY + rise * 0.86];
  const p2 = [CANOPY * 0.58, H - 0.05];
  const p3 = [CANOPY, H];
  const mt = 1 - u;
  const b = (i) => mt ** 3 * p0[i] + 3 * mt * mt * u * p1[i] + 3 * mt * u * u * p2[i] + u ** 3 * p3[i];
  const db = (i) => 3 * mt * mt * (p1[i] - p0[i]) + 6 * mt * u * (p2[i] - p1[i]) + 3 * u * u * (p3[i] - p2[i]);
  return { d: b(0), y: b(1), dd: db(0), dy: db(1) };
}

export function thickAt(u) {
  return THICK_LIP + (THICK_BACK - THICK_LIP) * u * u;
}

// Upward unit normal of the section, in (depth offset, y).
export function sectionUp(u, lipY) {
  const s = soffitSection(u, lipY);
  let nd = -s.dy, ny = s.dd;
  const m = Math.hypot(nd, ny) || 1;
  nd /= m; ny /= m;
  if (ny < 0) { nd = -nd; ny = -ny; }
  return { nd, ny, ...s };
}

export const END = 0.4;

export function soffitPoint(along, u) {
  const t = (along - END) / (LENGTH - 2 * END);
  const s = soffitSection(u, lipHeight(t));
  const [x, z] = place(along, LIP_DEPTH + s.d);
  return [x, s.y, z];
}

export function skinPoint(along, u) {
  const t = (along - END) / (LENGTH - 2 * END);
  const up = sectionUp(u, lipHeight(t));
  const th = thickAt(u);
  const [x, z] = place(along, LIP_DEPTH + up.d + up.nd * th);
  return [x, up.y + up.ny * th, z];
}

export function hallPolygon() {
  const inside = (p) => depthOf(p) >= GLASS_DEPTH - 1e-6;
  const hit = (a, b) => {
    const da = depthOf(a), db = depthOf(b);
    const t = (GLASS_DEPTH - da) / (db - da);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const ina = inside(a), inb = inside(b);
    if (ina && inb) out.push(b);
    else if (ina && !inb) out.push(hit(a, b));
    else if (!ina && inb) { out.push(hit(a, b)); out.push(b); }
  }
  return out;
}

export const HALL = hallPolygon();
