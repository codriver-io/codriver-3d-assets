import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import map from './louise-bridge-calgary-alignment.js';
export const DECK_H=7.2, WIDTH=19.6, SPRING=1, RISE=4.7;
const centerline=[...map.south.slice(1).reverse(),...map.bridge,...map.north.slice(1)];
const seed=createBridgeProfile({...SPEC,width:52,roadEdges:[[-7.1,0],[0,7.1]],centerline,profile:({length})=>[[0,0],[length,0]]});
export const A=seed.stationAt(map.bridge[0]),Z=seed.stationAt(map.bridge.at(-1)),L=seed.BRIDGE_LENGTH;
export const PIERS=Array.from({length:6},(_,i)=>A+(Z-A)*i/5);
export const ARCHES=PIERS.slice(0,-1).map((s,i)=>({a:s+1.5,z:PIERS[i+1]-1.5,mid:(s+PIERS[i+1])/2}));
const smooth=t=>t*t*(3-2*t);
export const blend=s=>s<A?1-smooth(Math.max(0,s/A)):s>Z?smooth(Math.min(1,(s-Z)/(L-Z))):0;
const branches=map.southBranches.map(line=>line.map(ll=>seed.bridgeLocal(...ll)));
function cross(line,s){
 const q=seed.bridgePoint(s,0,0),hits=[];
 for(let i=1;i<line.length;i++){
  const a=line[i-1],b=line[i],u=(a.x-q.x)*q.tx+(a.z-q.z)*q.tz,v=(b.x-q.x)*q.tx+(b.z-q.z)*q.tz;
  if(u*v>0||Math.abs(v-u)<1e-9)continue;
  const t=-u/(v-u);hits.push(-q.tz*(a.x+(b.x-a.x)*t-q.x)+q.tx*(a.z+(b.z-a.z)*t-q.z));
 }
 return hits.sort((a,b)=>Math.abs(a)-Math.abs(b))[0];
}
export function edgesAt(s){
 if(s>=A)return [[-7.1,0],[0,7.1]];
 const t=blend(s),centres=branches.map(line=>cross(line,s)).sort((a,b)=>a-b);
 if(centres.some(v=>v===undefined))return [[-7.1,0],[0,7.1]];
 // At the mapped fork, split the four-lane surface into two two-lane ribbons.
 const fork=A-32.6,f=1-smooth(Math.min(1,Math.max(0,s/fork)));
 return [[-7.1,0],[0,7.1]].map((edge,i)=>{
  const c=centres[i];return edge.map((v,k)=>v+(c+(k?3.45:-3.45)-v)*f);
 });
}
const base=createBridgeProfile({...SPEC,width:52,palette:PALETTES.light,centerline,
 roadEdges:[[-7.1,0],[0,7.1]],roadEdgesAt:edgesAt,terrainPolicy:'bank-fit',clipStandardEnds:true,
 groundControls:()=>[{s:0,sampleS:0},{s:A,sampleS:A},{s:Z,sampleS:Z},{s:L,sampleS:L}],
 profile:()=>[[0,'start'],[A,DECK_H],[Z,DECK_H],[L,'end']],
});
// The shared road fitter can opt into exactly mapped, ground-level approach pavement/paint.
const approachLines=[{line:map.north,width:7.1},...map.southBranches.map(line=>({line,width:3.45}))];
function groundApproachAt(x,z){
 const station=base.projectBridge(x,z);if(station.beyond||(station.s>=A&&station.s<=Z))return null;
 let best=null;
 for(const {line,width} of approachLines)for(let i=1;i<line.length;i++){
  const a=base.bridgeLocal(...line[i-1]),b=base.bridgeLocal(...line[i]),dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
  const t=((x-a.x)*dx+(z-a.z)*dz)/(len*len);if(t<0||t>1)continue;
  const distance=Math.hypot(x-a.x-t*dx,z-a.z-t*dz),halfWidth=i===1&&line!==map.north?7.1:width;
  if(distance<=halfWidth+.15&&(!best||distance<best.distance))best={tx:dx/len,tz:dz/len,halfWidth,distance};
 }
 return best;
}
// Rigid river spans; fit only approach ribbons to live carriageway edges.
export const PROFILE={...base,meshStep:2,groundApproachAt,fittedLateral(s,d,joins,sections){return s>=A&&s<=Z?d:base.fittedLateral(s,d,joins,sections);}};
export const point=(s,d=0,y=PROFILE.deckHeight(s))=>{const q=PROFILE.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
