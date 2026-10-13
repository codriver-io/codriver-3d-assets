import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {CENTERLINE} from './sixth-street-viaduct-alignment.js';
export const WIDTH=30.48,DECK=16.15,WORLD_DATUM=77,CANT=9*Math.PI/180;
export const realSurface=a=>Object.assign([...a],{real:true});
const base=createBridgeProfile({...SPEC,width:42,palette:PALETTES.light,centerline:CENTERLINE,
 roadEdges:[[-7.6,7.6]],clipStandardEnds:true,
 lateralBankFit:{blendM:130,terrainClamp:true,clearanceM:0},
 profile:({length})=>[[0,'start'],[190,DECK],[length-275,DECK],[length,'end']]});
export const LENGTH=base.BRIDGE_LENGTH;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// Short parabolic vertical curves keep a nearly constant grade between them.
function ramp(u,len,low,high){const c=25,g=(high-low)/(len-c);
 if(u<c)return low+g*u*u/(2*c);
 if(u>len-c)return high-g*(len-u)**2/(2*c);
 return low+g*(u-c/2);
}
export function deckHeight(s,a=[0,0]){
 s=Math.max(0,Math.min(LENGTH,s));
 if(a.real){const west=WORLD_DATUM+DECK,east=WORLD_DATUM+19.2024;
  // 63 ft is the entire west-abutment to east-abutment rise, not an extra
  // rise above the elevated railway deck. The east hill meets the final arches.
  if(s<190)return ramp(s,190,a[0],west);
  if(s>LENGTH-100)return ramp(LENGTH-s,100,a[1],east);
  return west+(east-west)*(s-190)/(LENGTH-290);
 }
 if(s<190)return ramp(s,190,a[0],DECK);
 if(s>LENGTH-275)return ramp(LENGTH-s,275,a[1],DECK);
 return DECK;
}
export const landingScale=s=>(roadwayHalf(s)+.15+(WIDTH/2-7.6-.15)*smooth(Math.min(s,LENGTH-s)/110))/(WIDTH/2);
// Five lanes west and four east before runtime fitting to real HD edges.
// Bike/walk space tapers to the street's kerb: no wide square concrete nose.
export const roadwayHalf=s=>7.6+(s<LENGTH/2?1.15:-.6)*(1-smooth(Math.min(s,LENGTH-s)/95));
export const authoredLateral=(s,d)=>{
 const inner=roadwayHalf(s),outer=WIDTH/2*landingScale(s),x=Math.abs(d);
 return Math.sign(d)*(x<=7.6?x*inner/7.6:inner+(x-7.6)*(outer-inner)/(WIDTH/2-7.6));
};
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const valid=edges=>edges?.[0]&&edges[0][1]-edges[0][0]>=9&&edges[0][1]-edges[0][0]<=22&&Math.abs((edges[0][0]+edges[0][1])/2)<2.5;
const sectionCache=new WeakMap();
const roadEdges=(s,joins,sections)=>{
 const k=1-smooth(Math.min(s,LENGTH-s)/110),fallback=[[-roadwayHalf(s),roadwayHalf(s)]];
 if(!k||!joins&&!sections)return fallback;
 // A junction fan can extend 30 m sideways; it is not the street's kerb.
 // Learn complete, centred carriageway sections, retaining actual turn lanes.
 if(sections&&!sectionCache.has(sections))sectionCache.set(sections,sections.filter(v=>valid(v.edges)));
 const measured=base.roadEdges(s,joins?.map(v=>valid(v)?v:null),sections&&sectionCache.get(sections));
 return fallback.map((r,i)=>r.map((v,j)=>v+(measured[i][j]-v)*k));
};
const fittedLateral=(s,d,joins,sections)=>{
 if(Math.abs(d)>WIDTH/2+2)return d; // detached access paths keep their mapped alignment
 const t=1-smooth(Math.min(s,LENGTH-s)/110);if(!t)return d;
 const [a,b]=roadEdges(s)[0],[c,e]=roadEdges(s,joins,sections)[0];
 return d<a?d+c-a:d>b?d+e-b:c+(d-a)*(e-c)/(b-a);
};
function bridgeRoadHeight(lng,lat,heading,a,joins,sections){
 const p=base.bridgeLocal(lng,lat),q=base.projectBridge(p.x,p.z);
 if(q.beyond||!roadEdges(q.s,joins,sections).some(([l,r])=>q.lateral>=l-.6&&q.lateral<=r+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return deckHeight(q.s,a);
}
export const PROFILE={...base,deckHeight,bridgePoint,roadEdges,fittedLateral,bridgeRoadHeight,meshStep:5,
 knots:[[0,'start'],[190,DECK],[LENGTH-275,DECK],[LENGTH,'end']]};
// Nine inter-arch Y-bent stations (two supports each): 18 published Y-bents.
// Taller railway arches frame the smaller central LA River arch.
export const ARCHES=Array.from({length:10},(_,i)=>({index:i,
 center:211+(LENGTH-100-211)*i/9,
 span:i===3||i===5?76.2:i===9?68.58:60.96,
 rise:i===3||i===5?18.288:i===9?12.192:9.144,
}));
export const ARCH_D=12.7;
export const archPoint=(arch,t,side)=>{
 const s=arch.center+arch.span*(t-.5),rise=(arch.rise-.6)*4*t*(1-t);
 return [s,side*(ARCH_D+rise*Math.tan(CANT)),deckHeight(s)+rise];
};
