import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'walt-disney-concert-hall', name: 'Walt Disney Concert Hall', kind: 'building',
  ready: true, origin: [-118.25, 34.05528], height: 36.7, padM: 100,
  frontageBearing: 127,
  terrainPad: { rings: FOOTPRINTS, refs: [[-118.24986,34.05516]], datum: 'median', featherM: 4 },
};
export const PALETTES = {
  light: { steel: '#bdc1c2', stone: '#c5bda9', glass: '#526c72', frame: '#869295', glow: '#778b8a', joint: '#929b9e' },
  dark: { steel: '#81909b', stone: '#7d8286', glass: '#334c5c', frame: '#6a7c88', glow: '#dfc593', joint: '#5c6b77' },
};
export const MANIFEST = {
  elevationDatum: 'Local Grand Avenue entrance grade y=0; rigid foundation, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry, Codriver 2026. Mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Frank Gehry 2003 concert hall. 36.7 m height from OSM, not a surveyed dimension. Individual stainless-steel sail profiles, stone podium, glazing, garden canopy and steps estimated from photographs. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
