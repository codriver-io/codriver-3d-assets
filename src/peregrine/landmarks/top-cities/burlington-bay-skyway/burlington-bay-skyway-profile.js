import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import alignment from './burlington-bay-skyway-alignment.js';
export const MAIN_SPAN=151,BACK_SPAN=83.7,CLEARANCE=36.7,DECK_H=39.2,CROWN=64;
// New (west/negative lateral) and original (east/positive lateral), each four lanes.
export const CENTRES=[-12.5,12.5],WIDTHS=[21.25,20.4];
export const ROAD_EDGES=CENTRES.map((d,i)=>[d-WIDTHS[i]/2+.65,d+WIDTHS[i]/2-.65]);
const base=createBridgeProfile({...SPEC,width:47,railGap:1.6,roadEdges:ROAD_EDGES,palette:PALETTES.light,
 centerline:alignment.centerline,clipStandardEnds:true,lateralBankFit:{blendM:160},
 profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH,MID=base.stationAt(SPEC.origin),TAPER=150,LANDING=25,SAG=65;
export const UNIT=[MID-MAIN_SPAN/2-BACK_SPAN,MID+MAIN_SPAN/2+BACK_SPAN];
export const MAIN=[MID-MAIN_SPAN/2,MID+MAIN_SPAN/2];
export const NEW_ENDS=[base.stationAt([-79.7918141,43.2888814]),base.stationAt([-79.8024271,43.3072612])];
// 6 km crest with constant-grade tangents and 65 m sag curves. No smoothstep hump ramps.
const K=1/6000;
function side(D){const a=D-SAG/2,g=K*(a-Math.sqrt(a*a-2*DECK_H/K));return {D,g,C:g/K};}
export const SIDES=[side(MID-LANDING),side(L-LANDING-MID)],GRADES=SIDES.map(v=>v.g);
function design(s){const x=s-MID,{D,g,C}=SIDES[x<0?0:1],a=Math.abs(x);
 if(a<=C)return DECK_H-K*a*a/2;
 if(a<=D-SAG)return DECK_H-g*C/2-g*(a-C);
 if(a<=D){const u=D-a;return g*u*u/(2*SAG);}return 0;
}
const smooth=t=>t*t*(3-2*t),clamp=t=>Math.max(0,Math.min(1,t));
export function deckHeight(s,ends=[0,0]){s=Math.max(0,Math.min(L,s));
 const a=1-smooth(clamp((s-LANDING)/(UNIT[0]-LANDING))),b=1-smooth(clamp((L-LANDING-s)/(L-LANDING-UNIT[1])));
 return design(s)+ends[0]*a+ends[1]*b;
}
export const landingBlend=s=>1-smooth(clamp(Math.min(s,L-s)/TAPER));
const segments=alignment.ways.flatMap(w=>w.line.slice(1).map((ll,i)=>[base.bridgeLocal(...w.line[i]),base.bridgeLocal(...ll)]));
export function mappedCentres(s){const q=base.bridgePoint(s,0,0),hits=[];
 for(const [a,b] of segments){const u=(a.x-q.x)*q.tx+(a.z-q.z)*q.tz,v=(b.x-q.x)*q.tx+(b.z-q.z)*q.tz;
 if(u*v>0||Math.abs(v-u)<1e-7)continue;const t=-u/(v-u),d=-q.tz*(a.x+(b.x-a.x)*t-q.x)+q.tx*(a.z+(b.z-a.z)*t-q.z);
 if(Math.abs(d)<40)hits.push(d);}
 return [-1,1].map((sg,i)=>hits.filter(d=>d*sg>0).sort((a,b)=>Math.abs(a)-Math.abs(b))[0]??CENTRES[i]);
}
export const landingEdges=(s,width=15.2)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
export function roadEdges(s,joins,sections){const t=landingBlend(s);if(!t)return ROAD_EDGES;
 const measured=base.roadEdges(s,joins,sections),fallback=landingEdges(s),end=s<L/2?0:1;
 return ROAD_EDGES.map((edge,i)=>edge.map((d,k)=>d+((joins?.[end]?.[i]||sections?.some(v=>v.edges?.[i])?measured[i]:fallback[i])[k]-d)*t));
}
function remap(d,from,to){if(d<from[0])return d+to[0]-from[0];if(d>from[1])return d+to[1]-from[1];return to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);}
export const authoredLateral=(s,d,i=d<0?0:1)=>remap(d,ROAD_EDGES[i],roadEdges(s)[i]);
const fittedLateral=(s,d,joins,sections)=>!landingBlend(s)?d:remap(d,roadEdges(s)[d<0?0:1],roadEdges(s,joins,sections)[d<0?0:1]);
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{const a=base.bridgeLocal(lng,lat),q=base.projectBridge(a.x,a.z);
 if(q.beyond||!roadEdges(q.s,joins,sections).some(([l,r])=>q.lateral>=l-.6&&q.lateral<=r+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return deckHeight(q.s,approaches);
};
// Canal datum controls use the open water just west of the bridge; this avoids the coarse DEM's
// bridge/ship artefacts and keeps the high channel spans rigid above Lake Ontario's water datum.
export const GROUND_CONTROLS=[{s:0,sampleS:0},{s:UNIT[0],sampleLngLat:[-79.7995,43.2989]},
 {s:UNIT[1],sampleLngLat:[-79.7995,43.2989]},{s:L,sampleS:L}];
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,fittedLateral,roadEdges,groundControls:GROUND_CONTROLS,meshStep:5,
 knots:[[0,'start'],[UNIT[0],DECK_H],[UNIT[1],DECK_H],[L,'end']]};
