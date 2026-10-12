import { world } from './basilica-de-los-angeles-cartago-parts.js';
const view=(a,b)=>[world(a),world(b)];
export const VIEWS={
  overview:view([90,55,110],[0,17,0]),
  facade:view([2,19,130],[2,19,4]),
  street:view([2,2,105],[2,19,6]),
  rear:view([-90,48,-105],[-3,16,-3]),
  roof:view([65,105,65],[0,14,0]),
  detail:view([27,35,68],[2,26,19]),
  top:view([0,170,0],[0,0,0]),
};
