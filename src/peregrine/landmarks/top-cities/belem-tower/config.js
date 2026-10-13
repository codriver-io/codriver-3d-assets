// Tower of Saint Vincent, Lisbon. Rotation is baked into geometry.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'belem-tower', name: 'Belém Tower', kind: 'building', ready: true,
  origin: [-9.2159, 38.6917215], height: 30, padM: 32, frontageBearing: 170.49,
  terrainPad: { rings: FOOTPRINTS, refs: [FOOTPRINTS[3]], datum: 'median', featherM: 3 },
};
export const PALETTES = {
  light: { stone: '#b7ad99', recess: '#38362e' },
  dark: { stone: '#736e60', recess: '#242a2c' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the water-level masonry footing; no sea-level altitude or terrain baked into the asset.',
  attribution: 'Original procedural geometry by Codriver. Mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '30 m four-storey lioz tower; mapped 12.1 m core and bastion outline. Terrace, arch, turret and ornament dimensions estimated from photographs. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
