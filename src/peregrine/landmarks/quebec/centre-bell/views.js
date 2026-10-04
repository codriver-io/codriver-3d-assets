import { world } from './centre-bell-parts.js';

// Inspector camera presets, [eye, target] in the model's metres (+x east, +y up, +z south), written on the
// arena's own grid (u south-east along the long edge, v north-east across it) and rotated by world().
// The glazed entrance front and the sign tower face north-east / north-west; the brick wall faces south-west.
const view = (eye, target) => [world(...eye), world(...target)];
export const VIEWS = {
  overview: view([-95, 80, 165], [0, 22, 0]),    // from Place des Canadiens: the front, the tower, the dark band
  facade: view([-8, 14, 135], [-8, 18, 50]),     // the glazed front and its two LED screens, straight on
  roof: view([55, 150, 45], [0, 34, 0]),         // the flat roof, its plant and the sign tower from above
  tower: view([-112, 38, 112], [-66, 36, 44]),   // the sign tower and its lettering, from the north corner
  sw: view([10, 16, -135], [10, 17, -51]),       // the brick face on Rue de la Montagne, windows and louvres
  se: view([150, 18, -15], [70, 17, -5]),        // the silver end on Rue Saint-Antoine Ouest
  street: view([-40, 2.2, -78], [20, 8, -51]),   // pedestrian level at the glazed arcade
  nw: view([-135, 22, 2], [-72, 22, 2]),         // the Avenue des Canadiens-de-Montréal end
};
