import { toScene } from './lefty-odoul-bridge-site.js';

// Inspector camera presets, [eye, target] in the model's metres (+X east, +Y up, +Z south). They are
// written in bridge coordinates (b along the axis toward the north-west heel, y above the road, v across
// toward the east-north-east side) and turned into scene coordinates here.
const at = (b, y, v) => toScene(b, y, v).map((n) => +n.toFixed(2));

export const VIEWS = {
  overview: [at(-78, 36, 74), at(8, 9, 0)],
  facade: [at(8, 14, 120), at(8, 11, 0)], // side elevation from the Oracle Park promenade
  roof: [at(8, 150, 6), at(8, 0, 0)], // plan view
  deck: [at(-62, 2.4, 3.5), at(28, 11, 0)], // driver's eye, approaching from the south-east
  tower: [at(40, 12, 62), at(40, 12, 0)], // the heel frame from the east
  underside: [at(24, 1.8, -3), at(46, 12, 5)], // looking up from the road at the raised counterweights
  heel: [at(88, 3, -2), at(15, 8, 0)], // from the north-west, looking back along the road at the tower
  house: [at(-36, 7, 36), at(-30.7, 4.5, 16.4)], // the operator's house
};
