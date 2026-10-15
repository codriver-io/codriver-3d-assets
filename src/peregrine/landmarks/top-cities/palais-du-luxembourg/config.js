import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id:'palais-du-luxembourg', name:'Palais du Luxembourg (Sénat)',kind:'building',ready: true,
  origin:[2.33722,48.84833],height:34.595,padM:85,frontageBearing:182,
  terrainPad:{rings:FOOTPRINTS,refs:[[2.33722,48.84833],[2.33722,48.848]],datum:'median',featherM:12},
};
export const PALETTES={
  light:{trim:'#c9c0ac',stone:'#bcb39e',roof:'#5d6873',glass:'#34464a',glow:'#435354',metal:'#81898a',frame:'#c3bba9'},
  dark:{trim:'#757167',stone:'#64635d',roof:'#29333d',glass:'#22323c',glow:'#ad9260',metal:'#5c6974',frame:'#6e6a60'},
};
export const MANIFEST={
  elevationDatum:'Rigid local grade y=0; no DEM altitude or Mercator stretch baked into the GLB.',
  attribution:'Original procedural geometry; mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note:'Present Senate complex including the Gisors garden extension; OSM part heights and mapped envelope, photograph-estimated windows, carved orders and lanterns. Cityscape and Full 3D world static appearance captured from a scratch app bundle; terrain refinement, lifecycle and hardware not tested.',
};
