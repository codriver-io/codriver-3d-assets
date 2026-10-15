import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE } from './pont-de-l-alma-alignment.js';
// Only the 142.5 m structural crossing; ordinary approach streets are never authored ramps.
export const MAIN_START=0, MAIN_END=142.5, PIER_S=110.5, DECK_H=0.10;
export const SOUTH_BEARING=0.5,NORTH_BEARING=142;
// AFGC: 42 m = two 6 m walks, two 14 m carriageways, 2 m refuge.
export const roadEdgesAt=()=>[[-15,-1],[1,15]];
const base=createBridgeProfile({
 ...SPEC,palette:PALETTES.light,width:42,centerline:CENTERLINE,
 roadEdges:roadEdgesAt(),railGap:0.8,terrainPolicy:'bank-fit',clipStandardEnds:true,
 lateralBankFit:{blendM:16},
 groundControls:({length})=>[{s:0,sampleS:0},{s:length,sampleS:length}],
 profile:({length})=>[[0,'start'],[length,'end']],
});
export function deckHeight(s,ends=[0,0]) {
 const t=Math.max(0,Math.min(1,s/base.BRIDGE_LENGTH));
 return DECK_H+ends[0]+(ends[1]-ends[0])*t;
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
function bridgeRoadHeight(lng,lat,heading,ends,joins,sections) {
 if(base.bridgeRoadHeight(lng,lat,heading,ends,joins,sections)===null)return null;
 const q=base.bridgeLocal(lng,lat);
 return deckHeight(base.projectBridge(q.x,q.z).s,ends);
}
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,fittedLateral:(s,d)=>d};
// Original photo-estimated vertical section in its 8 m construction datum;
// geometry translates it to the quay datum after assigning support attachments.
export function soffit(s) {
 const t=s<PIER_S?(s-MAIN_START)/(PIER_S-MAIN_START):(MAIN_END-s)/(MAIN_END-PIER_S);
 return 6.55-3.0*Math.pow(Math.max(0,t),2.4);
}
