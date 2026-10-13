// 1930 City Hall tower and 1989 Trinity Avenue annex, Atlanta.
export const SPEC = {
  id: 'atlanta-city-hall', name: "Atlanta City Hall", kind: 'building',
  ready: true,
  origin: [-84.39028, 33.74889],
  height: 66.6, padM: 72, frontageBearing: 34, rotationDeg: -34,
};
export const PALETTES = {
  light: { stone: '#ddd8c7', marble: '#c5c2b5', glass: '#39474b', spandrel: '#85866a', trim: '#a8a593', roof: '#747d68', light: '#465351' },
  dark: { stone: '#87938f', marble: '#7c8987', glass: '#243638', spandrel: '#5c6b59', trim: '#697872', roof: '#48574d', light: '#e0cca0' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '1930 Neo-Gothic tower: OSM 66.6 m height and four complete mapped provider envelopes; cream terra cotta, olive spandrels, Gothic entrances and shallow green pyramid concealed behind tracery. Setbacks, bays and simplified 1989 annex estimated from references. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
