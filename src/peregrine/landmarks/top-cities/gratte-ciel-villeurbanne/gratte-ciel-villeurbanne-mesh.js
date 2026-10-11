import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SPEC } from './config.js';
const C = Math.cos(SPEC.gridAngle), S = Math.sin(SPEC.gridAngle), R = 6378137;
export const uv = (u, v) => [u*C+v*S, v*C-u*S];
export function local([lng, lat]) {
  const k = Math.cos(SPEC.origin[1]*Math.PI/180);
  const x = R*(lng-SPEC.origin[0])*Math.PI/180*k;
  const z = -R*(Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))-Math.log(Math.tan(Math.PI/4+SPEC.origin[1]*Math.PI/360)))*k;
  return [x*C-z*S, x*S+z*C];
}
export const area = r => r.reduce((a,p,i) => { const q=r[(i+1)%r.length];return a+p[0]*q[1]-p[1]*q[0]; },0)/2;
export function clip(r, axis, value, less=true) {
  const out=[], inside=p=>less?p[axis]<=value:p[axis]>=value;
  for(let i=0;i<r.length;i++) { const a=r[i],b=r[(i+1)%r.length],ia=inside(a),ib=inside(b);
    if(ia)out.push(a);
    if(ia!==ib){const t=(value-a[axis])/(b[axis]-a[axis]);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}
  }
  return out;
}
export function inset(r,d) {
  const sign=Math.sign(area(r));
  return r.map((p,i)=>{const prev=r[(i+r.length-1)%r.length],next=r[(i+1)%r.length];
    const norm=(a,b)=>{const l=Math.hypot(b[0]-a[0],b[1]-a[1]);return [-sign*(b[1]-a[1])/l,sign*(b[0]-a[0])/l];};
    const a=norm(prev,p),b=norm(p,next),k=d/Math.max(.1,1+a[0]*b[0]+a[1]*b[1]);return [p[0]+(a[0]+b[0])*k,p[1]+(a[1]+b[1])*k];});
}
export function prism(r,y0,y1) {
  if(area(r)<0)r=[...r].reverse();
  const p=[],ind=[],n=r.length;
  const tri=(a,b,c)=>{let k=p.length/3;p.push(...a,...b,...c);ind.push(k,k+1,k+2);};
  const at=(i,y)=>{const [x,z]=uv(...r[i]);return [x,y,z];};
  for(let i=0;i<n;i++){const j=(i+1)%n;tri(at(i,y0),at(i,y1),at(j,y0));tri(at(j,y0),at(i,y1),at(j,y1));}
  for(const [a,b,c] of THREE.ShapeUtils.triangulateShape(r.map(p=>new THREE.Vector2(...p)),[])){
    tri(at(a,y1),at(c,y1),at(b,y1));tri(at(a,y0),at(b,y0),at(c,y0));
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ind);g.computeVertexNormals();return mergeVertices(g,1e-5);
}
