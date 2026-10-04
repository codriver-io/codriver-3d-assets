// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The model is turned 1.3 deg onto the nave axis,
// so these use plain east/south offsets from the origin (the outline centroid). The west front is at x = -41, the belfry at (-34, 6.5).
export const VIEWS = {
  overview: [[-95, 55, 95], [-5, 14, 0]],
  facade: [[-112, 20, 8], [-38, 22, -2]],
  street: [[-76, 1.7, -2], [-40, 22, -2]],
  roof: [[10, 78, 62], [-2, 14, 0]],
  tower: [[-72, 36, 36], [-34, 34, 6.5]],
  belfry: [[-64, 38, 30], [-34, 33, 6.5]],
  nave: [[-8, 14, 70], [-5, 11, 0]],
  east: [[75, 28, 52], [24, 10, 2]],
  back: [[60, 30, -60], [-10, 14, 0]],
};
