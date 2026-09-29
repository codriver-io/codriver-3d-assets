import { site } from './royal-ontario-museum-site.js';
// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south). Each value is [eye, target].
// Authored in the museum's own frame (u along Bloor Street, y up, v into the museum) and rotated once here.
const P = (u, y, v) => site(u, y, v);
export const VIEWS = {
  // From the Bloor Street corner at Queen's Park (the classic postcard view of the Crystal beside the 1933 gable).
  overview: [P(78, 14, -122), P(8, 15, -50)],
  // Straight on from Bloor Street, at eye height across the plaza.
  facade: [P(6, 4, -150), P(6, 16, -60)],
  // From above, looking down on the roofs.
  roof: [P(30, 150, -150), P(0, 20, -15)],
  // From the west (Philosopher's Walk side) and behind, to check the back of the Crystal and the west wing.
  structure: [P(-125, 36, -20), P(-10, 16, -20)],
  // The Queen's Park (east) side with the rotunda entrance.
  east: [P(150, 20, 20), P(45, 14, 0)],
  // Under the overhang at the main entrance.
  entrance: [P(2, 2.5, -122), P(14, 15, -68)],
};
