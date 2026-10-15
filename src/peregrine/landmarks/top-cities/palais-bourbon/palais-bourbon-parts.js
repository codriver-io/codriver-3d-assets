// Palais Bourbon: shared helpers (triangle soups, the OSM part rings in local metres, roofs and facade rhythm).
// Local frame: +x east, +y up, +z south, origin = SPEC.origin. Self-contained: three + facade/geo.js only.
import * as THREE from 'three';
import { SPEC } from './config.js';
import { OSM_PARTS } from './palais-bourbon-osm.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

const K = mercStretch(SPEC.origin[1]), OX = lngToMercX(SPEC.origin[0]), OZ = latToMercY(SPEC.origin[1]);
export const local = ([lng, lat]) => [(lngToMercX(lng) - OX) / K, -(latToMercY(lat) - OZ) / K];

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// A triangle soup that flat-shades (one vertex per corner). `tf` (Matrix4) maps a frame's local axes to world.
export class Soup {
  constructor(tf = null) { this.pos = []; this.idx = []; this.tf = tf; this.geos = []; }
  v(p) { return this.tf ? new THREE.Vector3(...p).applyMatrix4(this.tf).toArray() : p; }
  tri(a, b, c, hint) {
    if (hint && dot(cross(sub(b, a), sub(c, a)), hint) < 0) [b, c] = [c, b];
    const o = this.pos.length / 3; this.pos.push(...this.v(a), ...this.v(b), ...this.v(c)); this.idx.push(o, o + 1, o + 2);
  }
  quad(a, b, c, d, hint) { this.tri(a, b, c, hint); this.tri(a, c, d, hint); }
  box(x0, x1, y0, y1, z0, z1, omit = []) {
    const P = (x, y, z) => [x, y, z];
    if (!omit.includes('east')) this.quad(P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1), [1, 0, 0]);
    if (!omit.includes('west')) this.quad(P(x0, y0, z0), P(x0, y1, z0), P(x0, y1, z1), P(x0, y0, z1), [-1, 0, 0]);
    if (!omit.includes('top')) this.quad(P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1), [0, 1, 0]);
    if (!omit.includes('bottom')) this.quad(P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1), [0, -1, 0]);
    if (!omit.includes('south')) this.quad(P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1), [0, 0, 1]);
    if (!omit.includes('north')) this.quad(P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0), [0, 0, -1]);
  }
  // Smooth-shaded geometry (lathe columns, statues), carried through the frame transform.
  geo(g) { if (this.tf) g.applyMatrix4(this.tf); this.geos.push(g); }
  lathe(x, z, pts, seg, y0 = 0) {
    const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y + y0)), seg); g.translate(x, 0, z); this.geo(g);
  }
  flush(b, mat) {
    if (this.idx.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3)); g.setIndex(this.idx); g.computeVertexNormals(); b.put(g, mat);
    }
    for (const g of this.geos) b.put(g, mat);
  }
}
export class Kit {
  constructor() { this.map = new Map(); }
  soup(mat, tf = null, key = '') {
    const k = `${mat}|${key}`;
    if (!this.map.has(k)) this.map.set(k, { mat, soup: new Soup(tf) });
    return this.map.get(k).soup;
  }
  flush(b) { for (const { mat, soup } of this.map.values()) soup.flush(b, mat); }
}
// A frame whose local +z points away from the building's front, rotated by phi about +y and moved to (cx, cz).
export function frame(kit, key, cx, cz, phi) {
  const tf = new THREE.Matrix4().makeTranslation(cx, 0, cz).multiply(new THREE.Matrix4().makeRotationY(phi));
  return Object.assign((mat) => kit.soup(mat, tf, key), { tf });
}

