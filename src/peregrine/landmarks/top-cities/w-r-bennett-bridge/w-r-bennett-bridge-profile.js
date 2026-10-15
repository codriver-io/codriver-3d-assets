import {createBridgeProfile} from '../../bridge-profile.js';
import {SPEC,PALETTES} from './config.js';
import {CENTERLINE,WESTBOUND,EASTBOUND,PATH,SERVICE_ROAD_END} from './w-r-bennett-bridge-alignment.js';

// One station/lateral frame for geometry, road replacement, car, route and camera. Station runs
// east-northeast (74.2°) from 75 m west of the west abutment; lateral is positive to the south.
// Local y = 0 is the lake surface and flat-map grade. Sourced: 1060 m length (OSM 1062.9 m), 690 m
// of pontoons (nine, 25 m wide, 60-90 m long), a 44 m navigation span with 18 m clearance on the
// west side, three westbound and two eastbound lanes, shared path on the south side.
export const WIDTH=25,HALF=12.5;
// Carriageway edges measured from the mapped outline and ways: westbound centre -10.6 m and the
// path centre +6.2 m from the eastbound way; the outline runs -17.0..+8.0 m (25 m wide).
export const ROAD_EDGES=[[-12,-.7],[.1,8.1]];
export const MEDIAN=[-.8,.2],PATH_EDGES=[8.6,12],PARAPET=.5;
export const WEST_LAND=75,LANDING=15,EAST_LANDING=20,EXTENSION_E=90;
export const NAV_SPAN=44,NAV_W=373,NAV_E=NAV_W+NAV_SPAN,FIXED_PIERS=7;
export const FLOAT_LENGTH=690,FLOAT_START=NAV_E-6,FLOAT_END=FLOAT_START+FLOAT_LENGTH;
// Nine pontoons summing to 690 m with 0.5 m joints; lengths within the sourced 60-90 m.
export const PONTOON_LENGTHS=[86,74,74,74,74,74,74,74,82],JOINT=.5;
export const PONTOON_TOP=1.6,PONTOON_BOTTOM=-2.9,ROAD_FLOAT=3.2,ROAD_PEAK=21.5;
export const GIRDER_SLAB=.35,FLOAT_SLAB=.8,SLAB_GAP=.25,GIRDER_DEPTH=2.1;

const groundControls=({length})=>[{s:0,sampleS:0},{s:NAV_W,sampleS:NAV_W+22},{s:FLOAT_END,sampleS:FLOAT_END-30},{s:length,sampleS:length}];
const base=createBridgeProfile({...SPEC,width:WIDTH,palette:PALETTES.light,centerline:CENTERLINE,roadEdges:ROAD_EDGES,railGap:0,
 clipStandardEnds:true,ownershipMargin:4,groundControls,lateralBankFit:{blendM:60},profile:({length})=>[[0,'start'],[length,'end']]});
export const L=base.BRIDGE_LENGTH,EAST_LAND=L-EXTENSION_E,EAST_FLAT=L-EAST_LANDING;
export const FIXED_STATIONS=Array.from({length:FIXED_PIERS},(_,i)=>WEST_LAND+(NAV_W-WEST_LAND)*(i+1)/FIXED_PIERS);
export const PONTOONS=(()=>{let s=FLOAT_START;return PONTOON_LENGTHS.map((len,i)=>{const p={index:i+1,start:s,end:s+len};s+=len+JOINT;return p;});})();

// Vertical alignment: constant grades joined by parabolic vertical curves (PVI station, height,
// curve length). The crest PVI is solved so the hump's road crown reads ROAD_PEAK.
function curveProfile(pvis){
 return s=>{
  for(let i=1;i<pvis.length-1;i++){const [c,,len]=pvis[i];if(len&&s>c-len/2&&s<c+len/2){
   const g1=(pvis[i][1]-pvis[i-1][1])/(c-pvis[i-1][0]),g2=(pvis[i+1][1]-pvis[i][1])/(pvis[i+1][0]-c),u=s-(c-len/2);
   return pvis[i][1]-g1*len/2+g1*u+(g2-g1)*u*u/(2*len);}}
  let i=1;while(i<pvis.length-1&&pvis[i][0]<s)i++;const a=pvis[i-1],b=pvis[i];return a[1]+(b[1]-a[1])*(s-a[0])/(b[0]-a[0]);
 };
}
const CREST=395,CREST_CURVE=180,SAG=690;
const pvisFor=y=>[[0,0,0],[LANDING,0,30],[CREST,y,CREST_CURVE],[SAG,ROAD_FLOAT,80],[FLOAT_END,ROAD_FLOAT,50],[EAST_FLAT,0,36],[L,0,0]];
let lo=ROAD_PEAK,hi=ROAD_PEAK+20;for(let k=0;k<60;k++){const m=(lo+hi)/2,f=curveProfile(pvisFor(m));let top=0;for(let s=CREST-90;s<=CREST+90;s+=.5)top=Math.max(top,f(s));if(top<ROAD_PEAK)lo=m;else hi=m;}
export const PVIS=pvisFor((lo+hi)/2);
const roadProfile=curveProfile(PVIS);
export const GRADES=PVIS.slice(1).map((v,i)=>Math.abs((v[1]-PVIS[i][1])/(v[0]-PVIS[i][0])));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// HD approach lifts ('start'/'end') fade out across each land ramp; the lake structure never moves.
export function deckHeight(s,approaches=[0,0]){s=Math.max(0,Math.min(L,s));
 return roadProfile(s)+approaches[0]*(1-smooth((s-LANDING)/(NAV_W-LANDING)))+approaches[1]*(1-smooth((EAST_FLAT-s)/(EAST_FLAT-FLOAT_END)));}
