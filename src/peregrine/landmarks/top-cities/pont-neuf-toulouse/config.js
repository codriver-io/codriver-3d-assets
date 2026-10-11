// Current Pont-Neuf: the demolished triumphal gateway is deliberately absent.
export const SPEC = { id:'pont-neuf-toulouse', name:'Pont Neuf (Toulouse)', kind:'bridge', ready:true,
  origin:[1.43906915,43.5993578], height:16.8, padM:45, frontageBearing:75.8, footprintless:true };
export const PALETTES = {
 light:{brick:'#b4573a',stone:'#c7bba1',trim:'#dbcfb7',joint:'#8b7968',iron:'#464b46',lamp:'#efdfbc',asphalt:'#696b67',walk:'#96938a',paint:'#e1dcc6'},
 dark:{brick:'#743e34',stone:'#777a79',trim:'#92908a',joint:'#484f53',iron:'#435258',lamp:'#ffcf80',asphalt:'#303c47',walk:'#535e62',paint:'#b9bdbe'}
};
export const MANIFEST = {
 elevationDatum:'Local flat-map y=0; deck 8 m at banks, asymmetric 11 m crown (estimated); 110 m approach ramps. No DEM, absolute altitude or latitude stretch baked in.',
 attribution:'Original procedural geometry, Codriver. Mapped bridge and roadway © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'DRAC Occitanie: 220 m length, 20 m deck, seven basket arches, spans 13.47–31.70 m. OSM structural road length ~222 m retained. Pier widths, deck datum, arch rises, masonry, cutwater caps and lamps estimated from photographs.'
};
