// Triangle soup batched by material. `quad` faces `outward` (a world-space normal): the
// candidate winding is flipped when it points the other way, so a sheared wall cannot
// come out inside-out. Vertices are not welded, so each face keeps a flat normal.
import * as THREE from 'three';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export function sink() {
  const buckets = new Map();
  function tri(mat, a, b, c) {
    let list = buckets.get(mat);
    if (!list) buckets.set(mat, list = []);
    list.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  }
  function quad(mat, a, b, c, d, outward) {
    const n = cross(sub(b, a), sub(c, a));
    if (dot(n, n) < 1e-12) return;
    if (outward && dot(n, outward) < 0) { tri(mat, a, d, c); tri(mat, a, c, b); return; }
    tri(mat, a, b, c); tri(mat, a, c, d);
  }
  function flush(builder) {
    for (const [mat, pos] of buckets) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.computeVertexNormals();
      builder.put(g, mat);
    }
  }
  return { tri, quad, flush };
}
