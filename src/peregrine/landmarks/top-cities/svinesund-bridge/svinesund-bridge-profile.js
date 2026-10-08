import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC,PALETTES } from './config.js';
import { WAYS } from './svinesund-bridge-alignment.js';
export const STRUCTURE=704, RAMP=450, DECK=31.6, WORLD_DECK=59.9, CROWN=63.4, SPAN=247;
export const DECK_START=RAMP, DECK_END=RAMP+STRUCTURE, ARCH_START=DECK_START+337, ARCH_END=ARCH_START+SPAN;
export const LENGTH=STRUCTURE+RAMP*2, MID=(ARCH_START+ARCH_END)/2;
const way=id=>WAYS.find(w=>w.id===id).line;
const join=(...lines)=>lines.flatMap((line,i)=>i?line.slice(1):line);
const west=join([...way(440328544)].reverse(),[...way(440328542)].reverse(),[...way(571453990)].reverse(),[...way(4817722)].reverse(),[...way(4817723)].reverse(),[...way(121203169)].reverse());
const east=join(way(298082971),way(195852542),way(298081597),way(571453991),way(160489664),way(4948289));
const axis=line=>createBridgeProfile({origin:SPEC.origin,width:32,roadEdges:[],centerline:line,profile:({length})=>[[0,0],[length,0]]});
const w=axis(west),e=axis(east),anchor=[(11.2521633+11.2524458)/2,(59.0902608+59.0902436)/2];
const ws=w.stationAt(anchor),es=e.stationAt(anchor);
// Midpoint of two independently mapped carriageways, sampled along their physical lengths.
const centerline=[];
for(let s=-RAMP;s<=STRUCTURE+RAMP;s+=25){const a=w.bridgePoint(ws+s),b=e.bridgePoint(es+s);centerline.push(w.bridgeLngLat((a.x+b.x)/2,(a.z+b.z)/2));}
{const a=w.bridgePoint(ws+STRUCTURE+RAMP),b=e.bridgePoint(es+STRUCTURE+RAMP);centerline.push(w.bridgeLngLat((a.x+b.x)/2,(a.z+b.z)/2));}
const q=axis(centerline);
// Preserve sourced metric length without rescaling geographic coordinates; crop at exactly LENGTH.
const line=[...q.ALIGNMENT.filter(p=>p.s<LENGTH).map(p=>q.bridgeLngLat(p.x,p.z))];
const last=q.bridgePoint(LENGTH),extra=Math.max(0,LENGTH-q.BRIDGE_LENGTH);line.push(q.bridgeLngLat(last.x+last.tx*extra,last.z+last.tz*extra));
const base=createBridgeProfile({...SPEC,palette:PALETTES.light,width:36,railGap:3,roadEdges:[[-13.25,-3.75],[3.75,13.25]],centerline:line,clipStandardEnds:true,profile:()=>[[0,'start'],[DECK_START,DECK],[DECK_END,DECK],[LENGTH,'end']]});
export const realSurface=a=>Object.assign([...a],{real:true});
// Constant grade with 40 m end easements: derivative continuous and <8% in flat mode.
function ramp(t){const k=40/RAMP;if(t<k)return t*t/(2*k*(1-k));if(t>1-k)return 1-(1-t)**2/(2*k*(1-k));return (t-k/2)/(1-k);}
function deckHeight(s,a=[0,0]){s=Math.max(0,Math.min(LENGTH,s));const d=a.real?WORLD_DECK:DECK;if(s<DECK_START)return a[0]+(d-a[0])*ramp(s/RAMP);if(s>DECK_END)return d+(a[1]-d)*ramp((s-DECK_END)/RAMP);return d;}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
function bridgeRoadHeight(lng,lat,heading,a,joins,sections){const p=base.bridgeLocal(lng,lat),q=base.projectBridge(p.x,p.z);if(q.beyond||!base.roadEdges(q.s,joins,sections).some(([l,r])=>q.lateral>=l-.6&&q.lateral<=r+.6))return null;if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}return deckHeight(q.s,a);}
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,meshStep:5};
const rise=CROWN-1.35-2.1,radius=((SPAN/2)**2+rise**2)/(2*rise);
export function archSection(t){const taper=Math.abs(t*2-1);return {s:ARCH_START+SPAN*t,y:2.1+Math.sqrt(radius**2-(SPAN*(t-.5))**2)-(radius-rise),width:4+2.2*taper,depth:2.7+1.5*taper};}
export const HANGERS=Array.from({length:6},(_,i)=>MID-63.75+i*25.5);
export const PIERS=[68,143,218,293,632].map(s=>DECK_START+s);
