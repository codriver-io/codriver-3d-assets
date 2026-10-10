// 2004 crossing; local datum is the north abutment's finished road, not the valley floor.
export const SPEC={id:'viaduc-de-millau',name:'Millau Viaduct',kind:'bridge',ready:true,
  origin:[3.02242,44.07999],height:155.25,padM:1450,frontageBearing:173,
  rangeM:8500,nearM:2600,terrainPolicy:'absolute-deck',belowGradeM:240};
export const PALETTES={
  light:{concrete:'#b9b9ac',steel:'#e6e9e8',cable:'#899a9f',asphalt:'#505a61',rail:'#9caeb6',paint:'#eeeede',glass:'#97b0b8',lamp:'#eee3ca'},
  dark:{concrete:'#596d7b',steel:'#7d99aa',cable:'#aac4d0',asphalt:'#303d48',rail:'#849fab',paint:'#b7bbc0',glass:'#405c70',lamp:'#efbb7c'},
};
export const MANIFEST={
 elevationDatum:'Local y=0 is the north abutment finished road. Published unequal pier lengths extend below this datum; no DEM or absolute altitude is baked. Cityscape flattens the deck to live approach grade; Full 3D world fits the rigid graded deck between live plateau samples and lands each pier on local DEM.',
 attribution:'Original procedural geometry. Mapped alignment and outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'2460 m deck, 204 + 6×342 + 204 m spans, 32.05 m width, seven 87 m steel pylons, 154 single-plane stays, 3.025% grade. Estimated pier sections, anchor heights, rail/wind-screen construction and abutments. 343 m is maximum real ground-to-crown height, not the local-datum crown ordinate.',
};
