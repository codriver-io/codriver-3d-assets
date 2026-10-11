// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// Origin is the axis of the central dome; the front (vestibule) faces south, +z.
export const VIEWS = {
  overview: [[62, 30, 88], [0, 8, 2]],
  facade: [[-4, 6, 78], [0, 8, 0]],              // the south front from the lawn below the steps
  roof: [[22, 80, 38], [0, 8, -2]],              // from above: dome, pavilion roof, wings, rear houses
  dome: [[16, 22, 30], [0, 13, 0]],              // close on the dome, drum and lantern
  wing: [[58, 9, 30], [32, 4, 4]],               // east wing and lobe cupola
  rear: [[-30, 14, -62], [0, 7, -10]],           // the north side: rear service houses behind the alley
  vestibule: [[8, 4, 30], [0, 4, 11]],           // the gabled entrance vestibule
};
