import alignment from './ironworkers-memorial-bridge-alignment.js';
import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';

// Station north -> south, lateral positive west. Both carriageways share one rigid steel deck.
export const DECK_HALF = 13.9;
export const TRUSS_D = 10.4;
export const ROAD_EDGES = [[-11.05, -0.55], [0.55, 11.05]];
const base = createBridgeProfile({
  ...SPEC, width: 27.8, roadEdges: ROAD_EDGES, centerline: alignment.centerline,
  palette: PALETTES.light, ownershipMargin: 0.7,
  profile: ({length}) => [[0, 'start'], [length, 'end']],
});
export const STRUCTURE_END = base.stationAt(alignment.bridgeEnds[1]);
// Anchor pier14 is the mapped north truss transition at 49.2974696.
export const ANCHOR_N = base.stationAt([-123.0263244, 49.2974696]);
export const MAIN_N = ANCHOR_N + 142;
export const MAIN_S = MAIN_N + 335;
export const ANCHOR_S = MAIN_S + 142;
export const TIP_N = MAIN_N + 116;
export const TIP_S = MAIN_S - 116;
export const MID = (MAIN_N + MAIN_S) / 2;
export const TRUSS_START = ANCHOR_N - 4 * 85.9;
export const PIER_S = [TRUSS_START, TRUSS_START+85.9, TRUSS_START+171.8, TRUSS_START+257.7, ANCHOR_N, MAIN_N, MAIN_S, ANCHOR_S];
export const AUTHORED_ENDS = [5, 43];
export const realSurface = (pair) => Object.assign([...pair], { real: true });
const cache = new Map();
/** Straight road grades joined by 16 m parabolic vertical curves, tangent to endpoints. */
function vertical(pair, real) {
  const key = `${real}:${pair[0]}:${pair[1]}`;
  if (cache.has(key)) return cache.get(key);
  const P = real ? [[8,pair[0]], [TRUSS_START,23], [ANCHOR_N,40], [MAIN_N,52], [MID,56.5], [MAIN_S,52], [ANCHOR_S,39], [base.BRIDGE_LENGTH-8,pair[1]]]
    : [[8,pair[0]], [ANCHOR_N,40], [MAIN_N,52], [MID,56.5], [MAIN_S,38], [base.BRIDGE_LENGTH-8,pair[1]]];
  const G=P.slice(1).map((q,i)=>(q[1]-P[i][1])/(q[0]-P[i][0]));
  const v={P,gin:[0,...G],gout:[...G,0]}; if(cache.size>32)cache.clear();cache.set(key,v);return v;
}
export function deckHeight(s, pair) {
  s=Math.max(0,Math.min(base.BRIDGE_LENGTH,s));
  const authored=pair===undefined, real=authored||!!pair.real;
  const {P,gin,gout}=vertical(authored?AUTHORED_ENDS:pair,real), half=8;
  for(let i=0;i<P.length;i++){
    const [x,y]=P[i];if(s>=x-half&&s<=x+half){const t=s-x+half;return y-gin[i]*half+gin[i]*t+(gout[i]-gin[i])*t*t/32;}
  }
  let i=0;while(i<P.length-2&&P[i+1][0]<s)i++;
  return P[i][1]+gout[i]*(s-P[i][0]);
}
export const grades = (pair=[0,0],real=false) => vertical(pair,real).gout.slice(0,-1);
export const bridgePoint = (s,d=0,y=null) => base.bridgePoint(s,d,y??deckHeight(s));
// Only the low concrete landing zones narrow; all truss panels remain rigid.
export const TAPER = 150, LANDING_WIDTH = 6.2;
export function landingBlend(s) {
  const t=Math.max(0,Math.min(1,Math.min(s,base.BRIDGE_LENGTH-s)/TAPER));
  return 1-t*t*(3-2*t);
}
const mapped=alignment.carriageways.map((line,i)=>[...line,...alignment.approaches[i]].map(ll=>{
  const q=base.bridgeLocal(...ll);return base.projectBridge(q.x,q.z);
}).sort((a,b)=>a.s-b.s));
export function mappedCentres(s) {
  // carriageways[0] is west (positive lateral), carriageways[1] east.
  return [mapped[1],mapped[0]].map(line=>{
    let i=1;while(i<line.length-1&&line[i].s<s)i++;
    const a=line[i-1],b=line[i],t=Math.max(0,Math.min(1,(s-a.s)/Math.max(.001,b.s-a.s)));
    return a.lateral+(b.lateral-a.lateral)*t;
  });
}
export const landingEdges=(s,width=LANDING_WIDTH)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
export function roadEdges(s,joins,sections) {
  const t=landingBlend(s);if(!t)return ROAD_EDGES;
  const end=s<base.BRIDGE_LENGTH/2?0:1,fallback=landingEdges(s),measured=base.roadEdges(s,joins,sections);
  return ROAD_EDGES.map((edge,side)=>{
    const target=joins?.[end]?.[side]||sections?.some(v=>v.edges?.[side])?measured[side]:fallback[side];
    return edge.map((d,i)=>d+(target[i]-d)*t);
  });
}
function remap(d,from,to,margin=1) {
  if(d<from[0])return to[0]+(d-from[0])*margin;
  if(d>from[1])return to[1]+(d-from[1])*margin;
  return to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);
}
export const authoredLateral=(s,d)=>remap(d,ROAD_EDGES[d<0?0:1],roadEdges(s)[d<0?0:1],Math.max(.02,1-landingBlend(s)));
export function fittedLateral(s,d,joins,sections) {
  if(!landingBlend(s))return d;
  const side=d<0?0:1;return remap(d,roadEdges(s)[side],roadEdges(s,joins,sections)[side]);
}
function bridgeRoadHeight(lng,lat,heading,pair=[0,0],joins,sections){
  const q0=base.bridgeLocal(lng,lat),q=base.projectBridge(q0.x,q0.z);
  const end=base.bridgePoint(q.s),over=(q0.x-end.x)*q.tx+(q0.z-end.z)*q.tz;
  if((q.beyond&&Math.abs(over)>1) || !roadEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-.6&&q.lateral<=b+.6))return null;
  if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
  return deckHeight(q.s,pair);
}
// Reject the neighbouring railway and branch ramps once they separate from the owned deck.
function ownsPoint(x,z){const q=base.projectBridge(x,z);return !q.beyond&&roadEdges(q.s).some(([a,b])=>q.lateral>=a-3.6*(1-landingBlend(q.s))-.7&&q.lateral<=b+3.6*(1-landingBlend(q.s))+.7);}
export const PROFILE = {...base, deckHeight, bridgePoint, roadEdges, fittedLateral, bridgeRoadHeight, ownsPoint,
  knots:[[0,'start'],[TRUSS_START,23],[ANCHOR_N,40],[MAIN_N,52],[MID,56.5],[MAIN_S,52],[ANCHOR_S,39],[base.BRIDGE_LENGTH,'end']]};
