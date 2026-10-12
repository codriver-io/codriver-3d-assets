import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { ALIGNMENT_DATA as data } from './ponte-25-de-abril-alignment.js';
export const MAIN_SPAN=1012.88, SIDE_SPAN=482.42, DECK_H=80, DECK_HALF=12.25, RAMP_SOUTH=800;
const metric=createBridgeProfile({origin:SPEC.origin,width:24.5,roadEdges:[],centerline:data.northbound,profile:({length})=>[[0,0],[length,0]]});
const local=line=>line.map(ll=>metric.bridgeLocal(...ll));
const nb=local(data.northbound), sb=local(data.southbound.slice().reverse());
const nearest=(line,q)=>{
 let best,dist=Infinity;
 for(let i=1;i<line.length;i++){
  const a=line[i-1],b=line[i],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((q.x-a.x)*dx+(q.z-a.z)*dz)/(dx*dx+dz*dz)));
  const p={x:a.x+dx*t,z:a.z+dz*t},d=Math.hypot(p.x-q.x,p.z-q.z);
  if(d<dist){dist=d;best=p;}
 }return best;
};
const avg=nb.map(q=>{const r=nearest(sb,q);return metric.bridgeLngLat((q.x+r.x)/2,(q.z+r.z)/2);});
const raw=createBridgeProfile({origin:SPEC.origin,width:70,roadEdges:[],centerline:avg,profile:({length})=>[[0,0],[length,0]]});
const centre=id=>data.supports.find(v=>v.id===id).center;
const mappedTowers=[551530666,696047687].map(id=>raw.stationAt(centre(id)));
const middle=(mappedTowers[0]+mappedTowers[1])/2, start=middle-MAIN_SPAN/2-SIDE_SPAN-RAMP_SOUTH;
const end=raw.BRIDGE_LENGTH;
const cut=s=>{const q=raw.bridgePoint(s);return raw.bridgeLngLat(q.x,q.z);};
const centerline=[cut(start),...raw.ALIGNMENT.filter(v=>v.s>start+.1&&v.s<end-.1).map(q=>raw.bridgeLngLat(q.x,q.z)),cut(end)];
export const TOWER_S=[middle-MAIN_SPAN/2-start,middle+MAIN_SPAN/2-start];
export const SIDE_S=[TOWER_S[0]-SIDE_SPAN,TOWER_S[1]+SIDE_SPAN];
// Approximately 2,277.64 m anchor-to-anchor envelope including terminal spans.
export const NORTH_ANCHORS=[98960342,98960341].map(id=>{const q=raw.bridgeLocal(...centre(id)),r=raw.projectBridge(q.x,q.z);return {s:r.s-start,d:r.lateral};});
const anchorMid=(NORTH_ANCHORS[0].s+NORTH_ANCHORS[1].s)/2;
export const ANCHOR_S=[anchorMid-2277.64,anchorMid];
const edgeTable=nb.map(q=>{
 const s=raw.projectBridge(q.x,q.z).s-start,fr=raw.bridgePoint(s+start),d=-fr.tz*(q.x-fr.x)+fr.tx*(q.z-fr.z),gap=Math.abs(d);
 const northHalf=s<SIDE_S[0]-200?17.5:5.55;
 return {s,edges:[[-gap-5.55,Math.min(-.25,-gap+5.55)],[Math.max(.25,gap-northHalf),gap+northHalf]]};
}).sort((a,b)=>a.s-b.s);
export function roadEdgesAt(s){
 if(s>=SIDE_S[0]-70&&s<=SIDE_S[1]+70)return [[-11.35,-.25],[.25,11.35]];
 let i=1;while(i<edgeTable.length-1&&edgeTable[i].s<s)i++;
 const a=edgeTable[i-1],b=edgeTable[i],t=Math.max(0,Math.min(1,(s-a.s)/(b.s-a.s||1)));
 return a.edges.map((v,j)=>v.map((x,k)=>x+(b.edges[j][k]-x)*t));
}
const linearRamp=(a,c,reverse=false)=>{
 const n=Math.ceil((c-a)/40),out=[];
 for(let i=0;i<=n;i++){const t=i/n;out.push([a+(c-a)*t,DECK_H*(reverse?1-t:t)]);}return out;
};
export const PROFILE=createBridgeProfile({
 ...SPEC,modelDir:'bridges',width:70,palette:PALETTES.light,centerline,buildingFootprints:FOOTPRINTS,
 roadEdges:[[-11.35,-.25],[.25,11.35]],roadEdgesAt,clipStandardEnds:true,
 profile:({length})=>{
  // Dense equal-rise knots make a constant mean grade; smooth interpolation leaves short curves.
  const south=linearRamp(0,SIDE_S[0]),north=linearRamp(SIDE_S[1],length,true);
  south[0][1]='start';north.at(-1)[1]='end';return [...south,...north];
 },
});
// Constant-grade ramps with 40 m end vertical curves. The optional profile object
// methods share this surface with authoring, runtime navigation and the HD overlay.
const curvedRamp=(u,length)=>{
 const curve=40,grade=1/(length-curve);
 if(u<curve)return grade*u*u/(2*curve);
 if(u>length-curve)return 1-grade*(length-u)*(length-u)/(2*curve);
 return grade*(u-curve/2);
};
PROFILE.deckHeight=(s,approaches=[0,0])=>{
 s=Math.max(0,Math.min(PROFILE.BRIDGE_LENGTH,s));
 if(s<SIDE_S[0])return approaches[0]+(DECK_H-approaches[0])*curvedRamp(s,SIDE_S[0]);
 if(s>SIDE_S[1])return approaches[1]+(DECK_H-approaches[1])*curvedRamp(PROFILE.BRIDGE_LENGTH-s,PROFILE.BRIDGE_LENGTH-SIDE_S[1]);
 return DECK_H;
};
const point=PROFILE.bridgePoint,roadHeight=PROFILE.bridgeRoadHeight;
PROFILE.bridgePoint=(s,d=0,y=null)=>point(s,d,y??PROFILE.deckHeight(s));
PROFILE.bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{
 if(roadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;
 const q=PROFILE.bridgeLocal(lng,lat),s=PROFILE.projectBridge(q.x,q.z).s;
 return PROFILE.deckHeight(s,approaches);
};
// A rigid steel deck retains its authored width even if a provider section is a sliver.
PROFILE.fittedLateral=(s,d)=>d;
export const PIERS=data.supports.filter(v=>v.tags['bridge:support']==='pier'&&!['Pilar 3','Pilar 4'].includes(v.tags.name)).map(v=>({s:PROFILE.stationAt(v.center),id:v.id}));
export const MAPPED_TOWERS=mappedTowers.map(s=>s-start);
export default PROFILE;
