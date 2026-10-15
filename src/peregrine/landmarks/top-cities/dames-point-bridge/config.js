// Dames Point Bridge (Napoleon Bonaparte Broward Bridge), I-295 East Beltway over the St Johns River,
// Jacksonville, Florida. The 1989 concrete cable-stayed crossing: two H-pylons, harp stays, long approaches.
export const SPEC={id:'dames-point-bridge',name:'Dames Point Bridge',kind:'bridge',ready: true,
 origin:[-81.5569563,30.3847441],height:143.56,padM:1900,frontageBearing:340,
 rangeM:7500,nearM:1900,terrainPolicy:'absolute-deck'};
export const PALETTES={
 light:{tower:'#cfcdc3',concrete:'#c2c1b7',asphalt:'#5a5f63',paint:'#ecebe3',yellow:'#d6b64c',cable:'#e9e9e3',rail:'#9ca4a4',lamp:'#ffe6b4'},
 dark:{tower:'#93a29f',concrete:'#6e7e85',asphalt:'#30393f',paint:'#b9bdbd',yellow:'#b5a35d',cable:'#cfe0d2',rail:'#7f939a',lamp:'#ffbe6c'},
};
export const MANIFEST={
 elevationDatum:'Local y=0 is water / Cityscape grade. Deck surface 55.34 m at mid-channel (53.34 m = 175 ft published clearance plus an estimated 2.0 m deck depth); pylon tops 143.56 m (471 ft, published height). Absolute-deck placement blends the ramps into the DEM at runtime; no terrain, Mercator scale or datum is baked into the GLB.',
 attribution:'Original procedural geometry. Geographic alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'1989 crossing: sourced 396.24 m (1,300 ft) main span, 32.2 m (106 ft) width, 175 ft clearance, 471 ft height, harp stays in multiple vertical planes (main-span pairs stacked vertically, side-span pairs side by side). Estimated: 198.12 m side spans, pylon sections and strut levels (photo-scaled), 18 stay positions per half harp (from the published 21 miles of cable), deck depth, approach span length (48.8 m), pier form, lamp spacing, the crest radius and approach grades. Pylons placed from aerial imagery and the mapped air-gap sensor. The mapped bridge ways are modelled end to end plus 480 m of the north approach embankment (concrete retaining walls, estimated), which keeps the flat-map north grade at 4.5 %.',
};
