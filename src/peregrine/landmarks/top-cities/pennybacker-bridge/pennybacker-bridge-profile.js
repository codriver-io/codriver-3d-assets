import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { MAPPED } from './pennybacker-bridge-alignment.js';
export const SPAN=182.88, STRUCTURE=350.52, WIDTH=26.5176, DECK=21.336;
export const RAMP=320, ARCH_WIDTH=1.2192, ARCH_DEPTH=3.3528, ARCH_D=[-12.8,12.8];
export const LAKE=492.8*.3048;
export const realSurface=a=>Object.assign([...a],{real:true});
const mean=(a,b)=>a.map((v,i)=>(v+b[i])/2);
const n=MAPPED.find(w=>w.id===177701858).line,s=MAPPED.find(w=>w.id===126746778).line;
export const SOUTH=mean(n[1],s[0]),NORTH=mean(n[0],s[1]);
const axis=createBridgeProfile({origin:SPEC.origin,width:WIDTH,roadEdges:[],centerline:[SOUTH,NORTH],profile:({length})=>[[0,0],[length,0]]});
const ll=station=>{const q=axis.bridgePoint(Math.max(0,Math.min(axis.BRIDGE_LENGTH,station)),0,0),extra=station-Math.max(0,Math.min(axis.BRIDGE_LENGTH,station));return axis.bridgeLngLat(q.x+q.tx*extra,q.z+q.tz*extra);};
// Mid-approach bends follow the mapped roads, not a guessed grid bearing.
const southRoad=MAPPED.find(w=>w.id===436732065).line,northRoad=MAPPED.find(w=>w.id===368648297).line;
const southOffset=mean(southRoad[1],MAPPED.find(w=>w.id===436733825).line[3]);
const northOffset=mean(northRoad[3],MAPPED.find(w=>w.id===150438107).line[1]);
const centerline=[ll(-RAMP),southOffset,SOUTH,NORTH,northOffset,ll(axis.BRIDGE_LENGTH+RAMP)];
const base=createBridgeProfile({...SPEC,palette:PALETTES.light,modelDir:'bridges',width:WIDTH,
 roadEdges:[[-10.6,-.7],[.7,10.6]],railGap:.6,centerline,clipStandardEnds:true,
 stations:{south:SOUTH,north:NORTH},profile:({length,south,north})=>[[0,'start'],[south,DECK],[north,DECK],[length,'end']],
});
export const STRUCTURE_START=base.landmarks.south,STRUCTURE_END=base.landmarks.north;
export const ARCH_END=STRUCTURE_END-30.48,ARCH_START=ARCH_END-SPAN;
export const LENGTH=base.BRIDGE_LENGTH;
export const archY=s=>3+50*4*((s-ARCH_START)/SPAN)*(1-(s-ARCH_START)/SPAN);
function deckHeight(s,a=[0,0]) {return base.deckHeight(s,a.real?[a[0]-LAKE,a[1]-LAKE]:a)+(a.real?LAKE:0);}
function bridgePoint(s,d=0,y=null) {return base.bridgePoint(s,d,y??deckHeight(s));}
function bridgeRoadHeight(lng,lat,heading,a,joins,sections) {
 const p=base.bridgeLocal(lng,lat),q=base.projectBridge(p.x,p.z);
 if(q.beyond||!roadEdges(q.s,joins,sections).some(([l,r])=>q.lateral>=l-.6&&q.lateral<=r+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return deckHeight(q.s,a);
}
// Only the final 50 m of each land ramp fan into the mapped carriageways.
// The river span, arch and bank-fit terrain grid keep their accepted geometry.
export const LANDING=50,LANDING_WIDTH=9;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const landingBlend=s=>1-smooth(Math.min(s,LENGTH-s)/LANDING);
const segments=MAPPED.filter(w=>w.tags.highway==='trunk').flatMap(w=>w.line.slice(1).map((ll,i)=>[base.bridgeLocal(...w.line[i]),base.bridgeLocal(...ll)]));
export function mappedCentres(s){
 const p=base.bridgePoint(s,0,0),hits=[];
 for(const [a,b] of segments){
  const u=(a.x-p.x)*p.tx+(a.z-p.z)*p.tz,v=(b.x-p.x)*p.tx+(b.z-p.z)*p.tz;
  if(u*v>0||Math.abs(v-u)<1e-6)continue;
  const t=-u/(v-u),d=-p.tz*(a.x+(b.x-a.x)*t-p.x)+p.tx*(a.z+(b.z-a.z)*t-p.z);
  hits.push(d);
 }
 return [-1,1].map(side=>hits.filter(d=>d*side>0).sort((a,b)=>Math.abs(a)-Math.abs(b))[0]??side*5.65);
}
export const landingEdges=(s,width=LANDING_WIDTH)=>mappedCentres(s).map(d=>[d-width/2,d+width/2]);
const PAVEMENT=[[-11.15,0],[0,11.15]];
export function pavementEdges(s){
 const t=landingBlend(s),distance=Math.min(s,LENGTH-s),fan=1-smooth(distance/RAMP),centres=mappedCentres(s);
 if(distance>=RAMP)return PAVEMENT;
 return PAVEMENT.map((edge,side)=>{
  const old=(edge[0]+edge[1])/2,centre=old+(centres[side]-old)*fan,half=(edge[1]-edge[0])/2+(LANDING_WIDTH/2-(edge[1]-edge[0])/2)*t;
  return [centre-half,centre+half];
 });
}
export function roadEdges(s,joins,sections){
 const t=landingBlend(s),authored=pavementEdges(s).map(([a,b],side)=>[a+(side?.7:.55)*(1-t),b-(side?.55:.7)*(1-t)]);
 if(!t)return authored;
 const end=s<LENGTH/2?0:1,measured=base.roadEdges(s,joins,sections);
 return authored.map((edge,side)=>edge.map((d,i)=>d+((joins?.[end]?.[side]||sections?.some(v=>v.edges?.[side])?measured[side][i]:d)-d)*t));
}
function remap(d,from,to,margin=1){
 if(d<from[0])return to[0]+(d-from[0])*margin;
 if(d>from[1])return to[1]+(d-from[1])*margin;
 return to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);
}
export function authoredLateral(s,d,side=d<0?0:1){
 return remap(d,PAVEMENT[side],pavementEdges(s)[side],1-landingBlend(s));
}
function fittedLateral(s,d,joins,sections){
 const t=landingBlend(s);if(!t)return d;
 // Each ribbon remains on its side of the median even when roads separate.
 const centres=mappedCentres(s),side=Math.abs(d-centres[0])<Math.abs(d-centres[1])?0:1;
 return remap(d,roadEdges(s)[side],roadEdges(s,joins,sections)[side]);
}
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,fittedLateral,roadEdges,
 halfWidth:27,ownershipMargin:0,bounds:{minX:base.bounds.minX-14,maxX:base.bounds.maxX+14,minZ:base.bounds.minZ-14,maxZ:base.bounds.maxZ+14},meshStep:10};
