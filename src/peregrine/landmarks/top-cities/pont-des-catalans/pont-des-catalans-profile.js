import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import alignment from './pont-des-catalans-alignment.js';

export const SPANS = [38.5, 42, 46, 42, 38.5];
export const DECK_H = 16, RAMP = 220, STRUCTURE_M = 257.21;
export const RIB_CENTRES = [-6.575, 6.575], RIB_WIDTH = 3.25;
const mean = (a, b) => a.map((v, i) => (v + b[i]) / 2);
const north = mean(alignment.bridgeWest[0], alignment.bridgeEast[0]);
const south = mean(alignment.bridgeWest.at(-1), alignment.bridgeEast.at(-1));
// Approach ways are parallel one-way lanes. Offset the west way to their centre.
const shift = (line, endpoint) => {
  const off = endpoint.map((v, i) => v - line[0][i]);
  return line.map(a => a.map((v, i) => v + off[i]));
};
const n = shift([alignment.bridgeWest[0], ...alignment.north], north);
const s = shift(alignment.south, south);
const probe = createBridgeProfile({ ...SPEC, width: 22.5, roadEdges: [[-7, 7]], centerline: [...s.slice(1).reverse(), south, north, ...n.slice(1)], profile: ({ length }) => [[0,0],[length,0]] });
const ns = probe.stationAt(north), ss = probe.stationAt(south);
const cut = station => { const q = probe.bridgePoint(station); return probe.bridgeLngLat(q.x, q.z); };
const a = ss - RAMP, z = ns + RAMP;
if (a < 0 || z > probe.BRIDGE_LENGTH) throw new Error('Mapped approaches are too short');
const centerline = [cut(a), ...probe.ALIGNMENT.filter(v => v.s > a && v.s < z).map(v => probe.bridgeLngLat(v.x,v.z)), cut(z)];
export const STRUCTURE_START = RAMP - (STRUCTURE_M - (ns - ss)) / 2;
export const STRUCTURE_END = STRUCTURE_START + STRUCTURE_M;
const abut = (STRUCTURE_M - SPANS.reduce((a,b) => a+b,0) - 4*7) / 2;
export const ARCHES = [];
let cursor = STRUCTURE_START + abut;
for (const span of SPANS) { ARCHES.push({ start: cursor, end: cursor + span, mid: cursor + span/2, span }); cursor += span + 7; }
export const PIER_S = ARCHES.slice(0,-1).map(v => v.end + 3.5);
export const PROFILE = createBridgeProfile({
  ...SPEC, width: 22.5, palette: PALETTES.light,
  centerline, roadEdges: [[-7, 7]], terrainPolicy: 'bank-fit', clipStandardEnds: true,
  // No riverbed alignment sample: interpolate between the two mapped banks.
  profile: ({ length }) => [[0,'start'],[RAMP,DECK_H],[length-RAMP,DECK_H],[length,'end']],
});
