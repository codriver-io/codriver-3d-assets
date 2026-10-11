// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south, origin = area centroid of the OSM
// outline). Each value is [eye, target]. The cedar arch (the entrance) faces west-south-west; the CTrain tunnel mouth
// opens beneath the north prow, which points to -Z.
export const VIEWS = {
  overview: [[-120, 70, 125], [0, 9, 5]],
  facade: [[-95, 14, 70], [-12, 9, 25]],
  roof: [[40, 95, 55], [0, 20, 0]],
  arch: [[-50, 1.7, 52], [-14, 7, 28]],
  vault: [[-34, 2, 8], [-12, 6.5, 24]],
  portal: [[-40, 2, -100], [-9, 5, -72]],
  street: [[-75, 2.5, 105], [-5, 10, 45]],
  east: [[110, 16, -20], [8, 10, 0]],
  north: [[45, 22, -150], [0, 10, -40]],
  plan: [[0, 230, 0], [0, 0, 0]],
};
