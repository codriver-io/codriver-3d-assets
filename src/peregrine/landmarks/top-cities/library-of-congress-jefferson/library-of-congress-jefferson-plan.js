// Thomas Jefferson Building, Library of Congress. Metres, before the baked yaw.
// +X east, +Z south, origin at the area centroid of OSM way 42363196.
//
// Sourced: dome raised to 195 ft (59.436 m) under Edward Pearce Casey and
// Bernard Green, copper, gilded until the 1930s; the Flame of Knowledge
// finial is still gold leaf (Wikipedia; Architect of the Capitol). The
// reading-room interior is cited at 160 ft to the lantern, which sits
// inside this exterior. Plan, storey heights, bay pitch and the stair run
// are estimated from the mapped outline and photographs.

export const ROTATION_DEG = 0.171; // south wall, eastward, 0.171° north of east
export const TIP = 195 * 0.3048;

export const DOME = { x: -22, z: 0 };

export const MAIN_Y = 22.55;
export const WEST = -48.75;
export const EAST = 45.15;
export const NORTH = -68.15;
export const SOUTH = 68.25;

// Two open light courts, north and south of the reading-room dome.
export const COURT_X0 = -35.7;
export const COURT_X1 = -8.3;
export const COURT_S = { z0: 18.2, z1: 51.75 };
export const COURT_N = { z0: -51.75, z1: -18.2 };

export const PORTICO = { xFace: -53.1, xBack: -46.15, z0: -16.5, z1: 16.5, y: 26.4 };
export const TERRACE_X = -54.55;
export const STAIR = { x0: -59.12, x1: -54.4, y: 5.4 };
export const RAMP_N = { z0: -15.4, z1: -5.45 };
export const RAMP_S = { z0: 5.45, z1: 15.4 };
export const ARCH_S = [-6.45, 0, 6.45];

// Semicircle of the Court of Neptune, opening west between the stair ramps.
// West rim = x - r, kept inside the mapped edge at the centre (~-59.5).
export const FOUNTAIN = { x: -54.85, z: 0, r: 4.15 };

export const PODIUM = { x0: -35.5, x1: -8.55, z0: -15.5, z1: 15.5, y0: 22.85, y1: 31.45 };
// Copper saucer tapers inward continuously from the stone cornice into the cupola.
// Estimated from the west elevation and Highsmith aerial, not a survey.
export const DOME_PROFILE = [
  [13.5, 41.05],
  [13.15, 42.15],
  [12.35, 43.85],
  [11.1, 45.2],
  [9.85, 46.25],
  [8.8, 46.95],
  [8.2, 47.32],
];

export function domeRadius(y) {
  const p = DOME_PROFILE;
  if (y <= p[0][1]) return p[0][0];
  for (let i = 1; i < p.length; i++) {
    if (y <= p[i][1]) {
      const t = (y - p[i - 1][1]) / (p[i][1] - p[i - 1][1]);
      return p[i - 1][0] + t * (p[i][0] - p[i - 1][0]);
    }
  }
  return p[p.length - 1][0];
}
