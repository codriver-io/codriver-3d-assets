// Present-day hotel; model heights are photo estimates, plan from OSM.
export const SPEC = {
 id:'mission-inn',name:'Mission Inn',kind:'building',ready:true,
 origin:[-117.37293,33.9831],height:32.6,padM:90,frontageBearing:209,ownTolM:1.2,
};
export const PALETTES = {
 light:{stone:'#bdb29b',trim:'#e1d6be',roof:'#813c2a',glass:'#344b4f',wood:'#683728',iron:'#393c35',glow:'#738073',tile:'#384c7c',masonry:'#805342'},
 dark:{stone:'#535d60',trim:'#7a8078',roof:'#473932',glass:'#253f48',wood:'#493b36',iron:'#2b3438',glow:'#e6b16a',tile:'#354b65',masonry:'#564745'},
};
export const MANIFEST = {
 elevationDatum:'Local street grade y=0; rigid hotel foundation, no terrain or altitude baked in.',
 attribution:'Original procedural geometry for Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Mapped outline and 119°/29° plan bearing; all heights, tower locations, courtyard sizes and facade counts estimated from attributed photographs. Annex and seasonal decorations omitted. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
