// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// Distances are set for shot.mjs's 40° frame so the 171 m shaft fits with the ball in view.
export const VIEWS = {
  overview: [[120, 158, 310], [0, 85, 0]], // postcard: eye at ball height, south-south-east
  facade: [[-120, 20, 300], [0, 100, 0]], // street level from the north-west, the other side
  roof: [[36, 214, 28], [0, 158, 0]], // down onto the crown and the upper cap
  ball: [[32, 152, 30], [0, 156, 0]], // the geodesic belt, deck ring and light nodes
  shafts: [[28, 132, 24], [2, 162, 0]], // photo angle: glass, slab edge and the open basket
  plan: [[52, 48, 52], [0, 4, 0]], // oblique over the feet so the red shaft rings show
};
