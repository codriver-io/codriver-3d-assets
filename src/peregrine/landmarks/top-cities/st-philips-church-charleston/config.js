import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
 id:'st-philips-church-charleston', name:"St. Philip's Church", kind:'building', ready:true,
 origin:[-79.929218,32.779012], height:56, padM:28, frontageBearing:267.14, rotation:2.86*Math.PI/180,
 terrainPad:{rings:FOOTPRINTS.slice(0,1),refs:[[-79.9294765,32.7789502],[-79.9294414,32.7791286],[-79.9289914,32.778932]],datum:'median',featherM:2},
};
export const PALETTES={
 light:{plaster:'#c8ae8a',trim:'#d4bc96',roof:'#675d52',glass:'#566063',shadow:'#323a36',gold:'#bca45c'},
 dark:{plaster:'#978b75',trim:'#a69a80',roof:'#403e3c',glass:'#35434a',shadow:'#222e31',gold:'#a38a4a'},
};
export const MANIFEST={
 elevationDatum:'Rigid local pavement y=0; no sea level, terrain or Mercator scale baked in.',
 attribution:'Original procedural geometry for Codriver. Mapped outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Present church completed 1838 per parish; nomination dates body 1835–36 and White steeple 1848–50. OSM upper tower height 56 m is adopted as an estimated overall height, not a survey. Single tall window tier, three tetrastyle Tuscan porticoes, square oculus stage, tapering octagons, clocks, open belfry and long brown spire. All vertical stage splits, openings and relief estimated. Yaw baked once. Cityscape: not tested; Full 3D world: not tested.',
};
