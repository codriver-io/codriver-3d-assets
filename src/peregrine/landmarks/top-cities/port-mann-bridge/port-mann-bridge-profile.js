import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import alignment from './port-mann-bridge-alignment.js';

export const MAIN_SPAN=470, SIDE_SPAN=190, DECK_H=46, TOWER_H=DECK_H+75;
export const HALF_WIDTH=32.5, MEDIAN_HALF=5;
export const ROAD_EDGES=[[-28.5,-5.6],[5.6,31.8]]; // East-side shared path (negative lateral) lies beyond the vehicle shoulder.
// Interpolate the two mapped inner (three-lane) carriageways by latitude. The separate two-lane
// local-road ways are retained for ownership tests. All vertices remain in the same local frame.
const roads=[alignment.southbound.line,alignment.northbound.line];
function longitude(line,lat) {
  let i=1;while(i<line.length-1&&line[i][1]>lat)i++;
  const a=line[i-1],b=line[i],t=(lat-a[1])/(b[1]-a[1]);return a[0]+t*(b[0]-a[0]);
}
// Continue onto mapped grade roadway at either end, avoiding a join at a generic bridge cut.
const north=Math.min(...roads.map(l=>l[0][1])),south=Math.max(...roads.map(l=>l.at(-1)[1]));
const lats=[...new Set([north,south,...roads.flat().map(v=>v[1]).filter(v=>v<north&&v>south)])].sort((a,b)=>b-a);
const centerline=lats.map(lat=>[(longitude(roads[0],lat)+longitude(roads[1],lat))/2,lat]);
const base=createBridgeProfile({id:SPEC.id,name:SPEC.name,origin:SPEC.origin,width:65,
  roadEdges:ROAD_EDGES,railGap:MEDIAN_HALF,centerline,palette:PALETTES.light,
  terrainPolicy:SPEC.terrainPolicy,clipStandardEnds:true,
  profile:({length})=>[[0,'start'],[length,'end']],
});
export const NORTH_TOWER=base.projectBridge(0,0).s;
export const SOUTH_TOWER=NORTH_TOWER+MAIN_SPAN;
export const CABLE_START=NORTH_TOWER-SIDE_SPAN, CABLE_END=SOUTH_TOWER+SIDE_SPAN;
export const L=base.BRIDGE_LENGTH;
// Flat 80 m landings and short quadratic vertical curves between constant grades.
export const LANDING=80, CURVE=40;
function rise(u,length,a,b) {
  const g=(b-a)/(length-CURVE),c=CURVE;
  if(u<c)return a+g*u*u/(2*c);
  if(u>length-c)return b-g*(length-u)**2/(2*c);
  return a+g*(u-c/2);
}
export function deckHeight(s,approaches=[0,0]) {
  s=Math.max(0,Math.min(L,s));
  if(s<LANDING)return approaches[0];
  if(s<CABLE_START)return rise(s-LANDING,CABLE_START-LANDING,approaches[0],DECK_H);
  if(s<=CABLE_END)return DECK_H;
  if(s>L-LANDING)return approaches[1];
  return rise(L-LANDING-s,L-LANDING-CABLE_END,approaches[1],DECK_H);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
// The shared closure reads its own height function, so explicitly route heights to this curve.
const bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{
  const accepted=base.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections);
  if(accepted===null)return null;
  return deckHeight(base.stationAt([lng,lat]),approaches);
};
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,meshStep:2,
  knots:[[0,'start'],[LANDING,'start'],[CABLE_START,DECK_H],[CABLE_END,DECK_H],[L-LANDING,'end'],[L,'end']]};
export const NORTH_GRADE=DECK_H/(CABLE_START-LANDING-CURVE);
export const SOUTH_GRADE=DECK_H/(L-LANDING-CABLE_END-CURVE);
export default PROFILE;
