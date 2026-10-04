// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The tower's centre is the origin and its entrance face looks
// north-north-west (toward -x, -z); the base wings lie to the east and south-east.
export const VIEWS = {
  overview: [[200, 140, 300], [20, 55, 10]],
  facade: [[-75, 30, -135], [-12, 75, -21]],
  roof: [[70, 230, 90], [0, 134, 0]],
  base: [[95, 60, 200], [60, 8, 30]],
  crown: [[-60, 150, 60], [0, 136, 0]],
  street: [[-29, 3, -52], [-12, 60, -21]],
  corner: [[-97, 30, -30], [-30, 70, -10]],
  east: [[115, 40, -65], [10, 70, -5]],
  south: [[25, 4, 200], [0, 65, 0]],
  approach: [[-195, 6, -349], [0, 70, 0]],
  river: [[400, 130, 700], [0, 80, 0]],
};
