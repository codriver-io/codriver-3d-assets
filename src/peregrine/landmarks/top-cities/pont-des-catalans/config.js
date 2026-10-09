// Current Pont des Catalans: twin masonry rings with an enlarged concrete deck.
export const SPEC = {
  id: 'pont-des-catalans', name: 'Pont des Catalans', kind: 'bridge', ready: true,
  origin: [1.427967, 43.603224], height: 21.8, padM: 150,
  frontageBearing: 2.8, footprintless: true,
};
export const PALETTES = {
  light: { stone: '#bdb8a6', voussoir: '#d8d2c1', brick: '#a38473', concrete: '#bdc0b5', iron: '#497864', asphalt: '#586063', paint: '#ede9d9', lamp: '#fff0b3', glow: '#cbbda3' },
  dark: { stone: '#787e83', voussoir: '#9faaa8', brick: '#705853', concrete: '#899495', iron: '#416958', asphalt: '#303d46', paint: '#bfc5c1', lamp: '#ffd185', glow: '#d2a250' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map river/grade y=0; deck 16 m is a photograph estimate, not sea-level altitude. Terrain bank-fit interpolates the mapped banks, with separate validation limitations.',
  attribution: 'Original procedural geometry. Alignment and outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '257.21 m structure, 22.50 m deck, twin 3.25 m masonry rings separated by 9.90 m (DRAC). Five openings 38.5/42/46/42/38.5 m. Estimated vertical dimensions, cutwater profiles, arched spandrel openings, masonry joints and modern fittings. 220 m flat-map ramps; no textures or reference meshes.',
};
