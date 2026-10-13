import {ORIGIN,TOWER_HEIGHT,LENGTH,padRing,point,geographic,LANDINGS,landingRing} from './bob-kerrey-pedestrian-bridge-parts.js';
export const SPEC = {
 id:'bob-kerrey-pedestrian-bridge', name:'Bob Kerrey Pedestrian Bridge', kind:'bridge', ready:true,
 origin:ORIGIN, height:TOWER_HEIGHT, padM:300, frontageBearing:84.4,
 terrainPad:{rings:[padRing(0),padRing(LENGTH),...LANDINGS.map(r=>landingRing(r,5.2))],refs:[0,LENGTH].map(s=>{const p=point(s,0);return geographic(p[0],p[2]);}),datum:'median',featherM:5},
};
export const PALETTES = {
 light:{concrete:'#dddcd1',deck:'#babbb5',steel:'#7c8783',cable:'#656f70',rail:'#969f9c',light:'#c3d4d6'},
 dark:{concrete:'#8795a1',deck:'#56636e',steel:'#4c606b',cable:'#8495a4',rail:'#738692',light:'#73bde5'},
};
export const MANIFEST = {
 elevationDatum:'Local y=0 is the exposed support-foot/flat-map grade, not river level or surveyed altitude. Walking deck peaks at 18.288 m; bank-relative ramp heights are photographic estimates. No DEM, sea-level or Mercator stretch is baked in.',
 attribution:'Original procedural geometry for Codriver. Mapped alignment/outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'Current 2008 free-standing pedestrian/cycle crossing: two three-sided pylons, 80 stays, S-shaped deck and western return ramp. AISC 203 ft exposed pylons, 506 ft main span, 24 ft steel frame and 16 ft 4 in panels. Mapped structure 766.16 m; the published 3,000 ft includes landings. Heights, sockets, foundations, railing mesh and support spacing are estimated. Baby Bob extension and surrounding parks are outside ownership. Cityscape/Full 3D world integration not tested yet.',
};
