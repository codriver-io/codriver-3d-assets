import { world } from './abbaye-aux-hommes-plan.js';
const v=(eye,target)=>[world(...eye),world(...target)];
export const VIEWS={
 overview:v([-180,130,250],[-7,24,40]),
 facade:v([-165,36,-5],[-29,35,-2]),
 roof:v([140,200,220],[-12,12,55]),
 east:v([200,55,78],[35,28,12]),
 street:v([117,8,119],[32,20,59]),
 detail:v([-79,54,43],[-26,52,2]),
 palais:v([-42,19,99],[-94,10,43]),
};
