// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
export const VIEWS = {
  overview: [[390, 150, 338], [0, 149, 0]],       // the whole tower from the south-east, as seen from Twin Peaks
  facade: [[470, 150, 0], [0, 150, 0]],           // the east elevation: the 60 m crossarm and the trident, as on the postcards
  roof: [[75, 335, 95], [0, 262, 0]],             // above the crossarms: the three-bar triangle and the masts
  crossarm: [[70, 270, 85], [0, 240, 0]],         // the three orange crossarms and the stays
  platforms: [[150, 130, 170], [0, 115, 0]],      // the solid Level 3 and Level 4 plates between the legs
  underside: [[55, 4, 45], [0, 80, 0]],           // looking up from the foot at the Level 2 plate and the legs
  masts: [[55, 292, 70], [0, 275, 0]],            // the top of the three masts
  base: [[-70, 30, 70], [-10, 25, 0]],            // the legs at grade
  pods: [[75, 190, -10], [8, 195, -12]],          // the row of pods on the north-east leg and the Level 5 lattice
  level2: [[60, 75, 60], [0, 55, 0]],             // the Level 2 deck with its dishes and whip
};
