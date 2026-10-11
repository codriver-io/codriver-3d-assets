// Coit Tower: surface builders on top of assetBuilder.put. Nothing here knows a dimension;
// coit-tower-parts.js owns every number. Conventions: a point at compass bearing b (degrees,
// clockwise from north), radius r and height y is (r sin b, y, -r cos b): +X east, +Y up, +Z south.
import * as THREE from 'three';

const RAD = Math.PI / 180;
export const at = (bearing, r, y) => [r * Math.sin(bearing * RAD), y, -r * Math.cos(bearing * RAD)];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const same = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 1e-6;

/**
 * An indexed triangle soup that orients every face by an explicit hint vector, so no winding has to
 * be reasoned about: each quad/triangle is flipped until its front side looks along `hint`. Faces get
 * one flat normal unless per-vertex normals are passed (smooth cylinders). `commit` hands the result
 * to the assetBuilder as one geometry (one draw per material).
 */
export function soup() {
  const pos = [], nor = [], idx = [];
  const vertex = (p, n) => { pos.push(p[0], p[1], p[2]); nor.push(n[0], n[1], n[2]); return pos.length / 3 - 1; };
  function poly(points, hint, normals) {
    // drop repeated corners (a quad that collapses to a triangle)
    const keep = [];
    points.forEach((p, i) => { const prev = keep[keep.length - 1]; if (!prev || !same(prev.p, p)) keep.push({ p, n: normals?.[i] }); });
    if (keep.length > 1 && same(keep[0].p, keep[keep.length - 1].p)) keep.pop();
    if (keep.length < 3) return;
    let normal = [0, 0, 0];
    for (let i = 1; i < keep.length - 1; i++) {
      const c = cross(sub(keep[i].p, keep[0].p), sub(keep[i + 1].p, keep[0].p));
      if (len(c) > len(normal)) normal = c;
    }
    if (len(normal) < 1e-7) return;
    let order = keep;
    if (dot(normal, hint) < 0) { order = keep.slice().reverse(); normal = normal.map((v) => -v); }
    const flat = unit(normal);
    const ids = order.map((v) => vertex(v.p, v.n ? unit(v.n) : flat));
    for (let i = 1; i < ids.length - 1; i++) idx.push(ids[0], ids[i], ids[i + 1]);
  }
  return {
    quad: (p0, p1, p2, p3, hint, normals) => poly([p0, p1, p2, p3], hint, normals),
    tri: (p0, p1, p2, hint, normals) => poly([p0, p1, p2], hint, normals),
    poly,
    get triangles() { return idx.length / 3; },
    commit(b, material) {
      if (!idx.length) return;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setIndex(idx);
      b.put(g, material, 0, 0);
    },
  };
}

/** The three-dimensional point of bay-local coordinates: `u` along the wall, `a` outward, `y` up. */
export function bayFrame(bearing) {
  const e = [Math.sin(bearing * RAD), -Math.cos(bearing * RAD)], l = [Math.cos(bearing * RAD), Math.sin(bearing * RAD)];
  return { e, l, point: (u, a, y) => [a * e[0] + u * l[0], y, a * e[1] + u * l[1]], radial: (u, a) => [a * e[0] + u * l[0], 0, a * e[1] + u * l[1]] };
}

const lerp = (a, b, t) => a + (b - a) * t;

/** An opening in a cylindrical wall, in bay-local lateral coordinates: sill `lo`, head `hi[i]` at each sample `u[i]`. */
export function opening(u, lo, hi) { return { u, lo, hi }; }
export function archOpening(halfWidth, lo, spring, samples) {
  const u = [], hi = [];
  for (let i = 0; i <= samples; i++) {
    const x = -halfWidth + (2 * halfWidth * i) / samples;
    u.push(x); hi.push(spring + Math.sqrt(Math.max(0, halfWidth * halfWidth - x * x)));
  }
  // the first and last samples sit on the jambs at the spring line
  return { u, lo, hi };
}
export const rectOpening = (halfWidth, lo, hi) => ({ u: [-halfWidth, halfWidth], lo, hi: [hi, hi] });
const headAt = (o, x) => {
  for (let i = 0; i < o.u.length - 1; i++) if (x <= o.u[i + 1] + 1e-9) return lerp(o.hi[i], o.hi[i + 1], (x - o.u[i]) / ((o.u[i + 1] - o.u[i]) || 1));
  return o.hi[o.hi.length - 1];
};

