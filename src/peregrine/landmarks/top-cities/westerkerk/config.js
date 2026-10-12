// Westerkerk / Westertoren, permanent restored architecture (temporary scaffolding omitted).
export const SPEC = {
  id: 'westerkerk', name: 'Westerkerk', kind: 'building', ready: false,
  origin: [4.8835355, 52.3745297], height: 87, padM: 65,
  frontageBearing: 272.86, crownHeight: 81, towerMasonryHeight: 40,
};
export const PALETTES = {
  light: { brick: '#775449', stone: '#b5aa96', metal: '#737878', roof: '#484d50', glass: '#657579', recess: '#242b2d', blue: '#245da0', gold: '#c49a49' },
  dark: { brick: '#413c3c', stone: '#817968', metal: '#626b6e', roof: '#323c43', glass: '#384d59', recess: '#182630', blue: '#235183', gold: '#b68d40' },
};
export const MANIFEST = {
  elevationDatum: 'Local pavement y=0, rigid flat foundation; no terrain, latitude stretch or absolute altitude baked in.',
  attribution: 'Original procedural geometry for Codriver. Footprints © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Westertoren 85 m excluding rooster / 87 m including rooster per official church. OSM outlines and tagged 40/52/64/72 m stages; facade profiles, ornament and crown proportions estimated from reference photographs. Rotation baked once; both app placement modes not tested yet.',
};
