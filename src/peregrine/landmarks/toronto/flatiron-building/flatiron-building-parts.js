// Geometry helpers for the Flatiron: profile sweeps along the plan outline, curved
// sector blocks for the round apex and turret, and wall-local placement. Every
// helper returns a BufferGeometry with position, normal and an index, ready for
// assetBuilder().put(). Winding is chosen per quad from the intended normal, so a
// face can never come out inside-out whatever the plan's orientation.
import * as THREE from 'three';

const up = new THREE.Vector3(0, 1, 0);

function orient(positions, normals, indices, a, b, c, d) {
  // Quad a,b,c,d (in order round the quad). Emit two triangles facing the average intended normal.
  const pa = new THREE.Vector3(...positions.slice(a * 3, a * 3 + 3)), pb = new THREE.Vector3(...positions.slice(b * 3, b * 3 + 3));
  const pc = new THREE.Vector3(...positions.slice(c * 3, c * 3 + 3));
  const geometric = pb.clone().sub(pa).cross(pc.clone().sub(pa));
  const intended = new THREE.Vector3();
  for (const i of [a, b, c, d]) intended.add(new THREE.Vector3(...normals.slice(i * 3, i * 3 + 3)));
  if (geometric.dot(intended) >= 0) indices.push(a, b, c, a, c, d); else indices.push(a, c, b, a, d, c);
}

function finishGeometry(positions, normals, indices) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setIndex(indices);
  return g;
}

/**
 * Sweep a 2D `profile` [[offset, y], ...] (offset outward from the outline, positive
 * outwards) along a plan polyline `points` [[x, z], ...]. Closed by default. Corners
 * are mitred; pass `sign` (+1/-1, the shoelace sign of the full outline) for an open run. A turn gentler than `smoothDeg` shares its normals (a round apex reads
 * round), a sharper one keeps each wall's own (a corner reads crisp).
 */
export function sweepBand(points, profile, { closed = true, smoothDeg = 30, sign = 0 } = {}) {
  const n = points.length, edges = closed ? n : n - 1;
  let area = 0;
  for (let i = 0; i < n; i++) { const p = points[i], q = points[(i + 1) % n]; area += p[0] * q[1] - q[0] * p[1]; }
  // An open run has no area of its own: `sign` (the sign of the whole outline's area) says which side is outside.
  const sgn = sign || (area >= 0 ? 1 : -1);
  const en = [];
  for (let i = 0; i < edges; i++) {
    const p = points[i], q = points[(i + 1) % n], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1;
    en.push([sgn * dz / l, -sgn * dx / l]);
  }
  const vertex = (i) => {
    const a = en[(i - 1 + edges) % edges], b = en[i % edges];
    const hasPrev = closed || i > 0, hasNext = closed || i < edges;
    const pa = hasPrev ? a : b, pb = hasNext ? b : a;
    let mx = pa[0] + pb[0], mz = pa[1] + pb[1]; const ml = Math.hypot(mx, mz);
    if (ml < 1e-6) { mx = pa[0]; mz = pa[1]; } else { mx /= ml; mz /= ml; }
    const cosHalf = Math.max(0.35, mx * pa[0] + mz * pa[1]);
    const turn = Math.acos(Math.max(-1, Math.min(1, pa[0] * pb[0] + pa[1] * pb[1]))) * 180 / Math.PI;
    return { m: [mx, mz], scale: 1 / cosHalf, smooth: turn < smoothDeg };
  };
  const vs = points.map((_, i) => vertex(i));
  const positions = [], normals = [], indices = [];
  const segs = profile.slice(1).map((q, k) => {
    const p = profile[k], dOff = q[0] - p[0], dY = q[1] - p[1], l = Math.hypot(dOff, dY);
    return l < 1e-9 ? null : { k, nOff: dY / l, nY: -dOff / l };
  });
  for (let e = 0; e < edges; e++) {
    const i = e, j = (e + 1) % n;
    for (const s of segs) {
      if (!s) continue;
      const base = positions.length / 3;
      for (const [vi, pi] of [[i, s.k], [j, s.k], [j, s.k + 1], [i, s.k + 1]]) {
        const v = vs[vi], [o, y] = profile[pi], P = points[vi];
        positions.push(P[0] + v.m[0] * o * v.scale, y, P[1] + v.m[1] * o * v.scale);
        const hn = v.smooth ? v.m : en[e];
        normals.push(hn[0] * s.nOff, s.nY, hn[1] * s.nOff);
      }
      orient(positions, normals, indices, base, base + 1, base + 2, base + 3);
    }
  }
  return finishGeometry(positions, normals, indices);
}

/**
 * A closed sector of a hollow cylinder, centre `c` [x, z], radii rIn..rOut, from
 * angle a0 to a1 (radians, standard atan2(z, x)), y0..y1. The curved faces carry
 * radial (smooth) normals; caps are flat. `inner: false` leaves out the inside face.
 */
