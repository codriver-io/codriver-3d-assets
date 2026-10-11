// Plan of the Palace of Fine Arts in local metres (+x east, +z south, origin = the centre of the
// rotunda dome), read from the OpenStreetMap ways listed in footprint.js (OSM map API, fetched
// 2026-10-01; (c) OpenStreetMap contributors, ODbL 1.0). Everything here is mapped data or a
// direct measurement of it; heights and details that OSM does not carry live in the builders.

// Compass geometry. The rotunda's eight arches face (math angle, counter-clockwise from east, north up)
// 10 deg + k*45 deg: the notch centres of OSM way 288371295 fold to 9.2 deg, the eight mapped piers
// (building:part=column, 36 m) sit at 32.5 deg + k*45 deg +- 4. The colonnade arms and the hall end
// blocks mirror each other about the same axis, so this is the building's own bearing, not a street grid.
export const AXIS_DEG = 10;

// ---- rotunda ------------------------------------------------------------------------------------
export const ROTUNDA = {
  apothem: 22.4,      // centre -> arch wall plane (the mapped notch backs: r = 22.2-22.8)
  domeR: 16.2,        // OSM dome part 456820271: a circle of 16.2 m radius at the origin
  height: 49.4,       // 162 ft (49 m): NRHP / Wikipedia; OSM says 48 (outline) and 51 (dome part)
};

// ---- exhibition hall ----------------------------------------------------------------------------
// A sector of a ring about C (the hall's arc is nearly concentric about a point east of the rotunda,
// on the lagoon side): at polar angle psi (deg, atan2(z, x) about C) the inner (concave, lagoon-facing)
// wall is at radius rIn and the outer (convex) wall at radius rOut. Sampled from the mapped outline
// (way 288371302) every 2.9 deg between the two end blocks. [psi, rIn, rOut]
export const HALL_C = [59, -12];
export const HALL_RADII = [
  [112.6, 115.1, 157.8], [115.5, 115.8, 158.1], [118.4, 116.0, 158.2], [121.3, 115.7, 157.9], [124.2, 115.5, 157.6],
  [127.1, 115.3, 157.5], [130.0, 115.1, 157.4], [132.9, 114.8, 157.2], [135.8, 114.5, 157.1], [138.7, 114.4, 156.8],
  [141.6, 114.1, 156.6], [144.5, 113.9, 156.5], [147.4, 113.8, 156.2], [150.3, 113.7, 156.1], [153.2, 113.4, 156.0],
  [156.1, 113.3, 156.0], [159.0, 113.0, 155.8], [161.9, 112.8, 155.5], [164.8, 112.7, 155.2], [167.7, 112.5, 155.2],
  [170.6, 112.4, 155.1], [173.5, 112.3, 155.0], [176.4, 112.3, 154.8], [179.3, 112.2, 154.8], [182.2, 112.0, 154.4],
  [185.1, 112.0, 154.3], [188.0, 111.9, 154.4], [190.9, 112.0, 154.1], [193.8, 112.1, 153.9], [196.7, 112.1, 153.8],
  [199.6, 111.6, 153.9], [202.5, 111.4, 153.8], [205.4, 111.5, 153.7], [208.3, 111.4, 153.8], [211.2, 111.6, 153.8],
  [214.1, 111.5, 153.7], [217.0, 111.7, 153.8], [219.9, 111.6, 153.8], [222.8, 111.8, 153.7], [225.7, 112.2, 153.6],
  [228.6, 111.5, 153.7],
];
// Eaves 12 m, ridge 15 m (OSM part 1550664400: height 15, roof:height 3, gabled); the central monitor
// (part 1550664399: height 17, roof:height 1) is a 7-8 m strip along the ridge.
export const HALL = { eaves: 12, ridge: 15, monitorWalls: 16, monitorTop: 17, endBlock: 17 };
// The monitor's outline (way 1550664399), local metres.
export const HALL_MONITOR = [
  [6.9, 111.6], [-2.9, 107], [-12.5, 100.9], [-21.4, 94.5], [-31.2, 85.7], [-41.2, 74.9], [-49, 64.6], [-56.9, 50.6],
  [-63.2, 35.8], [-67.3, 22], [-70.3, 7.2], [-71.4, -9.6], [-71.3, -24.7], [-67.1, -42.6], [-60.8, -58.9], [-52.4, -75.2],
  [-43.9, -89], [-34, -100.6], [-27.3, -107.4], [-32, -112.7], [-40.3, -104.9], [-50.2, -93.4], [-59.1, -79.5],
  [-68.3, -60.6], [-74.2, -43.7], [-77.6, -25.9], [-78.3, -9.4], [-77.4, 7.8], [-74.2, 23.3], [-69.7, 37.8],
  [-63.3, 54], [-56.2, 68.1], [-47, 81], [-35.2, 92.2], [-23.8, 102.3], [-15.5, 108.3], [-4.6, 114.1], [3.9, 118.4],
];
// The two end blocks (parts 1550664397 / 1550664401, 17 m): radial wings across the hall's width.
// Minimum-area rectangles of the mapped outlines: centre, size along the tangent (thin) and along the radius (long), yaw.
export const HALL_ENDS = [
  { c: [10.0, 115.5], thin: 10.8, long: 42.9, deg: 22.0 },
  { c: [-26.3, -113.6], thin: 11.2, long: 42.2, deg: 138.5 },
];

