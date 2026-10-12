import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import mapped from './alex-fraser-bridge-alignment.js';
export const MAIN_SPAN=465, SIDE_SPAN=182.75, DECK_H=60, TOWER_H=154, HALF_WIDTH=16;
// Bridge width includes two narrow raised shared paths; seven 3.45 m lanes.
// Negative lateral is east/northbound, with three lanes; positive is west/southbound, four.
export const ROAD_EDGES=[[-12.45,-1.85],[-1.5,12.55]];
const northbound=[...mapped[25005852].line,...mapped[25005363].line.slice(1),...mapped[327505388].line.slice(1),...mapped[156897051].line.slice(1)].reverse();
const southbound=[...mapped[700396911].line,...mapped[327505391].line.slice(1),...mapped[25005853].line.slice(1)];
function longitude(line,lat) {
  let i=1;while(i<line.length-1&&line[i][1]>lat)i++;
  const a=line[i-1],b=line[i],t=(lat-a[1])/(b[1]-a[1]);return a[0]+t*(b[0]-a[0]);
}
const north=Math.min(northbound[0][1],southbound[0][1]),south=Math.max(northbound.at(-1)[1],southbound.at(-1)[1]);
const lats=[...new Set([north,south,...northbound.concat(southbound).map(v=>v[1]).filter(v=>v<north&&v>south)])].sort((a,b)=>b-a);
export const CENTERLINE=lats.map(lat=>[(longitude(northbound,lat)+longitude(southbound,lat))/2,lat]);
const base=createBridgeProfile({id:SPEC.id,name:SPEC.name,origin:SPEC.origin,width:32,roadEdges:ROAD_EDGES,
  railGap:0,centerline:CENTERLINE,palette:PALETTES.light,terrainPolicy:SPEC.terrainPolicy,
  clipStandardEnds:true,lateralBankFit:{terrainClamp:true,clearanceM:0},
  profile:({length})=>[[0,'start'],[length,'end']],
});
// Towers inferred from the aerial image/outline's geographic main-span limits.
export const NORTH_TOWER=base.stationAt([-122.94363,49.16184]);
export const SOUTH_TOWER=NORTH_TOWER+MAIN_SPAN;
export const CABLE_START=NORTH_TOWER-SIDE_SPAN,CABLE_END=SOUTH_TOWER+SIDE_SPAN,L=base.BRIDGE_LENGTH;
export const LANDING=50,CURVE=40;
// Only the ground-level connection narrows; towers and elevated decks are rigid.
export const TAPER=100, LANDING_WIDTH=10.2;
const smooth=t=>t*t*(3-2*t);
export const landingBlend=s=>1-smooth(Math.min(1,Math.max(0,Math.min(s,L-s))/TAPER));
const carriagewaySegments=[northbound,southbound].flatMap(line=>line.slice(1).map((ll,i)=>[base.bridgeLocal(...line[i]),base.bridgeLocal(...ll)]));
export function mappedCentres(s){
 const q=base.bridgePoint(s,0,0),hits=[];
 for(const [a,b] of carriagewaySegments){
  const u=(a.x-q.x)*q.tx+(a.z-q.z)*q.tz,v=(b.x-q.x)*q.tx+(b.z-q.z)*q.tz;
  if(u*v>1e-6||Math.abs(v-u)<1e-6)continue;
  const t=-u/(v-u),x=a.x+(b.x-a.x)*t-q.x,z=a.z+(b.z-a.z)*t-q.z;
  const d=-q.tz*x+q.tx*z;if(Math.abs(d)<30)hits.push(d);
 }
 return [-1,1].map(side=>{const candidates=hits.filter(d=>d*side>0);return candidates.length?candidates.sort((a,b)=>Math.abs(a)-Math.abs(b))[0]:side*6.2;});
}
export const landingEdges=(s,width=LANDING_WIDTH)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
export function roadEdges(s,joins,sections){
 const t=landingBlend(s);if(!t)return ROAD_EDGES;
 const end=s<L/2?0:1,fallback=landingEdges(s),measured=base.roadEdges(s,joins,sections);
 return ROAD_EDGES.map((edge,side)=>{
  const target=joins?.[end]?.[side]||sections?.some(v=>v.edges?.[side])?measured[side]:fallback[side];
  return edge.map((d,i)=>d+(target[i]-d)*t);
 });
}
function remap(d,from,to,shoulder=1){
 if(d<from[0])return to[0]+(d-from[0])*shoulder;
 if(d>from[1])return to[1]+(d-from[1])*shoulder;
 return to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);
}
const sideFor=(d,edges)=>d<(edges[0][1]+edges[1][0])/2?0:1;
export const authoredLateral=(s,d)=>{const side=sideFor(d,ROAD_EDGES);return remap(d,ROAD_EDGES[side],roadEdges(s)[side],1-landingBlend(s));};
const fittedLateral=(s,d,joins,sections)=>{
 if(!landingBlend(s))return d;
 const authored=roadEdges(s),fitted=roadEdges(s,joins,sections),side=sideFor(d,authored);
 // A tapering median stays at the centre of the provider gap, rather than
 // expanding to pave the whole separator between the carriageways.
 if(d>authored[0][1]&&d<authored[1][0])return fitted[0][1]+(d-authored[0][1])/(authored[1][0]-authored[0][1])*(fitted[1][0]-fitted[0][1]);
 return remap(d,authored[side],fitted[side]);
};
function rise(u,length,low,high) {
  const grade=(high-low)/(length-CURVE);
  if(u<CURVE)return low+grade*u*u/(2*CURVE);
  if(u>length-CURVE)return high-grade*(length-u)**2/(2*CURVE);
  return low+grade*(u-CURVE/2);
}
export function deckHeight(s,ends=[0,0]) {
  s=Math.max(0,Math.min(L,s));
  if(s<LANDING)return ends[0];
  if(s<CABLE_START)return rise(s-LANDING,CABLE_START-LANDING,ends[0],DECK_H);
  if(s<=CABLE_END)return DECK_H;
  if(s>L-LANDING)return ends[1];
  return rise(L-LANDING-s,L-LANDING-CABLE_END,ends[1],DECK_H);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,ends,joins,sections)=>{
 const local=base.bridgeLocal(lng,lat),q=base.projectBridge(local.x,local.z);
 if(q.beyond||!roadEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-.6&&q.lateral<=b+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return deckHeight(q.s,ends);
};
export const PROFILE={...base,bridgePoint,deckHeight,bridgeRoadHeight,fittedLateral,roadEdges,meshStep:3,
  knots:[[0,'start'],[LANDING,'start'],[CABLE_START,DECK_H],[CABLE_END,DECK_H],[L-LANDING,'end'],[L,'end']]};
export const NORTH_GRADE=DECK_H/(CABLE_START-LANDING-CURVE),SOUTH_GRADE=DECK_H/(L-LANDING-CABLE_END-CURVE);
export default PROFILE;
