import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'palacio-de-cibeles', name: 'Palacio de Cibeles', kind: 'building', ready: true,
  origin: [-3.69208,40.41891], height: 70, padM: 95, frontageBearing: 308,
  terrainPad: { rings: [FOOTPRINTS[0]], datum: 'median', featherM: 10 },
};
export const PALETTES = {
  light: { stone: '#dedbd0', glass: '#414e51', roof: '#838c89', glow: '#727b76', clock: '#eee5d3', iron: '#414845' },
  dark: { stone: '#8d979f', glass: '#273b49', roof: '#4a5965', glow: '#bd9563', clock: '#ddc798', iron: '#3b4950' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid palace foundation on local y=0; no absolute elevation or terrain baked into the model.',
  attribution: 'Original procedural model by Codriver. Mapped geometry © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright. Reference photographs by Carlos Delgado, Tamorlan and Concepcion AMAT ORTA (Commons; images not redistributed).',
  note: '70 m octagonal tower sourced from Madrid heritage record; other heights, bay spacing and ornament are estimates. Original texture-free exterior; Fountain of Cibeles excluded. Cityscape and Full 3D world integration not tested yet.',
};
