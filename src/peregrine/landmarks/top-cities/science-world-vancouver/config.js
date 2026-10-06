import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id:'science-world-vancouver', name:'Science World', kind:'building', ready:true,
  origin:[-123.10391135,49.27334995], height:47.2, padM:78, frontageBearing:115,
  diameter:40, sphereCenterY:27, collarY:15,
  // Waterfront: avoid the minimum of a pad crossing the water. Proposed, untested.
  terrainPad:{rings:[FOOTPRINTS[0]],datum:'median',featherM:6,
    refs:[[-123.103031,49.27334],[-123.10308,49.27365],[-123.10316,49.27303]]},
};
export const PALETTES = {
 light:{panel:'#879aa9',panelBright:'#c0ccd3',panelDark:'#536c80',steel:'#d3d8db',red:'#c83539',glass:'#47697c',roof:'#b7b9b6',concrete:'#c8cbc5',light:'#e3dfbb',glow:'#d8d4b8'},
 dark:{panel:'#243d50',panelBright:'#527086',panelDark:'#182834',steel:'#6b8394',red:'#813637',glass:'#4c6b78',roof:'#525e68',concrete:'#707d86',light:'#ffe3a6',glow:'#e0ac67'},
};
export const MANIFEST = {
 elevationDatum:'Local waterfront plaza grade y=0; rigid metric building, no sea-level/DEM heights baked in.',
 attribution:'Original procedural mesh; mapped footprint © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photographs used only for visual comparison, not embedded.',
 note:'Permanent silver Expo 86 dome and post-2011 podium; excludes temporary FIFA 2026 wrap. Dome 40 m diameter, approximately 47 m overall height. Panel frequency, lamps, facade rhythm and roof equipment estimated from photographs; waterfront median terrain pad proposed, not tested.',
};
