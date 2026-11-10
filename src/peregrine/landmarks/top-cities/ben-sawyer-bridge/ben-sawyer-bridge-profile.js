import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES,LENGTH} from './config.js';
import {BRIDGE_CENTERLINE,SOUTH_APPROACH,NORTH_APPROACH} from './ben-sawyer-bridge-alignment.js';

// The 2010 steel span retains its approved dimensions. Only the approach
// alignment/grade and support seating change. No parallel highway is carried.
export const SPAN=75.2856,DECK_H=11.8,TIE_IN=60,LANDING=4,CURVE=12;
const frame=createBridgeProfile({...SPEC,width:13,roadEdges:[[-4.267,4.267]],centerline:BRIDGE_CENTERLINE,
 profile:({length})=>[[0,'start'],[length,'end']]});
function extension(a,b,end) {
 const p=frame.bridgeLocal(...a),q=frame.bridgeLocal(...b),len=Math.hypot(q.x-p.x,q.z-p.z);
 const t=end?TIE_IN/len:1-TIE_IN/len;
 return frame.bridgeLngLat(p.x+(q.x-p.x)*t,p.z+(q.z-p.z)*t);
}
export const CENTERLINE=[extension(...SOUTH_APPROACH,false),...BRIDGE_CENTERLINE,extension(...NORTH_APPROACH,true)];
export const STRUCTURE_START=TIE_IN,STRUCTURE_END=TIE_IN+frame.BRIDGE_LENGTH;
export const CENTER=TIE_IN+(frame.ALIGNMENT[1].s+frame.ALIGNMENT[2].s)/2;
export const SWING_START=CENTER-SPAN/2,SWING_END=CENTER+SPAN/2;
export const L=TIE_IN*2+frame.BRIDGE_LENGTH;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// Six-metre provider ribbon at the two land joints, full 14-foot lanes on steel.
export const roadHalfWidth=s=>3+1.267*Math.min(smooth(s/TIE_IN),smooth((L-s)/TIE_IN));
export const edgesAt=s=>[[-roadHalfWidth(s),roadHalfWidth(s)]];
const base=createBridgeProfile({...SPEC,palette:PALETTES.light,width:13,centerline:CENTERLINE,
 roadEdges:[[-4.267,4.267]],roadEdgesAt:edgesAt,terrainPolicy:'absolute-deck',
 // The cached 210 m building/building:part inventory contains no provider boxes.
 buildingFootprints:[],clipStandardEnds:true,lateralBankFit:{blendM:TIE_IN,terrainClamp:true,clearanceM:.12},
 profile:()=>[[0,'start'],[LANDING,'start'],[SWING_START,DECK_H],[SWING_END,DECK_H],[L-LANDING,'end'],[L,'end']]});
function rise(u,len,a,b) {
 const g=(b-a)/(len-CURVE);
 if(u<CURVE)return a+g*u*u/(2*CURVE);
 if(u>len-CURVE)return b-g*(len-u)**2/(2*CURVE);
 return a+g*(u-CURVE/2);
}
export function deckHeight(s,approaches=[0,0]) {
 if(s<=LANDING)return approaches[0];
 if(s<SWING_START)return rise(s-LANDING,SWING_START-LANDING,approaches[0],DECK_H);
 if(s<=SWING_END)return DECK_H;
 if(s>=L-LANDING)return approaches[1];
 return rise(L-LANDING-s,L-LANDING-SWING_END,approaches[1],DECK_H);
}
// Reuse the approved source's centred stations; the central truss is rigid.
export function station(s) {
 if(s< -SPAN/2)return SWING_START+(s+SPAN/2)*(SWING_START-STRUCTURE_START)/(LENGTH/2-SPAN/2);
 if(s>SPAN/2)return SWING_END+(s-SPAN/2)*(STRUCTURE_END-SWING_END)/(LENGTH/2-SPAN/2);
 return CENTER+s;
}
export const GRADES=[DECK_H/(SWING_START-LANDING-CURVE),DECK_H/(L-LANDING-SWING_END-CURVE)];
export const PROFILE={...base,deckHeight,roadEdges:edgesAt,fittedLateral:(_s,d)=>d,
 bridgePoint:(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s)),
 bridgeRoadHeight(lng,lat,heading,approaches) {
  if(base.bridgeRoadHeight(lng,lat,heading,approaches)===null)return null;
  return deckHeight(base.stationAt([lng,lat]),approaches);
 },
 ownsPoint(x,z) {const q=base.projectBridge(x,z);return !q.beyond&&q.lateral>=-6.7&&q.lateral<=5.7;},
 meshStep:2,surfaceStep:2,ownershipMargin:.25};
