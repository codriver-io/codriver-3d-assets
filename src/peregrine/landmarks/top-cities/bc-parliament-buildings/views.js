import { ANGLE } from './bc-parliament-buildings-site.js';
const world = ([u,y,v]) => [Math.cos(ANGLE)*u-Math.sin(ANGLE)*v,y,Math.sin(ANGLE)*u+Math.cos(ANGLE)*v];
const view = (eye,target) => [world(eye),world(target)];
export const VIEWS = {
  overview: view([150,95,-170],[0,14,8]),
  facade: view([0,17,-220],[0,15,-20]),
  roof: view([95,190,-100],[0,6,8]),
  back: view([-120,65,170],[0,13,20]),
  entrance: view([16,7,-65],[0,9,-32]),
  dome: view([25,39,-65],[-0.5,29,-18]),
  plan: view([0,310,12],[0,0,12]),
};
