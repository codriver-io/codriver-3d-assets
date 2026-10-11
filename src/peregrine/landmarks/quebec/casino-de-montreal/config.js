// Casino de Montréal, 1 avenue du Casino, île Notre-Dame, Montréal. It occupies two Expo 67 pavilions: the Pavillon de la
// France (Jean Faugeron, 1967: a drum of flared and vertical aluminium ribs round a glazed lantern, a cascade of terraces
// with a mast on one side and a stack of concrete shafts on the other), converted to a casino in 1993 (Faugeron and André
// Blouin), and the Pavillon du Québec beside it (a leaning gold-glass box, joined to the casino in the 2013-2017
// expansion). A newer low block links the two.
//
// SOURCED: Wikipedia (EN, FR): two former Expo 67 pavilions on Notre-Dame Island, architect Jean Faugeron, opened
//   9 October 1993, six storeys, Pavillon du Québec added by the 2013-2017 expansion. Photographs (Wikimedia Commons, see
//   docs/3d-quebec-casino-de-montreal.md). No published heights exist for the pavilions.
// MAPPED (OSM, ODbL, read 2026-10-03): the whole plan: the drum is a circle (centre = the model origin, rim radius 32.0 m
//   on the north-west and 39.7 m on the east where the ribs flare out), the west terrace bulge, the north-east canopy
//   triangle, the link block, the corridor and the Québec pavilion's 48 x 48 m square, whose edges give its 1.7 degree skew.
// ESTIMATED (photographs): every height, the rib counts and the flare, the terrace and shaft layout, the canopy, the wedge
//   slope. The model is an architectural approximation, not a survey.
import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'casino-de-montreal', name: 'Casino de Montréal', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centre of the French pavilion's drum, fitted to the mapped rim (two arcs: radius 32.0 m and 39.7 m).
  origin: [-73.525794, 45.50554],
  height: 44, // m, the tip of the mast above the terrace tower (estimated)
  padM: 140, // the complex runs 63 m north and 132 m south of the drum centre; Full 3D world uses terrainPad below
  frontageBearing: 40, // the entrance canopy and drop-off loop face north-east
  // The complex sits on made ground, but it is 200 m long: flatten the footprints, not a disc round the drum.
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 10 },
  drumR: 31.4, wingR: 39.7, podium: 9, drumTop: 30.4, quebecH: 28,
};

// Light is day, dark is night. Same keys in both. `glow` is drawn unshaded: the lit glazing behind the ribs, the lantern
// and the canopy edge (pale glass by day, warm light at night).
export const PALETTES = {
  light: {
    alu: '#e4e4df', concrete: '#d6d1c4', glass: '#7f9ca7', glow: '#a9bfc8', gold: '#a98a42', goldMid: '#b49c6e', roof: '#9da09f',
  },
  dark: {
    alu: '#a79a8c', concrete: '#85817b', glass: '#1b2a31', glow: '#ffbe6a', gold: '#4a3f26', goldMid: '#605543', roof: '#4a4e52',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the made ground of Notre-Dame Island at the entrance level); no absolute altitude. Podium roof 9 m, drum roof 30.4 m, rib crown 31.6 m, shaft stack 36 m, mast tip 44 m, Québec pavilion 28 m (31.5 m with its roof band). Full 3D world uses an explicit pad under both mapped outlines (median ground), not a disc.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan (drum circle and its flared east sector, west terrace bulge, north-east canopy triangle, link block, corridor, Québec pavilion square and the south-east wedge) is mapped from OSM ways 26698931 and 439917766. Every height, the rib counts, flare and lean, the terrace and shaft arrangement, the canopy and the ramp slope are estimated from photographs; the placement of the terrace tower, shafts and entrance canopies relative to the drum is inferred from the outline and four photographs. See docs/3d-quebec-casino-de-montreal.md.',
};
