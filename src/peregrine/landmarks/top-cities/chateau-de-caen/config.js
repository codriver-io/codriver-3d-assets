import { OUTER } from './chateau-de-caen-plan.js';
import { BAILEY_LEVEL } from './chateau-de-caen-revisions.js';
import { simplify } from './chateau-de-caen-kit.js';
const geo=([x,z])=>[-.36278+x/(111319.490793*Math.cos(49.18639*Math.PI/180)),49.18639-z/111319.490793];
// Follow the inner enceinte rather than shrinking/decimating the enclosure.
// The boundary runs under the curtain, covering its bailey-side ground edge
// including the narrow Saint-Pierre gate recess; it excludes the outer scarp.
const plateau=simplify(OUTER,.2).map(geo);
// Full 3D world alone: median inner-enceinte grade becomes the bailey datum.
// Keep all parts rigid; grass clears the flattened DEM by .12 m, gravel .195 m.
export const TERRAIN_OFFSET_M=-BAILEY_LEVEL+.2;
export const SPEC={id:'chateau-de-caen',name:'Château de Caen',kind:'building',ready:true,
 origin:[-.36278,49.18639],height:27,padM:210,frontageBearing:150,
 terrainPad:{rings:[plateau],datum:'median',featherM:2},
};
export const PALETTES={
 light:{stone:'#bcb298',trim:'#d0c4a7',course:'#787562',slate:'#34444e',glass:'#303c41',iron:'#4a4c48',modern:'#a89f87',bailey:'#68764d',gravel:'#b0a58b',glow:'#b8ae93'},
 dark:{stone:'#625d52',trim:'#797361',course:'#4c4b44',slate:'#303d49',glass:'#17232c',iron:'#373e44',modern:'#60666b',bailey:'#33452e',gravel:'#665f50',glow:'#aa956a'},
};
export const MANIFEST={
 elevationDatum:'Cityscape keeps local street grade y=0 and the bailey at +8 m; accepted by the lead in app. Full 3D world uses the median inner-enceinte DEM pad, feather 2 m, and rigid terrainOffsets of -7.8 m on every mesh: grass is .12 m above the pad, gravel .195 m. No absolute DEM altitude. World fix awaits lead in-app recheck.',
 attribution:'Original procedural geometry by Codriver. Geographic data © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'Present-day ruined William the Conqueror castle: mapped enceinte, chemise and internal buildings. OSM mapped plans, 10 m curtain above the bailey, estimated 8 m above-grade battered scarp. Towers raised 4 m and projected 2.1–2.5 m following independent review; 15 m mapper height tags are provenance, not the revised street-height measurement. Other heights, roof profiles and ruin dimensions are estimates.',
};
