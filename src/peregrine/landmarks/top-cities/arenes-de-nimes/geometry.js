import { kit } from './arenes-de-nimes-parts.js';

export function create({ detail = 'near' } = {}) {
  const { near, wall, cylinder, annulus, plan, finish } = kit(detail);
  const samples = Array.from({ length: 1201 }, (_, index) => [66.5 * Math.cos(index * Math.PI / 600), 50.5 * Math.sin(index * Math.PI / 600)]);
  const distances = [0];
  for (let index = 1; index < samples.length; index++) distances.push(distances[index - 1] + Math.hypot(samples[index][0] - samples[index - 1][0], samples[index][1] - samples[index - 1][1]));
  const stations = Array.from({ length: 60 }, (_, bay) => {
    const target = distances.at(-1) * bay / 60, index = Math.max(1, distances.findIndex(distance => distance >= target));
    const fraction = (target - distances[index - 1]) / (distances[index] - distances[index - 1]);
    return samples[index - 1].map((value, axis) => value + (samples[index][axis] - value) * fraction);
  });
  stations.forEach((start, bay) => {
    const end = stations[(bay + 1) % stations.length], width = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const x = (start[0] + end[0]) / 2, z = (start[1] + end[1]) / 2, angle = Math.atan2(-(end[1] - start[1]), end[0] - start[0]);
    for (const [bottom, height, sill] of [[0, 9, .05], [9.5, 9.5, .65]]) wall('stone', x, bottom, z, width + .015, height, 2, angle, [{ x: 0, y: sill, width: width * .65, height: 7.2, arch: true }]);
    if (near) for (const bottom of [0, 9.5]) {
      cylinder('stone', start[0] * 1.003, bottom + .35, start[1] * 1.003, .42, 7.7, .35, 10);
      cylinder('stone', start[0] * 1.003, bottom, start[1] * 1.003, .63, .35, .63, 8);
      cylinder('stone', start[0] * 1.003, bottom + 8.05, start[1] * 1.003, .62, .55, .62, 8);
    }
    wall('stone', x, 19, z, width + .015, 1.55, 2.2, angle);
  });
  for (const [bottom, height, radius] of [[9, .5, .55], [18.65, .55, .6], [20.55, .45, .7]]) annulus('stone', 63.8, 47.8, 66.5 + radius, 50.5 + radius, bottom, height, 60);
  const rows = near ? 18 : 5;
  for (let row = 0; row < rows; row++) {
    const fraction = row / rows, next = (row + 1) / rows;
    annulus('stone', 34.8 + fraction * 26.7, 19.2 + fraction * 26.3, 34.8 + next * 26.7, 19.2 + next * 26.3, .2 + fraction * 18.2, 18.2 / rows + .02, 60);
  }
  plan('sand', Array.from({ length: 60 }, (_, index) => [34.8 * Math.cos(index * Math.PI / 30), 19.2 * Math.sin(index * Math.PI / 30)]), .1, .1);
  return finish();
}
