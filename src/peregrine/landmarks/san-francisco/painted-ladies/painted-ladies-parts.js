// Geometry kit for the Painted Ladies. Everything is built in a house's local frame
// (x across the front, to the right of someone facing it; y up; z outward, toward the street)
// and moved into model metres by the house matrix before it is handed to assetBuilder.
import * as THREE from 'three';

const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

/**
 * Extrude a 2-D polygon (concave allowed) drawn in the plane spanned by A and B along
 * C = A x B, from c0 to c1. Returns a flat-shaded, non-indexed BufferGeometry with outward
 * normals whatever the polygon's winding was.
 */
export function extrude(poly, A, B, c0, c1, caps = true) {
  const a = v3(A), b = v3(B), c = new THREE.Vector3().crossVectors(a, b).normalize();
  let pts = poly.map(([u, v]) => new THREE.Vector2(u, v));
  pts = pts.filter((p, i) => p.distanceTo(pts[(i + 1) % pts.length]) > 1e-6);
  if (THREE.ShapeUtils.area(pts) < 0) pts.reverse(); // counter-clockwise in (a, b)
  const P = (p, t) => a.clone().multiplyScalar(p.x).addScaledVector(b, p.y).addScaledVector(c, t);
  const pos = [];
  const tri = (p, q, r) => pos.push(p.x, p.y, p.z, q.x, q.y, q.z, r.x, r.y, r.z);
  if (caps) {
    for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(pts, [])) {
      let [p, q, r] = [pts[i], pts[j], pts[k]];
      const turn = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
      if (Math.abs(turn) < 1e-9) continue; // collinear corners: no area, no triangle
      if (turn < 0) [q, r] = [r, q]; // counter-clockwise
      tri(P(p, c1), P(q, c1), P(r, c1)); // front cap, normal +C
      tri(P(p, c0), P(r, c0), P(q, c0)); // back cap, normal -C
    }
  }
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    const A0 = P(p, c0), B0 = P(q, c0), C1 = P(q, c1), D1 = P(p, c1);
    tri(A0, B0, C1); tri(A0, C1, D1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** A convex solid from faces (arrays of points, any winding), each oriented away from `inside`. */
export function convexSolid(faces, inside) {
  const pos = [], c = v3(inside);
  for (const f of faces) {
    const pts = f.map(v3);
    for (let i = 1; i < pts.length - 1; i++) {
      let [p, q, r] = [pts[0], pts[i], pts[i + 1]];
      const n = new THREE.Vector3().crossVectors(q.clone().sub(p), r.clone().sub(p));
      if (n.dot(p.clone().sub(c)) < 0) [q, r] = [r, q];
      pos.push(p.x, p.y, p.z, q.x, q.y, q.z, r.x, r.y, r.z);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** Offset a convex polygon outward by d (mitred), for mouldings around a bay. */
export function outset(poly, d) {
  const n = poly.length, out = [];
  const cx = poly.reduce((s, p) => s + p[0], 0) / n, cy = poly.reduce((s, p) => s + p[1], 0) / n;
  const normal = (p, q) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy);
    let nx = dy / l, ny = -dx / l;
    if (nx * ((p[0] + q[0]) / 2 - cx) + ny * ((p[1] + q[1]) / 2 - cy) < 0) { nx = -nx; ny = -ny; }
    return [nx, ny];
  };
  for (let i = 0; i < n; i++) {
    const n0 = normal(poly[(i + n - 1) % n], poly[i]), n1 = normal(poly[i], poly[(i + 1) % n]);
    const k = d / (1 + n0[0] * n1[0] + n0[1] * n1[1]);
    out.push([poly[i][0] + (n0[0] + n1[0]) * k, poly[i][1] + (n0[1] + n1[1]) * k]);
  }
  return out;
}

/** Accumulates quads (two triangles each) with flat normals; the six face helpers wind counter-clockwise seen from outside. */
export function shell() {
  const pos = [], idx = [];
  const quad = (a, b, c, d) => { const n = pos.length / 3; pos.push(...a, ...b, ...c, ...d); idx.push(n, n + 1, n + 2, n, n + 2, n + 3); }; // 4 vertices a quad, flat normals
  return {
    pz: (x0, x1, y0, y1, z) => quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]), // faces +z
    nz: (x0, x1, y0, y1, z) => quad([x1, y0, z], [x0, y0, z], [x0, y1, z], [x1, y1, z]), // faces -z
    px: (x, y0, y1, z0, z1) => quad([x, y0, z1], [x, y0, z0], [x, y1, z0], [x, y1, z1]), // faces +x
    nx: (x, y0, y1, z0, z1) => quad([x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0]), // faces -x
    py: (y, x0, x1, z0, z1) => quad([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0]), // faces +y
    ny: (y, x0, x1, z0, z1) => quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]), // faces -y
    get empty() { return pos.length === 0; },
    geometry() {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      g.computeVertexNormals(); // the four corners of a quad share one normal: indexed vertices are never shared between quads
      return g;
    },
  };
}

