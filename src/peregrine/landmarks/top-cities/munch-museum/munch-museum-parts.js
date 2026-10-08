import * as THREE from 'three';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// MUNCH, Bjørvika. A 13 m podium and a 66 × 24 m tower. The shaft is vertical
// to the mapped 37 m part, then the whole plate slides west-northwest to the
// mapped 57 m head (Lindner's 25 m vertical front + 20 m incline, 7 m overhang).
// Above 37 m the long front is glass, and the fjord-side narrow end is glass only
// as a vertical corner strip beside that front. The shaft is ribbed aluminium.
// Where its plan leaves the podium, that shaft continues down to grade. The
// aluminium faces step back under the roof lip.
export const ROOF = 57.4;
export const KINK = 37;
export const PODIUM = 13;

const k = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]);
const oy = latToMercY(SPEC.origin[1]);
export const local = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (oy - latToMercY(lat)) / k];

function ccw(pts) {
  const area = pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  return area >= 0 ? pts : pts.slice().reverse();
}

const topRing = FOOTPRINTS[4].map(local);
const baseAll = FOOTPRINTS[2].map(local);
// h37 is the top quad plus one nearly colinear nick on the north end. Pair the
// four real corners with the head, in the same walk order.
let base = [2, 3, 4, 1].map((i) => baseAll[i]);
let top = topRing.slice();
if (top.reduce((s, p, i) => { const q = top[(i + 1) % top.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) < 0) {
  top.reverse(); base.reverse();
}
export const TOP = top;
export const BASE = base;
export const SHIFT = [TOP[0][0] - BASE[0][0], TOP[0][1] - BASE[0][1]];

export function lean(y) {
  if (y <= KINK) return 0;
  if (y >= ROOF) return 1;
  return (y - KINK) / (ROOF - KINK);
}
export function corner(i, y) {
  const t = lean(y), a = BASE[i], b = TOP[i];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function towerEdges() {
  return [0, 1, 2, 3].map((i) => {
    const a = BASE[i], b = BASE[(i + 1) % 4];
    const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
    return { i, len, out: [dz / len, -dx / len], along: [dx / len, dz / len] };
  });
}
// The face that travels along its own outward normal is the glazed head.
export function westEdge() {
  return towerEdges().reduce((best, e) => e.out[0] * SHIFT[0] + e.out[1] * SHIFT[1] > best.out[0] * SHIFT[0] + best.out[1] * SHIFT[1] ? e : best);
}

export const PODIUM_RING = ccw(FOOTPRINTS[1].map(local));

const LEVEL = {
  near: { towerPitch: 0.72, towerAmp: 0.22, towerBay: 2.05, podiumPitch: 0.92, podiumAmp: 0.36, podiumBay: 3.1, col: 1.85, row: 2.65 },
  far: { towerPitch: 1.55, towerAmp: 0.22, towerBay: 5.6, podiumPitch: 1.9, podiumAmp: 0.36, podiumBay: 6.4, col: 5.4, row: 6.2 },
};

class Bucket {
  positions = []; indices = [];
  tri(a, b, c, normal) {
    const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2];
    const bx = c[0] - a[0], by = c[1] - a[1], bz = c[2] - a[2];
    const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    const flip = nx * normal[0] + ny * normal[1] + nz * normal[2] < 0;
    const s = this.positions.length / 3;
    for (const p of (flip ? [a, c, b] : [a, b, c])) this.positions.push(p[0], p[1], p[2]);
    this.indices.push(s, s + 1, s + 2);
  }
  quad(pts, normal) { this.tri(pts[0], pts[1], pts[2], normal); this.tri(pts[0], pts[2], pts[3], normal); }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    g.setIndex(this.indices); g.computeVertexNormals(); return g;
  }
}

function point(c0, c1, y, u, out, o) {
  const a = c0(y), b = c1(y);
  return [a[0] + (b[0] - a[0]) * u + out[0] * o, y, a[1] + (b[1] - a[1]) * u + out[1] * o];
}

// Horizontal sawtooth. Rising half is panel, falling half is the night glow
// slot, so the skin reads as perforated aluminium after dark.
function waves(panel, glow, c0, c1, y0, y1, pitch, amp, bay, out, skip) {
  const a = c0(y0), b = c1(y0), len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const nB = Math.max(1, Math.round(len / bay));
  const nW = Math.max(1, Math.round((y1 - y0) / pitch));
  const N = [out[0], 0, out[1]];
  for (let i = 0; i < nB; i++) {
    const u0 = i / nB, u1 = (i + 1) / nB, mid = (u0 + u1) / 2;
    for (let w = 0; w < nW; w++) {
      const yA = y0 + (y1 - y0) * (w / nW);
      const yM = y0 + (y1 - y0) * ((w + 0.5) / nW);
      const yB = y0 + (y1 - y0) * ((w + 1) / nW);
      if (skip) {
        const yMid = (yA + yB) / 2;
        if (skip(u0, yMid) || skip(mid, yMid) || skip(u1, yMid)) continue;
      }
      const q = (ya, yb, oa, ob) => [point(c0, c1, ya, u0, out, oa), point(c0, c1, ya, u1, out, oa), point(c0, c1, yb, u1, out, ob), point(c0, c1, yb, u0, out, ob)];
      panel.quad(q(yA, yM, 0, amp), N);
      glow.quad(q(yM, yB, amp, 0), N);
    }
  }
}

function flatBand(mesh, c0, c1, y0, y1, out, o, normalY = 0) {
  const N = [out[0], normalY, out[1]];
  mesh.quad([
    point(c0, c1, y0, 0, out, o), point(c0, c1, y0, 1, out, o),
    point(c0, c1, y1, 1, out, o), point(c0, c1, y1, 0, out, o),
  ], N);
}

function cap(mesh, ring, y, up) {
  const tris = THREE.ShapeUtils.triangulateShape(ring.map((p) => new THREE.Vector2(p[0], p[1])), []);
  for (const [a, b, c] of tris) {
    mesh.tri([ring[a][0], y, ring[a][1]], [ring[b][0], y, ring[b][1]], [ring[c][0], y, ring[c][1]], [0, up, 0]);
  }
}

// Block letters for the illuminated MUNCH wordmark. Strokes are in a 1×1 cell.
const WORD = {
  M: [[0.1, 0, 0.1, 1], [0.9, 0, 0.9, 1], [0.1, 1, 0.5, 0.32], [0.5, 0.32, 0.9, 1]],
  U: [[0.12, 0.16, 0.12, 1], [0.88, 0.16, 0.88, 1], [0.12, 0.16, 0.88, 0.16]],
  // Diagonal falls from the top of the left stem to the bottom of the right stem.
  N: [[0.1, 0, 0.1, 1], [0.9, 0, 0.9, 1], [0.1, 1, 0.9, 0]],
  C: [[0.16, 0.08, 0.16, 0.92], [0.16, 0.92, 0.96, 0.92], [0.16, 0.08, 0.96, 0.08]],
  H: [[0.1, 0, 0.1, 1], [0.9, 0, 0.9, 1], [0.1, 0.5, 0.9, 0.5]],
};

function letter(mesh, strokes, origin, along, normal, s0, width, y0, height, back, front) {
  const strokeW = width * 0.2;
  for (const [x0, z0, x1, z1] of strokes) {
    const p = [s0 + x0 * width, y0 + z0 * height];
    const q = [s0 + x1 * width, y0 + z1 * height];
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1;
    const tx = dx / len, ty = dy / len, px = -ty, py = tx, hw = strokeW / 2;
    const at = (pen, t, n) => {
      const s = p[0] + tx * t + px * pen, y = p[1] + ty * t + py * pen;
      return [origin[0] + along[0] * s + normal[0] * n, y, origin[1] + along[1] * s + normal[1] * n];
    };
    const N = (sx, sy) => [along[0] * sx, sy, along[1] * sx];
    mesh.quad([at(-hw, 0, front), at(hw, 0, front), at(hw, len, front), at(-hw, len, front)], [normal[0], 0, normal[1]]);
    mesh.quad([at(-hw, 0, back), at(hw, 0, back), at(hw, 0, front), at(-hw, 0, front)], N(-tx, -ty));
    mesh.quad([at(hw, len, back), at(-hw, len, back), at(-hw, len, front), at(hw, len, front)], N(tx, ty));
    mesh.quad([at(-hw, len, back), at(-hw, 0, back), at(-hw, 0, front), at(-hw, len, front)], N(-px, -py));
    mesh.quad([at(hw, 0, back), at(hw, len, back), at(hw, len, front), at(hw, 0, front)], N(px, py));
  }
}

function curtain(glass, light, frame, edge, y0, y1, near, skipHead = false) {
  const { i, out, along } = edge;
  const u0 = edge.u0 ?? 0, u1 = edge.u1 ?? 1;
  const mix = (y, u) => {
    const a = corner(i, y), b = corner((i + 1) % 4, y);
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  };
  const c0 = (y) => mix(y, u0), c1 = (y) => mix(y, u1);
  const p0 = c0(y0), p1 = c1(y0);
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const inset = -0.42, jamb = 0.9, mullionO = -0.24;
  const cols = Math.max(2, Math.round((len - 2 * jamb) / (near ? 1.85 : 5.4)));
  const rows = Math.max(2, Math.round((y1 - y0) / (near ? 2.65 : 6.2)));
  const N = [out[0], 0, out[1]];
  const uAt = (c) => (jamb + (len - 2 * jamb) * (c / cols)) / len;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const u0 = uAt(c), u1 = uAt(c + 1);
      const ya = y0 + (y1 - y0) * (r / rows), yb = y0 + (y1 - y0) * ((r + 1) / rows);
      const q = [point(c0, c1, ya, u0, out, inset), point(c0, c1, ya, u1, out, inset), point(c0, c1, yb, u1, out, inset), point(c0, c1, yb, u0, out, inset)];
      glass.quad(q, N);
      if (near && r >= rows - 4 && (c + r) % 6 === 0) {
        const uA = u0 + (u1 - u0) * 0.22, uB = u1 - (u1 - u0) * 0.22;
        const yA = ya + (yb - ya) * 0.22, yB = yb - (yb - ya) * 0.22;
        light.quad([
          point(c0, c1, yA, uA, out, inset + 0.06), point(c0, c1, yA, uB, out, inset + 0.06),
          point(c0, c1, yB, uB, out, inset + 0.06), point(c0, c1, yB, uA, out, inset + 0.06),
        ], N);
      }
    }
  }
  const bar = near ? 0.12 : 0.2;
  const mullion = (u0, u1, ya, yb) => frame.quad([
    point(c0, c1, ya, u0, out, mullionO), point(c0, c1, ya, u1, out, mullionO),
    point(c0, c1, yb, u1, out, mullionO), point(c0, c1, yb, u0, out, mullionO),
  ], N);
  for (let c = 0; c <= cols; c++) {
    const u = uAt(c), half = (bar / 2) / len;
    mullion(Math.max(0, u - half), Math.min(1, u + half), y0, y1);
  }
  for (let r = 0; r <= rows; r++) {
    const y = y0 + (y1 - y0) * (r / rows), heavy = Math.abs(y - KINK) < (y1 - y0) / rows * 0.6;
    const half = heavy ? 0.2 : bar / 2;
    mullion(uAt(0), uAt(cols), Math.max(y0, y - half), Math.min(y1, y + half));
  }
  // Jambs face into the opening; sill and head close the recess.
  const jambN = (sign) => [along[0] * sign, 0, along[1] * sign];
  frame.quad([
    point(c0, c1, y0, uAt(0), out, 0), point(c0, c1, y1, uAt(0), out, 0),
    point(c0, c1, y1, uAt(0), out, inset), point(c0, c1, y0, uAt(0), out, inset),
  ], jambN(1));
  frame.quad([
    point(c0, c1, y0, uAt(cols), out, inset), point(c0, c1, y1, uAt(cols), out, inset),
    point(c0, c1, y1, uAt(cols), out, 0), point(c0, c1, y0, uAt(cols), out, 0),
  ], jambN(-1));
  frame.quad([
    point(c0, c1, y0, uAt(0), out, 0), point(c0, c1, y0, uAt(cols), out, 0),
    point(c0, c1, y0, uAt(cols), out, inset), point(c0, c1, y0, uAt(0), out, inset),
  ], [0, -1, 0]);
  if (!skipHead) frame.quad([
    point(c0, c1, y1, uAt(0), out, inset), point(c0, c1, y1, uAt(cols), out, inset),
    point(c0, c1, y1, uAt(cols), out, 0), point(c0, c1, y1, uAt(0), out, 0),
  ], [0, 1, 0]);
}

