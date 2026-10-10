import { ORIGIN, HEIGHT, geographic } from './farris-bad-plan.js';
export const SPEC = {
  id: 'farris-bad', name: 'Farris Bad', kind: 'building', ready: true,
  origin: ORIGIN, height: HEIGHT, padM: 59, frontageBearing: 330.37,
  // Shore-side samples avoid taking a seabed pixel as a foundation datum.
  terrainPad: {
    rings: [[[0,-32],[16,-32],[16,-57],[0,-57]].map(([u,v]) => geographic(u,v)),
      [[45,-5],[66,-5],[66,-56],[45,-56]].map(([u,v]) => geographic(u,v))],
    refs: [geographic(4,-34), geographic(10,-42), geographic(54,-12)],
    datum: 'median', featherM: 8,
  },
};
export const PALETTES = {
  light: {
    stone: '#30353a', concrete: '#a3a39a', pale: '#f8f8ef',
    wood: '#72482d', frame: '#181f23', glass: '#344b50',
    metal: '#3a3d40', red: '#cd3e26', glow: '#42585b',
  },
  dark: {
    stone: '#192329', concrete: '#5e6970', pale: '#b5c5d0',
    wood: '#513c2c', frame: '#0d171d', glass: '#263f4a',
    metal: '#28343a', red: '#8d3226', glow: '#e8b67d',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local beach/pier grade y=0; entrance landward is elevated within the rigid structure. No sea-level or DEM height baked in.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '2009 spa hotel by Halvorsen & Reine. 24 m clear sea-side span is architect-sourced; 14.6 m main roof, 17.8 m suite roof, 7.4 m soffit and lighthouse dimensions/location are photographic estimates. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
