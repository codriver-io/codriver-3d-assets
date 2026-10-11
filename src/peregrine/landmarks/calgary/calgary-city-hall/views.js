// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The clock tower stands at about
// (-2.6, 0, -11.6) on the north (7 Avenue SE) front; the main block is 36 x 28 m.
export const VIEWS = {
  overview: [[-70, 42, -85], [0, 12, 0]],
  facade: [[-3, 14, -88], [-3, 15, 0]],
  roof: [[10, 105, -40], [0, 14, 0]],
  tower: [[-30, 30, -48], [-2.6, 24, -11.6]],
  clock: [[-2.6, 26, -38], [-2.6, 24, -15.6]],
  entrance: [[-2.6, 6, -34], [-2.6, 5, -16]],
  west: [[-80, 22, -4], [-18, 11, 0]],
  back: [[20, 26, 78], [0, 11, 0]],
  east: [[88, 18, 8], [18, 9, 0]],
  corner: [[70, 24, -62], [8, 12, -8]],
  gable: [[34, 26, -38], [14.75, 15, -11]],
  bay: [[-52, 18, -20], [-22, 12, 0]],
  annex: [[48, 16, 16], [19, 8, 0]],
  rear: [[-4, 14, 44], [-3, 12, 16]],
  dormers: [[-26, 20, -36], [-10, 15, -14]],
};
