import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE } from './pont-mirabeau-alignment.js';
export const DECK_H=8,RAMP=160,MAIN_START=RAMP,MAIN_END=MAIN_START+173;
// Published clear spans; residual 15.2 m is shared by the two piers.
export const PIERS=[MAIN_START+36.2,MAIN_START+136.8];
export const SPANS=[[MAIN_START,MAIN_START+32.4],[MAIN_START+40,MAIN_START+133],[MAIN_START+140.6,MAIN_END]];
export const ARCH_RISE=93/16;
const smooth=t=>t*t*(3-2*t);
export function roadEdgesAt(s){
 const t=s<MAIN_START?s/MAIN_START:s>MAIN_END?(MAIN_END+RAMP-s)/RAMP:1;
 const f=smooth(Math.max(0,Math.min(1,t)));
 // North is the six-lane Amiral Cloué avenue; south is three-lane Convention.
 const half=s<MAIN_START?9-3*f:4.6+1.4*f;
 return [[-half,half]];
}
export function outerAt(s){
 const f=smooth(Math.max(0,Math.min(1,s<MAIN_START?s/RAMP:s>MAIN_END?(MAIN_END+RAMP-s)/RAMP:1)));
 return Math.max(Math.abs(roadEdgesAt(s)[0][0])+0.75,10*f);
}
export const PROFILE=createBridgeProfile({
 ...SPEC,width:28,modelDir:'bridges',palette:PALETTES.light,centerline:CENTERLINE,
 roadEdges:[[-6,6]],roadEdgesAt,terrainPolicy:'bank-fit',clipStandardEnds:true,
 lateralBankFit:{blendM:RAMP},
 profile:({length})=>[[0,'start'],[MAIN_START,DECK_H],[MAIN_END,DECK_H],[length,'end']],
});
// A rigid steel bridge cannot contract to a fragmentary live pavement sample.
PROFILE.fittedLateral=(s,d)=>d;
export function archY(span,s){
 const [a,z]=SPANS[span],t=Math.max(0,Math.min(1,(s-a)/(z-a)));
 if(span===1)return 0.8+ARCH_RISE*4*t*(1-t);
 return 0.8+5.6*Math.sqrt(span===0?1-t:t);
}
// The polygon has a small kink at each quay. Structural transverse members use
// the river tangent at the exact endpoint too, rather than the incoming street
// tangent selected by createBridgeProfile's inclusive vertex lookup.
const mappedPoint=PROFILE.bridgePoint,river=mappedPoint(MAIN_START+1),riverStart={x:river.x-river.tx,z:river.z-river.tz};
PROFILE.bridgePoint=(s,d=0,y=null)=>s>=MAIN_START&&s<=MAIN_END?{
 x:riverStart.x+(s-MAIN_START)*river.tx-river.tz*d,
 z:riverStart.z+(s-MAIN_START)*river.tz+river.tx*d,
 y:y??PROFILE.deckHeight(s),tx:river.tx,tz:river.tz,
}:mappedPoint(s,d,y);
