// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. Keys used by the catalog record's inspection views.
// Written in the tabletop's own frame (u along its long axis toward the south lot, v
// across it toward Grange Park, McCaul Street at -v) and mapped through the site frame.
import { pt } from './sharp-centre-for-design-site.js';

const view = (eye, target) => [pt(...eye).map((v) => +v.toFixed(2)), pt(...target).map((v) => +v.toFixed(2))];

export const VIEWS = {
  // The classic three-quarter from McCaul Street's south end: south end wall, east wall, legs.
  overview: view([95, 30, -75], [-5, 22, 0]),
  // Face-on to the east wall along McCaul Street: the pixel skin and window rhythm.
  facade: view([0, 12, -95], [0, 28, 0]),
  // From above and behind: roof deck, plant enclosure, the block below.
  roof: view([-70, 85, 65], [-10, 25, 5]),
  // From the south lot, looking up into the legs and the soffit.
  structure: view([62, 3, 40], [8, 24, -2]),
  // Grange Park side: the west wall over the brick block.
  west: view([-8, 7, 115], [-6, 24, 0]),
  // Looking straight up under the table: soffit pixels, legs, the red slab.
  underside: view([38, 1.7, 5], [0, 26, -8]),
  // What a driver sees heading south on McCaul Street.
  street: view([-150, 2.5, -24], [0, 26, 0]),
  // Straight down, for the footprint and the leg plan.
  plan: view([-8, 170, 2], [-8, 0, 1]),
  // From McCaul Street beside the house at 74 McCaul, looking north-northwest along the tabletop.
  southeast: view([62, 2, -34], [-6, 24, -2]),
  // From the roadway just north of the block, looking south along McCaul Street.
  mccaul: view([-98, 2, -24], [6, 22, -4]),
  // Close on the east wall: pixels, set-back windows and their black reveals.
  detail: view([26, 27, -34], [30, 30.5, -15.5]),
  // A leg foot on the sidewalk beside the block's east wall.
  foot: view([-18, 3, -28], [-18, 5, -16]),
};
