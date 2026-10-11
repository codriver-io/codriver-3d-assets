// Inspector cameras, [eye, target] in the model's metres (+X east, +Y up, +Z south).
export const VIEWS = {
  overview: [[300, 175, 340], [0, 118, 0]], // from the south-east, as from the Calgary Tower
  facade: [[15, 60, 420], [0, 124, 0]], // the south face and its two-storey lobby
  roof: [[75, 330, 95], [0, 236, 0]], // the crown seen from above
  crown: [[70, 262, 100], [0, 237, 0]], // the glass crown with its flared ribs and rim
  base: [[-110, 14, 125], [-35, 9, 5]], // lobby, belt cornice and the pavilion's south end
  street: [[48, 1.7, 80], [0, 105, 0]], // looking up at the south-east corner from 7 Avenue
  corner: [[170, 150, 170], [0, 120, 0]], // the rounded north-east / south-east corner at mid height
  pavilion: [[-120, 40, 95], [-45, 8, 10]], // the glass pavilion and its sloping roof
  skyline: [[-260, 120, 700], [0, 124, 0]], // a distant driver's view
};
