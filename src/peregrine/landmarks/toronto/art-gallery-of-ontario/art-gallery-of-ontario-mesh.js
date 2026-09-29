import * as THREE from 'three';

// Small triangle-soup builder for the AGO model. Every face is oriented against
// an explicit "outward" hint, so a wrong winding cannot survive: the geometry's
// front side is always the side the hint names. Vertices are welded on export
// (same position and normal), which keeps the GLB small.
export class Soup {
  constructor() { this.p = []; this.n = []; }
  get triangles() { return this.p.length / 9; }
  // Flat triangle. `hint` is a direction the face must look toward (optional).
  tri(a, b, c, hint) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz); if (l < 1e-10) return;
    nx /= l; ny /= l; nz /= l;
    if (hint && nx * hint[0] + ny * hint[1] + nz * hint[2] < 0) { const t = b; b = c; c = t; nx = -nx; ny = -ny; nz = -nz; }
    this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    this.n.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
  }
  quad(a, b, c, d, hint) { this.tri(a, b, c, hint); this.tri(a, c, d, hint); }
  // Smooth lofted surface through a grid of points (rows x columns), with
  // area-weighted vertex normals; `hint` picks the visible side.
  grid(rows, hint) {
    const R = rows.length, C = rows[0].length, nor = rows.map((r) => r.map(() => [0, 0, 0]));
    const face = (i0, j0, i1, j1, i2, j2) => {
      const a = rows[i0][j0], b = rows[i1][j1], c = rows[i2][j2];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      return [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
    };
    const tris = [];
    for (let i = 0; i < R - 1; i++) for (let j = 0; j < C - 1; j++) {
      tris.push([[i, j], [i + 1, j], [i + 1, j + 1]], [[i, j], [i + 1, j + 1], [i, j + 1]]);
    }
    let sign = 0;
    for (const t of tris) {
      const n = face(t[0][0], t[0][1], t[1][0], t[1][1], t[2][0], t[2][1]);
      sign += n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2];
    }
    sign = sign >= 0 ? 1 : -1;
    for (const t of tris) {
      const n = face(t[0][0], t[0][1], t[1][0], t[1][1], t[2][0], t[2][1]);
      for (const [i, j] of t) { nor[i][j][0] += sign * n[0]; nor[i][j][1] += sign * n[1]; nor[i][j][2] += sign * n[2]; }
    }
    const unit = ([x, y, z]) => { const l = Math.hypot(x, y, z) || 1; return [x / l, y / l, z / l]; };
    for (const t of tris) {
      const order = sign > 0 ? t : [t[0], t[2], t[1]];
      for (const [i, j] of order) { this.p.push(...rows[i][j]); this.n.push(...unit(nor[i][j])); }
    }
  }
  // Closed convex-ish prism from a 2-D outline in a plane, extruded along `dir`.
  // (Used for end caps and pediments.) Triangulated by ear clipping.
  cap(points3, hint) {
    const pts = points3.map((p) => p.slice());
    // Project onto the plane's dominant axes.
    const n = polygonNormal(pts);
    const ax = [Math.abs(n[0]), Math.abs(n[1]), Math.abs(n[2])], drop = ax.indexOf(Math.max(...ax));
    const flat = pts.map((p) => new THREE.Vector2(...[0, 1, 2].filter((k) => k !== drop).map((k) => p[k])));
    const idx = THREE.ShapeUtils.triangulateShape(flat, []);
    for (const [i, j, k] of idx) this.tri(pts[i], pts[j], pts[k], hint || n);
  }
  geometry() {
    // Weld identical (position, normal) vertices into an indexed geometry.
    const map = new Map(), pos = [], nor = [], index = [];
    for (let i = 0; i < this.p.length / 3; i++) {
      const px = this.p[i * 3], py = this.p[i * 3 + 1], pz = this.p[i * 3 + 2], nx = this.n[i * 3], ny = this.n[i * 3 + 1], nz = this.n[i * 3 + 2];
      const key = `${px.toFixed(3)},${py.toFixed(3)},${pz.toFixed(3)},${nx.toFixed(2)},${ny.toFixed(2)},${nz.toFixed(2)}`;
      let at = map.get(key);
      if (at === undefined) { at = pos.length / 3; map.set(key, at); pos.push(px, py, pz); nor.push(nx, ny, nz); }
      index.push(at);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setIndex(index);
    return g;
  }
}

function polygonNormal(pts) {
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    x += (a[1] - b[1]) * (a[2] + b[2]); y += (a[2] - b[2]) * (a[0] + b[0]); z += (a[0] - b[0]) * (a[1] + b[1]);
  }
  const l = Math.hypot(x, y, z) || 1; return [x / l, y / l, z / l];
}

// Polygon (in the site's u/v plane) extruded between two heights. `pt(u, y, v)`
// maps site coordinates to model metres. Walls get `wallSoup(midU, midV, i)`;
// the top goes to `topSoup`; a bottom is never built (nothing looks up at it).
export function extrude(poly, y0, y1, pt, wallSoup, topSoup, { skipWall = () => false } = {}) {
  const clean = poly.filter((p, i) => { const q = poly[(i + 1) % poly.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.04; });
  let area = 0;
  for (let i = 0; i < clean.length; i++) { const a = clean[i], b = clean[(i + 1) % clean.length]; area += a[0] * b[1] - b[0] * a[1]; }
  // In (u, v) with u east-ish and v south-ish the outward normal of edge d is (dv, -du) for area > 0.
  const s = area > 0 ? 1 : -1;
  for (let i = 0; i < clean.length; i++) {
    const a = clean[i], b = clean[(i + 1) % clean.length];
    const du = b[0] - a[0], dv = b[1] - a[1], len = Math.hypot(du, dv);
    if (skipWall(a, b, i)) continue;
    const outward = pt(0, 0, 0), o2 = pt(s * dv / len, 0, -s * du / len);
    const hint = [o2[0] - outward[0], 0, o2[2] - outward[2]];
    const soup = wallSoup((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, i, len);
    if (!soup) continue;
    soup.quad(pt(a[0], y0, a[1]), pt(b[0], y0, b[1]), pt(b[0], y1, b[1]), pt(a[0], y1, a[1]), hint);
  }
  if (topSoup) {
    const flat = clean.map(([u, v]) => new THREE.Vector2(u, v));
    for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(flat, [])) topSoup.tri(pt(...[clean[i][0], y1, clean[i][1]]), pt(clean[j][0], y1, clean[j][1]), pt(clean[k][0], y1, clean[k][1]), [0, 1, 0]);
  }
}
