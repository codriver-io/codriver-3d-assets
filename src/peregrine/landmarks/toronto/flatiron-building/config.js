// Gooderham (Flatiron) Building, 49 Wellington St E, Toronto: David Roberts Jr., 1892.
// Facts and estimates are itemised in docs/3d-toronto-flatiron-building.md; the short
// version: footprint from OSM way 300884214, 16.7 m to the cornice (Wikipedia), the
// turret and cone are measured off photographs (estimated, +-1 m).
export const SPEC = {
  id: 'flatiron-building', name: 'Gooderham (Flatiron) Building', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-79.3743335, 43.6483791], // area centroid of OSM way 300884214
  height: 26, // m, to the tip of the turret finial (estimated from photographs)
  padM: 30, // terrain pad radius, m: the wedge is 40 m long
  frontageBearing: 65, // the rounded apex, and the turret, face east-north-east (Church St)
};
// Same keys in both themes. Brick and stone are the warm reds of the photographs,
// slate is the mansard, copper is the patinated cone, cornice and dormer trim.
export const PALETTES = {
  light: {
    brick: '#b4553f', recess: '#8d3d31', stone: '#b9704f', slate: '#565b63', roof: '#8f918d',
    copper: '#5fae97', glass: '#3f4c55', iron: '#20242a', glow: '#46545d',
  },
  dark: {
    brick: '#6d4340', recess: '#4e2f30', stone: '#73534a', slate: '#2f353d', roof: '#585a5d',
    copper: '#3b7a6e', glass: '#232f38', iron: '#101418', glow: '#ffcd82',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The model stands on its own battered stone plinth (Toronto Front St / Church St ground is close to level here).',
  attribution: 'Original procedural mesh. Mapped footprint (c) OpenStreetMap contributors (ODbL 1.0), way 300884214; https://www.openstreetmap.org/copyright',
  note: 'Wedge outline, 16.7 m cornice and 5 storeys are published or mapped; turret height, bay count, window sizes, fire-escape and dormer positions are estimated from photographs. The west gable end is not photographed and is drawn plainly. The neighbouring mural is not part of the model.',
};
