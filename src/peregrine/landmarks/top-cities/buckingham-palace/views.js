import { ANGLE } from './buckingham-palace-plan.js';
const p=([u,y,v])=>[Math.cos(ANGLE)*u+Math.sin(ANGLE)*v,y,-Math.sin(ANGLE)*u+Math.cos(ANGLE)*v];
export const VIEWS = {
  overview: [p([95,100,-210]),p([-35,9,18])],
  facade: [p([-43.65,17,-210]),p([-43.65,12,-42])],
  roof: [p([-15,240,-20]),p([-35,0,20])],
  garden: [p([-43.65,35,235]),p([-43.65,11,65])],
  street: [p([-10,4,-110]),p([-43.65,12,-43])],
  detail: [p([-43.65,15,-90]),p([-43.65,13,-43])],
};
