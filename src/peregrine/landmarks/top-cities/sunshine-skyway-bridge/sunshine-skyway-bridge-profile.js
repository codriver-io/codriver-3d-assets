import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { ROADS } from './sunshine-skyway-bridge-alignment.js';
export const MAIN_SPAN=366, SIDE_SPAN=165, DECK_H=63.5, TOWER_H=131, HALF_WIDTH=14.5;
export const ROAD_EDGES=[[-13.7,-1.95],[1.95,13.7]];
const roads=Object.values(ROADS).map(line=>line.slice().sort((a,b)=>b[1]-a[1]));
const lngAt=(line,lat)=>{let i=1;while(i<line.length-1&&line[i][1]>lat)i++;const a=line[i-1],b=line[i];return a[0]+(b[0]-a[0])*(lat-a[1])/(b[1]-a[1]);};
const north=27.63244,south=27.60735;
const lats=[...new Set([north,south,...roads.flat().map(q=>q[1]).filter(lat=>lat<north&&lat>south)])].sort((a,b)=>b-a);
const centerline=lats.map(lat=>[(lngAt(roads[0],lat)+lngAt(roads[1],lat))/2,lat]);
const base=createBridgeProfile({...SPEC,width:29,railGap:1.9,roadEdges:ROAD_EDGES,centerline,palette:PALETTES.light,
  clipStandardEnds:true,profile:({length})=>[[0,'start'],[length,'end']]});
export const N=base.projectBridge(0,0).s,S=N+MAIN_SPAN,A=N-SIDE_SPAN,B=S+SIDE_SPAN,L=base.BRIDGE_LENGTH;
export const LANDING=70,CURVE=60;
function ramp(u,length,a,b){const g=(b-a)/(length-CURVE);if(u<CURVE)return a+g*u*u/(2*CURVE);if(u>length-CURVE)return b-g*(length-u)**2/(2*CURVE);return a+g*(u-CURVE/2);}
export function deckHeight(s,ends=[0,0]){
  s=Math.max(0,Math.min(L,s));
  if(s<=LANDING)return ends[0];if(s<A)return ramp(s-LANDING,A-LANDING,ends[0],DECK_H);
  if(s<=B)return DECK_H;if(s<L-LANDING)return ramp(L-LANDING-s,L-LANDING-B,ends[1],DECK_H);return ends[1];
}
export const PROFILE={...base,meshStep:3,deckHeight,
  bridgePoint:(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s)),
  fittedLateral:(s,d)=>d,
  bridgeRoadHeight:(lng,lat,heading,ends,joins,sections)=>base.bridgeRoadHeight(lng,lat,heading,ends,joins,sections)===null?null:deckHeight(base.stationAt([lng,lat]),ends),
  knots:[[0,'start'],[LANDING,'start'],[A,DECK_H],[B,DECK_H],[L-LANDING,'end'],[L,'end']],
};
export const GRADES=[DECK_H/(A-LANDING-CURVE),DECK_H/(L-LANDING-B-CURVE)];
