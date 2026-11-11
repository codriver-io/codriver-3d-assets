import { kit } from './tour-royale-toulon-parts.js';

export function create({ detail = 'near' } = {}) {
  const { near, box, cylinder, wall, hall, roof, finish } = kit(detail);
  cylinder('stone', 0, 0, 0, 30, 8.4, 28, near ? 64 : 40);
  cylinder('trim', 0, 8.4, 0, 28.5, .45, 28.5, near ? 64 : 40);
  const count = 32;
  for (let bay = 0; bay < count; bay++) {
    const angle = (bay + .5) * Math.PI * 2 / count, radius = 28, width = 2 * radius * Math.tan(Math.PI / count);
    wall('stone', radius * Math.cos(angle), 8.85, radius * Math.sin(angle), width, 4.75, 7, -angle - Math.PI / 2, bay % 2 === 0 ? [{ x: 0, y: .7, width: 1.7, height: 1.5, arch: true }] : []);
  }
  for (let bay = 0; bay < 16; bay++) {
    const angle = Math.PI + (bay + .5) * Math.PI / 16, radius = 24;
    wall('stone', radius * Math.cos(angle), 13.6, radius * Math.sin(angle), 2 * radius * Math.tan(Math.PI / 32), 6.4, 3, -angle - Math.PI / 2, bay % 4 === 1 ? [{ x: 0, y: 1.3, width: 1.2, height: 1.5, material: 'glass' }] : []);
  }
  for (const side of [-1, 1]) box('stone', side * 22.5, 16.8, 0, 3, 6.4, 1);
  hall('stone', -13, 8.85, -6, 13, 10, 8.8, [{ x: 0, y: 2, width: 1.5, height: 2, arch: true, material: 'glass' }], .9);
  roof('roof', -13, 17.65, -6, 13.5, 10.5, 2.35);
  for (const x of [-25, 25]) {
    cylinder('stone', x, 12.8, 0, 1.1, 2.9, 1.1, near ? 12 : 8);
    cylinder('trim', x, 15.7, 0, 1.5, .35, 1.5, near ? 12 : 8);
  }
  for (let step = 0; step < 16; step++) {
    const height = (step + 1) * 4.75 / 16;
    box('stone', 7, 8.85 + height / 2, -10 - step * .7, 3.8, height, .72);
  }
  return finish();
}
