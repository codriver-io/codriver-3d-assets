// 1991 Dartford–Thurrock southbound A282 crossing.
export const SPEC={
  id:'queen-elizabeth-ii-bridge',name:'Queen Elizabeth II Bridge (Dartford Crossing)',kind:'bridge',ready: true,
  origin:[0.25861,51.46472],height:137,padM:1550,frontageBearing:209.2,
  rangeM:11000,nearM:3200,terrainPolicy:'absolute-deck',
  lateralBankFit:{blendM:100,terrainClamp:true,clearanceM:0},
};
export const PALETTES={
  light:{kerb:'#b9b6a9',concrete:'#b9b6a9',pylon:'#adaeaa',steel:'#657576',cable:'#b1b5b3',asphalt:'#50565b',paint:'#dddcd2',rail:'#87908e',lamp:'#e9dbc1'},
  dark:{kerb:'#637078',concrete:'#637078',pylon:'#78878e',steel:'#3f5861',cable:'#8b9fa7',asphalt:'#2b353d',paint:'#8c9da4',rail:'#617c87',lamp:'#ffd69b'},
};
export const MANIFEST={
  elevationDatum:'y=0 is the authored flat-map/water datum; 137 m pylon tops. Absolute-deck world placement fits support feet and landing roads to DEM at runtime; no terrain or latitude scale baked in.',
  attribution:'Original procedural geometry; alignment/envelope © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note:'Published 450 m main span, 137 m total tower (53 m concrete +84 m steel), 812 m stayed section and four undivided southbound lanes. Width 20.6 m from mapped envelope, road 15.8 m and pylon sections/stay anchors/approach piers are visual estimates. Deck 53 m at pylons and 61 m crest is an approximate flat-map datum, not surveyed navigation clearance.',
};
