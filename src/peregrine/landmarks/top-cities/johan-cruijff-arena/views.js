// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// The front (entrance pod, logo box) faces the WSW; the long axis runs 151 degrees.
export const VIEWS = {
  overview: [[-215, 125, 120], [0, 30, -5]],
  facade: [[-190, 28, 105], [0, 24, 0]],
  back: [[190, 85, -105], [0, 34, 0]],
  roof: [[-30, 250, 45], [0, 50, 0]],
  street: [[-125, 5, 65], [-40, 22, 0]],
  detail: [[-120, 85, 60], [-20, 55, 0]],
  end: [[110, 70, 230], [0, 32, 0]],
  plan: [[0, 380, 1], [0, 0, 0]],
};
