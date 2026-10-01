// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The entrance front looks
// south-east (bearing 138 deg); the Hamon Tower stands at the north-east end.
export const VIEWS = {
  overview: [[210, 95, 190], [10, 16, -10]],
  facade: [[105, 3.5, 150], [-5, 9, 10]],
  roof: [[70, 110, 80], [5, 14, -15]],
  tower: [[120, 22, 36], [40, 28, -36]],
  rear: [[-110, 14, -165], [20, 12, 10]],
  entrance: [[8, 2, 70], [-8, 6, 28]],
};
