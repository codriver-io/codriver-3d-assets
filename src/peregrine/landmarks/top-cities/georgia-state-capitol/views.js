import { SPEC } from './config.js';
const r=SPEC.rotationDeg*Math.PI/180;
const p=([x,y,z])=>[Math.cos(r)*x+Math.sin(r)*z,y,-Math.sin(r)*x+Math.cos(r)*z];
const v=(eye,target)=>[p(eye),p(target)];
export const VIEWS = {
  overview: v([-145,100,155],[0,30,0]),
  facade: v([-170,35,0],[-10,31,0]),
  back: v([160,65,-85],[0,30,0]),
  roof: v([-75,185,100],[0,25,0]),
  street: v([-96,6,60],[-14,26,0]),
  dome: v([-49,63,43],[0,52,0]),
  entrance: v([-75,13,8],[-38,19,0]),
};
