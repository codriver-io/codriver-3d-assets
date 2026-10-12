import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, SOUTH_BANK, NORTH_BANK } from './samuel-beckett-bridge-alignment.js';
const base={...SPEC,width:27,roadEdges:[[-8.75,-.75],[.75,8.75]],centerline:CENTERLINE,palette:PALETTES.light,clipStandardEnds:true};
const probe=createBridgeProfile({...base,profile:({length})=>[[0,0],[length,0]]});
export const SOUTH=probe.stationAt(SOUTH_BANK);
export const NORTH=probe.stationAt(NORTH_BANK);
export const PYLON=SOUTH+28;
export const DECK_H=1.6;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// The SD road surface at the driving zoom is 5.0–5.2 m wide. Only the
// land ramps narrow to this connected ribbon; the 27 m platform stays rigid.
export const landingBlend=s=>s<SOUTH?1-smooth(s/SOUTH):s>NORTH?smooth((s-NORTH)/(probe.BRIDGE_LENGTH-NORTH)):0;
export const halfAt=s=>8.75-6.25*landingBlend(s);
export const edgesAt=s=>{const median=.75*(1-landingBlend(s));return[[-halfAt(s),-median],[median,halfAt(s)]];};
export const PROFILE=createBridgeProfile({...base,roadEdgesAt:edgesAt,profile:({length})=>[[0,'start'],[SOUTH,DECK_H],[NORTH,DECK_H],[length,'end']]});
// A fabricated steel platform retains its published 27 m width under fragmentary HD samples.
PROFILE.fittedLateral=(s,d)=>d;
PROFILE.meshStep=1;
