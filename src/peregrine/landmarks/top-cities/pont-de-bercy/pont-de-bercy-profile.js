import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE } from './pont-de-bercy-alignment.js';
export const DECK_H=8, MAIN_LENGTH=175, RAMP=100, MAIN_START=100, MAIN_END=275;
export const UPPER_COUNT=41, UPPER_PITCH=175/41, UPPER_H=6.1;
export const PIER_S=Array.from({length:4},(_,i)=>MAIN_START+36.2+i*34.2);
export const ARCH_STARTS=Array.from({length:5},(_,i)=>MAIN_START+4.6+i*34.2);
// IGN BD ORTHO: 40±1 m envelope, ~11 m carriageways, ~3 m outer walks,
// ~7.5 m central viaduct. Landings follow separated OSM carriageways.
export function roadEdgesAt(s) {
 const t=Math.max(0,Math.min(1,s<100?s/100:(375-s)/100));
 const blend=t*t*(3-2*t),center=15+(10.85-15)*blend;
 const half=s<100?2.6+2.9*blend:4.8+0.7*blend;
 return [[-center-half,-center+half],[center-half,center+half]];
}
export const PROFILE=createBridgeProfile({
 ...SPEC,width:44,palette:PALETTES.light,centerline:CENTERLINE,
 roadEdges:[[-16.35,-5.35],[5.35,16.35]],roadEdgesAt,railGap:4,
 terrainPolicy:'bank-fit',clipStandardEnds:true,lateralBankFit:{blendM:100},
 profile:({length})=>[[0,'start'],[100,8],[length-100,8],[length,'end']],
});
// Keep the masonry river span rigid; landing taper is authored explicitly.
PROFILE.fittedLateral=(s,d)=>d;
export const UPPER_PIERS=Array.from({length:42},(_,i)=>100+i*UPPER_PITCH);
