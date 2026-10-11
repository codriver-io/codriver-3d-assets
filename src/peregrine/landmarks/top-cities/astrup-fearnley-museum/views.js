// Inspector cameras, [eye, target] in model metres (+X east, +Y up, +Z south).
// Facade looks northeast along the canal, the way the glass gables are seen
// from the Tjuvholmen promenade. Water is the fjord side.
export const VIEWS = {
  overview: [[78, 36, 86], [2, 10, 4]],
  facade: [[48, 9, -58], [6, 12, -8]],
  roof: [[8, 110, 6], [2, 0, 2]],
  water: [[70, 14, 78], [-4, 9, 8]],
  canal: [[36, 7, -28], [2, 10, 4]],
  entrance: [[22, 5, -8], [8, 6, 8]],
  park: [[-48, 8, 72], [-18, 6, 28]],
  detail: [[32, 12, -22], [18, 18, -24]],
};
