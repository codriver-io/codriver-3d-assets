// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south). Each value is [eye, target].
// The main facade (clock, glass wall, canopy) looks south-south-east (+X +Z); the long west wing runs west; the north wing runs toward the tracks.
export const VIEWS = {
  overview: [[110, 55, 120], [8, 7, 4]],
  facade: [[36, 6, 74], [10, 9, 20]],
  roof: [[60, 70, 50], [8, 10, 2]],
  clock: [[24, 13, 46], [10.4, 12.5, 22]],
  street: [[50, 1.7, 115], [10, 9, 21]],
  entrance: [[19, 2, 42], [10.4, 6, 21]],
  west: [[-70, 6, 80], [-12, 7, 12]],
  tracks: [[20, 10, -95], [14, 6, -10]],
  east: [[84, 6, 4], [20, 8, 5]],
  corner: [[-30, 8, 55], [0, 8, 18]],
  back: [[-70, 38, -70], [5, 6, 5]],
  aerial: [[70, 42, 90], [8, 6, 5]],
};
