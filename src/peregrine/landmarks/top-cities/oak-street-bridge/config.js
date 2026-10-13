// Current 1957 four-lane BC Highway 99 crossing; original procedural geometry.
export const SPEC = {
 id:'oak-street-bridge',name:'Oak Street Bridge',kind:'bridge',ready: true,
 origin:[-123.12556,49.19972],height:35,padM:1900,frontageBearing:148.5,
 rangeM:5200,nearM:1400,footprintless:true,terrainPolicy:'absolute-deck',
};
export const PALETTES={
 light:{concrete:'#b6b4a8',ochre:'#a99554',steel:'#646b63',asphalt:'#555d63',rail:'#929991',paint:'#e7e5d7',lamp:'#fff1ce'},
 dark:{concrete:'#74848a',ochre:'#726a4e',steel:'#445c65',asphalt:'#303c47',rail:'#80949a',paint:'#b9bdbe',lamp:'#ffe2a8'},
};
export const MANIFEST={
 elevationDatum:'Local y=0 is the visual flat-map/water footing datum. Estimated raised deck crest 26 m; absolute-deck world placement keeps the structure rigid and fits each foot and approach to the DEM. No DEM or latitude stretch baked into GLBs.',
 attribution:'Original procedural mesh. Alignment © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'1957 four-lane girder bridge, not a through-truss. Published length 1840 m and main spans 60.9/91.4/60.9 m. Mapped width approximately 19.6 m normal to alignment. Estimated crest, main-span positions, haunch sections, concrete pier dimensions, representative lamp and rail spacing; modeled mainline excludes interchange branches.',
};
