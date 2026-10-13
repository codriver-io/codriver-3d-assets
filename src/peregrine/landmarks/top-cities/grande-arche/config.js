// Grande Arche: current white exterior, original 1989 massing.
export const SPEC = {
  id: 'grande-arche', name: 'Grande Arche de La Défense', kind: 'building', ready: true,
  origin: [2.2358747, 48.892564475], height: 110, padM: 92,
  frontageBearing: 121.940292, axisDeg: 58.059708,
  width: 106.9, depth: 111.9, openingWidth: 69.4, openingCrown: 100,
  floorY: 8.3, bevelDepth: 18.4,
};
export const PALETTES = {
  light: { stone: '#e0ded5', glass: '#52646d', frame: '#c4c6c3', joint: '#a8a9a5', cloud: '#ecebe1', steel: '#8d969b' },
  dark: { stone: '#858d94', glass: '#263f4b', frame: '#6e7b84', joint: '#555f68', cloud: '#b9bec0', steel: '#7b8b98' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local y=0 at parvis approach grade; raised inner terrace y=8.3 m. No terrain/absolute altitude or Mercator stretch baked in.',
  attribution: 'Original procedural geometry. Geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1989 open cube, 110 m tall; OSM measured ~107 by 112 m plan and baked 121.940292 degree facade bearing. White Carrara marble appearance preserved by current Bethel White granite replacement. Opening bevels, window module count, membrane folds, elevator skeleton and stair treads are approximate. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
