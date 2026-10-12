// Current 2009 Highway 7 crossing. The earlier swing bridges are excluded.
export const SPEC={id:'pitt-river-bridge',name:'Pitt River Bridge',kind:'bridge',ready: true,
  origin:[-122.7302791,49.24837405],height:60,padM:700,frontageBearing:123,
  rangeM:4500,nearM:1300,terrainPolicy:'absolute-deck'};
export const PALETTES={
 light:{tower:'#c9c9bd',concrete:'#b9bcb4',steel:'#78878a',cable:'#e2e2d5',asphalt:'#535b60',paint:'#e7e8da',rail:'#adb9bc',lamp:'#fff0c9'},
 dark:{tower:'#899aa0',concrete:'#6e7e86',steel:'#5c7382',cable:'#a8bec7',asphalt:'#303b46',paint:'#aebbbc',rail:'#829aa5',lamp:'#ffe5ad'}};
export const MANIFEST={elevationDatum:'Local y=0 is visual water/flat-map grade. Deck 19 m (estimated 3 m structure above sourced 16 m marine clearance); crowns 60 m. No DEM, stretch or moving datum is baked.',
 attribution:'Original procedural model. Mapped geometry © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'190 m main span, 380 m cable-supported section, six 60 m towers, three harp stay planes, 40–44.66 m deck and seven lanes are sourced. Tower sections, stay count/spacing, 19 m roadway, 95 m back spans, cap/girder sections and approach pier locations are visual estimates. Grade ramps are a flat-map compromise.'};
