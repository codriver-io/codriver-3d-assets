// Original 1917 exterior; mapped plan, photo-estimated vertical dimensions.
export const SPEC = {
  id: 'edificio-de-correos-costa-rica', name: 'Edificio de Correos', kind: 'building',
  ready: true, origin: [-84.07998335, 9.9354046], height: 22, padM: 43,
  frontageBearing: 94.93,
};
export const ANGLE = 85.07 * Math.PI / 180;
export const PALETTES = {
  light: {stone:'#b9a16e', trim:'#deceb0', base:'#9d8c70', roof:'#79776d', glass:'#667875', iron:'#343d3c', light:'#d6c7a4'},
  dark: {stone:'#6a5d43', trim:'#a29274', base:'#544d43', roof:'#43494b', glass:'#354950', iron:'#253139', light:'#e7c483'},
};
export const MANIFEST = {
 elevationDatum: 'Rigid local grade y=0; no altitude or DEM baked into geometry.',
 attribution: 'Original procedural Codriver geometry; mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note: '1917 eclectic post and telegraph exterior. OSM 79.39 × 31.28 m plan; east-facing façade 94.93° bearing, rotation baked once. Heights, rear elevation, roof and simplified ornament estimated from photographs. No textures or captured mesh.',
};
