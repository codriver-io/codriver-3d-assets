// Original present-day former courthouse exterior; 1907–1911 construction, opened 1911.
export const SPEC = {
  id: 'vancouver-art-gallery', name: 'Vancouver Art Gallery (Robson Square)', kind: 'building',
  ready: true, origin: [-123.12046, 49.28287], height: 26.5, padM: 75,
  frontageBearing: 44.515682,
};
export const PALETTES = {
  light: { foundation:'#696d70', stone:'#929496', trim:'#a1a3a3', copper:'#3c4945', glass:'#27343a' },
  dark: { foundation:'#363b40', stone:'#62686d', trim:'#788087', copper:'#293b36', glass:'#716b55' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid foundation at local grade y=0; entrance landing estimated at +3.2 m. No DEM, sea level or Mercator stretch baked in.',
  attribution: 'Original procedural geometry, Codriver 2026. Geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'OSM envelope and part heights; copper dome apex follows OSM 26.5 m, profile estimated from exterior photographs (OSM roof-height conflicts with min-height). Ionic capitals, lions, facade bays and stair dimensions are stylised estimates. Rotation baked once. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
