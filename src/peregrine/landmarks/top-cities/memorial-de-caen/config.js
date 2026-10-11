import { ORIGIN, HEIGHT, BACK } from './memorial-de-caen-plan.js';
import { FOOTPRINTS } from './footprint.js';
// Jacques Millet's 1988 peace museum, with its later west wing and immersive room.
export const SPEC = {
  id: 'memorial-de-caen', name: 'Mémorial de Caen', kind: 'building',
  ready: true,
  origin: ORIGIN, height: HEIGHT, padM: 143,
  frontageBearing: (Math.atan2(-BACK[0], BACK[1]) * 180 / Math.PI + 360) % 360,
  // Broad site and sloping garden edges: bounded rigid datum, never a baked DEM.
  terrainPad: { rings: FOOTPRINTS, refs: [ORIGIN, [-0.38412,49.19715],[-0.38565,49.19785]], datum: 'median', featherM: 6 },
};
export const PALETTES = {
  light: { stone: '#d7d1bc', stoneWarm: '#d4cfb9', joint: '#b5b1a0', roof: '#838b87', metal: '#292728', steel: '#705244', softRoof: '#758267', glass: '#397080', glow: '#365563' },
  dark: { stone: '#777c7a', stoneWarm: '#747971', joint: '#616862', roof: '#3e484d', metal: '#191e24', steel: '#58483e', softRoof: '#424e42', glass: '#254650', glow: '#b99c69' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local museum grade y=0; no sea level, terrain or Mercator stretch baked in.',
  attribution: 'Original procedural model by Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1988 bare Caen-stone facade and full-height entrance fracture, later west wing and 2019 matte-black immersive drum. Heights except the immersive 4 m sheet skin (8 m structural frame), roof treatment, fracture width and cylinder position are estimates. Rotation baked from mapped controls. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
