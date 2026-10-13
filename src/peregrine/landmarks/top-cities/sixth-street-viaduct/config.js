// Current 2022 Ribbon of Light, never the demolished 1932 steel bridge.
export const SPEC = {
 id:'sixth-street-viaduct',name:'Sixth Street Viaduct',kind:'bridge',ready: true,
 origin:[-118.22694,34.03806],height:34.438,padM:25,frontageBearing:104,
 footprintless:true,terrainPolicy:'absolute-deck',rangeM:4300,nearM:1350,
};
export const PALETTES = {
 light:{arch:'#d0cec6',concrete:'#bdbbb2',girder:'#9c9c94',asphalt:'#63666a',walk:'#c8c5bb',cable:'#72787c',rail:'#a1a7ab',paint:'#eee9d9',lamp:'#ededdf'},
 dark:{arch:'#edf0ef',concrete:'#697581',girder:'#4b5965',asphalt:'#303943',walk:'#717a80',cable:'#8a939b',rail:'#8f9aa5',paint:'#c2c6c5',lamp:'#f5f3df'},
};
export const MANIFEST = {
 elevationDatum:'Local metres east/up/south: Cityscape grade y=0; deck plateau 16.15 m. Separate estimated 77 m world ground datum and 19.2024 m total west-to-east abutment rise are applied only at runtime, never baked into GLBs.',
 attribution:'Original procedural geometry. Mapped alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright. Photographs for visual study only, no textures or external mesh.',
 note:'2022 bridge: ten arch pairs, 30.48 m deck, 9-degree outward cant; seven 9.144 m, two 18.288 m and one 12.192 m rises. HNTB typical/long spans 60.96/76.2 m conflict with the city page typical 91.44 m. Mapped western bicycle descent and eastern 3.5-turn helical access are retained in both LODs. Arch/pier stations, ramp grades/sections and world elevations are estimates; terminal widths fit live HD street edges.',
};
