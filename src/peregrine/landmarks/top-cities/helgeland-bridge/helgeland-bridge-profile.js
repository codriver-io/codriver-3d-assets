import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, CABLE_NORTH, BRIDGE_NORTH, BRIDGE_SOUTH } from './helgeland-bridge-alignment.js';
export const MAIN_SPAN=425, SIDE_SPAN=177.5, DECK_H=46.2, NORTH_H=138, SOUTH_H=127.5;
export const HALF_WIDTH=6, ROAD_EDGES=[[-5.45,3.3]], LANDING=45, CURVE=45;
const base=createBridgeProfile({...SPEC,width:12,roadEdges:ROAD_EDGES,centerline:CENTERLINE,
  palette:PALETTES.light,clipStandardEnds:true,profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
export const BRIDGE_START=base.stationAt(BRIDGE_NORTH), BRIDGE_END=base.stationAt(BRIDGE_SOUTH);
// Tower stations inferred from the mapped cable-section end and published spans.
export const NORTH_TOWER=base.stationAt(CABLE_NORTH)+SIDE_SPAN+7.5;
export const SOUTH_TOWER=NORTH_TOWER+MAIN_SPAN;
export const CABLE_START=NORTH_TOWER-SIDE_SPAN,CABLE_END=SOUTH_TOWER+SIDE_SPAN;
const clamp=v=>Math.max(0,Math.min(1,v));
function rise(u,length,a,b) {
  const g=(b-a)/(length-CURVE);
  if(u<CURVE)return a+g*u*u/(2*CURVE);
  if(u>length-CURVE)return b-g*(length-u)**2/(2*CURVE);
  return a+g*(u-CURVE/2);
}
export function deckHeight(s,approaches=[0,0]) {
  s=Math.max(0,Math.min(L,s));
  if(s<LANDING)return approaches[0];
  if(s<NORTH_TOWER)return rise(s-LANDING,NORTH_TOWER-LANDING,approaches[0],DECK_H);
  if(s<=SOUTH_TOWER)return DECK_H+.8*Math.sin(Math.PI*(s-NORTH_TOWER)/MAIN_SPAN)**2;
  if(s>L-LANDING)return approaches[1];
  return rise(L-LANDING-s,L-LANDING-SOUTH_TOWER,approaches[1],DECK_H);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{
  if(base.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;
  return deckHeight(base.stationAt([lng,lat]),approaches);
};
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,meshStep:3,
  knots:[[0,'start'],[LANDING,'start'],[NORTH_TOWER,DECK_H],[SOUTH_TOWER,DECK_H],[L-LANDING,'end'],[L,'end']]};
export const NORTH_GRADE=DECK_H/(NORTH_TOWER-LANDING-CURVE);
export const SOUTH_GRADE=DECK_H/(L-LANDING-SOUTH_TOWER-CURVE);
export const SUPPORT_LIFT=y=>clamp(y/(DECK_H-1.2));
