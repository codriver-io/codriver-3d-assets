import { FOOTPRINTS } from './footprint.js';
// UNStudio 2006 museum; mapped OSM outer-ring area centroid.
export const SPEC = {
  id: 'mercedes-benz-museum', name: 'Mercedes-Benz Museum', kind: 'building',
  ready: false, origin: [9.233926358218074, 48.788176077973155],
  height: 51.5, bodyHeight: 47.5, padM: 58, frontageBearing: 239,
  // Level plaza: perimeter median avoids a depressed DEM sample excavating it.
  terrainPad: { rings: [FOOTPRINTS[0]], refs: FOOTPRINTS[0].filter((_, i) => i % 6 === 0), datum: 'median', featherM: 6 },
};
export const PALETTES = {
  light: { aluminium: '#b8bdbe', joint: '#969ea0', frame: '#727d80', glow: '#415861', roof: '#a6afb0', sign: '#b9c4c6' },
  dark: { aluminium: '#52616c', joint: '#485760', frame: '#38464d', glow: '#d4a766', roof: '#45545d', sign: '#ddd7bb' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid museum foundation, no DEM or altitude baked in.',
  attribution: 'Original procedural model for Codriver, CC BY 4.0; source MIT. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'UNStudio 2006 trefoil museum, mapped 4853 m² envelope and 47.5 m body. Ribbon slopes, glazed atrium and small roof star dimensions are estimated; highest point 51.5 m includes estimated emblem. Rotation baked into east/up/south geometry. Adjacent dealership and parking excluded. Underground relation 14292941 crosses the wider campus; only its museum-owned boundary ways are included. Bounded median plaza pad; shared provider filtering is checked separately.',
};
