import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import alignment from './long-beach-international-gateway-alignment.js';
export const MAIN_SPAN=305,SIDE_SPAN=152.5,DECK_H=66.5,TOWER_H=157,WIDTH=50.5968;
export const ROAD_EDGES=[[-21.6,-4.6],[4.6,21.6]];
const smooth=t=>t*t*(3-2*t),clamp=t=>Math.max(0,Math.min(1,t));
const base=createBridgeProfile({...SPEC,width:WIDTH,railGap:4.1,roadEdges:ROAD_EDGES,
 centerline:alignment.centerline,palette:PALETTES.light,clipStandardEnds:true,
 lateralBankFit:{blendM:180,terrainClamp:true,clearanceM:0},
 profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
const middle=base.projectBridge(0,0).s;
export const TOWERS=[middle-MAIN_SPAN/2,middle+MAIN_SPAN/2];
export const CABLE_START=TOWERS[0]-SIDE_SPAN,CABLE_END=TOWERS[1]+SIDE_SPAN;
export const LANDING=50,CURVE=40,TAPER=180;
export const landingBlend=s=>1-smooth(clamp(Math.min(s,L-s)/TAPER));
// Station-normal intersections preserve the mapped separate approach ribbons.
const segments=alignment.ways.flatMap(w=>w.line.slice(1).map((q,i)=>[base.bridgeLocal(...w.line[i]),base.bridgeLocal(...q)]));
export function mappedCentres(s){
 const p=base.bridgePoint(s,0,0),hits=[];
 for(const [a,b] of segments){
  const u=(a.x-p.x)*p.tx+(a.z-p.z)*p.tz,v=(b.x-p.x)*p.tx+(b.z-p.z)*p.tz;
  if(u*v>0||Math.abs(v-u)<1e-8)continue;
  const t=-u/(v-u),x=a.x+t*(b.x-a.x)-p.x,z=a.z+t*(b.z-a.z)-p.z;
  hits.push(-p.tz*x+p.tx*z);
 }
 return [-1,1].map(side=>hits.filter(d=>d*side>0).sort((a,b)=>Math.abs(a)-Math.abs(b))[0]??side*13.1);
}
export const landingEdges=(s,width)=>mappedCentres(s).map(d=>[d-(width??(s<L/2?10.8:4.2))/2,d+(width??(s<L/2?10.8:4.2))/2]);
export function roadEdges(s,joins,sections){
 const a=clamp((CABLE_START-s)/240),c=clamp((s-CABLE_END)/240),t=smooth(Math.max(a,c));
 const centers=mappedCentres(s),end=s<L/2?0:1,nose=landingBlend(s),target=landingEdges(s);
 return ROAD_EDGES.map((edge,side)=>edge.map((d,i)=>{
  const rigid=d+(centers[side]-(side?13.1:-13.1))*t,measured=joins?.[end]?.[side]?.[i];
  return rigid+((Number.isFinite(measured)?measured:target[side][i])-rigid)*nose;
 }));
}
function remap(d,from,to){return d<from[0]?d+to[0]-from[0]:d>from[1]?d+to[1]-from[1]:to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);}
export const authoredLateral=(s,d)=>remap(d,ROAD_EDGES[d<0?0:1],roadEdges(s)[d<0?0:1]);
const fittedLateral=(s,d,joins,sections)=>landingBlend(s)?remap(d,roadEdges(s)[d<0?0:1],roadEdges(s,joins,sections)[d<0?0:1]):d;
function rise(u,len,low){const g=(DECK_H-low)/(len-CURVE);return u<CURVE?low+g*u*u/(2*CURVE):u>len-CURVE?DECK_H-g*(len-u)**2/(2*CURVE):low+g*(u-CURVE/2);}
export function deckHeight(s,approaches=[0,0]){
 s=Math.max(0,Math.min(L,s));
 if(s<LANDING)return approaches[0];
 if(s<CABLE_START)return rise(s-LANDING,CABLE_START-LANDING,approaches[0]);
 if(s<=CABLE_END)return DECK_H;
 if(s>L-LANDING)return approaches[1];
 return rise(L-LANDING-s,L-LANDING-CABLE_END,approaches[1]);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{
 const local=base.bridgeLocal(lng,lat),q=base.projectBridge(local.x,local.z);
 if(q.beyond||!roadEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-.6&&q.lateral<=b+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return deckHeight(q.s,approaches);
};
export const PROFILE={...base,deckHeight,bridgePoint,roadEdges,fittedLateral,bridgeRoadHeight,meshStep:4,
 knots:[[0,'start'],[LANDING,'start'],[CABLE_START,DECK_H],[CABLE_END,DECK_H],[L-LANDING,'end'],[L,'end']]};
export const GRADES=[DECK_H/(CABLE_START-LANDING-CURVE),DECK_H/(L-LANDING-CABLE_END-CURVE)];
