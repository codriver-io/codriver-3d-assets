import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'real-casa-de-correos', name: 'Real Casa de Correos (Puerta del Sol)', kind: 'building',
  ready: true, origin: [-3.7038, 40.4164], height: 34.6, padM: 48,
  frontageBearing: 353, ownTolM: 1.2,
  terrainPad: { rings: FOOTPRINTS, refs: [[-3.7038,40.41655],[-3.7041,40.4164],[-3.7034,40.4163]], datum: 'median', featherM: 7 },
};
export const PALETTES = {
  light: { stone:'#c4bfb0', brick:'#966854', roof:'#756b60', glass:'#384c4d', iron:'#343a38', clock:'#789790', gold:'#b19b58' },
  dark: { stone:'#767c7d', brick:'#624a45', roof:'#41494d', glass:'#35494e', iron:'#303c43', clock:'#a5b9ac', gold:'#b8a56e' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local foundation y=0, east/up/south metres; no absolute terrain datum.',
  attribution: 'Original procedural model by Codriver. Geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1768 palace with the 1866 Losada clock. Footprint mapped from OSM relation 4098953; all metre heights are photographic estimates. Rotation baked once: facade axis 83 degrees, outward bearing 353 degrees. Modern covered courts simplified; sculpture abstracted. Cityscape and Full 3D world integration not tested.',
};
