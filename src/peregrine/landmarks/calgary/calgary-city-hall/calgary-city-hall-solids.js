import * as THREE from 'three';

// Small solid-modelling kit for Calgary City Hall (original code, in the manner of the Toronto Old City Hall kit).
// Authoring frame: x = u (along the north front, east), y up, z = v (into the building, south). Walls are drawn in a
// wall-local frame: x = s along the wall (left to right seen from outside), y up, z = d outward from the wall plane.

/** Flat-shaded solid from convex planar polygons, each wound so its normal points away from `inside`. */
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
 * Hipped roof between an eave rectangle and a smaller top rectangle (`[u0, u1, v0, v1, y]`). The underside is left open:
 * it always sits inside a cornice or a wall. `cap` closes the top (a flat deck); a zero-size top gives a pyramid.
 */
export function hipFrustum(E, T, { cap = true } = {}) {
  const e = [[E[0], E[4], E[2]], [E[1], E[4], E[2]], [E[1], E[4], E[3]], [E[0], E[4], E[3]]];
  const t = [[T[0], T[4], T[2]], [T[1], T[4], T[2]], [T[1], T[4], T[3]], [T[0], T[4], T[3]]];
  const point = T[1] - T[0] < 1e-6 && T[3] - T[2] < 1e-6, faces = [];
  for (let i = 0; i < 4; i++) faces.push(point ? [e[i], e[(i + 1) % 4], t[0]] : [e[i], e[(i + 1) % 4], t[(i + 1) % 4], t[i]]);
  if (cap && !point) faces.push([t[0], t[1], t[2], t[3]]);
  return solidFromFaces(faces, [(E[0] + E[1]) / 2, E[4] - 1, (E[2] + E[3]) / 2]);
}

/** Extruded polygon (building coordinates u, v) between two heights; the bottom is dropped unless `bottom`. */
export function prismRing(ring, y0, y1, { bottom = false } = {}) {
  const shape = new THREE.Shape(ring.map(([u, v]) => new THREE.Vector2(u, v)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, steps: 1 });
  g.rotateX(Math.PI / 2); // shape (u, v, ext) -> (u, -ext, v)
  g.translate(0, y1, 0);
  return bottom ? g : dropFaces(g, (n) => n[1] < -0.5);
}

/** Axis-aligned rectangle ring in the clockwise order used by the outline (north edge west to east, v down). */
export const rectRing = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];

/** Offset a clockwise ring outward by `d` (every vertex moves along the bisector of two orthogonal edges). */
export function offsetRing(ring, d) {
  const n = ring.length, lines = [];
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n], dx = b[0] - a[0], dv = b[1] - a[1], len = Math.hypot(dx, dv);
    const nu = dv / len, nv = -dx / len; // outward normal of a clockwise ring
    lines.push({ nu, nv, c: nu * a[0] + nv * a[1] + d });
  }
  return ring.map((_, i) => {
    const p = lines[(i + n - 1) % n], q = lines[i], det = p.nu * q.nv - p.nv * q.nu;
    if (Math.abs(det) < 1e-9) return [ring[i][0] + q.nu * d, ring[i][1] + q.nv * d];
    return [(p.c * q.nv - q.c * p.nv) / det, (p.nu * q.c - q.nu * p.c) / det];
  });
}

/**
 * Wall frame for the edge A -> B of a clockwise ring: origin at B, s runs back toward A, d points outward.
 * Returns the matrix (wall-local -> building frame) and the edge length.
 */
export function edgeFrame(A, B) {
  const dx = B[0] - A[0], dv = B[1] - A[1], L = Math.hypot(dx, dv), nu = dv / L, nv = -dx / L;
  const M = new THREE.Matrix4().makeBasis(new THREE.Vector3(nv, 0, -nu), new THREE.Vector3(0, 1, 0), new THREE.Vector3(nu, 0, nv));
  M.setPosition(B[0], 0, B[1]);
  return { M, L, n: [nu, nv] };
}

