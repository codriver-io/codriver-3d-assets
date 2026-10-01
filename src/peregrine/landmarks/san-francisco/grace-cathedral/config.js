// Grace Cathedral, 1100 California Street, Nob Hill · San Francisco, California.
// Episcopal cathedral of French Gothic design (Bodley / Hare / Lewis P. Hobart), poured reinforced concrete,
// built 1928-1964. The west front (towers, rose window, Ghiberti doors) faces EAST onto Taylor Street, the
// apse is at the Jones Street end. The mapped axis is 8.8 deg off the cardinal grid (bearing 81.2 deg).
// Origin: area centroid of OSM way 32946942. Authoring frame (see grace-cathedral-plan.js): x lateral
// (+x = north-ish, the viewer's right facing the front), z along the nave axis, front at +z, one rotation
// onto east/up/south at the end. y = 0 is the Taylor Street pavement at the foot of the Great Stairs.
export const SPEC = {
  id: 'grace-cathedral', name: 'Grace Cathedral', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-122.4134362, 37.7918386],
  height: 75, // m to the cross on the flèche (247 ft above street level, Wikipedia); the towers are 53 m (174 ft)
  padM: 62, // footprint (apse at -53 m, portal at +42 m along the axis) plus the first flight of the Great Stairs
  frontageBearing: 81.2, // the Taylor Street front looks toward bearing 81.2 deg (east, 8.8 deg north of east)
  rotationDeg: 98.8, // authoring +z (the front) onto the mapped axis: Y-up rotation, 90 deg + 8.8 deg grid skew
};
export const PALETTES = {
  light: {
    stone: '#aeada8', recess: '#8e8e8b', concrete: '#a9a9a6', roof: '#686b6e', spire: '#4d5f5b',
    glass: '#2f3a46', glow: '#4b5b6d', brass: '#b3924a',
  },
  dark: {
    stone: '#6a6c70', recess: '#525458', concrete: '#5c5e63', roof: '#393d41', spire: '#2b3836',
    glass: '#192129', glow: '#e3bd78', brass: '#d9b865',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. y=0 is the Taylor Street pavement at the foot of the Great Stairs; the church floor and the doors stand 6.1 m above it (20 ft, Wikipedia).',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: tower height 53 m, flèche 75 m (above street level), the 6.1 m entry level, the OSM outline (axis bearing, 95.7 m long, 43.4 m across the transepts, 26.8 m front). Estimated from photographs: every height below the tower tops (aisle and nave walls, roof ridges, belfry, rose window and portal), bay count, window rhythm and all north, south and apse elevations. Carved ornament, tracery (other than the rose window wheel) and the cathedral close are not modelled.',
};
