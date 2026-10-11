// Nidaros Cathedral, authored along the mapped nave. +u runs toward the octagon (east, 1.892° north
// of true east), +v runs toward the south tower. y = 0 is the west-front pavement. geometry.js applies
// THETA once so the mesh sits on the OSM outline; the layer does not rotate it again.
// Length 102 m and width 50 m, nave 40 × 23 m with a 21 m vault, and the crossing tower with its
// spire at 87 m: Store norske leksikon (the 2016 remeasure; older guides said 91 m or about 97 m).
// Exterior eaves and ridges follow the OSM Simple 3D parts. The octagon's outer diameter is 18 m
// and its central room 10 m (SNL); the core drum is the mapped 12 m octagon.

export const THETA = 1.8919600621216686 * Math.PI / 180;

export const CROSS_TIP = 87;
export const SPIRE_APEX = 84; // copper; the cross carries the last 3 m to the surveyed 87 m
export const SPIRE = { u: 2.355, v: 0.74 };

// West screen outer face. The mapped west wall sits at u ≈ -47.41; keep stone west of -47.36 off it.
export const WEST = -47.28;
export const NAVE_V = 1.13;

export const NAVE = { u0: -46.08, u1: -4.48, v0: -5.15, v1: 7.41, eaves: 23, ridge: 35 };
export const N_AISLE = { u0: -39.52, u1: -4.72, v0: -11.46, v1: -5.22, yLow: 11.05, yHigh: 14.85 };
export const S_AISLE = { u0: -39.52, u1: -4.55, v0: 7.18, v1: 13.42, yLow: 11.05, yHigh: 14.85 };

export const N_TOWER = { u0: -47.22, u1: -39.70, v0: -17.43, v1: -9.41, shaft: 36, pin: 44 };
export const S_TOWER = { u0: -47.22, u1: -39.74, v0: 12.26, v1: 20.05, shaft: 36, pin: 44 };

export const CROSSING = { u0: -4.63, u1: 9.34, v0: -6.32, v1: 7.80, h: 38, pin: 48 };

export const N_TRANS = { u0: -4.48, u1: 9.18, v0: -22.40, v1: -6.20, eaves: 16, ridge: 26 };
export const S_TRANS = { u0: -4.22, u1: 10.02, v0: 7.58, v1: 24.30, eaves: 16, ridge: 26 };

export const CHOIR = { u0: 9.48, u1: 35.20, v0: -6.46, v1: 8.19, eaves: 22, ridge: 32 };
export const N_CHOIR = { u0: 9.28, u1: 35.05, v0: -9.15, v1: -6.28, yLow: 10.35, yHigh: 13.55 };
export const S_CHOIR = { u0: 9.52, u1: 35.22, v0: 7.95, v1: 11.85, yLow: 10.35, yHigh: 13.55 };

export const OCT = { u: 41.185, v: 0.60, flat: 5.85, wall: 18, peak: 36 };
export const AMB = { flat: 8.05, wall: 11.15, roof: 13.7 };

export const ROSE = { y: 20.55, v: NAVE_V, r: 3.28 };
export const PORTAL = { v: NAVE_V, y: 3.6 };

export const CHAPTER = { u0: 22.45, u1: 36.4, v0: -19.9, v1: -11.45, eaves: 8.2, ridge: 14 };
export const JOHANNES = { u0: 10.05, u1: 16.05, v0: 15.15, v1: 21.85, eaves: 10.2, ridge: 15 };
export const LECTORIUM = { u0: 9.35, u1: 15.25, v0: -19.85, v1: -12.95, eaves: 10.2, ridge: 15 };

export function toWorld(u, y, v) {
  const c = Math.cos(THETA), s = Math.sin(THETA);
  return [u * c + v * s, y, -u * s + v * c];
}
