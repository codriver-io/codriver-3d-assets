import { FOOTPRINTS } from './footprint.js';
// Heights are photographic estimates, not published survey measurements.
export const SPEC = {
  id: 'palacio-de-la-cultura-medellin', name: 'Palacio de la Cultura Rafael Uribe Uribe',
  kind: 'building', ready: true,
  origin: [-75.56820644866352, 6.251686397758602],
  height: 40, corniceM: 22.4, domeRadiusM: 8.8,
  rotationDeg: -23, frontageBearing: 113, padM: 44,
  terrainPad: { rings: FOOTPRINTS, refs: FOOTPRINTS[0], datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { stone: '#393b40', cream: '#c8c4b6', roof: '#66736a', glass: '#283b42', wood: '#624138', iron: '#454b48', glow: '#46535b', lamp: '#66736a' },
  dark: { stone: '#252c34', cream: '#697987', roof: '#344848', glass: '#1e303b', wood: '#403633', iron: '#53616a', glow: '#d8b97d', lamp: '#a6ad9c' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid grade y=0; no altitude, DEM or latitude stretch baked in. Full 3D world requests a footprint-bounded median terrain pad.',
  attribution: 'Original procedural geometry. Mapped outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Present built palace with two historic wings, courtyard and octagonal assembly hall, not the unbuilt full Goovaerts proposal. Horizontal plan mapped from relation 7460245; all heights, ornament and roof profiles estimated from photographs. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