function area(p) { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } return a / 2; }
export function inside(p, x, z) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++)
    if ((p[i][1] > z) !== (p[j][1] > z) && x < (p[j][0] - p[i][0]) * (z - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c;
  return c;
}
export function obbOf(pts) {
  let best = null;
  for (let a = 0; a < 180; a += 0.5) {
    const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
    for (const [x, z] of pts) { const u = x * c + z * s, v = -x * s + z * c; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
    const A = (u1 - u0) * (v1 - v0);
    if (!best || A < best.A) best = { A, r, u0, u1, v0, v1 };
  }
  let { r, u0, u1, v0, v1 } = best;
  let c = Math.cos(r), s = Math.sin(r), hw = (u1 - u0) / 2, hd = (v1 - v0) / 2;
  const cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
  let ux = c, uz = s;
  if (hd > hw) { [hw, hd] = [hd, hw]; ux = -s; uz = c; } // u is always the long axis
  return { cx: cu * c - cv * s, cz: cu * s + cv * c, ux, uz, vx: -uz, vz: ux, hw, hd, fill: Math.abs(area(pts)) / (4 * hw * hd) };
}

const GENERIC_SKIP = new Set([380420446, 1459531652, 1459531653, 1459531654, 1459801045, 1459531667, 1459919796, 1459919798]);
export const PARTS = OSM_PARTS.map(([id, part, h, min, roof, rh, ring]) => {
  let pts = ring.slice(0, -1).map(local);
  if (area(pts) < 0) pts = pts.reverse();
  const roofy = ['gabled', 'hipped', 'skillion', 'mansard', 'gambrel', 'dome'].includes(roof);
  const rhh = roofy ? (rh || (roof === 'hipped' ? 3 : 2)) : 0;
  const p = { id, part, h, min, roof, rh: rhh, pts, wallTop: h - rhh };
  if (part !== 'column') p.obb = obbOf(pts);
  p.generic = part !== 'column' && !GENERIC_SKIP.has(id);
  return p;
});
export const partById = (id) => PARTS.find((p) => p.id === id);

function hiddenAt(x, z, y, self) {
  for (const o of PARTS) if (o !== self && o.part !== 'column' && y < o.h && y >= o.min && inside(o.pts, x, z)) return true;
  return false;
}

// ---- walls, roofs ------------------------------------------------------------------------------------------
function walls(S, p, y0, y1) {
  const n = p.pts.length;
  for (let i = 0; i < n; i++) {
    const a = p.pts[i], b = p.pts[(i + 1) % n], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1;
    S.quad([a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], [dz / l, 0, -dx / l]);
  }
}
function cap(S, pts, y, up = true) {
  const faces = THREE.ShapeUtils.triangulateShape(pts.map((q) => new THREE.Vector2(q[0], q[1])), []);
  for (const [i, j, k] of faces) S.tri([pts[i][0], y, pts[i][1]], [pts[j][0], y, pts[j][1]], [pts[k][0], y, pts[k][1]], [0, up ? 1 : -1, 0]);
}
const corner = (o, sx, sz, inset = 0) => [o.cx + o.ux * sx * (o.hw - inset) + o.vx * sz * (o.hd - inset), o.cz + o.uz * sx * (o.hw - inset) + o.vz * sz * (o.hd - inset)];

function roofOn(K, p, near) {
  const wing = K.soup('wing'), slate = K.soup('slate'), glass = K.soup('glass'), o = p.obb, y = p.wallTop, rh = p.rh;
  const P = (q, yy) => [q[0], yy, q[1]];
  const okObb = o.fill >= 0.85;
  if (!p.roof || p.roof === 'flat' || !rh) { cap(slate, p.pts, p.h); return; }
  if (!okObb && p.roof !== 'dome') { // concave range: walls rise most of the roof and a flat zinc cap closes them
    return { lift: rh * 0.6 };
  }
  const R = (sx, sz, ins = 0) => corner(o, sx, sz, ins);
  const U = [o.ux, 0, o.uz], V = [o.vx, 0, o.vz];
  if (p.roof === 'gabled') {
    const r1 = [o.cx - o.ux * o.hw, o.cz - o.uz * o.hw], r2 = [o.cx + o.ux * o.hw, o.cz + o.uz * o.hw];
    for (const s of [-1, 1]) {
      const a = R(-1, s), b = R(1, s);
      slate.quad(P(a, y), P(b, y), P(r2, y + rh), P(r1, y + rh), [s * V[0], 0.6, s * V[2]]);
      wing.tri(P(R(1, -1), y), P(R(1, 1), y), P(r2, y + rh), U);
      wing.tri(P(R(-1, -1), y), P(R(-1, 1), y), P(r1, y + rh), [-U[0], 0, -U[2]]);
    }
  } else if (p.roof === 'hipped') {
    const e = Math.max(0, o.hw - o.hd), r1 = [o.cx - o.ux * e, o.cz - o.uz * e], r2 = [o.cx + o.ux * e, o.cz + o.uz * e];
    slate.quad(P(R(-1, 1), y), P(R(1, 1), y), P(r2, y + rh), P(r1, y + rh), [V[0], 0.7, V[2]]);
    slate.quad(P(R(-1, -1), y), P(R(1, -1), y), P(r2, y + rh), P(r1, y + rh), [-V[0], 0.7, -V[2]]);
    slate.tri(P(R(1, -1), y), P(R(1, 1), y), P(r2, y + rh), [U[0], 0.7, U[2]]);
    slate.tri(P(R(-1, -1), y), P(R(-1, 1), y), P(r1, y + rh), [-U[0], 0.7, -U[2]]);
  } else if (p.roof === 'skillion') {
    // The high edge is on the side facing the hemicycle, the middle of the complex.
    const mid = [4, 6], s = ((mid[0] - o.cx) * o.vx + (mid[1] - o.cz) * o.vz) >= 0 ? 1 : -1;
    slate.quad(P(R(-1, -s), y), P(R(1, -s), y), P(R(1, s), y + rh), P(R(-1, s), y + rh), [-s * V[0], 0.6, -s * V[2]]);
    wing.quad(P(R(-1, s), y), P(R(1, s), y), P(R(1, s), y + rh), P(R(-1, s), y + rh), [s * V[0], 0, s * V[2]]);
    wing.tri(P(R(1, -s), y), P(R(1, s), y), P(R(1, s), y + rh), U);
    wing.tri(P(R(-1, -s), y), P(R(-1, s), y), P(R(-1, s), y + rh), [-U[0], 0, -U[2]]);
  } else if (p.roof === 'mansard' || p.roof === 'gambrel') {
    const i1 = Math.min(1.7, o.hd * 0.2), i2 = i1 + Math.min(3.2, o.hd * 0.3), y1 = y + rh * 0.82, y2 = y + rh;
    const ring = (i) => [R(-1, -1, i), R(1, -1, i), R(1, 1, i), R(-1, 1, i)];
    const r0 = ring(0), ra = ring(i1), rb = ring(i2);
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, mx = (r0[i][0] + r0[j][0]) / 2 - o.cx, mz = (r0[i][1] + r0[j][1]) / 2 - o.cz;
      slate.quad(P(r0[i], y), P(r0[j], y), P(ra[j], y1), P(ra[i], y1), [mx, 1, mz]);
      slate.quad(P(ra[i], y1), P(ra[j], y1), P(rb[j], y2), P(rb[i], y2), [mx, 3, mz]);
    }
    cap(slate, rb, y2);
    if (near) dormers(K, p, r0, ra, y, y1);
  } else if (p.roof === 'dome') { // flat-pitched lantern roof: two tiers and a glazed cap
    const c = [o.cx, o.cz];
    const sc = (s) => p.pts.map((q) => [c[0] + (q[0] - c[0]) * s, c[1] + (q[1] - c[1]) * s]);
    const t1 = sc(0.86), t2 = sc(0.58), a1 = y + rh * 0.45, a2 = y + rh;
    for (const [lo, hi, ylo, yhi, mat] of [[p.pts, t1, y, a1, slate], [t1, t2, a1, a2, slate]])
      for (let i = 0; i < lo.length; i++) {
        const j = (i + 1) % lo.length, mx = lo[i][0] - c[0], mz = lo[i][1] - c[1];
        mat.quad(P(lo[i], ylo), P(lo[j], ylo), P(hi[j], yhi), P(hi[i], yhi), [mx, 1.2, mz]);
      }
    cap(glass, t2, a2);
  }
}
// Pedimented dormers on the steep slope of a mansard, one every ~3.8 m.
function dormers(K, p, r0, ra, y, y1) {
  const wing = K.soup('wing'), win = K.soup('window'), slate = K.soup('slate');
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, a = r0[i], b = r0[j], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (l < 7) continue;
    const dx = (b[0] - a[0]) / l, dz = (b[1] - a[1]) / l, n = [dz, -dx];
    const out = ((a[0] + b[0]) / 2 - p.obb.cx) * n[0] + ((a[1] + b[1]) / 2 - p.obb.cz) * n[1] >= 0 ? 1 : -1;
    const nx = out * n[0], nz = out * n[1], cnt = Math.max(1, Math.floor((l - 2) / 3.8));
    for (let k = 0; k < cnt; k++) {
      const i1 = Math.min(1.7, p.obb.hd * 0.2), t = 1 + (l - 2) * (k + 0.5) / cnt, tt = 0.42, bx = a[0] + dx * t - nx * i1 * tt, bz = a[1] + dz * t - nz * i1 * tt;
      if (hiddenAt(bx + nx * 0.7, bz + nz * 0.7, y + 0.5, p)) continue;
      const yb = y + (y1 - y) * tt - 0.2, w = 0.55, d = 0.5, h = 1.3;
      const f = (s, o, yy) => [bx + dx * s + nx * o, yy, bz + dz * s + nz * o];
      wing.quad(f(-w, d, yb), f(w, d, yb), f(w, d, yb + h), f(-w, d, yb + h), [nx, 0, nz]);
      wing.quad(f(-w, 0, yb), f(-w, d, yb), f(-w, d, yb + h), f(-w, 0, yb + h), [-dx, 0, -dz]);
      wing.quad(f(w, 0, yb), f(w, d, yb), f(w, d, yb + h), f(w, 0, yb + h), [dx, 0, dz]);
      slate.quad(f(-w - 0.1, d + 0.1, yb + h), f(w + 0.1, d + 0.1, yb + h), f(w + 0.1, -0.2, yb + h + 0.4), f(-w - 0.1, -0.2, yb + h + 0.4), [nx * 0.3, 1, nz * 0.3]);
      win.quad(f(-0.38, d + 0.1, yb + 0.15), f(0.38, d + 0.1, yb + 0.15), f(0.38, d + 0.1, yb + h - 0.15), f(-0.38, d + 0.1, yb + h - 0.15), [nx, 0, nz]);
    }
  }
}

