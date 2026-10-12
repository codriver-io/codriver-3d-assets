import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'peoples-salvation-cathedral', name: "People's Salvation Cathedral", kind: 'building',
  ready: true, origin: [26.08226, 44.42591], height: 127, padM: 76,
  frontageBearing: 274.7293309809681, rotation: -4.729330980968112,
  terrainPad: { rings: [FOOTPRINTS[0]], refs: [[26.08226,44.42591],[26.0817,44.42596],[26.08291,44.42591]], datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { stone: '#e7dfcd', gold: '#b59646', rib: '#8d7131', glass: '#263f49', mosaic: '#6d5b42', glow: '#b29a5c' },
  dark: { stone: '#929492', gold: '#b79b52', rib: '#806c3d', glass: '#253a48', mosaic: '#514938', glow: '#d5af66' },
};
export const MANIFEST = {
  elevationDatum: 'Local entrance-floor grade y=0, rigid metre-scale structure; no DEM or absolute altitude baked in.',
  attribution: 'Original procedural model by Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Completed 2025 exterior. Official 127 m entrance-floor-to-cross height; ground-to-cross is sometimes reported as 133 m. OSM parent envelope about 121 x 71 m; official 126 x 67.7 m uses another scope. Belfry, openings and dome profiles are estimates informed by photographs and mapped parts. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
