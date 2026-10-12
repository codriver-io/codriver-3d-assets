import { FOOTPRINTS } from './footprint.js';
import { SITE_RINGS, localLngLat } from './notre-dame-de-la-garde-frame.js';

export const SPEC = {
  id: 'notre-dame-de-la-garde', name: 'Notre-Dame de la Garde', kind: 'building',
  ready: false, origin: [5.371, 43.2841], height: 64.7, padM: 70,
  frontageBearing: 311, axisBearing: 131, rangeM: 4200,
  terrainPad: {
    rings: [SITE_RINGS.lower, FOOTPRINTS[2], FOOTPRINTS[3]], datum: 'median', featherM: 4,
    refs: [[-12,-12],[-8,12],[46,12]].map(([u,v]) => localLngLat(u,v)),
    terraces: [{ ring: SITE_RINGS.upper, offsetM: 5, featherM: 3 }],
  },
};
export const PALETTES = {
  light: { stone:'#d9d1bf', green:'#727f79', trim:'#e8dfce', roof:'#969386', glass:'#283a43', granite:'#977e70', gold:'#c39b43' },
  dark: { stone:'#736f64', green:'#3e4b48', trim:'#928879', roof:'#514f48', glass:'#172c37', granite:'#5c4a42', gold:'#ad893d' },
};
export const MANIFEST = {
  elevationDatum: 'Lowest authored fort footing y=0; upper basilica terrace y=5 m. Rigid structure with bounded median lower pad and an explicit +5 m upper terrace; no hill/DEM altitude is baked in. Both placement modes remain untested.',
  attribution: 'Original procedural model for Codriver. Mapped placement © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright; no reference images or textures embedded.',
  note: 'Permanent Romano-Byzantine basilica, square tower, columned pedestal and gilded Virgin and Child. Published stages 41 + 12.5 + 11.2 m = 64.7 m; OSM main envelope about 52 × 17 m. Terrace relief, dome, smaller architecture and sculpture are photographic estimates; 149 m hill is external terrain.',
};
