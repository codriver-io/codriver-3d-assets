import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, MAPPED_TOWERS } from './lions-gate-bridge-alignment.js';
export const MAIN_SPAN = 473, SIDE_SPAN = 187, DECK_H = 64.4;
export const ROAD_EDGES = [[-5.4, 5.4]], DECK_HALF = 8.6, CABLE_D = 7.6;
const raw = createBridgeProfile({ ...SPEC, width: 17.2, roadEdges: ROAD_EDGES, centerline: CENTERLINE, profile: ({length}) => [[0,0],[length,0]] });
const mid = raw.stationAt(SPEC.origin), start = mid - MAIN_SPAN/2 - SIDE_SPAN - 900;
const first = raw.bridgePoint(start);
const centerline = [raw.bridgeLngLat(first.x,first.z), ...raw.ALIGNMENT.filter(q=>q.s>start+0.1).map(q=>raw.bridgeLngLat(q.x,q.z))];
export const TOWER_S = [mid-start-MAIN_SPAN/2, mid-start+MAIN_SPAN/2];
export const ANCHOR_S = [TOWER_S[0]-SIDE_SPAN, TOWER_S[1]+SIDE_SPAN];
export const PROFILE = createBridgeProfile({
  ...SPEC, modelDir: 'bridges', width: 17.2, roadEdges: ROAD_EDGES, centerline, palette: PALETTES.light,
  profile: ({length})=>[[0,'start'],[ANCHOR_S[0],DECK_H],[ANCHOR_S[1],DECK_H],[length,'end']],
});
export const MAPPED_STATIONS = MAPPED_TOWERS.map(ll=>PROFILE.stationAt(ll));
// Side-span parabola connects cable anchor to saddle; main cable is symmetric.
export function cableHeight(s) {
  const [a,b]=TOWER_S, [lo,hi]=ANCHOR_S;
  if(s<a){const t=(s-lo)/(a-lo);return DECK_H+1+(110-DECK_H-1)*t-10*t*(1-t);}
  if(s>b){const t=(s-b)/(hi-b);return 110+(DECK_H+1-110)*t-10*t*(1-t);}
  return 68.5+41.5*((s-(a+b)/2)/(MAIN_SPAN/2))**2;
}
