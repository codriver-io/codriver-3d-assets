// Alcatraz Island, San Francisco Bay: the Main Cellhouse (1912) with its Dining Hall and Administration Block, the 1909
// lighthouse, the Warden's House ruins, the recreation-yard wall and the 1940 Water Tower. See docs/3d-san-francisco-alcatraz-island.md.
// Origin: area centroid of the mapped Main Prison outline (OSM way 128245373). The island grid is turned 45.95 deg off north:
// the mapped cellhouse walls give bearing 135.95 deg for the long axis (two edges, 48.1 m and 48.0 m, both 135.95 / 135.93 deg).
// Authoring frame: u runs along that axis (bearing 135.95, toward the Administration Block and the lighthouse), w runs at right angles
// toward the south-west (bearing 225.95, the long front that looks at San Francisco and the Golden Gate). One rotation onto x/z at the end.
// y = 0 is the cellhouse's yard / main grade (about 38 m above the bay, estimated from a public DEM); the rock itself is NOT modelled.
export const SPEC = {
  id: 'alcatraz-island', name: 'Alcatraz Island', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-01)
  origin: [-122.4229316, 37.8266302],
  height: 28.8, // lighthouse vane: 25.6 m tower on a base that stands 3.2 m above the cellhouse grade
  padM: 75, frontageBearing: 225.95, // the south-west long front looks toward San Francisco
  bearingDeg: 135.95, // authoring u-axis, compass bearing (clockwise from north)
};
export const PALETTES = {
  light: {
    stone: '#a39e93', trim: '#bab5aa', base: '#847f75', roof: '#6d7173', glass: '#3a4650',
    ruin: '#615c55', wall: '#968f85', tower: '#b0aca2', steel: '#85817a', glow: '#f3ecc9',
  },
  dark: {
    stone: '#76726b', trim: '#868279', base: '#4f4c46', roof: '#3b3f44', glass: '#1d252d',
    ruin: '#4a463f', wall: '#69655d', tower: '#7f7c75', steel: '#4a4d50', glow: '#fff3b8',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the cellhouse yard level, about 38 m above the bay; the island rock is not part of the model. The lighthouse base stands 3.2 m above it; the Water Tower footings reach 2.5 m below it (its real ground is about 9 m lower) and its tank top is set at its true height relative to the cellhouse roof (about 5 m above it), so the tower is about 23 m tall instead of 29 m.',
  attribution: 'Original procedural mesh. Mapped footprints and the recreation-yard wall line © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the mapped outlines, 25.6 m (84 ft) lighthouse, six-legged water tower with a 13 m tank (the published 94 ft / 29 m height is not reproduced: legs are shortened to keep its true height relative to the cellhouse roof), cellhouse three storeys. Estimated from photographs: storey and parapet heights, window rhythm, roof monitors, the ruin walls, the yard-wall height and guard towers. Grade differences between buildings come from a coarse public DEM and are approximate.',
};
