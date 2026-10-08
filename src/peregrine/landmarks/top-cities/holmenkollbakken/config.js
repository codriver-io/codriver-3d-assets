// Holmenkollbakken, Oslo. The 2010 JDS / COWI steel ski jump (HS134).
// Frame and sourced dimensions: holmenkollbakken-plan.js. y = 0 is the outrun.
import { ORIGIN, CROWN, BEARING, lngLat } from './holmenkollbakken-plan.js';

// Full 3D world hangs the group from the lowest flat-outrun sample so the
// real hill can rise through the closed Cityscape wedge. The wedge is rigid:
// on a coarse DEM it can still intersect the hillside. Cityscape ignores the
// pad and keeps y = 0 as the bowl floor.
const TERRAIN_PAD = {
  rings: [[lngLat(196, -9), lngLat(214, -9), lngLat(214, 9), lngLat(196, 9)]],
  refs: [lngLat(198, -6), lngLat(210, -6), lngLat(210, 6), lngLat(198, 6)],
  datum: 'lowest',
  featherM: 12,
};

export const SPEC = {
  id: 'holmenkollbakken',
  name: 'Holmenkollbakken',
  kind: 'building',
  ready: true,
  origin: ORIGIN, // take-off lip on the K120 centreline
  height: Math.round(CROWN * 100) / 100, // terrace rail on the start house
  padM: 240,
  frontageBearing: Math.round(BEARING * 100) / 100, // downhill, clockwise from north
  rangeM: 4500,
  minZoom: 13,
  terrainPad: TERRAIN_PAD,
};

export const PALETTES = {
  light: {
    mesh: '#eef0ed', earth: '#d6d8d0', shoulder: '#c4c8bc', steel: '#30363b', track: '#f4f6f8', concrete: '#b7b9b2',
    glass: '#6d8f99', seat: '#687078', red: '#d12632', blue: '#1e4f9e', light: '#fff0c4',
  },
  dark: {
    mesh: '#aab3b7', earth: '#2b3440', shoulder: '#252d38', steel: '#1b242d', track: '#d7dde2', concrete: '#6c7177',
    glass: '#1b313c', seat: '#3d444b', red: '#8e1c25', blue: '#16356b', light: '#ffe6a6',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local y=0 is the outrun floor at the bottom of the bowl. Lip, landing and start terrace are heights above that floor. No DEM, sea level or latitude stretch is baked in. On the flat Cityscape map the landing is a closed graded earth embankment beneath the snow; a slender start tower rises from the upper ridge. Full 3D world: terrainPad holds only the flat outrun (u=196–214) at its lowest reference DEM sample, so the real hill can cover the lower wedge. The rigid wedge can still cut a coarse DEM.',
  attribution: 'Original procedural mesh. Mapped jump, stands and steel slices © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: FIS HS134 certificate (inrun 95.65 m, 36° to 11°, r1 108.80 m, table 6.60 m, take-off 3 m, h 59.10 m, n 103.70 m, landing angles 35.7/33.2/30.8), 2010 faktaark (64 m tower, wind screen 2 m at the lip and 12 m at its highest, judges on the jumper\'s left). Estimated: screen height at the gate (8 m), truss sag, start-house plan, stand row count, the square start tower plan, short raked root strut and embankment batters. The snow follows the mapped pitch, which is narrower than 25.2 m above K. The white-clad inrun spans openly above the ridge, carried by the start tower and one short raked strut. The pre-2010 concrete tower is not modelled.',
};
