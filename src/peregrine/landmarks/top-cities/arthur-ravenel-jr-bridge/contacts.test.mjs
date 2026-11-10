import assert from 'node:assert/strict';
import * as THREE from 'three';
import {create,stays} from './geometry.js';
import {ROTATION} from './config.js';
// Named material surfaces are actual triangles; the cable mesh is excluded.
for(const detail of ['near','far']) {
 const model=create({detail}),surfaces={};
 model.traverse(o=>{if(!o.isMesh||!['tower','concrete'].includes(o.material.name))return;
  const p=o.geometry.attributes.position,ix=o.geometry.index;
  surfaces[o.material.name]=[];
  for(let i=0;i<ix.count;i+=3)surfaces[o.material.name].push(new THREE.Triangle(...[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(p,ix.getX(i+j)))));
 });
 const rotate=p=>new THREE.Vector3(...p).applyAxisAngle(new THREE.Vector3(0,1,0),ROTATION);
 const distance=(p,mat)=>Math.min(...surfaces[mat].map(t=>t.closestPointToPoint(p,new THREE.Vector3()).distanceTo(p)));
 for(const [i,s] of stays(detail).entries()) {
  const top=rotate(s.top),foot=rotate(s.foot),axis=foot.clone().sub(top).normalize();
  assert(distance(top,'tower')<.02,`${detail} stay ${i}: pylon face`);
  assert(distance(foot,'concrete')<.30,`${detail} stay ${i}: anchorage barrier`);
  assert(distance(top.clone().addScaledVector(axis,4),'tower')>.8,'shortened tower end must fail');
  assert(distance(foot.clone().addScaledVector(axis,-4),'concrete')>.8,'shortened deck end must fail');
 }
 console.log(detail+': all stay terminals contact named pylon/barrier surfaces; shortened-end negative controls fail');
}
