// Plan data for Old City Hall in building coordinates: u along Queen St (bearing
// 73.25 deg), v into the building toward Albert St, metres from the footprint
// centroid. Every number below is read off OSM relation 3116 (outer way
// 12906398) and rounded to 0.1 m, except heights, which are estimates.
// Storeys: rusticated base to 5.8 m, then three floors, cornice at ~25 m.

export const Y = { base: 0.9, l0: 5.8, l1: 12.2, l2: 18.2, l3: 24.0 }; // string-course heights
export const EAVE = 25.0, PAV_EAVE = 26.4, CENTRE_EAVE = 26.0;
export const WING_RISE = { S: 15.2, N: 10.6, W: 15.6, E: 15.6 }; // wing roofs, ~52 degrees
export const PAV_RISE = 20.0; // pavilion hips, ~66 degrees: they stand well above the wings

// Solid masses [name, u0, u1, v0, v1, top]. They tile the plan; the courtyard
// (u -15.7..15.7, v -13.4..24.9 less its north-east corner) is left open.
export const MASSES = [
  ['SW pavilion', -44.0, -27.3, -41.1, -21.6, PAV_EAVE],
  ['SE pavilion', 27.7, 43.8, -41.7, -21.8, PAV_EAVE],
  ['NW pavilion', -43.9, -27.5, 25.6, 44.5, PAV_EAVE],
  ['NE pavilion', 27.7, 44.2, 24.9, 44.0, PAV_EAVE],
  ['south wing', -27.3, 27.7, -37.7, -13.4, EAVE],
  ['tower shoulder', -15.3, -10.7, -43.3, -37.7, EAVE],
  ['north wing', -27.5, 27.7, 24.9, 41.6, EAVE],
  ['north centre bay', -8.8, 8.8, 41.6, 44.9, CENTRE_EAVE],
  ['west wing', -40.4, -15.7, -21.6, 25.6, EAVE],
  ['west centre bay', -43.5, -40.4, -10.3, 14.0, CENTRE_EAVE],
  ['east wing', 15.7, 40.4, -21.8, 25.0, EAVE],
  ['east centre bay', 40.4, 43.3, -9.9, 14.0, CENTRE_EAVE],
];

