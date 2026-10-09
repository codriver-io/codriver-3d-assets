// Modern restored Capitole, Place du Capitole, Toulouse. Rotation is baked in.
export const SPEC = {
  id: 'capitole-de-toulouse', name: 'Capitole de Toulouse', kind: 'building',
  ready: true, origin: [1.44423, 43.604445], height: 25, padM: 64,
  frontageBearing: 171.2, ownTolM: 1.4,
};
export const PALETTES = {
  light: { brick: '#a2584e', stone: '#e4d9c8', marble: '#d9cbbb', roof: '#555450', glass: '#263b43', glow: '#293b40', metal: '#484a46', gold: '#b89d5e' },
  dark: { brick: '#73564d', stone: '#aaa093', marble: '#b0a393', roof: '#343b42', glass: '#253c49', glow: '#e9b56f', metal: '#525a60', gold: '#b09a66' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid foundation, no DEM or absolute altitude baked in.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Cammas brick-and-stone frontage, eight marble columns, three pediments, clock and open courtyards. Mapped envelope 106.8 m; published descriptions conflict (100, over 120, 128 m). Storeys, statuary and rear roofs estimated; detached donjon excluded. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
