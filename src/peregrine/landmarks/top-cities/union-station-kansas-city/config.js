// Kansas City Union Station (Jarvis Hunt, 1914); OSM facade controls define the baked -18° rotation.
import { FOOTPRINTS } from './footprint.js';
export const PLAN = { angleDeg: -18 };
export const SPEC = {
  id: 'union-station-kansas-city', name: 'Kansas City Union Station', kind: 'building',
  ready: true, origin: [-94.5853, 39.0848], height: 32.8, padM: 130, frontageBearing: 162,
  terrainPad: { rings: FOOTPRINTS, refs: [[-94.5853,39.0848],[-94.5858,39.08465],[-94.5847,39.0849]], datum: 'median', featherM: 12 },
  hallCeilingM: 28.956, clockDiameterM: 1.8288,
};
export const PALETTES = {
 light: { stone:'#bcb5a3', trim:'#d0c8b5', base:'#918d81', roof:'#8d948c', glass:'#303d40', metal:'#454b48', glow:'#e1d7ba' },
 dark: { stone:'#66727c', trim:'#8a949b', base:'#4b5863', roof:'#414e58', glass:'#233944', metal:'#273541', glow:'#eac78b' },
};
export const MANIFEST = {
 elevationDatum: 'Rigid local grade y=0; no terrain, absolute elevation or Mercator stretch baked in.',
 attribution: 'Original procedural model for Codriver. Geographic data © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
 note: 'OSM mapped footprint and -18 degree facade rotation; official 95-foot Grand Hall ceiling and six-foot clock. Exterior heights, arch dimensions and roof profiles are photographic estimates. Cityscape and Full 3D world integration not tested.',
};
