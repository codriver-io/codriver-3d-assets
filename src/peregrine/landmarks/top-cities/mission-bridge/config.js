// Highway 11 road bridge opened in 1973; the adjacent railway crossing is excluded.
export const SPEC={id:'mission-bridge',name:'Mission Bridge',kind:'bridge',ready: true,
 origin:[-122.30556,49.12333],height:38.11,padM:850,frontageBearing:131,
 rangeM:5000,nearM:1800,terrainPolicy:'absolute-deck'};
export const PALETTES={
 light:{concrete:'#b5b3a5',steel:'#716b55',asphalt:'#b4b8bf',rail:'#999e94',paint:'#e7e5d5',lamp:'#fff0ce'},
 dark:{concrete:'#75818a',steel:'#52616a',asphalt:'#303b46',rail:'#7a929b',paint:'#bac4c6',lamp:'#ffe0a0'}};
export const MANIFEST={elevationDatum:'Local y=0 is visual water/flat-map grade. Road crest 30 m, lamps 38 m, estimated from photographs; absolute-deck world fitting uses the shared terrain contract. No DEM or Mercator scale baked into geometry.',
 attribution:'Original procedural model. Alignment and outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'1973 bridge, 1125 m and 22 spans (11 concrete approach, 8 steel approach, 3 orthotropic steel box spans), 134 m main span and inclined concrete pier columns from Associated Engineering 2015 CAEE paper. Four lanes, nominal 16 m road and two 2 m walks from the dossier; exact deck height, other span lengths, sections and lamps estimated.'};
