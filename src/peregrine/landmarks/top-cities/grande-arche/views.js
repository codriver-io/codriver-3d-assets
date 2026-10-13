import { SPEC } from './config.js';
const a=SPEC.axisDeg*Math.PI/180;
const p=([x,y,z])=>[x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)];
const view=(eye,target)=>[p(eye),p(target)];
export const VIEWS = {
  overview: view([155,136,205],[0,52,0]),
  facade: view([0,28,235],[0,54,0]),
  rear: view([-140,100,-215],[0,50,0]),
  roof: view([125,255,130],[0,55,0]),
  street: view([7,1.7,175],[0,49,0]),
  detail: view([29,38,89],[0,19,3]),
  interior: view([10,30,22],[-34.7,55,-10]),
};
