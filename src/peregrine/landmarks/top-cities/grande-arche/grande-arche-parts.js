import * as THREE from 'three';
import { SPEC } from './config.js';
export const angle = SPEC.axisDeg*Math.PI/180;
export const worldPoint = ([x,y,z]) => [x*Math.cos(angle)+z*Math.sin(angle),y,-x*Math.sin(angle)+z*Math.cos(angle)];
export const localPoint = ([x,y,z]) => [x*Math.cos(angle)-z*Math.sin(angle),y,x*Math.sin(angle)+z*Math.cos(angle)];
// Original undulating tensile surface: six soft peaks and lowered corner anchor points.
export function cloudPoint(u,v) {
  return [u*24,17.4+2.2*Math.cos(u*Math.PI*2)*Math.cos(v*Math.PI)+1.3*Math.sin(v*Math.PI*1.5)-1.8*Math.pow(Math.abs(u*v),2),v*18+5];
}
export const POST_CONTACTS = [-1,1].flatMap(u=>[-1,1].map(v=>({
  name:`cloud-mast-${u}-${v}`,bottom:[u*24,SPEC.floorY,v*18+5],top:cloudPoint(u,v),bottomSupport:'stone',topSupport:'cloud',width:0.2,
})));
export const CABLE_CONTACTS = [-1,1].flatMap(u=>[-1,1].map(v=>({
  name:`cloud-tie-${u}-${v}`,bottom:cloudPoint(u,v),top:[u*34.7,25,v*(SPEC.depth/2-SPEC.bevelDepth)],bottomSupport:'cloud',topSupport:'stone',width:0.075,
})));
export const LIFT_CONTACTS = [-1,1].flatMap(x=>[-1,1].map(z=>({
  name:`lift-upright-${x}-${z}`,bottom:[x*1.8,SPEC.floorY,-13+z*1.8],top:[x*1.8,100,-13+z*1.8],bottomSupport:'stone',topSupport:'stone',width:0.22,
})));
// Explicit orientation on every face, including the underside and bevels.
export function quad(points,normal) {
  const [a,b,c]=points.map(p=>new THREE.Vector3(...p));
  const reverse=b.clone().sub(a).cross(c.clone().sub(a)).dot(new THREE.Vector3(...normal))<0;
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));
  g.setIndex(reverse?[0,2,1,0,3,2]:[0,1,2,0,2,3]);g.computeVertexNormals();return g;
}
