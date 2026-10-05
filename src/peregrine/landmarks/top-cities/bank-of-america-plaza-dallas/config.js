// Bank of America Plaza, completed tower with modern programmable outline lighting.
export const SPEC = {
  id: 'bank-of-america-plaza-dallas', name: 'Bank of America Plaza', kind: 'building',
  ready: true,
  origin: [-96.803901097, 32.780014871], height: 280.7, padM: 43,
  frontageBearing: 167,
};
export const PALETTES = {
  light: { glass: '#426a82', reflection: '#527c91', band: '#85989e', mullion: '#667c87', roof: '#61737b', stone: '#a2a6a3', light: '#9caeaa', glow: '#527082' },
  dark: { glass: '#142a37', reflection: '#203843', band: '#39484e', mullion: '#33454e', roof: '#304149', stone: '#555f61', light: '#42ff7a', glow: '#ddbd78' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid foundation, no terrain, sea level or Mercator stretch baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '280.7 m architectural height; OSM tower and stepped upper outlines. Facade modules, crown step elevations, lobby doors and equipment are approximated from photos. Default night lighting is green; real programmable lighting varies. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
