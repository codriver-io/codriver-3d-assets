// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. Keys used by the catalog record's inspection views.
export const VIEWS = {
  overview: [[-170, 90, 190], [0, 15, 5]],
  facade: [[150, 32, 40], [50, 12, -10]], // Bay Street limestone facade from across the road
  roof: [[10, 140, 80], [0, 25, 5]],
  plaza: [[-140, 22, 120], [-55, 14, 35]], // west front, video screen and sign from the plaza
  structure: [[60, 20, 190], [20, 12, 40]], // Lake Shore side and the rounded corner
  north: [[-30, 45, -150], [0, 14, -30]],
  detail: [[-96, 9, 62], [-58, 12, 42]],
};
