import * as THREE from 'three';
import { kit } from './cathedrale-clermont-ferrand-parts.js';
import { FOOTPRINTS } from './footprint.js';
import { SPEC } from './config.js';

export function create({ detail = 'near' } = {}) {
  const model = kit(detail);
  const pointed = (width, height) => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0); shape.lineTo(width / 2, 0); shape.lineTo(width / 2, height * .55);
    shape.quadraticCurveTo(width * .42, height * .85, 0, height);
    shape.quadraticCurveTo(-width * .42, height * .85, -width / 2, height * .55); shape.closePath();
    return shape;
  };
  const wall = (x, bottom, z, width, height, angle, openings = [], thickness = .8) => {
    const shape = new THREE.Shape([new THREE.Vector2(-width / 2, 0), new THREE.Vector2(width / 2, 0), new THREE.Vector2(width / 2, height), new THREE.Vector2(-width / 2, height)]);
    for (const opening of openings) {
      let points;
      if (opening.circle) points = Array.from({ length: model.near ? 40 : 20 }, (_, index) => new THREE.Vector2(opening.x + opening.width / 2 * Math.cos(index * Math.PI * 2 / (model.near ? 40 : 20)), opening.y + opening.width / 2 * Math.sin(index * Math.PI * 2 / (model.near ? 40 : 20))));
      else points = pointed(opening.width, opening.height).getPoints(opening.lancet ? (model.near ? 6 : 2) : (model.near ? 8 : 4)).map(point => new THREE.Vector2(point.x + opening.x, point.y + opening.y));
      shape.holes.push(new THREE.Path(points));
      if (opening.glass) {
        const geometry = new THREE.ExtrudeGeometry(new THREE.Shape(points), { depth: .1, bevelEnabled: false });
        geometry.translate(0, 0, .45); geometry.rotateY(angle); geometry.translate(x, bottom, z); model.put(geometry, 'glass');
      }
    }
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
    geometry.rotateY(angle); geometry.translate(x, bottom, z); model.put(geometry, 'stone');
  };
  const gableRoof = (x, z, length, width, bottom, rise, angle = 0) => {
    const point = (along, height, across) => [x + Math.cos(angle) * along + Math.sin(angle) * across, height, z - Math.sin(angle) * along + Math.cos(angle) * across];
    for (const side of [-1, 1]) {
      model.face('roof', [point(-length / 2, bottom, side * width / 2), point(length / 2, bottom, side * width / 2), point(length / 2, bottom + rise, 0), point(-length / 2, bottom + rise, 0)], [Math.sin(angle) * side, 1, Math.cos(angle) * side]);
      model.face('stone', [point(side * length / 2, bottom, -width / 2), point(side * length / 2, bottom, width / 2), point(side * length / 2, bottom + rise, 0)], [Math.cos(angle) * side, 0, -Math.sin(angle) * side]);
    }
  };
  const modelRing = FOOTPRINTS[0].slice(0, -1).map(model.local);
  model.plan('stone', modelRing, 0, .3);
  const naveWindows = Array.from({ length: 9 }, (_, index) => ({ x: -31 + index * 7.7, y: 18, width: 3.2, height: 11.4, glass: true }));
  for (const side of [-1, 1]) {
    wall(-1, .3, 1 + side * 7.3, 72, 31.1, side < 0 ? 0 : Math.PI, naveWindows);
    wall(-.5, .3, 1 + side * 19, 63, 14, side < 0 ? 0 : Math.PI,
      Array.from({ length: 8 }, (_, index) => ({ x: -27 + index * 7.7, y: 2.6, width: 4.4, height: 10.2, glass: true })));
    model.face('roof', [[-32, 14.3, 1 + side * 19], [31, 14.3, 1 + side * 19], [31, 19, 1 + side * 7.3], [-32, 19, 1 + side * 7.3]], [0, 1, side]);
    for (let index = 0; index < 8; index++) {
      const along = -29 + index * 7.8;
      model.box('stone', along, 10.8, 1 + side * 20.2, 1.35, 21.6, 2);
      model.cylinder('stone', along, 21.6, 1 + side * 20.2, .7, 4.1, .08, 4);
      const steps = model.near ? 8 : 4;
      for (let step = 0; step < steps; step++) {
        const start = step / steps, end = (step + 1) / steps;
        const curve = ratio => [along, 22 + 7 * Math.sqrt(ratio), 1 + side * (19.5 - 12.2 * ratio)];
        model.bar('stone', curve(start), curve(end), .8, 1.05);
      }
    }
  }
  gableRoof(-1, 1, 72, 15, 31.4, 8.6);
  for (const side of [-1, 1]) {
    const transeptZ = 1 + side * 16.35;
    wall(3, 14.3, transeptZ, 13.5, 17.1, side < 0 ? 0 : Math.PI,
      [{ x: 0, y: 9.5, width: 8.5, circle: true, glass: true }]);
    model.face('stone', [[-3.75, 31.4, transeptZ], [9.75, 31.4, transeptZ], [3, 40, transeptZ]], [0, 0, side]);
  }
  gableRoof(3, 1, 32.7, 13.5, 31.4, 8.6, Math.PI / 2);
  const apse = Array.from({ length: 9 }, (_, index) => [31 + 13.5 * Math.cos(-Math.PI / 2 + index * Math.PI / 8), 1 + 15.5 * Math.sin(-Math.PI / 2 + index * Math.PI / 8)]);
  for (let index = 0; index < apse.length - 1; index++) {
    const start = apse[index], end = apse[index + 1];
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const angle = Math.atan2(start[1] - end[1], end[0] - start[0]);
    wall((start[0] + end[0]) / 2, .3, (start[1] + end[1]) / 2, length, 14, angle, [{ x: 0, y: 3, width: 2.8, height: 9, glass: true }]);
    const inner = point => [31 + (point[0] - 31) * .56, 1 + (point[1] - 1) * .56];
    const innerStart = inner(start), innerEnd = inner(end);
    model.face('roof', [[start[0], 14.3, start[1]], [end[0], 14.3, end[1]], [innerEnd[0], 19, innerEnd[1]], [innerStart[0], 19, innerStart[1]]], [1, 1, 0]);
    wall((innerStart[0] + innerEnd[0]) / 2, 14.3, (innerStart[1] + innerEnd[1]) / 2, length * .56, 17.1, angle,
      [{ x: 0, y: 4, width: 1.7, height: 11.5, glass: true }], .5);
    model.face('roof', [[innerStart[0], 31.4, innerStart[1]], [innerEnd[0], 31.4, innerEnd[1]], [30, 40, 1]], [1, 2, 0]);
    model.box('stone', start[0], 8.5, start[1], 1, 17, 1);
  }
  for (const side of [-1, 1]) {
    const towerZ = 1 + side * 13.5, tip = side < 0 ? 96.1 : 95.5;
    const openings = [{ x: 0, y: 2, width: 5.2, height: 14, glass: true }, { x: 0, y: 20, width: 3.8, height: 11.5, glass: true },
      ...[-1.8, 0, 1.8].map(x => ({ x, y: 36.7, width: 1.8 - SPEC.bellMullionWidth, height: 16.4, lancet: true }))];
    wall(-44, 0, towerZ, 11, 54, Math.PI / 2, openings, 1);
    wall(-30, 0, towerZ, 11, 54, -Math.PI / 2, openings, 1);
    for (const faceSide of [-1, 1]) wall(-37, 0, towerZ + faceSide * 5.5, 14, 54, faceSide < 0 ? 0 : Math.PI, openings, 1);
    model.box('stone', -37, 54.5, towerZ, 14.4, 1, 11.4);
    model.cylinder('stone', -37, SPEC.spireSpringing, towerZ, SPEC.spireBaseWidth / 2, tip - 1.6 - SPEC.spireSpringing, 0, 8);
    for (let corner = 0; corner < 8; corner++) {
      const angle = corner * Math.PI / 4;
      model.bar('stone', [-37 + Math.cos(angle) * SPEC.spireBaseWidth / 2, SPEC.spireSpringing, towerZ + Math.sin(angle) * SPEC.spireBaseWidth / 2], [-37, tip - 1.6, towerZ], model.near ? .14 : .09);
    }
    for (const along of [-1, 1]) for (const across of [-1, 1]) {
      const x = -37 + along * 6.35, z = towerZ + across * 4.8;
      model.box('stone', x, 31, z, .9, 62, .9);
      model.cylinder('stone', x, 62, z, .7, 8, 0, 4, Math.PI / 4);
    }
    model.bar('metal', [-37, tip - 1.6, towerZ], [-37, tip, towerZ], .06);
    model.bar('metal', [-37, tip - .55, towerZ - .45], [-37, tip - .55, towerZ + .45], .06);
  }
  wall(-44, 0, 1, 16, 34, Math.PI / 2,
    [{ x: 0, y: 2, width: 7.2, height: 13.8, glass: true }, { x: 0, y: 24.5, width: 8.5, circle: true, glass: true }], 1);
  model.face('stone', [[-44, 34, -7], [-44, 34, 9], [-44, 43, 1]], [-1, 0, 0]);
  for (let spoke = 0; spoke < (model.near ? 12 : 8); spoke++) {
    const angle = spoke * Math.PI * 2 / (model.near ? 12 : 8);
    model.bar('stone', [-43.7, 24.5, 1], [-43.7, 24.5 + Math.sin(angle) * 4.1, 1 + Math.cos(angle) * 4.1], .16);
  }
  const bayetteX = 10.5, bayetteZ = -18;
  for (let facet = 0; facet < 8; facet++) {
    const first = facet * Math.PI / 4, second = (facet + 1) * Math.PI / 4;
    const start = [bayetteX + Math.cos(first) * 2.6, bayetteZ + Math.sin(first) * 2.6], end = [bayetteX + Math.cos(second) * 2.6, bayetteZ + Math.sin(second) * 2.6];
    wall((start[0] + end[0]) / 2, 0, (start[1] + end[1]) / 2, 1.99, 46, Math.atan2(start[1] - end[1], end[0] - start[0]),
      [{ x: 0, y: 34, width: .9, height: 8, glass: true }], .5);
    model.bar('metal', [start[0], 46, start[1]], [start[0], 49.5, start[1]], .09);
  }
  model.cylinder('stone', bayetteX, 45.7, bayetteZ, 2.75, .3, 2.75, 8);
  model.cylinder('metal', bayetteX, 47, bayetteZ, .85, 1.8, .5, 10);
  model.cylinder('metal', bayetteX, 49.5, bayetteZ, 2.85, 1.2, 0, 8);
  for (let step = 0; step < 18; step++) model.box('stone', -53 + step * .5, .05 + step * .047, 1, .5, .1 + step * .094, 16);
  const result = model.finish();
  result.userData.flyingButtresses = 16;
  return result;
}
