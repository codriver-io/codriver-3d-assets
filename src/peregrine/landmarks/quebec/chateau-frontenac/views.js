// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south). Each value is [eye, target].
// The terrace facade looks south-east (+X +Z); the tower stands behind its middle; Place d'Armes is to the north (-Z).
export const VIEWS = {
  overview: [[260, 150, 250], [0, 30, 0]],
  facade: [[110, 18, 230], [0, 30, 10]],
  roof: [[130, 230, 130], [0, 20, 0]],
  tower: [[120, 70, 120], [10, 55, -10]],
  terrace: [[170, 12, 40], [10, 28, -5]],
  river: [[520, 120, 560], [0, 35, 0]],
  court: [[-5, 90, 110], [-5, 15, -5]],
  north: [[-60, 35, -190], [10, 30, 0]],
  arcade: [[-62, 4, 92], [-48, 16, 40]],
  centre: [[48, 9, 110], [18, 30, 40]],
  east: [[150, 14, -50], [60, 18, -10]],
  corner: [[85, 35, 105], [40, 24, 38]],
};
