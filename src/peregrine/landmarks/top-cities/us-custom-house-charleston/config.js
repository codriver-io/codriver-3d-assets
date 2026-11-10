import {FOOTPRINTS} from './footprint.js';
export const SPEC={
 id:'us-custom-house-charleston',name:'United States Custom House',kind:'building',ready:true,
 origin:[-79.926472,32.780822],height:23,padM:44,frontageBearing:263.36,rotation:6.64*Math.PI/180,
 terrainPad:{rings:FOOTPRINTS,refs:[[-79.9267854,32.7808976],[-79.9267569,32.7806903],[-79.9261878,32.7809571]],datum:'median',featherM:3},
};
export const PALETTES={
 light:{plaster:'#dedbd0',roof:'#85918e',glass:'#56656a',shadow:'#343c3e',bronze:'#6c6250'},
 dark:{plaster:'#9ea8a8',roof:'#46595d',glass:'#364a55',shadow:'#253138',bronze:'#514f43'},
};
export const MANIFEST={
 elevationDatum:'Local y=0 at foot of the monumental stairs; rigid podium and body, no terrain, absolute altitude or Mercator scale baked in.',
 attribution:'Original procedural geometry for Codriver. Mapped plan © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Present completed 1879 Roman Corinthian Custom House, not Old Exchange, and not the unbuilt domed proposal. NPS nomination cites 249 × 152 ft historic cross-plan description; mapped masonry footprint is approximately 56.3 × 39.8 m, while the stairs extend the model to 76 m. Overall 23 m is an unsurveyed OSM/photo estimate. Column, podium, pediment and window sizes estimated. Geographic yaw baked once. Cityscape: not tested; Full 3D world: not tested.',
};
