// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The tower is about
// 78 x 52 m with its long axis east-north-east; the crown roof is 237 m, the hall on the east side 11.5 m.
export const VIEWS = {
  overview: [[250, 150, 330], [0, 115, 0]],
  facade: [[-40, 12, 190], [0, 90, 0]], // south face, street level, looking up the sawtooth ribbing
  roof: [[130, 330, 130], [0, 215, 0]], // the stepped cutouts, ledges and crown from above
  cutouts: [[-135, 205, 200], [0, 200, 0]], // the stepped top at eye level with the ledges
  north: [[40, 80, -330], [0, 140, 0]], // the California Street face
  hall: [[110, 20, 60], [30, 8, -4]], // the low pavilion east of the tower
};
