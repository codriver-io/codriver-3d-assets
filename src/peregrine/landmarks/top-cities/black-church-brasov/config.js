import { FOOTPRINTS } from './footprint.js';
// Black Church (Biserica Neagră), Brașov: late-Gothic hall church, west tower, steep tiled roof.
// Axis bearing 72° (long edges of OSM way/866090448 and way/866090447): tower at the WSW end, apse at the ENE end.
export const SPEC = {
  id: 'black-church-brasov', name: 'Black Church (Biserica Neagră)', kind: 'building',
  ready: true,
  origin: [25.58807, 45.641], // dossier origin; the mapped footprint centroid sits ~10 m east of it
  height: 65, padM: 60,
  frontageBearing: 252, // the tower front looks out WSW, along the nave axis
};
export const PALETTES = {
  light: { stone: '#7c7568', trim: '#a39b88', roof: '#8f5840', glass: '#272d31', wood: '#493a31', copper: '#6b7a70' },
  dark: { stone: '#47443e', trim: '#5e5a4f', roof: '#563428', glass: '#15191c', wood: '#2a211c', copper: '#3e4b44' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the pavement grade round the church. Rigid metre-scale model; no absolute altitude or terrain is baked into the mesh.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan, orientation and the nave, choir and apse extents come from the mapped OSM outline; tower height 65 m, nave ridge 41 m and choir ridge 37 m follow OSM height tags and published figures. Wall heights, window rhythm, buttress profiles, cross gables, tower stages and clock positions are estimated from photographs. No transept projection (the mapped outline has none), no interior. The stone is drawn as the weathered grey-brown it shows today, not black. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
