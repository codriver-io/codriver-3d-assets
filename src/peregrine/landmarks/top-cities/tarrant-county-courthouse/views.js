// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// The front (south, Main Street side) faces bearing 150: south-south-east, so eye (+x,+z) looks at it.
export const VIEWS = {
  overview: [[75, 48, 115], [0, 22, 0]],
  facade: [[52, 12, 90], [0, 18, 0]],
  back: [[-30, 30, -110], [0, 22, 0]],
  roof: [[70, 85, 60], [0, 30, 0]],
  street: [[48, 3, 62], [0, 26, 4]],
  tower: [[14, 52, 30], [0, 48, 0]],
  dome: [[48, 38, 28], [26, 28, 0]],
};
