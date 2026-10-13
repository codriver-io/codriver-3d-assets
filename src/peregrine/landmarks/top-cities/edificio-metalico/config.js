// Original procedural school exterior. Horizontal dimensions mapped; heights estimated from photos.
export const SPEC = {
  id:'edificio-metalico', name:'Edificio Metálico', kind:'building', ready: true,
  origin:[-84.074372,9.93615065], height:17.8, padM:38, frontageBearing:175.24,
};
export const ANGLE = -4.76*Math.PI/180;
export const PALETTES = {
 light:{panel:'#a39791', relief:'#b5a59c', trim:'#d0bc8b', base:'#84726b', roof:'#b4b3a6', glass:'#4b6267', door:'#694447', iron:'#424a43'},
 dark:{panel:'#585659', relief:'#646062', trim:'#82785f', base:'#49464b', roof:'#666e70', glass:'#263b45', door:'#41333b', iron:'#303b40'},
};
export const MANIFEST = {
 elevationDatum:'Rigid local grade y=0; no altitude, DEM or Mercator stretch baked into the model.',
 attribution:'Original procedural geometry. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'Two-storey prefabricated Belgian iron school inaugurated in 1896. OSM 61 × 44 m outer envelope and notched courtyard. Heights, metal relief, roof slopes and rear elevations estimated from photos. Muted grey-mauve panels and cream/ochre framing follow the supplied dated references; current paint is unverified.',
};
