// Current 1987 crossing; excludes the demolished cantilever trusses.
export const SPEC = {
 id:'sunshine-skyway-bridge', name:'Sunshine Skyway Bridge', kind:'bridge', ready:true,
 origin:[-82.65655,27.62179], height:131, padM:2200,
 frontageBearing:147.2, rangeM:7500, nearM:1900, terrainPolicy:'absolute-deck',
};
export const PALETTES = {
 light:{tower:'#d2d0bb',concrete:'#c8c5b5',median:'#cac7b6',cable:'#e1bd30',asphalt:'#858780',paint:'#eeeade',yellow:'#d2b443',rail:'#9a9f98',lamp:'#ffedbd'},
 dark:{tower:'#86949a',concrete:'#75868d',median:'#77878d',cable:'#c7ac3d',asphalt:'#39464b',paint:'#bdc6c5',yellow:'#b5a35d',rail:'#859ba5',lamp:'#ffda94'},
};
export const MANIFEST = {
 elevationDatum:'Local y=0 is flat-map/water grade. Nominal brief clearance 59 m is the main girder soffit; pavement 63.5 m and pylon crowns 131 m. Absolute-deck world placement is applied at runtime; no DEM or Mercator stretch baked into exports.',
 attribution:'Original procedural geometry. Mapped alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'1987 crossing only: sourced 366 m main span, 165 m side spans, 29 m width, 84 stay legs in a central plane. Adopted 131 m height and nominal 59 m clearance from task; published clearances/datum differ. Aerial-projected north tower, second tower at 366 m; estimated pylon sections, approach pier spacing, lamps and median. High section with flat-map landings, omitting remaining low trestles, protective dolphins and old fishing piers.',
};
