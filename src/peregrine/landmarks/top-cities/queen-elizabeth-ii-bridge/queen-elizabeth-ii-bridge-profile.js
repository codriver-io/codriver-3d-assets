import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC,PALETTES } from './config.js';
import { CENTERLINE,NORTH_PYLON,PHYSICAL_START,PHYSICAL_END } from './queen-elizabeth-ii-bridge-alignment.js';
export const WIDTH=20.6,MAIN_SPAN=450,TOWER_H=137,CONCRETE_H=53,CREST_H=61;
export const ROAD_EDGES=[[-7.9,7.9]],LANDING=25,CURVE=60,TAPER=100;
export function roadEdgesAt(s,length=2906){const u=Math.max(0,Math.min(1,Math.min(s-BRIDGE_START,BRIDGE_END-s)/TAPER));const endpoint=s<length/2?7.4:11.1;const w=endpoint+(7.9-endpoint)*u*u*(3-2*u);return [[-w,w]];}
const base=createBridgeProfile({...SPEC,width:WIDTH,centerline:CENTERLINE,palette:PALETTES.light,roadEdges:ROAD_EDGES,
  roadEdgesAt:s=>roadEdgesAt(s,base.BRIDGE_LENGTH),clipStandardEnds:true,
  profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH,N=base.stationAt(NORTH_PYLON),S=N+MAIN_SPAN;
export const BRIDGE_START=base.stationAt(PHYSICAL_START),BRIDGE_END=base.stationAt(PHYSICAL_END);
export const STAYED_START=N-181,STAYED_END=S+181;
function rise(u,len,from,to){const c=Math.min(CURVE,len/3),g=(to-from)/(len-c);if(u<c)return from+g*u*u/(2*c);if(u>len-c)return to-g*(len-u)**2/(2*c);return from+g*(u-c/2);}
export function deckHeight(s,approaches=[0,0]){
  s=Math.max(0,Math.min(L,s));const start=BRIDGE_START+LANDING,end=BRIDGE_END-LANDING;if(s<start)return approaches[0];
  if(s<N)return rise(s-start,N-start,approaches[0],CONCRETE_H);
  if(s<=S)return CONCRETE_H+(CREST_H-CONCRETE_H)*Math.sin(Math.PI*(s-N)/MAIN_SPAN)**2;
  if(s>end)return approaches[1];return rise(end-s,end-S,approaches[1],CONCRETE_H);
}
export const PROFILE={...base,meshStep:4,deckHeight,
  // Steel girder deck is rigid laterally even with incomplete provider samples.
  fittedLateral:(s,d)=>d,
  ownsPoint:(x,z)=>{const s=base.projectBridge(x,z).s;return s>=BRIDGE_START&&s<=BRIDGE_END;},
  bridgePoint:(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s)),
  bridgeRoadHeight:(lng,lat,heading,approaches,joins,sections)=>base.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections)===null?null:deckHeight(base.stationAt([lng,lat]),approaches),
  knots:[[0,'start'],[BRIDGE_START+LANDING,'start'],[N,53],[(N+S)/2,61],[S,53],[BRIDGE_END-LANDING,'end'],[L,'end']],
};
export function edge(s){const u=Math.max(0,Math.min(1,Math.min(s-BRIDGE_START,BRIDGE_END-s)/TAPER));const endpoint=s<L/2?9:12.2;return endpoint+(10.3-endpoint)*u*u*(3-2*u);}
export const GRADES=[53/(N-BRIDGE_START-LANDING-CURVE),53/(BRIDGE_END-LANDING-S-CURVE)];
