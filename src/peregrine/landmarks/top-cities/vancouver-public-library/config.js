// Library Square, 1995 Safdie / Downs Archambault; present roof terrace.
export const SPEC = {
  id: 'vancouver-public-library', name: 'Vancouver Public Library (Library Square)', kind: 'building',
  ready: true, origin: [-123.11563, 49.27975], height: 86, padM: 95, frontageBearing: 135,
};
export const PALETTES = {
  light: { stone: '#b6a08a', glass: '#51686c', frame: '#8d928d', roof: '#8b8c80', garden: '#66715a', glow: '#80918d' },
  dark: { stone: '#686360', glass: '#263c45', frame: '#535d61', roof: '#454d50', garden: '#343e37', glow: '#b8a875' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0, metres east/up/south; no DEM or Mercator stretch baked.',
  attribution: 'Original procedural geometry by Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '1995 Library Square with present roof garden. OSM 30/34/38/40 m library and 60–86 m tower parts; bay counts, facade subdivisions and roof planting estimated from reference photographs. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
