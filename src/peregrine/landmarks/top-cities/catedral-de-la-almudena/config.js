import { FOOTPRINTS } from './footprint.js';
// Dimensions: Spanish Wikipedia; mapped roofs: supplied OSM dossier. See the asset doc.
export const SPEC = {
  id: 'catedral-de-la-almudena', name: 'Catedral de la Almudena', kind: 'building',
  ready: true, origin: [-3.71456, 40.41559], height: 73, padM: 90,
  frontageBearing: 5,
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 10 },
  towerHeight: 60, naveRoofHeight: 25.8,
};
export const PALETTES = {
  light: { stone: '#c5c3bd', trim: '#dedbd2', roof: '#515e67', glass: '#46565d', bronze: '#524b3b', gold: '#b99a4e' },
  dark: { stone: '#68737d', trim: '#89929a', roof: '#354450', glass: '#303e4b', bronze: '#3c403f', gold: '#89764b' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid cathedral platform at local y=0; no terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry by Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Exterior only: 73 m dome cross and 60 m tower vanes; mapped cruciform plan. Shallow slate cap, articulated octagonal drum, supported lantern and pierced curled attic with seated figures fitted to credited exterior photographs; decorative dimensions and colours are estimates. Rotation baked into the export. Cityscape and Full 3D world integration not tested yet.',
};
