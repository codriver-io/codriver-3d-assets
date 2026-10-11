// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The public wing's glazed colonnade
// (the Grand Hall) looks east-north-east over the Ottawa River; the curatorial wing stretches north of it.
export const VIEWS = {
  overview: [[330, 150, 150], [0, 8, -20]],
  facade: [[185, 9, 40], [40, 8, 52]],
  roof: [[60, 175, 60], [-5, 8, 30]],
  entrance: [[-70, 6, -75], [-48, 7, 0]],
  rear: [[-150, 24, -150], [10, 6, -90]],
  detail: [[118, 3, 95], [60, 6, 62]],
  curatorial: [[170, 22, -60], [20, 6, -90]],
  street: [[160, 1.7, 175], [20, 8, 60]],
  south: [[-120, 55, 190], [0, 10, 50]],
};
