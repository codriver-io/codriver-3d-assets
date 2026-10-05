import { FOOTPRINTS } from './footprint.js';
// The structural anchor is the midpoint of the mapped front/rear envelope.
export const SPEC = {
  id: 'catedral-metropolitana-de-medellin', name: 'Catedral Metropolitana de Medellín', kind: 'building',
  ready: true, origin: [-75.56394147086847, 6.254024779938192],
  height: 53.2, padM: 65, frontageBearing: 211.35, rotationDeg: -31.35,
  terrainPad: { rings: FOOTPRINTS, refs: [[-75.56394147,6.25402478],[-75.564156,6.253661],[-75.5637,6.25394],[-75.5637,6.25435],[-75.56407,6.25430]], datum: 'median', featherM: 7 },
};
export const PALETTES = {
  light: { brick: '#a47a50', trim: '#b89466', recess: '#604832', roof: '#936a56', copper: '#627263', glass: '#343e3b', door: '#292a25', stone: '#8d8a76' },
  dark: { brick: '#57473c', trim: '#70604b', recess: '#302c28', roof: '#463d38', copper: '#3e4e49', glass: '#323b38', door: '#222927', stone: '#535957' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local flat-map grade y=0; no DEM altitude baked into geometry.',
  attribution: 'Original procedural model by Codriver. Mapped outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright. Reference photographs only, no incorporated pixels or meshes.',
  note: 'Current brick Neo-Romanesque cathedral: sourced 53.2 m tower/cross height, 98.45 m length, 14.5 m nave and 63.4 m transept. Outline follows OSM; pitches, ornament and window sizes are photographic estimates. Median footprint terrain pad is declared conservatively; both app modes require separate integration verification.',
};
