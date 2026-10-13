import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { MAPPED, APPROACHES, WEST_ABUTMENT, EAST_ABUTMENT, WEST_PYLON } from './oresund-bridge-alignment.js';

export const WIDTH=23.5,MAIN_SPAN=490,TOWER_H=204,DECK_H=66.5,TRUSS_DEPTH=9.5;
export const ROAD_EDGES=[[-10.35,-.7],[.7,10.35]],LANDING=25,CURVE=100,TAPER=130;
const westEast=ids=>ids.flatMap(id=>MAPPED[id]||APPROACHES[id]).sort((a,b)=>a[0]-b[0]);
const lines=[westEast([912575194,23283662,304383859,370255938,370255940,148500436]),westEast([912575195,304383858,370255937,370255939,148500437,8123176])];
function latitude(line,lng){let i=1;while(i<line.length-1&&line[i][0]<lng)i++;const a=line[i-1],b=line[i],t=(lng-a[0])/(b[0]-a[0]);return a[1]+t*(b[1]-a[1]);}
const min=WEST_ABUTMENT[0]-.0032,max=EAST_ABUTMENT[0]+.0035;
const lons=[...new Set([min,max,...lines.flat().map(p=>p[0]).filter(x=>x>min&&x<max)])].sort((a,b)=>a-b);
const dense=lons.map(x=>[x,(latitude(lines[0],x)+latitude(lines[1],x))/2]);
// Douglas–Peucker keeps the midpoint within 0.4 m of mapped pavement,
// while removing redundant paired-carriageway vertices on straight spans.
function simplify(line){
  const a=line[0],b=line.at(-1),k=Math.cos(SPEC.origin[1]*Math.PI/180),dx=(b[0]-a[0])*k,dy=b[1]-a[1];
  let max=0,at=0;
  for(let i=1;i<line.length-1;i++){
    const x=(line[i][0]-a[0])*k,y=line[i][1]-a[1],t=Math.max(0,Math.min(1,(x*dx+y*dy)/(dx*dx+dy*dy)));
    const d=Math.hypot(x-t*dx,y-t*dy)*111320;if(d>max){max=d;at=i;}
  }
  return max>.4?[...simplify(line.slice(0,at+1)).slice(0,-1),...simplify(line.slice(at))]:[a,b];
}
export const CENTERLINE=simplify(dense);
const base=createBridgeProfile({...SPEC,width:WIDTH,centerline:CENTERLINE,palette:PALETTES.light,
  roadEdges:ROAD_EDGES,railGap:.7,clipStandardEnds:true,
  profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH,A=base.stationAt(WEST_ABUTMENT),B=base.stationAt(EAST_ABUTMENT);
export const WEST_TOWER=base.stationAt(WEST_PYLON),EAST_TOWER=WEST_TOWER+MAIN_SPAN;
export const HIGH_START=WEST_TOWER-301,HIGH_END=EAST_TOWER+301;
const smooth=t=>t*t*(3-2*t);
export const landingBlend=s=>1-smooth(Math.min(1,Math.max(0,Math.min(s,L-s))/TAPER));
// Grade landings taper to two narrower carriageways. Elevated steel stays rigid.
export function authoredLateral(s,d){
  if(d===0)return 0;
  const t=landingBlend(s),side=d<0?0:1,[a,b]=ROAD_EDGES[side];
  const outer=side===0?a:b,inner=side===0?b:a,target=inner+Math.sign(outer)*8.2;
  const scale=(Math.abs(target)-Math.abs(inner))/(Math.abs(outer)-Math.abs(inner));
  return Math.sign(d)*(.7+(Math.abs(d)-.7)*(1-t+t*scale));
}
const authoredEdges=s=>ROAD_EDGES.map(e=>e.map(d=>authoredLateral(s,d)));
function rise(u,len,from,to){
  const c=Math.min(CURVE,len/3),g=(to-from)/(len-c);
  if(u<c)return from+g*u*u/(2*c);
  if(u>len-c)return to-g*(len-u)**2/(2*c);
  return from+g*(u-c/2);
}
export function deckHeight(s,ends=[0,0]){
  s=Math.max(0,Math.min(L,s));
  if(s<LANDING)return ends[0];
  if(s<A)return rise(s-LANDING,A-LANDING,ends[0],10);
  if(s<HIGH_START)return rise(s-A,HIGH_START-A,10,DECK_H);
  if(s<=HIGH_END)return DECK_H;
  if(s>L-LANDING)return ends[1];
  if(s>B)return rise(L-LANDING-s,L-LANDING-B,ends[1],10);
  return rise(B-s,B-HIGH_END,10,DECK_H);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const fittedEdges=(s,joins,sections)=>{
  const t=landingBlend(s);if(!t)return ROAD_EDGES;
  const measured=base.roadEdges(s,joins,sections),end=s<L/2?0:1;
  return authoredEdges(s).map((edge,side)=>edge.map((v,k)=>v+((joins?.[end]?.[side]?.[k]??(sections?.length?measured[side][k]:v))-v)*t));
};
const fittedLateral=(s,d,joins,sections)=>{
  if(!landingBlend(s)||Math.abs(d)<.7)return d;
  const side=d<0?0:1,old=authoredEdges(s)[side],next=fittedEdges(s,joins,sections)[side];
  if(d<old[0])return d+next[0]-old[0];
  if(d>old[1])return d+next[1]-old[1];
  return next[0]+(d-old[0])/(old[1]-old[0])*(next[1]-next[0]);
};
const bridgeRoadHeight=(lng,lat,heading,ends,joins,sections)=>{
  const local=base.bridgeLocal(lng,lat),q=base.projectBridge(local.x,local.z);
  if(q.beyond||!fittedEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-.4&&q.lateral<=b+.4))return null;
  if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
  return deckHeight(q.s,ends);
};
export const PROFILE={...base,bridgePoint,deckHeight,bridgeRoadHeight,roadEdges:fittedEdges,fittedLateral,
  knots:[[0,'start'],[LANDING,'start'],[A,10],[HIGH_START,DECK_H],[HIGH_END,DECK_H],[B,10],[L-LANDING,'end'],[L,'end']],meshStep:8};
export const WEST_GRADE=Math.max(10/(A-LANDING-Math.min(CURVE,(A-LANDING)/3)),56.5/(HIGH_START-A-CURVE));
export const EAST_GRADE=Math.max(10/(L-LANDING-B-Math.min(CURVE,(L-LANDING-B)/3)),56.5/(B-HIGH_END-CURVE));
