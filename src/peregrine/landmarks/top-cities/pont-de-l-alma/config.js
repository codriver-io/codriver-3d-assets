// Present 1974 steel bridge, not the 1856 three-arch predecessor.
export const SPEC = {
 id:'pont-de-l-alma', name:"Pont de l'Alma", kind:'bridge', ready:true,
 origin:[2.30175495,48.863436325], height:6.75, belowGradeM:8, padM:80,
 frontageBearing:356.4, footprintless:true, rangeM:4200,
};
export const PALETTES = {
 light:{steel:'#738e8b', stone:'#b8b2a0', statue:'#85877e', trim:'#b7c7c1', asphalt:'#555d63', iron:'#444c4b', lamp:'#e8e2cb',paint:'#e2e2d9'},
 dark:{steel:'#536d72', stone:'#737c82', statue:'#626e74', trim:'#82989d', asphalt:'#303c47', iron:'#65757d', lamp:'#ffd99b',paint:'#a9b8bd'},
};
export const MANIFEST = {
 elevationDatum:'Local y=0 is upper quay/street grade; deck +0.10m. Bank-fit samples the live quay at both abutments, with lateral mouth crossfall. Girder and supports hang below grade; no DEM is baked into the mesh.',
 attribution:'Original procedural mesh. Alignment and bridge envelope © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Present 1974 bridge: 142.5m overall, unequal 110/31.5m spans, 42m deck, four variable-depth caissons and a single right-bank pier with upstream Zouave. Statue silhouette, girder depths and lamps estimated. Mapped crossing only; no authored ramps over quays or places. Below-grade steel, stone and statue are hidden in Cityscape.',
};
