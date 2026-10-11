// Ghirardelli Square, 900 North Point Street, Fisherman's Wharf, San Francisco: the former Ghirardelli
// chocolate factory (Pioneer Woolen Mill 1862; Cocoa 1900; Chocolate and Mustard 1911; Power House 1915;
// Clock Tower and Apartment House 1916), recycled in 1964 by Lawrence Halprin and Wurster, Bernardi &
// Emmons. See docs/3d-san-francisco-ghirardelli-square.md.
//
// Origin: the area-weighted centroid of the seventeen OSM building ways in footprint.js (the complex in
// the block between Beach, Larkin, North Point and Polk Streets). Local +x east, +y up, +z south.
// The buildings are authored on the street grid, which OSM maps at bearing 80.6 deg (u) / 170.6 deg (v):
// 9.4 deg anticlockwise of east/south. The old Woolen Mill block is mapped 14.1 deg off that grid.
export const SPEC = {
  id: 'ghirardelli-square', name: 'Ghirardelli Square', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-01)
  origin: [-122.4230036, 37.8058609],
  height: 34.5, // clock tower finial (estimated; "over 100 ft"); the sign top is 30.6 m
  padM: 80, // the mapped complex spans 134 m x 102 m
  frontageBearing: 350.6, // the plaza, the Mustard / Cocoa range and the sign face the bay (north, 9.4 deg west)
  gridDeg: 9.4, millDeg: -4.7, // authoring grids, degrees anticlockwise of east (Y up)
  signWidthM: 46.3, signHeightM: 5.8, // 152 ft x 19 ft
};
export const PALETTES = {
  light: {
    brick: '#a65a43', trim: '#e5dbc4', glass: '#47535b', light: '#5c6a71', roofTile: '#7f4535', slate: '#6e757c',
    roof: '#4b4e51', sign: '#f2ebd5', steel: '#8d9699', gold: '#c99f3b', glow: '#e9e0c7',
  },
  dark: {
    brick: '#6b4136', trim: '#9d9686', glass: '#1b252c', light: '#f3c570', roofTile: '#5a342c', slate: '#3b4249',
    roof: '#2d3033', sign: '#fff4d2', steel: '#576167', gold: '#8e7029', glow: '#ffeaa9',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The real site climbs about 10 m from Beach St to North Point St in terraces; every building is rigid on y=0 and the terraces are not modelled.',
  attribution: 'Original procedural mesh. Mapped footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'The sign size (152 ft x 19 ft), the OSM outlines, Cocoa and Chocolate heights (22 m) are sourced. Storey and cornice heights, the Mustard, Clock Tower Building and Woolen Mill heights (OSM gives 10 m), the clock tower height (over 100 ft: modelled 34.5 m), roof forms, window counts and the sign scaffold are estimated from photographs.',
};
