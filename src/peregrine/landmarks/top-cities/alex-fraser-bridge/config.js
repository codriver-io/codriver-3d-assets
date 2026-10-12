// Current seven-lane crossing (1986 structure; 2019 movable median configuration).
export const SPEC = {
  id: 'alex-fraser-bridge', name: 'Alex Fraser Bridge', kind: 'bridge', ready: true,
  origin: [-122.943, 49.1598], height: 154, padM: 1600,
  frontageBearing: 164.9, rangeM: 7500, nearM: 1900,
  footprintless: true, terrainPolicy: 'absolute-deck',
};
export const PALETTES = {
  light: { tower:'#c8c9bb', concrete:'#b5b9ae', steel:'#737e7e', cable:'#bac0b6', asphalt:'#555d63', paint:'#eceadf', rail:'#a9b2ae', lamp:'#fff0cf' },
  dark: { tower:'#82959b', concrete:'#657982', steel:'#4e6875', cable:'#a2bbc5', asphalt:'#303c47', paint:'#b9bdbe', rail:'#7c98a5', lamp:'#ffe2a8' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the visual water/pile-cap/flat-map grade. Deck top 60 m, soffit 57 m, concrete tower crown 154 m. No DEM, Mercator stretch or scene-origin offset baked into the asset; absolute-deck runtime fits foundations and approach ends to terrain.',
  attribution: 'Original procedural geometry. Alignment © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published main span 465 m, deck width 32 m, crown 154 m, clearance 57 m and overall bridge 2525 m. Estimated 182.75 m back spans, H crossbeam heights, shaft sections, 144 representative stays, seven-lane stripe widths, girders, lamp and approach support spacing. Full-length mapped curved approach alignment; the first/last 100 m taper to mapped road connections, with provider width and pavement colour fitted locally; the main 32 m deck stays rigid. Flat ramps are a map convention. Reversible lane is shown in one static 4/3 configuration.',
};
