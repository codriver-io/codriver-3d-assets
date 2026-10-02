import { toScene } from './calgary-peace-bridge-site.js';

// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). Written in bridge
// coordinates (u along the span toward the south-east, y up, v across toward the south-west) and turned into scene
// coordinates here.
const at = (u, y, v) => toScene(u, y, v).map((n) => +n.toFixed(2));

export const VIEWS = {
  overview: [at(-52, 17, 72), at(8, 1.5, 0)], // three-quarter from the south-west bank
  facade: [at(0, 5, 118), at(0, 1.8, 0)], // side elevation of the whole span
  roof: [at(0, 190, 4), at(0, 0, 0)], // plan view
  deck: [at(-62, 1.7, 0.9), at(40, 2.2, 0)], // walking in from the north-west end, looking down the tube
  end: [at(-96, 3.0, 0), at(0, 2.2, 0)], // end-on from the landing: the ring and the receding double helix
  detail: [at(-20, 3.8, 15), at(-12, 2.0, 0)], // diamonds, hoops, glass and silver bars
  abutment: [at(70, 6, 20), at(60, 0.5, 0)], // the south-east landing and abutment from the bank
  underside: [at(18, -1.3, 16), at(6, 0.4, 0)], // low and close: the soffit, girder and lower ring
};
