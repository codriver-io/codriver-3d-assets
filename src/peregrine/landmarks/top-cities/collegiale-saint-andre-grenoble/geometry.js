import * as THREE from 'three';
import { kit } from './collegiale-saint-andre-grenoble-parts.js';

export function create({ detail = 'near' } = {}) {
  const { near, put, box, cylinder, roof, wall, hall, face, finish } = kit(detail);
  const towerX = -21, towerZ = 13;
  hall('brick', 16, 0, 13, 21, 8, 10.5, [], .8);
  roof('roof', 16, 10.5, 13, 21, 8, 3);
  hall('brick', towerX, 0, towerZ, 9, 17, 10.5, [], .8);
  const lancets = Array.from({ length: 6 }, (_, bay) => ({ x: -17.5 + bay * 7, y: 7, width: 1.8, height: 7, arch: true, material: 'glass' }));
  hall('brick', 6, 0, -1, 42, 22, 17, lancets, .9);
  roof('roof', 6, 17, -1, 43, 23.5, 6);
  for (let bay = 0; bay < 7; bay++) for (const side of [-1, 1]) box('brick', -15 + bay * 7, 7.5, -1 + side * 11.8, .9, 15, 1.7);
  const bayX = 11.5, bayFront = 18.2;
  wall('brick', bayX, 0, bayFront, 9, 18.5, .8, Math.PI, [{ x: 0, y: 3.4, width: 1.9, height: 8.1, arch: true, material: 'glass' }]);
  for (const side of [-1, 1]) wall('brick', bayX + side * 4.5, 0, 14, 8.4, 18.5, .8, side < 0 ? Math.PI / 2 : -Math.PI / 2);
  face('brick', [[7, 18.5, bayFront], [16, 18.5, bayFront], [bayX, 23, bayFront]], [0, 0, 1]);
  for (const side of [-1, 1]) face('roof', [[bayX, 23, 9.8], [bayX, 23, bayFront], [bayX + side * 4.6, 18.5, bayFront], [bayX + side * 4.6, 18.5, 9.8]], [side, 1, 0]);
  for (const side of [-1, 1]) box('trim', bayX + side * 4.15, 6.4, 18.35, .65, 12.8, .9);
  const clock = new THREE.CircleGeometry(1, near ? 24 : 12);
  clock.translate(bayX, 20.2, bayFront + .06); put(clock, 'trim');
  const clockRim = new THREE.RingGeometry(1, 1.13, near ? 24 : 12);
  clockRim.translate(bayX, 20.2, bayFront + .08); put(clockRim, 'stone');
  wall('trim', 22, 0, 17.5, 10, 16.2, .7, Math.PI, [
    { x: 0, y: .15, width: 3.8, height: 8.8, arch: true, material: 'glass' },
    ...[-2.8, 0, 2.8].map(x => ({ x, y: 10.7, width: 1.3, height: 4, arch: true, material: 'glass' })),
  ]);
  wall('trim', 17, 0, 13.75, 7.5, 16.2, .7, Math.PI / 2);
  face('roof', [[17, 16.2, 17.5], [27, 16.2, 17.5], [27, 17.2, 9.6], [17, 17.2, 9.6]], [0, 1, 0]);
  for (const side of [-1, 1]) box('stone', 22 + side * 2.2, 3.525, 17.65, .55, 7.05, .3);
  const portalSegments = near ? 16 : 8;
  for (let segment = 0; segment < portalSegments; segment++) {
    const start = segment * Math.PI / portalSegments, end = (segment + 1) * Math.PI / portalSegments;
    face('stone', [[22 + 1.95 * Math.cos(start), 7.05 + 1.95 * Math.sin(start), 17.82], [22 + 2.48 * Math.cos(start), 7.05 + 2.48 * Math.sin(start), 17.82], [22 + 2.48 * Math.cos(end), 7.05 + 2.48 * Math.sin(end), 17.82], [22 + 1.95 * Math.cos(end), 7.05 + 1.95 * Math.sin(end), 17.82]], [0, 0, 1]);
  }
  hall('stone', towerX, 10.5, towerZ, 8.8, 8.8, 12.5, [{ x: 0, y: 1.5, width: 1.3, height: 6, arch: true, material: 'glass' }], .9);
  for (const side of [-1, 1]) {
    const arches = [-1.8, 1.8].map(x => ({ x, y: 1, width: 2.5, height: 5.8, arch: true }));
    wall('stone', towerX, 23, towerZ + side * 4.4, 8.8, 9, .8, side < 0 ? 0 : Math.PI, arches);
    wall('stone', towerX + side * 4.4, 23, towerZ, 8.8, 9, .8, side < 0 ? Math.PI / 2 : -Math.PI / 2, arches);
  }
  box('trim', towerX, 32.5, towerZ, 9.4, 1, 9.4);
  for (const east of [-1, 1]) for (const south of [-1, 1]) {
    const x = towerX + east * 3.6, z = towerZ + south * 3.6;
    cylinder('trim', x, 33, z, .68, 3, .68, 8);
    cylinder('trim', x, 36, z, .85, 6.5, 0, 8);
  }
  for (let facet = 0; facet < 8; facet++) {
    const angle = facet * Math.PI / 4, next = angle + Math.PI / 4;
    const start = [4.2 * Math.cos(angle), 4.2 * Math.sin(angle)], end = [4.2 * Math.cos(next), 4.2 * Math.sin(next)];
    const mid = start.map((value, axis) => (value + end[axis]) / 2), length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const shape = new THREE.Shape(); shape.moveTo(-length / 2, 0); shape.lineTo(length / 2, 0); shape.lineTo(0, 22.8); shape.closePath();
    for (const [bottom, width, height] of [[4, .8, 3.4], [11, .5, 2.1]]) {
      const hole = new THREE.Path(); hole.moveTo(-width / 2, bottom); hole.lineTo(width / 2, bottom); hole.lineTo(width / 2, bottom + height - width / 2); hole.absarc(0, bottom + height - width / 2, width / 2, 0, Math.PI); hole.closePath(); shape.holes.push(hole);
    }
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: .2, bevelEnabled: false, curveSegments: near ? 8 : 4 });
    const position = geometry.attributes.position;
    for (let vertex = 0; vertex < position.count; vertex++) {
      const horizontal = position.getX(vertex), vertical = position.getY(vertex), depth = position.getZ(vertex);
      const inset = 1 - vertical / 22.8 - depth / Math.hypot(...mid);
      position.setXYZ(vertex, towerX + mid[0] * inset + horizontal * (end[0] - start[0]) / length, 33 + vertical, towerZ + mid[1] * inset + horizontal * (end[1] - start[1]) / length);
    }
    geometry.computeVertexNormals(); put(geometry, 'trim');
  }
  cylinder('metal', towerX, 55.8, towerZ, .08, .2, .02, 6);
  return finish();
}
