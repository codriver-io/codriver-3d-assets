// Sharp Centre for Design, OCAD University, 100 McCaul Street, Toronto: Will Alsop's
// 2004 "tabletop" (84 x 31 x 9 m) on twelve coloured steel legs, above the 1921-1981
// Main Building. Sources and estimates are in docs/3d-toronto-sharp-centre-for-design.md.
//
// Frame: real metres, +X east, +Y up, +Z south, origin = centroid of the tabletop's
// mapped outline (OSM way 27616814), y = 0 the local flat-map grade. The tabletop's
// long axis runs 163.1 deg (SSE, Toronto's street grid), so the east long wall faces
// McCaul Street at 73.1 deg true.
export const SPEC = {
  id: 'sharp-centre-for-design', name: 'Sharp Centre for Design', kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: [-79.3911837, 43.652956],
  // Highest point: the tabletop's roof is 35 m (26 m clear underside + 9 m box); the roof
  // plant enclosure seen above the parapet in photographs adds ~3.6 m (estimated).
  height: 38.6,
  // The model reaches the north end of the Main Building, 100 m from the anchor.
  padM: 105,
  frontageBearing: 73,
  axisBearing: 163.1376, // long axis of the tabletop, degrees clockwise from north
};

export const PALETTES = {
  light: {
    panel_white: '#f5f2e9', panel_black: '#1c1e21', glass: '#9bbfd6', glow: '#c2d9e6', roof: '#cfcfca',
    brick: '#8f463a', brick_pale: '#d9cba3', roof_dark: '#4f5a55',
    band_orange: '#ee6a2c', band_blue: '#2b8fd2', band_pink: '#d8528f',
    leg_black: '#1d1e22', leg_blue: '#1c74c9', leg_yellow: '#f1b912', leg_white: '#eae7df',
    leg_purple: '#5d2a88', leg_maroon: '#7b202c', slab_red: '#d9361f', concrete: '#a8a79f',
  },
  dark: {
    panel_white: '#8f959c', panel_black: '#121417', glass: '#2e4352', glow: '#f7e3b2', roof: '#6d757c',
    brick: '#5d3b37', brick_pale: '#8c8168', roof_dark: '#2f3b3c',
    band_orange: '#b25628', band_blue: '#25617f', band_pink: '#8f3868',
    leg_black: '#121418', leg_blue: '#1d5088', leg_yellow: '#a98517', leg_white: '#a5a9ad',
    leg_purple: '#3e2761', leg_maroon: '#531b25', slab_red: '#932a1e', concrete: '#6c747b',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The tabletop underside is 26 m above that grade.',
  attribution: 'Original procedural mesh. Mapped footprint and placement © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Tabletop 84 x 31 x 9 m with its underside 26 m above grade and twelve 28 m legs are published figures. Estimated: the pixel pattern (a seeded pseudo-random layout with photo-measured density and module), leg plan positions and colours, the red stair slab route, the Main Building block heights and brick split, the two black cores beyond their mapped outlines, the roof plant enclosure and all window rhythm.',
};
