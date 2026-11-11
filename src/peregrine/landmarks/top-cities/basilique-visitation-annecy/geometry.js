import { kit } from './basilique-visitation-annecy-parts.js';
import { FOOTPRINTS } from './footprint.js';

export function create({ detail = 'near' } = {}) {
  const model = kit(detail);
  const windows = Array.from({ length: 6 }, (_, index) => ({ x: -16.6 + index * 6.5, y: 9, width: 1.5, height: 5.5, arch: true, material: 'glass' }));
  model.hall('stone', .3, 0, -.7, 40.6, 12.3, 20, windows, .65);
  model.roof('roof', .3, 20, -.7, 40.8, 12.7, 6);
  for (const side of [-1, 1]) {
    const outer = side < 0 ? -10.8 : 9.3, inner = side < 0 ? -6.85 : 5.45;
    model.wall('stone', -4.1, 0, outer, 49.3, 12.5, .65, side < 0 ? 0 : Math.PI,
      Array.from({ length: 7 }, (_, index) => ({ x: -20 + index * 6.5, y: 4.6, width: 1.75, height: 5, arch: true, material: 'glass' })));
    model.face('roof', [[-28.75, 12.5, outer], [20.55, 12.5, outer], [20.55, 15, inner], [-28.75, 15, inner]], [0, 1, side]);
    for (let index = 0; index < 8; index++) model.box('stone', -27.5 + index * 6.65, 6.3, outer + side * .4, .65, 12.6, 1.1);
    model.wall('stone', -28.8, 0, (outer + inner) / 2, Math.abs(outer - inner), 12.5, .7, Math.PI / 2,
      [{ x: 0, y: .8, width: 1.5, height: 5, arch: true, material: 'glass' }]);
  }
  const apse = FOOTPRINTS[0].slice(2, 9).map(model.local);
  for (let index = 0; index < apse.length - 1; index++) {
    const start = apse[index], end = apse[index + 1];
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    model.wall('stone', (start[0] + end[0]) / 2, 0, (start[1] + end[1]) / 2, length, 18.5, .65,
      Math.atan2(start[1] - end[1], end[0] - start[0]), length > 4 ? [{ x: 0, y: 8, width: 1.4, height: 5, arch: true, material: 'glass' }] : []);
    model.face('roof', [[start[0], 18.5, start[1]], [end[0], 18.5, end[1]], [23, 24, -1.8]], [1, 2, 0]);
  }
  const tower = -24;
  model.wall('stone', -29.5, 0, -.7, 11.2, 36, 1.1, Math.PI / 2,
    [{ x: 0, y: 3.5, width: 7.1, height: 24.2, arch: true }, { x: 0, y: 30.8, width: 3.3, height: 3.2, arch: true, material: 'glass' }]);
  model.wall('stone', -21, 0, -.7, 9.2, 30, .8, Math.PI / 2,
    [{ x: 0, y: 3.5, width: 6.7, height: 22.8, arch: true, material: 'glass' }]);
  for (const side of [-1, 1]) {
    model.wall('stone', tower, 0, -.7 + side * 5.6, 11, 36, .85, side < 0 ? 0 : Math.PI,
      [{ x: 0, y: 3.5, width: 4.7, height: 15, arch: true }, { x: 0, y: 30.8, width: 3.3, height: 3.2, arch: true, material: 'glass' }]);
    for (const corner of [-1, 1]) {
      for (let step = 0; step < 6; step++) {
        const width = 2.9 - step * .31;
        model.box('stone', tower + corner * (5.4 + width * .15), step * 5.7 + 2.85, -.7 + side * (5.6 + width * .15), width, 5.7, width);
      }
    }
  }
  model.box('stone', tower, 35.7, -.7, 11.2, .6, 11.2);
  const ring = Array.from({ length: 8 }, (_, index) => {
    const angle = Math.PI / 8 + index * Math.PI / 4;
    return [tower + Math.cos(angle) * 4.9, -.7 + Math.sin(angle) * 4.9];
  });
  for (let index = 0; index < 8; index++) {
    const start = ring[index], end = ring[(index + 1) % 8];
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    model.wall('stone', (start[0] + end[0]) / 2, 36, (start[1] + end[1]) / 2, length, 13, .6,
      Math.atan2(start[1] - end[1], end[0] - start[0]),
      [{ x: 0, y: 1.6, width: 1.5, height: 5.4, arch: true }, { x: -.65, y: 9.1, width: .7, height: 1.8, arch: true }, { x: .65, y: 9.1, width: .7, height: 1.8, arch: true }]);
    model.face('roof', [[start[0], 49, start[1]], [end[0], 49, end[1]], [tower, 69, -.7]], [start[0] - tower, 2, start[1] + .7]);
    const middle = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    const radius = Math.hypot(middle[0] - tower, middle[1] + .7), outward = [(middle[0] - tower) / radius, (middle[1] + .7) / radius];
    const left = [start[0] + outward[0] * .12, 48.8, start[1] + outward[1] * .12], right = [end[0] + outward[0] * .12, 48.8, end[1] + outward[1] * .12];
    const peak = [middle[0] + outward[0] * .12, 50.4, middle[1] + outward[1] * .12], rear = [middle[0] - outward[0] * .45, 50.4, middle[1] - outward[1] * .45];
    model.face('stone', [left, right, peak], [outward[0], 0, outward[1]]);
    model.face('roof', [left, peak, rear], [outward[0], 1, outward[1]]);
    model.face('roof', [peak, right, rear], [outward[0], 1, outward[1]]);
    model.bar('stone', left, right, .16);
    model.bar('metal', [start[0], 49, start[1]], [tower, 69, -.7], .09);
    if (model.near) for (let band = 1; band < 6; band++) {
      const ratio = band / 7;
      const point = [(start[0] + end[0]) / 2 * (1 - ratio) + tower * ratio, 49 + ratio * 20, (start[1] + end[1]) / 2 * (1 - ratio) - .7 * ratio];
      model.cylinder('metal', point[0], point[1], point[2], .11, .13, .11, 4);
    }
  }
  model.plan('stone', ring, 48.7, .3);
  model.bar('metal', [tower, 65, -.7], [tower, 72, -.7], .13);
  model.bar('metal', [tower, 70.5, -2.2], [tower, 70.5, .8], .13);
  for (let step = 0; step < 12; step++) model.box('stone', -31.9 + step * .2, .12 + step * .14, -.7, .2, .24 + step * .28, 7.1);
  return model.finish();
}
