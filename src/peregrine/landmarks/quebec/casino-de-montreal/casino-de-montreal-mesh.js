import * as THREE from 'three';

// Small mesh kit for the Casino de Montréal model. Frame: +X east, +Y up, +Z south (local metres, origin = the centre of
// the French pavilion's drum). Points are [x, y, z]; plan points are [x, z].

/** Flat-shaded triangle soup. tri()/quad() take an optional `toward` point the face must face, which spares hand-checking windings. */
export class Soup {
  constructor() { this.p = []; }
  tri(a, b, c, toward) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    if (nx * nx + ny * ny + nz * nz < 1e-8) return; // no area, no normal
    if (toward && nx * (toward[0] - a[0]) + ny * (toward[1] - a[1]) + nz * (toward[2] - a[2]) < 0) [b, c] = [c, b];
    this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  }
  quad(a, b, c, d, toward) { this.tri(a, b, c, toward); this.tri(a, c, d, toward); }
  get empty() { return this.p.length === 0; }
  get triangles() { return this.p.length / 9; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.computeVertexNormals();
    return g;
  }
}

export const TAU = Math.PI * 2;
export const smooth = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
export const polar = (r, th) => [r * Math.cos(th), r * Math.sin(th)]; // plan point at radius r, angle th (from +x toward +z)
export const deg = (d) => d * Math.PI / 180;

/** Signed area of a plan polygon in the (x, z) plane; positive when the vertices run x-to-z "counter-clockwise". */
export function area(poly) {
  let a = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1];
  return a / 2;
}
export function inPoly(poly, x, z) {
  let h = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[j], [bx, bz] = poly[i];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) h = !h;
  }
  return h;
}
/** Outward unit normal of edge a->b of a polygon with signed area `sa`. */
export const outward = (a, b, sa) => {
  const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1;
  return sa > 0 ? [dz / l, -dx / l] : [-dz / l, dx / l];
};

/** Vertical wall strip along edge a->b of a polygon, y0 to y1, facing outward. */
export function wall(soup, a, b, y0, y1, sa) {
  const n = outward(a, b, sa), mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, my = (y0 + y1) / 2;
  soup.quad([a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], [mx + n[0] * 5, my, mz + n[1] * 5]);
}

/** Horizontal polygon face at height y (or a plane y(x, z)), facing up (or down when `down`). Triangulated, may be concave. */
export function cap(soup, poly, y, down = false) {
  const tri = THREE.ShapeUtils.triangulateShape(poly.map(([x, z]) => new THREE.Vector2(x, z)), []);
  const yAt = typeof y === 'function' ? y : () => y;
  const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length, cz = poly.reduce((s, p) => s + p[1], 0) / poly.length;
  for (const [i, j, k] of tri) {
    const a = poly[i], b = poly[j], c = poly[k];
    soup.tri([a[0], yAt(a[0], a[1]), a[1]], [b[0], yAt(b[0], b[1]), b[1]], [c[0], yAt(c[0], c[1]), c[1]], [cx, yAt(cx, cz) + (down ? -10 : 10), cz]);
  }
}

/**
 * Extruded plan polygon from y0 to y1. `sides(i)` may return false to skip edge i, or a [yA, yB] sub-range; `top`/`bottom`
 * add the caps. Side faces face outward.
 */
export function prism(soup, poly, y0, y1, { top = true, bottom = false, sides = () => true, topSoup = soup } = {}) {
  const sa = area(poly);
  for (let i = 0; i < poly.length; i++) {
    const s = sides(i);
    if (s === false) continue;
    const [a0, a1] = Array.isArray(s) ? s : [y0, y1];
    wall(soup, poly[i], poly[(i + 1) % poly.length], a0, a1, sa);
  }
  if (top) cap(topSoup, poly, y1);
  if (bottom) cap(soup, poly, y0, true);
}

/** Axis-aligned-in-its-own-frame box: centre (cx, cz), half sizes (hx, hz) rotated by `rot` about +Y, from y0 to y1. */
export function boxAt(soup, cx, cz, hx, hz, y0, y1, rot = 0, opts = {}) {
  const c = Math.cos(rot), s = Math.sin(rot);
  const poly = [[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz]].map(([u, v]) => [cx + u * c - v * s, cz + u * s + v * c]);
  prism(soup, poly, y0, y1, opts);
  return poly;
}

/** A tapered vertical column (n-gon), open ended, with an optional cap on top. */
export function column(soup, cx, cz, r0, r1, y0, y1, n = 8, capTop = false) {
  const ring = (r, y) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(i / n * TAU), y, cz + r * Math.sin(i / n * TAU)]);
  const a = ring(r0, y0), b = ring(r1, y1), mid = [cx, (y0 + y1) / 2, cz];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const out = [(a[i][0] + a[j][0]) / 2 + (a[i][0] + a[j][0] - 2 * cx) * 5, mid[1], (a[i][2] + a[j][2]) / 2 + (a[i][2] + a[j][2] - 2 * cz) * 5];
    soup.quad(a[i], a[j], b[j], b[i], out);
  }
  if (capTop) for (let i = 1; i + 1 < n; i++) soup.tri(b[0], b[i], b[i + 1], [cx, y1 + 10, cz]);
}

/** A thin tilted bar from p to q with a rectangular cross-section w x d (d is along `up`), three visible faces + ends skipped. */
export function bar(soup, p, q, w, d, up = [0, 1, 0], caps = false) {
  const ax = q[0] - p[0], ay = q[1] - p[1], az = q[2] - p[2], l = Math.hypot(ax, ay, az);
  if (l < 1e-6) return;
  const a = [ax / l, ay / l, az / l];
  // side = a x up, normal = side x a
  let sx = a[1] * up[2] - a[2] * up[1], sy = a[2] * up[0] - a[0] * up[2], sz = a[0] * up[1] - a[1] * up[0];
  const sl = Math.hypot(sx, sy, sz) || 1; sx /= sl; sy /= sl; sz /= sl;
  const nx = sy * a[2] - sz * a[1], ny = sz * a[0] - sx * a[2], nz = sx * a[1] - sy * a[0];
  const o = (P, i, j) => [P[0] + sx * w / 2 * i + nx * d / 2 * j, P[1] + sy * w / 2 * i + ny * d / 2 * j, P[2] + sz * w / 2 * i + nz * d / 2 * j];
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
  soup.quad(o(p, -1, 1), o(q, -1, 1), o(q, 1, 1), o(p, 1, 1), [m[0] + nx * 5, m[1] + ny * 5, m[2] + nz * 5]);
  soup.quad(o(p, -1, 1), o(q, -1, 1), o(q, -1, -1), o(p, -1, -1), [m[0] - sx * 5, m[1] - sy * 5, m[2] - sz * 5]);
  soup.quad(o(p, 1, 1), o(q, 1, 1), o(q, 1, -1), o(p, 1, -1), [m[0] + sx * 5, m[1] + sy * 5, m[2] + sz * 5]);
  if (caps) soup.quad(o(q, -1, 1), o(q, 1, 1), o(q, 1, -1), o(q, -1, -1), [q[0] + a[0] * 5, q[1] + a[1] * 5, q[2] + a[2] * 5]);
}

/** Offset a plan polygon vertex-wise toward point `c` by fraction f (a uniform shrink about c). */
export const shrink = (poly, c, f) => poly.map(([x, z]) => [x + (c[0] - x) * f, z + (c[1] - z) * f]);
