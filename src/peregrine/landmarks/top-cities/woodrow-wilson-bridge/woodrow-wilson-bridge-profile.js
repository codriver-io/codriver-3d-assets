import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { ALIGNMENT_DATA } from './woodrow-wilson-bridge-alignment.js';

export const TRUNNION_SPAN = 270 * .3048, CLEARANCE = 70 * .3048;
export const DECK_H = 24, DECK_WIDTHS = [124*.3048,110*.3048], GAP = 15*.3048;
export const DECK_EDGES = [[-GAP/2-DECK_WIDTHS[0],-GAP/2],[GAP/2,GAP/2+DECK_WIDTHS[1]]];
const roads=ALIGNMENT_DATA.roads;
// Include 20 m of each connected approach beyond every mapped carriageway endpoint.
// A shared transverse cut must account for both roadway skew and unequal OSM splits.
const west=Math.min(...roads.map(r=>r.points[0][0]))-.00023,east=Math.max(...roads.map(r=>r.points.at(-1)[0]))+.00023;
function atLon(points,lon){
 let i=1;while(i<points.length-1&&points[i][0]<lon)i++;
 const a=points[i-1],b=points[i],t=(lon-a[0])/(b[0]-a[0]);return [lon,a[1]+(b[1]-a[1])*t];
}
const longitudes=[...new Set([west,east,...roads.flatMap(r=>r.points.map(p=>p[0]).filter(x=>x>west&&x<east))])].sort((a,b)=>a-b);
const centerline=longitudes.map(lon=>[lon,roads.reduce((n,r)=>n+atLon(r.points,lon)[1],0)/4]);
const metric=createBridgeProfile({...SPEC,width:86,roadEdges:[],centerline,profile:({length})=>[[0,0],[length,0]]});
const table=longitudes.map(lon=>({s:metric.stationAt(centerline[longitudes.indexOf(lon)]),d:roads.map(r=>{const q=metric.bridgeLocal(...atLon(r.points,lon));return metric.projectBridge(q.x,q.z).lateral;})}));
export function roadCentresAt(s){
 let i=1;while(i<table.length-1&&table[i].s<s)i++;
 const a=table[i-1],b=table[i],t=Math.max(0,Math.min(1,(s-a.s)/(b.s-a.s||1)));
 return a.d.map((v,k)=>v+(b.d[k]-v)*t);
}
export const LANDING_M=160, RAMP_WEST=350, RAMP_EAST=330;
export const landingBlend=s=>{const t=Math.min(1,Math.max(0,Math.min(s,metric.BRIDGE_LENGTH-s)/LANDING_M));return t*t*(3-2*t);};
export function carriagewaysAt(s){
 const blend=landingBlend(s);return roadCentresAt(s).map((d,i)=>{const half=4.11+((i===0||i===3?6.4:5.35)-4.11)*blend;return [d-half,d+half];});
}
export const roadEdgesAt=s=>{const e=carriagewaysAt(s);return [[e[0][0],e[1][1]],[e[2][0],e[3][1]]];};
export const PROFILE=createBridgeProfile({
 ...SPEC,width:86,modelDir:'bridges',palette:PALETTES.light,centerline,
 roadEdges:roadEdgesAt(800),roadEdgesAt,clipStandardEnds:true,buildingFootprints:FOOTPRINTS,
 profile:({length})=>[[0,'start'],[RAMP_WEST,DECK_H],[length-RAMP_EAST,DECK_H],[length,'end']],
});
// Constant grade with 30 m vertical curves; the same function feeds mesh, route and car.
const curved=(u,length)=>{const c=30,g=1/(length-c);if(u<c)return g*u*u/(2*c);if(u>length-c)return 1-g*(length-u)**2/(2*c);return g*(u-c/2);};
PROFILE.deckHeight=(s,approaches=[0,0])=>{
 s=Math.max(0,Math.min(PROFILE.BRIDGE_LENGTH,s));
 if(s<RAMP_WEST)return approaches[0]+(DECK_H-approaches[0])*curved(s,RAMP_WEST);
 if(s>PROFILE.BRIDGE_LENGTH-RAMP_EAST)return approaches[1]+(DECK_H-approaches[1])*curved(PROFILE.BRIDGE_LENGTH-s,RAMP_EAST);
 return DECK_H;
};
const point=PROFILE.bridgePoint,roadHeight=PROFILE.bridgeRoadHeight;
PROFILE.bridgePoint=(s,d=0,y=null)=>point(s,d,y??PROFILE.deckHeight(s));
PROFILE.bridgeRoadHeight=(lng,lat,heading,approaches,joins,sections)=>{
 if(roadHeight(lng,lat,heading,approaches,joins,sections)===null)return null;
 const q=PROFILE.bridgeLocal(lng,lat);return PROFILE.deckHeight(PROFILE.projectBridge(q.x,q.z).s,approaches);
};
PROFILE.fittedLateral=(s,d)=>d; // Published rigid girder-deck widths, independent of HD slivers.
export const BASCULE_S=PROFILE.stationAt([-77.037669,38.7927185]);
export const TRUNNIONS=[BASCULE_S-TRUNNION_SPAN/2,BASCULE_S+TRUNNION_SPAN/2];
// Nine Maryland support lines and seven Virginia lines, visually estimated from photos.
export const PIER_S=[...Array.from({length:7},(_,i)=>110+i*(TRUNNIONS[0]-110)/7),...Array.from({length:9},(_,i)=>TRUNNIONS[1]+95+i*(PROFILE.BRIDGE_LENGTH-110-TRUNNIONS[1]-95)/8)];

const control=p=>PROFILE.projectBridge(p.x,p.z);
export const CONTROL=control(PROFILE.bridgeLocal(-77.038057,38.7926676));
