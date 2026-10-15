import { FOOTPRINTS } from './footprint.js';
// Complete permanent Nashville replica (exterior 1925; museum completed 1931).
export const SPEC = {
  id: 'parthenon-nashville', name: 'The Parthenon (Nashville)', kind: 'building', ready: true,
  origin: [-86.8133823, 36.149715775], height: 19.812, padM: 42,
  frontageBearing: 56.2959633663, rotation: 0.5882464104707473,
  baseLength: 72.5424, baseWidth: 33.8328,
  stylobateLength: 69.4944, stylobateWidth: 30.7848,
  platformY: 1.8, columnHeight: 10.3632, columnDiameter: 1.8288,
  // Rigid bounded foundation; park, paths and Lake Watauga are outside ownership.
  terrainPad: { rings: FOOTPRINTS, refs: [[-86.8133823,36.149715775],[-86.813121,36.149854],[-86.813645,36.149577]], datum: 'median', featherM: 3 },
};
export const PALETTES = {
  light: { aggregate: '#d2c4ad', recess: '#746752', bronze: '#77705b' },
  dark: { aggregate: '#908878', recess: '#454841', bronze: '#343d39' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 at bottom of lowest crepidoma step; rigid local metres, no terrain or absolute altitude baked into geometry.',
  attribution: 'Original procedural geometry by Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Complete roofed concrete Nashville replica, not Athens ruins. 65ft apex, 238×111ft bottom step, 228×101ft stylobate and 34ft perimeter columns from former director B. F. Wilson; 46-column peristyle confirmed by museum. Bearing from OSM way 130913355 baked once. Pediment figures, tile spacing, entablature levels and acroteria are simplified estimates; optical curvature, interiors, park/lake and museum basement are omitted. Cityscape and Full 3D world integration not tested yet.',
};
