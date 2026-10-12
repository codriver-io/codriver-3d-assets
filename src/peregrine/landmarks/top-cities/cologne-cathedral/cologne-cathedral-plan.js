// Nave ridge control points: [6.9571403,50.9412942] → [6.9587959,50.9413224].
// +u is east along the nave; +v is south. Rotation is baked in geometry.js.
export const THETA = 0.0274;
export const VC = 8.35;
export const TOWERS = [{ u: -74, v: -8.2, tip: 157.18 }, { u: -74, v: 25.7, tip: 157.22 }];
export const BAYS = [-59, -51, -43, -35, 8, 16, 24];
export const CROSSING = { u: -8.8, v: VC, tip: 109.12 };
export const toWorld = (u, y, v) => [u * Math.cos(THETA) + v * Math.sin(THETA), y, -u * Math.sin(THETA) + v * Math.cos(THETA)];
export const toLocal = (x, y, z) => [x * Math.cos(THETA) - z * Math.sin(THETA), y, x * Math.sin(THETA) + z * Math.cos(THETA)];
