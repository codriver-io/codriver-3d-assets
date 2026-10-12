import { FOOTPRINTS } from './footprint.js';

// Cuartel Bellavista in its museum state: historic west stair and modern entrance.
// Height is a photographic estimate, not a published survey dimension.
export const ANGLE = -Math.atan2(4.28, 78.78);
export const SPEC = {
  id: 'museo-nacional-de-costa-rica', name: 'Museo Nacional (Cuartel Bellavista)',
  kind: 'building', ready: true, origin: [-84.07139, 9.93278],
  height: 14.6, padM: 64, frontageBearing: 266.89,
  terrainPad: {
    rings: FOOTPRINTS, datum: 'median', featherM: 5,
    refs: [[-84.07169,9.93299],[-84.07144,9.93294],[-84.07159,9.93254]],
  },
};
export const PALETTES = {
  light: { ochre: '#c99f48', cream: '#eee5ce', stone: '#8b8577', roof: '#835447', glass: '#789997', window: '#40565e', metal: '#394847', garden: '#5e7450' },
  dark: { ochre: '#756348', cream: '#a6a091', stone: '#646a6b', roof: '#514747', glass: '#475e64', window: '#344954', metal: '#34424a', garden: '#394c40' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local base y=0 at the plaza-side stair foot; historic upper terrace at +3.2 m, no DEM or absolute altitude baked in.',
  attribution: 'Original procedural model for Codriver, CC BY 4.0; source MIT. Mapped outline © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
  note: 'Mapped outer envelope and facade bearing; heights, terrace levels, windows and pavilion proportions are photo/official-plan estimates. Rotation baked once. Cityscape and Full 3D world not tested; placement checked separately.',
};
