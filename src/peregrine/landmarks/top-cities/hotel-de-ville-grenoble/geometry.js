import { FOOTPRINTS } from './footprint.js';
import { kit } from './hotel-de-ville-grenoble-parts.js';

export function create({ detail = 'near' } = {}) {
  const { near, box, wall, hall, local, plan, finish } = kit(detail);
  const rings = FOOTPRINTS.map(ring => ring.slice(0, -1).map(local));
  const [outer, court, tower] = rings;
  const centre = tower.reduce((sum, point) => sum.map((value, axis) => value + point[axis] / tower.length), [0, 0]);
  const towerLength = Math.max(...tower.map(point => point[0])) - Math.min(...tower.map(point => point[0]));
  const towerWidth = Math.max(...tower.map(point => point[1])) - Math.min(...tower.map(point => point[1]));
  for (const ring of [outer, court.slice().reverse()]) ring.forEach((start, index) => {
    const end = ring[(index + 1) % ring.length], length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const angle = Math.atan2(-(end[1] - start[1]), end[0] - start[0]);
    const bays = Math.max(1, Math.floor(length / (near ? 5.4 : 10)));
    const openings = [];
    if (length > 3) for (let bay = 0; bay < bays; bay++) for (const level of [0, 1]) openings.push({ x: (bay + .5) * length / bays - length / 2, y: .15 + level * 4.7, width: Math.min(6, length / bays * .78), height: level === 0 ? 4.2 : 3.5, ...(level === 1 ? { material: 'glass' } : {}) });
    wall('stone', (start[0] + end[0]) / 2, 0, (start[1] + end[1]) / 2, length, 9, .8, angle, openings, ring !== outer);
  });
  plan('stone', outer, 9, .5, [court, tower]);
  const openings = [];
  for (let level = 0; level < 12; level++) for (let bay = 0; bay < (near ? 14 : 7); bay++) openings.push({ x: (bay + .5) * towerLength / (near ? 14 : 7) - towerLength / 2, y: .35 + level * 2.85, width: towerLength / (near ? 14 : 7) * .77, height: 2.2, material: 'glass' });
  hall('trim', centre[0], 9.5, centre[1], towerLength, towerWidth, 35, openings, .65);
  box('trim', centre[0], 45.5, centre[1], towerLength + 3, 2, towerWidth + 3);
  return finish();
}
