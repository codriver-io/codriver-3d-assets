import { FOOTPRINTS } from './footprint.js';
// Permanent 1977 building, after the 2021 Chenille renovation; temporary works omitted.
export const SPEC = {
 id:'centre-pompidou', name:'Centre Pompidou', kind:'building', ready: true,
 origin:[2.352443,48.860534], height:42, padM:90, frontageBearing:290,
 length:166, width:60, axisBearing:20,
 terrainPad:{rings:FOOTPRINTS,refs:[[2.352443,48.860534]],datum:'median',featherM:5},
};
export const PALETTES = {
 light:{frame:'#d1d5cf',glass:'#728a8d',roof:'#9ca5a3',blue:'#167aab',green:'#368e74',yellow:'#d2aa32',red:'#bc3e35',glow:'#819795'},
 dark:{frame:'#87989d',glass:'#304c59',roof:'#606f79',blue:'#285d83',green:'#337063',yellow:'#9b853b',red:'#893d39',glow:'#d3c694'},
};
export const MANIFEST = {
 elevationDatum:'Rigid local building grade y=0; no DEM, altitude or Mercator stretch baked into geometry.',
 attribution:'Original procedural geometry, Codriver 2026. Mapped placement © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'Official dimensions 166 × 60 × 42 m; mapped 20° axis baked into export. Frame sections, pipe routing, glazing, gerberettes and escalator landings are photo estimates. Opaque glass; temporary 2025–2030 renovation coverings omitted. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
