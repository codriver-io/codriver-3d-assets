import { kit } from './palais-de-l-isle-annecy-parts.js';
import { MAPPED_PARTS } from './footprint.js';

export function create({ detail = 'near' } = {}) {
  const model = kit(detail);
  const rings = MAPPED_PARTS.map(ring => ring.slice(0, -1).map(model.local));
  const perimeter = (ring, bottom, height, windows = true) => {
    const area = ring.reduce((sum, point, index) => { const next = ring[(index + 1) % ring.length]; return sum + point[0] * next[1] - next[0] * point[1]; }, 0);
    for (let index = 0; index < ring.length; index++) {
      const start = ring[index], end = ring[(index + 1) % ring.length];
      const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
      if (length < .05) continue;
      const direction = area < 0 ? -1 : 1;
      const angle = Math.atan2(-(end[1] - start[1]) * direction, (end[0] - start[0]) * direction);
      const openings = windows && length > 4 ? [{ x: 0, y: 3.3, width: .65, height: 1.7, arch: true, material: 'glass' }] : [];
      model.wall('stone', (start[0] + end[0]) / 2, bottom, (start[1] + end[1]) / 2, length, height, .48, angle, openings);
    }
  };
  const hip = (ring, bottom, apex) => {
    for (let index = 0; index < ring.length; index++) {
      const start = ring[index], end = ring[(index + 1) % ring.length];
      model.face('roof', [[start[0], bottom, start[1]], [end[0], bottom, end[1]], apex], [start[0] - apex[0], 2, start[1] - apex[2]]);
    }
  };
  model.plan('stone', rings[0], 0, .35);
  perimeter(rings[0], .35, 8.15);
  model.plan('stone', rings[0], 8.25, .25);
  model.roof('roof', -8.6, 8.5, -6.2, 30.7, 5.6, 3.4);
  model.roof('roof', -9.1, 8.5, 8, 25.3, 5.5, 3.1);
  hip([[1.5, -3.4], [7.4, -5.1], [3.3, 9.2], [-2.2, 9.8]], 8.5, [1.2, 12.2, 2.2]);
  model.plan('stone', [[3.5, -3.3], [14.1, -2.5], [13.4, 7.7], [3.5, 8.2]], 0, .2);
  for (const [start, end] of [[[3.5, -3.3], [14.1, -2.5]], [[13.4, 7.7], [3.5, 8.2]]]) {
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const angle = Math.atan2(-(end[1] - start[1]), end[0] - start[0]);
    model.wall('stone', (start[0] + end[0]) / 2, .2, (start[1] + end[1]) / 2, length, 1.35, .4, angle);
  }
  perimeter(rings[2], 0, 9);
  model.plan('stone', rings[2], 8.8, .2);
  hip(rings[2], 9, [16.5, 17, 2.5]);
  model.cylinder('stone', 23.76, 3, 3.83, .18, 1.5, .61, 8);
  model.cylinder('stone', 23.76, 4.5, 3.83, .61, 4.5, .61, 8);
  model.wall('stone', 24.37, 9, 3.83, 1.15, 3.5, .4, -Math.PI / 2, [{ x: 0, y: .5, width: .42, height: 1.8, material: 'glass' }]);
  model.wall('stone', 23.76, 9, 3.25, 1.22, 3.5, .4, 0, [{ x: 0, y: .5, width: .42, height: 1.8, material: 'glass' }]);
  model.wall('stone', 23.76, 9, 4.43, 1.22, 3.5, .4, Math.PI, [{ x: 0, y: .5, width: .42, height: 1.8, material: 'glass' }]);
  model.cylinder('roof', 23.76, 12.5, 3.83, .78, 5.3, 0, model.near ? 16 : 10);
  model.bar('metal', [23.76, 17.7, 3.83], [23.76, 18.5, 3.83], .045);
  perimeter(rings[4], 8.5, 3);
  hip(rings[4], 11.5, [-9.8, 14.5, -2]);
  return model.finish();
}