/**
 * A cylindrical wall of radius R between heights y0 and y1, split into `bays` equal bays whose
 * centres are at bearing bearing0 + k*360/bays. `openings` are cut through every bay (or only
 * `onlyBays`). The wall is a polygon of columns (flat quads with smooth radial normals); the
 * breaks follow the openings' own samples, so every opening edge is exact and nothing cracks.
 * `inward` flips the wall to face the axis (the inner wall of a hollow ring).
 */
export function ringWall(s, { R, y0, y1, bays, bearing0, openings = [], onlyBays = null, plain = 2, inward = false }) {
  const half = (180 / bays) * RAD;
  const U = R * Math.sin(half);
  for (let k = 0; k < bays; k++) {
    const frame = bayFrame(bearing0 + (360 / bays) * k);
    const mine = !onlyBays || onlyBays.includes(k) ? openings : [];
    const breaks = new Set([-U, U, 0]);
    for (const o of mine) for (const x of o.u) breaks.add(Math.round(x * 1e6) / 1e6);
    // plain pier subdivisions so the wall stays round
    const outer = Math.max(0, ...mine.map((o) => o.u[o.u.length - 1]));
    for (let i = 1; i < plain; i++) {
      breaks.add(lerp(outer, U, i / plain)); breaks.add(-lerp(outer, U, i / plain));
    }
    const us = [...breaks].filter((x) => Math.abs(x) <= U + 1e-9).sort((p, q) => p - q);
    const a = (x) => Math.sqrt(Math.max(0, R * R - x * x));
    for (let j = 0; j < us.length - 1; j++) {
      const ua = us[j], ub = us[j + 1], mid = (ua + ub) / 2;
      const active = mine.filter((o) => o.u[0] <= mid && mid <= o.u[o.u.length - 1]).sort((p, q) => p.lo - q.lo);
      let curA = y0, curB = y0;
      const emit = (bottomA, bottomB, topA, topB) => {
        if (topA - bottomA < 1e-6 && topB - bottomB < 1e-6) return;
        const pa = frame.point(ua, a(ua), bottomA), pb = frame.point(ub, a(ub), bottomB);
        const qb = frame.point(ub, a(ub), topB), qa = frame.point(ua, a(ua), topA);
        const na = frame.radial(ua, a(ua)), nb = frame.radial(ub, a(ub));
        const sgn = inward ? -1 : 1, hint = [sgn * (na[0] + nb[0]), 0, sgn * (na[2] + nb[2])];
        s.quad(pa, pb, qb, qa, hint, [na, nb, nb, na].map((n) => n.map((v) => v * sgn)));
      };
      for (const o of active) {
        emit(curA, curB, o.lo, o.lo);
        curA = headAt(o, ua); curB = headAt(o, ub);
      }
      emit(curA, curB, y1, y1);
    }
  }
}

/**
 * The reveal (jambs, sill and head) of an opening, from the wall of radius `Ro` to a parallel
 * wall of radius `Ri`, every face oriented toward the empty cavity; plus, when `back` is true,
 * the back wall at radius Ri that closes it (smooth radial normals, facing out).
 */
