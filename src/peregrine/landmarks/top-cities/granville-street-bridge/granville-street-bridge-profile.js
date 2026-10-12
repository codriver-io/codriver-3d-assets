import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { CENTERLINE } from './granville-street-bridge-mapped.js';
export const DECK = 35;
export const LEFT = -17.9, RIGHT = 10.0;
// Seven estimated support-centre spans, registered to island/channel photographs.
// Only their count and 29–121 m range are sourced; individual lengths are estimates.
export const SPANS = [29, 76, 91, 76, 121, 91, 29];
export const PIERS = [498];
for (const span of SPANS) PIERS.push(PIERS.at(-1) + span);
export const MAIN = [PIERS[4], PIERS[5]];
const base = createBridgeProfile({
  ...SPEC, palette: PALETTES.light, centerline: CENTERLINE, width: 39,
  deck: DECK, roadEdges: [[-10.2, -0.6], [-0.6, 9.0]], terrainPolicy: 'absolute-deck',
  clipStandardEnds: true,
  profile: ({length,deck}) => [[0,'start'],[PIERS[0],deck],[PIERS.at(-1),deck],[length,'end']],
});
export const L = base.BRIDGE_LENGTH, TAPER = 90;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const landingBlend=s=>1-smooth(Math.min(s,L-s)/TAPER);
export const shoulderBlend=s=>1-landingBlend(s);
const ROAD_EDGES=base.ROAD_EDGES;
// OSM southbound ways 341691651/74231041 intersect the south endpoint
// 10.13m west of the northbound alignment; downtown is one two-way street.
const southbound=[[-123.1385287,49.2665553],[-123.1385217,49.2669494],[-123.1385053,49.2671408],[-123.1384757,49.2676408]].map(ll=>base.bridgeLocal(...ll));
function southCentre(s){
 const q=base.bridgePoint(s),a=southbound[0],b=southbound[1];
 const u=(a.x-q.x)*q.tx+(a.z-q.z)*q.tz,v=(b.x-q.x)*q.tx+(b.z-q.z)*q.tz;
 const t=-u/(v-u),x=a.x+(b.x-a.x)*t-q.x,z=a.z+(b.z-a.z)*t-q.z;
 return -q.tz*x+q.tx*z;
}
export function landingEdges(s,width=6){
 return s<L/2?[[southCentre(s)-width/2,southCentre(s)+width/2],[-width/2,width/2]]:[[-width/2,0],[0,width/2]];
}
export function roadEdges(s,joins,sections){
 const t=landingBlend(s);if(!t)return ROAD_EDGES;
 const end=s<L/2?0:1,measured=base.roadEdges(s,joins,sections),fallback=landingEdges(s);
 return ROAD_EDGES.map((edge,side)=>edge.map((d,i)=>d+((joins?.[end]?.[side]||sections?.some(v=>v.edges?.[side])?measured[side]:fallback[side])[i]-d)*t));
}
const remap=(d,from,to,shoulder=1)=>d<from[0]?to[0]+(d-from[0])*shoulder:d>from[1]?to[1]+(d-from[1])*shoulder:to[0]+(d-from[0])/(from[1]-from[0])*(to[1]-to[0]);
export const authoredLateral=(s,d,side=d<-.6?0:1)=>remap(d,ROAD_EDGES[side],roadEdges(s)[side],shoulderBlend(s));
function fittedLateral(s,d,joins,sections){
 if(!landingBlend(s))return d; // All steel spans retain their rigid width.
 const authored=roadEdges(s),fitted=roadEdges(s,joins,sections),side=d<(authored[0][1]+authored[1][0])/2?0:1;
 return remap(d,authored[side],fitted[side]);
}
function bridgeRoadHeight(lng,lat,heading,approaches,joins,sections){
 const local=base.bridgeLocal(lng,lat),q=base.projectBridge(local.x,local.z);
 if(q.beyond||!roadEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-.6&&q.lateral<=b+.6))return null;
 if(Number.isFinite(heading)){const h=heading*Math.PI/180;if(Math.abs(Math.sin(h)*q.tx-Math.cos(h)*q.tz)<.8)return null;}
 return base.deckHeight(q.s,approaches);
}
export const PROFILE={...base,roadEdges,fittedLateral,bridgeRoadHeight};
export function lowerChord(s,a,c) {
  const t=(s-a)/(c-a);
  return PROFILE.deckHeight(s) - (12.0-5.2*4*t*(1-t));
}
export function footprintRing() {
  const stations=[...new Set([0,20,45,90,L-90,L-45,L-20,L,...PROFILE.ALIGNMENT.map(q=>q.s)])].sort((a,b)=>a-b);
  const sides = [LEFT-0.8, RIGHT+0.8].map(d => stations.map(s => {
    const p=PROFILE.bridgePoint(s,authoredLateral(s,d)+(d<0?-.8:.8));return PROFILE.bridgeLngLat(p.x,p.z);
  }));
  const ring=[...sides[0],...sides[1].reverse()];return [...ring,ring[0]];
}
PROFILE.CHAMPLAIN.buildingFootprints=[footprintRing()];
