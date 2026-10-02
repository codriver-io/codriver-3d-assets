import * as THREE from 'three';

// Small solid-modelling kit for the ROM, authored in the museum's own frame:
// (u, y, v) = (along Bloor Street, up, into the museum). The caller rotates the finished
// geometry into east/up/south once, so nothing here knows about the street grid.
//
// A `Face` is one planar polygon with an outward normal. Everything the Crystal shows,
// cladding seams, glazing, mullions, is laid on a face as a thin overlay in the face's own
// 2D frame, so a window can never drift off the plane it belongs to.

const EPS = 1e-6;
export const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

/** Polygon normal by Newell's method (right-hand rule over the winding). */
export function newell(pts) {
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    x += (a[1] - b[1]) * (a[2] + b[2]); y += (a[2] - b[2]) * (a[0] + b[0]); z += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return [x, y, z];
}

/** Planar frame of a polygon: origin, in-plane unit axes e1/e2, outward normal n (e1 x e2 = n). */
export function frameOf(pts, hint) {
  let n = newell(pts); if (len(n) < EPS) return null; n = norm(n);
  if (hint && dot(n, hint) < 0) n = [-n[0], -n[1], -n[2]];
  // e1: the direction of the longest edge, so `dir: 0` seams follow the panel's long side.
  let best = 0, e1 = null;
  for (let i = 0; i < pts.length; i++) { const d = sub(pts[(i + 1) % pts.length], pts[i]); const l = len(d); if (l > best) { best = l; e1 = d; } }
  e1 = norm(add(e1, n, -dot(e1, n)));
  const e2 = cross(n, e1);
  return { o: pts[0], e1, e2, n };
}
export const to2 = (f, p) => { const d = sub(p, f.o); return [dot(d, f.e1), dot(d, f.e2)]; };
export const to3 = (f, q, off = 0) => [f.o[0] + f.e1[0] * q[0] + f.e2[0] * q[1] + f.n[0] * off, f.o[1] + f.e1[1] * q[0] + f.e2[1] * q[1] + f.n[1] * off, f.o[2] + f.e1[2] * q[0] + f.e2[2] * q[1] + f.n[2] * off];

/** A flat-shaded polygon as BufferGeometry (indexed, one normal), triangulated in its own plane. */
export function polyGeom(pts, normalHint) {
  const clean = pts.filter((p, i) => len(sub(p, pts[(i + 1) % pts.length])) > 1e-4);
  if (clean.length < 3) return null;
  const f = frameOf(clean, normalHint); if (!f) return null;
  const c2 = clean.map((p) => new THREE.Vector2(...to2(f, p)));
  const tris = THREE.ShapeUtils.triangulateShape(c2, []);
  if (!tris.length) return null;
  const index = [];
  for (const [a, b, c] of tris) {
    const n = cross(sub(clean[b], clean[a]), sub(clean[c], clean[a]));
    if (dot(n, f.n) >= 0) index.push(a, b, c); else index.push(a, c, b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(clean.flat(), 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(clean.flatMap(() => f.n), 3));
  g.setIndex(index);
  return g;
}

/** Sutherland-Hodgman: subject polygon clipped to a CONVEX clip polygon (2D). */
export function clipConvex(subject, clip) {
  const ccw = area2(clip) > 0;
  let out = subject;
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length], inp = out; out = [];
    const side = (p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    const keep = (p) => (ccw ? side(p) >= -1e-9 : side(p) <= 1e-9);
    for (let j = 0; j < inp.length; j++) {
      const p = inp[j], q = inp[(j + 1) % inp.length], kp = keep(p), kq = keep(q);
      if (kp) out.push(p);
      if (kp !== kq) { const sp = side(p), sq = side(q), t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    }
  }
  return out;
}
/** Convex hull (2D, monotone chain). */
export function hull2(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = []; for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  const up = []; for (const q of p.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

/** Signed area (u,v plane) > 0 for counter-clockwise seen from +y looking down with u right / v down. */
export const area2 = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return a / 2; };

export function inside2(ring, x, y) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, ay] = ring[j], [bx, by] = ring[i];
    if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) hit = !hit;
  }
  return hit;
}

