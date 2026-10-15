import { FOOTPRINTS } from './footprint.js';
// Arena Națională, 2011 gmp stadium, shown with its central membrane retracted.
export const SPEC = {
  id: 'arena-nationala', name: 'Arena Națională', kind: 'building', ready: true,
  origin: [26.152495124390242, 44.437199604878046],
  height: 55, padM: 128, frontageBearing: 176.9,
  // Explicit bounded rigid pad; host must verify the old stadium berm in world mode.
  terrainPad: { rings: FOOTPRINTS, refs: FOOTPRINTS[0].filter((_,i)=>i%5===0), datum: 'median', featherM: 12 },
};
export const PALETTES = {
  light: { concrete:'#eceae4', roof:'#e3e1d7', steel:'#7e878a', shadow:'#3c4346', seats:'#a6403c', upper:'#4d647d', yellow:'#baa54f', turf:'#4c7042', glow:'#73898a', paint:'#e2e1cc', lamp:'#dce3d7' },
  dark: { concrete:'#687580', roof:'#a3b2bc', steel:'#606e79', shadow:'#202e39', seats:'#62373a', upper:'#354e64', yellow:'#82733d', turf:'#314c3e', glow:'#e3c889', paint:'#9caeb5', lamp:'#e5e9ff' },
};
export const MANIFEST = {
  elevationDatum:'Local stadium apron grade y=0; rigid model, no absolute elevation or baked terrain.',
  attribution:'Original procedural geometry by Codriver. Mapped outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note:'Open/retracted roof state. OSM relation 2501757 gives 55 m and 10 levels; outer way 13450166 defines the envelope. Roof profile (7.5 m outer scallops), column rhythm, continuous red concourse, dark upper-tier back wall, seat pattern and storage hub are photo estimates. Cityscape and Full 3D world not tested; integration checked separately.',
};
