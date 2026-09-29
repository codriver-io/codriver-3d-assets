import { ROOF } from './rogers-centre-site.js';

// The closed roof as a height field. Kept apart from geometry.js so the tests can ask
// "how high is the roof here" without building a mesh.
const { R, crown, crownV, spring, hotelSpring, k, seams, laps } = ROOF;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (t) => t * t * (3 - 2 * t);

/** Half width of the roof circle at v. */
export const halfWidth = (v) => Math.sqrt(Math.max(0, R * R - v * v));

/** Height of the roof edge at the circle point (u, v). The north end stands on the hotel
 *  terraces, so the edge rises there. */
export function springAt(u, v) {
  if (v >= -20) return spring;
  const phi = Math.atan2(Math.abs(u), -v) * 180 / Math.PI; // degrees from the stadium's north axis
  const w = 1 - smooth(clamp((phi - 24) / (80 - 24)));
  return spring + (hotelSpring - spring) * w;
}

const gShape = (rn) => (1 - Math.sqrt(1 - k * rn * rn)) / (1 - Math.sqrt(1 - k));

/** The unlapped dome surface: { h, edge } where edge is the springing height under the
 *  ray from the crown through (u, v). */
export function dome(u, v) {
  const dv = v - crownV, d = Math.hypot(u, dv);
  if (d < 1e-6) return { h: crown, edge: springAt(0, crownV - R) };
  const ux = u / d, uy = dv / d;
  // distance from the crown to the circle along this ray: |c + rho * dir| = R
  const cu = crownV * uy;
  const rho = -cu + Math.sqrt(cu * cu + R * R - crownV * crownV);
  const rn = Math.min(1, d / rho);
  const edge = springAt(ux * rho, crownV + uy * rho);
  return { h: crown - (crown - edge) * gShape(rn), edge };
}

/** Which panel owns v: 0 north cap, 1 arch 2, 2 arch 3, 3 south cap. */
export const panelAt = (v) => (v < seams[0] ? 0 : v < seams[1] ? 1 : v < seams[2] ? 2 : 3);

/** Roof surface height at (u, v): the dome plus the panel's lap, fading to nothing at the
 *  edge so every panel lands on the same springing line. */
export function roofHeight(u, v, panel = panelAt(v)) {
  const { h, edge } = dome(u, v);
  return h + laps[panel] * clamp((h - edge) / 14);
}
