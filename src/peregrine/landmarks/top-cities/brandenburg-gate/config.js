// Current sandstone gate and 1867–68 portico wings; no Berlin Wall or temporary event fixtures.
export const SPEC = {
  id: 'brandenburg-gate', name: 'Brandenburg Gate', kind: 'building', ready: true,
  origin: [13.37770245, 52.516274925], height: 26, padM: 36,
  frontageBearing: 83.4856985601169, axisDeg: 96.5143014398831,
  // Main roof outline OSM 518071791; northern facade edge controls orientation.
  columns: [-15.25, -9.85, -4.2, 3.25, 8.85, 15.25],
};
export const PALETTES = {
  light: { stone:'#b8ae93', trim:'#c9bea3', relief:'#a69b80', bronze:'#4c7667', roof:'#75877b', recess:'#4a4941' },
  dark: { stone:'#77766a', trim:'#938d77', relief:'#69695e', bronze:'#3c6058', roof:'#505e59', recess:'#303b3b' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat plaza grade y=0; rigid foundations, no terrain/sea-level/Mercator stretch baked.',
  attribution: 'Original procedural geometry. Geographic footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1791 gate with later portico wings; dimensions from visitBerlin and mapped OSM parts. Quadriga, relief, Doric details and wing roof pitches are original simplified estimates. Rotation is baked once; Cityscape and Full 3D world integration are checked separately.',
};
