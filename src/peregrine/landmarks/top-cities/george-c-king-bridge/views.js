import { toScene } from './george-c-king-bridge-site.js';

// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). Written in bridge
// coordinates (u along the span toward the north, y up, v across toward the east) and turned into scene
// coordinates here.
const at = (u, y, v) => toScene(u, y, v).map((n) => +n.toFixed(2));

export const VIEWS = {
  overview: [at(-95, 24, -120), at(5, 5, 0)], // three-quarter from the west bank: the three arches in a row
  facade: [at(0, 9, -190), at(0, 5, 0)], // side elevation of the whole bridge
  roof: [at(0, 240, 4), at(0, 0, 0)], // plan view
  deck: [at(-90, 1.8, 0.4), at(10, 4, 0)], // walking in from the south end, looking up the deck under the first arches
  tower: [at(-60, 8, -24), at(-42, 9, 0)], // the 99 m arch pair, close: lean, sections and crossing hangers
  underside: [at(-6, -2, -22), at(8, -0.8, 0)], // low and close at the first pier: caps, V struts, girder
  ramp: [at(48, 9, 20), at(26, 0, 8)], // from the island side: the ramp leaving the east edge of the centre span, the open rail, its piers
  end: [at(-150, 4, 0), at(-40, 6, 0)], // end-on from the south landing: the lean of the pair
};