// The aluminium crown steps back under a projecting lip. Both LODs keep the step.
const RECESS_Y = 52.6;
const CAP_Y = 55.8;
const RECESS = -2.35;
const CAP_O = 0.28;

function ledge(mesh, c0, c1, y, out, o0, o1, up) {
  mesh.quad([
    point(c0, c1, y, 0, out, o0), point(c0, c1, y, 1, out, o0),
    point(c0, c1, y, 1, out, o1), point(c0, c1, y, 0, out, o1),
  ], [0, up, 0]);
}

function slots(glass, c0, c1, y0, y1, out, len) {
  const n = Math.max(2, Math.min(5, Math.round(len / 14)));
  for (let i = 0; i < n; i++) {
    const u = (i + 0.35) / n;
    const half = 1.05 / len;
    const y = y0 + (y1 - y0) * (i % 2 === 0 ? 0.32 : 0.7);
    glass.quad([
      point(c0, c1, y, Math.max(0.02, u - half), out, 0.24),
      point(c0, c1, y, Math.min(0.98, u + half), out, 0.24),
      point(c0, c1, y + 0.48, Math.min(0.98, u + half), out, 0.24),
      point(c0, c1, y + 0.48, Math.max(0.02, u - half), out, 0.24),
    ], [out[0], 0, out[1]]);
  }
}

