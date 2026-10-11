import * as THREE from 'three';
import { SPEC } from './config.js';

// Original mesh utilities in building coordinates u NE / v SE; rotation is baked once.
export function world([u, y, v]) {
  const c = Math.cos(SPEC.angle), s = Math.sin(SPEC.angle);
  return [u * c + v * s, y, -u * s + v * c];
}
export function surface(b, material, points, normal) {
  const p = points.map(world), n = world(normal);
  const a = new THREE.Vector3(...p[0]), ab = new THREE.Vector3(...p[1]).sub(a), ac = new THREE.Vector3(...p[2]).sub(a);
  let faceNormal = ab.cross(ac);
  if (faceNormal.lengthSq() < 1e-12) faceNormal = ac.cross(new THREE.Vector3(...p[3]).sub(a));
  if (faceNormal.dot(new THREE.Vector3(...n)) < 0) p.reverse();
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p.flat(), 3));
  g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals(); b.put(g, material);
}
export function box(b, material, center, size) {
  b.box(material, world(center), size, SPEC.angle);
}
export function prism(b, material, ring, lo, hi, bottom = false) {
  const area = ring.reduce((a, p, i) => { const q = ring[(i + 1) % ring.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0);
  for (let i = 0; i < ring.length; i++) {
    const [u, v] = ring[i], [w, z] = ring[(i + 1) % ring.length];
    surface(b, material, [[u, lo, v], [w, lo, z], [w, hi, z], [u, hi, v]], area > 0 ? [z - v, 0, u - w] : [v - z, 0, w - u]);
  }
  const faces = THREE.ShapeUtils.triangulateShape(ring.map(([u,v]) => new THREE.Vector2(u,v)), []);
  for (const [y, sign] of bottom ? [[lo, -1], [hi, 1]] : [[hi, 1]]) {
    const pts = ring.map(([u,v]) => world([u,y,v])); const ids=[];
    for (const f of faces) {
      const cross = new THREE.Vector3(...pts[f[1]]).sub(new THREE.Vector3(...pts[f[0]])).cross(new THREE.Vector3(...pts[f[2]]).sub(new THREE.Vector3(...pts[f[0]])));
      ids.push(...(cross.y * sign > 0 ? f : [...f].reverse()));
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex(ids);g.computeVertexNormals();b.put(g,material);
  }
}
// Adjacent profile runs meet edge-to-edge: no stacked, coplanar rings.
export function band(b, material, profile, segments) {
  for (let k=0;k<profile.length-1;k++) {
    const [r0,y0]=profile[k], [r1,y1]=profile[k+1];
    for(let i=0;i<segments;i++) {
      const a=i*Math.PI*2/segments,c=(i+1)*Math.PI*2/segments;
      surface(b,material,[[r0*Math.cos(a),y0,r0*Math.sin(a)],[r0*Math.cos(c),y0,r0*Math.sin(c)],[r1*Math.cos(c),y1,r1*Math.sin(c)],[r1*Math.cos(a),y1,r1*Math.sin(a)]],[(y1-y0)*Math.cos((a+c)/2),r0-r1,(y1-y0)*Math.sin((a+c)/2)]);
    }
  }
}
export function windowWall(b,{a,c,lo,hi,cols,rows,near,material='concrete',pane='glass',border=0.42,verticalBorder=border,recess=0.32}) {
  const du=c[0]-a[0],dv=c[1]-a[1],length=Math.hypot(du,dv), n=[dv/length,0,-du/length];
  const at=(s,y,d=0)=>[a[0]+du*s/length+n[0]*d,y,a[1]+dv*s/length+n[2]*d];
  const quad=(mat,l,r,y0,y1,d=0)=>surface(b,mat,[at(l,y0,d),at(r,y0,d),at(r,y1,d),at(l,y1,d)],n);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++) {
    const l=i*length/cols,r=(i+1)*length/cols,y0=lo+j*(hi-lo)/rows,y1=lo+(j+1)*(hi-lo)/rows;
    const x0=l+border,x1=r-border,z0=y0+verticalBorder,z1=y1-verticalBorder;
    const mat=(i*11+j*7)%29===0?'glow':pane;
    if(near) {
      quad(material,l,r,y0,z0);quad(material,l,r,z1,y1);quad(material,l,x0,z0,z1);quad(material,x1,r,z0,z1);
      // Splayed concrete reveals; the glazing is genuinely recessed, not on a wall face.
      const inner=[at(x0+.12,z0+.12,-recess),at(x1-.12,z0+.12,-recess),at(x1-.12,z1-.12,-recess),at(x0+.12,z1-.12,-recess)];
      const outer=[at(x0,z0),at(x1,z0),at(x1,z1),at(x0,z1)];
      for(let k=0;k<4;k++)surface(b,'sill',[outer[k],outer[(k+1)%4],inner[(k+1)%4],inner[k]],n);
      surface(b,mat,inner,n);
      if(material==='heritage')quad('metal',(x0+x1)/2-.045,(x0+x1)/2+.045,z0+.15,z1-.15,-recess+.08);
    } else quad(mat,x0,x1,z0,z1,.18);
  }
}
