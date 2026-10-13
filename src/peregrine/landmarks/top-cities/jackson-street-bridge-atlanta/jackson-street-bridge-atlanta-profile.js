import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE, BRIDGE_ENDS } from './jackson-street-bridge-atlanta-alignment.js';
export const DECK_H = 6, CURVE = 12, LANDING = 4;
const base = createBridgeProfile({ ...SPEC, palette: PALETTES.light, modelDir: 'bridges', width: 19.4,
 centerline: CENTERLINE, roadEdges: [[-7.3,7.3]], terrainPolicy: 'absolute-deck',
 lateralBankFit: {blendM: 30, terrainClamp: true, clearanceM: .12},
 clipStandardEnds: true, profile: ({length}) => [[0,'start'],[length,'end']],
});
export const A = base.stationAt(BRIDGE_ENDS[0]), B = base.stationAt(BRIDGE_ENDS[1]), L = base.BRIDGE_LENGTH;
const smooth = t => { t=Math.max(0,Math.min(1,t));return t*t*(3-2*t); };
export const landingBlend = s => s<A ? smooth((s-LANDING)/(A-LANDING)) : s>B ? smooth((L-LANDING-s)/(L-LANDING-B)) : 1;
export const roadHalf = s => 5.4+1.9*landingBlend(s);
// Sidewalk centre lines join the mapped ~8 m offsets; width tapers toward the ordinary street kerb.
export const edgeAt = (s,side) => side*(roadHalf(s)+1.85+.45*landingBlend(s));
function rise(u,len,a,b) { const g=(b-a)/(len-CURVE); if(u<CURVE)return a+g*u*u/(2*CURVE);if(u>len-CURVE)return b-g*(len-u)**2/(2*CURVE);return a+g*(u-CURVE/2); }
export function deckHeight(s,approaches=[0,0]) {
 s=Math.max(0,Math.min(L,s));
 // The owned runtime layer supplies this marker only when DEM is active. Numeric array entries retain the shared bridge surface contract.
 if(approaches.terrain) {
  const banks=approaches.banks || approaches;
  const controls=[[0,approaches[0]],[A,banks[0]],[B,banks[1]],[L,approaches[1]]];
  let i=1;while(i<3&&controls[i][0]<s)i++;
  const a=controls[i-1],b=controls[i];return a[1]+(b[1]-a[1])*(s-a[0])/(b[0]-a[0]);
 }
 if(s<=LANDING)return approaches[0];
 if(s<A)return rise(s-LANDING,A-LANDING,approaches[0],DECK_H);
 if(s<=B)return DECK_H;
 if(s>=L-LANDING)return approaches[1];
 return rise(L-LANDING-s,L-LANDING-B,approaches[1],DECK_H);
}
const edgesAt=s=>[[-roadHalf(s),roadHalf(s)]];
const accept=createBridgeProfile({...base.CHAMPLAIN,roadEdgesAt:edgesAt});
export const PROFILE = { ...base, deckHeight, bridgePoint:(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s)),
 roadEdges:s=>edgesAt(s), fittedLateral:(s,d,joins)=>{
  // Keep the short concrete span rigid. Fit only each landing's road/kerb to the connected provider width.
  const end=s<L/2?0:1,old=edgesAt(s)[0],next=joins?.[end]?.[0];
  if(!next)return d;const t=1-landingBlend(s),scale=(next[1]-next[0])/(old[1]-old[0]);
  return d+(d*scale+(next[0]+next[1])/2-d)*t;
 },
 bridgeRoadHeight(lng,lat,heading,approaches){if(accept.bridgeRoadHeight(lng,lat,heading,approaches)===null)return null;return deckHeight(base.stationAt([lng,lat]),approaches);},
 meshStep: 2, surfaceStep: 2,
 knots:[[0,'start'],[LANDING,'start'],[A,6],[B,6],[L-LANDING,'end'],[L,'end']],
};
export const GRADES=[DECK_H/(A-LANDING-CURVE),DECK_H/(L-LANDING-B-CURVE)];
