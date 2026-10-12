import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC,PALETTES } from './config.js';
import alignment from './golden-ears-bridge-alignment.js';
export const MAIN_SPAN=242,SIDE_SPAN=121,DECK_H=44,TOWER_H=84,HALF_WIDTH=16.4;
export const ROAD_EDGES=[[-12.2,-.65],[.65,12.2]];
const base=createBridgeProfile({...SPEC,width:32.8,railGap:.5,roadEdges:ROAD_EDGES,
  centerline:alignment.centerline,palette:PALETTES.light,clipStandardEnds:true,
  lateralBankFit:{blendM:180,terrainClamp:true,clearanceM:0},
  profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
export const TOWERS=Array.from({length:4},(_,i)=>base.projectBridge(0,0).s+i*MAIN_SPAN);
export const MAIN_START=TOWERS[0]-SIDE_SPAN,MAIN_END=TOWERS[3]+SIDE_SPAN;
export const LANDING=55,CURVE=40,TAPER=180;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const approachBlend=s=>smooth(Math.min(s,L-s)/TAPER);
// Provider motorway ribbons at the reviewed driving zoom: 6 m per direction.
// This is a visual landing fit, never a reduction of the six-lane river deck.
const roadControls=alignment.roads.map(road=>road.line.map(ll=>{const q=base.bridgeLocal(...ll);return base.projectBridge(q.x,q.z);}).filter(q=>!q.beyond));
export function carriagewayCentres(s){return roadControls.map(line=>{let i=1;while(i<line.length-1&&line[i].s<s)i++;const a=line[i-1],b=line[i],t=Math.max(0,Math.min(1,(s-a.s)/(b.s-a.s)));return a.lateral+(b.lateral-a.lateral)*t;}).sort((a,b)=>a-b);}
export function edgesAt(s){const t=approachBlend(s),centres=carriagewayCentres(s);return ROAD_EDGES.map((edge,i)=>edge.map((v,j)=>(centres[i]+(j?3:-3))*(1-t)+v*t));}
// Measured cycle-path joins from ways 133593023 (east) and 128363956 (west).
// Paths leave the highway independently: do not squeeze them into its lanes.
export const PATH_START=68.65;
const pathEnds={
 '-1':[[PATH_START,-13.81],[2177.162,-14.838],[2202.026,-16.594],[2222.519,-17.486],[2243.053,-18.690],[2285.647,-20.436],[L,-20.318]],
 '1':[[PATH_START,12.605],[2094.982,12.547],[2152.084,13.022],[2184.648,12.527],[2217.437,12.728],[2245.991,13.288],[2266.092,13.267],[2296.305,13.621],[L,13.682]]};
export function pathCentre(s,side){const t=approachBlend(s),line=pathEnds[side];let i=1;while(i<line.length-1&&line[i][0]<s)i++;const a=line[i-1],b=line[i],u=Math.max(0,Math.min(1,(s-a[0])/(b[0]-a[0])));return side*14.3*t+(a[1]+(b[1]-a[1])*u)*(1-t);}
export const PATH_STATIONS=Object.values(pathEnds).flatMap(line=>line.map(v=>v[0]));
export const pathWidth=s=>.8+2.6*approachBlend(s);
export const pathHeight=s=>deckHeight(s)*smooth((s-PATH_START)/40);
function rise(u,length,low){
 const g=(DECK_H-low)/(length-CURVE);
 if(u<CURVE)return low+g*u*u/(2*CURVE);
 if(u>length-CURVE)return DECK_H-g*(length-u)**2/(2*CURVE);
 return low+g*(u-CURVE/2);
}
export function deckHeight(s,approaches=[0,0]){
 s=Math.max(0,Math.min(L,s));
 if(s<LANDING)return approaches[0];
 if(s<MAIN_START)return rise(s-LANDING,MAIN_START-LANDING,approaches[0]);
 if(s<=MAIN_END)return DECK_H;
 if(s>L-LANDING)return approaches[1];
 return rise(L-LANDING-s,L-LANDING-MAIN_END,approaches[1]);
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const accepted=createBridgeProfile({...base.CHAMPLAIN,roadEdgesAt:edgesAt});
const bridgeRoadHeight=(lng,lat,heading,approaches)=>accepted.bridgeRoadHeight(lng,lat,heading,approaches)===null?null:deckHeight(base.stationAt([lng,lat]),approaches);
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,fittedLateral:(_s,d)=>d,
 roadEdges:edgesAt,meshStep:4,
 knots:[[0,'start'],[LANDING,'start'],[MAIN_START,DECK_H],[MAIN_END,DECK_H],[L-LANDING,'end'],[L,'end']]};
export const GRADES=[DECK_H/(MAIN_START-LANDING-CURVE),DECK_H/(L-LANDING-MAIN_END-CURVE)];
