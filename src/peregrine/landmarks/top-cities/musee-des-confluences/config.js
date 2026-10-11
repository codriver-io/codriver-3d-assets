import { FOOTPRINTS } from './footprint.js';

// 2014 Coop Himmelb(l)au museum; metric frame at the mapped body centroid.
export const SPEC = {
  id: 'musee-des-confluences', name: 'Musée des Confluences', kind: 'building', ready: true,
  origin: [4.81808, 45.732595], height: 41, padM: 100, frontageBearing: 8,
  terrainPad: { rings: FOOTPRINTS, refs: [[4.81808,45.732595]], datum: 'median', featherM: 4 },
};
export const PALETTES = {
  light: { metal: '#bbc1c5', facet: '#aeb6bc', seam: '#8b949c', soffit: '#b4bcc2', concrete: '#c0bdb5', glass: '#789cae', glassPale: '#809fae', frame: '#6f7c87', glow: '#718d9c' },
  dark: { metal: '#82919f', facet: '#778996', seam: '#566773', soffit: '#9aa6ad', concrete: '#9c9f9e', glass: '#425f77', glassPale: '#4a657b', frame: '#8e9daa', glow: '#ddc596' },
};
export const MANIFEST = {
  elevationDatum: 'Local plaza grade y=0; rigid building, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry, Codriver 2026. Mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '41 m published height. OSM body envelope is smaller than the architect’s 190 × 90 m overall project dimensions. Fold locations, glass frame, roof funnels, supports and plinth heights estimated from attributed photographs; no textures or external meshes. Cityscape and Full 3D world not tested yet, integration checked separately.',
};
