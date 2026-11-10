import {FOOTPRINTS} from './footprint.js';
export const SPEC={
 id:'pineapple-fountain-charleston',name:'Pineapple Fountain',kind:'building',ready:true,
 origin:[-79.925191,32.778087],height:4.0,padM:5.6,frontageBearing:90,
 terrainPad:{rings:FOOTPRINTS,refs:[[-79.9251359,32.7780974],[-79.9252476,32.7780863],[-79.9251886,32.7780399]],datum:'median',featherM:1},
};
export const PALETTES={
 light:{basin:'#b4a18b',bronze:'#514735',patina:'#5c6551',water:'#b8c6c3',pool:'#465a60'},
 dark:{basin:'#817a6d',bronze:'#615742',patina:'#414e47',water:'#657e86',pool:'#2f424e'},
};
export const MANIFEST={
 elevationDatum:'Rigid local plaza pavement y=0 at the outside basin foot; no absolute altitude, water-level datum, terrain or Mercator scale baked in.',
 attribution:'Original procedural geometry for Codriver. Mapped basin © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'1990 Pineapple Fountain in Waterfront Park, not the separate Vendue splash fountain. Basin 10.6 m diameter from OSM way 1356302855. Overall 4 m is an unsurveyed OSM/photo estimate. Broad tier diameters, supports and leaf crown are photographic estimates. Static representative low-water phase, not simulation. Rotational sculpture has no surveyed facade; geography already baked. Cityscape: not tested; Full 3D world: not tested.',
};
