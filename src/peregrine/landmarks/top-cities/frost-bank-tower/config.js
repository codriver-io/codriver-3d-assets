// Frost Bank Tower, 401 Congress Avenue, Austin (Duda/Paine + HKS, 2003).
// Architectural height 515 ft / 157 m; 33 floors; crown about 30 m (Wikipedia).
export const SPEC = {
  id: 'frost-bank-tower', name: 'Frost Bank Tower', kind: 'building', ready: true,
  origin: [-97.74269, 30.26649], height: 157, padM: 78,
  frontageBearing: 287.3, planAngleDeg: 17.3,
  towerCenter: [-23, 6], // estimated within the mapped podium, plan u/v metres
};
export const PALETTES = {
  light: { glass: '#648da8', blueGlass: '#648da8', trim: '#b2c2c8', stone: '#c4c0ad', roof: '#648da8', light: '#729aaf', occupiedGlass: '#648da8', sign: '#e2e9e9' },
  dark: { glass: '#263e53', blueGlass: '#18374f', trim: '#617b8e', stone: '#666e73', roof: '#3b4851', light: '#bbdce7', occupiedGlass: '#c4b08a', sign: '#dbe7e9' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat grade y=0 at the lobby; rigid base, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural model for Codriver; mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '157 m height, 33 storeys, 2003 completion and approximately 30 m crown are sourced; mapped podium and bearing from OSM way 37546502. Tower inset, step heights, folded crown panels, mullion pitch and rosette emblems are photo-estimated. No textures or reference meshes. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
