// Original 2017 ballpark; current Truist identity, surrounding Battery excluded.
export const SPEC = {
 id: 'truist-park', name: 'Truist Park', kind: 'building', ready: true,
 origin: [-84.46778356706986, 33.8907186522273], height: 55, padM: 155, frontageBearing: 335,
};
export const PALETTES = {
 light: {brick:'#825b4b',concrete:'#b4afa2',seat:'#294849',steel:'#596469',roof:'#e4e3db',grass:'#65834b',dirt:'#a47c5c',glow:'#303b3d'},
 dark: {brick:'#51454a',concrete:'#727c83',seat:'#26383f',steel:'#536471',roof:'#9caeba',grass:'#3e5545',dirt:'#66594f',glow:'#3a474b'},
};
export const MANIFEST = {
 elevationDatum:'Local rigid grade y=0; no DEM or absolute elevation baked into the model.',
 attribution:'Original procedural model by Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'MLB field distances 335/400/325 feet; mapped OSM stadium envelope. Tier elevations, 18 cm thin outward-rising canopy with complete underside trusses, brick/dark-glass bays, gate stairs, three full-height outfield lattice lights and steel-framed dark board are photo-based estimates. Aisles use continuous teal tier faces; short home-side canopy lights omitted. Home plate is northwest facing SSE, as mapped. Cityscape and Full 3D world static app evidence in tmp/next-200/fix/g7r/truist-park; lifecycle and terrain stress cases not tested.',
};
