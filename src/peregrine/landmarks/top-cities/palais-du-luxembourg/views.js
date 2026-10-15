import { world } from './palais-du-luxembourg-plan.js';
const v=(eye,target)=>[world(...eye),world(...target)];
export const VIEWS={
 overview:v([130,115,160],[0,12,-16]),
 facade:v([0,30,178],[0,14,35]),
 north:v([0,40,-220],[0,12,-72]),
 roof:v([100,215,50],[0,0,-25]),
 entrance:v([24,16,-137],[0,10,-89]),
 detail:v([28,24,86],[0,17,36]),
 court:v([0,52,-88],[0,12,-25]),
};
