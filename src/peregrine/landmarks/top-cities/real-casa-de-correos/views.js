import { world } from './geometry.js';
const view = (eye,target) => [world(...eye),world(...target)];
export const VIEWS = {
  overview: view([-70,48,-100],[2,13,3]),
  facade: view([2,16,-115],[2,15,-15]),
  rear: view([75,42,98],[2,11,7]),
  roof: view([2,112,20],[2,5,6]),
  entrance: view([2,5,-48],[2,8,-18]),
  tower: view([17,28,-42],[2,27,-16]),
};
