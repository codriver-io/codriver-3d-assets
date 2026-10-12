import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SPEC } from './config.js';
const A = (SPEC.planBearingDeg - 90) * Math.PI / 180;
export const xyz = (u, y, v) => [u * Math.cos(A) - v * Math.sin(A), y, u * Math.sin(A) + v * Math.cos(A)];
export function localRing(ring) {
  const c = Math.cos(SPEC.origin[1] * Math.PI / 180);
  return ring.slice(0, -1).map(([lng, lat]) => {
    const x = (lng - SPEC.origin[0]) * 111320 * c, z = -(lat - SPEC.origin[1]) * 111320;
    return [x * Math.cos(A) + z * Math.sin(A), -x * Math.sin(A) + z * Math.cos(A)];
  });
}
// Independent triangles keep crisp normals on the stone and folded glass.
export class Surface {
  constructor() { this.positions = []; }
  tri(a, b, c) {
    const ab=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),ac=new THREE.Vector3(...c).sub(new THREE.Vector3(...a));
    if(ab.cross(ac).lengthSq()>1e-12)this.positions.push(...xyz(...a), ...xyz(...b), ...xyz(...c));
  }
  quad(a, b, c, d) { this.tri(a, b, c); this.tri(a, c, d); }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    g.computeVertexNormals(); return mergeVertices(g);
  }
}
export function cap(surface, ring, height) {
  const p = ring.map(([u,v]) => new THREE.Vector2(u,v));
  for (const t of THREE.ShapeUtils.triangulateShape(p, [])) {
    const q = t.map(i => [ring[i][0], typeof height === 'function' ? height(...ring[i]) : height, ring[i][1]]);
    const n = new THREE.Vector3().crossVectors(new THREE.Vector3(...q[1]).sub(new THREE.Vector3(...q[0])), new THREE.Vector3(...q[2]).sub(new THREE.Vector3(...q[0])));
    surface.tri(...(n.y > 0 ? q : [q[0],q[2],q[1]]));
  }
}
export function splitAtRidge(ring) {
  return [-1,1].map(sign => {
    const out = [];
    for(let i=0;i<ring.length;i++) {
      const a=ring[i],c=ring[(i+1)%ring.length];
      if(a[1]*sign>=0) out.push(a);
      if(a[1]*c[1]<0) { const t=-a[1]/(c[1]-a[1]); out.push([a[0]+t*(c[0]-a[0]),0]); }
    }
    return out;
  });
}
