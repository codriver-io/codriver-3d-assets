// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// The round copper turret is the north-north-west apex (x -4.9, z -7.3, axis bearing ~327 deg);
// the Kearny Street face looks west-south-west, the Columbus Avenue face north-east.
export const VIEWS = {
  overview: [[-40, 20, -58], [-2, 14, -2]], // apex-on from Columbus/Kearny/Pacific, the postcard view
  facade: [[-52, 14, 10], [-4, 14, 0]], // the Kearny Street face, head on
  columbus: [[44, 14, -38], [2, 14, 0]], // the Columbus Avenue face with the fire escape
  roof: [[-16, 52, -20], [-3, 24, -2]], // from above: cornice, roof, drum and dome
  turret: [[-16, 22, -22], [-5, 22, -7.3]], // the copper turret, cap ring and dome
  street: [[-14, 1.7, -24], [-4, 14, -6]], // eye height on Columbus Avenue
  dome: [[-11, 29, -15], [-4.9, 27.5, -7.3]], // dome, lantern, gilded ball and spire
};
