import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {EASTBOUND,WESTBOUND} from './pitt-river-bridge-alignment.js';
export const MAIN_SPAN=190,SIDE_SPAN=95,DECK_H=19,TOWER_H=60;
function latitude(line,lng){let i=1;while(i<line.length-1&&line[i][0]<lng)i++;const a=line[i-1],b=line[i];return a[1]+(b[1]-a[1])*(lng-a[0])/(b[0]-a[0]);}
const west=Math.max(EASTBOUND[0][0],WESTBOUND[0][0]),east=Math.min(EASTBOUND.at(-1)[0],WESTBOUND.at(-1)[0]);
const longs=[...new Set([west,east,...EASTBOUND.concat(WESTBOUND).map(p=>p[0]).filter(x=>x>west&&x<east)])].sort((a,b)=>a-b);
export const CENTERLINE=longs.map(x=>[x,(latitude(EASTBOUND,x)+latitude(WESTBOUND,x))/2]);
const base=createBridgeProfile({...SPEC,width:44.66,palette:PALETTES.light,centerline:CENTERLINE,
 roadEdges:[[-17.8,-1.7],[1.7,21.3]],railGap:1.1,clipStandardEnds:true,
 lateralBankFit:{blendM:180,terrainClamp:true,clearanceM:0},
 profile:({length})=>[[0,'start'],[length,'end']]});
export const WEST_TOWER=base.projectBridge(0,0).s,EAST_TOWER=WEST_TOWER+MAIN_SPAN;
export const CABLE_START=WEST_TOWER-SIDE_SPAN,CABLE_END=EAST_TOWER+SIDE_SPAN;
export const L=base.BRIDGE_LENGTH,LANDING=24,CURVE=22;
export const STRUCTURE_START=CABLE_START-70,STRUCTURE_END=CABLE_END+56;
export function widthAt(s){const t=Math.max(0,Math.min(1,(s-CABLE_START)/380));return 44.66-4.66*t;}
export const planesAt=s=>[-widthAt(s)/2+.5,0,widthAt(s)/2-.5];
export const edgesAt=s=>[[-widthAt(s)/2+4.5,-1.7],[1.7,widthAt(s)/2-1.1]];
function rise(u,len,a,b){const g=(b-a)/(len-CURVE);if(u<CURVE)return a+g*u*u/(2*CURVE);if(u>len-CURVE)return b-g*(len-u)**2/(2*CURVE);return a+g*(u-CURVE/2);}
export function deckHeight(s,approaches=[0,0]){s=Math.max(0,Math.min(L,s));if(s<LANDING)return approaches[0];if(s<CABLE_START)return rise(s-LANDING,CABLE_START-LANDING,approaches[0],DECK_H);if(s<=CABLE_END)return DECK_H;if(s>L-LANDING)return approaches[1];return rise(L-LANDING-s,L-LANDING-CABLE_END,approaches[1],DECK_H);}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const roadEdges=s=>edgesAt(s);
const accepted=createBridgeProfile({...base.CHAMPLAIN,roadEdgesAt:edgesAt});
export const PROFILE={...base,bridgePoint,deckHeight,roadEdges,fittedLateral:(_s,d)=>d,
 bridgeRoadHeight(lng,lat,heading,approaches){if(accepted.bridgeRoadHeight(lng,lat,heading,approaches)===null)return null;return deckHeight(base.stationAt([lng,lat]),approaches);},
 meshStep:3,knots:[[0,'start'],[LANDING,'start'],[CABLE_START,19],[CABLE_END,19],[L-LANDING,'end'],[L,'end']]};
export const GRADES=[19/(CABLE_START-LANDING-CURVE),19/(L-LANDING-CABLE_END-CURVE)];
