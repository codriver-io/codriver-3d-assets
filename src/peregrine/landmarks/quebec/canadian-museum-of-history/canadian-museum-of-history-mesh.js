import * as THREE from 'three';

// Small mesh kit for the Canadian Museum of History model. Plan coordinates are [x, z] in metres (+X east, +Z south),
// 3D points are [x, y, z]. A Mesh collects flat triangles (faces oriented toward a direction you name, so no winding is
// checked by hand) and smooth grids (domes, rows of a loft) with their own vertex normals.

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export class Mesh {
  constructor() { this.pos = []; this.nor = []; this.idx = []; this.n = 0; }
  get empty() { return this.n === 0; }
  get triangles() { return this.idx.length / 3; }
  /** One flat triangle whose normal has a positive dot with `dir` (when given). */
  tri(a, b, c, dir) {
    let n = cross(sub(b, a), sub(c, a));
    const l = Math.hypot(n[0], n[1], n[2]);
    if (l < 1e-7) return;
    if (dir && dot(n, dir) < 0) { [b, c] = [c, b]; n = [-n[0], -n[1], -n[2]]; }
    n = [n[0] / l, n[1] / l, n[2] / l];
    this.pos.push(...a, ...b, ...c); this.nor.push(...n, ...n, ...n);
    this.idx.push(this.n, this.n + 1, this.n + 2); this.n += 3;
  }
  quad(a, b, c, d, dir) { this.tri(a, b, c, dir); this.tri(a, c, d, dir); }
  /** A quad with one supplied normal per corner (smooth shading along a curved wall); winding follows the normals. */
  quadN(a, b, c, d, na, nb, nc, nd) {
    const g = cross(sub(b, a), sub(c, a)), sum = [na[0] + nb[0] + nc[0] + nd[0], na[1] + nb[1] + nc[1] + nd[1], na[2] + nb[2] + nc[2] + nd[2]];
    if (Math.hypot(g[0], g[1], g[2]) < 1e-7 && Math.hypot(...cross(sub(c, a), sub(d, a))) < 1e-7) return;
    let P = [a, b, c, d], Nn = [na, nb, nc, nd];
    if (dot(g, sum) < 0) { P = [a, d, c, b]; Nn = [na, nd, nc, nb]; }
    for (let k = 0; k < 4; k++) { this.pos.push(...P[k]); this.nor.push(...Nn[k]); }
    this.idx.push(this.n, this.n + 1, this.n + 2, this.n, this.n + 2, this.n + 3); this.n += 4;
  }
  /**
   * A smooth grid: rows[i][j] are 3D points; faces join consecutive rows, and consecutive columns (wrapping when
   * `closed`). Orientation: the side where `dir` (a vector, or a function of a face centre) points.
   */
  grid(rows, { closed = false, dir } = {}) {
    const R = rows.length, C = rows[0].length, faces = [], N = new Float64Array(R * C * 3);
    const P = (v) => rows[Math.floor(v / C)][v % C];
    for (let i = 0; i < R - 1; i++) {
      for (let j = 0; j < (closed ? C : C - 1); j++) {
        const j1 = (j + 1) % C, a = i * C + j, b = i * C + j1, c = (i + 1) * C + j1, d = (i + 1) * C + j;
        faces.push([a, b, c], [a, c, d]);
      }
    }
    let vote = 0;
    const normals = faces.map((f) => {
      const [p, q, r] = f.map(P), n = cross(sub(q, p), sub(r, p));
      if (dir) {
        const c = [(p[0] + q[0] + r[0]) / 3, (p[1] + q[1] + r[1]) / 3, (p[2] + q[2] + r[2]) / 3];
        vote += dot(n, typeof dir === 'function' ? dir(c) : dir);
      }
      return n;
    });
    const flip = vote < 0;
    faces.forEach((f, k) => {
      const n = normals[k];
      for (const v of f) { N[v * 3] += n[0]; N[v * 3 + 1] += n[1]; N[v * 3 + 2] += n[2]; }
    });
    const base = this.n, sgn = flip ? -1 : 1;
    for (let v = 0; v < R * C; v++) {
      const l = Math.hypot(N[v * 3], N[v * 3 + 1], N[v * 3 + 2]) || 1;
      this.pos.push(...P(v)); this.nor.push(sgn * N[v * 3] / l, sgn * N[v * 3 + 1] / l, sgn * N[v * 3 + 2] / l);
    }
    faces.forEach((f, k) => {
      const n = normals[k];
      if (Math.hypot(n[0], n[1], n[2]) < 1e-7) return; // collapsed at an apex or a pinched ring
      const [a, b, c] = f;
      if (flip) this.idx.push(base + a, base + c, base + b); else this.idx.push(base + a, base + b, base + c);
    });
    this.n += R * C;
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setIndex(this.idx);
    return g;
  }
}

