import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'fairmont-banff-springs', name: 'Fairmont Banff Springs', kind: 'building', ready: true,
  origin: [-115.56194, 51.16444], height: 59.5, padM: 220,
  frontageBearing: 241, axisBearing: 151,
  terrainPad: { rings: FOOTPRINTS, refs: [[-115.56231,51.16452],[-115.56215,51.16432],[-115.56189,51.16423]], datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { stone: '#71645b', ashlar: '#81766c', trim: '#bab6a2', roof: '#515e59', glass: '#34454c', glow: '#34454c', metal: '#474a45' },
  dark: { stone: '#34383d', ashlar: '#41474d', trim: '#777d80', roof: '#293737', glass: '#22323c', glow: '#dfb774', metal: '#404d54' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local y=0 at the main hotel entrance terrace; no absolute elevation or DEM baked in. Explicit median entrance-reference terrain pad within the hotel outline, 8 m feather; terrain integration not tested.',
  attribution: 'Original procedural geometry; mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Present limestone hotel, 1914 centre tower and 1928 wings, including simplified connected southern halls. Published overall height 59.5 m; internal blocks, roof heights, windows and ornament are photo estimates. Rotation 151 degrees east of north derived from OSM edges and baked once. No interiors, textures or mountain mesh.',
};
