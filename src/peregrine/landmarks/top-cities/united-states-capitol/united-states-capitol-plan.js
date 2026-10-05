// Metres in building axes: +X east (East Front), +Y up, +Z south (House wing).
// The dome sits west of the outline centroid because the 1958–62 east extension
// shifted the footprint east of Walter's rotunda.

export const ROT = -0.12 * Math.PI / 180;
export const DX = -6.1;
export const DZ = 0.85;
export const TIP = 87.78; // 288 ft

// Vertical anchors. 24.2 m is the OSM wing height; 64.01 m is the tholos balcony
// (210 ft); 76.2 m and 81.84 m split the 18.5 ft pedestal from the 19.5 ft statue.
export const Y = {
  base: 5.5,
  col0: 5.72,
  col1: 18.35,
  entab: 21.65,
  apex: 25.85,
  endApex: 23.7,
  corn0: 22.45,
  corn1: 24.28,
  parapet: 26.4,
  wall: 24.2,
  balcony: 64.01,
  pedestal: 76.2,
  figure: 81.84,
};

// Outer dome radius at the colonnade cornice: 135 ft / 2.
export const DOME_R = 20.574;

// 36 peristyle columns, 10 degrees apart (Architect of the Capitol).
export const PERISTYLE = 36;
// East portico: 8 across the front and 7 along each return, the front corners counted once = 22.
export const EAST_FRONT = 8;
export const EAST_RETURN = 7;
export const WEST_FRONT = 10;
export const END_FRONT = 8;
export const THOLOS = 12;

// Outer shell, springing just above the attic and closing on the tholos balcony.
// Estimated between the 135 ft exterior diameter and the 210 ft balcony.
export const DOME_PROFILE = [
  [15.0, 51.4], [14.8, 54.0], [14.05, 57.0], [12.8, 59.5],
  [10.6, 61.7], [8.4, 63.1], [6.05, 64.4],
];

export function domeRadius(y) {
  const p = DOME_PROFILE;
  if (y <= p[0][1]) return p[0][0];
  if (y >= p[p.length - 1][1]) return p[p.length - 1][0];
  for (let i = 1; i < p.length; i++) {
    if (y <= p[i][1]) {
      const t = (y - p[i - 1][1]) / (p[i][1] - p[i - 1][1]);
      return p[i - 1][0] + t * (p[i][0] - p[i - 1][0]);
    }
  }
  return p[p.length - 1][0];
}
