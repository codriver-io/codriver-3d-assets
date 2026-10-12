import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import alignment from './fred-hartman-bridge-alignment.js';
export const MAIN_SPAN=381,SIDE_SPAN=186.69,DECK_H=57,TOWER_H=134.112;
export const DECK_WIDTH=23.7744,GAP=1.2192,HALF_WIDTH=DECK_WIDTH+GAP/2;
export const ROAD_EDGES=[[-HALF_WIDTH+.55,-GAP/2-.55],[GAP/2+.55,HALF_WIDTH-.55]];
const base=createBridgeProfile({...SPEC,width:HALF_WIDTH*2,railGap:GAP/2,
 roadEdges:ROAD_EDGES,centerline:alignment.centerline,palette:PALETTES.light,
 clipStandardEnds:true,lateralBankFit:{blendM:150,terrainClamp:true,clearanceM:0},
 profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
// Aerial footprint at southern diamond; projected to the shared roadway alignment.
export const SOUTH_TOWER=base.stationAt([-95.0182,29.70230]);
export const NORTH_TOWER=SOUTH_TOWER+MAIN_SPAN;
export const TOWERS=[SOUTH_TOWER,NORTH_TOWER];
export const CABLE_START=SOUTH_TOWER-SIDE_SPAN,CABLE_END=NORTH_TOWER+SIDE_SPAN;
export const LANDING=60,CURVE=40;
// Only the low landing noses narrow. The channel and elevated viaducts stay rigid.
export const TAPER=150,LANDING_WIDTH=10.2;
const smooth=t=>t*t*(3-2*t);
export const landingBlend=s=>1-smooth(Math.min(1,Math.max(0,Math.min(s,L-s))/TAPER));
const mappedSegments=alignment.ways.flatMap(w=>w.line.slice(1).map((ll,i)=>[base.bridgeLocal(...w.line[i]),base.bridgeLocal(...ll)]));
export function mappedCentres(s){
 const q=base.bridgePoint(s,0,0),hits=[];
 for(const [a,b] of mappedSegments){
  const u=(a.x-q.x)*q.tx+(a.z-q.z)*q.tz,v=(b.x-q.x)*q.tx+(b.z-q.z)*q.tz;
  if(u*v>0||Math.abs(v-u)<1e-6)continue;
  const t=-u/(v-u),x=a.x+(b.x-a.x)*t-q.x,z=a.z+(b.z-a.z)*t-q.z;
  const d=-q.tz*x+q.tx*z;if(Math.abs(d)<40)hits.push(d);
 }
 return [-1,1].map(side=>{const candidates=hits.filter(d=>d*side>0);return candidates.length?candidates.sort((a,b)=>Math.abs(a)-Math.abs(b))[0]:side*(DECK_WIDTH+GAP)/2;});
}
export const landingEdges=(s,width=LANDING_WIDTH)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
export function roadEdges(s,joins,sections){
 const t=landingBlend(s);if(!t)return ROAD_EDGES;
 const end=s<L/2?0:1,fallback=landingEdges(s);
 // HD measurements are accepted at the nose, never across the rigid span.
 const measured=base.roadEdges(s,joins,sections);
 return ROAD_EDGES.map((edge,side)=>{
  const hasMeasurement=joins?.[end]?.[side]||sections?.some(v=>v.edges?.[side]);
  const target=hasMeasurement?measured[side]:fallback[side];
  return edge.map((d,i)=>d+(target[i]-d)*t);
 });
}
function remap(d,from,to){
 if(d<from[0])return d+to[0]-from[0];if(d>from[1])return d+to[1]-from[1];
 return to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);
}
export const authoredLateral=(s,d)=>remap(d,ROAD_EDGES[d<0?0:1],roadEdges(s)[d<0?0:1]);
const fittedLateral=(s,d,joins,sections)=>{
 if(!landingBlend(s))return d;
 const side=d<0?0:1;return remap(d,roadEdges(s)[side],roadEdges(s,joins,sections)[side]);
};
function rise(u,len,low){const g=(DECK_H-low)/(len-CURVE);
 if(u<CURVE)return low+g*u*u/(2*CURVE);
 if(u>len-CURVE)return DECK_H-g*(len-u)**2/(2*CURVE);
 return low+g*(u-CURVE/2);
}
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
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,
 fittedLateral,roadEdges,meshStep:4,
 knots:[[0,'start'],[LANDING,'start'],[CABLE_START,DECK_H],[CABLE_END,DECK_H],[L-LANDING,'end'],[L,'end']]};
export const GRADES=[DECK_H/(CABLE_START-LANDING-CURVE),DECK_H/(L-LANDING-CABLE_END-CURVE)];
