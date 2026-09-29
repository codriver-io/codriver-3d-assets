// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
export const VIEWS = {
  overview: [[260, 300, 620], [0, 270, 0]],       // the whole tower from the south-south-west, as on the postcards
  facade: [[-60, 60, 140], [0, 40, 0]],           // street level: the round base, the legs and the glass slot
  roof: [[70, 400, 95], [0, 355, 0]],             // above the pod: roof, sloping cone, drum, cabinets
  structure: [[-70, 24, 55], [0, 26, 0]],         // the three legs rising from the base
  pod: [[95, 335, 110], [0, 347, 0]],             // the main pod and its radome from the side
  underside: [[40, 210, -40], [0, 322, 0]],       // looking up under the pod at the brackets
  skypod: [[60, 452, 85], [0, 449, 0]],           // SkyPod and the base of the mast
  antenna: [[45, 536, 60], [0, 525, 0]],          // the tip
};
