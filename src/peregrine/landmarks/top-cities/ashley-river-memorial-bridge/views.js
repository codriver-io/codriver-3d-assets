import {ROTATION} from './config.js';
const q=([x,y,z])=>[Math.cos(ROTATION)*x+Math.sin(ROTATION)*z,y,-Math.sin(ROTATION)*x+Math.cos(ROTATION)*z];const v=(a,c)=>[q(a),q(c)];
export const VIEWS={overview:v([-200,145,345],[-35,8,0]),facade:v([-46,20,130],[-46,10,0]),back:v([-46,28,-130],[-46,10,0]),roof:v([0,580,0],[0,0,0]),deck:v([-110,9,0],[-20,10,0]),support:v([-94,3,35],[-70,5,0]),underside:v([-45,2,35],[-46,5,0]),detail:v([-83,17,30],[-73,13,8])};
