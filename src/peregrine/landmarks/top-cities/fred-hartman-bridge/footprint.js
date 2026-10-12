import {PROFILE as p,L,HALF_WIDTH} from './fred-hartman-bridge-profile.js';
// Exact procedural coverage, including inclined tower legs and their small foundations.
// The wider OSM man_made=bridge outline contains unmodelled interchange ramps: not masked.
const ss=[0,...p.ALIGNMENT.map(v=>v.s),L].filter((v,i,a)=>a.indexOf(v)===i);
export const FOOTPRINTS=[[
 ...ss.map(s=>{const q=p.bridgePoint(s,-HALF_WIDTH-3.5,0);return p.bridgeLngLat(q.x,q.z);}),
 ...ss.slice().reverse().map(s=>{const q=p.bridgePoint(s,HALF_WIDTH+3.5,0);return p.bridgeLngLat(q.x,q.z);})
]];
export const OSM_WAYS=[]; // No building/building:part outlines in dossier; roads owned by profile.
