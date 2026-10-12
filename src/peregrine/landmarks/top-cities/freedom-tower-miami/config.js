// Freedom Tower, 600 Biscayne Boulevard: original procedural exterior.
export const SPEC = {
 id: 'freedom-tower-miami', name: 'Freedom Tower', kind: 'building', ready: true,
 origin: [-80.189510, 25.780299], height: 78, padM: 42, frontageBearing: 88.67,
};
export const PALETTES = {
 light: { stucco:'#d8be77', stone:'#d7cbb4', roof:'#975c40', glass:'#3b5157', iron:'#4b4c43', copper:'#61847a', lamp:'#d7cbb4' },
 dark: { stucco:'#655f4a', stone:'#7b796e', roof:'#504641', glass:'#283840', iron:'#394047', copper:'#496861', lamp:'#c5a56f' },
};
export const MANIFEST = {
 elevationDatum: 'Rigid building on local flat grade y=0; no absolute altitude or terrain baked in.',
 attribution: 'Original procedural mesh by Codriver. Geographic envelope © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
 note: '1925 Spanish Renaissance Revival exterior. Published 255 ft (78 m) nominal height; mapped plan; photo-estimated storeys and cupola tiers. OSM 84.5 m overall tag conflicts with published height. Orientation is baked once.',
};
