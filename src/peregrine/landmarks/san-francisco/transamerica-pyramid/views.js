// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
export const VIEWS = {
  overview: [[330, 150, 430], [0, 125, 0]],      // the whole pyramid from the south-east, as on the postcards
  facade: [[18, 8, 82], [0, 92, 0]],             // street level at the south face, looking up the window grid
  roof: [[38, 238, 48], [0, 236, 0]],            // the aluminium spire, its louvres and the glass crown
  base: [[-46, 5, 62], [-6, 8, 22]],             // the A-frame arcade over the glazed lobby, a corner pier
  wings: [[-96, 176, 88], [0, 190, 0]],          // the west wing's top and the spire's foot
  west: [[-170, 40, 36], [0, 125, 0]],           // Montgomery Street: the west wing's flat face
};
