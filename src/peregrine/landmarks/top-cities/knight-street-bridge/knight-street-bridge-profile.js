import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import mapped from './knight-street-bridge-alignment.js';
export const NORTH_IDS=[256221932,1211141308,36747909,35354556,1060103924,389809706,548624436,389809697,389809703,389809700];
export const SOUTH_IDS=[361504160,259650436,36747880,36747879,389809707,548624433,35354565,1274849639,389809708,389809699,24885827,76146115,131559717];
const line=ids=>ids.flatMap(id=>mapped[id].line).sort((a,b)=>b[1]-a[1]).filter((v,i,a)=>!i||v[1]!==a[i-1][1]);
export const WEST=line(NORTH_IDS),EAST=line(SOUTH_IDS);
function longitude(a,lat){let i=1;while(i<a.length-1&&a[i][1]>lat)i++;const p=a[i-1],q=a[i],t=(lat-p[1])/(q[1]-p[1]);return p[0]+t*(q[0]-p[0]);}
const north=Math.min(WEST[0][1],EAST[0][1]),south=Math.max(WEST.at(-1)[1],EAST.at(-1)[1]);
// Continue the mapped southbound road to the northbound connection latitude.
export const CENTERLINE=[...new Set([north,south,...WEST.concat(EAST).map(v=>v[1]).filter(v=>v<north&&v>south)])].sort((a,b)=>b-a).map(lat=>[(longitude(WEST,lat)+longitude(EAST,lat))/2,lat]);
const base=createBridgeProfile({id:SPEC.id,name:SPEC.name,origin:SPEC.origin,width:32,roadEdges:[[-13.5,-.55],[.55,13.5]],centerline:CENTERLINE,
 palette:PALETTES.light,terrainPolicy:'absolute-deck',clipStandardEnds:true,lateralBankFit:{terrainClamp:true,clearanceM:.15},
 profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH,MAIN_SPAN=109.7,DECK_H=25.5,TAPER=75;
export const station=lat=>base.stationAt([longitude(CENTERLINE,lat),lat]);
export const NORTH_START=station(49.2094553),NORTH_END=NORTH_START+238,SOUTH_START=station(49.2056719),SOUTH_END=SOUTH_START+1198;
export const MAIN_MID=station(49.201973),MAIN_N=MAIN_MID-MAIN_SPAN/2,MAIN_S=MAIN_MID+MAIN_SPAN/2;
export const NORTH_MAIN=NORTH_START+119;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const landingBlend=s=>1-smooth(Math.min(s,L-s)/TAPER);
export const northBlend=s=>1-smooth((s-NORTH_END)/110);
export const roadWidth=s=>8.45+4.5*northBlend(s);
export const authoredEdges=s=>[[-roadWidth(s)-.55,-.55],[.55,roadWidth(s)+.55]];
export const outerEdge=(s,side)=>side*(roadWidth(s)+3.05);
export function mappedCentres(s){const q=base.bridgePoint(s),lat=base.bridgeLngLat(q.x,q.z)[1];return [EAST,WEST].map(a=>{const v=base.bridgeLocal(longitude(a,lat),lat);return -q.tz*(v.x-q.x)+q.tx*(v.z-q.z);});}
export const landingEdges=(s,width=7.2)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
export function roadEdges(s,joins,sections){const from=authoredEdges(s),t=landingBlend(s);if(!t)return from;
 const end=s<L/2?0:1,measured=base.roadEdges(s,joins,sections),fallback=landingEdges(s);
 return from.map((e,i)=>e.map((d,k)=>d+((joins?.[end]?.[i]||sections?.some(v=>v.edges?.[i])?measured[i][k]:fallback[i][k])-d)*t));}
const remap=(d,a,b,shoulder=1)=>d<a[0]?b[0]+(d-a[0])*shoulder:d>a[1]?b[1]+(d-a[1])*shoulder:b[0]+(d-a[0])/(a[1]-a[0])*(b[1]-b[0]);
export const authoredLateral=(s,d)=>{const i=d<0?0:1;return remap(d,authoredEdges(s)[i],roadEdges(s)[i],1-landingBlend(s));};
const fittedLateral=(s,d,joins,sections)=>{if(!landingBlend(s))return d;const a=roadEdges(s),b=roadEdges(s,joins,sections),i=d<(a[0][1]+a[1][0])/2?0:1;return remap(d,a[i],b[i]);};
// Constant-grade ramps with 20 m parabolic vertical curves at both ends.
const curve=20;
function rise(u,length,low,high){const g=(high-low)/(length-curve);if(u<curve)return low+g*u*u/(2*curve);if(u>length-curve)return high-g*(length-u)**2/(2*curve);return low+g*(u-curve/2);}
export function deckHeight(s,ends=[0,0]){s=Math.max(0,Math.min(L,s));
 if(s<20)return ends[0];
 if(s<NORTH_MAIN-35)return rise(s-20,NORTH_MAIN-55,ends[0],15);
 if(s<NORTH_MAIN+35)return 15;
 if(s<NORTH_END+60)return rise(s-(NORTH_MAIN+35),NORTH_END+25-NORTH_MAIN,15,10);
 if(s<SOUTH_START)return 10;
 if(s<MAIN_N)return rise(s-SOUTH_START,MAIN_N-SOUTH_START,10,DECK_H);
 if(s<=MAIN_S)return DECK_H;
 if(s>L-20)return ends[1];
 return rise(s-MAIN_S,L-20-MAIN_S,DECK_H,ends[1]);}
export const girderDepth=s=>{let t=0;for(const pier of [MAIN_N,MAIN_S,NORTH_MAIN-MAIN_SPAN/2,NORTH_MAIN+MAIN_SPAN/2])t=Math.max(t,Math.max(0,1-Math.abs(s-pier)/53));return 2.2+3.2*t*t;};
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,ends,joins,sections)=>{const v=base.bridgeLocal(lng,lat),q=base.projectBridge(v.x,v.z);
 if(q.beyond||!roadEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-.6&&q.lateral<=b+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}return deckHeight(q.s,ends);};
export const PROFILE={...base,bridgePoint,bridgeRoadHeight,deckHeight,fittedLateral,roadEdges,meshStep:4,
 knots:[[0,'start'],[20,'start'],[NORTH_MAIN-35,15],[NORTH_MAIN+35,15],[NORTH_END+60,10],[SOUTH_START,10],[MAIN_N,DECK_H],[MAIN_S,DECK_H],[L-20,'end'],[L,'end']]};
export default PROFILE;
