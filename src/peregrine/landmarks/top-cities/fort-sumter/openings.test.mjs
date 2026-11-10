import * as THREE from 'three';
import assert from 'node:assert/strict';
import {create} from './geometry.js';
import {WALL} from './footprint.js';
function frame(i){const a=WALL[i],c=WALL[(i+1)%5],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz);return{a,L,ux:dx/L,uz:dz/L};}
for(const detail of ['near','far']){
 const root=create({detail});root.updateMatrixWorld(true);
 const shoot=(i,s,d,y,dir,far)=>{const f=frame(i);return new THREE.Raycaster(new THREE.Vector3(f.a[0]+f.ux*s+f.uz*d,y,f.a[1]+f.uz*s-f.ux*d),new THREE.Vector3(f.uz*dir,0,-f.ux*dir),0,far).intersectObject(root,true);};
 const gate=frame(3);assert.equal(shoot(3,gate.L*.52,-1,2.5,1,2.8).length,0,'sally port must open through curtain');assert.ok(shoot(3,gate.L*.52,-1,4.2,1,2.8).length,'sally port lintel must remain');
 const face=frame(1),bay=face.L/Math.floor(face.L/6.276);assert.equal(shoot(1,bay*.5,8.4,2.5,-1,6.7).length,0,'casemate arch must remain open');assert.ok(shoot(1,bay*.5,8.4,5.1,-1,6.7).length,'casemate crown must remain');
 console.log(`${detail}: sally port and casemate positive/negative opening probes PASS`);
}
