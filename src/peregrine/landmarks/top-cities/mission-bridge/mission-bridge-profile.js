import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {NORTHBOUND,SOUTHBOUND} from './mission-bridge-alignment.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function latitude(line,x){let i=1;while(i<line.length-1&&line[i][0]<x)i++;const a=line[i-1],b=line[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}
const west=Math.max(NORTHBOUND[0][0],SOUTHBOUND[0][0]),east=Math.min(NORTHBOUND.at(-1)[0],SOUTHBOUND.at(-1)[0]);
const longs=[...new Set([west,east,...NORTHBOUND.concat(SOUTHBOUND).map(v=>v[0]).filter(x=>x>west&&x<east)])].sort((a,b)=>a-b);
export const CENTERLINE=longs.map(x=>[x,(latitude(NORTHBOUND,x)+latitude(SOUTHBOUND,x))/2]);
const base=createBridgeProfile({...SPEC,width:20.2,palette:PALETTES.light,centerline:CENTERLINE,roadEdges:[[-8,-.45],[.45,8]],railGap:.3,clipStandardEnds:true,lateralBankFit:{blendM:100,terrainClamp:true,clearanceM:.12},profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
export const STRUCTURE_START=base.stationAt([-122.3111992,49.12659465]);
export const STRUCTURE_END=base.stationAt([-122.2994738,49.1199915]);
export const STRUCTURE_LENGTH=STRUCTURE_END-STRUCTURE_START;
export const RIVER_START=STRUCTURE_START+341,RIVER_END=RIVER_START+364,MAIN_START=RIVER_START+115,MAIN_END=MAIN_START+134;
export const PIERS=[...Array.from({length:12},(_,i)=>STRUCTURE_START+341*i/11),MAIN_START,MAIN_END,RIVER_END,...Array.from({length:8},(_,i)=>RIVER_END+(STRUCTURE_END-RIVER_END)*(i+1)/8)];
export const CREST=30,CURVE=20,LANDING=12;
function rise(u,len,a,b){u=Math.max(0,Math.min(len,u));const g=(b-a)/(len-CURVE);if(u<CURVE)return a+g*u*u/(2*CURVE);if(u>len-CURVE)return b-g*(len-u)**2/(2*CURVE);return a+g*(u-CURVE/2);}
export function deckHeight(s,approaches=[0,0]){if(s<=LANDING)return approaches[0];if(s<RIVER_START)return rise(s-LANDING,RIVER_START-LANDING,approaches[0],27);if(s<RIVER_END)return 27+3*Math.sin(Math.PI*(s-RIVER_START)/(RIVER_END-RIVER_START))**2;if(s>=L-LANDING)return approaches[1];return rise(L-LANDING-s,L-LANDING-RIVER_END,approaches[1],27);}
export const GRADES=[27/(RIVER_START-LANDING-CURVE),27/(L-LANDING-RIVER_END-CURVE),3*Math.PI/(RIVER_END-RIVER_START)];
export const approachBlend=s=>Math.min(smooth((s-LANDING)/110),smooth((L-LANDING-s)/110));
export function carriagewayCentres(s){const q=base.bridgePoint(s),x=base.bridgeLngLat(q.x,q.z)[0];return [NORTHBOUND,SOUTHBOUND].map(line=>{const v=base.bridgeLocal(x,latitude(line,x));return base.projectBridge(v.x,v.z).lateral;});}
export function edgesAt(s){const t=approachBlend(s),centres=carriagewayCentres(s);return [[-8,-.45],[.45,8]].map((edge,i)=>edge.map((v,j)=>(centres[i]+(j?3:-3))*(1-t)+v*t));}
export const widthAt=s=>20.2*approachBlend(s);
const accepted=createBridgeProfile({...base.CHAMPLAIN,roadEdgesAt:edgesAt});
export const PROFILE={...base,bridgePoint:(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s)),deckHeight,roadEdges:edgesAt,fittedLateral:(_s,d)=>d,
 bridgeRoadHeight(lng,lat,heading,approaches){if(accepted.bridgeRoadHeight(lng,lat,heading,approaches)===null)return null;return deckHeight(base.stationAt([lng,lat]),approaches);},
 meshStep:3,knots:[[0,'start'],[LANDING,'start'],[RIVER_START,27],[(RIVER_START+RIVER_END)/2,30],[RIVER_END,27],[L-LANDING,'end'],[L,'end']]};
