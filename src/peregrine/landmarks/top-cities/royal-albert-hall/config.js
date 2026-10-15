// Published external ellipse 83 × 72 m and crown 41 m; see source notes.
export const SPEC = {
  id: 'royal-albert-hall', name: "Royal Albert Hall", kind: 'building',
  ready: true,
  origin: [-0.17740224625, 51.50101459875],
  height: 41, padM: 54, frontageBearing: 354,
};
export const PALETTES = {
  light: { brick: '#965747', stone: '#c3ae87', glass: '#343d3e', roof: '#849093', frieze: '#73624d' },
  dark: { brick: '#4d302a', stone: '#8e7958', glass: '#171f23', roof: '#3f505a', frieze: '#453c30' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published external ellipse 83 × 72 m and crown 41 m. Center and major-axis bearing 354 degrees fitted to OSM drum 952279006; rotation baked once. OSM roof heights 43.8/46.6 m disagree with published 41 m; model uses published crown, not an asserted survey. Storey splits, porch profiles, steps, mosaic relief figures and colours estimated from photos. Opaque grey glazed dome with attached pale iron ribs. No textures. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
