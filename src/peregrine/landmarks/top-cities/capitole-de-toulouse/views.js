import { world } from './capitole-de-toulouse-plan.js';
const view = (eye,target) => [world(...eye),world(...target)];
export const VIEWS = {
  overview: view([100,75,145],[-3,10,0]),
  facade: view([-3,13,170],[-3,10,23]),
  entrance: view([-2.5,4.2,66],[-2.5,10.5,25]),
  detail: view([-2.5,20,67],[-2.5,17.2,25]),
  back: view([45,40,-135],[-3,10,0]),
  roof: view([40,130,80],[-3,8,0]),
  plan: [[-1,190,0],[-1,0,0]],
};
