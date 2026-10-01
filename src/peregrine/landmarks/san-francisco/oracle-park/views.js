// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
export const VIEWS = {
  overview: [[160, 150, 310], [-5, 18, 0]],
  facade: [[-150, 16, -112], [-80, 15, -34]],        // King Street facade from the street
  roof: [[8, 340, 70], [0, 14, 0]],                  // plan view
  entrance: [[-235, 20, -5], [-135, 20, 40]],        // Willie Mays Plaza: clock tower and sign
  cove: [[100, 14, 215], [60, 8, 70]],               // right-field arcade from McCovey Cove
  field: [[-95, 80, 22], [60, 14, 0]],               // from above and behind home plate to the scoreboard
  toys: [[28, 26, -2], [96, 17, -46]],               // the bottle and the glove from the infield
  scoreboard: [[190, 40, 10], [96, 30, 14]],
};
