import { FOOTPRINTS } from './footprint.js';
// Permanent exterior; NPS heights differ (185 / 186 ft), overall adopted 56.7 m estimate.
export const SPEC = {
  id: 'st-michaels-church-charleston', name: "St. Michael's Church", kind: 'building', ready: true,
  origin: [-79.93074,32.776316], height: 56.7, padM: 24, frontageBearing: 263.06,
  rotation: 6.94 * Math.PI / 180,
  terrainPad: { rings: FOOTPRINTS, refs: [[-79.930944,32.7762221],[-79.9309232,32.7763869],[-79.9305386,32.7762442]], datum: 'median', featherM: 2 },
};
export const PALETTES = {
 light: { plaster:'#e6e3da', trim:'#efede5', roof:'#777a79', glass:'#526065', shadow:'#37413f', gold:'#b29a58' },
 dark: { plaster:'#a8aaa6', trim:'#c1c3bc', roof:'#424c52', glass:'#34464e', shadow:'#253239', gold:'#aa9256' },
};
export const MANIFEST = {
 elevationDatum: 'Rigid pavement foundation at local y=0; no terrain, sea-level height or Mercator scale baked in.',
 attribution: 'Original procedural geometry for Codriver; mapped outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note: 'NPS NHL nomination gives 130 × 60 ft and 185 ft steeple; current NPS page says 186 ft. Adopted total 56.7 m is an estimate within that discrepancy. Mapped west portico/body/chancel footprint. Stage splits, openings, weather vane and trim estimated from reference photographs. Geographic yaw baked once. Cityscape: not tested; Full 3D world: not tested.',
};
