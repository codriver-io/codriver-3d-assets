import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC,PALETTES } from './config.js';
import alignment from './golden-ears-bridge-alignment.js';
export const MAIN_SPAN=242,SIDE_SPAN=121,DECK_H=44,TOWER_H=84,HALF_WIDTH=16.4;
export const ROAD_EDGES=[[-12.2,-.65],[.65,12.2]];
const base=createBridgeProfile({...SPEC,width:32.8,railGap:.5,roadEdges:ROAD_EDGES,
  centerline:alignment.centerline,palette:PALETTES.light,clipStandardEnds:true,
  lateralBankFit:{blendM:180,terrainClamp:true,clearanceM:0},
  profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
export const TOWERS=Array.from({length:4},(_,i)=>base.projectBridge(0,0).s+i*MAIN_SPAN);
export const MAIN_START=TOWERS[0]-SIDE_SPAN,MAIN_END=TOWERS[3]+SIDE_SPAN;
export const LANDING=55,CURVE=40;
function rise(u,length,low){
 const g=(DECK_H-low)/(length-CURVE);
 if(u<CURVE)return low+g*u*u/(2*CURVE);
 if(u>length-CURVE)return DECK_H-g*(length-u)**2/(2*CURVE);
 return low+g*(u-CURVE/2);
}
export function deckHeight(s,approaches=[0,0]){
 s=Math.max(0,Math.min(L,s));
 if(s<LANDING)return approaches[0];
 if(s<MAIN_START)return rise(s-LANDING,MAIN_START-LANDING,approaches[0]);
 if(s<=MAIN_END)return DECK_H;
 if(s>L-LANDING)return approaches[1];
 return rise(L-LANDING-s,L-LANDING-MAIN_END,approaches[1]);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,approaches)=>base.bridgeRoadHeight(lng,lat,heading,approaches)===null?null:deckHeight(base.stationAt([lng,lat]),approaches);
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,fittedLateral:(_s,d)=>d,
 roadEdges:()=>ROAD_EDGES,meshStep:4,
 knots:[[0,'start'],[LANDING,'start'],[MAIN_START,DECK_H],[MAIN_END,DECK_H],[L-LANDING,'end'],[L,'end']]};
export const GRADES=[DECK_H/(MAIN_START-LANDING-CURVE),DECK_H/(L-LANDING-MAIN_END-CURVE)];
