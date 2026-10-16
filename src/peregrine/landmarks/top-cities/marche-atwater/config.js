// Marché Atwater, 1933 market hall. Dimensions and frame: docs/3d-top-cities-marche-atwater.md.
export const SPEC = {
  id:'marche-atwater', name:'Marché Atwater', kind:'building', ready: true,
  origin:[-73.57680719129334,45.47947131669461], height:36.5,
  padM:70, frontageBearing:319, axisBearing:139,
};
export const PALETTES = {
  light:{brick:'#c1af86', roof:'#626965', canopy:'#a6aea2', glass:'#414b48', metal:'#655944', clock:'#252b28', mark:'#e2dbc7', sign:'#abac84'},
  dark:{brick:'#686656', roof:'#343d3b', canopy:'#65736b', glass:'#303f3c', metal:'#4b4940', clock:'#1b2426', mark:'#d3c8a7', sign:'#d5bb7d'},
};
export const MANIFEST = {
  elevationDatum:'Rigid local grade y=0; no terrain, sea-level or Mercator stretch baked into geometry.',
  attribution:'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note:'1933 Art Deco market by Ludger and Paul Lemieux. Main hall 115 × 18 m from architectural reference; 130 × 36 m mapped canopy envelope. Grounded NW tower 36.5 m, stepped NW pavilion 20 m, hall heights and facade details are photo-scaled estimates. Rotation baked once at 41° about Y. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
