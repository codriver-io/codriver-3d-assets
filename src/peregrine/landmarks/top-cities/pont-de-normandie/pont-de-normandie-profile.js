import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, NORTH_ABUTMENT, SOUTH_ABUTMENT, NORTH_PYLON } from './pont-de-normandie-alignment.js';
export const WIDTH=23.6, MAIN_SPAN=856, TOWER_H=214, DECK_H=48, PEAK_H=59.5;
export const ROAD_EDGES=[[-9.8,-.7],[.7,9.8]], LANDING=20, CURVE=50;
const base=createBridgeProfile({...SPEC,width:WIDTH,centerline:CENTERLINE,palette:PALETTES.light,
  roadEdges:ROAD_EDGES,clipStandardEnds:true,profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
export const BRIDGE_START=base.stationAt(NORTH_ABUTMENT),BRIDGE_END=base.stationAt(SOUTH_ABUTMENT);
export const NORTH_TOWER=base.stationAt(NORTH_PYLON), SOUTH_TOWER=NORTH_TOWER+MAIN_SPAN;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Constant grade with short parabolic vertical curves at each tangent.
function rise(u,len,from,to) {
  const curve=Math.min(CURVE,len/3),g=(to-from)/(len-curve);
  if(u<curve)return from+g*u*u/(2*curve);
  if(u>len-curve)return to-g*(len-u)**2/(2*curve);
  return from+g*(u-curve/2);
}
export function deckHeight(s,approaches=[0,0]) {
  s=clamp(s,0,L);
  if(s<LANDING)return approaches[0];
  if(s<NORTH_TOWER)return rise(s-LANDING,NORTH_TOWER-LANDING,approaches[0],DECK_H);
  if(s<=SOUTH_TOWER)return DECK_H+(PEAK_H-DECK_H)*Math.sin(Math.PI*(s-NORTH_TOWER)/MAIN_SPAN)**2;
  if(s>L-LANDING)return approaches[1];
  return rise(L-LANDING-s,L-LANDING-SOUTH_TOWER,approaches[1],DECK_H);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{
  if(base.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;
  return deckHeight(base.stationAt([lng,lat]),approaches);
};
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,meshStep:4,
  knots:[[0,'start'],[LANDING,'start'],[NORTH_TOWER,DECK_H],[(NORTH_TOWER+SOUTH_TOWER)/2,PEAK_H],
    [SOUTH_TOWER,DECK_H],[L-LANDING,'end'],[L,'end']]};
export const NORTH_GRADE=DECK_H/(NORTH_TOWER-LANDING-CURVE);
export const SOUTH_GRADE=DECK_H/(L-LANDING-SOUTH_TOWER-CURVE);
