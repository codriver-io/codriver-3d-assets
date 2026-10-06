// Present exterior following the 2012–2014 terra-cotta restoration.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'alberta-legislature-building', name: 'Alberta Legislature Building', kind: 'building',
  ready: true, origin: [-113.50661, 53.53369], height: 57, padM: 59,
  frontageBearing: 359.83, rotationDeg: 0.17,
  terrainPad: { rings: [FOOTPRINTS[0]], refs: [
    [-113.50662,53.53386], [-113.50715,53.53374], [-113.50610,53.53374],
    [-113.50663,53.53340], [-113.50663,53.53325],
  ], datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { stone: '#c3b08a', trim: '#ddc9a0', granite: '#9b9a91', terra: '#88694f', roof: '#747870', glass: '#34444b', light: '#404440', metal: '#4e524e' },
  dark: { stone: '#786449', trim: '#c39756', granite: '#605d55', terra: '#967442', roof: '#343a3e', glass: '#131d26', light: '#ffdb91', metal: '#323b42' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is grade beside the raised granite basement; no absolute elevation or terrain baked in. Full 3D world declares a rigid bounded median pad over the building outline, with distributed level-site refs and 8 m feather; terrain integration is not tested.',
  attribution: 'Original procedural geometry. Mapped outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published overall height 57 m (CTBUH); restoration authors give 54 m to major dome peak. Model lantern roof reaches 55.7 m and estimated finial reaches 57 m. Mapped T-plan and dome locations; sourced eight dome ribs, granite basement, Paskapoo sandstone walls, terra-cotta domes. Other vertical subdivisions, windows, columns and ornament are photo estimates. Plaza/fountain excluded.',
};
