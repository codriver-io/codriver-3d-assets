import * as THREE from 'three';

// Original triangle-soup kit: real openings and texture-free clipped joints.
export class SurfaceMesh {
  constructor() { this.positions = []; }
  tri(a, b, c, outward) {
    const av = new THREE.Vector3(...a), n = new THREE.Vector3(...b).sub(av).cross(new THREE.Vector3(...c).sub(av));
    if (n.lengthSq() < 1e-10) return;
    if (n.dot(new THREE.Vector3(...outward)) < 0) [b, c] = [c, b];
    this.positions.push(...a, ...b, ...c);
  }
  poly(points, outward, holes = []) {
    const o = new THREE.Vector3(...points[0]), u = new THREE.Vector3(...points[1]).sub(o).normalize();
    const n = new THREE.Vector3(...outward).normalize(), v = n.clone().cross(u).normalize();
    const project = p => { const q = new THREE.Vector3(...p).sub(o); return new THREE.Vector2(q.dot(u), q.dot(v)); };
    const all = [...points, ...holes.flat()];
    for (const t of THREE.ShapeUtils.triangulateShape(points.map(project), holes.map(h => h.map(project)))) this.tri(...t.map(i => all[i]), outward);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3)); g.computeVertexNormals(); return g;
  }
}
export const normal = (a, b, c) => new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...c).sub(new THREE.Vector3(...a))).normalize().toArray();
export const offset = (p, n, d) => p.map((v, i) => v + n[i] * d);

// Clip a thin seam rectangle to one triangle in its own metric plane.
export function panelJoints(mesh, points, outward, spacing = 1.6) {
  const o = new THREE.Vector3(...points[0]), u = new THREE.Vector3(...points[1]).sub(o).normalize(), n = new THREE.Vector3(...outward).normalize(), v = n.clone().cross(u).normalize();
  const tri = points.map(p => { const q = new THREE.Vector3(...p).sub(o); return [q.dot(u), q.dot(v)]; });
  const sign = Math.sign((tri[1][0]-tri[0][0])*(tri[2][1]-tri[0][1])-(tri[1][1]-tri[0][1])*(tri[2][0]-tri[0][0]));
  const clip = polygon => {
    for (let k = 0; k < 3; k++) {
      const a=tri[k], b=tri[(k+1)%3], dist=p=>sign*((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]));
      const next=[];
      for(let i=0;i<polygon.length;i++) {
        const p=polygon[i], q=polygon[(i+1)%polygon.length], d=dist(p), e=dist(q);
        if(d>=0)next.push(p);
        if((d>=0)!==(e>=0)) { const t=d/(d-e);next.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]); }
      }
      polygon=next; if(polygon.length<3)return [];
    } return polygon;
  };
  const world = p => o.clone().addScaledVector(u,p[0]).addScaledVector(v,p[1]).addScaledVector(n,0.065).toArray();
  for(const angle of [0,Math.PI/3,2*Math.PI/3]) {
    const d=[Math.cos(angle),Math.sin(angle)], t=[-d[1],d[0]], vals=tri.map(p=>p[0]*d[0]+p[1]*d[1]);
    for(let c=Math.ceil(Math.min(...vals)/spacing)*spacing;c<Math.max(...vals);c+=spacing) {
      const p=[];for(const [along,across] of [[-200,-0.025],[200,-0.025],[200,0.025],[-200,0.025]])p.push([d[0]*(c+across)+t[0]*along,d[1]*(c+across)+t[1]*along]);
      const cut=clip(p);if(cut.length>=3)mesh.poly(cut.map(world),outward);
    }
  }
}
