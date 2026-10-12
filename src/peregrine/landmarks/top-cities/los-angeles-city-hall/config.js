// 1928 Los Angeles City Hall; dimensions in real metres.
export const SPEC = {
  id: 'los-angeles-city-hall', name: 'Los Angeles City Hall', kind: 'building',
  ready: true, origin: [-118.242769, 34.053691], // mapped pyramid centre
  height: 138.4, padM: 82, frontageBearing: 128, rotationDeg: -38,
};
export const PALETTES = {
  light: { stone: '#dfdcd1', trim: '#c8c3b5', glass: '#414c4e', roof: '#8b7260', light: '#465554' },
  dark: { stone: '#a0b4ad', trim: '#84988f', glass: '#273c40', roof: '#686c67', light: '#dae9bc' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local flat grade y=0; no DEM, absolute elevation or Mercator stretch baked into the asset.',
  attribution: 'Original procedural model by Codriver, CC BY 4.0. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '1928 tower and five light courts. Height/setbacks mapped from OSM; floor rhythm, column widths, crown courses and entrance details estimated from attributed photographs. Both runtime placement modes await separate integration review.',
};
