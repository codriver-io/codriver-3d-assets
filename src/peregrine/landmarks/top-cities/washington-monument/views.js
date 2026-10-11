// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// The entrance front is east. The Reflecting Pool side is west.
export const VIEWS = {
  overview: [[150, 78, 230], [0, 82, 0]], // whole obelisk from the southeast, base to apex
  facade: [[62, 8, 34], [4, 28, 0]], // east street: lobby, lower shaft and the colour line
  roof: [[18, 240, 22], [0, 150, 0]], // down onto the pyramidion and the lobby roof
  entrance: [[30, 4.2, 18], [12, 2.2, 0]], // the glass lobby against the east marble
  pyramidion: [[22, 164, 24], [0, 161, 0]], // windows, beacons and the apex
  joint: [[26, 48, 20], [0, 46, 0]], // the marble colour break at 150 ft
  west: [[-200, 74, 260], [0, 82, 0]], // from the Reflecting Pool side
};
