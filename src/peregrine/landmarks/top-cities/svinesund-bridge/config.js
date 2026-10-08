// New 2005 E6 crossing; the 1946 stone bridge is a different landmark.
export const SPEC = {
 id:'svinesund-bridge', name:'Svinesund Bridge', kind:'bridge', ready:true,
 origin:[11.2518319,59.0943680], height:63.4, padM:30,
 frontageBearing:352, terrainPolicy:'absolute-deck', rangeM:3500, nearM:1100,
};
export const PALETTES = {
 light:{arch:'#eeeade',concrete:'#c5c3b7',girder:'#a3aaa5',asphalt:'#525a60',rail:'#aab4b7',cable:'#7c898e',paint:'#eeeee6',lamp:'#ffe5b6'},
 dark:{arch:'#a9b3b9',concrete:'#78858e',girder:'#72818a',asphalt:'#303a44',rail:'#82949d',cable:'#718390',paint:'#bbc6ce',lamp:'#ffd59a'},
};
export const MANIFEST = {
 elevationDatum:'Local flat grade y=0 at arch foundation toes: crown 63.4 m, road 31.6 m. Terrain uses separate published circa +59.9 m main road datum, DEM-fitted supports; no DEM baked into GLB.',
 attribution:'Original procedural geometry; OSM alignment and bridge outlines © OpenStreetMap contributors, ODbL 1.0, https://www.openstreetmap.org/copyright. Photos are visual references only, not textures or traced meshes.',
 note:'704 m structure, single 247 m concrete arch, two 11 m carriageways with 6 m central gap, six hanger pairs. Arch sections 6.2×4.2 m at feet and 4×2.7 m at crown; elevation conventions from KTH monitoring report. Circular arch curve, pier tapers, girders, barriers, lamps and local ramp profile are approximations. Cityscape and world integration checked separately.',
};
