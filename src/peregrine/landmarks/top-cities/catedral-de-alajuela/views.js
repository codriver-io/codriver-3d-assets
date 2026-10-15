import { world } from './catedral-de-alajuela-parts.js';
const view=(e,t)=>[world(e),world(t)];
export const VIEWS={
  overview:view([75,58,100],[0,12,0]),
  facade:view([0,18,105],[0,12,27]),
  rear:view([-70,38,-95],[0,13,-12]),
  roof:view([30,125,20],[0,6,0]),
  street:view([47,7,-4],[0,14,-15]),
  detail:view([32,26,-57],[0,22,-20.8]),
};
