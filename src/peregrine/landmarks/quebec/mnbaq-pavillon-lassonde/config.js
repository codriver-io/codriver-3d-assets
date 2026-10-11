// Pavillon Pierre-Lassonde of the Musée national des beaux-arts du Québec, 179 Grande Allée Ouest, Québec. OMA (Shohei Shigematsu) with
// Provencher_Roy, opened 24 June 2016. Original procedural model; sources, the dimension table and what is estimated are in
// docs/3d-quebec-mnbaq-pavillon-lassonde.md. Contract: docs/3d-quebec-landmarks.md.
//
// SOURCED: OMA's design (reported by Archello/ArchDaily/Area, fr.wikipedia "Pavillon Pierre Lassonde"): three stacked glass-and-steel volumes
//   of decreasing size, temporary exhibitions 50 x 50 m, permanent collections 45 x 35 m, design and Inuit art 42.5 x 25 m, each shifted toward
//   Grande Allée so that the top one cantilevers over an urban plaza (OMA: 26.5 m); a Grand Hall 26.5 m wide and 12.5 m high facing the
//   street; a glazed stair hung on a side facade; green roofs and terraces on the lower roofs; a triple-layer glass skin (printed frit that
//   mimics the truss, embossed glass, diffuser glass); 14 900 m2.
// MAPPED (OSM way 487158604, 4 201 m2, read 2026-10-04): the whole plan is an orthogonal staircase on the 139.3 degree street grid. Its
//   NW end (Grande Allée) is 25.3 m wide, then the plan steps out to 40.8 m at 21 m and to 58.2 m at 41 m, and runs 91.9 m to the park.
//   Those widths and lengths reproduce OMA's three boxes (42.5 x 25.3, 46.3 x 36.3, 50.9 x 53.7), which is how the stack is placed.
// ESTIMATED (photographs, see the doc): every height (podium 5 m, first roof 8.5 m, second roof 13 m, top box 26.5 m, gold lantern 29.6 m),
//   the stair's slope, the bay rhythm, the truss pattern and the colours.
//
// Origin: area centroid of the OSM outline. Rotation baked once: the long walls run 139.3 degrees (SW face 67.7 and 24.1 m at 139.0 / 140.0,
//   NE faces 51.0 m at 139.0), the end walls 49.3 / 229.3; the street front (the top box's NW end, 25 m wide, parallel to Grande Allée's
//   50.4 degree axis) looks toward bearing 319.3.
//
// Full 3D world (ADR-0045): terrainPad declared. A public Terrarium DEM tile (z15, 4 m grid over the outline, sampled 2026-10-04) reads
// 91.9 to 94.2 m under the plan, 93.0 m median, the street end about 1 m above the median and the park end about 0.6 m below it. The default
// disc takes the lowest sample and would sink the street plaza about 2 m; the pad holds the outline at the median and feathers back.
import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'mnbaq-pavillon-lassonde', name: "Pavillon Pierre-Lassonde (MNBAQ)", kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: [-71.224914, 46.8007043], // area centroid of OSM way 487158604
  height: 29.6, // m to the top of the gold lantern on the top box (estimated; top box roof 26.5 m)
  padM: 75, // unused while terrainPad is set; covers the 92 m plan (farthest vertex 52 m from the origin)
  frontageBearing: 319.3, // the street end faces Grande Allée to the north-west
  rotationDeg: 139.3, // bearing of the long axis (a), baked into the geometry once
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 10 }, // Full 3D world only; Cityscape is flat and ignores it
};

// Light is day, dark is night. Same keys in both. `glow` (the diffuser glass of the top box, the lit bands) and `light` (the lit hall and floors
// seen through the clear glass) are drawn unshaded, so each is a sensible day colour: pale frosted glass, and glass that reflects the sky.
export const PALETTES = {
  light: {
    frit: '#c6d3d9', glow: '#e1e9ec', glass: '#59727f', light: '#627c8a', soffit: '#6d665f',
    steel: '#56626a', gold: '#cdb07a', green: '#6d8a55', concrete: '#bbb8b0',
  },
  dark: {
    frit: '#6c7b85', glow: '#fff0d4', glass: '#1d2a31', light: '#ffd18a', soffit: '#86837d',
    steel: '#1f282d', gold: '#7d6b43', green: '#2a3828', concrete: '#5f615d',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the plaza and ground-floor level on Grande Allée (about 93 m above sea level, the median of a public DEM over the outline; the plan falls about 2 m toward the park, which the rigid base does not follow). Ground-floor glazing to 5 m, first roof 8.5 m, second roof 13 m, top box roof 26.5 m, lantern 29.6 m.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan, orientation and the three stepped volumes are mapped from OSM way 487158604 and matched to OMA\'s published box sizes (50 x 50, 45 x 35, 42.5 x 25 m); the hall height (12.5 m) and the cantilever over the plaza are sourced. Every height other than the hall, the stair slope, the truss/bay pattern, the roof terraces and the colours are estimated from photographs. The neighbouring Église Saint-Dominique and its presbytery (way 389475849), the older pavilions and the sculpture garden are not modelled. See docs/3d-quebec-mnbaq-pavillon-lassonde.md.',
};
