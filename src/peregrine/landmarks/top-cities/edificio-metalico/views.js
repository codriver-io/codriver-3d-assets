import { ANGLE } from './config.js';
const turn=([x,y,z])=>[x*Math.cos(ANGLE)+z*Math.sin(ANGLE),y,-x*Math.sin(ANGLE)+z*Math.cos(ANGLE)];
const view=(e,t)=>[turn(e),turn(t)];
export const VIEWS={
 overview:view([72,38,88],[0,7,0]),
 facade:view([0,15,99],[0,8,20]),
 roof:view([48,77,53],[0,4,0]),
 back:view([-62,31,-74],[0,6,-3]),
 entrance:view([10,3.5,51],[0,4,21]),
 detail:view([17,13,43],[4.4,10.5,21.2]),
 top:view([0,105,0],[0,0,0]),
};
