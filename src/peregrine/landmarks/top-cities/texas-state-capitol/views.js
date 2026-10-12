import { ROT } from './texas-state-capitol-plan.js';
const p = ([x,y,z]) => [x*Math.cos(ROT)+z*Math.sin(ROT),y,-x*Math.sin(ROT)+z*Math.cos(ROT)];
const v = (eye,target) => [p(eye),p(target)];
export const VIEWS = {
  overview: v([180,135,230],[0,35,0]),
  facade: v([0,48,280],[0,39,0]),
  back: v([0,65,-285],[0,37,-5]),
  roof: v([130,225,150],[0,20,-5]),
  street: v([60,4,175],[0,38,7]),
  dome: v([63,75,85],[0,63,0]),
  entrance: v([36,17,86],[0,19,32]),
};
