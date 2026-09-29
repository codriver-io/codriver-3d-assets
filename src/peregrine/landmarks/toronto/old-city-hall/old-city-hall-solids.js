import * as THREE from 'three';

// Small solid-modelling kit for Old City Hall. Authoring frame (before the final
// rotation onto the mapped grid): x = u (along Queen St), y up, z = -v, so the
// Queen Street frontage looks toward +z. Wall-local frame: x = s along the wall
// (left to right seen from outside), y up, z = d outward from the wall plane.

/** Authoring point from building coordinates (u along Queen, y up, v into the building). */
export const P = (u, y, v) => [u, y, -v];

/**
 * Flat-shaded solid from polygon faces (any convex planar polygons). Each face is
 * fanned into triangles and wound so its normal points away from `inside`.
 */
export function solidFromFaces(faces, inside) {
  const out = [];
  for (const f of faces) {
    for (let i = 1; i < f.length - 1; i++) {
      let a = f[0], b = f[i], c = f[i + 1];
      const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
        (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
        (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
      const mid = [(a[0] + b[0] + c[0]) / 3 - inside[0], (a[1] + b[1] + c[1]) / 3 - inside[1], (a[2] + b[2] + c[2]) / 3 - inside[2]];
      if (n[0] * mid[0] + n[1] * mid[1] + n[2] * mid[2] < 0) [b, c] = [c, b];
      out.push(...a, ...b, ...c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
  g.computeVertexNormals(); // non-indexed: one flat normal per triangle
  return g;
}

/**
 * Hipped roof over a rectangle (building coordinates u0..u1, v0..v1), eave line at
 * `y - drop` after `over` metres of overhang, ridge/apex `rise` above `y`.
 * The ridge runs along the longer side; a square plan gives a pyramid.
 * `flat` > 0 truncates the ridge into a deck of that half-width (a mansard-like top).
 */
export function hipRoof(u0, u1, v0, v1, y, rise, { over = 0.5, drop = 0.3, flat = 0 } = {}) {
  const U0 = u0 - over, U1 = u1 + over, V0 = v0 - over, V1 = v1 + over, ye = y - drop, yt = y + rise;
  const w = U1 - U0, d = V1 - V0, m = Math.min(w, d) / 2 - flat, cu = (U0 + U1) / 2, cv = (V0 + V1) / 2;
  const E = [P(U0, ye, V0), P(U1, ye, V0), P(U1, ye, V1), P(U0, ye, V1)]; // eave corners
  let T;
  if (w >= d) T = [P(U0 + m, yt, cv - flat), P(U1 - m, yt, cv - flat), P(U1 - m, yt, cv + flat), P(U0 + m, yt, cv + flat)];
  else T = [P(cu - flat, yt, V0 + m), P(cu + flat, yt, V0 + m), P(cu + flat, yt, V1 - m), P(cu - flat, yt, V1 - m)];
  const faces = [[E[0], E[1], E[2], E[3]]];
  for (let i = 0; i < 4; i++) faces.push([E[i], E[(i + 1) % 4], T[(i + 1) % 4], T[i]]);
  if (flat > 0) faces.push([T[0], T[1], T[2], T[3]]);
  return solidFromFaces(faces, P(cu, (ye + yt) / 2 - (yt - ye) * 0.15, cv));
}

/**
 * Gable (pitched, ridge-only) roof block over u0..u1 x v0..v1 whose ridge runs along
 * `axis` ('u' or 'v'). Ends are vertical, so they can be buried in a neighbouring roof.
 */
export function gableRoof(axis, u0, u1, v0, v1, y, rise, { over = 0.5, drop = 0.3 } = {}) {
  const ye = y - drop, yt = y + rise, ridgeCornerDrop = 0;
  let A, B, C, D, R1, R2, R3, R4;
  if (axis === 'u') {
    const V0 = v0 - over, V1 = v1 + over, cv = (v0 + v1) / 2;
    A = P(u0, ye, V0); B = P(u1, ye, V0); C = P(u1, ye, V1); D = P(u0, ye, V1);
    R1 = P(u0, yt, cv); R2 = P(u1, yt, cv); R3 = R2; R4 = R1;
  } else {
    const U0 = u0 - over, U1 = u1 + over, cu = (u0 + u1) / 2;
    A = P(U0, ye, v0); B = P(U0, ye, v1); C = P(U1, ye, v1); D = P(U1, ye, v0);
    R1 = P(cu, yt, v0); R2 = P(cu, yt, v1); R3 = R2; R4 = R1;
  }
  void ridgeCornerDrop;
  // A-B is one eave edge, D-C the opposite; the ridge R1-R2 sits between them.
  const faces = [[A, B, C, D], [A, B, R2, R1], [D, C, R2, R1], [A, D, R1], [B, C, R2]];
  const inside = [(A[0] + C[0]) / 2, (ye + yt) / 2 - (yt - ye) * 0.2, (A[2] + C[2]) / 2];
  return solidFromFaces(faces, inside);
}

/** Gable roof in a wall-local frame: ridge along d (out from the wall), footprint s0..s1 x d0..d1. */
export function localGable(s0, s1, d0, d1, y, rise, { over = 0.4, drop = 0.25 } = {}) {
  const ye = y - drop, yt = y + rise, S0 = s0 - over, S1 = s1 + over, cs = (s0 + s1) / 2;
  const A = [S0, ye, d0], B = [S1, ye, d0], C = [S1, ye, d1], D = [S0, ye, d1], R1 = [cs, yt, d0], R2 = [cs, yt, d1];
  const faces = [[A, D, R2, R1], [B, C, R2, R1], [A, B, C, D], [A, B, R1], [D, C, R2]];
  return solidFromFaces(faces, [cs, (ye + yt) / 2 - (yt - ye) * 0.2, (d0 + d1) / 2]);
}

/** Pyramid on a square (wall-independent, authoring coordinates). */
export function pyramid(cu, cv, half, y0, y1, halfTop = 0) {
  const B = [P(cu - half, y0, cv - half), P(cu + half, y0, cv - half), P(cu + half, y0, cv + half), P(cu - half, y0, cv + half)];
  if (halfTop > 0) {
    const T = [P(cu - halfTop, y1, cv - halfTop), P(cu + halfTop, y1, cv - halfTop), P(cu + halfTop, y1, cv + halfTop), P(cu - halfTop, y1, cv + halfTop)];
    const faces = [[B[0], B[1], B[2], B[3]], [T[0], T[1], T[2], T[3]]];
    for (let i = 0; i < 4; i++) faces.push([B[i], B[(i + 1) % 4], T[(i + 1) % 4], T[i]]);
    return solidFromFaces(faces, P(cu, (y0 + y1) / 2, cv));
  }
  const a = P(cu, y1, cv), faces = [[B[0], B[1], B[2], B[3]]];
  for (let i = 0; i < 4; i++) faces.push([B[i], B[(i + 1) % 4], a]);
  return solidFromFaces(faces, P(cu, y0 + (y1 - y0) * 0.25, cv));
}

/** Extruded polygon (building coordinates u,v) between two heights; optional holes. */
export function prism(ring, y0, y1, holes = []) {
  const shape = new THREE.Shape(ring.map(([u, v]) => new THREE.Vector2(u, v)));
  for (const h of holes) shape.holes.push(new THREE.Path(h.map(([u, v]) => new THREE.Vector2(u, v))));
  const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, steps: 1 });
  g.rotateX(-Math.PI / 2); // shape (u, v) -> (u, up, -v)
  g.translate(0, y0, 0);
  return g;
}

/** Points of a round-headed opening in the wall plane: bottom width w, total height h. */
export function archPoints(cs, y0, w, h, n = 8) {
  const r = w / 2, spring = Math.max(y0, y0 + h - r), pts = [[cs - r, y0], [cs + r, y0]];
  if (h < r) return [[cs - r, y0], [cs + r, y0], [cs + r, y0 + h], [cs - r, y0 + h]];
  pts.push([cs + r, spring]);
  for (let i = 1; i < n; i++) { const a = (i * Math.PI) / n; pts.push([cs + r * Math.cos(a), spring + r * Math.sin(a)]); }
  pts.push([cs - r, spring]);
  return pts;
}

/** Wall-local flat opening panel (normal +d) at depth d. */
export function openingPanel(cs, y0, w, h, d, n = 6) {
  const g = new THREE.ShapeGeometry(new THREE.Shape(archPoints(cs, y0, w, h, n).map(([s, y]) => new THREE.Vector2(s, y))));
  g.translate(0, 0, d);
  return g;
}

/**
 * Wall-local archivolt: a U-shaped frame of width `rim` round the sides and head of an
 * opening, `depth` proud of the wall. One simple polygon (no hole touching its boundary).
 */
export function openingFrame(cs, y0, w, h, rim, depth, n = 8) {
  const out = archPoints(cs, y0, w + 2 * rim, h + rim, n), inn = archPoints(cs, y0, w, h, n);
  // archPoints: [bottom-left, bottom-right, right spring, arc right->left ..., left spring]
  const ring = (pts) => ({ bl: pts[0], br: pts[1], right: pts[2], left: pts[pts.length - 1], arc: pts.slice(3, -1) });
  const o = ring(out), i = ring(inn);
  const poly = [o.bl, o.left, ...o.arc.slice().reverse(), o.right, o.br, i.br, i.right, ...i.arc, i.left, i.bl];
  return new THREE.ExtrudeGeometry(new THREE.Shape(poly.map(([s, y]) => new THREE.Vector2(s, y))), { depth, bevelEnabled: false, steps: 1 });
}

/** Wall-local lean-to roof: low edge at d = dLow (height yLow), rising `rise` to d = dHigh. */
export function localShed(s0, s1, dLow, dHigh, yLow, rise, { over = 0.5, drop = 0.3 } = {}) {
  const S0 = s0 - over, S1 = s1 + over, dl = dLow + Math.sign(dLow - dHigh) * over, yl = yLow - drop, yh = yLow + rise;
  const A = [S0, yl, dl], B = [S1, yl, dl], C = [S1, yh, dHigh], D = [S0, yh, dHigh], E = [S0, yl, dHigh], F = [S1, yl, dHigh];
  const faces = [[A, B, C, D], [A, B, F, E], [E, F, C, D], [A, E, D], [B, F, C]];
  return solidFromFaces(faces, [(S0 + S1) / 2, (yl + yh) / 2 - (yh - yl) * 0.25, (dl + dHigh) / 2]);
}

/** Wall-local sloped bar (raking coping) from (sa, ya) to (sb, yb), thickness t, d from d0 to d1. */
export function rakeBar(sa, ya, sb, yb, t, d0, d1) {
  const len = Math.hypot(sb - sa, yb - ya), g = new THREE.BoxGeometry(len, t, d1 - d0);
  g.rotateZ(Math.atan2(yb - ya, sb - sa));
  g.translate((sa + sb) / 2, (ya + yb) / 2, (d0 + d1) / 2);
  return g;
}

/**
 * Matrix taking wall-local (s, y, d) to the authoring frame for a wall facing the
 * compass side `side` ('S' = toward Queen St, 'N', 'E', 'W' in building axes) whose
 * plane sits at coordinate `plane` (v for S/N, u for E/W). Local s runs left to right
 * seen from outside: S: s = u, N: s = -u, E: s = v, W: s = -v.
 */
export function wallMatrix(side, plane) {
  const m = new THREE.Matrix4();
  if (side === 'S') return m.makeTranslation(0, 0, -plane);
  if (side === 'N') return m.makeRotationY(Math.PI).premultiply(new THREE.Matrix4().makeTranslation(0, 0, -plane));
  if (side === 'E') return m.makeRotationY(Math.PI / 2).premultiply(new THREE.Matrix4().makeTranslation(plane, 0, 0));
  return m.makeRotationY(-Math.PI / 2).premultiply(new THREE.Matrix4().makeTranslation(plane, 0, 0)); // 'W'
}

/** Local s of building coordinate (u, v) on a wall of the given side. */
export const wallS = (side, u, v) => (side === 'S' ? u : side === 'N' ? -u : side === 'E' ? v : -v);
