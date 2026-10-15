import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { WAYS } from './high-level-bridge-edmonton-alignment.js';
export const ROAD_H = 41.4528, RAIL_RISE = 6.096, WIDTH = 11.8872, MAIN_SPAN = 87.7824;
export const WORLD_ROAD = 657.5; // Estimate: river DEM about 616 m + published rail-base height minus 20 ft.
const way = id => WAYS.find(w => w.id === id).line;
const join = ids => ids.flatMap((id,i) => way(id).slice(i ? 1 : 0));
const line = join([23237247,27259193,697626837,500327669,22916464,22915822,1095758755]);
const base = createBridgeProfile({...SPEC, palette: PALETTES.light, centerline: line, width: 18,
  roadEdges: [[-3.35,3.35]], clipStandardEnds: true, lateralBankFit: {terrainClamp:true,clearanceM:0},
  profile: ({length}) => [[0,'start'],[length,'end']],
});
export const L = base.BRIDGE_LENGTH;
export const STRUCTURE_START = base.stationAt([-113.5098325,53.5328603]);
export const STRUCTURE_END = base.stationAt([-113.5130259,53.52608]);
export const RIVER_START = base.stationAt([-113.51056,53.53098]);
export const RIVER_END = RIVER_START + 3*MAIN_SPAN;
export const MERGE = base.stationAt(way(22915822)[0]);
export const PIERS = Array.from({length:4},(_,i)=>RIVER_START+i*MAIN_SPAN);
export const CURVE = 18, TAPER = 55;
const clamp=t=>Math.max(0,Math.min(1,t));
export const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
function rise(u,len,a,b){u=clamp(u/len)*len;const g=(b-a)/(len-CURVE);if(u<CURVE)return a+g*u*u/(2*CURVE);if(u>len-CURVE)return b-g*(len-u)**2/(2*CURVE);return a+g*(u-CURVE/2);}
export const realSurface=a=>Object.assign([...a],{real:true});
function deckHeight(s,a=[0,0]){
 s=Math.max(0,Math.min(L,s));
 if(a.real){
  // The bridge is level in the real valley. Only the roads beyond the abutments blend to the banks.
  if(s<STRUCTURE_START)return rise(s,STRUCTURE_START,a[0],WORLD_ROAD);
  if(s>STRUCTURE_END)return rise(L-s,L-STRUCTURE_END,a[1],WORLD_ROAD);
  return WORLD_ROAD;
 }
 if(s<RIVER_START)return rise(s,RIVER_START,a[0],ROAD_H);
 if(s>RIVER_END)return rise(L-s,L-RIVER_END,a[1],ROAD_H);
 return ROAD_H;
}
export const landingBlend=s=>1-smooth(Math.min(s,L-s)/TAPER);
const authoredEdges=s=>{const k=landingBlend(s),w=s<L/2?2:3.3;return [[-3.35+(3.35-w)*k,3.35+(w-3.35)*k]];};
function roadEdges(s,joins,sections){
 const k=landingBlend(s);if(!k)return [[-3.35,3.35]];
 const fallback=authoredEdges(s)[0],measured=base.roadEdges(s,joins,sections)[0];
 return [(joins?.[s<L/2?0:1]?.[0]||sections?.length)?fallback.map((d,i)=>d+(measured[i]-d)*k):fallback];
}
const mapD=(d,a,b)=>d<a[0]?b[0]+d-a[0]:d>a[1]?b[1]+d-a[1]:b[0]+(d-a[0])/(a[1]-a[0])*(b[1]-b[0]);
export const authoredLateral=(s,d)=>mapD(d,[-3.35,3.35],authoredEdges(s)[0])+(Math.abs(d)>3.35?Math.sign(d)*(Math.abs(d)-3.35)*(-landingBlend(s)):0);
const fittedLateral=(s,d,j,sections)=>landingBlend(s)?mapD(d,authoredEdges(s)[0],roadEdges(s,j,sections)[0]):d;
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
function roadHeight(p,lng,lat,heading,a,j,sections){
 const v=p.bridgeLocal(lng,lat),q=p.projectBridge(v.x,v.z),edges=p.roadEdges(q.s,j,sections);
 if(q.beyond||!edges.some(([l,r])=>q.lateral>=l-.6&&q.lateral<=r+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return p.deckHeight(q.s,a);
}
export const PROFILE={...base,key:'main',deckHeight,bridgePoint,roadEdges,fittedLateral,meshStep:2,
 knots:[[0,'start'],[RIVER_START,ROAD_H],[RIVER_END,ROAD_H],[L,'end']]};
PROFILE.bridgeRoadHeight=(...args)=>roadHeight(PROFILE,...args);
// Eastern one-lane feed: keep its own mapped station axis and independent road mask.
// It ends where its centreline reaches the east pavement edge; the main road owns the junction.
const branchFull=join([471835876,471835870,219624714,510090943,500327672]);
const cut=(()=>{let a=branchFull.at(-2),b=branchFull.at(-1);for(let k=branchFull.length-1;k>0;k--){
 const A=base.bridgeLocal(...branchFull[k-1]),B=base.bridgeLocal(...branchFull[k]);
 if(base.projectBridge(A.x,A.z).lateral< -3.35 && base.projectBridge(B.x,B.z).lateral>=-3.35){a=branchFull[k-1];b=branchFull[k];let lo=0,hi=1;for(let n=0;n<35;n++){const t=(lo+hi)/2,v=base.bridgeLocal(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);if(base.projectBridge(v.x,v.z).lateral< -3.35)lo=t;else hi=t;}return {k,point:a.map((v,i)=>v+(b[i]-v)*(lo+hi)/2)};}}
 return {k:branchFull.length-1,point:branchFull.at(-1)};})();
const branchLine=[...branchFull.slice(0,cut.k),cut.point];
const forkBase=createBridgeProfile({...SPEC,id:SPEC.id, palette:PALETTES.light,width:9,centerline:branchLine,
 roadEdges:[[-2,2]],clipStandardEnds:true,lateralBankFit:{terrainClamp:true,clearanceM:0},profile:({length})=>[[0,'start'],[length,'end']]});
export const FORK_L=forkBase.BRIDGE_LENGTH;
export const FORK_JOIN=base.stationAt(cut.point);
const forkHeight=(s,a=[0,deckHeight(FORK_JOIN)])=>rise(s,FORK_L,a[0],a[1]);
export const FORK={...forkBase,key:'fork',deckHeight:forkHeight,
 bridgePoint:(s,d=0,y=null)=>forkBase.bridgePoint(s,d,y??forkHeight(s)),fittedLateral:(_s,d)=>d,
 meshStep:2,knots:[[0,'start'],[FORK_L,'end']]};
FORK.bridgeRoadHeight=(...args)=>roadHeight(FORK,...args);
export const PROFILES=[PROFILE,FORK];
export const FLAT_GRADES=[ROAD_H/(RIVER_START-CURVE),ROAD_H/(L-RIVER_END-CURVE),deckHeight(FORK_JOIN)/(FORK_L-CURVE)];
