// 1992 César Pelli / HKS tower, 100 North Tryon Street, Charlotte.
export const SPEC = {
  id: 'bank-of-america-corporate-center', name: 'Bank of America Corporate Center',
  kind: 'building', ready: true, origin: [-80.84223, 35.22731],
  height: 265.5, padM: 51, frontageBearing: 228.3,
};
export const PALETTES = {
  light: { stone: '#c2b9ae', granite: '#a18a81', glass: '#485966', glow: '#526371', light: '#98a4ab', roof: '#858d91' },
  dark: { stone: '#656776', granite: '#605e69', glass: '#243746', glow: '#c1b284', light: '#cfdded', roof: '#414c58' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid building, no absolute elevation or terrain baked in.',
  attribution: 'Original procedural mesh for Codriver. Mapped plan © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '265.5 m / 60 floors / 1992 from CTBUH; 30.48 m silver-rod crown from structural engineer Walter P Moore. OSM plans and stepped part heights retained; facade bay pitch, crown rod count and ring details estimated from photographs. Rotation baked into mapped vertices. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
