import * as THREE from 'three';
import { SPEC } from './config.js';
const frame = v => new THREE.Vector3(...v).applyAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(SPEC.rotationDeg)).toArray();
const view = (e,t) => [frame(e),frame(t)];
export const VIEWS = {
  overview: view([85,46,112],[0,8,0]),
  facade: view([0,17,119],[0,8.5,14]),
  back: view([-70,35,-105],[0,7,-4]),
  roof: view([48,117,65],[0,6,0]),
  street: view([25,4.8,74],[0,8,17]),
  detail: view([19,17,46],[0,11,19]),
  side: view([-93,27,45],[-20,8,0]),
};
