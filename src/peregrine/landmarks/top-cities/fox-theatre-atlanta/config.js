// Architectural heights are photographic estimates; plan dimensions are mapped.
export const SPEC = {
 id:'fox-theatre-atlanta', name:'Fox Theatre', kind:'building', ready:true,
 origin:[-84.38556,33.7725], height:32.8, padM:74, frontageBearing:94.3, ownTolM:1,
};
export const PALETTES = {
 light:{stone:'#b3a58a',brick:'#85604e',trim:'#c5b99e',roof:'#72736c',tile:'#92b4ba',glass:'#343d39',red:'#741f27',sign:'#f9d98a'},
 dark:{stone:'#625d53',brick:'#49352d',trim:'#817765',roof:'#454849',tile:'#547278',glass:'#242d30',red:'#631c27',sign:'#ffe4a0'},
};
export const MANIFEST = {
 elevationDatum:'Rigid local flat-map grade y=0; no terrain or absolute altitude baked into geometry.',
 attribution:'Original procedural geometry for Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'1929 Moorish movie palace, present exterior. Footprint and roof positions mapped; heights, minarets, striped masonry, dome lattice and geometry-only FOX lettering estimated from attributed photos. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
