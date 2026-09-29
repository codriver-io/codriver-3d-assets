// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. The wedge is 40 m long, its rounded apex and turret
// at the east end (bearing ~64 deg, toward Church St), 26 m to the finial.
export const VIEWS = {
  overview: [[58, 36, 58], [2, 9, 0]], // from the south-east, above Front St
  facade: [[28, 9.5, 37], [4, 9.5, 2]], // the south (Front St) elevation
  roof: [[10, 62, 20], [2, 18, 0]], // from above: mansard, dormers, turret
  structure: [[-42, 16, -34], [2, 9, 0]], // from the north-west: Wellington St elevation and the west end
  apex: [[48, 12, -26], [20, 12, -9.4]], // the apex bows and turret, head on from Church St
  turret: [[34, 22.5, -19], [20, 21.5, -9.4]], // close on the copper cone and turret windows
  west: [[-46, 12, 28], [-12, 10, 6]], // the west end and both long elevations receding
  street: [[40, 1.7, -14], [8, 9, 0]], // eye height on Wellington/Church, looking west
};
