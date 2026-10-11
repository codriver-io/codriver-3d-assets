// Current Seine-estuary crossing, opened January 1995.
export const SPEC = {
  id:'pont-de-normandie', name:'Pont de Normandie', kind:'bridge', ready:true,
  origin:[0.27402,49.43226], height:214, padM:1450,
  frontageBearing:174.9, rangeM:10000, nearM:2600, terrainPolicy:'absolute-deck',
};
export const PALETTES = {
  light:{concrete:'#c4c2b5',head:'#c4c2b5',steel:'#697e85',cable:'#9eacb0',blue:'#307bab',asphalt:'#535b60',paint:'#e3e2d8',rail:'#98a8ac',lamp:'#eee7d2'},
  dark:{concrete:'#718089',head:'#718089',steel:'#46616f',cable:'#9bb6c5',blue:'#24577a',asphalt:'#303b44',paint:'#9faeb5',rail:'#718f9e',lamp:'#ffdfac'},
};
export const MANIFEST = {
  elevationDatum:'Local y=0 is visual water/flat-map grade; 214 m crown above this authored datum. Real terrain is fitted at runtime, with no DEM or Mercator stretch baked in. Buried foundations omitted.',
  attribution:'Original procedural geometry. Mapped alignment and bridge envelope © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note:'856 m main span, 23.6 m deck and 184 stays from published dimensions. Operator history gives 214 m pylons; other references give 202.74/204/215 m; vertical datums are unresolved. Deck profile, pylon sections, pier stations, stay anchors and hardware are visual estimates. Mapped physical length differs slightly from published 2141.25–2143.21 m.',
};
