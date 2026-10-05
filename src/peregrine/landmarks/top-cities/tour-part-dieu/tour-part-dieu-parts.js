import * as THREE from 'three';
// Indexed exterior surfaces with explicit outward winding. No photo/texture inputs.
export class Surface {
  constructor() { this.p = []; this.n = []; this.i = []; }
  face(points, desired) {
    const v = points.map(p => new THREE.Vector3(...p));
    let n = v[1].clone().sub(v[0]).cross(v[2].clone().sub(v[0])).normalize();
    if (desired && n.dot(new THREE.Vector3(...desired)) < 0) { points = [...points].reverse(); n.negate(); }
    const k = this.p.length / 3;
    for (const p of points) { this.p.push(...p); this.n.push(...n.toArray()); }
    this.i.push(k, k + 1, k + 2);
    if (points.length === 4) this.i.push(k, k + 2, k + 3);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setIndex(this.i); return g;
  }
}
export const polar = (a, r, y) => [Math.cos(a) * r, y, Math.sin(a) * r];
export function strip(surface, a, c, r, y0, y1) {
  const mid = (a + c) / 2;
  surface.face([polar(a, r, y0), polar(c, r, y0), polar(c, r, y1), polar(a, r, y1)], [Math.cos(mid), 0, Math.sin(mid)]);
}
// Two-control-point roof orientation from OSM way 163278566; baked once.
export const ROOF_RING = [
  [4.8534921, 45.761037], [4.853721, 45.7612436],
  [4.8540167, 45.7610841], [4.8537878, 45.7608775],
];
