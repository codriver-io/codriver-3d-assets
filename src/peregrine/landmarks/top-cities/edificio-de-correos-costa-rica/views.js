import { ANGLE } from './config.js';
const point=([u,y,v])=>[u*Math.cos(ANGLE)+v*Math.sin(ANGLE),y,-u*Math.sin(ANGLE)+v*Math.cos(ANGLE)];
const view=(eye,target)=>[point(eye),point(target)];
export const VIEWS={
 overview:view([74,42,88],[0,9,0]), facade:view([0,19,118],[0,10,12]),
 roof:view([55,94,62],[0,8,0]), back:view([-56,32,-92],[0,9,-6]),
 entrance:view([7,5,32],[0,5,14]), detail:view([15,18,37],[0,15,14]),
 top:[[0,140,0],[0,0,0]],
};
