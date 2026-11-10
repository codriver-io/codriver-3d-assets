import {ROTATION} from './config.js';
const q=([x,y,z])=>[Math.cos(ROTATION)*x+Math.sin(ROTATION)*z,y,-Math.sin(ROTATION)*x+Math.cos(ROTATION)*z];
const v=(a,c)=>[q(a),q(c)];
export const VIEWS={overview:v([-690,360,960],[0,70,0]),facade:v([0,110,1050],[0,70,0]),back:v([100,220,-1050],[0,65,0]),roof:v([0,1500,0],[0,0,0]),deck:v([-400,68,8],[-190,105,0]),support:v([-310,40,110],[-235.61,65,0]),underside:v([-150,14,70],[-235.61,57,0]),detail:v([-190,155,90],[-235.61,155,0])};
