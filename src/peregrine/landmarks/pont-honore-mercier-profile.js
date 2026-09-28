import alignment from './pont-honore-mercier-alignment.js';
import { createBridgeProfile } from './bridge-profile.js';

export const MERCIER = { id:'pont-honore-mercier', name:'Pont Honoré-Mercier', origin:[-73.65852,45.41025] };
// Each directional alignment has its own station frame. The two ramp forks
// share fixed visual junction datums, while six shore ends fit loaded HD roads.
export const MERCIER_PROFILES = Object.entries(alignment.parts).map(([part,data]) => {
  const ramp = part.startsWith('laprairie'), upstream=part==='upstream';
  const p=createBridgeProfile({ ...MERCIER, id:`${MERCIER.id}-${part}`, part, headingAlignment:0.92,
    width:ramp ? (part.endsWith('in')?6.8:10.1) : 10.1,
    roadEdges:[ramp && part.endsWith('in') ? [-2.7,2.7] : [-4.1,4.1]],
    centerline:data.centerline, stations:ramp ? {} : {
      main:[-73.65667,45.41387], channel:MERCIER.origin,
      fork:upstream ? [-73.6593353,45.4086114] : [-73.6590507,45.4088618],
    },
    profile:({length,main,channel,fork})=>ramp ? [[0,22],[length*0.38,17],[length,'end']] :
      [[0,'start'],[180,17],[main-180,23],[main+100,32],[channel-65,40],[channel+65,40],[fork,22],
        // The Châteauguay inbound flyover crosses ABOVE both La Prairie legs.
        ...(!upstream?[[1745,24]]:[]),[length,'end']],
  });
  // These close, diverging carriageways must not claim each other's deck.
  p.ownershipMargin=3;
  return p;
});
export const MERCIER_UPSTREAM=MERCIER_PROFILES[0];
export const MERCIER_DOWNSTREAM=MERCIER_PROFILES[1];

// HD lanes may be wider than the physical deck. Admit their full triangles,
// then assign parallel overlapping pavement to the closest mapped direction.
// Transverse flyovers are classified by the shared provider direction/height.
for(const p of MERCIER_PROFILES)p.ownsPoint=(x,z)=>{
  const q=p.projectBridge(x,z);
  return !MERCIER_PROFILES.some(other=>{
    if(other===p)return false;const r=other.projectBridge(x,z);
    return !r.beyond && Math.abs(r.tx*q.tx+r.tz*q.tz)>0.92 && r.distance+0.2<q.distance;
  });
};
