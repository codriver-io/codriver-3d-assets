import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {STRUCTURE_LINE,NORTH_APPROACH,SOUTH_APPROACH} from './viaduc-de-millau-alignment.js';
export const LENGTH=2460,GRADE=.03025,WIDTH=32.05,PYLON_HEIGHT=87;
export const PIER_HEIGHTS=[94.501,244.96,221.05,144.21,136.42,111.94,77.56];
const base=createBridgeProfile({...SPEC,width:WIDTH,roadEdges:[[-14.7,-2.6],[2.6,14.7]],
 palette:PALETTES.light,centerline:[NORTH_APPROACH,...STRUCTURE_LINE,SOUTH_APPROACH],
 clipStandardEnds:true,profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH;
const mappedStart=base.stationAt(STRUCTURE_LINE[0]),mappedEnd=base.stationAt(STRUCTURE_LINE.at(-1));
export const START=(mappedStart+mappedEnd-LENGTH)/2,END=START+LENGTH;
export const PIERS=Array.from({length:7},(_,i)=>START+204+342*i);
export const authorDeck=s=>GRADE*(s-START);
export function deckHeight(s,approaches){
 s=Math.max(0,Math.min(L,s));
 if(!approaches)return authorDeck(s);
 if(approaches.world)return approaches[0]+(approaches[1]-approaches[0])*s/L;
 // The flat basemap has no valley: retain an ordinary continuous driving ribbon.
 const t=s/L;return approaches[0]+(approaches[1]-approaches[0])*t+.35*Math.sin(Math.PI*t)**2;
}
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{
 if(base.bridgeRoadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;
 return deckHeight(base.stationAt([lng,lat]),approaches||[0,0]);
};
export const PROFILE={...base,deckHeight,bridgePoint,bridgeRoadHeight,meshStep:8,
 knots:[[0,'start'],[START,0],[END,LENGTH*GRADE],[L,'end']]};
