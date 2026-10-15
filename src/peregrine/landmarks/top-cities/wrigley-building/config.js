// Original procedural reconstruction of the completed 1921/1924 complex.
export const SPEC = {
  id: 'wrigley-building', name: 'Wrigley Building', kind: 'building', ready: true,
  origin: [-87.62486, 41.88971], height: 134, padM: 62, frontageBearing: 124,
};
export const PALETTES = {
  light: { terra: '#f2efe6', trim: '#faf7ee', roof: '#a9aaa1', glass: '#929a99', glow: '#a2aaa6', dial: '#f6f3e5', metal: '#373e3c' },
  dark: { terra: '#6d7a85', trim: '#9aa7ac', roof: '#39454e', glass: '#253a48', glow: '#d9b36e', dial: '#e1d7b0', metal: '#222b32' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid building on local grade y=0; no absolute elevation or terrain baked into the model.',
  attribution: 'Original procedural geometry; mapped footprints © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
  note: 'Completed two-tower 1924 complex. Published 134 m tip and 5.97 m clock dials; mapped perimeter and tower bearing. Facade levels, relief, lantern and bridge dimensions estimated from photographs; Cityscape and Full 3D world not tested yet.',
};
