// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The lagoon lies east
// of the rotunda; the front arch looks east by north (bearing 80 deg), the hall curves behind to the west.
export const VIEWS = {
  overview: [[210, 85, 90], [-5, 14, 10]],
  facade: [[96, 15, -17], [0, 22, 0]],
  roof: [[44, 118, 52], [-4, 38, 0]],
  street: [[118, 1.7, -20], [0, 22, 0]],
  colonnade: [[8, 5, 52], [-12, 8, 46]],
  corner: [[44, 30, 22], [18, 24, -2]],
  rear: [[-190, 40, 20], [-40, 14, 0]],
};
