import { toWorld, MID } from './concertgebouw-plan.js';
const view = (eye, target) => [toWorld(...eye), toWorld(...target)];
export const VIEWS = {
  overview: view([126, 61, 97], [2, 10, -7]),
  facade: view([142, 20, MID], [35, 12, MID]),
  back: view([-130, 40, -87], [-11, 12, -9]),
  pavilion: view([30, 27, 123], [1, 7, 12]),
  roof: view([18, 150, -4], [0, 0, -5]),
  entrance: view([80, 5, MID], [41, 5, MID]),
  lyre: view([78, 31, MID+7], [34, 24, MID]),
};
