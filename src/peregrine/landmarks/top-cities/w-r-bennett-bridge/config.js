// W. R. Bennett Bridge (2008), Highway 97 across Okanagan Lake, Kelowna-West Kelowna, British Columbia.
// The 1958 Okanagan Lake Bridge it replaced is excluded.
export const SPEC={id:'w-r-bennett-bridge',name:'W. R. Bennett Bridge',kind:'bridge',ready: true,
  origin:[-119.5115794,49.87946371],height:33.5,padM:600,frontageBearing:164.2,
  rangeM:4500,nearM:1400,terrainPolicy:'bank-fit'};
export const PALETTES={
 light:{concrete:'#cdc6b6',pontoon:'#b2aa99',girder:'#8a5a46',asphalt:'#a9aaa6',paint:'#ecebe2',stripe:'#d8b54a',rail:'#a7aeae',lamp:'#fff2cf',fill:'#a59c8b'},
 dark:{concrete:'#7b7d80',pontoon:'#6b6e70',girder:'#5a4038',asphalt:'#4a4d52',paint:'#b2b4ae',stripe:'#a48a45',rail:'#7f8a90',lamp:'#ffe2a6',fill:'#5f5d58'}};
export const MANIFEST={elevationDatum:'Local y=0 is the lake surface and flat-map grade. Floating road 3 m, hump crown 21.5 m (sourced 18 m navigation clearance plus an estimated 2.7 m girder/slab depth); pontoons drawn 1.6 m above to 2.9 m below the water. No DEM, stretch or moving datum is baked.',
 attribution:'Original procedural model. Mapped geometry © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'1060 m length, 690 m of nine concrete pontoons 25 m wide and 60-90 m long, a 44 m west navigation span with 18 m clearance, 3+2 lanes and the south shared path are sourced. Pier spacing, girder depth, pontoon split, ramp bent spacing, lamp spacing, freeboard and the hump crown height are visual estimates. Land ramps are a flat-map compromise.'};
