import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'cathedrale-sainte-cecile-albi', name: 'Cathédrale Sainte-Cécile d’Albi', kind: 'building',
  ready: true,
  origin: [2.14256, 43.92853], // mapped nave axis anchor; west tower at x=-47.1,z=6.5
  height: 78, padM: 65, frontageBearing: 179.986,
  // Bounded rigid foundation: the river-side terrain is lower than the cathedral close.
  terrainPad: { rings: FOOTPRINTS, refs: [[2.1421,43.92847],[2.14256,43.92847],[2.143,43.92847]], datum: 'median', featherM: 5 },
};
export const PALETTES = {
  light: { brick:'#a2654b', trim:'#aa7053', joint:'#925d48', roof:'#80523f', recess:'#352e2b', stone:'#d5c4a1', glow:'#424644' },
  dark: { brick:'#553d35', trim:'#604637', joint:'#49352e', roof:'#3e302b', recess:'#201e20', stone:'#938774', glow:'#ae8853' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the cathedral exterior foundation grade; nave and baldaquin entrances sit above its battered brick socle. No absolute elevation or terrain is baked in.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Present exterior, without the removed 19th-century roof balustrade. Albi Tourisme: 113 m long, 35 m wide, bell tower 78 m. OSM nave eaves 40 m and roof ridge 44 m; tower stages 41/58/66/78 m. Fine brickwork, carvings, window dimensions and porch tracery are procedural approximations. Bounded median terrain pad is declared for the river-side slope; Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
