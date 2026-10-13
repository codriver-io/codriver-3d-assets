import * as THREE from 'three';
import { SPEC } from './config.js';
// Bowed lens with truncated, concave ends, fitted to OSM way 16406633.
export function outline(detail) {
  const n=detail==='near'?32:16, ends=detail==='near'?10:6;
  const pts=[],L=SPEC.halfLength,W=SPEC.halfWidth,E=SPEC.endHalfWidth;
  for(let j=0;j<n;j++){const u=-L+2*L*j/n;pts.push([u,-W+(W-E)*(u/L)**2]);}
  for(let j=0;j<ends;j++){const v=-E+2*E*j/ends;pts.push([L-4*(1-(v/E)**2),v]);}
  for(let j=0;j<n;j++){const u=L-2*L*j/n;pts.push([u,W-(W-E)*(u/L)**2]);}
  for(let j=0;j<ends;j++){const v=E-2*E*j/ends;pts.push([-L+4*(1-(v/E)**2),v]);}
  return pts;
}
export const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
export function world([u,v],y){const a=SPEC.axisBearing*Math.PI/180;return [u*Math.sin(a)+v*Math.cos(a),y,-u*Math.cos(a)+v*Math.sin(a)];}
export class Surface {
  constructor(){this.p=[];this.n=[];this.i=[];}
  face(points,desired){
    let normal=new THREE.Vector3(...points[1]).sub(new THREE.Vector3(...points[0])).cross(new THREE.Vector3(...points[2]).sub(new THREE.Vector3(...points[0]))).normalize();
    if(normal.dot(new THREE.Vector3(...desired))<0){points=[...points].reverse();normal.negate();}
    const k=this.p.length/3;
    for(const p of points){this.p.push(...p);this.n.push(...normal.toArray());}
    for(let j=1;j<points.length-1;j++)this.i.push(k,k+j,k+j+1);
  }
  geometry(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.n,3));g.setIndex(this.i);return g;}
}