/** Drop the triangles of a non-indexed geometry whose three vertex normals satisfy `drop(normal, vertexIndex)`. */
export function dropFaces(g, drop) {
  const src = g.index ? g.toNonIndexed() : g;
  const p = src.attributes.position, n = src.attributes.normal, P = [], N = [];
  for (let i = 0; i < p.count; i += 3) {
    if ([0, 1, 2].every((k) => drop([n.getX(i + k), n.getY(i + k), n.getZ(i + k)], i + k))) continue;
    for (let k = 0; k < 3; k++) { P.push(p.getX(i + k), p.getY(i + k), p.getZ(i + k)); N.push(n.getX(i + k), n.getY(i + k), n.getZ(i + k)); }
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
  if (src !== g) src.dispose();
  g.dispose();
  return out;
}
const dropBack = (g) => dropFaces(g, (n) => n[2] < -0.5);

/** Points of a round-headed opening in the wall plane: bottom width w, total height h (a plain rectangle if h < w / 2). */
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
 * Wall-local archivolt: a U-shaped frame of width `rim` round the sides and head of an opening, `depth` proud of the wall.
 * `flat` draws it as one front-facing sheet at d = depth (no returns): the cheap surround for walls nobody looks at closely.
 */
export function openingFrame(cs, y0, w, h, rim, depth, n = 8, { flat = false } = {}) {
  const out = archPoints(cs, y0, w + 2 * rim, h + rim, n), inn = archPoints(cs, y0, w, h, n);
  const ring = (pts) => ({ bl: pts[0], br: pts[1], right: pts[2], left: pts[pts.length - 1], arc: pts.slice(3, -1) });
  const o = ring(out), i = ring(inn);
  const poly = [o.bl, o.left, ...o.arc.slice().reverse(), o.right, o.br, i.br, i.right, ...i.arc, i.left, i.bl];
  return frameSolid(poly, depth, flat);
}

/** Wall-local U-shaped frame round a rectangular opening (jambs and lintel), `depth` proud, back dropped (or one flat sheet). */
export function rectFrame(cs, y0, w, h, rim, depth, { flat = false } = {}) {
  const a = cs - w / 2 - rim, b = cs + w / 2 + rim, c = cs - w / 2, e = cs + w / 2, top = y0 + h + rim;
  const poly = [[a, y0], [a, top], [b, top], [b, y0], [e, y0], [e, y0 + h], [c, y0 + h], [c, y0]];
  return frameSolid(poly, depth, flat);
}

function frameSolid(poly, depth, flat) {
  const shape = new THREE.Shape(poly.map(([s, y]) => new THREE.Vector2(s, y)));
  if (flat) return new THREE.ShapeGeometry(shape).translate(0, 0, depth);
  return dropBack(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, steps: 1 }));
}

/**
 * Wall-local box (x = s, y up, z = d out of the wall) with only the faces that can be seen:
 * f front (+d), u up, d down, l left (-s), r right (+s). The back, against the wall, is never drawn.
 */
export function wallBox(sa, sb, y0, y1, d0, d1, faces = 'fudlr') {
  const P = [], N = [], I = [];
  const quad = (a, b, c, d, n) => { const o = P.length / 3; P.push(...a, ...b, ...c, ...d); for (let i = 0; i < 4; i++) N.push(...n); I.push(o, o + 1, o + 2, o, o + 2, o + 3); };
  if (faces.includes('f')) quad([sa, y0, d1], [sb, y0, d1], [sb, y1, d1], [sa, y1, d1], [0, 0, 1]);
  if (faces.includes('u')) quad([sa, y1, d1], [sb, y1, d1], [sb, y1, d0], [sa, y1, d0], [0, 1, 0]);
  if (faces.includes('d')) quad([sa, y0, d0], [sb, y0, d0], [sb, y0, d1], [sa, y0, d1], [0, -1, 0]);
  if (faces.includes('l')) quad([sa, y0, d0], [sa, y0, d1], [sa, y1, d1], [sa, y1, d0], [-1, 0, 0]);
  if (faces.includes('r')) quad([sb, y0, d1], [sb, y0, d0], [sb, y1, d0], [sb, y1, d1], [1, 0, 0]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
  g.setIndex(I);
  return g;
}

/** Wall-local gable wall: the triangle (s0 +- hw, y0, apex y0 + rise) extruded from d = -thick to d = 0, back dropped. */
export function gableWall(sc, hw, y0, rise, thick) {
  const g = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(sc - hw, y0), new THREE.Vector2(sc + hw, y0), new THREE.Vector2(sc, y0 + rise)]), { depth: thick, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -thick);
  return dropBack(g);
}

/** Wall-local tile slopes of a gable roof: ridge from d = d0 back to d = d1 (< d0), open underneath and at both ends. */
export function gableSlopes(sc, hw, y0, rise, d0, d1) {
  const A = [sc - hw, y0, d0], B = [sc + hw, y0, d0], R0 = [sc, y0 + rise, d0], R1 = [sc, y0 + rise, d1], A1 = [sc - hw, y0, d1], B1 = [sc + hw, y0, d1];
  const inside = [sc, y0 + rise * 0.3, (d0 + d1) / 2];
  return solidFromFaces([[A, R0, R1, A1], [B, R0, R1, B1]], inside);
}

/** Vertical cylinder at building (u, v) between y0 and y1; `rTop` differs from `r` for a cone. */
export function column(u, v, y0, y1, r, rTop = r, seg = 8, { capBottom = false } = {}) {
  const g = new THREE.CylinderGeometry(rTop, r, y1 - y0, seg, 1, false);
  g.translate(u, (y0 + y1) / 2, v);
  return capBottom ? g : dropFaces(g, (n) => n[1] < -0.9);
}
