import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {MAPPED} from './colorado-street-bridge-alignment.js';
export const WIDTH=11.5824,HALF=WIDTH/2,ROAD_HALF=4.2672,DECK=45.2628,LENGTH=447.294;
const raw=createBridgeProfile({...SPEC,width:WIDTH,centerline:MAPPED.centerline,roadEdges:[[-ROAD_HALF,0],[0,ROAD_HALF]],profile:({length})=>[[0,0],[length,0]]});
export const L=raw.BRIDGE_LENGTH,FORK=raw.stationAt(MAPPED.road.at(-1));
// Road way includes 44 m of bank/abutment pavement beyond the structural length.
export const START=raw.stationAt(MAPPED.road[0])+22,END=START+LENGTH;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// Authoring clearance remains available to the reusable structure. Runtime road
// datum is live approach grade in both modes; the ravine exists only in world.
export const LANDING=12;
export const authorDeck=()=>DECK;
export const MAX_GRADE=0;
const projected=line=>line.map(ll=>{const v=raw.bridgeLocal(...ll),q=raw.projectBridge(v.x,v.z);return [q.s,q.lateral];}).sort((a,b)=>a[0]-b[0]);
const branches=[projected(MAPPED.north),projected(MAPPED.south)];
function lateral(pts,s){let i=1;while(i<pts.length-1&&pts[i][0]<s)i++;const a=pts[i-1],b=pts[i];return a[1]+(b[1]-a[1])*Math.max(0,Math.min(1,(s-a[0])/(b[0]-a[0])));}
export const approachBlend=s=>Math.min(smooth((s-LANDING)/(START-LANDING)),smooth((L-LANDING-s)/(L-LANDING-END)));
export function edgesAt(s){
 const w0=3+(ROAD_HALF-3)*approachBlend(s);
 if(s<=FORK)return [[-w0,0],[0,w0]];
 const join=raw.stationAt(MAPPED.east[0]);
 if(s>=join){const w=3+3*smooth((join+35-s)/35);return [[-w,0],[0,w]];}
 // Both ends are continuous. Each branch opens from its half of the bridge road (t). The mapped
 // centrelines meet at one node, so over the last 20 m (u) each shifts by its 3 m half-width and
 // arrives beside its twin as [-6,0]/[0,6], the first east section. Ribbons meet, never overlap.
 const t=smooth((s-FORK)/20),u=smooth((s-join+20)/20),half=w0/2+(3-w0/2)*t;
 const [n,q]=branches.map((pts,i)=>{const o=i?1:-1,c=(lateral(pts,s)*t+o*w0/2*(1-t))*(1-u)+o*3*u*(2-u);return [c-half,c+half];});
 if(n[1]>q[0])n[1]=q[0]=(n[1]+q[0])/2;
 return [n,q];
}
export const deckHeight=(s,approaches)=>{
 s=Math.max(0,Math.min(L,s));
 if(approaches?.world){const fitted=(approaches[0]||0)*(1-s/L)+(approaches[1]||0)*s/L;return .12+Math.max(fitted,(s<START||s>END)?(approaches.terrainDelta?.(s)??-Infinity):-Infinity);}
 if(!approaches)return DECK;
 return .10+(approaches[0]||0)*(1-s/L)+(approaches[1]||0)*s/L;
};
const base=createBridgeProfile({...SPEC,palette:PALETTES.light,width:WIDTH,centerline:MAPPED.centerline,roadEdges:[[-ROAD_HALF,0],[0,ROAD_HALF]],roadEdgesAt:edgesAt,
 ownershipMargin:1.2,clipStandardEnds:true,lateralBankFit:{blendM:65},buildingFootprints:[MAPPED.outline],
 groundControls:({length})=>[{s:0,sampleS:0},{s:length,sampleS:length}],
 profile:({length})=>[[0,'start'],[length,'end']]});
export const PROFILE={...base,deckHeight,fittedLateral:(_s,d)=>d,roadEdges:s=>edgesAt(s),meshStep:3,
 bridgePoint:(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s)),
 bridgeRoadHeight(lng,lat,heading,approaches,joins,sections){if(base.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;return deckHeight(base.stationAt([lng,lat]),approaches);}};
// Published clear spans, feet->metres. Pier width and longitudinal order are photographic estimates.
const spans=[113,113,151.5,223,151.5,113,113,113,113].map(v=>v*.3048),pier=3;
export const END_BAY=(LENGTH-spans.reduce((a,b)=>a+b,0)-8*pier)/2;
export const ARCHES=(()=>{let s=START+END_BAY;return spans.map((span,i)=>{const a={i,start:s,end:s+span,mid:s+span/2,span,spring:span>60?1.6:span>40?9:18,crown:DECK-3.3};s+=span+pier;return a;});})();
export const PIERS=[START+END_BAY-1.5,...ARCHES.slice(0,-1).map(a=>a.end+1.5),END-END_BAY+1.5];
export const archTop=(a,s)=>a.spring+(a.crown-a.spring)*Math.max(0,1-((s-a.mid)/(a.span/2))**2);
