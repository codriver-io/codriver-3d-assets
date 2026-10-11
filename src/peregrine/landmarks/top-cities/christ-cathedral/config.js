// 1980 glass shell, 2019 rededication, detached 1990 Crean Tower.
export const SPEC = {
  id: 'christ-cathedral', name: "Christ Cathedral", kind: 'building',
  ready: true,
  origin: [-117.89893, 33.7874],
  height: 71.9328, cathedralHeight: 39.0144,
  padM: 69,
  frontageBearing: 178.86,
};
export const PALETTES = {
  light: { glass: '#628598', glassPale: '#6d8fa0', glassDeep: '#5b7e91', lattice: '#d2dce0', steel: '#b9c8cf', shadow: '#334854', stone: '#dedbd0', bronze: '#8d6f43', glow: '#628598' },
  dark: { glass: '#354d61', glassPale: '#52687b', glassDeep: '#293e50', lattice: '#8c9ba5', steel: '#8c9ea8', shadow: '#202f3b', stone: '#7b8490', bronze: '#705f48', glow: '#b9a584' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Mapped 128 × 63 m four-point shell; structural engineer gives 128 ft height; Crean Tower 236 ft from parish. Roof folds, glazing divisions, chapel and spire reed arrangement estimated from photos. Exterior only; app integration checked separately.',
};
