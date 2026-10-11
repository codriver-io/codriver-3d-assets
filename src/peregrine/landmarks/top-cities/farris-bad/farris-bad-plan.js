// Measured from the SW and SE corners of OSM way 219135154.
// Local design u runs ENE along the sea wing; v runs SSE (sea is v=0).
export const ORIGIN = [10.02005885762306, 59.049466806678204];
export const SW = [10.019887, 59.049033];
export const U = [0.869222291484045, -0.4944214881932478];
export const V = [0.4944214881932478, 0.869222291484045];
const m = 111319.49079327358, k = Math.cos(ORIGIN[1] * Math.PI / 180);
const base = [(SW[0] - ORIGIN[0]) * m * k, -(SW[1] - ORIGIN[1]) * m];
export const ANGLE = Math.atan2(-U[1], U[0]);
export const WIDTH = 66.1944;
export const SOFFIT = 7.4;
export const ROOF = 14.6;
export const HEIGHT = 17.8;
export const PIER = [8, -8];
export const CLEAR_SPAN = 24;
export function place(u, y, v) { return [base[0] + U[0]*u + V[0]*v, y, base[1] + U[1]*u + V[1]*v]; }
export function geographic(u, v) {
  const p = place(u, 0, v);
  return [ORIGIN[0] + p[0]/(m*k), ORIGIN[1] - p[2]/m];
}
export function local(lng, lat) {
  const x = (lng - SW[0])*m*k, z = -(lat - SW[1])*m;
  return [x*U[0] + z*U[1], x*V[0] + z*V[1]];
}
// Smooth the mapped east sawtooth into the wall behind its balcony screens.
export const OUTER = [[4.5,-80.05],[-7.6,-80.05],[-7.6,-65.85],[-6.15,-65.85],[-6.15,-57.65],[0.1,-57.65],[0.1,-0.1],[66.1,-0.1],[66.1,-72.25],[45.7,-72.25],[45.7,-69.25],[31.5,-69.25],[31.5,-71.6],[26.8,-71.6],[26.8,-69.2],[16.9,-69.2],[16.9,-75.1],[4.5,-75.1]];
export const INNER = [[48,-50.4],[44.9,-50.4],[44.6,-15.95],[11.95,-15.95],[11.95,-23],[16.5,-23],[16.4,-62.65],[18.05,-62.65],[18.2,-59.45],[48,-59.45]];
