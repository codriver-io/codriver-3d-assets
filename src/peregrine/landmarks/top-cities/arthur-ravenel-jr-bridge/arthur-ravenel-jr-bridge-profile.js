import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {WAYS} from './arthur-ravenel-jr-bridge-alignment.js';
import {BUILDING_FOOTPRINTS} from './footprint.js';

export const HALF=19.5, CORE=456, ORIGINAL_END=720;
export const ROAD_EDGES=[[-18.55,-.4],[.4,14.95]];
export const approvedHeight=x=>62-7.2*(x/ORIGINAL_END)**2;
const lines=[[927255593,927255592,38968007],[50054023,927255594,927255595]].map(ids=>
  WAYS.filter(w=>ids.includes(w.id)).flatMap(w=>w.line).sort((a,b)=>a[0]-b[0]).filter((p,i,a)=>!i||p[0]!==a[i-1][0]));
const latAt=(line,lng)=>{let i=1;while(i<line.length-1&&line[i][0]<lng)i++;const a=line[i-1],b=line[i];return a[1]+(b[1]-a[1])*(lng-a[0])/(b[0]-a[0]);};
// East of the Morrison entrance and west of the first US 17 / SC 703 fork.
export const WEST=-79.93315,EAST=-79.90405;
const lngs=[...new Set([WEST,EAST,...lines.flat().map(p=>p[0]).filter(x=>x>WEST&&x<EAST)])].sort((a,b)=>a-b);
const centerline=lngs.map(lng=>[lng,(latAt(lines[0],lng)+latAt(lines[1],lng))/2]);
const base=createBridgeProfile({...SPEC,width:39,railGap:.3,roadEdges:ROAD_EDGES,centerline,
  palette:PALETTES.light,terrainPolicy:'absolute-deck',buildingFootprints:BUILDING_FOOTPRINTS,
  clipStandardEnds:true,lateralBankFit:{blendM:100,terrainClamp:true,clearanceM:.08},
  profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH,MID=base.stationAt(SPEC.origin);
export const TOWERS=[MID-235.6104,MID+235.6104];
export const LANDING=20,CURVE=60,TAPER=100;
export const RAMPS=[MID-CORE-LANDING,L-LANDING-MID-CORE];
const H=approvedHeight(CORE),initialGrade=14.4*CORE/ORIGINAL_END**2;
export const GRADES=RAMPS.map(d=>(H-initialGrade*CURVE/2)/(d-CURVE));
// Preserve the whole approved stayed unit and its tangent. Short parabolic
// vertical curves connect that tangent to a constant approach grade and flat nose.
function descent(u,length,low){
  const g=(H-low-initialGrade*CURVE/2)/(length-CURVE);
  if(u<=CURVE)return H-initialGrade*u-(g-initialGrade)*u*u/(2*CURVE);
  if(u>=length-CURVE)return low+g*(length-u)**2/(2*CURVE);
  return H-(initialGrade+g)*CURVE/2-g*(u-CURVE);
}
export function deckHeight(s,ends=[0,0]){
  s=Math.max(0,Math.min(L,s));const x=s-MID;
  if(Math.abs(x)<=CORE)return approvedHeight(x);
  if(s<LANDING)return ends[0];if(s>L-LANDING)return ends[1];
  const side=x<0?0:1;return descent(Math.abs(x)-CORE,RAMPS[side],ends[side]);
}
const smooth=t=>t*t*(3-2*t);
export const landingBlend=s=>1-smooth(Math.min(1,Math.max(0,Math.min(s,L-s))/TAPER));
const segments=lines.flatMap(line=>line.slice(1).map((ll,i)=>[base.bridgeLocal(...line[i]),base.bridgeLocal(...ll)]));
export function mappedCentres(s){
  const q=base.bridgePoint(s,0,0),hits=[];
  for(const [a,b] of segments){const u=(a.x-q.x)*q.tx+(a.z-q.z)*q.tz,v=(b.x-q.x)*q.tx+(b.z-q.z)*q.tz;
    if(u*v>1e-6||Math.abs(v-u)<1e-6)continue;
    const t=-u/(v-u),d=-q.tz*(a.x+(b.x-a.x)*t-q.x)+q.tx*(a.z+(b.z-a.z)*t-q.z);if(Math.abs(d)<40)hits.push(d);
  }
  return [-1,1].map(sign=>hits.filter(d=>d*sign>0).sort((a,b)=>Math.abs(a)-Math.abs(b))[0]??sign*8);
}
export const landingEdges=(s,width=14.6)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
export function roadEdges(s,joins,sections){
  const t=landingBlend(s);if(!t)return ROAD_EDGES;
  const end=s<L/2?0:1,fallback=landingEdges(s),measured=base.roadEdges(s,joins,sections);
  return ROAD_EDGES.map((edge,side)=>edge.map((d,i)=>d+((joins?.[end]?.[side]||sections?.some(v=>v.edges?.[side])?measured[side]:fallback[side])[i]-d)*t));
}
const sideFor=(d,edges)=>d<(edges[0][1]+edges[1][0])/2?0:1;
function remap(d,from,to,shoulder=1){
  if(d<from[0])return to[0]+(d-from[0])*shoulder;
  if(d>from[1])return to[1]+(d-from[1])*shoulder;
  return to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);
}
export const authoredLateral=(s,d)=>{
  const t=landingBlend(s),edges=roadEdges(s);
  // The median barrier narrows to a point, never into a broad concrete apron
  // between the two separately connected provider ribbons.
  if(Math.abs(d)<.29)return d*(1-t)+(edges[0][1]+edges[1][0])/2*t;
  const side=sideFor(d,ROAD_EDGES);return remap(d,ROAD_EDGES[side],edges[side],1-t);
};
function fittedLateral(s,d,joins,sections){
  if(!landingBlend(s))return d;
  const from=roadEdges(s),to=roadEdges(s,joins,sections),side=sideFor(d,from);
  if(d>from[0][1]&&d<from[1][0])return remap(d,[from[0][1],from[1][0]],[to[0][1],to[1][0]]);
  return remap(d,from[side],to[side]);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,ends,joins,sections)=>{
  const a=base.bridgeLocal(lng,lat),q=base.projectBridge(a.x,a.z);
  const edges=roadEdges(q.s,joins,sections);
  if(q.lateral>edges[0][1]+.1&&q.lateral<edges[1][0]-.1)return null;
  if(q.beyond||!edges.some(([l,r])=>q.lateral>=l-.6&&q.lateral<=r+.6))return null;
  if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
  return deckHeight(q.s,ends);
};
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,roadEdges,fittedLateral,meshStep:4,
  knots:[[0,'start'],[LANDING,'start'],[MID-CORE,H],[MID,62],[MID+CORE,H],[L-LANDING,'end'],[L,'end']]};
