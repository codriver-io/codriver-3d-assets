import { OUTER } from './chateau-de-caen-plan.js';
import { BAILEY_LEVEL } from './chateau-de-caen-revisions.js';
import { simplify } from './chateau-de-caen-kit.js';
const geo=([x,z])=>[-.36278+x/(111319.490793*Math.cos(49.18639*Math.PI/180)),49.18639-z/111319.490793];
// Follow the inner enceinte rather than shrinking/decimating the enclosure.
// The boundary runs under the curtain, covering its bailey-side ground edge
// including the narrow Saint-Pierre gate recess; it excludes the outer scarp.
const refs=simplify(OUTER,.2).map(geo);
// A 30 m terrain lattice needs its boundary vertices on the bailey datum too.
// Convex support halo covers one cell beyond the curtain; original surveyed
// references preserve the elevation and avoid sampling the downhill streets.
const points=OUTER.flatMap(([x,z])=>[[-30,-30],[-30,30],[30,-30],[30,30]].map(([dx,dz])=>[x+dx,z+dz])).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const half=ps=>{const h=[];for(const p of ps){while(h.length>1&&cross(h.at(-2),h.at(-1),p)<=0)h.pop();h.push(p);}return h.slice(0,-1);};
const plateau=[...half(points),...half([...points].reverse())].map(geo);
// Full 3D world alone: median inner-enceinte grade becomes the bailey datum.
// Keep all parts rigid; grass clears the flattened DEM by .12 m, gravel .195 m.
export const TERRAIN_OFFSET_M=-BAILEY_LEVEL+.2;
export const SPEC={id:'chateau-de-caen',name:'Château de Caen',kind:'building',ready:true,
 origin:[-.36278,49.18639],height:27,padM:210,frontageBearing:150,
 terrainPad:{rings:[plateau],refs,datum:'median',featherM:2},
};
export const PALETTES={
 light:{stone:'#bcb298',trim:'#d0c4a7',course:'#787562',slate:'#34444e',glass:'#303c41',iron:'#4a4c48',modern:'#a89f87',modernFrame:'#a89f87',bailey:'#68764d',gravel:'#b0a58b',glow:'#b8ae93'},
 dark:{stone:'#625d52',trim:'#797361',course:'#4c4b44',slate:'#303d49',glass:'#17232c',iron:'#373e44',modern:'#60666b',modernFrame:'#60666b',bailey:'#33452e',gravel:'#665f50',glow:'#aa956a'},
};
export const MANIFEST={
 elevationDatum:'Cityscape keeps local street grade y=0 and the bailey at +8 m; accepted by the lead in app. Full 3D world uses the median inner-enceinte DEM pad, feather 2 m, and rigid terrainOffsets of -7.8 m on every mesh: grass is .12 m above the pad, gravel .195 m. No absolute DEM altitude. A bounded one-cell terrain support halo keeps coarse grid triangles below the bailey; original inner-enceinte references preserve its median datum. Mode verification is documented separately.',
 attribution:'Original procedural geometry by Codriver. Geographic data © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'Present-day ruined William the Conqueror castle: mapped enceinte, chemise and internal buildings. OSM mapped plans, 10 m curtain above the bailey, estimated 8 m above-grade battered scarp. Towers raised 4 m and projected 2.1–2.5 m following independent review; 15 m mapper height tags are provenance, not the revised street-height measurement. Porte des Champs retains its photo-estimated roof over the portal and paired towers; Saint-Pierre remains unroofed. Other heights, roof profiles and ruin dimensions are estimates.',
};
