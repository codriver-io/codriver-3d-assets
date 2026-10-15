import { ORIGIN, BEARING, LENGTH, PIERS, STAIRS, point, geographic } from './bridge-of-peace-tbilisi-parts.js';
// Bridge of Peace, Tbilisi (Michele De Lucchi / Philippe Martinaud, 2010): original model of the glazed, wave-ribbed canopy over the Kura footbridge.
const disc = (p, r, n = 10) => Array.from({ length: n + 1 }, (_, i) => geographic(p[0] + r * Math.cos(i * 2 * Math.PI / n), p[2] + r * Math.sin(i * 2 * Math.PI / n)));
const pierFeet = PIERS.flatMap((s) => [-1, 1].flatMap((k) => [-1, 1].map((side) => point(s + k * 3.4, side * 5.1, 0))));
const grade = [point(1, 0, 0), point(LENGTH - 1, 0, 0), ...STAIRS.map((st) => [st.foot[0], 0, st.foot[1]])];
export const SPEC = {
  id: 'bridge-of-peace-tbilisi', name: 'Bridge of Peace', kind: 'bridge', ready: true,
  origin: ORIGIN, height: 20.6, padM: 110, frontageBearing: BEARING,
  // Free-standing footbridge: the deck sits on flat-map grade at both landings and the stair feet; small pads under each foot.
  terrainPad: { rings: [...grade, ...pierFeet].map((p) => disc(p, 3.2)), refs: grade.map((p) => geographic(p[0], p[2])), datum: 'median', featherM: 4 },
};
export const PALETTES = {
  light: { steel: '#e7e8e2', tube: '#e7e8e2', deck: '#d9dbd6', walk: '#a3a6a2', stair: '#bcbeb8', glass: '#a5c9c6', rail: '#7e8a8d', glow: '#dfeae6', lamp: '#fff1cd' },
  dark: { steel: '#a5acae', tube: '#a5acae', deck: '#7f898e', walk: '#565e64', stair: '#6c757b', glass: '#3f6b6c', rail: '#9aa8ae', glow: '#6fe8b6', lamp: '#ffdc94' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0 at both landings and the stair feet; the deck stands 5.6 m above it mid-river (estimate). No DEM, river level or latitude stretch is baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped roof axis and stair feet © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '149 m mapped (150 m published) footbridge by Michele De Lucchi, opened 2010. Canopy rise, lean, rib spacing, deck height and width, pier positions and stair rise are visual estimates; the roof axis, stair feet and bearing are from OpenStreetMap. Free-standing: no road layer. Cityscape/Full 3D world integration not tested yet.',
};
