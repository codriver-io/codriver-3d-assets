import * as THREE from 'three';
import { kit } from './maison-carree-nimes-parts.js';

export function create({ detail = 'near' } = {}) {
  const { near, put, box, cylinder, face, wall, finish } = kit(detail);
  box('stone', 2.3, 1.425, 0, 26.42, 2.85, 13.54);
  for (let step = 0; step < 15; step++) {
    const height = (step + 1) * 2.85 / 15;
    box('stone', -15.6 + step * .325, height / 2, 0, .34, height, 5.8);
  }
  const columns = [];
  for (let column = 0; column < 6; column++) columns.push([-10, -5.8 + column * 2.32]);
  for (const side of [-1, 1]) for (let column = 1; column <= 10; column++) columns.push([-10 + column * 2.4, side * 5.8]);
  for (let column = 1; column < 5; column++) columns.push([14, -5.8 + column * 2.32]);
  columns.forEach(([x, z]) => {
    cylinder('stone', x, 2.85, z, .67, .2, .67, near ? 8 : 6);
    cylinder('stone', x, 3.05, z, .59, .2, .55, near ? 8 : 6);
    const geometry = new THREE.CylinderGeometry(.46, .55, 8.05, near ? 12 : 8, 1);
    const positions = geometry.attributes.position;
    for (let vertex = 0; vertex < positions.count; vertex++) {
      const east = positions.getX(vertex), south = positions.getZ(vertex), radius = Math.hypot(east, south);
      if (radius > .1) { const factor = 1 + .04 * Math.cos(Math.atan2(south, east) * (near ? 6 : 4)); positions.setX(vertex, east * factor); positions.setZ(vertex, south * factor); }
    }
    geometry.computeVertexNormals(); geometry.translate(x, 7.275, z); put(geometry, 'stone');
    cylinder('stone', x, 11.3, z, .46, near ? .65 : .9, near ? .68 : .75, near ? 8 : 6);
    if (near) cylinder('stone', x, 11.95, z, .68, .25, .75, 8);
    box('stone', x, 12.35, z, 1.45, .3, 1.45);
    if (near) for (let leaf = 0; leaf < 4; leaf++) {
      const angle = leaf * Math.PI / 2;
      cylinder('stone', x + .48 * Math.cos(angle), 11.35, z + .48 * Math.sin(angle), .12, .65, .03, 4);
    }
  });
  for (const side of [-1, 1]) wall('stone', 6.1, 2.85, side * 5.35, 17.2, 9.65, .65, side < 0 ? 0 : Math.PI);
  wall('stone', -2.5, 2.85, 0, 10.7, 9.65, .7, Math.PI / 2, [{ x: 0, y: .15, width: 2.7, height: 5.2, material: 'glass' }]);
  wall('stone', 14.7, 2.85, 0, 10.7, 9.65, .7, -Math.PI / 2);
  box('stone', 2.4, 13, 0, 26.8, 1, 14.2);
  box('stone', 2.4, 13.75, 0, 27.2, .5, 14.8);
  const west = -11.2, east = 16, half = 7.4, bottom = 14, ridge = 17;
  face('roof', [[west, bottom, -half], [east, bottom, -half], [east, ridge, 0], [west, ridge, 0]], [0, 1, -1]);
  face('roof', [[west, ridge, 0], [east, ridge, 0], [east, bottom, half], [west, bottom, half]], [0, 1, 1]);
  face('stone', [[west, bottom, -half], [west, ridge, 0], [west, bottom, half]], [-1, 0, 0]);
  face('stone', [[east, bottom, -half], [east, ridge, 0], [east, bottom, half]], [1, 0, 0]);
  face('stone', [[west, bottom, -half], [east, bottom, -half], [east, bottom, half], [west, bottom, half]], [0, -1, 0]);
  const model = finish();
  model.userData.columnCenters = columns;
  model.userData.shaftSegments = near ? 12 : 8;
  return model;
}
