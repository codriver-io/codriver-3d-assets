import { ORIGIN, HEIGHT } from './perot-museum-plan.js';
export const SPEC = {
  id:'perot-museum', name:'Perot Museum of Nature and Science', kind:'building',
  ready: true, origin:ORIGIN, height:HEIGHT, padM:68, frontageBearing:147,
};
export const PALETTES = {
 light:{stone:'#b9b6ac',relief:'#b4b1a7',glass:'#527777',glow:'#779b98',frame:'#879997',metal:'#4e5856',landscape:'#777b59'},
 dark:{stone:'#646e76',relief:'#616b73',glass:'#30494d',glow:'#9ba99a',frame:'#6c8286',metal:'#303e46',landscape:'#424e43'},
};
export const MANIFEST = {
 elevationDatum:'Rigid local flat-map grade y=0; no terrain or sea-level elevation baked into mesh.',
 attribution:'Original procedural mesh by Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Morphosis 2012 museum; height 170 ft (51.816 m), mapped 45.3 × 47.7 m cube footprint. Striations, atrium cut, landscape roof and escalator proportions estimated from photos; casing approximately 150 ft. Opaque glass; interiors omitted. Cityscape and Full 3D world integration not tested yet.',
};
