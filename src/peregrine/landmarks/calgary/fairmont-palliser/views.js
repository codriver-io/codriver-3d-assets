// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The hotel's long axis runs
// 2.7 deg clockwise of east; 9 Avenue and the entrance are on the south (+z) side, the three arms open north.
export const VIEWS = {
  overview: [[-110, 95, 170], [0, 28, 0]],
  facade: [[20, 22, 130], [0, 24, 10]],
  roof: [[-60, 130, 80], [0, 50, 4]],
  entrance: [[26, 6, 52], [8, 5, 25]],
  north: [[-30, 60, -150], [0, 26, -5]],
  east: [[130, 30, 20], [34, 26, 0]],
  west: [[-130, 30, 30], [-34, 26, 0]],
  sign: [[10, 74, 55], [0, 59, 10]],
};
