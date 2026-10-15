// 1992 completed building; dimensions from Wikipedia and mapped OSM parts.
export const SPEC = {
  id: 'tour-1000-de-la-gauchetiere', name: '1000 De La Gauchetière', kind: 'building',
  ready: true, origin: [-73.56627, 45.49824], height: 205, padM: 72,
  frontageBearing: 125, floorCount: 51, crownBaseM: 170, crownRidgeM: 198,
};
export const PALETTES = {
  light: { stone: '#a9ada8', glass: '#567b86', copper: '#537a76', roof: '#6b7976', trim: '#879b98', glow: '#577c87', lobby: '#325762' },
  dark: { stone: '#4b555c', glass: '#203d48', copper: '#344f50', roof: '#39484b', trim: '#5c7477', glow: '#bba87a', lobby: '#2d4f59' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; no sea-level or DEM height baked into the asset.',
  attribution: 'Original procedural geometry. Mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '205 m and 51 floors sourced; mapped 125 degree axis and podium envelope. Regularised tower setbacks, crown panels, entrances and floor pitch are estimates. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
