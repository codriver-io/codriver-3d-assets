import { ORIGIN, BEARING, LEVELS, STATIONS, TERRAIN_SECTIONS, ring, lngLat } from './yerevan-cascade-plan.js';
export const SPEC = {
  id:'yerevan-cascade', name:'Yerevan Cascade', kind:'building', ready: true,
  origin:ORIGIN, height:79.2, padM:300, frontageBearing:180+BEARING,
  footprintless:true, rangeM:4500, nearM:900,
  terrainPad:{ rings:[ring(0,5)], refs:[lngLat(-18,2),lngLat(0,2),lngLat(18,2)], datum:'median', featherM:3,
    terraces:TERRAIN_SECTIONS.map(t=>({ring:ring(t.start,t.end),offsetM:t.offsetM,featherM:3})) },
};
export const PALETTES = {
  light:{stone:'#d9d5c7',relief:'#eeebdf',glass:'#405660',water:'#567d80',garden:'#647552',concrete:'#aaa89f',glow:'#e6dfc2'},
  dark:{stone:'#78766f',relief:'#a29b86',glass:'#23333e',water:'#304c53',garden:'#34483a',concrete:'#595e60',glow:'#e3c58c'},
};
export const MANIFEST = {
 elevationDatum:'Rigid y=0 at the bottom stair landing; all terrace rises are structural offsets, no DEM or absolute altitude baked in. Twelve full-width floor/flight terrain sections, held 1 m below upper structural grades with the lower entrance held at datum 0; world terrainOffsets bury the authored flat base and fit only the structural support feet, preserving all stair rises. Full 3D world recapture pending.',
 attribution:'Original procedural geometry by Codriver. Geographic placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright. Reference photographs are not embedded.',
 note:'Completed five fountain/gallery terraces with a simplified unfinished upper level; 50 m published width, 302 m inclined route, approximately 78 m rise. 286.5 m horizontal extent from OSM. Individual terrace levels, sculpture, fountain relief and gallery details estimated; the separate Monument Terrace at 450 m is excluded.',
};
