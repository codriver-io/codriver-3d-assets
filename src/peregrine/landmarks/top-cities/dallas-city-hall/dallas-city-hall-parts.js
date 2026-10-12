import * as THREE from 'three';
export const THETA = 15 * Math.PI / 180;
export const L = 170.688 / 2, ROOF = 33.4;
export const FRONT = y => -6.4 - Math.tan(34 * Math.PI / 180) * y;
export const xyz = (u,y,v) => [u*Math.cos(THETA)+v*Math.sin(THETA), y, -u*Math.sin(THETA)+v*Math.cos(THETA)];
export const uv = (x,z) => [x*Math.cos(THETA)-z*Math.sin(THETA), x*Math.sin(THETA)+z*Math.cos(THETA)];
// Outward-oriented triangle soup: flat normals and no layered backing sheets.
export class Surface {
  constructor() { this.p = []; }
  tri(a,b,c,n) {
    const ab = new THREE.Vector3(...b).sub(new THREE.Vector3(...a));
    const ac = new THREE.Vector3(...c).sub(new THREE.Vector3(...a));
    if (ab.cross(ac).dot(new THREE.Vector3(...n)) < 0) [b,c]=[c,b];
    this.p.push(...a,...b,...c);
  }
  quad(a,b,c,d,n) { this.tri(a,b,c,n); this.tri(a,c,d,n); }
  geometry() {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(this.p,3));
    g.computeVertexNormals(); return g;
  }
}
