// Original procedural reconstruction of the 1993 Jean Nouvel opera house.
export const SPEC = {
  id: 'opera-de-lyon', name: 'Opéra de Lyon', kind: 'building', ready: true,
  origin: [4.8366, 45.76778905], height: 42, padM: 40,
  frontageBearing: 278.6, gridAngle: 0.15,
  stoneHeight: 22, roofRise: 20, roofRadius: 17.9,
};
export const PALETTES = {
  light: { stone: '#c7bfae', trim: '#b5ad9c', glass: '#36454e', steel: '#838a8c', shutter: '#4e5456', glow: '#4b4c4d' },
  dark: { stone: '#66665e', trim: '#55564f', glass: '#17232a', steel: '#4f5960', shutter: '#30383c', glow: '#d42635' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0. No DEM, altitude or latitude stretch is baked into the GLBs.',
  attribution: 'Original procedural geometry for Codriver. Mapped outline © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photographs comparison only; no textures or third-party meshes.',
  note: '1993 Jean Nouvel glass barrel vault on the preserved 1831 stone facades. 42 m height and 20 m roof rise from OSM, not a survey. Arcade/window proportions, statue poses, louvers and nonparallel facade fit estimated from photographs. Interiors and basement omitted; integration tested separately.',
};
