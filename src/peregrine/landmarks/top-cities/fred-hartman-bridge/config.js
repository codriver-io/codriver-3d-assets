// The 1995 Houston Ship Channel crossing: two independent decks, double diamonds.
export const SPEC={id:'fred-hartman-bridge',name:'Fred Hartman Bridge',kind:'bridge',ready: true,
 origin:[-95.01688,29.70347],height:134.112,padM:1950,frontageBearing:47,
 rangeM:6500,nearM:1700,terrainPolicy:'absolute-deck'};
export const PALETTES={
 light:{tower:'#c5c8bc',concrete:'#b1b8ad',steel:'#708c86',cable:'#d4c64b',asphalt:'#555d63',paint:'#eceadf',rail:'#9aaba6',lamp:'#fff0cb'},
 dark:{tower:'#87999c',concrete:'#6c8386',steel:'#5c7b82',cable:'#b5b269',asphalt:'#303c47',paint:'#b9bdbe',rail:'#859ca3',lamp:'#ffe0a4'}
};
export const MANIFEST={
 elevationDatum:'Local y=0 is visual sea level / Cityscape grade. Deck surface 57 m; cable-stayed girder soffit 54.8 m; concrete pylon top 134.112 m (440 ft). Absolute-deck placement blends ramps to local DEM; terrain, Mercator scale and moving datum are not baked into the GLB.',
 attribution:'Original procedural geometry. Geographic alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'1995 crossing: 381 m main span, twin 23.7744 m (78 ft) decks, 1.2192 m (4 ft) gap, 192 yellow fan stays, four open diamond towers. 754.38 m five-span cable unit; 186.69 m combined side spans on each bank. 134.112 m crown is the commonly cited 440 ft, versus UT Ridd 132.893 m (436 ft). Deck datum, individual side-span split, pylon sections, anchor levels and approach supports estimated. Model covers mapped approach roads, not the entire 4.185 km highway project.'
};
