// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// The pair sits astride the origin: west tower near (-32, 4), east near (23, -24).
export const VIEWS = {
  overview: [[140, 155, 300], [-5, 86, -10]],
  facade: [[-6, 35, 340], [-5, 85, -10]],
  roof: [[24, 255, 16], [-5, 160, -10]],
  parking: [[-8, 24, 52], [-32, 30, 4]],
  petals: [[12, 125, 46], [-6, 118, -6]],
  north: [[-34, 32, -125], [-32, 16, -30]],
};