// Steel plate girders carry the fixed spans and the upper ramp over pontoons 1-2 on three-column
// bents about every 19 m; lower down, the deck is a concrete slab on rows of posts (photo: the
// dense column forest at the foot of the hump), and on the floating string the posts are short.
const RAMP_SPACING=19,clearJoint=s=>{for(const p of PONTOONS)if(s>p.end-3&&s<p.end+JOINT+3)return p.end-3;return s;};
export const RAMP_BENTS=(()=>{const out=[];for(let s=NAV_E;roadProfile(s)>9.5;s+=RAMP_SPACING)out.push(clearJoint(s));return out;})();
export const GIRDER_END=RAMP_BENTS.at(-1),EAST_PIER=(FLOAT_END+EAST_LAND)/2;
export const slabDepth=s=>s<GIRDER_END?GIRDER_SLAB:FLOAT_SLAB;
export const soffit=s=>deckHeight(s)-SLAB_GAP-slabDepth(s)-(s<GIRDER_END?GIRDER_DEPTH:0);
// Landing taper: over each land ramp the authored pavement narrows from the rigid deck to 6 m
// ribbons centred on the mapped carriageways (the standard-road width at driving zoom).
export const approachBlend=s=>s<WEST_LAND?smooth((s-LANDING)/(WEST_LAND-LANDING)):s>EAST_LAND?smooth((EAST_FLAT-s)/(EAST_FLAT-EAST_LAND)):1;
const a0=base.ALIGNMENT[0],a1=base.ALIGNMENT.at(-1),tx=(a1.x-a0.x)/L,tz=(a1.z-a0.z)/L;
const frame=ll=>{const p=base.bridgeLocal(...ll),ex=p.x-a0.x,ez=p.z-a0.z;return [ex*tx+ez*tz,-tz*ex+tx*ez];};
const lines=[WESTBOUND,EASTBOUND].map(line=>line.map(frame).sort((a,b)=>a[0]-b[0]));
const lateralOf=(pts,s)=>{let i=1;while(i<pts.length-1&&pts[i][0]<s)i++;const a=pts[i-1],b=pts[i];return a[1]+(b[1]-a[1])*(s-a[0])/(b[0]-a[0]);};
export const carriagewayCentres=s=>lines.map(pts=>lateralOf(pts,s));
export function edgesAt(s){const t=approachBlend(s),c=carriagewayCentres(s);return ROAD_EDGES.map((e,i)=>e.map((v,j)=>(c[i]+(j?3:-3))*(1-t)+v*t));}
// Shared path: on the deck from the west landing, leaving at the east end for the City Park
// underpass (mapped turn ~22 m past the east abutment). 3.4 m on the deck, 0.8 m provider ribbon at the ends.
const pathMapped=PATH.map(frame);
export const PATH_START=0,PATH_END=EAST_LAND+30,PATH_CENTRE=(PATH_EDGES[0]+PATH_EDGES[1])/2;
export const pathCentre=s=>{const mapped=lateralOf(pathMapped,s);return mapped+(PATH_CENTRE-mapped)*Math.min(approachBlend(s),smooth((PATH_END-s)/30));};
export const pathWidth=s=>.8+(PATH_EDGES[1]-PATH_EDGES[0]-.8)*Math.min(smooth(s/45),smooth((PATH_END-s)/45));
export const pathHeight=s=>deckHeight(s)*smooth((PATH_END-s)/30);
// The service road's hook (alignment.js): every provider triangle past its last parallel node, south of
// the deck, is masked by the layer while the bridge is active. Nothing else is drawn in that box.
export const SERVICE_HOOK=(()=>{const q=SERVICE_ROAD_END.map(frame);return {from:q[1][0]+.5,to:q.at(-1)[0]+6,inner:HALF+1.5,outer:q[0][1]+4};})();
export const serviceHookOwns=(s,d)=>s>SERVICE_HOOK.from&&s<SERVICE_HOOK.to&&d>SERVICE_HOOK.inner&&d<SERVICE_HOOK.outer;
const bridgePoint=(s,d=0,y=null)=>base.bridgePoint(s,d,y??deckHeight(s));
const accepted=createBridgeProfile({...base.CHAMPLAIN,roadEdgesAt:edgesAt});
export const PROFILE={...base,bridgePoint,deckHeight,roadEdges:s=>edgesAt(s),fittedLateral:(_s,d)=>d,
 bridgeRoadHeight(lng,lat,heading,approaches){if(accepted.bridgeRoadHeight(lng,lat,heading,approaches)===null)return null;return deckHeight(base.stationAt([lng,lat]),approaches);},
 meshStep:4,knots:[[0,'start'],[LANDING,'start'],[CREST,ROAD_PEAK],[SAG,ROAD_FLOAT],[FLOAT_END,ROAD_FLOAT],[EAST_FLAT,'end'],[L,'end']]};
