// Existing 1992 continuous truss, current pale Citadel-blue paint (2017 repaint).
export const SPEC = {id:'don-holt-bridge',name:'Don N. Holt Bridge',kind:'bridge',ready:true,
 origin:[-79.964174775, 32.8912967],height:74,padM:1750,frontageBearing:99.6,footprintless:true,terrainPolicy:'absolute-deck',clipStandardEnds:true,
 lateralBankFit:{terrainClamp:true,clearanceM:.15,blendM:150}};
export const PALETTES = {
 light:{steel:'#87a9bf',concrete:'#b7b6ad',asphalt:'#696d6e',rail:'#8c969b'},
 dark:{steel:'#657f91',concrete:'#707c83',asphalt:'#343e45',rail:'#71818c'}
};
export const MANIFEST = {
 elevationDatum:'Local metric east/up/south. Nominal water/flat grade is y=0; approved truss roadway 52 m, underside 49.8 m. The mapped 2981.755 m alignment and grade are shared by geometry and driving. World uses absolute-deck terrain policy with per-foot grounding and bank-fitted endpoints; no DEM or Mercator scale baked in.',
 attribution:'Original procedural geometry; mapped alignment and truss outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'1992 three-span continuous through-Warren truss, current muted Citadel-blue paint. Approved 491 m truss, 244 m main span, 28.5 m deck, 21 m chord rise and 20 panels retained. Two opposing OSM motorway carriageways share one deck. Mapped approaches use 1378.130 / 1112.625 m ramps with 60 m vertical curves, maximum flat grades 3.832 / 4.798 percent. Only 150 m landing zones narrow to connected roads. Approach lengths, structural/support grade and low landing tessellation changed for road fitting; member sections remain estimates. No exit ramps, lamps, signage or traffic.'
};
