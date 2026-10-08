// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// The harbour is west of the castle, so the facade camera sits on -X.
export const VIEWS = {
  overview: [[-96, 42, 48], [2, 12, 4]],
  facade: [[-58, 16, -4], [-6, 14, -10]],
  roof: [[28, 120, 36], [2, 6, 2]],
  harbour: [[-78, 7, 22], [-10, 11, -2]],
  south: [[24, 22, 130], [18, 10, 46]],
  north: [[-6, 24, -98], [0, 14, -24]],
  detail: [[-20, 22, 36], [6, 26, 19]],
  court: [[6, 36, -18], [2, 8, 2]],
};
