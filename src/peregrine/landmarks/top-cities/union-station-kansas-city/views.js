import { plan } from './geometry.js';
const view=(eye,target)=>[plan(...eye),plan(...target)];
export const VIEWS={
 overview:view([155,100,205],[-12,10,-35]),
 facade:view([-4,36,200],[-4,15,0]),
 back:view([150,85,-255],[-15,12,-65]),
 roof:view([130,240,90],[-15,8,-60]),
 entrance:view([-4,5,95],[-4,16,23]),
 detail:view([8,22,73],[-4,20,23]),
 plan:view([-20,360,-60],[-20,0,-60]),
};
