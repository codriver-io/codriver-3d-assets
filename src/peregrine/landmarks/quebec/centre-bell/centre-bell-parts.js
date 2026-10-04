import * as THREE from 'three';

// Centre Bell: frame, plan and drawing helpers. The arena is authored on its own grid, then rotated into
// the exported frame (+X east, +Y up, +Z south) when each vertex is written, so the rotation is baked.
//   u runs along the long edge, toward the south-east (bearing 131.3 degrees, Rue Saint-Antoine end);
//   v runs across it, toward the north-east (bearing 41.3 degrees, Place des Canadiens side).
// Both are read from the mapped outline (OSM way 19911284: long edges at 40.9 and 131.8 degrees).
export const ROT = 41.3; // bearing of +v, clockwise from true north
const th = ROT * Math.PI / 180;
export const U_AXIS = [Math.sin(th + Math.PI / 2), -Math.cos(th + Math.PI / 2)]; // [x, z] of +u
export const V_AXIS = [Math.sin(th), -Math.cos(th)];                              // [x, z] of +v
export const world = (u, y, v) => [u * U_AXIS[0] + v * V_AXIS[0], y, u * U_AXIS[1] + v * V_AXIS[1]];
export const uvOf = (x, z) => [x * U_AXIS[0] + z * U_AXIS[1], x * V_AXIS[0] + z * V_AXIS[1]];

// ---- plan (all in metres on the u/v grid, inside the mapped outline) -----------------------------------
export const PLAN = {
  U0: -72.4, U1: 69.8,          // north-west end, south-east end
  V0: -51.4, V1: 48.7,          // south-west face, north-east face
  NOTCH_U: -44.8, NOTCH_V: -45.2, // the 6 m set-back of the south-west end
  FRONT: { u0: -44.4, u1: 41.5, v: 52.1 }, // the glazed entrance front (3.4 m proud of the north-east face)
  // the sign tower, 20 m in from the north corner so it stands proud of the glazed street frontage, with the pale glazed bay on its
  // north-west side and the glazed entrance front on its south-east side (its tan base projects 3.4 m in line with the front)
  TOWER: { u0: -52.4, u1: -37.4, v0: 33, v1: 48.7 },
  ARCADE: { u0: -12, u1: 64, depth: 2.4 },            // recessed glazed base on the south-west face
  SETBACK: 1.0,                                         // the dark band stands this far inside the brick walls
};
// Heights (all estimated; nothing is published).
export const H = { BASE: 5.5, BRICK: 21, LOW: 28, BAND: 37.6, ROOF: 38.4, TOWER: 47 };

export const UP_RING = (() => {
  const { U0, U1, V0, V1, NOTCH_U, NOTCH_V, SETBACK: s } = PLAN;
  return [[U0 + s, V1 - s], [U1 - s, V1 - s], [U1 - s, V0 + s], [NOTCH_U + s, V0 + s], [NOTCH_U + s, NOTCH_V + s], [U0 + s, NOTCH_V + s]];
})();
export const BODY_RING = (() => {
  const { U0, U1, V0, V1, NOTCH_U, NOTCH_V, FRONT: f } = PLAN;
  return [[U0, V1], [f.u0, V1], [f.u0, f.v], [f.u1, f.v], [f.u1, V1], [U1, V1], [U1, V0], [NOTCH_U, V0], [NOTCH_U, NOTCH_V], [U0, NOTCH_V]];
})();