function metalHead(panel, glow, glass, c0, c1, out, L) {
  waves(panel, glow, c0, c1, KINK + 0.28, RECESS_Y, L.towerPitch, L.towerAmp, L.towerBay, out);
  // Tread faces up and closes the setback. The roof has already slid, so a
  // downward soffit here would sit in the open and read as a hole.
  ledge(panel, c0, c1, RECESS_Y, out, L.towerAmp, RECESS, 1);
  flatBand(panel, c0, c1, RECESS_Y, CAP_Y, out, RECESS);
  const win = RECESS + 0.16;
  glass.quad([
    point(c0, c1, RECESS_Y + 0.4, 0.58, out, win), point(c0, c1, RECESS_Y + 0.4, 0.94, out, win),
    point(c0, c1, CAP_Y - 0.28, 0.94, out, win), point(c0, c1, CAP_Y - 0.28, 0.58, out, win),
  ], [out[0], 0, out[1]]);
  ledge(panel, c0, c1, CAP_Y, out, RECESS, CAP_O, -1);
  flatBand(panel, c0, c1, CAP_Y, ROOF, out, CAP_O);
  ledge(panel, c0, c1, ROOF, out, 0, CAP_O, 1);
}

function glassHead(glass, light, frame, panel, edge, near, u0 = 0, u1 = 1) {
  const [c0, c1] = clipCorners(edge.i, u0, u1);
  curtain(glass, light, frame, { ...edge, u0, u1 }, KINK, CAP_Y, near, true);
  ledge(panel, c0, c1, CAP_Y, edge.out, -0.42, CAP_O, -1);
  flatBand(panel, c0, c1, CAP_Y, ROOF, edge.out, CAP_O);
  ledge(panel, c0, c1, ROOF, edge.out, 0, CAP_O, 1);
}

