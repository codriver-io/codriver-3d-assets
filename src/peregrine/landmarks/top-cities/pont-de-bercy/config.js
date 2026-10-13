// Present 1864 bridge, 1905–06 Métro arcade and stone-clad 1992 widening.
export const SPEC = {
 id:'pont-de-bercy', name:'Pont de Bercy', kind:'bridge', ready: true,
 origin:[2.37483975, 48.838030125], height:15.35, padM:90, frontageBearing:50.3,
 footprintless:true, rangeM:4500,
};
export const PALETTES = {
 light:{arcade:'#bdb7a7', metro:'#cec5ac', rail:'#444b4a', stone:'#bdb7a7', trim:'#cec5ac', asphalt:'#555d63', steel:'#444b4a', ballast:'#77756e', lamp:'#e9e2c5', paint:'#e9e8df'},
 dark:{arcade:'#747b81', metro:'#8b9292', rail:'#667078', stone:'#747b81', trim:'#8b9292', asphalt:'#303c47', steel:'#667078', ballast:'#555e66', lamp:'#ffd69a', paint:'#b9bdbe'},
};
export const MANIFEST = {
 elevationDatum:'Local y=0 is flat-map grade; road deck 8 m, Métro deck 14.1 m are photographic estimates. No absolute altitude or DEM is baked in. Bank-fit terrain placement, with independent support feet.',
 attribution:'Original procedural mesh; alignment and outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'175 m, 40 m overall, five 29 m river openings and 41 upper arcade openings. Vertical sections, pier thicknesses, stone coursing, balustrades and lamps estimated; 100 m flat-map approach ramps and tapered separated road ribbons.',
};
