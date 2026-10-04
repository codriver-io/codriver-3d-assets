import { createBridgeProfile } from '../../bridge-profile.js';
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../../../facade/geo.js';
import alignment from './margaret-hunt-hill-bridge-alignment.js';
import { SPEC, PALETTES } from './config.js';

export const DECK_H = 13;
export const SPAN = 184;
export const DECK_HALF = 36.7 / 2;
export const ARCH_HALF = 22.2;
export const ARCH_BASE = 9.144;
export const STEEL_HEIGHT = 121.92;
export const ARCH_RADIUS = 4.445 / 2;
export const ROAD_EDGES = [[-17.15, -2.05], [2.05, 17.15]];
const k = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]), oy = latToMercY(SPEC.origin[1]);
const T = [Math.sin(67.4 * Math.PI / 180), -Math.cos(67.4 * Math.PI / 180)];
const plane = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (oy - latToMercY(lat)) / k];
const unplane = ([x, z]) => [mercXToLng(ox + x * k), mercYToLat(oy - z * k)];
const stations = line => line.map(ll => { const [x, z] = plane(ll); return { u: x * T[0] + z * T[1], x, z }; });
const lines = Object.values(alignment).map(v => stations(v.line));
function at(line, u) {
  let i = 1; while (i < line.length - 1 && line[i].u < u) i++;
  const a = line[i - 1], b = line[i], t = (u - a.u) / (b.u - a.u);
  return [a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t];
}
// Start before the western mapped abutment; end on the continuing eastern freeway.
const start = Math.max(...lines.map(v => v[0].u));
const end = 430;
const us = [...new Set([start, end, ...lines.flat().map(v => v.u).filter(u => u > start && u < end)])].sort((a,b) => a-b);
const centerline = us.map(u => { const a = at(lines[0],u), b = at(lines[1],u); return unplane(a.map((v,i)=>(v+b[i])/2)); });
const base = { id: SPEC.id, name: SPEC.name, origin: SPEC.origin, width: 2 * DECK_HALF,
  roadEdges: ROAD_EDGES, centerline, palette: PALETTES.light, terrainPolicy: SPEC.terrainPolicy,
  clipStandardEnds: true,
};
const probe = createBridgeProfile({ ...base, profile: ({length}) => [[0,0],[length,0]] });
export const TOWER_S = probe.projectBridge(0,0).s;
export const CABLE_START = TOWER_S - SPAN;
export const CABLE_END = TOWER_S + SPAN;
export const RAMP_WEST = CABLE_START;
export const RAMP_EAST = probe.BRIDGE_LENGTH - CABLE_END;
export const PROFILE = createBridgeProfile({ ...base,
  profile: ({ length }) => [[0,'start'],[CABLE_START,DECK_H],[CABLE_END,DECK_H],[length,'end']],
});
PROFILE.meshStep = 2;
export default PROFILE;