function signOn(edge, meshSign, meshPlate) {
  const { a, b, out, len } = edge;
  // Left-to-right for someone standing outside the quay face.
  const read = [out[1], -out[0]];
  const t = a[1] >= b[1] ? 0.28 : 0.72;
  const center = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const word = 16.2, h = 3.15, y0 = 7.15, gap = 0.34, cell = (word - 4 * gap) / 5;
  const atS = (s, y, n) => [center[0] + read[0] * s + out[0] * n, y, center[1] + read[1] * s + out[1] * n];
  const half = word / 2 + 0.7;
  meshPlate.quad([
    atS(-half, y0 - 0.45, 0.38), atS(half, y0 - 0.45, 0.38),
    atS(half, y0 + h + 0.45, 0.38), atS(-half, y0 + h + 0.45, 0.38),
  ], [out[0], 0, out[1]]);
  let s = -word / 2;
  for (const ch of 'MUNCH') {
    letter(meshSign, WORD[ch], center, read, out, s, cell, y0, h, 0.44, 0.7);
    s += cell + gap;
  }
  const halfT = (half + 1.6) / len;
  return { t0: t - halfT, t1: t + halfT, y0: y0 - 0.6, y1: y0 + h + 0.6 };
}

function clipCorners(i, u0, u1) {
  const mix = (y, u) => {
    const a = corner(i, y), b = corner((i + 1) % 4, y);
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  };
  return [(y) => mix(y, u0), (y) => mix(y, u1)];
}

