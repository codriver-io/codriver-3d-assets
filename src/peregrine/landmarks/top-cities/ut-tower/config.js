import { FOOTPRINTS } from './footprint.js';
// Paul Philippe Cret's 1937 Main Building, without temporary restoration works.
export const SPEC = {
  id:'ut-tower', name:'University of Texas Tower', kind:'building', ready: true,
  origin:[-97.7393684,30.2862733], // centre of the mapped upper shaft
  height:307*.3048, // UT's published 307 feet; commonly rounded to 94 metres
  padM:58, frontageBearing:184.9,
  terrainPad:{rings:[FOOTPRINTS[0]],datum:'median',featherM:12,
    refs:[[-97.7393684,30.2862733],[-97.7394,30.28581],[-97.73965,30.2861],[-97.7391,30.2861]]},
};
export const PALETTES = {
  light:{stone:'#c6c0ac',glow:'#cbc5b2',light:'#49595a',roof:'#805147',shadow:'#292c2b',brick:'#af7960',gold:'#b29a49',lamp:'#dbd5b7'},
  // Stylised all-orange celebration, one of UT's documented lighting configurations.
  dark:{stone:'#747a7b',glow:'#c76d27',light:'#efd5a2',roof:'#514845',shadow:'#171c1d',brick:'#775d51',gold:'#dac56a',lamp:'#fff1c0'},
};
export const MANIFEST = {
  elevationDatum:'Local flat-map entrance grade y=0; rigid building, no DEM or sea-level altitude baked in.',
  attribution:'Original procedural geometry for Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note:'1937 historic exterior without temporary 2024–2027 restoration scaffolding. Overall height 307ft; intermediate heights, crown details and window counts estimated from photographs. Dark palette represents an all-orange celebration, not everyday white illumination.',
};
