import { ANGLE } from './config.js';
const p = ([u,y,v]) => [Math.cos(ANGLE)*u+Math.sin(ANGLE)*v,y,-Math.sin(ANGLE)*u+Math.cos(ANGLE)*v];
const view = (eye,target) => [p(eye),p(target)];
export const VIEWS = {
  overview: view([66,51,105],[0,10,0]),
  facade: view([0,11,99],[0,10,34]),
  roof: view([60,94,65],[0,10,-3]),
  back: view([-48,35,-111],[0,13,-15]),
  entrance: view([9,3.5,63],[0,4,34]),
  detail: view([9,15,58],[0,13,35]),
  top: [[0,138,0],[0,0,0]],
};
