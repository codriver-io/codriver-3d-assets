// Restored church exterior; construction equipment and adjoining service building omitted.
export const SPEC = {
  id:'eglise-saint-pierre-caen', name:'Église Saint-Pierre de Caen', kind:'building', ready:true,
  origin:[-0.3609,49.18402], height:75, padM:49, frontageBearing:320,
};
export const PALETTES = {
  light:{stone:'#918b7c',trim:'#aaa394',ornament:'#797568',roof:'#454744',recess:'#292e30',glass:'#505b59',glow:'#5b5e56'},
  dark:{stone:'#585b59',trim:'#767972',ornament:'#656760',roof:'#272e36',recess:'#182029',glass:'#263841',glow:'#a58a58'},
};
export const MANIFEST = {
  elevationDatum:'Rigid foundation at local flat pavement y=0. No terrain, altitude or latitude stretch baked in.',
  attribution:'Original procedural model. Geographic outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note:'City of Caen gives 75 m stone spire and no transept. Church envelope mapped from OSM way 154620108; SE axis approximately 140 degrees from two outline controls. Nave/chevet heights, Gothic tracery, Renaissance relief and spire crockets are photographic estimates. Scaffold-free restored exterior; interiors and adjoining buildings omitted. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
