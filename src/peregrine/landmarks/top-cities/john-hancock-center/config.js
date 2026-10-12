// 875 North Michigan Avenue, Chicago. Dimensions: CTBUH; plan: OSM.
export const SPEC = {
  id: 'john-hancock-center', name: '875 North Michigan (John Hancock Center)', kind: 'building',
  ready: true, origin: [-87.62309465, 41.8988181], height: 456.9,
  roofM: 343.7, baseWidthM: 82.3, baseDepthM: 52.8, roofWidthM: 48.9, roofDepthM: 31.0,
  rotation: 0.0195, padM: 57, frontageBearing: 268.88,
};
export const PALETTES = {
  light: { skin: '#373630', glass: '#4d4c43', glow: '#45463f', structure: '#282a29', columns: '#292b2a', roof: '#323430', antenna: '#a2a4a0' },
  dark: { skin: '#171e24', glass: '#202a30', glow: '#a28b60', structure: '#262e34', columns: '#262e34', roof: '#202930', antenna: '#606e79' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; no terrain, sea-level altitude or Mercator stretch baked in.',
  attribution: 'Original procedural model by Codriver. Footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '343.7 m architectural height, 456.9 m tip, 100 storeys: CTBUH. Mapped base/roof envelope and antenna locations; five X tiers, facade bays, masts and entrance canopies simplified from reference photographs. Rotation baked into vertices. Cityscape and Full 3D world not tested; integration checked separately.',
};
