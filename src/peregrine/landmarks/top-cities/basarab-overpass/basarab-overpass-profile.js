import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import alignment from './basarab-overpass-alignment.js';
export const DECK_H=14, TOWER_RISE=80, MAIN_SPAN=168, BACK_SPAN=131.5;
const base=createBridgeProfile({...SPEC,width:43.38,palette:PALETTES.light,
  centerline:alignment.centerline,roadEdges:[[-19,-10.3],[10.3,19]],railGap:3.8,
  clipStandardEnds:true,
  profile:({length})=>[[0,'start'],[length,'end']]});
export const T=base.stationAt(SPEC.origin), A=T-BACK_SPAN, C=T+MAIN_SPAN, L=base.BRIDGE_LENGTH;
export const STRUCTURE_END=C+66, LANDING=25, CURVE=25;
const blend=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// Preserve surveyed road axes and source deck width. Narrow Orhideelor approaches
// widen through the compensating spans, then narrow after the tram station.
function structuralHalfWidth(s){const w=s<A-100?12.75:s<T?12.75+(18.94-12.75)*blend((s-A+100)/(T-A+100)):s<C?18.94+2.75*blend((s-T)/(C-T)):21.69-(21.69-12.75)*blend((s-C)/110);return Math.max(w,...mappedEdges(s).flat().map(d=>Math.abs(d)+.8));}
const roads=Object.values(alignment.carriageways).map(line=>line.map(ll=>{const q=base.bridgeLocal(...ll);return base.projectBridge(q.x,q.z);}).sort((a,b)=>a.s-b.s));
function roadCenter(side,s){const line=roads[side];let i=1;while(i<line.length-1&&line[i].s<s)i++;const a=line[i-1],b=line[i],t=Math.max(0,Math.min(1,(s-a.s)/(b.s-a.s||1)));return a.lateral+(b.lateral-a.lateral)*t;}
export function mappedEdges(s){return [-1,1].map((side,i)=>{const d=roadCenter(i,s);return [d-3.7,d+3.7];});}
export const TAPER=40, LANDING_WIDTH=10.2;
export const landingBlend=s=>1-blend(Math.min(s,L-s)/TAPER);
export const landingEdges=(s,width=LANDING_WIDTH)=>[0,1].map(i=>{const d=roadCenter(i,s);return [d-width/2,d+width/2];});
export function roadEdgesAt(s){const t=landingBlend(s),target=landingEdges(s);return mappedEdges(s).map((edge,i)=>edge.map((d,j)=>d+(target[i][j]-d)*t));}
export function halfWidth(s){const t=landingBlend(s);const e=Math.max(...roadEdgesAt(s).flat().map(Math.abs));return Math.max(structuralHalfWidth(s)*(1-t)+e*t,e+.8*(1-t));}
function roadEdges(s,joins,sections){const t=landingBlend(s);if(!t)return roadEdgesAt(s);const measured=fitted.roadEdges(s,joins,sections),end=s<L/2?0:1;
 return roadEdgesAt(s).map((edge,i)=>edge.map((d,j)=>d+((joins?.[end]?.[i]||sections?.some(v=>v.edges?.[i])?measured[i][j]:d)-d)*t));}
function fittedLateral(s,d,joins,sections){if(!landingBlend(s))return d;
 const old=roadEdgesAt(s),next=roadEdges(s,joins,sections),i=d<(old[0][1]+old[1][0])/2?0:1;
 // The central connection stays within the provider separator as the two roads fit.
 if(d>old[0][1]&&d<old[1][0])return next[0][1]+(d-old[0][1])/(old[1][0]-old[0][1])*(next[1][0]-next[0][1]);
 if(d<old[i][0])return d+next[i][0]-old[i][0];if(d>old[i][1])return d+next[i][1]-old[i][1];
 return next[i][0]+(d-old[i][0])/(old[i][1]-old[i][0])*(next[i][1]-next[i][0]);}

function rise(u,length,a,b){const g=(b-a)/(length-CURVE);if(u<CURVE)return a+g*u*u/(2*CURVE);if(u>length-CURVE)return b-g*(length-u)**2/(2*CURVE);return a+g*(u-CURVE/2);}
export function deckHeight(s,approaches=[0,0]){s=Math.max(0,Math.min(L,s));if(s<LANDING)return approaches[0];if(s<A)return rise(s-LANDING,A-LANDING,approaches[0],DECK_H);if(s<STRUCTURE_END)return DECK_H;if(s>L-LANDING)return approaches[1];return rise(L-LANDING-s,L-LANDING-STRUCTURE_END,approaches[1],DECK_H);}
const fitted=createBridgeProfile({...base.CHAMPLAIN,roadEdgesAt,
  groundControls:()=>[{s:0,sampleS:0},{s:A,sampleS:T},{s:STRUCTURE_END,sampleS:T},{s:L,sampleS:L}],
  profile:()=>[[0,'start'],[LANDING,'start'],[A,DECK_H],[STRUCTURE_END,DECK_H],[L-LANDING,'end'],[L,'end']]});
export const PROFILE={...fitted,deckHeight,bridgePoint:(s,d=0,y=null)=>fitted.bridgePoint(s,d,y??deckHeight(s)),
  fittedLateral,roadEdges,meshStep:3,
  bridgeRoadHeight:(lng,lat,heading,approaches,joins,sections)=>(()=>{const v=fitted.bridgeLocal(lng,lat),q=fitted.projectBridge(v.x,v.z);
   if(q.beyond||!roadEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-.6&&q.lateral<=b+.6))return null;
   if(Number.isFinite(heading)&&Math.abs(Math.sin(heading*Math.PI/180)*q.tx-Math.cos(heading*Math.PI/180)*q.tz)<.8)return null;
   return deckHeight(q.s,approaches);})()};
