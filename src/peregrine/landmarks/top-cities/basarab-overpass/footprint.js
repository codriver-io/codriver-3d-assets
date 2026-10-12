import { PROFILE as p,L,halfWidth } from './basarab-overpass-profile.js';
import alignment from './basarab-overpass-alignment.js';
// No mapped building/part or bridge outline in the dossier over the railway crossing.
// Authored road corridor; nearby station buildings are deliberately not owned.
const stations=[...new Set([0,...p.ALIGNMENT.map(v=>v.s),...Array.from({length:Math.ceil(L/2)},(_,i)=>i*2),L])].sort((a,b)=>a-b);
const side=d=>stations.map(s=>{const q=p.bridgePoint(s,d*(halfWidth(s)+.8),0);return p.bridgeLngLat(q.x,q.z);});
export const FOOTPRINTS=[[...side(-1),...side(1).reverse()]];
export const OSM_WAYS=alignment.osmWays;
// © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
