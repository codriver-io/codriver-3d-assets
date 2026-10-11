// Notre-Dame-de-l'Assomption, Bayeux. Original procedural exterior, October 2026.
export const SPEC = {
  id: 'cathedrale-de-bayeux', name: 'Bayeux Cathedral (Notre-Dame)', kind: 'building',
  ready: true, origin: [-0.703426, 49.275479], height: 76.6, padM: 66,
  frontageBearing: 295.3,
};
export const PALETTES = {
  light: { stone: '#c9c1aa', trim: '#d8ceb7', recess: '#343530', roof: '#626c78', copper: '#9cb3a6', glass: '#3d4c4e', glow: '#3d4c4e' },
  dark: { stone: '#656761', trim: '#77796d', recess: '#252b2c', roof: '#343e49', copper: '#657f73', glass: '#243337', glow: '#8b7956' },
};
export const MANIFEST = {
  elevationDatum: 'Local west-front pavement y=0; rigid metric model, no terrain or sea-level height baked in.',
  attribution: 'Original procedural geometry. Mapped data © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'West spires 76.6 m and central clock tower 74.5 m follow the French dimension table; OSM parts tag all towers at 60 m and are schematic. Eaves, stages, tracery, pinnacles and annex roofs are photo estimates. Rotation of -25.3° is baked once from OSM control points. No interior, tapestry, sculpture portraits or textures. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
