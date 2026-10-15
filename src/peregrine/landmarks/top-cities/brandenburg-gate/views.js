import { SPEC } from './config.js';
const a=SPEC.axisDeg*Math.PI/180;
const p=([x,y,z])=>[x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)];
const v=(e,t)=>[p(e),p(t)];
export const VIEWS = {
  overview:v([70,43,95],[0,11,4]),
  facade:v([0,15,108],[0,11,3]),
  rear:v([-50,27,-90],[0,11,0]),
  roof:v([43,88,48],[0,10,5]),
  street:v([4,2.2,63],[0,13,0]),
  detail:v([12,28,23],[-0.55,22.5,0]),
  passage:v([-0.5,2.2,11],[-0.5,9,-8]),
};
