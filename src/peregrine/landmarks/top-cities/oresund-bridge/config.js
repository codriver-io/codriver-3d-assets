import { BUILDING_FOOTPRINTS } from './footprint.js';
// Current 2000 road/rail bridge; tunnel and Peberholm landscaping excluded.
export const SPEC = {
  id:'oresund-bridge',name:'Øresund Bridge',kind:'bridge',ready: true,
  origin:[12.8270015,55.575176],height:204,padM:5200,
  buildingFootprints:BUILDING_FOOTPRINTS,
  frontageBearing:111.5,rangeM:18000,nearM:2300,terrainPolicy:'absolute-deck',
};
export const PALETTES = {
  light:{concrete:'#c2beb0',steel:'#586b73',cable:'#9ea7a5',asphalt:'#525a60',paint:'#e5e5dc',rail:'#829095',ballast:'#787a75',lamp:'#c2beb0'},
  dark:{concrete:'#626f77',steel:'#394c57',cable:'#91a2a9',asphalt:'#303a42',paint:'#a7b4bc',rail:'#607c8a',ballast:'#4b5359',lamp:'#d1dbdf'},
};
export const MANIFEST = {
  elevationDatum:'Local y=0 is visual water/flat-map grade; crown 204 m, main-span soffit 57 m. Absolute deck and local foundations fitted separately at runtime. No DEM or Mercator stretch is baked in.',
  attribution:'Original procedural geometry. Mapped E20 alignment and bridge outlines © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note:'Published 490 m main span, 7845 m overall, 23.5 m width, 160 stays; 204 m rounded crown (operator gives 203.5 m). Estimated deck thickness, pylon/pier sections, rail detail and anchor hardware. Flat-map grade connections are a visual compromise.',
};
