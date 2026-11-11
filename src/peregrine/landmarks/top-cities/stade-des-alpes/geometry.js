import { FOOTPRINTS } from './footprint.js';
import { kit } from './stade-des-alpes-parts.js';

export function create({ detail = 'near' } = {}) {
  const { near, box, bar, face, plan, wall, local, finish } = kit(detail);
  const outer = FOOTPRINTS[0].slice(0, -1).map(local);
  const signed = outer.reduce((sum, point, index) => sum + point[0] * outer[(index + 1) % outer.length][1] - outer[(index + 1) % outer.length][0] * point[1], 0);
  if (signed < 0) outer.reverse();
  const scaled = (ring, factor) => ring.map(point => point.map(value => value * factor));
  box('field', 0, .16, 0, 105, .12, 68);
  for (let row = 0; row < (near ? 24 : 5); row++) {
    const count = near ? 24 : 5, inside = .59 + row / count * .30, outside = .59 + (row + 1) / count * .30;
    plan('seats', scaled(outer, outside), .35 + row / count * 13, 13 / count + .02, [scaled(outer, inside).reverse()]);
  }
  outer.forEach((start, index) => {
    const end = outer[(index + 1) % outer.length], length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const angle = Math.atan2(-(end[1] - start[1]), end[0] - start[0]);
    const width = Math.min(2.9, length * .55);
    const count = Math.max(1, Math.floor(length / (near ? 6 : 9)));
    const openings = Array.from({ length: count }, (_, bay) => ({ x: (bay + .5) * length / count - length / 2, y: .35, width: Math.min(width, length / count * .72), height: 3.8, material: 'glass' }));
    wall('stone', (start[0] + end[0]) / 2, .35, (start[1] + end[1]) / 2, length, 5.2, .7, angle, openings);
    wall('cladding', (start[0] + end[0]) / 2, 5.55, (start[1] + end[1]) / 2, length, 5.45, .65, angle);
    if (near) for (const height of [6.5, 8, 9.5]) bar('cladding', [start[0] * 1.001, height, start[1] * 1.001], [end[0] * 1.001, height, end[1] * 1.001], .13);
  });
  const sections = near ? 8 : 3;
  const roofPoint = (point, section, underside = false) => {
    const fraction = section / sections, factor = 1 - .30 * fraction;
    return [point[0] * factor, 11 + 12 * Math.sin(fraction * Math.PI / 2) - (underside ? .3 : 0), point[1] * factor];
  };
  const rim = outer.flatMap((start, index) => {
    const end = outer[(index + 1) % outer.length];
    const count = Math.max(1, Math.ceil(Math.hypot(end[0] - start[0], end[1] - start[1]) / (near ? 7 : 20)));
    return Array.from({ length: count }, (_, step) => [start[0] + (end[0] - start[0]) * step / count, start[1] + (end[1] - start[1]) * step / count]);
  });
  const raised = point => [point[0], point[1] + .28, point[2]];
  rim.forEach((start, index) => {
    const end = rim[(index + 1) % rim.length];
    for (let section = 0; section < sections; section++) {
      face('roof', [roofPoint(start, section), roofPoint(end, section), roofPoint(end, section + 1), roofPoint(start, section + 1)], [0, 1, 0]);
      face('roof', [roofPoint(start, section, true), roofPoint(end, section, true), roofPoint(end, section + 1, true), roofPoint(start, section + 1, true)], [0, -1, 0]);
    }
    for (const section of [0, sections]) {
      const outward = section === 0 ? [start[0], 0, start[1]] : [-start[0], 0, -start[1]];
      face('roof', [roofPoint(start, section), roofPoint(end, section), roofPoint(end, section, true), roofPoint(start, section, true)], outward);
    }
    bar('metal', [start[0] * .99, 0, start[1] * .99], [start[0] * .99, 10.7, start[1] * .99], .38);
    for (let section = 0; section < sections; section++) bar('metal', raised(roofPoint(start, section)), raised(roofPoint(start, section + 1)), .22);
    for (let section = 0; section <= sections; section += near ? 2 : 1) bar('metal', raised(roofPoint(start, section)), raised(roofPoint(end, section)), .16);
  });
  return finish();
}
