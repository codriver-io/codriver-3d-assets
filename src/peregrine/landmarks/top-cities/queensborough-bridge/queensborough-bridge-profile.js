import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {NORTHBOUND,SOUTHBOUND} from './queensborough-bridge-alignment.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function longitude(line,lat){let i=1;while(i<line.length-1&&line[i][1]<lat)i++;const a=line[i-1],b=line[i];return a[0]+(b[0]-a[0])*(lat-a[1])/(b[1]-a[1]);}
const south=Math.max(NORTHBOUND[0][1],SOUTHBOUND[0][1]),north=Math.min(NORTHBOUND.at(-1)[1],SOUTHBOUND.at(-1)[1]);
const lats=[...new Set([south,north,...NORTHBOUND.concat(SOUTHBOUND).map(p=>p[1]).filter(v=>v>south&&v<north)])].sort((a,b)=>a-b);
export const CENTERLINE=lats.map(y=>[(longitude(NORTHBOUND,y)+longitude(SOUTHBOUND,y))/2,y]);
const base=createBridgeProfile({...SPEC,width:22,palette:PALETTES.light,centerline:CENTERLINE,roadEdges:[[-7.3,-.4],[.4,7.3]],railGap:.2,clipStandardEnds:true,
 lateralBankFit:{blendM:150,terrainClamp:true,clearanceM:0},profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH,DECK_H=26,MAIN_SPAN=91,SIDE_SPAN=61;
export const MAIN_MID=base.projectBridge(0,0).s-30;
export const STEEL_START=MAIN_MID-106.5,MAIN_SOUTH=MAIN_MID-45.5,MAIN_NORTH=MAIN_MID+45.5,STEEL_END=MAIN_MID+106.5;
export const STRUCTURE_START=base.stationAt([-122.94278,49.19216]),STRUCTURE_END=base.stationAt([-122.94932,49.19841]);
export const LANDING=15,CURVE=18;
// Cityscape spreads the descent through the river unit instead of the short
// bank stub. World retains its original level steel crossing and terrain fit.
export const CITY_NORTH_DESCENT=MAIN_SOUTH+8;
export const realSurface=a=>Object.assign([...a],{real:true});
export const citySurface=a=>Object.assign([...a],{city:true});
export const approachBlend=s=>s<STRUCTURE_START?smooth((s-LANDING)/(STRUCTURE_START-LANDING)):s>STRUCTURE_END-90?smooth((STRUCTURE_END-10-s)/80):1;
export function carriagewayCentres(s){const q=base.bridgePoint(s),lat=base.bridgeLngLat(q.x,q.z)[1];return [SOUTHBOUND,NORTHBOUND].map(line=>{const a=base.bridgeLocal(longitude(line,lat),lat);return base.projectBridge(a.x,a.z).lateral;});}
export function edgesAt(s){const t=approachBlend(s),c=carriagewayCentres(s);return [[-7.3,-.4],[.4,7.3]].map((edge,i)=>edge.map((d,j)=>d*t+(c[i]+(j?3:-3))*(1-t)));}
function rise(u,length,a,b){const g=(b-a)/(length-CURVE);if(u<CURVE)return a+g*u*u/(2*CURVE);if(u>length-CURVE)return b-g*(length-u)**2/(2*CURVE);return a+g*(u-CURVE/2);}
export function deckHeight(s,approaches=[0,0]){s=Math.max(0,Math.min(L,s));if(s<LANDING)return approaches[0];if(s<STEEL_START)return rise(s-LANDING,STEEL_START-LANDING,approaches[0],DECK_H);const descent=approaches.city?CITY_NORTH_DESCENT:STEEL_END;if(s<=descent)return DECK_H;if(s>L-LANDING)return approaches[1];return rise(L-LANDING-s,L-LANDING-descent,approaches[1],DECK_H);}
export const GRADES=[DECK_H/(STEEL_START-LANDING-CURVE),DECK_H/(L-LANDING-CITY_NORTH_DESCENT-CURVE)];
const accepted=createBridgeProfile({...base.CHAMPLAIN,roadEdgesAt:edgesAt});
export const PROFILE={...base,deckHeight,bridgePoint:(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s)),roadEdges:s=>edgesAt(s),fittedLateral:(_s,d)=>d,
 bridgeRoadHeight(lng,lat,heading,approaches){if(accepted.bridgeRoadHeight(lng,lat,heading,approaches)===null)return null;return deckHeight(base.stationAt([lng,lat]),approaches);},
 meshStep:3,knots:[[0,'start'],[LANDING,'start'],[STEEL_START,DECK_H],[CITY_NORTH_DESCENT,DECK_H],[STEEL_END,DECK_H],[L-LANDING,'end'],[L,'end']]};
