import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, BRIDGE_ENDS } from './pegasus-bridge-alignment.js';
import { FOOTPRINTS, TOWER_ORIGIN } from './footprint.js';
// Only the mapped movable bridge belongs to this model. All ordinary approach
// roads, crossings and stop lines stay provider-owned, without authored ramps.
export const DECK_H=.1,BASCULE_M=45.7;
const start=CENTERLINE.findIndex(p=>p[0]===BRIDGE_ENDS[0][0]&&p[1]===BRIDGE_ENDS[0][1]);
const end=CENTERLINE.findIndex(p=>p[0]===BRIDGE_ENDS[1][0]&&p[1]===BRIDGE_ENDS[1][1]);
const base=createBridgeProfile({...SPEC,palette:PALETTES.light,width:16,roadEdges:[[-3.7,3.7]],centerline:CENTERLINE.slice(start,end+1),modelDir:'bridges',meshStep:1,
 terrainPolicy:'bank-fit',buildingFootprints:[FOOTPRINTS[1]],clipStandardEnds:true,
 profile:({length})=>[[0,'start'],[length,'end']],
});
// Straight bank-to-bank datum, 10 cm proud in both renderer modes.
function deckHeight(s,approaches=[0,0]) {
 const t=Math.max(0,Math.min(1,s/base.BRIDGE_LENGTH));
 return approaches[0]+(approaches[1]-approaches[0])*t+DECK_H;
}
function bridgePoint(s,d=0,y=null) {
 const q=base.bridgePoint(s,d,y??deckHeight(s));
 // The detached tower and its access stair can extend beyond the roadway end;
 // extrapolate their structural frame without extending road ownership.
 const extra=s-Math.max(0,Math.min(base.BRIDGE_LENGTH,s));
 return {...q,x:q.x+q.tx*extra,z:q.z+q.tz*extra};
}
function bridgeRoadHeight(lng,lat,heading,approaches,joins,sections) {
 if(base.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;
 const q=base.bridgeLocal(lng,lat);
 return deckHeight(base.projectBridge(q.x,q.z).s,approaches);
}
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,surfaceStep:1,meshStep:5,ownershipMargin:.25};
export const STRUCTURE_START=0,STRUCTURE_END=PROFILE.BRIDGE_LENGTH;
export const HEEL=STRUCTURE_END-18,TOE=HEEL-BASCULE_M;
const t=PROFILE.bridgeLocal(...TOWER_ORIGIN);
const projected=PROFILE.projectBridge(t.x,t.z),endpoint=base.bridgePoint(projected.s);
export const TOWER={...t,...projected,s:projected.s+(t.x-endpoint.x)*projected.tx+(t.z-endpoint.z)*projected.tz};
