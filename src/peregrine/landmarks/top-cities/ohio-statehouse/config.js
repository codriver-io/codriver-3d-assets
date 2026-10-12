import { FOOTPRINTS, WEST_STAIR } from './footprint.js';
export const SPEC = {
  id: 'ohio-statehouse', name: 'Ohio Statehouse', kind: 'building', ready: false,
  origin: [-82.9991013, 39.9613191], height: 48.1584, padM: 86,
  frontageBearing: 278.9, rotation: 8.85 * Math.PI / 180,
  drumDiameter: 19.5072, drumTop: 38.336, mainRoof: 17,
  terrainPad: { rings: [FOOTPRINTS[0], WEST_STAIR], refs: [[-82.9994,39.9611],[-82.9992,39.9616],[-82.9984,39.9613]], datum: 'median', featherM: 7 },
};
export const PALETTES = {
 light: { stone: '#c9c5b6', trim: '#d8d3c3', roof: '#858e88', glass: '#303b3c', frame: '#736957', light: '#3b3930', skylight: '#7d9697' },
 dark: { stone: '#737a7b', trim: '#969a93', roof: '#444b48', glass: '#29383f', frame: '#4c5050', light: '#b8a27c', skylight: '#47616b' },
};
export const MANIFEST = {
 elevationDatum: 'Rigid local grade y=0; east/up/south metres, no terrain or absolute elevation baked in.',
 attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note: '64-foot cupola diameter and 158-foot pinnacle height from CSRAB; two-storey drum with shallow conical roof, not a dome. OSM mapped compound envelope and orientation. Vertical tier split, facade bays, skylights and annex details estimated from photos. Cityscape and Full 3D world integration checked separately.',
};
