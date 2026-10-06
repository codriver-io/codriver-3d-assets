import * as THREE from 'three';
import { SPEC } from './config.js';
export const localRing = ring => ring.slice(0,-1).map(([lng,lat]) => [
  (lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180), (SPEC.origin[1]-lat)*111320]);
export function contains(ring,x,z) {
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
    const a=ring[i],c=ring[j];
    if((a[1]>z)!==(c[1]>z) && x<(c[0]-a[0])*(z-a[1])/(c[1]-a[1])+a[0])inside=!inside;
  } return inside;
}
export function faces(list) {
  const positions=[];
  for(const {p,n} of list) for(let i=1;i<p.length-1;i++) {
    let tri=[p[0],p[i],p[i+1]];
    const a=new THREE.Vector3(...tri[0]),b=new THREE.Vector3(...tri[1]),c=new THREE.Vector3(...tri[2]);
    if(b.sub(a).cross(c.sub(a)).dot(new THREE.Vector3(...n))<0)tri=[tri[0],tri[2],tri[1]];
    positions.push(...tri.flat());
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();return g;
}
export function roof(ring,y) {
  const pts=ring.map(([x,z])=>new THREE.Vector2(x,z));
  const triangles=THREE.ShapeUtils.triangulateShape(pts,[]);
  return faces(triangles.map(t=>({p:t.map(i=>[ring[i][0],y,ring[i][1]]),n:[0,1,0]})));
}
export function edges(ring) {
  const area=ring.reduce((s,a,i)=>{const c=ring[(i+1)%ring.length];return s+a[0]*c[1]-c[0]*a[1];},0);
  return ring.map((a,i)=>{const c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),s=area>0?1:-1;return {a,c,len,n:[s*dz/len,0,-s*dx/len]};});
}
// Open triangular steel tubes, six triangles per member, merged by material.
export function strut(a,c,r) {
  const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),d=cv.clone().sub(av).normalize();
  const u=new THREE.Vector3().crossVectors(d,Math.abs(d.y)>.9?new THREE.Vector3(1,0,0):new THREE.Vector3(0,1,0)).normalize();
  const v=new THREE.Vector3().crossVectors(d,u),p=[];
  for(let i=0;i<3;i++){const t=i*Math.PI*2/3,o=u.clone().multiplyScalar(Math.cos(t)*r).addScaledVector(v,Math.sin(t)*r);p.push(av.clone().add(o).toArray(),cv.clone().add(o).toArray());}
  return faces([0,1,2].map(i=>{const j=(i+1)%3,n=u.clone().multiplyScalar(Math.cos((i+.5)*2*Math.PI/3)).addScaledVector(v,Math.sin((i+.5)*2*Math.PI/3));return {p:[p[i*2],p[j*2],p[j*2+1],p[i*2+1]],n:n.toArray()};}));
}
