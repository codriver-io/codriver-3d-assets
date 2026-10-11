// Inspector cameras, [eye, target] in the model's metres (+X east, +Y up, +Z south). The convex face looks
// north-east; the concave, plaza face looks south-south-west (outward normal (-0.35, +0.94) at its middle).
export const VIEWS = {
  overview: [[250, 150, 300], [0, 112, 0]],
  facade: [[-20, 45, -330], [0, 115, 0]],
  concave: [[-95, 45, 215], [-4, 115, 4]],
  roof: [[150, 440, 170], [0, 225, 0]],
  plaza: [[-34, 3.5, 80], [0, 24, 14]],
  detail: [[72, 78, -100], [14, 62, -36]],
  street: [[-45, 1.7, -165], [0, 95, 0]],
  west: [[-175, 75, -75], [-30, 85, -5]],
  wing: [[125, 50, 125], [28, 70, 15]],
  skyline: [[-520, 110, 420], [0, 125, 0]],
};
