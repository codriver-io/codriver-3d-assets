import { worldPoint } from './geometry.js';
const view=(eye,target)=>[worldPoint(eye),worldPoint(target)];
export const VIEWS = {
  overview: view([180,145,210],[0,27,-38]),
  facade: view([0,40,260],[0,38,-15]),
  back: view([-150,95,-240],[0,28,-60]),
  roof: view([120,260,70],[0,15,-45]),
  entrance: view([25,15,65],[0,12,0]),
  clock: view([20,70,40],[0,66,0]),
  library: view([-50,60,-150],[0,28,-94]),
};
