// Original model of the 2008 Jerusalem light-rail/pedestrian bridge.
export const SPEC={id:'chords-bridge',name:'Chords Bridge',kind:'bridge',ready:true,
 origin:[35.2,31.789],height:118,padM:220,frontageBearing:10,footprintless:true,
 // Free-standing tram bridge: deliberately no vehicle road layer.
};
export const PALETTES={light:{tower:'#e4e5dd',deck:'#dadfdc',bed:'#7c8584',walk:'#b7c9c7',rail:'#899492',cable:'#b5c0bc',glass:'#91b7b7',fittings:'#d4dcd8',stone:'#c5baa5',lamp:'#e1e7dc'},
 dark:{tower:'#a5b7c2',deck:'#869daa',bed:'#37474d',walk:'#657c84',rail:'#a3b4be',cable:'#829da9',glass:'#466873',fittings:'#93aab6',stone:'#77858b',lamp:'#ffe5ac'}};
export const MANIFEST={elevationDatum:'Local flat grade y=0; deck nominally 7 m above grade, an estimate; no DEM/ASL baked in.',
 attribution:'Original procedural geometry. Placement derived from © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
 note:'118 m mast and 66 stays; 360 m approach-inclusive deck, 14.82 m width. Section, mast lean, attachment distribution and ramp extensions estimated; not vehicle-fitted.'};
