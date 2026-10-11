// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// Authored in the mapped outline's plan frame (u toward the entrance arch, v to its right) and turned onto the grid.
import { plan } from './legion-of-honor-kit.js';
const view = (eye, target) => [plan(...eye), plan(...target)];
export const VIEWS = {
  overview: view([95, 55, 70], [-12, 6, -12]), // from the forecourt, above the arch, over the court toward the rotunda
  facade: view([78, 5, -18], [14, 6.5, -18]), // the entrance front on the axis: arch, colonnade screens, end pavilions
  roof: view([-8, 130, -18], [-10, 8, -18]), // plan view of roofs, court and dome
  court: view([36, 2.5, -18], [-8, 5, -18]), // through the arch to the portico, glass pyramid and The Thinker
  arch: view([48, 4, -25], [31, 7, -18]), // the triumphal arch and the colonnade screen
  rotunda: view([-100, 18, -42], [-56, 10, -18]), // the west apse and dome from the golf-course side
  back: view([-10, 16, 78], [-14, 6, 0]), // the south wing wall and its pilasters
};
