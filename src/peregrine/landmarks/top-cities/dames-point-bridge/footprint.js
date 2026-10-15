import {PROFILE as p,L,TOWERS,MID} from './dames-point-bridge-profile.js';
// Exact procedural coverage: the deck corridor, widened round the pylon pile caps and the
// ship-impact dolphins. No building/building:part outline is mapped; the roads are owned by the profile.
const ss=[0,...p.ALIGNMENT.map(v=>v.s),...TOWERS.flatMap(t=>[t-90,t-60,t+60,t+90]),L].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
const half=(s,sd)=>{const near=TOWERS.some(t=>Math.abs(s-t)<=60);return near?(sd>0?60:30):23;};
// The two end edges sit 3 m beyond the landings so the deck's own end vertices are strictly inside.
const at=(s,d)=>{const q=p.bridgePoint(s,d,0),o=s<=0?-3:s>=L?3:0;return p.bridgeLngLat(q.x+q.tx*o,q.z+q.tz*o);};
const ring=[...ss.map(s=>at(s,-half(s,-1))),...ss.slice().reverse().map(s=>at(s,half(s,1)))];
// The ring starts at the vertex nearest mid-channel, the model's anchor.
const first=ss.findIndex(s=>s>=MID);
export const FOOTPRINTS=[[...ring.slice(first),...ring.slice(0,first)]];
export const OSM_WAYS=[];
