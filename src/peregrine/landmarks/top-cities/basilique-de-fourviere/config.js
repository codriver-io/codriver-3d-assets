import { FOOTPRINTS } from './footprint.js';
// The permanent architecture, excluding temporary 2026 restoration scaffolding.
export const SPEC = {
  id: 'basilique-de-fourviere', name: 'Basilique Notre-Dame de Fourvière', kind: 'building',
  ready: true, origin: [4.82242, 45.76239], height: 48, padM: 63,
  frontageBearing: 277, rotationDeg: 7,
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 5,
    refs: [[4.822102,45.762350], [4.822620,45.762297], [4.822482,45.762027]] },
};
export const PALETTES = {
  light: { stone: '#dbd5c6', trim: '#eee9dc', roof: '#839b9f', glass: '#353c43', metal: '#4a5352', gold: '#cfa44b', glow: '#535b62' },
  dark: { stone: '#746f66', trim: '#a19a88', roof: '#3d525b', glass: '#202a35', metal: '#333c42', gold: '#bf9143', glow: '#d7b37a' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local foundation at y=0; Fourvière hill/DEM altitude is not baked into geometry. Bounded median terrain pad declared; integration unchecked.',
  attribution: 'Original procedural model for Codriver; mapped placement © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photos are not embedded.',
  note: 'Permanent 1872–1896 basilica and adjoining chapel; temporary restoration scaffolding omitted. Tourism dimensions: main basilica 86 × 35 m, towers 48 m. Heights of intermediate stages, ornament and chapel are photo estimates; simplified sculpture and stained glass.',
};
