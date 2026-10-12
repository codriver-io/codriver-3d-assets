// Current 1982 weathering-steel, two-hinge through arch over Lake Austin.
export const SPEC={
 id:'pennybacker-bridge',name:'Pennybacker Bridge (Loop 360)',kind:'bridge',ready: true,
 origin:[-97.797196,30.349475525],height:54.6764,padM:45,frontageBearing:28.9,
 footprintless:true,terrainPolicy:'absolute-deck',rangeM:3200,nearM:1000,
 // Fallback pavement is authored 12 cm below the accepted HD surface.
 // Keep its top above resident terrain where the ramp runs on grade.
 lateralBankFit:{blendM:320,terrainClamp:true,clearanceM:.22},
};
export const PALETTES={
 light:{arch:'#714334',cable:'#969997',concrete:'#b7b5a8',girder:'#654336',asphalt:'#aaada9',rail:'#9b9f99',paint:'#e5e2ca'},
 dark:{arch:'#513e36',cable:'#727f87',concrete:'#747d83',girder:'#453b37',asphalt:'#56616a',rail:'#84949e',paint:'#b4bab5'},
};
export const MANIFEST={
 elevationDatum:'Local metres east/up/south, y=0 flat Cityscape grade. Deck 21.336 m; arch crown 54.6764 m. World selects a separate 150.20544 m lake datum; no terrain, sea level or latitude stretch is baked into GLBs.',
 attribution:'Original procedural geometry; mapped alignment © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photos used only for visual study, no image or imported mesh distributed.',
 note:'TxDOT: 600 ft arch, 87 ft deck, 4×11 ft arch box, 18 groups of four 2.25 in strand hangers, four 12 ft lanes, 6 ft sidewalk, 7 ft floor beams, one north and three south approach spans. Arch rise, deck datum, shoulder placement, approach lengths and minor fittings are visual estimates. Lake datum is LCRA full-pool elevation; runtime terrain verification is documented separately.',
};
