import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import alignment from './margaret-mcdermott-bridge-alignment.js';

export const SPAN = 342.9;
export const CROWN = 106.68;
export const DECK = CROWN - 86.868;
export const PATH_WIDTH = 6.1976;
export const ARCH_D = [-61.3, 61.3];
export const RAMP = 250;
export const LENGTH = 1000;
export const ARCH_START = (LENGTH - SPAN) / 2;
export const ARCH_END = ARCH_START + SPAN;
export const WORLD_RIVER = 118; // Approximate datum, not a surveyed absolute height.
export const realSurface = (a) => Object.assign([...a], { real: true });
// OSM cycle-path controls at the straight, arch-supported segment; mean of north/south paths.
const north = alignment.ways.find(w => w.id === 483237626).line;
const south = alignment.ways.find(w => w.id === 483826660).line;
const mean = (a,b) => a.map((v,i)=>(v+b[i])/2);
const west = mean(north[5],south[5]), east = mean(north[4],south[6]);
const axis = createBridgeProfile({ origin: SPEC.origin, width: 130, roadEdges: [], centerline: [west,east], profile: ({length}) => [[0,0],[length,0]] });
const mid = axis.bridgeLocal(...SPEC.origin), q = axis.bridgePoint(axis.BRIDGE_LENGTH / 2);
const end = (n) => axis.bridgeLngLat(mid.x + q.tx*n, mid.z + q.tz*n);
const base = createBridgeProfile({
  ...SPEC, modelDir: 'bridges', palette: PALETTES.light, width: 130,
  // Two owned freeway corridors include the parallel frontage roads and ramp lanes;
  // actual provider pavement and lane layouts are retained, including their gaps.
  roadEdges: [[-55.5,-2],[2,55.5]], railGap: 2,
  centerline: [end(-LENGTH/2),end(LENGTH/2)], clipStandardEnds: true,
  profile: ({length}) => [[0,'start'],[RAMP,DECK],[length-RAMP,DECK],[length,'end']],
});
// This profile deliberately shares base's cubic ramps with geometry and navigation.
function deckHeight(s,a=[0,0]) {
  return base.deckHeight(s, a.real ? [a[0]-WORLD_RIVER,a[1]-WORLD_RIVER] : a) + (a.real ? WORLD_RIVER : 0);
}
const bridgePoint = (s,d=0,y=null) => base.bridgePoint(s,d,y ?? deckHeight(s));
function bridgeRoadHeight(lng,lat,heading,a,joins,sections) {
  const local=base.bridgeLocal(lng,lat), p=base.projectBridge(local.x,local.z);
  if(p.beyond || !base.roadEdges(p.s,joins,sections).some(([l,r])=>p.lateral>=l-.6&&p.lateral<=r+.6))return null;
  if(Number.isFinite(heading)) { const h=heading*Math.PI/180; if(Math.abs(Math.sin(h)*p.tx-Math.cos(h)*p.tz)<.8)return null; }
  return deckHeight(p.s,a);
}
export const PROFILE = { ...base, deckHeight, bridgePoint, bridgeRoadHeight };
