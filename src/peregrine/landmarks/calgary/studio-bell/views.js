// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The street front looks west
// onto 4 Street SE, under the skybridge; the hotel stands west of the street, the west block behind it.
export const VIEWS = {
  overview: [[-95, 55, -105], [0, 14, 0]],
  street: [[-12, 2.2, -62], [6, 17, -4]],
  facade: [[-45, 8, -48], [10, 16, -10]],
  roof: [[45, 125, 70], [0, 20, 0]],
  rear: [[125, 38, 78], [10, 15, 0]],
  underside: [[-14, 2, 42], [-12, 20, -2]],
  detail: [[-26, 10, -36], [4, 17, -12]],
};
