// Charles Bridge, Prague: original sandstone pedestrian bridge with its three gateway towers.
import { FOOTPRINTS } from './footprint.js';
export const SPEC={id:'charles-bridge',name:'Charles Bridge',kind:'bridge',ready: true,
 origin:[14.41025,50.08667],height:59,padM:70,frontageBearing:103.8,rangeM:2600,nearM:950,
 // Two bounded bank pads, never a disc excavating the river. Footing integration remains untested.
 terrainPad:{rings:[FOOTPRINTS[1],FOOTPRINTS[2],FOOTPRINTS[4]],refs:[[14.40685,50.087228],[14.413607,50.086173]],datum:'median',featherM:5},
};
export const PALETTES={
 light:{stone:'#837d70',edge:'#9d9482',tower:'#686357',roof:'#363a3c',paving:'#99938a',statue:'#444640',iron:'#343b3a',lamp:'#c1ad82'},
 dark:{stone:'#454b50',edge:'#5a5f60',tower:'#40474b',roof:'#242c32',paving:'#535c62',statue:'#303a40',iron:'#283138',lamp:'#d5b874'},
};
export const MANIFEST={
 elevationDatum:'Local y=0 is an illustrative river/support datum; pedestrian paving and tower bank footings are y=12 m. No altitude or terrain baked in.',
 attribution:'Original procedural mesh by Codriver. Mapped bridge and towers © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Sourced: 515.76 m overall / 9.5 m width / sixteen vaults / thirty statue groups; Old Town tower about 47 m, Lesser Town 43.5 m, Judith 29.3 m above bank. Mapped curved outline retained; arch rises, local deck datum, masonry, ornament and human silhouettes are photographic estimates. Free-standing pedestrian bridge; no road layer. Both app placement modes need separate integration checks.',
};
