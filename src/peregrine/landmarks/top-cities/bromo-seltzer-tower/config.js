// Present-day tower: historic revolving bottle (removed 1936) excluded.
export const SPEC = {
  id: 'bromo-seltzer-tower', name: 'Bromo-Seltzer Tower', kind: 'building', ready: true,
  origin: [-76.6206228, 39.287666825], height: 88, padM: 15,
  frontageBearing: 267.47, shaftWidth: 10.6, clockDiameter: 7.3152, clockY: 66.6,
};
export const PALETTES = {
  light: { brick: '#887a5f', stone: '#b1a58b', trim: '#9b9c94', glass: '#384044', glow: '#e8e1ce', ink: '#4d554f', metal: '#272d2d' },
  dark: { brick: '#484637', stone: '#777363', trim: '#626c69', glass: '#24323a', glow: '#ede4c2', ink: '#414a43', metal: '#1c262b' },
};
export const MANIFEST = {
  elevationDatum: 'Local pavement y=0; rigid flat foundation, no terrain or Mercator stretch baked in.',
  attribution: 'Original procedural geometry for Codriver. Geographic footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '88 m height and 15 storeys from OSM / published descriptions; four 24-foot dials from official tower visitor information. Shaft width, tiers, window spacing and ornamental profiles estimated from photographs. Present tower without historic bottle. Rotation baked once. Cityscape and Full 3D world not tested yet.',
};
