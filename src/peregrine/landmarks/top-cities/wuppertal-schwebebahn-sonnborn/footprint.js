import {STATION_RINGS,geographic,point,SUPPORTS,LENGTH} from './wuppertal-schwebebahn-sonnborn-alignment.js';
// Exact station and both indoor elevator parts. No neighbouring street houses are owned.
// g17ar2 provider audit: the continuous white band is the ground-level Sonnborner
// Straße road ribbon (tile way 42562928), not a building extrusion. Keep it and
// the adjacent residential rows; no additional building/roof ways are replaced.
export const OSM_WAYS=[198459753,369505983,369505984];
export const FOOTPRINTS=[...STATION_RINGS];
// Narrow structural corridor and isolated trestle feet; no road surface ownership.
for(let i=1;i<SUPPORTS.length;i++){const a=SUPPORTS[i-1],b=SUPPORTS[i];FOOTPRINTS.push([[a,-3.8],[b,-3.8],[b,3.8],[a,3.8]].map(([s,d])=>{const p=point(s,d);return geographic([p[0],p[2]]);}));}
for(const s of SUPPORTS)for(const d of [-8,8])FOOTPRINTS.push([[-1.3,-1.3],[1.3,-1.3],[1.3,1.3],[-1.3,1.3]].map(([a,b])=>{const p=point(s+a,d+b);return geographic([p[0],p[2]]);}));
