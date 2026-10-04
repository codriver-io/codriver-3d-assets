// Present-day Tower Bridge, bascules closed to carry the A100.
export const SPEC = {
  id: 'tower-bridge', name: 'Tower Bridge', kind: 'bridge', ready: true,
  origin: [-0.0753637, 51.5055166], height: 65, padM: 190,
  frontageBearing: 112.8, rangeM: 4000, nearM: 1000,
};
export const PALETTES = {
  light: { stone: '#b3ada0', trim: '#d3cfc3', roof: '#5a686c', steel: '#64b5dc', white: '#e5e5db', glass: '#304450', asphalt: '#50545a', gold: '#b5a267', light: '#ffe0a4' },
  dark: { stone: '#566271', trim: '#858c91', roof: '#263b49', steel: '#407f9b', white: '#a0afb8', glass: '#223543', asphalt: '#25313d', gold: '#9b8751', light: '#ffe2ac' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0; flat-map roadway 8.5 m; walkway floor 42 m (33.5 m above road). Terrain placement is fitted separately, no DEM baked into the mesh.',
  attribution: 'Original procedural geometry authored for Codriver. Mapped alignment and outlines © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Closed bascules; 65 m towers, 61 m nominal bascule span, 82 m suspension spans. Tower spacing is mapped; architecture, chain section, deck width and tide datum are visual estimates. No textures or third-party meshes.',
};
