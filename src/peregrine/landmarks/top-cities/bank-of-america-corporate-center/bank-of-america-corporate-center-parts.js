import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FOOTPRINTS } from './footprint.js';
import { SPEC } from './config.js';
// Literal real-metre geographic frame: east/up/south, origin from dossier.
const kx = 111320 * Math.cos(SPEC.origin[1] * Math.PI / 180);
export const PLANS = FOOTPRINTS.slice(1, 7).map(r => r.map(([lng,lat]) => [(lng-SPEC.origin[0])*kx, (SPEC.origin[1]-lat)*111320]));
export const TIERS = [[0,42],[42,161],[161,177],[177,208],[208,224],[224,235.02]];
export function buffers() {
  const data = new Map();
  function triangle(mat,a,c,d,n) {
    const cross = new THREE.Vector3().subVectors(new THREE.Vector3(...c),new THREE.Vector3(...a)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...d),new THREE.Vector3(...a)));
    if(cross.dot(new THREE.Vector3(...n)) < 0) [c,d] = [d,c];
    if(!data.has(mat)) data.set(mat,[]);
    data.get(mat).push(...a,...c,...d);
  }
  function quad(mat,a,c,d,e,n) { triangle(mat,a,c,d,n);triangle(mat,a,d,e,n); }
  function cap(mat,ring,y) {
    const v=ring.map(p=>new THREE.Vector2(...p));
    for(const [a,c,d] of THREE.ShapeUtils.triangulateShape(v,[])) triangle(mat,[ring[a][0],y,ring[a][1]],[ring[c][0],y,ring[c][1]],[ring[d][0],y,ring[d][1]],[0,1,0]);
  }
  function finish(b) {
    for(const [mat,ps] of data) {
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.computeVertexNormals();const welded=mergeVertices(g,0.0001);g.dispose();b.put(welded,mat);
    }
  }
  return {triangle,quad,cap,finish};
}
// Rods are rooted cantilever ornaments: their pointed upper ends are intentionally free.
// Each ring rests on a tier below it and on the rods that cross it.
export function crownRods(detail) {
  const near=detail==='near', rods=[];
  const tiers=[[13.15,96,245.5],[9.4,64,254],[5.6,40,260],[2.55,24,265.5]];
  for(const [r,count,top] of tiers) {
    const n=near?count:count/2;
    for(let i=0;i<n;i++) {
      const t=2*Math.PI*i/n+0.12;
      const [x,,z]=crownPoint(r,t,234.85);
      rods.push({base:[x,234.85,z],top:[x,top-(i%3)*0.35,z],radius:r>10?0.24:0.20});
    }
  }
  return rods;
}

// Outer rods follow the mapped rounded-square deck; inward offset seats every root.
export function crownPoint(radius,t,y) {
  const dx=Math.cos(t),dz=Math.sin(t);
  if(radius<10)return [radius*dx,y,radius*dz];
  let best=Infinity;
  const ring=PLANS[5];
  for(let i=0;i<ring.length;i++) {
    const a=ring[i],c=ring[(i+1)%ring.length],ex=c[0]-a[0],ez=c[1]-a[1];
    const den=dx*ez-dz*ex;if(Math.abs(den)<1e-8)continue;
    const r=(a[0]*ez-a[1]*ex)/den,u=(a[0]*dz-a[1]*dx)/den;
    if(r>0&&u>=0&&u<=1)best=Math.min(best,r);
  }
  return [best*0.97*dx,y,best*0.97*dz];
}
