import * as THREE from 'three';

// Small mesh kit for the SFMOMA model. Every function returns a THREE.BufferGeometry with a normal
// attribute so assetBuilder.put() can merge it by material. Frame: +X east, +Y up, +Z south. Design
// coordinates (u, v, y) go through `F` from sfmoma-site.js.

// Flat-shaded triangle soup. quad()/tri() take an optional `toward` point the face must face, which
// spares hand-checking every winding.
export class Soup {
  constructor() { this.p = []; }
  tri(a, b, c, toward) {
    const cx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), cy = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), cz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    if (cx * cx + cy * cy + cz * cz < 1e-10) return; // degenerate: no area, no normal
    if (toward) {
      const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
      if (n[0] * (toward[0] - a[0]) + n[1] * (toward[1] - a[1]) + n[2] * (toward[2] - a[2]) < 0) [b, c] = [c, b];
    }
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

const smooth = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };

// A rippled facade over a plan polyline `path` ([u, v] points), standing from `yBase` to `top(u)` on a
// grid of du x dy metres. Outward displacement d(t, y) = wave(t, y) fades to zero at the path ends, at the
// top edge and below `baseFade`; `windows` ({ t0, t1, y0, y1 }, snapped to grid lines) are cut as glazed
// cells recessed by `recess`; `lean(u, v, y)` shifts every vertex in plan (a function of position only, so walls sharing a corner agree). Returns { frp, glass, edge } where `edge` lists the top-edge points.
export function rippleWall({ F, path, inside, top, yBase, dy, du, wave, windows = [], recess = 0.5, corner = 1.5, topFade = 1.8, envelope = () => 1, skip = () => false, lean = () => [0, 0] }) {
  // Resample the path.
  const pts = [];
  let t = 0;
  for (let k = 0; k + 1 < path.length; k++) {
    const [a, b] = [path[k], path[k + 1]], len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(len / du));
    for (let i = 0; i < n; i++) pts.push({ u: a[0] + (b[0] - a[0]) * i / n, v: a[1] + (b[1] - a[1]) * i / n, t: t + len * i / n, seg: k });
    t += len;
  }
  const last = path[path.length - 1];
  pts.push({ u: last[0], v: last[1], t, seg: path.length - 2 });
  const total = t;
  const segN = path.slice(0, -1).map((a, k) => {
    const b = path[k + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let n = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if (n[0] * (mid[0] - inside[0]) + n[1] * (mid[1] - inside[1]) < 0) n = [-n[0], -n[1]];
    return n;
  });
  pts.forEach((p, i) => {
    const prev = i > 0 && pts[i - 1].seg !== p.seg ? segN[p.seg - 1] : null;
    let n = segN[p.seg];
    if (i > 0 && i < pts.length - 1) {
      // average with the neighbouring segment at a bend
      const q = pts[i - 1].seg !== p.seg ? segN[pts[i - 1].seg] : (pts[i + 1].seg !== p.seg ? segN[pts[i + 1].seg] : null);
      if (q) { n = [n[0] + q[0], n[1] + q[1]]; const l = Math.hypot(...n); n = [n[0] / l, n[1] / l]; }
    }
    void prev; p.n = n; p.top = top(p.u);
  });
  const maxTop = Math.max(...pts.map((p) => p.top)), rows = Math.ceil((maxTop - yBase) / dy - 1e-9);
  const snapT = (tt) => pts.reduce((best, p, i) => (Math.abs(p.t - tt) < Math.abs(pts[best].t - tt) ? i : best), 0);
  const wins = windows.map((w) => ({ i0: snapT(w.t0), i1: snapT(w.t1), j0: Math.round((w.y0 - yBase) / dy), j1: Math.round((w.y1 - yBase) / dy) }));
  const inWin = (i, j) => wins.some((w) => i >= w.i0 && i <= w.i1 && j >= w.j0 && j <= w.j1);
  const winCell = (i, j) => wins.some((w) => i >= w.i0 && i < w.i1 && j >= w.j0 && j < w.j1);
  const vert = (i, j) => {
    const p = pts[i], y = Math.min(yBase + j * dy, p.top);
    let d = 0;
    if (inWin(i, j)) d = -recess;
    else d = wave(p.t, y) * smooth(Math.min(p.t, total - p.t) / corner) * smooth((p.top - y) / topFade) * envelope(y, p);
    const [lu, lv] = lean(p.u, p.v, y);
    return F(p.u + p.n[0] * d + lu, y, p.v + p.n[1] * d + lv);
  };
  const flatVert = (i, j) => { const p = pts[i]; return F(p.u, Math.min(yBase + j * dy, p.top), p.v); };
  const outward = (i) => { const p = pts[i], a = F(p.u, 0, p.v), b = F(p.u + p.n[0], 0, p.v + p.n[1]); return [b[0] - a[0], b[1] - a[1], b[2] - a[2]]; };
  const map = new Map(), position = [], index = [];
  const id = (i, j) => { const key = i * 4096 + j; if (!map.has(key)) { map.set(key, position.length / 3); position.push(...vert(i, j)); } return map.get(key); };
  const glass = new Soup();
  for (let i = 0; i + 1 < pts.length; i++) {
    for (let j = 0; j < rows; j++) {
      const y0a = yBase + j * dy, tops = [pts[i].top, pts[i + 1].top];
      if (y0a >= tops[0] - 1e-6 && y0a >= tops[1] - 1e-6) continue;
      if (skip((pts[i].u + pts[i + 1].u) / 2, y0a, y0a + dy)) continue;
      const corners = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
      if (winCell(i, j)) {
        const o = outward(i), c = corners.map(([a, b]) => vert(a, b));
        const mid = [(c[0][0] + c[2][0]) / 2 + o[0] * 10, (c[0][1] + c[2][1]) / 2, (c[0][2] + c[2][2]) / 2 + o[2] * 10];
        glass.quad(c[0], c[1], c[2], c[3], mid);
        continue;
      }
      const ids = corners.map(([a, b]) => id(a, b)), o = outward(i), f = corners.map(([a, b]) => flatVert(a, b));
      const nrm = [(f[1][1] - f[0][1]) * (f[3][2] - f[0][2]) - (f[1][2] - f[0][2]) * (f[3][1] - f[0][1]), (f[1][2] - f[0][2]) * (f[3][0] - f[0][0]) - (f[1][0] - f[0][0]) * (f[3][2] - f[0][2]), (f[1][0] - f[0][0]) * (f[3][1] - f[0][1]) - (f[1][1] - f[0][1]) * (f[3][0] - f[0][0])];
      const flip = nrm[0] * o[0] + nrm[1] * o[1] + nrm[2] * o[2] < 0;
      const area = (a, b, c) => { const p = [a, b, c].map((k) => position.slice(k * 3, k * 3 + 3)); const u = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]], v = [p[2][0] - p[0][0], p[2][1] - p[0][1], p[2][2] - p[0][2]]; return Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]); };
      const tri = (a, b, c) => { if (area(a, b, c) < 1e-5) return; if (flip) index.push(a, c, b); else index.push(a, b, c); };
      // skip a sliver cell whose clamped top rows coincide
      if (Math.abs(f[3][1] - f[0][1]) < 1e-5 && Math.abs(f[2][1] - f[1][1]) < 1e-5) continue;
      tri(ids[0], ids[1], ids[2]); tri(ids[0], ids[2], ids[3]);
    }
  }
  let frp = null;
  if (index.length) {
    // keep only the vertices a triangle uses
    const remap = new Map(), pos = [];
    const idx = index.map((k) => { if (!remap.has(k)) { remap.set(k, pos.length / 3); pos.push(position[k * 3], position[k * 3 + 1], position[k * 3 + 2]); } return remap.get(k); });
    frp = new THREE.BufferGeometry();
    frp.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    frp.setIndex(idx); frp.computeVertexNormals();
  }
  return { frp, glass: glass.empty ? null : glass.geometry(), edge: pts.map((p) => { const [lu, lv] = lean(p.u, p.v, p.top); return [p.u + lu, p.v + lv, p.top]; }), rows, cols: pts.length - 1 };
}

// Zip a roof between two chains of [u, v, y] points that share their first and last point.
export function zipRoof(soup, F, a, b) {
  const P = (p) => F(p[0], p[2], p[1]);
  const toward = (p, q, r) => { const c = F((p[0] + q[0] + r[0]) / 3, 0, (p[1] + q[1] + r[1]) / 3); return [c[0], 1000, c[2]]; };
  let i = 0, j = 0;
  while (i < a.length - 1 || j < b.length - 1) {
    const advA = j >= b.length - 1 || (i < a.length - 1 && (i + 1) / (a.length - 1) <= (j + 1) / (b.length - 1));
    const same = (p, q) => Math.abs(p[0] - q[0]) < 1e-6 && Math.abs(p[1] - q[1]) < 1e-6;
    if (advA) { if (!same(a[i], b[j])) soup.tri(P(a[i]), P(b[j]), P(a[i + 1]), toward(a[i], b[j], a[i + 1])); i++; }
    else { if (!same(a[i], b[j])) soup.tri(P(a[i]), P(b[j]), P(b[j + 1]), toward(a[i], b[j], b[j + 1])); j++; }
  }
}
