import * as THREE from 'three';
import { kit } from './tour-perret-grenoble-parts.js';

export function create({ detail = 'near' } = {}) {
  const { near, cylinder, box, bar, annulus, put, finish } = kit(detail);
  cylinder('stone', 0, 0, 0, 7.5, .3, 7.5, 32);
  cylinder('core', 0, .3, 0, 1.55, 69.7, 1.55, 8);
  const radius = 4.6;
  for (let index = 0; index < 8; index++) {
    const angle = index * Math.PI / 4;
    const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    box('stone', x, 29.65, z, .68, 58.7, .68, -angle);
    bar('stone', [Math.cos(angle) * 6.1, .3, Math.sin(angle) * 6.1], [x, 4.2, z], .9);
    const next = angle + Math.PI / 4, endX = Math.cos(next) * radius, endZ = Math.sin(next) * radius;
    const start = new THREE.Vector3(x, 0, z), end = new THREE.Vector3(endX, 0, endZ);
    const edge = end.clone().sub(start).normalize();
    const left = start.clone().addScaledVector(edge, .42), right = end.clone().addScaledVector(edge, -.42);
    const middle = left.clone().add(right).multiplyScalar(.5);
    const pitch = near ? 1.45 : 2.9;
    for (let bottom = 5; bottom + pitch < 58.4; bottom += pitch) {
      bar('stone', [left.x, bottom, left.z], [middle.x, bottom + pitch * .65, middle.z], near ? .15 : .22);
      bar('stone', [middle.x, bottom + pitch * .65, middle.z], [right.x, bottom, right.z], near ? .15 : .22);
    }
    for (const height of [4, 18, 32, 45, 58.4]) bar('stone', [left.x, height, left.z], [right.x, height, right.z], .28, .4);
    bar('stone', [x, 60, z], [x * .96, 67, z * .96], .48);
    bar('stone', [Math.cos(angle) * 2.15, 78.3, Math.sin(angle) * 2.15], [Math.cos(angle) * 2.15, 85.7, Math.sin(angle) * 2.15], .25);
    bar('stone', [Math.cos(angle) * 2.15, 85.7, Math.sin(angle) * 2.15], [Math.cos(angle) * 1.8, 86.35, Math.sin(angle) * 1.8], .25);
  }
  cylinder('trim', 0, 59, 0, 5.05, 1, 5.05, 32);
  cylinder('stone', 0, 67, 0, 5.75, .9, 5.75, 32);
  cylinder('trim', 0, 67.9, 0, 5.75, .4, 5.4, 32);
  cylinder('stone', 0, 68.3, 0, 5.4, 1.7, 2.3, 24);
  cylinder('stone', 0, 70, 0, 2.3, 8, 2.25, 16);
  annulus('metal', 4.45, 4.45, 4.6, 4.6, 61.2, .14, 32);
  annulus('metal', 4.45, 4.45, 4.6, 4.6, 65.6, .14, 32);
  cylinder('trim', 0, 78, 0, 2.3, .3, 2.3, 24);
  cylinder('stone', 0, 86, 0, 1.95, .35, 1.95, 16);
  const dome = new THREE.SphereGeometry(1.95, near ? 20 : 12, near ? 8 : 5, 0, Math.PI * 2, 0, Math.PI / 2);
  dome.scale(1, 1.5, 1); dome.translate(0, 86.35, 0); put(dome, 'stone');
  cylinder('metal', 0, 89.1, 0, .13, 5.9, .07, 6);
  return finish();
}
