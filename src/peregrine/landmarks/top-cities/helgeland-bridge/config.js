// Current 1991 Fv17 crossing of Leirfjorden.
export const SPEC = {
  id:'helgeland-bridge', name:'Helgeland Bridge', kind:'bridge', ready:true,
  origin:[12.72017,66.038], height:138, padM:1100,
  frontageBearing:167.9, rangeM:6000, nearM:1800,
  terrainPolicy:'absolute-deck',
};
export const PALETTES = {
  light:{tower:'#babbb2',concrete:'#c0c1b8',cable:'#a3adb1',steel:'#78858a',asphalt:'#555d63',paint:'#e8b638',rail:'#a1adb0',lamp:'#f3ead5'},
  dark:{tower:'#657985',concrete:'#6c7e88',cable:'#a5bdca',steel:'#526d7c',asphalt:'#303c47',paint:'#bca45c',rail:'#7d9bab',lamp:'#ffe4b0'},
};
export const MANIFEST = {
  elevationDatum:'Local y=0 is visual water/flat-map grade; tallest crown 138 m, southern crown 127.5 m, main road 46.2–47 m. Published heights are above sea level; no DEM or geographic stretch is baked into geometry. Submerged foundations omitted.',
  attribution:'Original procedural geometry. Mapped alignment and footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note:'Published 1065 m length, 425 m main span, 12 m width, unequal modified-diamond pylons (138/127.5 m). Deck datum/camber, side-span division, cable count/diameters, pylon sections and pier stations are visual estimates. Extra flat-map approach roadway is separate from the structural bridge length.',
};