/**
 * The kit bound to one assetBuilder. `put(g, mat)` receives geometry in (u,y,v).
 * Every helper returns Face objects so a caller can dress them afterwards.
 */
export function kit(put, { near = true } = {}) {
  const face = (pts, mat, hint) => {
    const f = frameOf(pts, hint); if (!f) return null;
    const F = { pts, mat, ...f, ring: pts.map((p) => to2(f, p)) };
    const g = polyGeom(pts, f.n); if (g) put(g, mat);
    return F;
  };
  /** A face that is NOT drawn on its own (its solid draws it elsewhere), only dressed. */
  const ghost = (pts, hint) => { const f = frameOf(pts, hint); return f ? { pts, ...f, ring: pts.map((p) => to2(f, p)) } : null; };

  /** Geometry laid on the face plane: polygon given in 3D (projected onto the plane) or as 2D face coordinates. */
  function patch(F, ring, mat, off = 0.05, is2 = false) {
    const r2 = is2 ? ring : ring.map((p) => to2(F, p));
    const p3 = r2.map((q) => to3(F, q, off));
    const g = polyGeom(p3, F.n); if (g) put(g, mat);
    return r2;
  }

  /** Hatching (seams, mullions): parallel strips clipped to `ring2` (face coordinates). */
  function hatch(F, ring2, { angle = 0, step = 1, width = 0.05, off = 0.03, mat = 'frame', phase = 0 } = {}) {
    const d = [Math.cos(angle), Math.sin(angle)], p = [-d[1], d[0]];
    let lo = Infinity, hi = -Infinity;
    for (const q of ring2) { const t = q[0] * p[0] + q[1] * p[1]; lo = Math.min(lo, t); hi = Math.max(hi, t); }
    let count = 0;
    for (let k = Math.ceil((lo - phase) / step); phase + k * step < hi; k++) {
      const t = phase + k * step, xs = [];
      for (let i = 0, j = ring2.length - 1; i < ring2.length; j = i++) {
        const a = ring2[j], b = ring2[i], ta = a[0] * p[0] + a[1] * p[1] - t, tb = b[0] * p[0] + b[1] * p[1] - t;
        if ((ta > 0) !== (tb > 0)) { const s = ta / (ta - tb); xs.push((a[0] + (b[0] - a[0]) * s) * d[0] + (a[1] + (b[1] - a[1]) * s) * d[1]); }
      }
      xs.sort((x, y) => x - y);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        if (xs[i + 1] - xs[i] < 0.05) continue;
        const a = [d[0] * xs[i] + p[0] * t, d[1] * xs[i] + p[1] * t], b = [d[0] * xs[i + 1] + p[0] * t, d[1] * xs[i + 1] + p[1] * t];
        const w = width / 2;
        const quad = [[a[0] - p[0] * w, a[1] - p[1] * w], [b[0] - p[0] * w, b[1] - p[1] * w], [b[0] + p[0] * w, b[1] + p[1] * w], [a[0] + p[0] * w, a[1] + p[1] * w]];
        const g = polyGeom(quad.map((q) => to3(F, q, off)), F.n); if (g) { put(g, mat); count++; }
      }
    }
    return count;
  }

  /** A thin frame along the edges of a face-coordinate polygon (inside the polygon). */
  function outline(F, ring2, { width = 0.2, off = 0.09, mat = 'frame' } = {}) {
    const ccw = area2(ring2) > 0;
    for (let i = 0; i < ring2.length; i++) {
      const a = ring2[i], b = ring2[(i + 1) % ring2.length];
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); if (l < 0.05) continue;
      // inward normal in face coordinates
      const nx = (ccw ? -dy : dy) / l, ny = (ccw ? dx : -dx) / l, w = width;
      const quad = [a, b, [b[0] + nx * w, b[1] + ny * w], [a[0] + nx * w, a[1] + ny * w]];
      const g = polyGeom(quad.map((q) => to3(F, q, off)), F.n); if (g) put(g, mat);
    }
  }

  /** Glazing: a glass polygon, its frame, and an optional mullion grid. `pts` are 3D points near the face plane. */
  function glaze(F, pts, { mat = 'glass', frame = 0.22, grid = null, gridStep = 2, gridAngle = 0.8, gridWidth = 0.09, off = 0.1, is2 = false } = {}) {
    const r2 = patch(F, pts, mat, off, is2);
    if (frame > 0 && near) outline(F, r2, { width: frame, off: off + 0.05 });
    if (grid && near) hatch(F, r2, { angle: gridAngle, step: gridStep, width: gridWidth, off: off + 0.05 });
    return r2;
  }

  /** Cladding seams over a whole face. */
  const seams = (F, o) => hatch(F, F.ring, { off: 0.05, mat: 'seam', ...o });

  /**
   * Slab: an extruded polygon whose top is a plane, walls leaning by a shear. Roof outline `ring` is
   * where the roof edge is seen from above; each wall foot sits at ring - shear * (roofHeight - y0),
   * so the walls are planar quads whatever the shear (an affine map of the roof plan).
   */
  function slab({ ring, y0 = 0, roof, shear = [0, 0], mats = {}, dress = true }) {
    const h = (p) => roof(p[0], p[1]);
    const foot = (p) => [p[0] - shear[0] * (h(p) - y0), y0, p[1] - shear[1] * (h(p) - y0)];
    const top = ring.map((p) => [p[0], h(p), p[1]]);
    const base = ring.map(foot);
    const ccw = area2(ring) > 0;
    const faces = { roof: null, walls: [], base: null };
    const roofPts = ccw ? top.slice().reverse() : top;
    // outward orientation: roof normal up
    faces.roof = face(roofPts, mats.roof || 'alu', [0, 1, 0]);
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length;
      const quad = [base[i], base[j], top[j], top[i]];
      // Outward normal: to the right of travel around a CCW ring in (u,v)
      const eu = ring[j][0] - ring[i][0], ev = ring[j][1] - ring[i][1];
      const out = ccw ? [ev, 0, -eu] : [-ev, 0, eu];
      const w = face(quad, mats.wall || 'alu', out);
      if (w) { w.edge = i; w.a = ring[i]; w.b = ring[j]; faces.walls.push(w); } else faces.walls.push(null);
    }
    if (y0 > 0.5) faces.base = face(base, mats.base || 'aluDark', [0, -1, 0]);
    faces.top = top; faces.foot = base;
    return faces;
  }

  /**
   * Glazing laid out in a face's own bounding box: a, b in [0,1] along the face's e1 / e2 axes.
   * Items: { band: [[a1,b1],[a2,b2]], w } (a strip w metres wide) or { quad: [[a,b],...] }; glass is clipped to the face.
   */
  function faceGlass(F, items, defaults = {}) {
    const xs = F.ring.map((q) => q[0]), ys = F.ring.map((q) => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const P = ([a, b]) => [x0 + a * (x1 - x0), y0 + b * (y1 - y0)];
    const clip = hull2(F.ring);
    for (const it of items) {
      let shape;
      if (it.band) {
        const A = P(it.band[0]), B = P(it.band[1]), dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * it.w / 2, ny = dx / l * it.w / 2;
        shape = [[A[0] - nx, A[1] - ny], [B[0] - nx, B[1] - ny], [B[0] + nx, B[1] + ny], [A[0] + nx, A[1] + ny]];
      } else shape = it.quad.map(P);
      const c = clipConvex(shape, clip); if (c.length < 3 || Math.abs(area2(c)) < 0.6) continue;
      const o = { ...defaults, ...it.o };
      if (o.grid === true) o.grid = near;
      glaze(F, c, { is2: true, ...o });
    }
  }

  return { face, ghost, patch, hatch, outline, glaze, seams, slab, faceGlass };
}

/** Roof-plane functions ------------------------------------------------------------------ */
export const flat = (h) => () => h;
/** OSM skillion: `dir` is the DOWN-slope direction (u,v unit), `top` the high end, `rh` the rise across the ring. */
export function skillion(ring, top, rh, dir) {
  const d = norm([dir[0], 0, dir[1]]);
  let lo = Infinity, hi = -Infinity;
  for (const [u, v] of ring) { const t = u * d[0] + v * d[2]; lo = Math.min(lo, t); hi = Math.max(hi, t); }
  return (u, v) => top - rh * ((u * d[0] + v * d[2]) - lo) / (hi - lo);
}
