// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
export const VIEWS = {
  overview: [[260, 120, 360], [0, 95, 0]],        // the whole tower from the south-east, as on the postcards
  facade: [[-46, 6, 62], [0, 20, 0]],             // street level: the glass rotunda and the shaft rising from its cone roof
  roof: [[55, 205, 70], [0, 168, 0]],             // above the turret: dome, skylights, drum, cauldron
  pod: [[78, 150, 118], [0, 158, 0]],             // the turret from the side: red cladding, glazing, rim
  underside: [[44, 112, 44], [0, 148, 0]],        // looking up under the turret at the ribbed soffit
  crown: [[16, 182, 22], [0, 177, 0]],            // cauldron, flame and the mast
  north: [[0, 150, -60], [0, 156, 0]],            // the glass-floor extension on the north side
};
