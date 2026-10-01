// Sutro Tower, 1 La Avanzada Street, Mount Sutro · San Francisco, California (Kline Towers, 1973).
// Sourced: 297.8 m (977 ft) to the tip of the antennas; three steel legs on an equilateral triangle that
// lean inward to a waist at Level 4 (169.8 m) and flare outward above it; triangular platforms at Level 2
// (56.7 m), Level 3 (116.4 m) and Level 4, a white lattice triangle at Level 5 (200.3 m), and three 60 m
// lattice crossarms in a triangle at Level 6 carrying the three top masts; painted in alternating
// aviation-orange and white bands (sutrotower.org, Wikipedia). Mapped (OSM relation 3829019 and its
// building:part ways): the axis, the leg bearings (270, 30, 150 degrees), the leg positions and slope,
// the 26 m paint bands, the platform plans and the crossarm plan. Estimated from calibrated photographs:
// the leg cross-section taper, the lattice and mast details, the cables. See docs/3d-san-francisco-sutro-tower.md.
export const SPEC = {
  id: 'sutro-tower', name: 'Sutro Tower', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // The tower's axis: the mean of the three mapped leg sections, which is also the centre of the mapped
  // Level 2 to 6 platforms and of the inner hole of the outline.
  origin: [-122.4528526, 37.7552413],
  height: 297.8, // to the tip of the top antennas
  padM: 34,      // covers the three leg feet (their outer corners reach 29.6 m from the axis)
  // Bearing the transmission building and the La Avanzada gate face (east): the leg on the far side is the west leg.
  frontageBearing: 90,
  // Seen from every part of the city, mostly by its far model: draw it from 9 km, and let the detailed
  // model take over within 700 m (the Level 6 crossarms at 230 m are then well inside the view).
  rangeM: 9000, minZoom: 12.5, nearM: 700,
  // Model facts the geometry, tests and docs share.
  legBearings: [270, 30, 150],
};
export const PALETTES = {
  light: {
    orange: '#bd4e38', white: '#e8e7df', steel: '#7d868d', soffit: '#f9c9b4', lamp: '#b3382c',
  },
  dark: {
    orange: '#a14633', white: '#b0b5bd', steel: '#76808c', soffit: '#a98672', lamp: '#ff4637',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The tower foot is about 254 m above sea level on Mount Sutro, not baked in.',
  attribution: 'Original procedural mesh. Mapped axis, leg, platform and crossarm geometry © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Leg, platform and crossarm plans, leg slope and paint bands come from the OSM 3D mapping and the published level heights; the leg taper, the lattice and mast construction, the guy cables, the antenna pods and the aviation lights are estimated from photographs. The platforms are solid plates (pale brown soffits); the transmission building, antennas on the platforms and the ladder and lift enclosures are not modelled; the interior is empty.',
};
