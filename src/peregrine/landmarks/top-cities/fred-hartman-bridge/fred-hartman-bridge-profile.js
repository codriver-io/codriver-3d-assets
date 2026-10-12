import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import alignment from './fred-hartman-bridge-alignment.js';
export const MAIN_SPAN=381,SIDE_SPAN=186.69,DECK_H=57,TOWER_H=134.112;
export const DECK_WIDTH=23.7744,GAP=1.2192,HALF_WIDTH=DECK_WIDTH+GAP/2;
export const ROAD_EDGES=[[-HALF_WIDTH+.55,-GAP/2-.55],[GAP/2+.55,HALF_WIDTH-.55]];
const base=createBridgeProfile({...SPEC,width:HALF_WIDTH*2,railGap:GAP/2,
 roadEdges:ROAD_EDGES,centerline:alignment.centerline,palette:PALETTES.light,
 clipStandardEnds:true,lateralBankFit:{blendM:150,terrainClamp:true,clearanceM:0},
 profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
// Aerial footprint at southern diamond; projected to the shared roadway alignment.
export const SOUTH_TOWER=base.stationAt([-95.0182,29.70230]);
export const NORTH_TOWER=SOUTH_TOWER+MAIN_SPAN;
export const TOWERS=[SOUTH_TOWER,NORTH_TOWER];
export const CABLE_START=SOUTH_TOWER-SIDE_SPAN,CABLE_END=NORTH_TOWER+SIDE_SPAN;
export const LANDING=60,CURVE=40;
function rise(u,len,low){const g=(DECK_H-low)/(len-CURVE);
 if(u<CURVE)return low+g*u*u/(2*CURVE);
 if(u>len-CURVE)return DECK_H-g*(len-u)**2/(2*CURVE);
 return low+g*(u-CURVE/2);
}
export function deckHeight(s,approaches=[0,0]){
 s=Math.max(0,Math.min(L,s));
 if(s<LANDING)return approaches[0];
 if(s<CABLE_START)return rise(s-LANDING,CABLE_START-LANDING,approaches[0]);
 if(s<=CABLE_END)return DECK_H;
 if(s>L-LANDING)return approaches[1];
 return rise(L-LANDING-s,L-LANDING-CABLE_END,approaches[1]);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,approaches)=>base.bridgeRoadHeight(lng,lat,heading,approaches)===null?null:deckHeight(base.stationAt([lng,lat]),approaches);
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,
 fittedLateral:(_s,d)=>d,roadEdges:()=>ROAD_EDGES,meshStep:4,
 knots:[[0,'start'],[LANDING,'start'],[CABLE_START,DECK_H],[CABLE_END,DECK_H],[L-LANDING,'end'],[L,'end']]};
export const GRADES=[DECK_H/(CABLE_START-LANDING-CURVE),DECK_H/(L-LANDING-CABLE_END-CURVE)];
