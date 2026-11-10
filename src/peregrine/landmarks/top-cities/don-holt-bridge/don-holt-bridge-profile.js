import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {FOOTPRINTS} from './footprint.js';
import alignment from './don-holt-bridge-alignment.js';
export const TRUSS=245.5,DECK_H=52,ROAD_EDGES=[[-13.7,-.225],[.225,13.7]],TAPER=150,CURVE=60;
const base=createBridgeProfile({...SPEC,width:30,railGap:.2,roadEdges:ROAD_EDGES,centerline:alignment.centerline,
 palette:PALETTES.light,buildingFootprints:FOOTPRINTS,clipStandardEnds:true,
 profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH,MID=base.stationAt(SPEC.origin),START=MID-TRUSS,END=MID+TRUSS;
// Keep the approved parabolic 52 m truss crest. Straight approach grades have
// 60 m vertical curves, tangent to both the landing and the original truss.
const trussGrade=2.4/TRUSS;
export const RAMP_LENGTHS=[START,L-END];
export const GRADES=RAMP_LENGTHS.map(D=>(50.8-trussGrade*CURVE/2)/(D-CURVE));
function ramp(x,D,end){const g=(50.8-end-trussGrade*CURVE/2)/(D-CURVE);
 if(x<CURVE)return end+g*x*x/(2*CURVE);
 if(x>D-CURVE){const u=D-x;return 50.8-trussGrade*u-(g-trussGrade)*u*u/(2*CURVE);}
 return end+g*(x-CURVE/2);
}
export function deckHeight(s,ends=[0,0]){s=Math.max(0,Math.min(L,s));
 if(s<START)return ramp(s,START,ends[0]);if(s>END)return ramp(L-s,L-END,ends[1]);
 return 52-1.2*((s-MID)/TRUSS)**2;
}
const smooth=t=>t*t*(3-2*t);
export const landingBlend=s=>1-smooth(Math.max(0,Math.min(1,Math.min(s,L-s)/TAPER)));
const mapped=alignment.ways.map(w=>w.line.map(ll=>{const q=base.bridgeLocal(...ll);return base.projectBridge(q.x,q.z);}).sort((a,b)=>a.s-b.s));
export function mappedCentres(s){return mapped.map(line=>{let i=1;while(i<line.length-1&&line[i].s<s)i++;const a=line[i-1],b=line[i],t=(s-a.s)/(b.s-a.s);return a.lateral+(b.lateral-a.lateral)*t;}).sort((a,b)=>a-b);}
export const landingEdges=(s,width=6.2)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
export function roadEdges(s,joins,sections){const t=landingBlend(s);if(!t)return ROAD_EDGES;
 const measured=base.roadEdges(s,joins,sections),fallback=landingEdges(s),end=s<L/2?0:1;
 return ROAD_EDGES.map((edge,i)=>edge.map((d,k)=>d+((joins?.[end]?.[i]||sections?.some(v=>v.edges?.[i])?measured[i]:fallback[i])[k]-d)*t));
}
function remap(d,from,to){if(d<from[0])return d+to[0]-from[0];if(d>from[1])return d+to[1]-from[1];return to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);}
export const authoredLateral=(s,d)=>remap(d,ROAD_EDGES[d<0?0:1],roadEdges(s)[d<0?0:1]);
const fittedLateral=(s,d,joins,sections)=>!landingBlend(s)?d:remap(d,roadEdges(s)[d<0?0:1],roadEdges(s,joins,sections)[d<0?0:1]);
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
function bridgeRoadHeight(lng,lat,heading,ends,joins,sections){const v=base.bridgeLocal(lng,lat),q=base.projectBridge(v.x,v.z);
 if(q.beyond||!roadEdges(q.s,joins,sections).some(([l,r])=>q.lateral>=l-.6&&q.lateral<=r+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return deckHeight(q.s,ends);
}
const ownsPoint=(x,z)=>{const q=base.projectBridge(x,z);return !q.beyond&&roadEdges(q.s).some(([l,r])=>q.lateral>=l-.7&&q.lateral<=r+.7);};
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,roadEdges,fittedLateral,ownsPoint,meshStep:5,
 knots:[[0,'start'],[START,50.8],[MID,52],[END,50.8],[L,'end']]};
