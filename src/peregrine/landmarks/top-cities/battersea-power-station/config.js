import { FOOTPRINTS } from './footprint.js';
// Official heritage history: 51 m wash towers + 50 m chimneys = 101 m.
export const SPEC = {
 id:'battersea-power-station',name:'Battersea Power Station',kind:'building',ready: true,
 origin:[-0.14472,51.48167],height:101,padM:115,frontageBearing:347.6,ownTolM:1.5,nearM:1000,rangeM:6500,
 terrainPad:{rings:FOOTPRINTS,refs:[FOOTPRINTS[0]],datum:'median',featherM:8},
};
export const PALETTES = {
 light:{brick:'#79604e',roof:'#535959',glass:'#273a40',concrete:'#e2dfcf',glow:'#526166'},
 dark:{brick:'#44392f',roof:'#2c3539',glass:'#172c36',concrete:'#949e9e',glow:'#bb9764'},
};
export const MANIFEST = {
 elevationDatum:'Rigid foundation at local grade y=0; no absolute altitude, DEM or Mercator stretch baked in.',
 attribution:'Original procedural geometry by Codriver. Mapped outlines © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Four white fluted chimneys; 101 m overall, 51 m tower and 50 m shaft from official heritage history. Mapped envelope about 160 by 170 m; tower profiles, facade grids, restored roof and tapers estimated. Rotation baked from OSM controls. Lift109 capsule omitted in retracted state. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
