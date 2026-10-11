import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, MAPPED_TOWERS } from './halogaland-bridge-alignment.js';
export const MAIN_SPAN = 1145, DECK_H = 43, TOWER_H = [179.1,173.5];
export const ROAD_EDGES = [[-4.75,4.75]], DECK_HALF = 9.3, CABLE_D = 8.45;
const raw = createBridgeProfile({...SPEC,width:18.6,roadEdges:ROAD_EDGES,centerline:CENTERLINE,profile:({length})=>[[0,0],[length,0]]});
export const MAPPED_STATIONS = MAPPED_TOWERS.map(ll=>raw.stationAt(ll));
const mid=(MAPPED_STATIONS[0]+MAPPED_STATIONS[1])/2;
export const TOWER_S = [mid-MAIN_SPAN/2,mid+MAIN_SPAN/2];
export const STRUCTURE_S = [TOWER_S[0]-250,TOWER_S[1]+148];
export const ANCHOR_S = [TOWER_S[0]-248,TOWER_S[1]+240];
// Reach full deck height at the towers. Smoothstep peak grades are below 7%/10%.
export const PROFILE = createBridgeProfile({
  ...SPEC,modelDir:'bridges',width:18.6,roadEdges:ROAD_EDGES,centerline:CENTERLINE,palette:PALETTES.light,
  // Preserve the actual tunnel segment in world: do not raise it to the mountain's surface.
  tunnels:[[raw.stationAt([17.473026,68.451102]),raw.stationAt([17.4787211,68.452219])]],
  profile:({length})=>[[0,'start'],[TOWER_S[0],DECK_H],[TOWER_S[1],DECK_H],[length,'end']],
});
export function cableHeight(s) {
  const [a,c]=TOWER_S,[lo,hi]=ANCHOR_S,[ha,hc]=TOWER_H.map(h=>h-2.4);
  if(s<a){const t=(s-lo)/(a-lo);return 32+(ha-32)*t-12*t*(1-t);}
  if(s>c){const t=(s-c)/(hi-c);return hc+(30-hc)*t-12*t*(1-t);}
  const t=(s-a)/MAIN_SPAN;
  return ha+(hc-ha)*t-4*119*t*(1-t);
}
