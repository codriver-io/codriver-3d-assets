// Canadian Museum for Human Rights, Antoine Predock, completed 2014.
export const SPEC = {
  id: 'canadian-museum-for-human-rights', name: 'Canadian Museum for Human Rights', kind: 'building',
  ready: true, origin: [-97.131, 49.8908], height: 100, padM: 90,
  frontageBearing: 177, nearM: 700,
};
export const PALETTES = {
  light: { stone: '#c1b797', stoneWarm: '#c7bda3', glass: '#7eabbc', glassPale: '#84b0c0', glassDeep: '#77a4b4', frame: '#6b8188', roof: '#8f938c', grass: '#707345', glow: '#a2b6bb', towerClear: '#b7d1d6' },
  dark: { stone: '#66655d', stoneWarm: '#6d6b61', glass: '#334f5b', glassPale: '#3d5b64', glassDeep: '#304650', frame: '#889499', roof: '#646b6d', grass: '#485145', glow: '#e4c986', towerClear: '#738d99' },
};
export const MANIFEST = {
  elevationDatum: 'Local plaza grade y=0; rigid structure, no terrain or absolute elevations baked in.',
  attribution: 'Original procedural model by Codriver; mapped outlines © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photographs are not redistributed.',
  note: '100 m tower sourced from CMHR; stone gallery/roots and cloud envelopes from OSM. Freeform glass folds, limestone course pattern, curved roof profiles and tower taper estimated from reference photographs. Rotation is baked into east/up/south coordinates. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
