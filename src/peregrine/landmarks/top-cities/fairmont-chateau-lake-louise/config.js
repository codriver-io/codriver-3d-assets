// Fairmont Chateau Lake Louise: original procedural model, metric east/up/south.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'fairmont-chateau-lake-louise', name: 'Fairmont Chateau Lake Louise', kind: 'building',
  ready: true, origin: [-116.21705, 51.41768], height: 40, padM: 60,
  frontageBearing: 230.2, ownTolM: 1,
  terrainPad: { rings: FOOTPRINTS, refs: [[-116.2174106,51.417725],[-116.2170068,51.41723],[-116.2148717,51.417761]], datum: 'median', featherM: 12 },
};
export const PALETTES = {
  light: { stone:'#d4cbb3', base:'#a99d83', copper:'#4e6961', roof:'#444f50', glass:'#3f5359', glow:'#697574' },
  dark: { stone:'#727b80', base:'#626c73', copper:'#354d50', roof:'#303e47', glass:'#263e4d', glow:'#d4ad6b' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; no absolute altitude or terrain baked into GLBs.',
  attribution: 'Original procedural geometry. Mapped outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'OSM relation 18238906 joined outer ways; 8 storeys sourced, all metric heights and roof/window dimensions photo estimates. Painter 1913, Barott 1925, Glacier 1987 and Mount Temple 2004. Terrain and provider integration not tested.',
};
