// Flat quads for Holmenkollbakken. Each face is four points and an outward hint;
// the winding is flipped so the front faces that hint. Vertices are not shared,
// so the shading stays flat.
import * as THREE from 'three';

export function quads(b, material, faces) {
  const pos = [], idx = [];
  for (const { pts, out } of faces) {
    const [a, c, d] = pts;
    const ax = c[0] - a[0], ay = c[1] - a[1], az = c[2] - a[2];
    const bx = d[0] - a[0], by = d[1] - a[1], bz = d[2] - a[2];
    const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    if (nx * nx + ny * ny + nz * nz < 1e-8) continue;
    const base = pos.length / 3;
    for (const p of pts) pos.push(p[0], p[1], p[2]);
    if (nx * out[0] + ny * out[1] + nz * out[2] >= 0) idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    else idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
  }
  if (!idx.length) return;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  b.put(g, material);
}
