// Contemporary Château de Vincennes, with the truncated outer towers (not a medieval reconstruction).
export const SPEC = {
  id: 'chateau-de-vincennes', name: 'Château de Vincennes', kind: 'building', ready: true,
  origin: [2.43583, 48.84278], height: 52, padM: 200, frontageBearing: 352.5,
};
export const PALETTES = {
  light: { stone: '#b5aa90', trim: '#c9bfa6', roof: '#404749', glass: '#303736', moat: '#353b32' },
  dark: { stone: '#656459', trim: '#777467', roof: '#282f35', glass: '#1d282c', moat: '#202924' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local y=0 courtyard grade, real metres east/up/south. Moat floor/scarps descend to y=-2.9 m with a dark grade-mouth fallback; no host terrain excavation; no absolute altitude or DEM baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped plans © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Keep 52 m (OSM and CMN), core about 16.5 m, corner turrets 6.6 m diameter; chapel ridge 38.8 m and pinnacles 30.4 m from OSM LiDAR tags. Outer enclosure and palace wings mapped; steep palace ridges are photo-estimated above OSM eaves (up to 34.7 m); roof sections, fenestration and ornament estimated from photos. Dry moat has 2.9 m below-grade floor/scarps and a dark surface fallback where host ground occludes it; no host terrain is modified. Barracks have three separate pitched roofs; pavilions retain continuous pitched ridges. Cityscape and Full 3D world visual placement checked with the scratch app bundle; terrain arrival, mode transitions and lifecycle certification remain separate.',
};
