// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The front (entrance) looks
// 14.4 degrees west of north, toward the old Columbus statue forecourt.
export const VIEWS = {
  overview: [[-52, 40, -150], [0, 28, 0]],      // the whole tower from the forecourt side, as on the postcards
  facade: [[-17, 5, -60], [0, 14, 0]],          // street level at the entrance: terrace, porch, block, foot of the shaft
  roof: [[24, 82, -26], [0, 60, 0]],            // above the crown: cap, arcade arches and the alcoves
  crown: [[-12, 57, -34], [0, 58.5, 0]],        // the observation level from the front: balustrades, arches, small windows
  rotunda: [[25, 4, 56], [0, 6, 0]],            // the rear: curved glazed lobby with pilasters under the block
  shaft: [[45, 30, 55], [0, 34, 0]],            // the fluted shaft from the south-east
  entrance: [[-14, 7, -34], [0, 6.5, -8]],      // the porch, the front step and the phoenix relief
};
