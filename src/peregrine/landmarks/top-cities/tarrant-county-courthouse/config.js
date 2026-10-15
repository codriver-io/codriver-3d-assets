// Tarrant County Courthouse, Fort Worth, Texas (1893-95, Gunn & Curtiss): present exterior.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'tarrant-county-courthouse', name: 'Tarrant County Courthouse', kind: 'building', ready: true,
  origin: [-97.33319122, 32.75748642], // centre of the mapped cross-shaped outline (way/178593785)
  height: 59, // m, grade to the clock-tower finial (estimate from photographs)
  padM: 60, frontageBearing: 150, rotationDeg: 30,
  // The courthouse stands on the bluff above the Trinity; the mapped outline is a ground-floor footprint, so the
  // pad follows the median ground under it rather than the lowest sample.
  terrainPad: { rings: [FOOTPRINTS[0]], datum: 'median', featherM: 10, refs: [] },
};
export const PALETTES = {
  light: { stone: '#bb8f7b', trim: '#cfae98', column: '#c4857b', roof: '#6c706b', copper: '#80a58f', dome: '#6a4a46', glass: '#43515a', glow: '#efe9d4' },
  dark: { stone: '#8a7068', trim: '#9b8379', column: '#94675f', roof: '#464b4b', copper: '#587a6b', dome: '#463334', glass: '#232c34', glow: '#fff1c2' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local y=0 is the ground at the north and south entrance steps. No absolute altitude, DEM or Mercator stretch is baked in.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Pink Texas granite Renaissance Revival courthouse of 1895. Plan is the mapped cross-shaped outline (long axis bearing 60 degrees, fronts toward 150 and 330). Storey heights, the tower stages, the east-wing copper dome, the chimneys and window rhythm are photographic estimates; the later Civil Courts annex, grounds monuments and the 1950s additions are not modelled.',
};
