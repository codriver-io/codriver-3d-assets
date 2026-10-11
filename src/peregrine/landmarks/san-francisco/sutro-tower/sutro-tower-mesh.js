// Sutro Tower: surface helpers on top of assetBuilder.put. Nothing here knows a dimension; sutro-tower-shape.js
// owns every number. Faces are flat shaded (each has its own vertices) and wound to face `outward`.
import * as THREE from 'three';

const V = (p) => new THREE.Vector3(...p);

/** Convex planar polygons, flat shaded, each wound so the front face looks along its `outward` vector. polys = [[...points, outward]]. */
export function polys(b, material, list) {
  const positions = [], indices = [];
  for (const poly of list) {
    const outward = poly[poly.length - 1], pts = poly.slice(0, -1);
    const n = new THREE.Vector3().subVectors(V(pts[1]), V(pts[0])).cross(new THREE.Vector3().subVectors(V(pts[2]), V(pts[0])));
    const ordered = n.dot(V(outward)) < 0 ? [...pts].reverse() : pts;
    const base = positions.length / 3;
    for (const p of ordered) positions.push(...p);
    for (let i = 1; i < ordered.length - 1; i++) indices.push(base, base + i, base + i + 1);
  }
  if (!indices.length) return;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  b.put(g, material, 0, 0);
}

/** A prism between two rings of the same vertex count (ring a below ring c), flat sides, optional bottom / top caps. */
export function loft(b, material, a, c, { bottom = false, top = false } = {}) {
  const n = a.length, list = [];
  const mid = a.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n, s[2] + p[2] / n], [0, 0, 0]);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    list.push([a[i], a[j], c[j], c[i], [(a[i][0] + a[j][0]) / 2 - mid[0], 0, (a[i][2] + a[j][2]) / 2 - mid[2]]]);
  }
  if (bottom) list.push([...a, [0, -1, 0]]);
  if (top) list.push([...c, [0, 1, 0]]);
  polys(b, material, list);
}

/** A vertical closed cylinder from y0 to y1 about (x, z). */
export function cylinder(b, material, x, z, r, y0, y1, segments) {
  const g = new THREE.CylinderGeometry(r, r, y1 - y0, segments, 1, false);
  g.translate(x, (y0 + y1) / 2, z);
  b.put(g, material, 0, 0);
}

/** A closed cylinder along the axis from p0 to p1 (any direction). */
export function axisCylinder(b, material, p0, p1, r, segments) {
  const a = V(p0), c = V(p1), d = c.clone().sub(a), len = d.length();
  if (len < 1e-5) return;
  const g = new THREE.CylinderGeometry(r, r, len, segments, 1, false);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()));
  g.translate(...a.add(c).multiplyScalar(0.5).toArray());
  b.put(g, material, 0, 0);
}
