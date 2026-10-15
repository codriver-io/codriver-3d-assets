import {BRIDGE_RING,WEST_PATH,EAST_PATH} from './queensborough-bridge-alignment.js';
import {PROFILE as p,L,edgesAt} from './queensborough-bridge-profile.js';
// OSM bridge outline plus the actual narrow sidewalks and authored road landing ribbons.
function envelope(line){const points=line.map(ll=>p.bridgeLocal(...ll));const left=[],right=[];for(let i=0;i<points.length;i++){const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],len=Math.hypot(b.x-a.x,b.z-a.z)||1,dx=-(b.z-a.z)/len*1.8,dz=(b.x-a.x)/len*1.8;left.push(p.bridgeLngLat(points[i].x+dx,points[i].z+dz));right.push(p.bridgeLngLat(points[i].x-dx,points[i].z-dz));}return [...left,...right.reverse()];}
function roadRing(side){const ss=[0,L,...p.ALIGNMENT.map(v=>v.s)];for(let s=5;s<L;s+=5)ss.push(s);ss.sort((a,b)=>a-b);const edge=(s,i)=>{const q=p.bridgePoint(s,edgesAt(s)[side][i]+(i?1:-1));return p.bridgeLngLat(q.x,q.z);};return [...ss.map(s=>edge(s,0)),...ss.reverse().map(s=>edge(s,1))];}
export const FOOTPRINTS=[BRIDGE_RING,envelope(WEST_PATH),envelope(EAST_PATH),roadRing(0),roadRing(1)];
export const OSM_WAYS=[1022953407,35345045,35487330,24529904,1059628152,37955324,131564205,44385613,37954234,83055711,76097241,89183824,74786953,73147181,37955338];