// ---- surface accumulator ---------------------------------------------------------------------------------
// Everything is flat quads and polygons with their outward side given, so winding can never be wrong.
export function surfaces(fold = {}) {
  const sets = new Map();
  const set = (m) => { m = fold[m] ?? m; if (!sets.has(m)) sets.set(m, { pos: [], idx: [] }); return sets.get(m); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function tri(m, A, B, C, hint) {
    const s = set(m), n = cross(sub(B, A), sub(C, A));
    if (Math.hypot(...n) < 1e-9) return;
    const flip = dot(n, hint) < 0, k = s.pos.length / 3;
    s.pos.push(...A, ...B, ...C);
    s.idx.push(...(flip ? [k, k + 2, k + 1] : [k, k + 1, k + 2]));
  }
  // A planar quad from four [u, y, v] corners; `hint` is the outward direction as [du, dy, dv].
  function quad(m, a, b, c, d, hint) {
    const A = world(...a), B = world(...b), C = world(...c), D = world(...d), h = world(...hint);
    tri(m, A, B, C, h); tri(m, A, C, D, h);
  }
  // A vertical wall along (u0,v0) -> (u1,v1) from y0 to y1, facing [nu, nv].
  const wall = (m, p0, p1, y0, y1, nrm) => quad(m, [p0[0], y0, p0[1]], [p1[0], y0, p1[1]], [p1[0], y1, p1[1]], [p0[0], y1, p0[1]], [nrm[0], 0, nrm[1]]);
  // A horizontal polygon (with optional holes) of [u, v] points at height y, facing up or down.
  function cap(m, outer, holes, y, up = true) {
    const v2 = (p) => new THREE.Vector2(p[0], p[1]);
    const all = [...outer, ...holes.flat()];
    const tris = THREE.ShapeUtils.triangulateShape(outer.map(v2), holes.map((h) => h.map(v2)));
    for (const [i, j, k] of tris) tri(m, world(all[i][0], y, all[i][1]), world(all[j][0], y, all[j][1]), world(all[k][0], y, all[k][1]), [0, up ? 1 : -1, 0]);
  }
  // A box on the u/v grid. `omit` lists faces to leave out: 'top', 'bot', '+u', '-u', '+v', '-v'.
  function box(m, u0, u1, v0, v1, y0, y1, omit = ['bot']) {
    const has = (f) => !omit.includes(f);
    if (has('top')) quad(m, [u0, y1, v0], [u1, y1, v0], [u1, y1, v1], [u0, y1, v1], [0, 1, 0]);
    if (has('bot')) quad(m, [u0, y0, v0], [u1, y0, v0], [u1, y0, v1], [u0, y0, v1], [0, -1, 0]);
    if (has('+u')) quad(m, [u1, y0, v0], [u1, y0, v1], [u1, y1, v1], [u1, y1, v0], [1, 0, 0]);
    if (has('-u')) quad(m, [u0, y0, v0], [u0, y0, v1], [u0, y1, v1], [u0, y1, v0], [-1, 0, 0]);
    if (has('+v')) quad(m, [u0, y0, v1], [u1, y0, v1], [u1, y1, v1], [u0, y1, v1], [0, 0, 1]);
    if (has('-v')) quad(m, [u0, y0, v0], [u1, y0, v0], [u1, y1, v0], [u0, y1, v0], [0, 0, -1]);
  }
  // A relief (window, frame, letter) standing `depth` proud of a wall: plane { axis, at, out }.
  function onWall(m, plane, a0, a1, y0, y1, depth = 0.15, extraOmit = []) {
    const { axis, at, out } = plane;
    const lo = out > 0 ? at : at - depth, hi = out > 0 ? at + depth : at;
    const back = axis === 'v' ? (out > 0 ? '-v' : '+v') : (out > 0 ? '-u' : '+u');
    const omit = [back, ...extraOmit];
    if (axis === 'v') box(m, a0, a1, lo, hi, y0, y1, omit); else box(m, lo, hi, a0, a1, y0, y1, omit);
  }
  function flush(b) {
    for (const [m, s] of sets) {
      if (!s.idx.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(s.pos, 3));
      g.setIndex(s.idx); g.computeVertexNormals();
      b.put(g, m, 0, 0);
    }
  }
  return { quad, wall, cap, box, onWall, flush };
}

// ---- "Centre" / "Bell" block letters ------------------------------------------------------------------------
// Original rectangle glyphs; cap height 1, x-height XH, stroke T. Each glyph is {w, r: [[x0, y0, x1, y1], ...]}.
const T = 0.19, XH = 0.7, GAP = 0.14;
const R = (x0, y0, x1, y1) => [x0, y0, x1, y1];
const GLYPHS = {
  C: { w: 0.72, r: [R(0, 0, T, 1), R(T, 1 - T, 0.72, 1), R(T, 0, 0.72, T)] },
  B: { w: 0.72, r: [R(0, 0, T, 1), R(T, 0.81, 0.72, 1), R(T, 0.405, 0.72, 0.595), R(T, 0, 0.72, T), R(0.53, 0.595, 0.72, 0.81), R(0.53, T, 0.72, 0.405)] },
  e: { w: 0.62, r: [R(0, 0, T, XH), R(T, XH - T, 0.62, XH), R(T, 0.26, 0.62, 0.42), R(T, 0, 0.62, T), R(0.43, 0.42, 0.62, XH - T)] },
  n: { w: 0.62, r: [R(0, 0, T, XH), R(0.62 - T, 0, 0.62, XH), R(T, XH - T, 0.62 - T, XH)] },
  t: { w: 0.46, r: [R(0.1, 0, 0.1 + T, 0.96), R(0, XH - T, 0.1, XH), R(0.1 + T, XH - T, 0.46, XH)] },
  r: { w: 0.5, r: [R(0, 0, T, XH), R(T, XH - T, 0.5, XH)] },
  l: { w: 0.2, r: [R(0, 0, 0.2, 1)] },
};
// Rectangles of a word along s (reading direction) and y (up), in metres, for a cap height `cap`.
export function wordRects(text, cap) {
  const out = []; let s = 0;
  for (const ch of text) {
    const g = GLYPHS[ch];
    for (const [x0, y0, x1, y1] of g.r) out.push({ s0: (s + x0) * cap, s1: (s + x1) * cap, y0: y0 * cap, y1: y1 * cap });
    s += g.w + GAP;
  }
  return { rects: out, length: (s - GAP) * cap };
}