// ---- colonnades ---------------------------------------------------------------------------------
// Each arm is a single row of columns under one continuous entablature 3.0-3.1 m wide (the mapped strip,
// OSM ways 288371306 / 288371310), with a round drum at the rotunda end, wider pylons every ~22 m, a
// turn and a straight return, and a big end pylon. `path` is the mapped strip's centreline, `drum`
// its round start, `pylons` the mapped bulges (centre, size along the path, across it, kind).
export const ARMS = [
  {
    id: 'north',
    drum: [-33.8, -24.2],
    path: [
      [-33.8, -24.2], [-32.6, -30.4], [-32.0, -33.0], [-31.3, -35.6], [-30.5, -38.2], [-29.7, -40.8], [-28.8, -43.3],
      [-27.7, -45.7], [-26.6, -48.2], [-25.7, -50.7], [-24.7, -53.2], [-23.4, -55.6], [-22.1, -57.9], [-20.8, -60.3],
      [-19.3, -62.5], [-17.6, -64.5], [-15.9, -66.6], [-14.6, -69.0], [-12.8, -71.0], [-10.9, -73.0], [-8.8, -74.8],
      [-6.7, -76.4], [-4.4, -77.9], [-0.5, -79.3], [2.0, -79.8], [6.0, -80.3], [10.5, -81.0], [13.0, -81.4],
      [17.2, -82.8], [16.4, -87.9], [15.7, -93.5], [14.8, -100.0], [14.2, -104.0], [13.9, -109.2],
    ],
    pylons: [
      { at: [-27.0, -47.2], along: 4.6, across: 6.8, kind: 'bump' },
      { at: [-17.0, -66.0], along: 5.0, across: 6.9, kind: 'bump' },
      { at: [2.0, -79.6], along: 6.0, across: 11.0, kind: 'cross' },
      { at: [17.2, -82.8], along: 7.2, across: 9.0, kind: 'corner' },
      { at: [13.9, -109.2], along: 7.6, across: 9.2, kind: 'end' },
    ],
  },
  {
    id: 'south',
    drum: [-25.5, 31.9],
    path: [
      [-25.5, 31.9], [-23.5, 35.4], [-21.6, 39.0], [-20.1, 41.5], [-18.5, 43.9], [-16.8, 46.3], [-15.1, 48.7], [-13.2, 50.9],
      [-11.0, 53.4], [-9.3, 55.4], [-7.4, 57.5], [-5.3, 59.5], [-3.2, 61.6], [-1.0, 63.6], [1.3, 65.4], [5.0, 68.4],
      [8.5, 70.5], [11.1, 71.9], [13.8, 73.1], [16.5, 74.2], [19.3, 75.1], [23.3, 76.3], [27.0, 76.2], [31.0, 74.2],
      [35.1, 73.6], [38.8, 72.4], [43.2, 73.6], [43.4, 78.5], [43.7, 83.2], [44.4, 86.7], [45.0, 90.0], [45.7, 94.0], [47.5, 99.0],
    ],
    pylons: [
      { at: [-23.5, 35.4], along: 4.6, across: 7.0, kind: 'bump' },
      { at: [-11.0, 53.4], along: 4.8, across: 6.6, kind: 'bump' },
      { at: [5.0, 68.4], along: 5.0, across: 6.6, kind: 'bump' },
      { at: [27.0, 76.2], along: 6.0, across: 11.5, kind: 'cross' },
      { at: [43.2, 73.6], along: 7.0, across: 8.6, kind: 'corner' },
      { at: [47.5, 99.0], along: 7.6, across: 9.2, kind: 'end' },
    ],
  },
];
// The two detached cross-shaped pylons beside the colonnade ends (OSM roofs 288371313 / 288371314, 21 m).
export const FREE_PYLONS = [
  { at: [-2.5, -105.4], size: 7.4, deg: 100 },
  { at: [30.5, 101.1], size: 7.4, deg: 100 },
];
