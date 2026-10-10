import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
// Centre between mapped tram tracks and carriageways. OSM dossier 2026-10-09.
// Increasing station is east towards Saint-Michel; local metres east/up/south.
export const CENTERLINE = [
 [1.435148,43.592665],[1.435792,43.5926001],[1.43962125,43.5922729],
 [1.4399751,43.59224215],[1.44021635,43.59222095],[1.44041325,43.5922033],
 [1.4407136,43.5921773],[1.4419475,43.5920698],[1.44206515,43.59208075],
];
export const DECK_H=8, RAMP=100, MAIN_LENGTH=326, SPAN=65.2;
export const PROFILE=createBridgeProfile({
 ...SPEC,width:26,palette:PALETTES.light,centerline:CENTERLINE,
 roadEdges:[[-9.7,-5.1],[5.1,9.7]],railGap:4.4,terrainPolicy:'bank-fit',clipStandardEnds:true,
 profile:({length})=>[[0,'start'],[RAMP,DECK_H],[length-RAMP,DECK_H],[length,'end']],
});
export const MAIN_END=PROFILE.stationAt(CENTERLINE[2]);
export const MAIN_START=MAIN_END-MAIN_LENGTH;
export const PIER_S=[1,2,3,4].map(i=>MAIN_START+i*SPAN);
export const RIB_D=[-10,-5,0,5,10];