// ---- facade rhythm -----------------------------------------------------------------------------------------
function facade(K, p, near) {
  const win = K.soup('window'), trim = K.soup('stone');
  const n = p.pts.length, H = p.wallTop - p.min + (p.liftWall || 0), top = p.wallTop + (p.liftWall || 0);
  if (H < 5) return;
  for (let i = 0; i < n; i++) {
    const a = p.pts[i], b = p.pts[(i + 1) % n], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz);
    if (l < 3.2) continue;
    const ex = dx / l, ez = dz / l, nx = ez, nz = -ex;
    // stringcourse and cornice, skipped where another wing buries this edge
    const mid = [(a[0] + b[0]) / 2 + nx * 0.5, (a[1] + b[1]) / 2 + nz * 0.5];
    if (!hiddenAt(mid[0], mid[1], top - 0.3, p)) {
      const q = (s, o, y) => [a[0] + ex * s + nx * o, y, a[1] + ez * s + nz * o];
      const oc = near ? 0.38 : 0.45, ct = near ? 0.55 : 0.8;
      trim.quad(q(0, oc, top - ct), q(l, oc, top - ct), q(l, oc, top), q(0, oc, top), [nx, 0, nz]);
      trim.quad(q(0, 0, top), q(l, 0, top), q(l, oc, top), q(0, oc, top), [0, 1, 0]);
      if (near) trim.quad(q(0, 0, top - ct), q(l, 0, top - ct), q(l, oc, top - ct), q(0, oc, top - ct), [0, -1, 0]);
    }
    const sp = near ? 3.0 : 6.0, cnt = Math.max(1, Math.floor((l - 1.8) / sp) + 1), start = (l - (cnt - 1) * sp) / 2;
    const floors = Math.max(1, Math.round((H - 2.4) / 4.3)), fh = (H - 1.5) / floors, ww = near ? 1.15 : 2.1, wh = Math.min(2.4, fh * 0.58);
    const off = near ? 0.13 : 0.22;
    for (let c = 0; c < cnt; c++) {
      const t = start + c * sp;
      // The authored south entrance owns these bays; never stack generic windows under its blue door.
      if (p.id === 1459531665 && nz > 0.7) continue;
      for (let f = 0; f < floors; f++) {
        const yc = p.min + 1.4 + (f + 0.5) * fh;
        if (yc + wh / 2 > top - 0.6 || hiddenAt(a[0] + ex * t + nx * 0.6, a[1] + ez * t + nz * 0.6, yc, p)) continue;
        const q = (s, y) => [a[0] + ex * (t + s) + nx * off, y, a[1] + ez * (t + s) + nz * off];
        win.quad(q(-ww / 2, yc - wh / 2), q(ww / 2, yc - wh / 2), q(ww / 2, yc + wh / 2), q(-ww / 2, yc + wh / 2), [nx, 0, nz]);
      }
    }
  }
}

export function buildPart(K, p, near) {
  if (p.min > 0 && p.part !== 'yes') return;
  p.liftWall = 0;
  const wing = K.soup('wing');
  const r = roofOn(K, p, near);
  let top = p.wallTop;
  if (r && r.lift) { top = p.wallTop + r.lift; p.liftWall = r.lift; cap(K.soup('slate'), p.pts, top); }
  walls(wing, p, p.min, top);
  facade(K, p, near);
}
export function buildGeneric(K, near) {
  for (const p of PARTS) if (p.generic) buildPart(K, p, near);
}
