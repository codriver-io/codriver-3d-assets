import * as THREE from 'three';

// Original solid constructors. Facade pieces face local +z.
export function polygon(points) {
  return new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
}
export function archPoints(c, bottom, width, height, segments = 10) {
  const r = width / 2, spring = bottom + height - r;
  const pts = [[c - r, bottom], [c + r, bottom], [c + r, spring]];
  for (let i = 1; i <= segments; i++) {
    const a = i * Math.PI / segments;
    pts.push([c + r * Math.cos(a), spring + r * Math.sin(a)]);
  }
  return pts;
}
export function openingPoints(w, segments) {
  return w.arch ? archPoints(w.c, w.y, w.w, w.h, segments) : [[w.c-w.w/2,w.y],[w.c+w.w/2,w.y],[w.c+w.w/2,w.y+w.h],[w.c-w.w/2,w.y+w.h]];
}
export function prism(shape, depth, z = 0) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 });
  g.translate(0, 0, z - depth);
  return g;
}
export function facadeMatrix(angle, x, z) {
  const m = new THREE.Matrix4().makeRotationY(angle);
  m.setPosition(x, 0, z); return m;
}
export function hipRoof(x0, x1, z0, z1, eave, rise, ridgeInset) {
  const mid = (x0+x1)/2;
  const v = [[x0,eave,z0],[x1,eave,z0],[x1,eave,z1],[x0,eave,z1],
    [mid,eave+rise,z0+ridgeInset],[mid,eave+rise,z1-ridgeInset]];
  return triangles(v, [[0,4,1],[1,4,5],[1,5,2],[2,5,3],[3,5,4],[3,4,0],[0,1,2],[0,2,3]]);
}
export function triangles(vertices, faces) {
  const p = faces.flatMap((f) => f.flatMap((i) => vertices[i]));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.computeVertexNormals(); return g;
}
export function gableRoof(x0,x1,z0,z1,eave,rise) {
  const z=(z0+z1)/2;
  const v=[[x0,eave,z0],[x1,eave,z0],[x1,eave,z1],[x0,eave,z1],[x0,eave+rise,z],[x1,eave+rise,z]];
  return triangles(v,[[0,4,5],[0,5,1],[3,2,5],[3,5,4],[0,3,4],[1,5,2],[0,1,2],[0,2,3]]);
}
