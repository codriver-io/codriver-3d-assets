// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The model is authored on the building's own axes (a toward
// the south-east, away from Grande Allée; b toward the north-east) and rotated once; `at` converts design points so each view is written where the
// thing is. a = 0 is the cantilevered street end, a = 92 the park end; b = 0 the south-west side, b = 58 the north-east.
import { F } from './mnbaq-pavillon-lassonde-site.js';
const at = (a, y, b) => F(a, y, b);

export const VIEWS = {
  overview: [at(-62, 46, -52), at(40, 12, 24)],
  facade: [at(-52, 3.5, 14), at(10, 15, 12)],
  roof: [at(48, 125, -40), at(46, 12, 28)],
  hall: [at(-14, 1.8, 15), at(21, 8, 15)],
  stair: [at(60, 5, -48), at(52, 12, 0)],
  park: [at(150, 28, 75), at(60, 9, 28)],
  street: [at(-35, 1.7, 42), at(5, 14, 12)],
  plan: [at(46, 260, 29), at(46, 0, 29)],
};