/** Point in a polygon of [x, z]. */
export function inPoly(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i], [xj, zj] = ring[j];
    if ((zi > pt[1]) !== (zj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - zi) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/** Triangles [[a, b, c], ...] of [x, z] points of a polygon (holes optional). */
export function triangulate(outer, holes = []) {
  const v = (p) => new THREE.Vector2(p[0], p[1]);
  const all = [...outer, ...holes.flat()];
  return THREE.ShapeUtils.triangulateShape(outer.map(v), holes.map((h) => h.map(v))).map((t) => t.map((i) => all[i]));
}

export const hash = (a, b, c = 0) => {
  let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

/** Signed area (shoelace) of a ring of [x, z]. */
export function ringArea(r) {
  let a = 0;
  for (let i = 0; i < r.length; i++) { const p = r[i], q = r[(i + 1) % r.length]; a += p[0] * q[1] - q[0] * p[1]; }
  return a / 2;
}

export function centroid(r) {
  let a = 0, cx = 0, cz = 0;
  for (let i = 0; i < r.length; i++) {
    const p = r[i], q = r[(i + 1) % r.length], c = p[0] * q[1] - q[0] * p[1];
    a += c; cx += (p[0] + q[0]) * c; cz += (p[1] + q[1]) * c;
  }
  return [cx / (3 * a), cz / (3 * a)];
}

/** Douglas-Peucker on a closed ring, keeping the corners that matter. */
export function simplifyRing(ring, tol) {
  if (tol <= 0 || ring.length < 8) return ring;
  const dseg = (p, a, b) => {
    const dx = b[0] - a[0], dz = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / (dx * dx + dz * dz || 1)));
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dz);
  };
  // anchor the ring at its two farthest-apart points so the closing seam is not special
  let ia = 0, ib = 0, best = -1;
  for (let i = 0; i < ring.length; i++) for (let j = i + 1; j < ring.length; j++) { const d = Math.hypot(ring[i][0] - ring[j][0], ring[i][1] - ring[j][1]); if (d > best) { best = d; ia = i; ib = j; } }
  const chain = (from, to) => { const out = []; for (let i = from; i !== to; i = (i + 1) % ring.length) out.push(ring[i]); out.push(ring[to]); return out; };
  const dp = (pts) => {
    if (pts.length < 3) return pts;
    let d = -1, k = 0;
    for (let i = 1; i < pts.length - 1; i++) { const e = dseg(pts[i], pts[0], pts[pts.length - 1]); if (e > d) { d = e; k = i; } }
    if (d <= tol) return [pts[0], pts[pts.length - 1]];
    return [...dp(pts.slice(0, k + 1)).slice(0, -1), ...dp(pts.slice(k))];
  };
  return [...dp(chain(ia, ib)).slice(0, -1), ...dp(chain(ib, ia)).slice(0, -1)];
}

/**
 * Stations on a closed ring: every vertex kept, long edges subdivided to at most `maxStep`. Each station carries its
 * arc length `s`, the outward unit normal `n` ([x, z]) and the unit tangent `t`.
 */
export function stations(ring, maxStep) {
  const pts = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(len / maxStep));
    for (let m = 0; m < k; m++) pts.push([a[0] + (b[0] - a[0]) * m / k, a[1] + (b[1] - a[1]) * m / k]);
  }
  const orient = ringArea(pts) > 0 ? 1 : -1; // (t.z, -t.x) points outward when the shoelace area is positive
  let s = 0;
  return pts.map((p, i) => {
    const q = pts[(i + pts.length - 1) % pts.length], r = pts[(i + 1) % pts.length];
    let tx = r[0] - q[0], tz = r[1] - q[1];
    const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    const st = { p, s, t: [tx, tz], n: [orient * tz, -orient * tx] };
    s += Math.hypot(r[0] - p[0], r[1] - p[1]);
    return st;
  });
}

/** Index of the vertex of `pts` ([x, z]) nearest to `target`. */
export function nearestIndex(pts, target) {
  let best = 0, d = Infinity;
  pts.forEach((p, i) => { const e = Math.hypot(p[0] - target[0], p[1] - target[1]); if (e < d) { d = e; best = i; } });
  return best;
}

/**
 * A closed ring pulled in by `d` metres along smoothed vertex normals (for chamfered roofs). The ring is resampled
 * and smoothed first so jitter in a mapped outline does not fold the offset.
 */
export function insetRing(ring, d, step = 3) {
  let pts = stations(ring, step).map((s) => s.p);
  for (let it = 0; it < 2; it++) { // Chaikin
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    pts = out;
  }
  return stations(pts, 1e9).map((s) => [s.p[0] - s.n[0] * d, s.p[1] - s.n[1] * d]);
}

/**
 * Slices of a long closed ring along its principal axis, for a dome made of overlapping lobes: `count` pieces that each
 * overlap their neighbours by `overlap` of the ring's length (Sutherland-Hodgman against two half-planes). Every piece is
 * the original outline plus a straight cut; its cut edge ends up buried inside the next piece.
 */
export function splitLobes(ring, count, overlap = 0.2) {
  const c = centroid(ring);
  let sxx = 0, syy = 0, sxy = 0;
  for (const p of ring) { const x = p[0] - c[0], z = p[1] - c[1]; sxx += x * x; syy += z * z; sxy += x * z; }
  const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy), ax = [Math.cos(ang), Math.sin(ang)];
  const u = (p) => (p[0] - c[0]) * ax[0] + (p[1] - c[1]) * ax[1];
  const us = ring.map(u), u0 = Math.min(...us), len = Math.max(...us) - u0;
  const clip = (poly, keep) => { // keep(u) >= 0 is the inside
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], fa = keep(u(a)), fb = keep(u(b));
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  };
  const piece = len / (count - (count - 1) * overlap), pieces = [];
  for (let k = 0; k < count; k++) {
    const lo = u0 + k * piece * (1 - overlap), hi = lo + piece;
    pieces.push(clip(clip(ring, (v) => v - lo + (k === 0 ? 1e9 : 0)), (v) => hi - v + (k === count - 1 ? 1e9 : 0)));
  }
  return pieces;
}
