import { toWorld, TOWER } from './basilique-saint-sernin-plan.js';
const view=(eye,target)=>[toWorld(...eye),toWorld(...target)];
export const VIEWS = {
  overview: view([-115,83,133],[0,23,-1]),
  facade: view([-145,30,34],[-38,16,-2]),
  chevet: view([110,42,88],[28,24,-2]),
  roof: view([35,150,25],[0,6,-1]),
  street: view([-39,9,68],[-5,18,0]),
  tower: view([55,50,48],[TOWER[0],41,TOWER[1]]),
  portal: view([-82,13,12],[-56,10,-1.6]),
  gate: view([-36,9,51],[-25,4,27]),
};
