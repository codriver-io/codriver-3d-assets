// Current 1934 white wooden double bascule bridge, closed position.
const ORIGIN = [4.9023731, 52.36358365];
const angle = 17 * Math.PI / 180;
const geo = (s,d) => [ORIGIN[0] + (s*Math.cos(angle)+d*Math.sin(angle))/(111319.49*Math.cos(ORIGIN[1]*Math.PI/180)), ORIGIN[1] - (-s*Math.sin(angle)+d*Math.cos(angle))/111319.49];
const bank = s => [[s-2,-5],[s+2,-5],[s+2,5],[s-2,5]].map(([x,z])=>geo(x,z));
export const SPEC = {
 id:'magere-brug', name:'Magere Brug', kind:'bridge', ready: true,
 origin:ORIGIN, height:11.5, padM:5, frontageBearing:73,
 terrainPad:{rings:[bank(-40),bank(38)],refs:[geo(-40,0),geo(38,0)],datum:'median',featherM:3},
};
export const PALETTES = {
 light:{timber:'#e3e0d3',deck:'#807465',stone:'#9b9990',brick:'#66574d',iron:'#353b39',lamp:'#c6bda0'},
 dark:{timber:'#83919a',deck:'#43484b',stone:'#5b6871',brick:'#434b51',iron:'#252d33',lamp:'#ffe0a0'},
};
export const MANIFEST = {
 elevationDatum:'Local y=0 is the lower exposed support/bank foundation datum; deck at 2.6 m is a photographic clearance estimate, not surveyed river or terrain altitude.',
 attribution:'Original procedural geometry for Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'Current bridge in its closed position, free-standing pedestrian/cycle landmark. OSM crossing 80.96 m and bearing 73 degrees; gantry height, clearances, timber details and light spacing estimated from photos. Bank-only terrain-pad policy awaits independent app integration.',
};
