import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, BRIDGE_ENDS } from './pegasus-bridge-alignment.js';
import { FOOTPRINTS, TOWER_ORIGIN } from './footprint.js';
const mapped=createBridgeProfile({...SPEC,width:16,roadEdges:[[-3.7,3.7]],centerline:CENTERLINE,profile:({length})=>[[0,0],[length,0]]});
export const DECK_H=3.2,RAMP=70,BASCULE_M=45.7;
const from=mapped.stationAt(BRIDGE_ENDS[0])-RAMP, to=mapped.stationAt(BRIDGE_ENDS[1])+RAMP;
const llAt=s=>{const p=mapped.bridgePoint(s);return mapped.bridgeLngLat(p.x,p.z);};
const centerline=[llAt(from),...mapped.ALIGNMENT.filter(p=>p.s>from&&p.s<to).map(p=>mapped.bridgeLngLat(p.x,p.z)),llAt(to)];
export const PROFILE=createBridgeProfile({...SPEC,palette:PALETTES.light,width:16,roadEdges:[[-3.7,3.7]],centerline,modelDir:'bridges',meshStep:1,
 terrainPolicy:'bank-fit',buildingFootprints:[FOOTPRINTS[1]],
 profile:({length})=>[[0,'start'],[RAMP,DECK_H],[length-RAMP,DECK_H],[length,'end']],
});
export const STRUCTURE_START=RAMP,STRUCTURE_END=PROFILE.BRIDGE_LENGTH-RAMP;
export const HEEL=STRUCTURE_END-18,TOE=HEEL-BASCULE_M;
const t=PROFILE.bridgeLocal(...TOWER_ORIGIN);
export const TOWER={...t,...PROFILE.projectBridge(t.x,t.z)};