export function arcBlock({ c, rIn, rOut, a0, a1, y0, y1, steps = 8, inner = true, caps = true, top = true, bottom = true }) {
  const positions = [], normals = [], indices = [];
  const quad = (pts, nrm) => {
    const base = positions.length / 3;
    pts.forEach((p, i) => { positions.push(...p); normals.push(...(nrm[i] || nrm[0])); });
    orient(positions, normals, indices, base, base + 1, base + 2, base + 3);
  };
  const at = (a, r, y) => [c[0] + Math.cos(a) * r, y, c[1] + Math.sin(a) * r];
  const rad = (a, s = 1) => [Math.cos(a) * s, 0, Math.sin(a) * s];
  const angle = (i) => a0 + (a1 - a0) * i / steps;
  for (let i = 0; i < steps; i++) {
    const p = angle(i), q = angle(i + 1);
    quad([at(p, rOut, y0), at(q, rOut, y0), at(q, rOut, y1), at(p, rOut, y1)], [rad(p), rad(q), rad(q), rad(p)]);
    if (inner && rIn > 0.001) quad([at(p, rIn, y0), at(q, rIn, y0), at(q, rIn, y1), at(p, rIn, y1)], [rad(p, -1), rad(q, -1), rad(q, -1), rad(p, -1)]);
    if (top) quad([at(p, rIn, y1), at(q, rIn, y1), at(q, rOut, y1), at(p, rOut, y1)], [[0, 1, 0]]);
    if (bottom) quad([at(p, rIn, y0), at(q, rIn, y0), at(q, rOut, y0), at(p, rOut, y0)], [[0, -1, 0]]);
  }
  if (caps) for (const [a, sign] of [[a0, -1], [a1, 1]]) {
    const tangent = [-Math.sin(a) * sign, 0, Math.cos(a) * sign];
    quad([at(a, rIn, y0), at(a, rOut, y0), at(a, rOut, y1), at(a, rIn, y1)], [tangent]);
  }
  return finishGeometry(positions, normals, indices);
}

/**
 * A skin on a cylinder (glass in a curved window): radius r, angles a0..a1, from
 * y0 (or `bottomAt(t)`) up to `topAt(t)` for t in 0..1 across the arc (an arched head on
 * a curved wall), or a flat y1. One-sided, radial normals.
 */
export function cylinderSkin({ c, r, a0, a1, y0, y1, topAt = null, bottomAt = null, steps = 8 }) {
  const positions = [], normals = [], indices = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, a = a0 + (a1 - a0) * t, top = topAt ? topAt(t) : y1, bottom = bottomAt ? bottomAt(t) : y0;
    const nx = Math.cos(a), nz = Math.sin(a);
    positions.push(c[0] + nx * r, bottom, c[1] + nz * r, c[0] + nx * r, top, c[1] + nz * r);
    normals.push(nx, 0, nz, nx, 0, nz);
  }
  for (let i = 0; i < steps; i++) {
    const b = i * 2;
    orient(positions, normals, indices, b, b + 2, b + 3, b + 1);
  }
  return finishGeometry(positions, normals, indices);
}

/** A flat, one-sided polygon at height y (triangle fan from the centroid; convex outlines only) facing up. */
export function capPolygon(points, y) {
  const positions = [], normals = [], indices = [];
  let cx = 0, cz = 0;
  for (const p of points) { cx += p[0]; cz += p[1]; }
  cx /= points.length; cz /= points.length;
  positions.push(cx, y, cz); normals.push(0, 1, 0);
  for (const p of points) { positions.push(p[0], y, p[1]); normals.push(0, 1, 0); }
  for (let i = 0; i < points.length; i++) {
    const a = 1 + i, b = 1 + (i + 1) % points.length, base = 0;
    const cr = (positions[a * 3] - cx) * (positions[b * 3 + 2] - cz) - (positions[a * 3 + 2] - cz) * (positions[b * 3] - cx);
    if (cr < 0) indices.push(base, a, b); else indices.push(base, b, a); // upward facing regardless of the polygon's direction
  }
  return finishGeometry(positions, normals, indices);
}

/**
 * Place a shape drawn in wall-local axes (X along the wall, Y up, +Z outward, Z = 0 on
 * the brick face) onto a wall frame from flatiron-building-site.js#wallFrame.
 */
export function onWall(geometry, frame, s = 0, out = 0) {
  const t = new THREE.Vector3(frame.t[0], 0, frame.t[1]), n = new THREE.Vector3(frame.n[0], 0, frame.n[1]);
  const m = new THREE.Matrix4().makeBasis(t, up, n);
  m.setPosition(frame.o[0] + frame.t[0] * s + frame.n[0] * out, 0, frame.o[1] + frame.t[1] * s + frame.n[1] * out);
  geometry.applyMatrix4(m);
  return geometry;
}

/** World point for wall-local (s, y, out). */
export const wallPoint = (frame, s, y, out = 0) => [frame.o[0] + frame.t[0] * s + frame.n[0] * out, y, frame.o[1] + frame.t[1] * s + frame.n[1] * out];

/** The wall's yaw for a THREE box whose local X runs along the wall. */
export const wallAngle = (frame) => Math.atan2(-frame.t[1], frame.t[0]);

/** Polygon outline of an arch-topped rectangle in wall-local (s, y): x0..x1, from y0, spring y, semicircular head. */
export function archOutline(x0, x1, y0, spring, segments = 10) {
  const cx = (x0 + x1) / 2, r = (x1 - x0) / 2, pts = [[x0, y0], [x1, y0], [x1, spring]];
  for (let i = 1; i < segments; i++) { const a = Math.PI * i / segments; pts.push([cx + Math.cos(a) * r, spring + Math.sin(a) * r]); }
  pts.push([x0, spring]);
  return pts;
}
