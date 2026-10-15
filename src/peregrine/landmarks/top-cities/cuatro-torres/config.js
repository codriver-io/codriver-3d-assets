import { FOOTPRINTS } from './footprint.js';
// Cuatro Torres, including the 2021 Caleido; bearings and centres from OSM.
export const SPEC = {
  id: 'cuatro-torres', name: 'Cuatro Torres', kind: 'building', ready: true,
  origin: [-3.68778, 40.47778], height: 249, padM: 290, frontageBearing: 101.85,
  gridDeg: 11.85,
  // Separate footprint pads avoid flattening the intervening streets. Terrain not yet verified.
  terrainPad: { rings: FOOTPRINTS, refs: FOOTPRINTS.flat(), datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { glass: '#425e6a', glassBright: '#668690', glassDark: '#203340', seam: '#84969d', metal: '#aeb8bc', roof: '#303f48', crown: '#48685e', light: '#4b6875' },
  dark: { glass: '#182e3e', glassBright: '#2a4754', glassDark: '#101d29', seam: '#405663', metal: '#637b8a', roof: '#1b2b36', crown: '#507a60', light: '#e8cb8b' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid entrance grade y=0; real metres east/up/south. No terrain/sea-level height baked into geometry.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Five mapped towers: Moeve/Cepsa 248.3 m, PwC 236 m, Cristal 249 m, Emperador/Espacio 230 m, Caleido 181 m. Facade cells, floor distribution, crowns and low Caleido retail podium simplified from photographs. Rotation is baked. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
