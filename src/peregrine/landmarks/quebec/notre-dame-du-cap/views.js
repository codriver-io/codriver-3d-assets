// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The model is turned onto the mapped axis
// (bearing 48 / 228 deg), so each eye is a building-frame position (u to the viewer's right in front of the portal, v toward the portal,
// from the octagon centre) rotated by the same angle and offset by the anchor.
const R = (-48 * Math.PI) / 180, c = Math.cos(R), s = Math.sin(R), A = [1.1, -0.8];
const g = (u, y, v) => [+(u * c + v * s + A[0]).toFixed(1), y, +(-u * s + v * c + A[1]).toFixed(1)]; // building frame -> local metres
export const VIEWS = {
  overview: [g(-70, 48, 110), g(0, 24, 8)],
  facade: [g(0, 9, 118), g(0, 26, 0)],
  street: [g(-6, 1.7, 84), g(0, 25, 0)],
  corner: [g(-34, 3, 72), g(4, 26, 16)],
  portal: [g(-18, 9, 74), g(0, 16, 40)],
  roof: [g(40, 118, 52), g(0, 44, 4)],
  lantern: [g(-22, 70, 34), g(0, 67, 0)],
  gallery: [g(38, 7, 62), g(26, 4, 33)],
  transept: [g(104, 20, 4), g(0, 20, 0)],
  back: [g(30, 40, -112), g(0, 24, 0)],
  top: [g(0, 190, 0.1), g(0, 0, 0)],
};
