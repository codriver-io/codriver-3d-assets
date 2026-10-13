import { point } from './yerevan-cascade-plan.js';
const v=(eye,target)=>[point(...eye),point(...target)];
export const VIEWS={
 overview:v([240,185,-180],[0,38,137]),
 facade:v([0,18,-155],[0,35,110]),
 roof:v([0,500,144],[0,20,144]),
 back:v([-150,155,445],[0,47,190]),
 street:v([0,2,-55],[0,16,63]),
 detail:v([20,22,32],[0,17,69]),
};
