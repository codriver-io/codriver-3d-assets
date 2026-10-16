import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id:'pavillon-roger-gaudry', name:'Pavillon Roger-Gaudry (Université de Montréal)', kind:'building', ready: true,
  origin:[-73.614915,45.502714], height:70, padM:185, frontageBearing:290, towerWidth:14, wingHeight:24,
  terrainPad:{rings:[FOOTPRINTS[0]],refs:[[-73.61496,45.5028],[-73.61524,45.5023],[-73.61481,45.5032]],datum:'median',featherM:18},
};
export const PALETTES={
 light:{spandrel:'#b9a579',brick:'#e2cf9f',stone:'#b5b3a3',glass:'#354950',metal:'#434743',bronze:'#675440',roof:'#a1a297'},
 dark:{spandrel:'#6e6853',brick:'#82775d',stone:'#767b72',glass:'#25333c',metal:'#2d383a',bronze:'#4b4536',roof:'#666d70'},
};
export const MANIFEST={
 elevationDatum:'Rigid local foundation y=0; no mountain elevation, terrain deformation or Mercator stretch baked in.',
 attribution:'Original procedural geometry. Geographic footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Ernest Cormier, 1928–1943. OSM six-storey wings 24 m. Tower envelope modeled at 70 m as a photographic estimate: institutional descriptions conflict (52 m tower versus >80 m overall). Courtyard, windows and solariums estimated. Crown rebuilt as three ribbed setback stages from 50 to 69.5 m, with supported finial to 70 m; no cap slab or dome. Crown proportions remain photographic estimates. Both application modes not tested yet; integration checked separately.',
};
