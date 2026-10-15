// Munttoren, permanent restored exterior, Muntplein 12/14, Amsterdam.
export const SPEC = {
  id: 'munttoren', name: 'Munttoren', kind: 'building', ready: true,
  origin: [4.893212, 52.367055], height: 41, padM: 26,
  frontageBearing: 177.48, masonryHeight: 21.8, clockHeight: 24.2,
  belfryBottom: 26.3, belfryTop: 30.95,
};
export const PALETTES = {
  light: { brick: '#754a3c', stone: '#bbb4a3', metal: '#4f5555', roof: '#626969', glass: '#536469', recess: '#202829', gold: '#c9aa60', tile: '#6e635b' },
  dark: { brick: '#573a30', stone: '#99907d', metal: '#3a444a', roof: '#475257', glass: '#374b58', recess: '#16252d', gold: '#b79853', tile: '#494644' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local pavement y=0, metres east/up/south; no terrain, altitude or Mercator stretch baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped outlines © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '41 m total from Amsterdam Monumentenstad, correcting the approximate 31 m stub; 1620 octagonal timber/lead upper tower by Hendrick de Keyser, medieval round base, nineteenth-century replacement guardhouse. Stage heights, fenestration and ornament estimated from photographs; OSM 3D stage tags understate the complete spire. Rotation baked once. Cityscape and Full 3D world north-side visual placement checked 2026-10-15; lifecycle and terrain stress cases not tested.',
};