// Facade walls. side = the way the wall faces in building axes (S = toward
// Queen St, N = Albert St, W = Bay St, E = James St); plane = v (S/N) or u (E/W)
// of the wall; range = [u0,u1] (S/N) or [v0,v1] (E/W); top = wall height.
// kind: pavilion | bay | centre | narrow | return (return: bands only).
export const WALLS = [
  { id: 'S-SW', side: 'S', plane: -41.1, range: [-44.0, -27.3], top: PAV_EAVE, kind: 'pavilion' },
  { id: 'S-bay-w', side: 'S', plane: -37.7, range: [-27.3, -15.3], top: EAVE, kind: 'bay' },
  { id: 'S-shoulder', side: 'S', plane: -43.3, range: [-15.3, -10.7], top: EAVE, kind: 'narrow' },
  { id: 'S-above-porch', side: 'S', plane: -37.7, range: [1.6, 13.8], top: EAVE, kind: 'bay', yMin: 10.2 },
  { id: 'S-bay-e', side: 'S', plane: -37.7, range: [15.7, 27.7], top: EAVE, kind: 'bay' },
  { id: 'S-SE', side: 'S', plane: -41.7, range: [27.7, 43.8], top: PAV_EAVE, kind: 'pavilion' },
  { id: 'W-SW', side: 'W', plane: -44.0, range: [-41.1, -21.6], top: PAV_EAVE, kind: 'pavilion' },
  { id: 'W-recess-s', side: 'W', plane: -40.4, range: [-21.6, -10.3], top: EAVE, kind: 'bay' },
  { id: 'W-centre', side: 'W', plane: -43.5, range: [-10.3, 14.0], top: CENTRE_EAVE, kind: 'centre' },
  { id: 'W-recess-n', side: 'W', plane: -40.4, range: [14.0, 25.6], top: EAVE, kind: 'bay' },
  { id: 'W-NW', side: 'W', plane: -43.9, range: [25.6, 44.5], top: PAV_EAVE, kind: 'pavilion' },
  { id: 'N-NW', side: 'N', plane: 44.5, range: [-43.9, -27.5], top: PAV_EAVE, kind: 'pavilion' },
  { id: 'N-bay-w', side: 'N', plane: 41.6, range: [-27.5, -8.8], top: EAVE, kind: 'bay' },
  { id: 'N-centre', side: 'N', plane: 44.9, range: [-8.8, 8.8], top: CENTRE_EAVE, kind: 'centre' },
  { id: 'N-bay-e', side: 'N', plane: 41.6, range: [8.8, 27.7], top: EAVE, kind: 'bay' },
  { id: 'N-NE', side: 'N', plane: 44.0, range: [27.7, 44.2], top: PAV_EAVE, kind: 'pavilion' },
  { id: 'E-NE', side: 'E', plane: 44.2, range: [24.9, 44.0], top: PAV_EAVE, kind: 'pavilion' },
  { id: 'E-recess-n', side: 'E', plane: 40.4, range: [14.0, 24.9], top: EAVE, kind: 'bay' },
  { id: 'E-centre', side: 'E', plane: 43.3, range: [-9.9, 14.0], top: CENTRE_EAVE, kind: 'centre' },
  { id: 'E-recess-s', side: 'E', plane: 40.4, range: [-21.8, -9.9], top: EAVE, kind: 'bay' },
  { id: 'E-SE', side: 'E', plane: 43.8, range: [-41.7, -21.8], top: PAV_EAVE, kind: 'pavilion' },
  // Short returns of the pavilions and central bays: string courses and cornice only.
  { id: 'r-SW-e', side: 'E', plane: -27.3, range: [-41.1, -37.7], top: PAV_EAVE, kind: 'return' },
  { id: 'r-SW-n', side: 'N', plane: -21.6, range: [-44.0, -40.4], top: PAV_EAVE, kind: 'return' },
  { id: 'r-SE-w', side: 'W', plane: 27.7, range: [-41.7, -37.7], top: PAV_EAVE, kind: 'return' },
  { id: 'r-SE-n', side: 'N', plane: -21.8, range: [40.4, 43.8], top: PAV_EAVE, kind: 'return' },
  { id: 'r-NW-s', side: 'S', plane: 25.6, range: [-43.9, -40.4], top: PAV_EAVE, kind: 'return' },
  { id: 'r-NW-e', side: 'E', plane: -27.5, range: [41.6, 44.5], top: PAV_EAVE, kind: 'return' },
  { id: 'r-NE-s', side: 'S', plane: 24.9, range: [40.4, 44.2], top: PAV_EAVE, kind: 'return' },
  { id: 'r-NE-w', side: 'W', plane: 27.7, range: [41.6, 44.0], top: PAV_EAVE, kind: 'return' },
  { id: 'r-Wc-s', side: 'S', plane: -10.3, range: [-43.5, -40.4], top: CENTRE_EAVE, kind: 'return' },
  { id: 'r-Wc-n', side: 'N', plane: 14.0, range: [-43.5, -40.4], top: CENTRE_EAVE, kind: 'return' },
  { id: 'r-Ec-s', side: 'S', plane: -9.9, range: [40.4, 43.3], top: CENTRE_EAVE, kind: 'return' },
  { id: 'r-Ec-n', side: 'N', plane: 14.0, range: [40.4, 43.3], top: CENTRE_EAVE, kind: 'return' },
  { id: 'r-Nc-w', side: 'W', plane: -8.8, range: [41.6, 44.9], top: CENTRE_EAVE, kind: 'return' },
  { id: 'r-Nc-e', side: 'E', plane: 8.8, range: [41.6, 44.9], top: CENTRE_EAVE, kind: 'return' },
  { id: 'r-shoulder-w', side: 'W', plane: -15.3, range: [-43.3, -37.7], top: EAVE, kind: 'return' },
];

// The clock tower: a 12.3 x 11.5 m base (mapped) under an 11 m shaft.
export const TOWER = { u: -4.55, v: -43.45, baseU: 6.15, baseV: 5.75, half: 5.5, top: 103.64 };
// The porch of three portals, flush with the tower's face, east of it.
export const PORCH = { u0: 1.6, u1: 13.8, v0: -49.2, v1: -37.7, top: 9.6, arch: 3.1, pier: 1.0, springY: 4.1 };
// The narrow round turret at the porch's east end (mapped arc, radius ~2.6 m).
export const TURRET = { u: 13.0, v: -40.5, r: 2.6, drumTop: 21.4, roofTop: 31.0 };

export const wallSpan = (w) => {
  const [a, b] = w.range;
  return w.side === 'S' ? [a, b] : w.side === 'N' ? [-b, -a] : w.side === 'E' ? [a, b] : [-b, -a];
}; // range in wall-local s
