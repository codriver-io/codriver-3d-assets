import alignment from './jacques-island-alignments.js';
import { JACQUES } from './montreal-profiles.js';
import { createBridgeProfile } from './bridge-profile.js';
import { bridgeBuilder } from './asset-geometry.js';

const islandPoint = JACQUES.bridgePoint(JACQUES.landmarks.island);
const island = JACQUES.bridgeLngLat(islandPoint.x,islandPoint.z);
const mainHeight = ll => JACQUES.deckHeight(JACQUES.stationAt(ll));
const profiles = {};
for (const key of ['north-out','south-out','north-in','south-in']) {
  const points = alignment.ramps[key].centerline, outgoing = key.endsWith('-out');
  const shared = outgoing ? null : profiles[key.replace('-in','-out')];
  const start = outgoing ? mainHeight(points[0]) : shared.deckHeight(shared.stationAt(points[0]));
  const end = outgoing ? 'end' : mainHeight(points.at(-1));
  profiles[key] = createBridgeProfile({
    id:`pont-jacques-cartier-${key}`, name:`Jacques-Cartier · ${key} island access`,
    origin:JACQUES.CHAMPLAIN.origin,width:outgoing?8:5.2,
    roadEdges:outgoing?[[-3.4,3.4]]:[[-2,2]],centerline:points,
    terrainPolicy:'bank-fit',ownershipMargin:.8,
    ...(shared?{defaultApproaches:[start,0],connectedStart:{id:shared.CHAMPLAIN.id,station:shared.stationAt(points[0])}}:{}),
    profile:({length})=>[[0,shared?'start':start],[length,end]],
    // All loop junctions use the main pavilion's island datum. Only the final
    // street approach blends to its own ground; sibling ramps agree at forks.
    groundControls:({length})=>outgoing
      ? [{s:0,sampleLngLat:island},{s:Math.max(1,length-45),sampleLngLat:island},{s:length,sampleS:length}]
      : [{s:0,sampleLngLat:island},{s:length,sampleLngLat:island}],
  });
}
export const JACQUES_RAMPS = Object.values(profiles);

export function createJacquesIslandRamp(profile,{detail='near'}={}) {
  const b=bridgeBuilder(profile,detail),h=profile.deckHeight,L=profile.BRIDGE_LENGTH,half=profile.halfWidth;
  b.strip('concrete',0,L,-half,half,-.12,.8);
  b.strip('asphalt',0,L,...profile.ROAD_EDGES[0]);
  for(const d of [-half+.15,half-.15])b.strip('concrete',0,L,d-.15,d+.15,.65,.85);
  if(detail==='near')for(const d of profile.ROAD_EDGES[0])b.strip('paint',0,L,d-.06,d+.06,.025);
  // The loops are concrete viaducts, with narrow single shafts and transverse
  // caps. Their immutable toes stay local while shafts meet the fitted slab.
  for(let s=22;s<L-15;s+=32){
    const top=h(s)-.92;
    if(top<2)continue;
    b.box('concrete',s,0,(top-1)/2,1.8,1.8,top+1,0,y=>Math.max(0,Math.min(1,(y+1)/(top+1))));
    b.box('concrete',s,0,top-.25,2.4,profile.CHAMPLAIN.width,.5);
  }
  return b.finish();
}
