// Delugan Meissl's 2009 museum at Porscheplatz, Stuttgart-Zuffenhausen.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id:'porsche-museum', name:'Porsche Museum', kind:'building', ready: true,
  origin:[9.152559010518338,48.83422261502164], height:23, padM:85, frontageBearing:355,
  terrainPad:{rings:FOOTPRINTS,refs:FOOTPRINTS[0].slice(0,-1),datum:'median',featherM:6},
};
export const PALETTES = {
 light:{white:'#e8e9e6',concrete:'#bfc3bf',soffit:'#a1afb2',roof:'#d1d6d4',glow:'#34464a',frame:'#27383b',joint:'#c2c9c8',sign:'#edf1e9'},
 dark:{white:'#a5b0b7',concrete:'#737f89',soffit:'#718590',roof:'#687885',glow:'#7b8574',frame:'#233039',joint:'#87969f',sign:'#e1f2e5'},
};
export const MANIFEST = {
 elevationDatum:'Rigid local grade y=0; no terrain or absolute elevation baked into the model.',
 attribution:'Original procedural model for Codriver. Geographic footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Porsche publishes 23 m height, maximum 10 m undercroft and three V-shaped supports. Provider envelope is mapped separately; the shorter-wing exhibition shell, support positions, taper, base building, glazing bays and roof terrace are photographic estimates. Rotation baked into east/up/south coordinates.',
};
