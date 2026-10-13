// Royal Concertgebouw: the 1888 hall and Pi de Bruijn glass pavilion (1988).
export const SPEC = {
  id: 'concertgebouw', name: 'Concertgebouw', kind: 'building', ready: true,
  origin: [4.87904, 52.3562], height: 27, padM: 60, frontageBearing: 67,
};
export const PALETTES = {
  light: { brick: '#794839', stone: '#d5caba', roof: '#41464c', glass: '#42555b', metal: '#858d88', gold: '#c4a14a', light: '#394341' },
  dark: { brick: '#482f2b', stone: '#837d71', roof: '#282e36', glass: '#30424b', metal: '#58696d', gold: '#dfbb65', light: '#e5b36f' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat grade y=0; rigid foundation, no absolute altitude or DEM baked into the model.',
  attribution: 'Original procedural geometry for Codriver. Mapped outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1888 hall and modern glass side pavilion. OSM mapped plan and tagged roof heights; columns, pediment, lyre, dormers and windows are photograph estimates. Rotation to 67° frontage is baked. Cityscape and Full 3D world integration not tested yet.',
};
