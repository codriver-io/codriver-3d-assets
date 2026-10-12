import { FOOTPRINTS } from './footprint.js';
// Published WHHA residence dimensions; south lawn is the local rigid-base datum.
export const SPEC = {
  id: 'white-house', name: 'White House', kind: 'building', ready: false,
  origin: [-77.0365525, 38.8976673], height: 26.4, padM: 115,
  frontageBearing: 0.0733, rotation: -0.001279,
  width: 51.2064, depth: 26.0604, roofHeight: 21.336, parapetHeight: 18.288,
  terrainPad: { rings: FOOTPRINTS, refs: [[-77.03677,38.89758],[-77.03632,38.89759],[-77.03757,38.89736]], datum: 'median', featherM: 5 },
};
export const PALETTES = {
  light: { stone: '#e0e1dc', trim: '#f1eee5', roof: '#909b9f', glass: '#374c53', glow: '#52656c', iron: '#515b61', red: '#8f4146', blue: '#344765' },
  dark: { stone: '#969ea4', trim: '#b4b8b6', roof: '#485560', glass: '#2a3945', glow: '#ceb280', iron: '#616c78', red: '#6b3d45', blue: '#35475c' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid south-lawn foundation y=0; no terrain or absolute elevations baked in. North lawn is represented with a raised entrance platform only.',
  attribution: 'Original procedural geometry for Codriver. Geographic placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright. Published dimensions: White House Historical Association.',
  note: 'Current residence and West Wing; East Wing demolished 2025 and ballroom construction omitted. Residence 51.2064 × 26.0604 m, roof 21.336 m above south lawn; chimneys 23 m from OSM, flag top 26.4 m estimated. Window, portico and roof-detail dimensions estimated from photographs.',
};
