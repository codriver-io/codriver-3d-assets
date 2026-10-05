// Original exterior, real metres at local grade. Heights are photo estimates.
export const SPEC = {
  id: 'teatro-nacional-de-costa-rica', name: "Teatro Nacional de Costa Rica", kind: 'building',
  ready: true,
  origin: [-84.07697215, 9.93315805],
  height: 26, padM: 41, frontageBearing: 263.7,
};
export const ANGLE = -96.3 * Math.PI / 180;
export const PALETTES = {
  light: { stone: '#b5a58b', rustication: '#77766b', trim: '#d1c2a6', roof: '#934134', iron: '#292e2e', glass: '#9aa5a0', light: '#bcae8e', sculpture: '#d8d2bf' },
  dark: { stone: '#625d54', rustication: '#434a4d', trim: '#8e826c', roof: '#562c2c', iron: '#202a31', glass: '#485559', light: '#f4cd85', sculpture: '#b4aea0' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Original procedural exterior; OSM plan 72.74 × 32.46 m, orientation baked once. Vertical dimensions, stage-house profile, side/rear windows and simplified rooftop allegories estimated from photographs. No survey height found; no textures or reference meshes.',
};
