import * as THREE from 'three';
import { FOOTPRINTS } from './footprint.js';
import { kit } from './stade-mayol-toulon-parts.js';

export function create({ detail = 'near' } = {}) {
  const { near, put, box, bar, plan, wall, local, finish } = kit(detail);
  box('field', 0, .2, 0, 126, .2, 75);
  const clip = (ring, axis, edge, above) => {
    const result = [];
    ring.forEach((start, index) => {
      const end = ring[(index + 1) % ring.length], inside = above ? start[axis] >= edge : start[axis] <= edge, nextInside = above ? end[axis] >= edge : end[axis] <= edge;
      if (inside) result.push(start);
      if (inside !== nextInside) { const fraction = (edge - start[axis]) / (end[axis] - start[axis]); result.push(start.map((value, dimension) => value + (end[dimension] - value) * fraction)); }
    });
    return result;
  };
  FOOTPRINTS.forEach((footprint, index) => {
    const ring = footprint.slice(0, -1).map(local);
    if (index === 8) { plan('stone', ring, 0, 8); return; }
    plan('stone', ring, 0, 2);
    const axis = [0, 2, 3, 4].includes(index) ? 1 : 0;
    const minimum = Math.min(...ring.map(point => point[axis])), maximum = Math.max(...ring.map(point => point[axis]));
    const sign = (minimum + maximum) / 2 < 0 ? -1 : 1, count = near ? 20 : 7;
    for (let row = 0; row < count; row++) {
      const bottom = minimum + (maximum - minimum) * row / count, top = minimum + (maximum - minimum) * (row + 1) / count;
      const terrace = clip(clip(ring, axis, bottom, true), axis, index === 1 ? Math.min(top, maximum - 1) : top, false);
      if (terrace.length >= 3) plan('seats', terrace, 2 + (sign > 0 ? row : count - row - 1) / count * 16, 16 / count + .02);
    }
    if (index === 1) wall('stone', maximum, 0, -.75, 66.9, 18.2, .6, -Math.PI / 2, Array.from({ length: 13 }, (_, bay) => [3, 8].map((height, row) => ({ x: (bay - 6) * 4.9, y: height, width: 2.6, height: row === 0 ? 1.2 : 6.2, material: 'glass' }))).flat());
  });
  for (const [south, length, centreX, centreZ, height, depth] of [[1, 109, 0, 53, 23, 28], [-1, 100, -2, -50, 24, 24]]) {
    const geometry = new THREE.BoxGeometry(length, .65, depth); geometry.rotateX(south * -.07); geometry.translate(centreX, height, centreZ); put(geometry, 'roof');
    for (let bay = 0; bay <= (near ? 9 : 5); bay++) {
      const x = centreX - length / 2 + bay * length / (near ? 9 : 5);
      bar('trim', [x, 1, centreZ + south * (depth / 2 + 8)], [x, height, centreZ + south * (depth / 2 - 1)], 1.1);
      bar('trim', [x, height, centreZ + south * (depth / 2 - 1)], [x, height - 1.1, centreZ - south * depth / 2], .7);
    }
  }
  for (const east of [-1, 1]) for (const south of [-1, 1]) {
    const x = east * 62, z = south * 38;
    bar('metal', [x, 0, z], [x, 40, z], .45);
    box('metal', x, 40.5, z, 5.8, 3, .35);
    if (near) for (let column = 0; column < 5; column++) for (let row = 0; row < 2; row++) box('trim', x - 2.3 + column * 1.15, 39.9 + row * 1.2, z + south * .3, .8, .75, .2);
  }
  for (const east of [-1, 1]) {
    for (const south of [-1, 1]) bar('trim', [east * 53, .3, south * 2.8], [east * 53, 12, south * 2.8], .14);
    bar('trim', [east * 53, 3.3, -2.8], [east * 53, 3.3, 2.8], .14);
  }
  return finish();
}
