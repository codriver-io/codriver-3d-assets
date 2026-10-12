import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'edificio-metropolis', name: 'Edificio Metrópolis', kind: 'building', ready: true,
  origin: [-3.69747, 40.41878], height: 45, padM: 30, frontageBearing: 90,
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 6 },
};
export const PALETTES = {
  light: { stone: '#e2ded2', glass: '#3a4548', slate: '#242e36', bronze: '#38423e', gold: '#b69b54', glow: '#65706e' },
  dark: { stone: '#909b9d', glass: '#233641', slate: '#1e2b36', bronze: '#374643', gold: '#d5b76c', glow: '#b99458' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid foundation at local flat-map y=0; terrain and absolute elevation excluded.',
  attribution: 'Original procedural geometry by Codriver. Geographic outline © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photographs: Diego Delso (CC BY-SA 4.0), Roger Schultz and Riverac (CC BY 2.0), Pedro Seoane Prado (CC BY-SA 4.0); photographs not redistributed.',
  note: '1911 Beaux-Arts exterior with present-day winged Victory, not the original Phoenix. Published 45 m overall height; individual tiers, columns, ornaments and sculpture proportions estimated from photographs. Cityscape and Full 3D world not tested yet.',
};
