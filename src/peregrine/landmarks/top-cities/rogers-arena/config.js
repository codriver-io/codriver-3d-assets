// Rogers Arena, 800 Griffiths Way; 1995 arena with contemporary Rogers signage.
export const SPEC = {
  id: 'rogers-arena', name: 'Rogers Arena', kind: 'building', ready: true,
  origin: [-123.10889, 49.27778], height: 35, padM: 88,
  // East entrance: OSM control points [-123.1078218,49.2779732] to
  // [-123.1078392,49.2773545]; outward bearing 91 degrees. Rotation is baked.
  frontageBearing: 91, eaveM: 26, facadeM: 22, roofRiseM: 9,
};
export const PALETTES = {
  light: { stone: '#aeb0ac', roof: '#cbd1d2', glass: '#365263', frame: '#697176', louvre: '#777b7b', blue: '#16658c', sign: '#e33538', glow: '#46657a' },
  dark: { stone: '#525d65', roof: '#606f79', glass: '#1c354a', frame: '#45535f', louvre: '#414e59', blue: '#204760', sign: '#f14b49', glow: '#c2c9a3' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; no terrain or sea-level elevation baked in.',
  attribution: 'Original procedural mesh by Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Mapped arena and roof outlines; heights, entrance drum, glazing and roof curvature are photo-based estimates. Adjacent Aquilini towers remain provider-owned. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
