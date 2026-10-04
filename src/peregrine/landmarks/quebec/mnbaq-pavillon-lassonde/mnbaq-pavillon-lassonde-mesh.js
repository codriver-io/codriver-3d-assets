import * as THREE from 'three';

// Small mesh kit for the Pavillon Pierre-Lassonde. Flat-shaded triangle soup per material; quad()/tri() take a `toward` point the face must
// face, which spares hand-checking every winding. Design coordinates (a, y, b) go through `F` from mnbaq-pavillon-lassonde-site.js.
export class Soup {
  constructor() { this.p = []; }
  tri(a, b, c, toward) {
    const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
    if (n[0] * n[0] + n[1] * n[1] + n[2] * n[2] < 1e-10) return; // no area, no normal
    if (toward && n[0] * (toward[0] - a[0]) + n[1] * (toward[1] - a[1]) + n[2] * (toward[2] - a[2]) < 0) [b, c] = [c, b];
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

  // Horizontal quad over [a0,a1] x [b0,b1] at height y, facing up or down.
  flat(F, [a0, a1], [b0, b1], y, up = true) {
    this.quad(F(a0, y, b0), F(a1, y, b0), F(a1, y, b1), F(a0, y, b1), F((a0 + a1) / 2, y + (up ? 10 : -10), (b0 + b1) / 2));
  }

  // Axis-aligned box in design coordinates. Faces: nw (a0), se (a1), sw (b0), ne (b1), top, bottom; `skip` drops faces nobody sees.
  box(F, [a0, a1], [b0, b1], [y0, y1], skip = []) {
    const ac = (a0 + a1) / 2, bc = (b0 + b1) / 2, yc = (y0 + y1) / 2;
    const faces = {
      nw: [F(a0, y0, b0), F(a0, y0, b1), F(a0, y1, b1), F(a0, y1, b0), F(a0 - 10, yc, bc)],
      se: [F(a1, y0, b0), F(a1, y0, b1), F(a1, y1, b1), F(a1, y1, b0), F(a1 + 10, yc, bc)],
      sw: [F(a0, y0, b0), F(a1, y0, b0), F(a1, y1, b0), F(a0, y1, b0), F(ac, yc, b0 - 10)],
      ne: [F(a0, y0, b1), F(a1, y0, b1), F(a1, y1, b1), F(a0, y1, b1), F(ac, yc, b1 + 10)],
      top: [F(a0, y1, b0), F(a1, y1, b0), F(a1, y1, b1), F(a0, y1, b1), F(ac, y1 + 10, bc)],
      bottom: [F(a0, y0, b0), F(a1, y0, b0), F(a1, y0, b1), F(a0, y0, b1), F(ac, y0 - 10, bc)],
    };
    for (const [k, f] of Object.entries(faces)) if (!skip.includes(k)) this.quad(...f);
  }

  // Extrude a planar quad (four points in order) along `d` (a vector in model metres) and close the listed sides: 0..3 = edge i -> i+1.
  slat(front, d, sides = [0, 1, 2, 3]) {
    const lift = (p) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
    const top = front.map(lift), cen = top.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4, s[2] + p[2] / 4], [0, 0, 0]);
    const mag = Math.hypot(...d) || 1, out = [cen[0] + d[0] / mag * 10, cen[1] + d[1] / mag * 10, cen[2] + d[2] / mag * 10];
    this.quad(top[0], top[1], top[2], top[3], out);
    const mid = front.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4, s[2] + p[2] / 4], [0, 0, 0]);
    for (const i of sides) {
      const j = (i + 1) % 4, e0 = front[i], e1 = front[j], t0 = top[i], t1 = top[j];
      const em = [(e0[0] + e1[0]) / 2, (e0[1] + e1[1]) / 2, (e0[2] + e1[2]) / 2];
      const away = [em[0] + (em[0] - mid[0]) * 10, em[1] + (em[1] - mid[1]) * 10, em[2] + (em[2] - mid[2]) * 10];
      this.quad(e0, e1, t1, t0, away);
    }
  }
}

// A vertical wall seen as a plan segment p -> q (design [a, b]) with an outward unit normal n; t runs along it from p, y is up and
// `off` pushes a point outward along n.
export class Face {
  constructor(F, p, q, n) {
    Object.assign(this, { F, p, q, n });
    this.len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    this.u = [(q[0] - p[0]) / this.len, (q[1] - p[1]) / this.len];
  }
  pt(t, y, off = 0) { return this.F(this.p[0] + this.u[0] * t + this.n[0] * off, y, this.p[1] + this.u[1] * t + this.n[1] * off); }
}

// Flat panel on a Face, [t0,t1] x [y0,y1], pushed `off` outward.
Soup.prototype.panel = function panel(f, t0, t1, y0, y1, off = 0) {
  this.quad(f.pt(t0, y0, off), f.pt(t1, y0, off), f.pt(t1, y1, off), f.pt(t0, y1, off), f.pt((t0 + t1) / 2, (y0 + y1) / 2, off + 10));
};
// Vertical post proud of the face by d, w wide, closed on both long sides.
Soup.prototype.mullion = function mullion(f, t, y0, y1, w, d) {
  const h = w / 2;
  this.panel(f, t - h, t + h, y0, y1, d);
  for (const sg of [-1, 1]) this.quad(f.pt(t + sg * h, y0, 0), f.pt(t + sg * h, y0, d), f.pt(t + sg * h, y1, d), f.pt(t + sg * h, y1, 0), f.pt(t + sg * (h + 10), (y0 + y1) / 2, d / 2));
};
// Horizontal rail proud of the face by d, h tall, closed top and bottom.
Soup.prototype.rail = function rail(f, t0, t1, y, h, d) {
  const lo = y - h / 2, hi = y + h / 2;
  this.panel(f, t0, t1, lo, hi, d);
  const m = (t0 + t1) / 2;
  this.quad(f.pt(t0, hi, 0), f.pt(t1, hi, 0), f.pt(t1, hi, d), f.pt(t0, hi, d), f.pt(m, hi + 10, d / 2));
  this.quad(f.pt(t0, lo, 0), f.pt(t1, lo, 0), f.pt(t1, lo, d), f.pt(t0, lo, d), f.pt(m, lo - 10, d / 2));
};
// Diagonal brace from (t0, y0) to (t1, y1), w thick measured vertically, proud by d, closed on its two long sides.
Soup.prototype.brace = function brace(f, t0, y0, t1, y1, w, d) {
  const h = w / 2, tm = (t0 + t1) / 2, ym = (y0 + y1) / 2, dt = t1 - t0, dy = y1 - y0, l = Math.hypot(dt, dy);
  const nt = -dy / l * 5, ny = dt / l * 5; // the brace's upper side faces (nt, ny) in the face plane
  this.quad(f.pt(t0, y0 - h, d), f.pt(t1, y1 - h, d), f.pt(t1, y1 + h, d), f.pt(t0, y0 + h, d), f.pt(tm, ym, d + 10));
  this.quad(f.pt(t0, y0 + h, 0), f.pt(t1, y1 + h, 0), f.pt(t1, y1 + h, d), f.pt(t0, y0 + h, d), f.pt(tm + nt, ym + ny, d / 2));
  this.quad(f.pt(t0, y0 - h, 0), f.pt(t1, y1 - h, 0), f.pt(t1, y1 - h, d), f.pt(t0, y0 - h, d), f.pt(tm - nt, ym - ny, d / 2));
};
