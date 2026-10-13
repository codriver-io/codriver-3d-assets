import { SPEC } from './config.js';
const turn = ([x,y,z]) => [x*Math.cos(SPEC.rotation)+z*Math.sin(SPEC.rotation), y, -x*Math.sin(SPEC.rotation)+z*Math.cos(SPEC.rotation)];
export const VIEWS = {
  overview: [turn([83,42,76]), turn([0,7,0])],
  facade: [turn([74,15,3]), turn([28,8,0])],
  back: [turn([-77,25,-50]), turn([-9,8,0])],
  roof: [turn([45,80,55]), turn([0,4,0])],
  south: [turn([0,13,74]), turn([0,8,0])],
  detail: [turn([45,16,24]), turn([33,11,9])],
};
