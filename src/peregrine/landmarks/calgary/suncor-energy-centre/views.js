// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// `overview` is the Calgary Tower deck (about 445 m south, 59 m east of the origin, 160 m up); `northeast` looks
// from the Bridgeland side. The towers' diagonal faces are at 48 and 228 degrees, so `diagonal` stands square to one.
export const VIEWS = {
  overview: [[60, 165, 445], [-10, 120, 0]],
  facade: [[-25, 45, 250], [-25, 105, 0]],
  roof: [[150, 330, 240], [-8, 150, 0]],
  northeast: [[800, 150, -800], [-10, 130, 0]],
  diagonal: [[-170, 60, 190], [-40, 110, 0]],
  east: [[330, 90, 20], [20, 90, 0]],
  street: [[-30, 2, 118], [-34, 75, 10]],
  west: [[-330, 100, 20], [-30, 105, 0]],
  crown: [[-130, 200, 120], [-50, 198, 10]],
  notch: [[-100, 70, -70], [-63, 62, -22]],
  base: [[5, 28, 85], [-8, 9, 12]],
};
