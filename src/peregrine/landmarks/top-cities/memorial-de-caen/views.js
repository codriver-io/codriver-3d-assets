import { place } from './memorial-de-caen-plan.js';
const view=(u,y,v,tu,ty,tv)=>[place(u,y,v),place(tu,ty,tv)];
export const VIEWS = {
  overview: view(130,85,-145,-25,7,30),
  facade: view(36,15,-130,36,7.5,0),
  rear: view(20,45,180,-18,7,35),
  roof: view(-20,195,33,-20,0,33),
  entrance: view(36,1.8,-27,36,6,8),
  detail: view(46,15,-18,36,9,1),
  extension: view(-62,9,-22,-31,2,12),
};
