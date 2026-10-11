// Suncor Energy Centre (formerly Petro-Canada Centre), 150 6 Avenue SW, Calgary: WZMH Architects, 1984.
// Two red-granite and dark-glass towers, 215 m (west) and 130 m (east), each capped by one sloping plane.
// Heights: Wikipedia / CTBUH 215 m for the west tower, OSM height=130 for the east. Plans: OSM ways
// 505391964, 127741493, 127741496. Everything else is documented, with its confidence, in
// docs/3d-calgary-suncor-energy-centre.md.
export const SPEC = {
  id: 'suncor-energy-centre', name: 'Suncor Energy Centre', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // About the middle of the complex: the west tower's centroid is 42 m west of it, the east tower's 32 m east.
  origin: [-114.0639, 51.04803],
  height: 215, // m: the north edge of the west tower's roof
  padM: 75,    // just covers the farthest mapped corner (the west tower's west corner, 69 m out; the south wing, 55 m)
  frontageBearing: 180, // the 6 Avenue frontage faces south; the towers' diagonal faces are at 48 and 228 degrees
};

// The sunlit colour of each material; the runtime layer shades every face from its normal (0.66 to 1.0 of it).
// Granite is the brick-maroon of the photographs under a blue sky, windows blue-black glass. `glow` is the
// share of windows lit at night: a dim glass colour by day, warm office light after dark.
export const PALETTES = {
  light: { granite: '#7f4a40', glass: '#2b3440', glow: '#2f3946', roof: '#3b2d29' },
  dark: { granite: '#6a4a41', glass: '#1d1514', glow: '#ffc67a', roof: '#2d2625' },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. Below-grade levels and the plazas are not modelled.',
  attribution: 'Original procedural mesh. Mapped footprints and heights © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'The two tower plans, the 215 m and 130 m roof heights and the low block between the towers follow OSM; the slope and direction of the roof planes, floor pitch, window size, lobby heights, granite tone and the heights of the low block and its wing are estimated from photographs. The glazed canopies beside the towers and the plazas are not modelled.',
};
