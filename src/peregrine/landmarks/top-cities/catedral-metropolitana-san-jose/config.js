// Cupola-topped exterior photographed in February 2023; heights are estimates.
export const SPEC = {
  id: 'catedral-metropolitana-san-jose', name: 'Catedral Metropolitana de San José', kind: 'building',
  ready: true, origin: [-84.07872089647573, 9.932770976079796],
  height: 34.5, padM: 53, frontageBearing: 275, rotationDeg: -95,
};
export const PALETTES = {
  light: { stone: '#c6c5b4', trim: '#e1dfcd', shade: '#a6a796', copper: '#74976d', roof: '#8c9188', glass: '#283835', bronze: '#615d42', glow: '#45564c' },
  dark: { stone: '#737d7c', trim: '#a2aa9e', shade: '#535f60', copper: '#526b59', roof: '#424e51', glass: '#17262a', bronze: '#484b40', glow: '#b19a65' },
};
export const MANIFEST = {
  elevationDatum: 'Local pavement y=0, rigid flat base; no terrain, absolute altitude or Mercator stretch baked in.',
  attribution: 'Original procedural mesh authored for Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'OSM way 264042444 supplies plan and orientation. All heights, roof pitches and architectural profiles are photographic estimates; 34.5 m is not a published height. Cupola-topped state follows Bernard Gagnon’s February 2023 exterior photograph, rather than older pointed tower caps.',
};
