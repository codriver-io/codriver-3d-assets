// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). Origin: the 90 m tower head; the
// jumps run downhill to the north-north-east (toward -z), y = 0 is the K89 take-off ground.
export const VIEWS = {
  overview: [[260, 80, -300], [30, 35, -50]],     // from the north-east, as from the Trans-Canada Highway near Canada Olympic Drive
  facade: [[-170, 50, -50], [10, 45, -50]],      // west elevation: the 90 m tower's rings and the inrun profiles
  roof: [[70, 170, 40], [0, 70, -10]],           // above the tower head: roof, mast, start gate
  highway: [[300, 8, -420], [20, 40, -50]],      // low, from the north-east (the highway side): the silhouette against the sky
  inruns: [[60, 30, -150], [-5, 25, -70]],       // the K114 and K89 girders, the piers and the trestle bents
  takeoff: [[35, 14, -150], [5, 6, -110]],       // the K114 and K89 take-off tables
  tower: [[-45, 70, -30], [0, 70, 0]],           // close on the 90 m head from the north-west (photograph 5's side)
  training: [[150, 40, -90], [75, 30, -5]],      // the K63 tower and inrun and the K38 beside it
  back: [[40, 60, 160], [20, 45, -40]],          // from the south (uphill), the lift core
};