// On the podium edge, or inside it. The podium already has a wall there.
function podiumCovers(x, z) {
  const ring = PODIUM_RING;
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const dx = b[0] - a[0], dz = b[1] - a[1], l2 = dx * dx + dz * dz || 1;
    let t = ((x - a[0]) * dx + (z - a[1]) * dz) / l2;
    t = Math.max(0, Math.min(1, t));
    best = Math.min(best, Math.hypot(x - (a[0] + t * dx), z - (a[1] + t * dz)));
  }
  if (best <= 0.08) return true;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i][1], yj = ring[j][1];
    if ((yi > z) !== (yj > z) && x < (ring[j][0] - ring[i][0]) * (z - yi) / (yj - yi) + ring[i][0]) inside = !inside;
  }
  return inside;
}

// Partition one tower edge into runs that sit on the podium and runs that
// leave it. The second kind is the waterfront shaft, which has to reach grade.
function gradeSpans(edge) {
  const a = BASE[edge.i], b = BASE[(edge.i + 1) % 4];
  const covers = (u) => podiumCovers(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u);
  const N = 80;
  const flag = [];
  for (let i = 0; i <= N; i++) flag.push(covers(i / N));
  const spans = [];
  let i = 0;
  while (i <= N) {
    const down = !flag[i];
    let j = i + 1;
    while (j <= N && (!flag[j]) === down) j++;
    let u0 = i / N;
    let u1 = 1;
    if (j <= N) {
      let lo = (j - 1) / N, hi = j / N;
      for (let k = 0; k < 16; k++) {
        const m = (lo + hi) / 2;
        if ((!covers(m)) === down) lo = m; else hi = m;
      }
      u1 = (lo + hi) / 2;
    }
    if (spans.length) u0 = spans[spans.length - 1][1];
    if (u1 - u0 > 0.002) spans.push([u0, u1, down]);
    i = j > N ? N + 1 : j;
  }
  return spans;
}

// Glass on the narrow end is a 5 m strip at the corner shared with the glazed front.
const STRIP_M = 5;
function headSegments(edge, west, nose) {
  if (edge.i === west.i) return [{ u0: 0, u1: 1, kind: 'glass' }];
  if (edge.i !== nose.i) return [{ u0: 0, u1: 1, kind: 'metal' }];
  const strip = Math.min(0.45, STRIP_M / edge.len);
  const far = (edge.i + 1) % 4;
  const atEnd = far === west.i || far === (west.i + 1) % 4;
  if (atEnd) return [{ u0: 0, u1: 1 - strip, kind: 'metal' }, { u0: 1 - strip, u1: 1, kind: 'glass' }];
  return [{ u0: 0, u1: strip, kind: 'glass' }, { u0: strip, u1: 1, kind: 'metal' }];
}

