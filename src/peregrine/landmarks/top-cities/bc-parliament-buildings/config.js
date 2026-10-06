// Present exterior, including the 1915 Legislative Library.
export const SPEC = {
  id: 'bc-parliament-buildings', name: 'British Columbia Parliament Buildings', kind: 'building',
  ready: true, origin: [-123.37028, 48.41944], height: 41.6, padM: 112,
  frontageBearing: 12.26,
};
export const PALETTES = {
  light: { stone: '#a49b86', trim: '#c7bdab', foundation: '#797a72', roof: '#50565a', copper: '#66a58f', glass: '#35494e', gold: '#d3af4b', light: '#bfb49a' },
  dark: { stone: '#434742', trim: '#68695b', foundation: '#323c40', roof: '#283538', copper: '#376b62', glass: '#817356', gold: '#e6b951', light: '#ffe9a9' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid base at local flat-map grade y=0; main floor estimated at +2 m. No terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry, Codriver 2026. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '152.4 m official facade, 39.6 m main-floor-to-statue height (+2 m estimated grade offset). Other part heights follow OSM; facade ornament and window rhythm are estimates from licensed comparison photos. Rotation baked once. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
