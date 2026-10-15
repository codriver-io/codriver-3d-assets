import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import alignment from './dames-point-bridge-alignment.js';
// Published: 1,300 ft main span, 175 ft clearance, 471 ft pylons, 106 ft width.
export const MAIN_SPAN=396.24,SIDE_SPAN=198.12,CLEARANCE=53.34,DECK_DEPTH=2.0,DECK_H=CLEARANCE+DECK_DEPTH,TOWER_H=143.56;
export const HALF_WIDTH=16.1,MEDIAN=0.7;
// 3 x 3.66 m lanes plus shoulders each way between the outer parapets and the median barrier.
export const ROAD_EDGES=[[-14.4,-MEDIAN],[MEDIAN,14.4]];
const base=createBridgeProfile({...SPEC,width:HALF_WIDTH*2,railGap:MEDIAN,
 roadEdges:ROAD_EDGES,centerline:alignment.centerline,palette:PALETTES.light,
 clipStandardEnds:true,lateralBankFit:{blendM:150,terrainClamp:true,clearanceM:0},
 profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
// Mid-channel: the expansion joint and the mapped "Dames Point Bridge Air Gap" sensor, with the two
// pylons seen 392 m apart in Esri World Imagery (reference only), set to the published 396.24 m.
export const MID=base.stationAt([-81.5569563,30.3847441]);
export const TOWERS=[MID-MAIN_SPAN/2,MID+MAIN_SPAN/2];
export const CABLE_START=MID-MAIN_SPAN/2-SIDE_SPAN,CABLE_END=MID+MAIN_SPAN/2+SIDE_SPAN;
// North end of the mapped bridge ways; beyond it the road runs on the approach embankment.
export const BRIDGE_END=base.stationAt([-81.5605813,30.3930293]);
export const LANDING=30,SAG=60,CREST_R=8000;
// One crest radius through both pylons; each side then takes the constant grade that lands it at
// grade with a 60 m sag curve: the long south viaduct is gentle, the north side steeper.
const K=1/CREST_R;
function side(D){const a=D-SAG/2,g=K*(a-Math.sqrt(a*a-2*DECK_H/K));return {D,g,C:g/K};}
export const SIDES=[side(MID-LANDING),side(L-LANDING-MID)];
export const GRADES=SIDES.map(v=>v.g);
function design(s){
 const x=s-MID,{D,g,C}=SIDES[x<0?0:1],ax=Math.abs(x);
 if(ax<=C)return DECK_H-K*ax*ax/2;
 if(ax<=D-SAG)return DECK_H-g*C/2-g*(ax-C);
 if(ax<=D){const u=D-ax;return g*u*u/(2*SAG);}
 return 0;
}
const smooth=t=>t*t*(3-2*t);
export function deckHeight(s,approaches=[0,0]){
 s=Math.max(0,Math.min(L,s));
 const w0=s<=LANDING?1:s>=CABLE_START?0:1-smooth((s-LANDING)/(CABLE_START-LANDING));
 const w1=L-s<=LANDING?1:s<=CABLE_END?0:1-smooth((L-LANDING-s)/(L-LANDING-CABLE_END));
 return design(s)+approaches[0]*w0+approaches[1]*w1;
}
// Only the landing noses narrow onto the mapped carriageways; viaducts and spans stay rigid.
export const TAPER=150,LANDING_WIDTH=12.0;
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
 return [-1,1].map(sd=>{const c=hits.filter(d=>d*sd>0);return c.length?c.sort((a,b)=>Math.abs(a)-Math.abs(b))[0]:sd*7.5;});
}
export const landingEdges=(s,width=LANDING_WIDTH)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
export function roadEdges(s,joins,sections){
 const t=landingBlend(s);if(!t)return ROAD_EDGES;
 const end=s<L/2?0:1,fallback=landingEdges(s);
 // HD measurements are accepted at the nose, never across the rigid spans.
 const measured=base.roadEdges(s,joins,sections);
 return ROAD_EDGES.map((edge,sd)=>{
  const has=joins?.[end]?.[sd]||sections?.some(v=>v.edges?.[sd]);
  const target=has?measured[sd]:fallback[sd];
  return edge.map((d,i)=>d+(target[i]-d)*t);
 });
}
function remap(d,from,to){
 if(d<from[0])return d+to[0]-from[0];if(d>from[1])return d+to[1]-from[1];
 return to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);
}
// Each half of the deck follows its own carriageway; a median half names its side explicitly.
export const authoredLateral=(s,d,sd=d<0?0:1)=>remap(d,ROAD_EDGES[sd],roadEdges(s)[sd]);
const fittedLateral=(s,d,joins,sections)=>{
 if(!landingBlend(s))return d;
 const sd=d<0?0:1;return remap(d,roadEdges(s)[sd],roadEdges(s,joins,sections)[sd]);
};
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{
 const local=base.bridgeLocal(lng,lat),q=base.projectBridge(local.x,local.z);
 if(q.beyond||!roadEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-.6&&q.lateral<=b+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return deckHeight(q.s,approaches);
};
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,fittedLateral,roadEdges,meshStep:4,
 knots:[[0,'start'],[LANDING,'start'],[CABLE_START,DECK_H],[CABLE_END,DECK_H],[L-LANDING,'end'],[L,'end']]};
