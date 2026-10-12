// Current 2009 crossing; sources and estimated sections documented alongside the model.
export const SPEC={id:'golden-ears-bridge',name:'Golden Ears Bridge',kind:'bridge',ready: true,
  origin:[-122.666333,49.19901],height:84,padM:1250,frontageBearing:169.7,
  rangeM:6500,nearM:1800,terrainPolicy:'absolute-deck'};
export const PALETTES={
  light:{concrete:'#c6c4b7',tower:'#d0ccbd',steel:'#766960',cable:'#b6bec0',asphalt:'#555d63',paint:'#eceadf',rail:'#9faeb1',gold:'#ae9253',landing:'#ffffff'},
  dark:{concrete:'#74838a',tower:'#8b9ba4',steel:'#596b76',cable:'#a2b8c4',asphalt:'#303c47',paint:'#b9bdbe',rail:'#889fae',gold:'#b49c65',landing:'#ffffff'}};
export const MANIFEST={
  elevationDatum:'Local y=0 is flat-map/water grade; road 44 m, main girder soffit 40 m, pylons 84 m. Deep foundations omitted. No DEM or Mercator stretch baked into geometry. Absolute-deck policy fits approaches and support feet separately.',
  attribution:'Original procedural geometry. Geographic alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note:'SEABC 2017: 968 m main crossing, 3 × 242 m main spans and 2 × 121 m side spans, 1442 m approaches. Supplier/operator pages round to 976 m / 244 m / 122 m. Four paired H supports, 40 m pylon rise, six lanes and two protected paths. Width from mapped Esri-attributed cycle paths (~32.8 m); section sizes, 10 stays per fan, eagle silhouettes and local 44 m road datum estimated.'};
