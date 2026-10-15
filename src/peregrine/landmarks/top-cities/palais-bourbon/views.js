import { TEMPLE } from './palais-bourbon-temple.js';
const at = (x,y,z) => [TEMPLE.cx + x*Math.cos(TEMPLE.theta)-z*Math.sin(TEMPLE.theta), y, TEMPLE.cz + x*Math.sin(TEMPLE.theta)+z*Math.cos(TEMPLE.theta)];
export const VIEWS = {
  overview: [at(75,65,-115), at(0,8,28)],
  facade: [at(0,18,-88), at(0,13,0)],
  roof: [[80,155,80], [0,0,0]],
  back: [[-10,50,145], [0,7,18]],
  entrance: [at(6,7,-60), at(0,13,0)],
  detail: [at(25,27,-38), at(6,20,0)],
  plan: [[0,190,0.01],[0,0,0]],
};
