import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import mapped from './oak-street-bridge-alignment.js';
export const DECK_H=26,WIDTH=19.6,ROAD_EDGES=[[-7.25,-.25],[.25,7.25]],TAPER=100;
const southbound=[...mapped[24530033].line,...mapped[24530021].line.slice(1),...mapped[1274838145].line.slice(1),...mapped[182607986].line.slice(1)];
const northbound=[...mapped[24530023].line,...mapped[182607985].line.slice(1),...mapped[338171747].line.slice(1)].reverse();
function longitude(line,lat){for(let i=1;i<line.length;i++){const a=line[i-1],b=line[i];if((a[1]-lat)*(b[1]-lat)<=0)return a[0]+(b[0]-a[0])*(lat-a[1])/(b[1]-a[1]);}throw Error('outside alignment');}
const north=Math.min(northbound[0][1],southbound[0][1]),south=Math.max(northbound.at(-1)[1],southbound.at(-1)[1]);
export const CENTERLINE=[...new Set([north,south,...northbound.concat(southbound).map(p=>p[1]).filter(lat=>lat<north&&lat>south)])].sort((a,b)=>b-a).map(lat=>[(longitude(northbound,lat)+longitude(southbound,lat))/2,lat]);
const base=createBridgeProfile({id:SPEC.id,name:SPEC.name,origin:SPEC.origin,width:WIDTH,roadEdges:ROAD_EDGES,centerline:CENTERLINE,palette:PALETTES.light,terrainPolicy:SPEC.terrainPolicy,clipStandardEnds:true,lateralBankFit:{terrainClamp:true,clearanceM:0},profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH,MID=base.stationAt(SPEC.origin),MAIN_PIERS=[MID-45.7-60.9,MID-45.7,MID+45.7,MID+45.7+60.9];
export const STEEL_START=MAIN_PIERS[0]-2*60.9,STEEL_END=MAIN_PIERS[3]+2*60.9,LANDING=30,CURVE=35;
const smooth=t=>t*t*(3-2*t);
export const landingBlend=s=>1-smooth(Math.min(1,Math.max(0,Math.min(s,L-s))/TAPER));
const segments=[northbound,southbound].flatMap(line=>line.slice(1).map((ll,i)=>[base.bridgeLocal(...line[i]),base.bridgeLocal(...ll)]));
export function mappedCentres(s){const q=base.bridgePoint(s,0,0),hits=[];for(const[a,b]of segments){const u=(a.x-q.x)*q.tx+(a.z-q.z)*q.tz,v=(b.x-q.x)*q.tx+(b.z-q.z)*q.tz;if(u*v>1e-6||Math.abs(v-u)<1e-6)continue;const t=-u/(v-u),d=-q.tz*(a.x+(b.x-a.x)*t-q.x)+q.tx*(a.z+(b.z-a.z)*t-q.z);if(Math.abs(d)<30)hits.push(d);}return[-1,1].map(side=>hits.filter(d=>d*side>0).sort((a,b)=>Math.abs(a)-Math.abs(b))[0]??side*3.75);}
export const landingEdges=(s,width=7)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
export function roadEdges(s,joins,sections){const t=landingBlend(s);if(!t)return ROAD_EDGES;const end=s<L/2?0:1,fallback=landingEdges(s),measured=base.roadEdges(s,joins,sections);return ROAD_EDGES.map((edge,side)=>{const target=joins?.[end]?.[side]||sections?.some(v=>v.edges?.[side])?measured[side]:fallback[side];return edge.map((d,i)=>d+(target[i]-d)*t);});}
function remap(d,from,to,shoulder=1){if(d<from[0])return to[0]+(d-from[0])*shoulder;if(d>from[1])return to[1]+(d-from[1])*shoulder;return to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);}
export const authoredLateral=(s,d)=>{const side=d<0?0:1;return remap(d,ROAD_EDGES[side],roadEdges(s)[side],1-landingBlend(s));};
const fittedLateral=(s,d,joins,sections)=>{if(!landingBlend(s))return d;const from=roadEdges(s),to=roadEdges(s,joins,sections);if(d>from[0][1]&&d<from[1][0])return to[0][1]+(d-from[0][1])/(from[1][0]-from[0][1])*(to[1][0]-to[0][1]);const side=d<(from[0][1]+from[1][0])/2?0:1;return remap(d,from[side],to[side]);};
function rise(u,length,low,high){const grade=(high-low)/(length-CURVE);if(u<CURVE)return low+grade*u*u/(2*CURVE);if(u>length-CURVE)return high-grade*(length-u)**2/(2*CURVE);return low+grade*(u-CURVE/2);}
export function deckHeight(s,ends=[0,0]){s=Math.max(0,Math.min(L,s));if(s<LANDING)return ends[0];if(s<STEEL_START)return rise(s-LANDING,STEEL_START-LANDING,ends[0],24);if(s<=STEEL_END)return 24+2*Math.sin(Math.PI*(s-STEEL_START)/(STEEL_END-STEEL_START));if(s>L-LANDING)return ends[1];return rise(L-LANDING-s,L-LANDING-STEEL_END,ends[1],24);}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,ends,joins,sections)=>{const local=base.bridgeLocal(lng,lat),q=base.projectBridge(local.x,local.z);if(q.beyond||!roadEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-.6&&q.lateral<=b+.6))return null;if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}return deckHeight(q.s,ends);};
export const PROFILE={...base,bridgePoint,deckHeight,bridgeRoadHeight,fittedLateral,roadEdges,meshStep:4,knots:[[0,'start'],[LANDING,'start'],[STEEL_START,24],[MID,26],[STEEL_END,24],[L-LANDING,'end'],[L,'end']]};
export const NORTH_GRADE=24/(STEEL_START-LANDING-CURVE),SOUTH_GRADE=24/(L-LANDING-STEEL_END-CURVE);
export default PROFILE;