/** A box without the faces named in `skip`: f (+z) b (-z) r (+x) l (-x) u (+y) d (-y). Faces nobody can see are never built. */
export function shellBox(x0, x1, y0, y1, z0, z1, skip = '') {
  const s = shell();
  if (!skip.includes('f')) s.pz(x0, x1, y0, y1, z1);
  if (!skip.includes('b')) s.nz(x0, x1, y0, y1, z0);
  if (!skip.includes('r')) s.px(x1, y0, y1, z0, z1);
  if (!skip.includes('l')) s.nx(x0, y0, y1, z0, z1);
  if (!skip.includes('u')) s.py(y1, x0, x1, z0, z1);
  if (!skip.includes('d')) s.ny(y0, x0, x1, z0, z1);
  return s.geometry();
}

/**
 * The drawing kit of one house: every primitive takes local coordinates, applies the house
 * matrix and registers with assetBuilder under a palette name chosen for the detail level.
 */
export function houseKit(b, matrix, detail, remap = (m) => m) {
  const near = detail === 'near';
  const put = (g, m) => { g.applyMatrix4(matrix); b.put(g, remap(m)); };
  const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
  const kit = {
    near, put,
    /** Axis-aligned box from bounds. A box on the wall plane (z0 = 0) drops its back, one on the ground (y0 = 0) its bottom. */
    box(m, x0, x1, y0, y1, z0, z1, skip = (z0 === 0 ? 'b' : '') + (y0 === 0 ? 'd' : '')) {
      if (!(x1 > x0 && y1 > y0 && z1 > z0)) return;
      put(shellBox(x0, x1, y0, y1, z0, z1, skip), m);
    },
    /** Geometry built in a wall face's frame (x along the face, y up, z out of it) and placed on that face: face = { o: [x, z], a: rotY }. */
    putFace(m, g, face) {
      g.applyMatrix4(new THREE.Matrix4().makeRotationY(face.a).setPosition(face.o[0], 0, face.o[1])); put(g, m);
    },
    /** Box centred on c, turned about the vertical axis by rotY (a canted bay face). */
    boxAt(m, c, size, rotY = 0) {
      const g = new THREE.BoxGeometry(size[0], size[1], size[2]);
      g.rotateY(rotY); g.translate(c[0], c[1], c[2]); put(g, m);
    },
    /** Square-section bar from a to b. */
    bar(m, a, b2, w, d = w) {
      const av = v3(a), bv = v3(b2), dir = bv.clone().sub(av), len = dir.length();
      if (len < 1e-5) return;
      const g = new THREE.BoxGeometry(w, len, d);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
      g.translate(...av.add(bv).multiplyScalar(0.5).toArray()); put(g, m);
    },
    /** Round column from (x, y0, z) to (x, y1, z). */
    column(m, x, z, y0, y1, r, seg = 6) {
      const g = new THREE.CylinderGeometry(r, r, y1 - y0, near ? seg : 4, 1, true); // open ended: both ends are covered
      g.translate(x, (y0 + y1) / 2, z); put(g, m);
    },
    /** Polygon in the (x, y) plane extruded along z. */
    prismZ(m, poly, z0, z1) { put(extrude(poly, X, Y, z0, z1), m); },
    /** Polygon in the (x, z) plan extruded between two heights (convex bays etc.). */
    prismY(m, poly, y0, y1, caps = true) { put(extrude(poly, X, Z, -y1, -y0, caps), m); }, // X x Z = -Y
    /** Profile [z, y] extruded along x from x0 to x1 (stairs). */
    prismX(m, poly, x0, x1) { put(extrude(poly, Z, Y, -x1, -x0), m); }, // Z x Y = -X
    solid(m, faces, inside) { put(convexSolid(faces, inside), m); },
  };
  return kit;
}
