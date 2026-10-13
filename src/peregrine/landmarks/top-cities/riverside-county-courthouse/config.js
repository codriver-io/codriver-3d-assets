// Present restored Main Street range, including the original attic sculpture groups.
export const SPEC = {
  id: 'riverside-county-courthouse', name: 'Riverside County Courthouse', kind: 'building',
  ready: true, origin: [-117.37557, 33.97923], height: 20.7, padM: 48,
  frontageBearing: 299.1, rotationDeg: -119.1,
  plinthM: 2.2, wingCorniceM: 11.9, porticoCorniceM: 14.3,
};
export const PALETTES = {
  light: { stone: '#ddd8c6', glass: '#455052', bronze: '#65634f', roof: '#827e70', iron: '#555b59', glow: '#647266' },
  dark: { stone: '#838b90', glass: '#263d49', bronze: '#606a6f', roof: '#525f69', iron: '#677985', glow: '#bca278' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0, no absolute altitude or terrain stretch baked in.',
  attribution: 'Original procedural mesh by Codriver; mapped outline © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. No reference photographs are shipped.',
  note: 'Present restored 1903/1904 Main Street courthouse range, mapped way 118524342 only; the separate east additions remain provider-owned. Main Street portico has six shafts, the two inner pairs, Corinthian capitals, open bays, broad stairs, continuous balustrades and four grouped attic sculptures. Vertical dimensions, carving, roof and unseen rear details are photographic estimates. Orientation -119.1 degrees is baked into vertices. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