export function reveal(s, { bearing, o, Ro, Ri, back = false, tube = true }) {
  const frame = bayFrame(bearing), n = o.u.length;
  const a = (R, x) => Math.sqrt(Math.max(0, R * R - x * x));
  const rim = [[o.u[0], o.lo]];
  for (let i = 0; i < n; i++) rim.push([o.u[i], o.hi[i]]);
  rim.push([o.u[n - 1], o.lo]);
  const peak = Math.max(...o.hi);
  const centre = frame.point(0, (a(Ro, 0) + a(Ri, 0)) / 2, (o.lo + peak) / 2);
  for (let i = 0; tube && i < rim.length; i++) {
    const [ua, ya] = rim[i], [ub, yb] = rim[(i + 1) % rim.length];
    const p0 = frame.point(ua, a(Ro, ua), ya), p1 = frame.point(ub, a(Ro, ub), yb);
    const p2 = frame.point(ub, a(Ri, ub), yb), p3 = frame.point(ua, a(Ri, ua), ya);
    const mid = [(p0[0] + p1[0] + p2[0] + p3[0]) / 4, (p0[1] + p1[1] + p2[1] + p3[1]) / 4, (p0[2] + p1[2] + p2[2] + p3[2]) / 4];
    s.quad(p0, p1, p2, p3, sub(centre, mid));
  }
  if (back) {
    for (let i = 0; i < n - 1; i++) {
      const pa = frame.point(o.u[i], a(Ri, o.u[i]), o.lo), pb = frame.point(o.u[i + 1], a(Ri, o.u[i + 1]), o.lo);
      const qb = frame.point(o.u[i + 1], a(Ri, o.u[i + 1]), o.hi[i + 1]), qa = frame.point(o.u[i], a(Ri, o.u[i]), o.hi[i]);
      const na = frame.radial(o.u[i], a(Ri, o.u[i])), nb = frame.radial(o.u[i + 1], a(Ri, o.u[i + 1]));
      s.quad(pa, pb, qb, qa, [na[0] + nb[0], 0, na[2] + nb[2]], [na, nb, nb, na]);
    }
  }
}

/**
 * A surface of revolution about the vertical axis through the origin. `profile` is [radius, height]
 * rows; every segment is a band whose normal is oriented by `side` (+1: away from the axis/up,
 * given by the segment's own slope, -1 the other way). Faces are smooth around the axis and
 * hard-edged between rows (each row pair is its own run), unless `smooth` joins them.
 */
export function lathe(s, profile, segments, { phase = 0, side = 1, smoothRows = false } = {}) {
  for (let i = 0; i < profile.length - 1; i++) {
    const [r0, h0] = profile[i], [r1, h1] = profile[i + 1];
    // normal in the (r, h) half-plane: perpendicular to the segment, pointing away from the axis side
    const nr = (h1 - h0), nh = -(r1 - r0), nl = Math.hypot(nr, nh) || 1;
    for (let j = 0; j < segments; j++) {
      const t0 = phase + (360 * j) / segments, t1 = phase + (360 * (j + 1)) / segments;
      const p0 = at(t0, r0, h0), p1 = at(t1, r0, h0), p2 = at(t1, r1, h1), p3 = at(t0, r1, h1);
      const n0 = [Math.sin(t0 * RAD) * nr / nl, nh / nl, -Math.cos(t0 * RAD) * nr / nl];
      const n1 = [Math.sin(t1 * RAD) * nr / nl, nh / nl, -Math.cos(t1 * RAD) * nr / nl];
      const sg = side;
      const hint = [(n0[0] + n1[0]) * sg, (n0[1] + n1[1]) * sg, (n0[2] + n1[2]) * sg];
      s.quad(p0, p1, p2, p3, hint, [n0, n1, n1, n0].map((n) => n.map((v) => v * sg)));
    }
  }
}

/** A flat disc (a fan) at height y, facing up (+1) or down (-1). */
export function disc(s, r, y, segments, facing = 1, phase = 0) {
  for (let j = 0; j < segments; j++) {
    const t0 = phase + (360 * j) / segments, t1 = phase + (360 * (j + 1)) / segments;
    s.tri([0, y, 0], at(t0, r, y), at(t1, r, y), [0, facing, 0]);
  }
}
