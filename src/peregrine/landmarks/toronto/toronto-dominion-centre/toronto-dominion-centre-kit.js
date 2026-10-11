// Small authoring kit for the Toronto-Dominion Centre: faces, flat panels and
// prisms on top of assetBuilder, so the tower and pavilion code reads as
// architecture (a mullion every 1.524 m, a spandrel per floor) not as matrices.
// Authoring only: imported by the geometry, exporter and inspector, never the map.
import * as THREE from 'three';

/** World XZ -> world for a rectangle's local (u along L, v along W) coordinates. */
export function rectFrame(r) {
  const c = Math.cos(r.a), s = Math.sin(r.a);
  return { c, s, at: (u, v) => [r.cx + u * c - v * s, r.cz + u * s + v * c] };
}

/**
 * The four faces of a rectangle. For a face, `n` is the outward normal (X,Z),
 * `t = (nz, -nx)` runs to the viewer's RIGHT when looking at it from outside
 * (so a panel wound bottom-left, bottom-right, top-right, top-left faces out),
 * `len` its width and `c` its centre at q = 0. `kind` says which axis it closes.
 */
export function rectFaces(r) {
  const c = Math.cos(r.a), s = Math.sin(r.a), u = [c, s], v = [-s, c];
  const make = (n, half, len, kind) => ({ n, t: [n[1], -n[0]], len, c: [r.cx + n[0] * half, r.cz + n[1] * half], kind });
  return [
    make(v, r.W / 2, r.L, 'long'), make([-v[0], -v[1]], r.W / 2, r.L, 'long'),
    make(u, r.L / 2, r.W, 'short'), make([-u[0], -u[1]], r.L / 2, r.W, 'short'),
  ];
}
/** World XZ of a point s along a face (0..len, viewer's right) and q out from it. */
export const facePoint = (f, s, q = 0) => [
  f.c[0] - f.t[0] * f.len / 2 + f.t[0] * s + f.n[0] * q,
  f.c[1] - f.t[1] * f.len / 2 + f.t[1] * s + f.n[1] * q,
];
/** The face whose outward normal points most along `dir` ([x, z]). */
export const faceToward = (faces, dir) => faces.reduce((best, f) => (f.n[0] * dir[0] + f.n[1] * dir[1] > best.n[0] * dir[0] + best.n[1] * dir[1] ? f : best));

export function kit(b) {
  /** Flat quad p0..p3 (each [x, y, z]) wound counter-clockwise seen from the side it faces. */
  function quad(material, p0, p1, p2, p3) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([p0, p1, p2, p3].flat(), 3));
    g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals(); b.put(g, material);
  }
  /** A vertical panel on a face: s0..s1 along it, y0..y1 up, q out from the face plane. */
  function panel(material, f, s0, s1, y0, y1, q = 0) {
    const [ax, az] = facePoint(f, s0, q), [bx, bz] = facePoint(f, s1, q);
    quad(material, [ax, y0, az], [bx, y0, bz], [bx, y1, bz], [ax, y1, az]);
  }
  /** A box aligned to a face: s0..s1 along it, y0..y1 up, q0..q1 out from the face plane. */
  function faceBox(material, f, s0, s1, y0, y1, q0, q1) {
    const [x, z] = facePoint(f, (s0 + s1) / 2, (q0 + q1) / 2);
    b.box(material, [x, (y0 + y1) / 2, z], [s1 - s0, y1 - y0, q1 - q0], Math.atan2(-f.t[1], f.t[0]));
  }
  /**
   * The visible faces of a face-aligned box, nothing else (a box is 12 triangles; a mullion or a spandrel seen from
   * outside needs two to six). `faces` is any of: f front (q1, outward), b back (q0), l left (s0), r right (s1),
   * u up, d down. Winding follows each face's outward direction, whichever way the quad is listed.
   */
  function slab(material, f, s0, s1, y0, y1, q0, q1, faces = 'flrud') {
    const P = (s, y, q) => { const [x, z] = facePoint(f, s, q); return [x, y, z]; };
    const side = (pts, hint) => {
      const [a, b, c] = pts, u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const nrm = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      quad(material, ...(nrm[0] * hint[0] + nrm[1] * hint[1] + nrm[2] * hint[2] < 0 ? [pts[0], pts[3], pts[2], pts[1]] : pts));
    };
    const n = [f.n[0], 0, f.n[1]], t = [f.t[0], 0, f.t[1]];
    if (faces.includes('f')) side([P(s0, y0, q1), P(s1, y0, q1), P(s1, y1, q1), P(s0, y1, q1)], n);
    if (faces.includes('b')) side([P(s0, y0, q0), P(s1, y0, q0), P(s1, y1, q0), P(s0, y1, q0)], [-n[0], 0, -n[2]]);
    if (faces.includes('l')) side([P(s0, y0, q0), P(s0, y0, q1), P(s0, y1, q1), P(s0, y1, q0)], [-t[0], 0, -t[2]]);
    if (faces.includes('r')) side([P(s1, y0, q0), P(s1, y0, q1), P(s1, y1, q1), P(s1, y1, q0)], t);
    if (faces.includes('u')) side([P(s0, y1, q0), P(s1, y1, q0), P(s1, y1, q1), P(s0, y1, q1)], [0, 1, 0]);
    if (faces.includes('d')) side([P(s0, y0, q0), P(s1, y0, q0), P(s1, y0, q1), P(s0, y0, q1)], [0, -1, 0]);
  }
  /** A box aligned to a rectangle: centre (u, y, v) in its local frame, sizes along u, up, along v. */
  function rectBox(material, r, u, y, v, w, h, d) {
    const [x, z] = rectFrame(r).at(u, v);
    b.box(material, [x, y, z], [w, h, d], -r.a);
  }
  /** Extruded prism over a polygon of world [x, z] points from y0 up to y1. */
  function prism(material, points, y0, y1) {
    const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); b.put(g, material);
  }
  return { quad, panel, faceBox, slab, rectBox, prism };
}

/** Deterministic 0..1 hash of four integers (lit-window selection). */
export function hash4(a, b, c, d) {
  let h = Math.imul(a + 0x9e3779b1, 374761393) ^ Math.imul(b + 0x85ebca6b, 668265263) ^ Math.imul(c + 0xc2b2ae35, 1274126177) ^ Math.imul(d + 0x27d4eb2f, 2246822519);
  h = Math.imul(h ^ (h >>> 15), 2246822519); h = Math.imul(h ^ (h >>> 13), 3266489917);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
