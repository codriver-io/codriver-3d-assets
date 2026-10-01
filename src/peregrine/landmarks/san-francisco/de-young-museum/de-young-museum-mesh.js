import * as THREE from 'three';

// Small mesh kit for the de Young model: flat-shaded triangle soup whose faces are oriented toward a point you
// name, so no winding has to be checked by hand. Frame while authoring: X = u (along the museum), Z = v (across it).

export class Soup {
  constructor() { this.p = []; }
  tri(a, b, c, toward) {
    if (toward) {
      const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
      if (n[0] * (toward[0] - a[0]) + n[1] * (toward[1] - a[1]) + n[2] * (toward[2] - a[2]) < 0) [b, c] = [c, b];
    }
    this.p.push(...a, ...b, ...c);
  }
  quad(a, b, c, d, toward) { this.tri(a, b, c, toward); this.tri(a, c, d, toward); }
  get empty() { return this.p.length === 0; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.computeVertexNormals();
    return g;
  }
}

// Point in a polygon of [x, z].
export function inPoly(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i], [xj, zj] = ring[j];
    if ((zi > pt[1]) !== (zj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - zi) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

// Triangles of a polygon with holes (rings of [x, z]); returns [[a, b, c], ...] of [x, z] points.
export function triangulate(outer, holes = []) {
  const v = (p) => new THREE.Vector2(p[0], p[1]);
  const all = [...outer, ...holes.flat()];
  return THREE.ShapeUtils.triangulateShape(outer.map(v), holes.map((h) => h.map(v))).map((t) => t.map((i) => all[i]));
}

export const hash = (a, b, c = 0) => {
  let h = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
