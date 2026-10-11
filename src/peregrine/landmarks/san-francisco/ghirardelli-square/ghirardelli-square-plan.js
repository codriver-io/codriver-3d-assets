// Plan of the Ghirardelli Square complex, in metres from SPEC.origin. Authored in two grids because
// OpenStreetMap maps two orientations:
//   G  the street grid north of Market: u runs along Beach / North Point St at bearing 80.6 deg (so u is
//      9.4 deg anticlockwise of east, as seen from above), v runs "south" along Larkin / Polk St at 170.6 deg.
//      Measured from the long edges of the mapped Cocoa, Mustard, Clock Tower, Wurster, Plaza and Apartment
//      outlines (all within 0.3 deg of each other).
//   W  the old Pioneer Woolen Mill block: its mapped walls run at bearing 94.7 deg, 14.1 deg off the grid.
// A rectangle is [u0, u1, v0, v1]. Each one sits inside the OSM building way it is named after (ways in
// footprint.js); jogs under about 1 m are left to the cornices. Frame +u = east-ish, +v = south-ish.
const D = Math.PI / 180;
export const THETA = { G: 9.4 * D, W: -4.7 * D };
// rotateY(theta) turns a local +u into (cos, -sin) in (x, z); see ghirardelli-square-kit.js.

export const RECT = {
  chocolate: [-57.70, -41.90, 7.99, 42.09],
  cocoa: [-41.90, 4.20, 20.39, 42.04],
  cocoaNW: [-41.90, -38.50, 12.09, 20.39],
  mustard: [4.20, 44.10, 24.49, 41.89],
  mustardBay: [20.30, 24.80, 21.89, 24.49],
  mustardLink: [44.10, 46.70, 25.89, 39.99],
  clockWing: [46.70, 63.40, 16.29, 41.59],
  clockAnnex: [46.70, 54.70, 12.39, 16.29],
  tower: [57.70, 64.00, 36.09, 42.39],
  apartment: [50.10, 67.50, -9.00, 4.49],
  carouselA: [51.60, 67.60, -14.80, -9.00],
  carouselB: [57.90, 67.70, -30.80, -14.80],
  plazaA: [-6.20, 30.00, -16.51, -5.11],
  plazaB: [-6.30, 4.90, -22.01, -16.51],
  plazaC: [13.20, 17.10, -20.71, -16.51],
  plazaD: [23.70, 30.90, -22.15, -18.31],
  infillA: [-13.80, 10.60, 7.89, 14.09],
  infillB: [-13.80, 13.60, 5.29, 7.89],
  canopy: [3.20, 13.60, -5.01, 4.09],
  wursterStrip: [5.50, 51.40, -43.21, -22.51],
  wursterWing: [-13.30, 5.50, -41.31, -24.21],
  powerA: [-57.20, -29.60, -41.71, -26.31],
  powerB: [-29.60, -20.90, -41.71, -34.01],
  millLink: [-57.30, -42.30, -4.81, 7.99],
  woolenMill: [-58.68, -15.48, -10.98, 5.22], // W grid
  woolenBump: [-34.38, -23.98, -15.08, -10.98], // W grid
};
export const GAZEBO = { u: 39.10, v: 14.39, r: 4.0 };

// Heights above local grade y = 0 (m). OSM: Cocoa and Chocolate 22 m (5 levels); Mustard, Clock Tower
// Building, Woolen Mill carry height=10 / 3 levels, which photographs show is a low estimate (three tall
// factory storeys plus a parapet); the rest carry only levels. Everything else is estimated from photographs.
export const H = {
  chocolate: 22, cocoa: 22, mustard: 12.6, clockWing: 13.4, clockAnnex: 4.5, apartment: 11, carousel: 8,
  plaza: 4.6, infill: 5.0, power: 7.5, millLink: 9, woolen: 12.5, wurster: 8.0, wursterRise: 3.0,
};

// The rooftop sign: 152 ft x 19 ft (46.3 m x 5.8 m), one-sided now, facing the bay (north, -v). It reads
// left to right as seen from the bay, i.e. from +u (east, the Larkin St end) to -u, and stands on a steel
// frame over the Mustard and Cocoa roofs. The Mustard roof deck is y ~ 12.0, the Cocoa one y ~ 21.4.
export const SIGN = {
  uStart: 30.2, // left edge of the G (u of the first letter's left edge)
  width: 46.3, height: 5.8, // sourced: 152 ft x 19 ft
  v: 28.5, // letter plane (front face at v - 0.3)
  baseline: 24.8, // bottom of the letters
  frameDepth: 3.6, frameTop: 31.1,
};

export const TOP = 34.5; // finial of the clock tower
