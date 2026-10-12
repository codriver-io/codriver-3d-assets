import * as THREE from 'three';
import { SPEC } from './config.js';
export const TIER_Y = [8, 73.8, 139.6, 205.4, 271.2, 337];
export const halfPlan = y => [0.5 * (SPEC.baseWidthM + (SPEC.roofWidthM - SPEC.baseWidthM) * Math.min(y, 337) / 337), 0.5 * (SPEC.baseDepthM + (SPEC.roofDepthM - SPEC.baseDepthM) * Math.min(y, 337) / 337)];
export const world = ([x, y, z]) => [x * Math.cos(SPEC.rotation) + z * Math.sin(SPEC.rotation), y, z * Math.cos(SPEC.rotation) - x * Math.sin(SPEC.rotation)];
// s runs clockwise around each face, so all panel normals point out.
export function facePoint(face, s, y, proud = 0) {
  const [w, d] = halfPlan(y);
  return face === 0 ? [s*w, y, d+proud] : face === 1 ? [w+proud, y, -s*d] : face === 2 ? [-s*w, y, -d-proud] : [-w-proud, y, s*d];
}
export function panel(face, s0, s1, y0, y1, proud=0) {
  const pts = [facePoint(face,s0,y0,proud),facePoint(face,s1,y0,proud),facePoint(face,s1,y1,proud),facePoint(face,s0,y1,proud)];
  const g = new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));
  g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();return g;
}
export const BRACES = Array.from({length:4},(_,face)=>TIER_Y.slice(0,-1).flatMap((lo,tier)=>[-1,1].map(sign=>({
  name: `face-${face}-tier-${tier}-${sign}`, face, a:facePoint(face,sign*0.976,lo,0.6), b:facePoint(face,-sign*0.976,TIER_Y[tier+1],0.6), supportA:`face-${face}-corner-${sign}`,supportB:`face-${face}-corner-${-sign}`,
})))).flat();
export const MASTS = [{x:-15.65,z:0.1,top:456.9},{x:15.65,z:0.1,top:456.9}];
