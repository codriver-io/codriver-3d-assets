// 1958 Toronto-bound arched through truss and 1985 Niagara-bound box-girder twin.
export const SPEC={id:'burlington-bay-skyway',name:'Burlington Bay James N. Allan Skyway',kind:'bridge',ready: true,
 origin:[-79.79775421,43.29945],height:64,padM:1600,frontageBearing:337,rangeM:6500,nearM:1700,terrainPolicy:'bank-fit'};
export const PALETTES={
 light:{steel:'#788b89',concrete:'#b9b7aa',asphalt:'#606568',paint:'#dfded4',rail:'#737d7d',lamp:'#ffe5b7'},
 dark:{steel:'#637a7c',concrete:'#748085',asphalt:'#303a41',paint:'#abb7b9',rail:'#6e858c',lamp:'#ffc57d'},
};
export const MANIFEST={
 elevationDatum:'Local y=0 is water / Cityscape grade. Deck crest 39.2 m, original soffit 36.7 m, arch crown 64 m. World uses explicit bank/canal ground controls, not absolute sea-level heights: Lake Ontario is above sea level. No terrain or Mercator stretch is baked into geometry.',
 attribution:'Original procedural model; mapped alignment and structural outlines © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'1958 steel arched through-truss paired with the 1985 segmental concrete canal span and steel box-girder approaches. Sourced: 151 m main span, 83.7 m back spans, 36.7 m clearance, 64 m crown, 2560/2215 m published lengths; engineering paper gives 21.25 m newer deck width. Estimated from mapped outlines/photos: 20.4 m old deck, 25 m centre spacing, member sizes, truss panel layout, pier sections, lamps and crest profile. Both deck ribbons continue to common flat-map landings; the shorter newer structure changes to retaining fill outside its mapped abutments.',
};
