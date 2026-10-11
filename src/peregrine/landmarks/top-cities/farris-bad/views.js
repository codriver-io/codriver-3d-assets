import { place } from './farris-bad-plan.js';
const view=(eye,target)=>[place(...eye),place(...target)];
export const VIEWS = {
  overview: view([-88,65,83],[32,7,-32]),
  facade: view([-100,19,-22],[10,9,-27]),
  rear: view([35,25,-162],[31,10,-65]),
  roof: view([30,165,-30],[30,0,-30]),
  entrance: view([110,18,65],[45,7,-12]),
  detail: view([-29,13,5],[8,7,-8]),
  courtyard: view([33,9,-32],[7,11,-18]),
};
