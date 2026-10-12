import {point} from './magere-brug-parts.js';
const v=(eye,target)=>[point(...eye),point(...target)];
export const VIEWS = {
 overview:v([53,35,66],[0,4,0]), facade:v([0,14,110],[-1,4,0]),
 back:v([-25,18,-102],[-1,4,0]),roof:v([0,116,0],[-1,0,0]),
 deck:v([-32,5.8,0],[2,6,0]),underside:v([-17,1.1,26],[0,3,0]),
 tower:v([-18,10,19],[-6,6.7,0]),detail:v([-10,10,13],[-6,7,0]),
};
