// Washington Monument, 2 15th Street NW, National Mall, Washington, D.C.
// Robert Mills, completed 1884 by Lt. Col. Thomas Lincoln Casey (U.S. Army Corps of Engineers)
// as an unadorned Egyptian obelisk. The only entrance is the centre of the east face.
// Faces are cardinal (the mapped outline is within 0.2° of north). See
// docs/3d-top-cities-washington-monument.md.
const FT = 0.3048;
const IN = 0.0254;

export const SPEC = {
  id: 'washington-monument',
  name: 'Washington Monument',
  kind: 'building',
  ready: true,
  // Centroid of the obelisk corners on OSM way 766761337 (the shaft, not the east lobby).
  origin: [-77.0352426, 38.8894753],
  // 555 ft 5⅛ in, the National Park Service / Casey 1884 height, to the aluminium apex.
  // NGS 2014 measured 554 ft 7¹¹⁄₃₂ in (169.046 m) from a raised 1975 entrance datum.
  height: (555 + 5.125 / 12) * FT,
  padM: 18, // the level circular plaza; the shaft is 16.8 m square
  frontageBearing: 90, // the east face, the only entrance, faces true east
  baseM: (55 + 1.5 / 12) * FT, // 55 ft 1½ in, HAER
  shaftTopM: (34 + 5.625 / 12) * FT, // 34 ft 5⅝ in at the 500 ft level
  shaftM: 500 * FT,
  jointM: 150 * FT, // colour change where work stopped in 1854 (HAER / DC historic district; NRHP says 152 ft)
  jointBandM: 2 * FT, // one course of the third marble at that line
  aluminumM: 8.9 * IN, // Frishmuth apex, 1884
  aluminumBaseM: 5.6 * IN,
  doorWM: 6 * FT, // HAER opening; the leaf itself was reduced to 5 ft 8 in in 1885
  doorHM: 8 * FT,
  winWM: 3 * FT,
  winGapM: 4 * FT, // inner stone edge to inner edge
  winSillM: 504 * FT, // just above the lowest pyramidion course
  winHM: 18 * IN, // north, south, west
  winHEastM: 24 * IN, // east, the taller pair
};

export const PALETTES = {
  light: {
    marble_lower: '#b7b4ac', // grayer Maryland marble of the 1848–1854 courses
    marble_joint: '#a39f96', // the third marble, one course at the stop line
    marble_upper: '#eceae3', // paler marble of the 1879–1884 completion, and the pyramidion
    bronze: '#3a322c', // bronze gates set back in the east doorway
    glow: '#2a3338', // observation glass, dark by day
    lamp: '#8e2e2e', // eight red aircraft beacons, two per face, unshaded
    aluminum: '#d5d8dc', // the cast apex
    glass: '#5a656c', // dark glass of the east screening lobby
    roof: '#1e2327', // its flat dark roof
  },
  dark: {
    // Floodlit at night: the shaft stays bright, the 150 ft line still reads, windows warm, beacons red.
    marble_lower: '#d2cfc6',
    marble_joint: '#c0bbb0',
    marble_upper: '#f4f2ec',
    bronze: '#241e1a',
    glow: '#e4d2a4',
    lamp: '#ff4436',
    aluminum: '#c8ced4',
    glass: '#2c363c',
    roof: '#14181c',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat circular plaza. No absolute altitude and no terrain is baked in. The grassy knoll beyond the plaza is not modelled.',
  attribution: 'Original procedural mesh. Mapped obelisk and east lobby © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Height, shaft, base, pyramidion, colour line, door and the eight windows are published (NPS, HAER, NRHP). The aluminium apex is the 1884 cap. The east lobby height (4 m) and the exact width of the third-marble course are estimated. Flags, lightning rods, the circular plaza and the interior are not modelled.',
};
