import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC,PALETTES } from './config.js';
import { WAYS } from './walterdale-bridge-alignment.js';
export const DECK=13,CROWN=56,SPAN=206,DECK_LENGTH=230,RAMP=180;
export const DECK_START=RAMP,DECK_END=RAMP+DECK_LENGTH,ARCH_START=DECK_START+12,ARCH_END=ARCH_START+SPAN;
export const LENGTH=DECK_LENGTH+2*RAMP,WORLD_DECK=625;
const way=id=>WAYS.find(w=>w.id===id).line;
const whole=[...way(8515751),...way(931254808).slice(1),...way(1516540140).slice(1),...way(175326660).slice(1),...way(471835847).slice(1),...way(693128386).slice(1),...way(471835844).slice(1),...way(697598850).slice(1)];
const axis=createBridgeProfile({origin:SPEC.origin,width:90,roadEdges:[],centerline:whole,profile:({length})=>[[0,0],[length,0]]});
const middle=axis.stationAt(SPEC.origin),lo=middle-LENGTH/2,hi=middle+LENGTH/2;
const ll=s=>{const q=axis.bridgePoint(s);return axis.bridgeLngLat(q.x,q.z);};
const centerline=[ll(lo),...axis.ALIGNMENT.filter(v=>v.s>lo&&v.s<hi).map(v=>axis.bridgeLngLat(v.x,v.z)),ll(hi)];
const base=createBridgeProfile({...SPEC,palette:PALETTES.light,width:90,roadEdges:[[-7.1,8.9]],centerline,clipStandardEnds:true,profile:()=>[[0,'start'],[DECK_START,DECK],[DECK_END,DECK],[LENGTH,'end']]});
export const realSurface=a=>Object.assign([...a],{real:true});
function deckHeight(s,a=[0,0]){const datum=a.real?WORLD_DECK-DECK:0;return base.deckHeight(s,a.real?[a[0]-datum,a[1]-datum]:a)+datum;}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
function bridgeRoadHeight(lng,lat,heading,a,joins,sections){
 const l=base.bridgeLocal(lng,lat),q=base.projectBridge(l.x,l.z);
 if(q.beyond||!base.roadEdges(q.s,joins,sections).some(([l,r])=>q.lateral>=l-.6&&q.lateral<=r+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return deckHeight(q.s,a);
}
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight};
// Independent mapped eastern path, projected into the SAME station/lateral frame.
const path=way(451293733).map(ll=>{const p=base.bridgeLocal(...ll);return base.projectBridge(p.x,p.z);}).sort((a,b)=>a.s-b.s);
export function pathD(s){let i=1;while(i<path.length-1&&path[i].s<s)i++;const a=path[i-1],b=path[i],t=Math.max(0,Math.min(1,(s-a.s)/(b.s-a.s)));return a.lateral+(b.lateral-a.lateral)*t;}
export const pathWidth=s=>4.2+4.2*(Math.abs(s-(DECK_START+115))/115)**2;
export const archPoint=(t,sign)=>[ARCH_START+SPAN*t,sign*(13.5-5.7*4*t*(1-t)),.8+53.95*4*t*(1-t)];
