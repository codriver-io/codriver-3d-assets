import alignment from './montreal-alignments.js';
import { createBridgeProfile } from './bridge-profile.js';

export const VICTORIA = createBridgeProfile({
  id:'pont-victoria', name:'Pont Victoria', origin:[-73.5298,45.4915], width:22, railGap:5,
  roadEdges:[[-10.4,-6.1],[6.1,10.4]], centerline:alignment.victoria.centerline,
  stations:{lock:[-73.51779,45.49555]},
  profile:({length})=>[[0,'start'],[180,17],[length-180,17],[length,'end']],
});
export const JACQUES = createBridgeProfile({
  id:'pont-jacques-cartier',name:'Pont Jacques-Cartier',origin:[-73.5417613,45.5218315],width:23.1,
  terrainPolicy:'bank-fit', rigidFoundations:true, ownershipMargin:2,
  foundationFootprint:alignment.jacques.pavilion.footprint,
  roadEdges:[[-9.15,9.15]],centerline:alignment.jacques.centerline,
  stations:{main:[-73.5417613,45.5218315],island:[-73.5353,45.52073],channel:[-73.5258,45.52144]},
  // The main deck rests on the pavilion roof, not on the island access road.
  // Local y=0 is foundation ground. Relative heights are visual estimates.
  profile:({length,main,island,channel})=>[[0,'start'],[main-295.2,40],[main+295.2,40],
    [island-100,22],[island+100,22],[channel-120,37],[channel+120,37],[length,'end']],
  // Interpolate across the two waterways; never sample the deck's riverbed.
  // A constant island datum also keeps the pavilion roof/deck contact rigid.
  groundControls:({length,island})=>[{s:0,sampleS:0},{s:island-100,sampleS:island},
    {s:island+100,sampleS:island},{s:length,sampleS:length}],
});
export const BIOSPHERE={id:'biosphere-montreal',name:'Biosphère de Montréal',origin:alignment.biosphere.origin,
  diameter:76,height:62,footprint:alignment.biosphere.footprint};
export const BRIDGE_PROFILES=[VICTORIA,JACQUES];
