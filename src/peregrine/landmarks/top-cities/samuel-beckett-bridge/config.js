// Original model of the 2009 Calatrava cable-stayed swing bridge, closed position.
export const SPEC = { id:'samuel-beckett-bridge', name:'Samuel Beckett Bridge', kind:'bridge',
  ready: true, origin:[-6.2413,53.347], height:48, padM:110, frontageBearing:6.3,
  terrainPolicy:'bank-fit' };
export const PALETTES = {
 light:{rib:'#d4d8d5',deck:'#d4d8d5',rail:'#bdc5c3',tower:'#e8e8df',cable:'#aeb8b8',steel:'#d4d8d5',concrete:'#a5aaa5',asphalt:'#555b60',paint:'#e8e7df',lamp:'#fff1ce'},
 dark:{rib:'#85969f',deck:'#85969f',rail:'#7f919a',tower:'#c0ccd0',cable:'#7d959f',steel:'#85969f',concrete:'#66777e',asphalt:'#303b43',paint:'#b2bdc0',lamp:'#ffdfa1'}
};
export const MANIFEST = {
 elevationDatum:'Local foundation grade y=0; flat deck 1.6 m estimated above quay grade, pylon apex 48 m. No DEM or sea-level datum baked in.',
 attribution:'Original procedural geometry. Geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Architect: 124 m length, 27 m width, pier 28 m from south, 46 m apex and 5.6 m deck ASL; popular 48 m height has a differing water datum. 48 m local apex is a visual approximation. Pylon curves, opening, stay placement, underside and quay-relative deck height estimated from photos.'
};