export function buildParts(detail) {
  const near = detail === 'near';
  const L = near ? LEVEL.near : LEVEL.far;
  const panel = new Bucket(), glow = new Bucket(), glass = new Bucket(), light = new Bucket();
  const frame = new Bucket(), sign = new Bucket(), gap = new Bucket();
  const west = westEdge();
  // South narrow end: ribbed, with glass only on the corner beside the glazed front.
  const nose = towerEdges().filter((e) => e.i !== west.i && e.len < west.len * 0.6)
    .reduce((best, e) => e.out[1] > best.out[1] ? e : best);

  for (const e of towerEdges()) {
    const heads = headSegments(e, west, nose);
    for (const [g0, g1, down] of gradeSpans(e)) {
      for (const h of heads) {
        const u0 = Math.max(g0, h.u0), u1 = Math.min(g1, h.u1);
        if ((u1 - u0) * e.len < 0.15) continue;
        const [c0, c1] = clipCorners(e.i, u0, u1);
        const glassTop = h.kind === 'glass';
        const shaftTop = glassTop ? KINK - 0.18 : KINK - 0.35;
        if (down) {
          flatBand(panel, c0, c1, 0, 0.3, e.out, 0.02);
          waves(panel, glow, c0, c1, 0.3, shaftTop, L.towerPitch, L.towerAmp, L.towerBay, e.out);
        } else {
          flatBand(gap, c0, c1, PODIUM, PODIUM + 0.35, e.out, -0.06);
          waves(panel, glow, c0, c1, PODIUM + 0.35, shaftTop, L.towerPitch, L.towerAmp, L.towerBay, e.out);
        }
        if (near && (u1 - u0) * e.len > 8) {
          slots(glass, c0, c1, down ? 8 : PODIUM + 3.4, shaftTop - 0.8, e.out, (u1 - u0) * e.len);
        }
        if (glassTop) flatBand(gap, c0, c1, shaftTop, KINK, e.out, -0.05);
        else flatBand(gap, c0, c1, KINK - 0.35, KINK + 0.28, e.out, -0.05);
      }
    }
    for (const h of heads) {
      if ((h.u1 - h.u0) * e.len < 0.15) continue;
      if (h.kind === 'glass') glassHead(glass, light, frame, panel, e, near, h.u0, h.u1);
      else metalHead(panel, glow, glass, ...clipCorners(e.i, h.u0, h.u1), e.out, L);
    }
  }
  const roofRing = [0, 1, 2, 3].map((i) => corner(i, ROOF));
  cap(panel, roofRing, ROOF, 1);

  const ring = PODIUM_RING;
  let signSpan = null;
  let long = null;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
    if (!long || len > long.len) long = { a, b, len, out: [dz / len, -dx / len], along: [dx / len, dz / len], i };
  }
  signSpan = signOn(long, sign, gap);

  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz);
    if (len < 0.4) continue;
    const out = [dz / len, -dx / len];
    const c0 = () => a, c1 = () => b;
    flatBand(panel, c0, c1, 0, 0.4, out, 0.02);
    const cols = Math.max(1, Math.round(len / (near ? 3.4 : 8)));
    for (let c = 0; c < cols; c++) {
      const u0 = c / cols, u1 = (c + 1) / cols;
      const q = [point(c0, c1, 0.45, u0, out, 0.06), point(c0, c1, 0.45, u1, out, 0.06), point(c0, c1, 4.15, u1, out, 0.06), point(c0, c1, 4.15, u0, out, 0.06)];
      glass.quad(q, [out[0], 0, out[1]]);
      if (near && c % 4 === 1) {
        const insetU = 0.18 * (u1 - u0);
        light.quad([
          point(c0, c1, 0.7, u0 + insetU, out, 0.12), point(c0, c1, 0.7, u1 - insetU, out, 0.12),
          point(c0, c1, 3.9, u1 - insetU, out, 0.12), point(c0, c1, 3.9, u0 + insetU, out, 0.12),
        ], [out[0], 0, out[1]]);
      }
      if (c > 0) {
        const half = (near ? 0.07 : 0.12) / len;
        frame.quad([
          point(c0, c1, 0.45, u0 - half, out, 0), point(c0, c1, 0.45, u0 + half, out, 0),
          point(c0, c1, 4.15, u0 + half, out, 0), point(c0, c1, 4.15, u0 - half, out, 0),
        ], [out[0], 0, out[1]]);
      }
    }
    const skip = i === long.i ? (u, y) => u > signSpan.t0 && u < signSpan.t1 && y > signSpan.y0 && y < signSpan.y1 : null;
    waves(panel, glow, c0, c1, 4.35, 12.75, L.podiumPitch, L.podiumAmp, L.podiumBay, out, skip);
  }
  cap(panel, ring, PODIUM, 1);

  return { panel, glow, glass, light, frame, sign, gap };
}
