// Transamerica Pyramid, 600 Montgomery Street · San Francisco, California (William Pereira, 1972).
// Sourced: 260 m (853 ft) to the tip, 48 floors, base 175 ft (53.3 m) square, the top 65 m is the
// aluminium-clad spire, two wings (elevator shafts east, stair and smoke tower west) rising from
// about the 29th floor, precast crushed-quartz facade with 3,678 windows, glass crown at the tip.
// Mapped (OSM way 24222973 and its building:part ways 451336902, 451336893/895/898/901, 136615987):
// the axis, the 9.2 degree rotation of the Financial District grid (faces face 80.8 / 170.8 /
// 260.8 / 350.8 degrees), the 46 m square at 30 m, the 54 m base outline and the 27.9 x 6.5 m wing
// footprint. Estimated from photographs: the base arcade, the window pocket proportions and the
// wing tops. See docs/3d-san-francisco-transamerica-pyramid.md.
export const SPEC = {
  id: 'transamerica-pyramid', name: 'Transamerica Pyramid', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // The pyramid's axis: the centre of the mapped 46 m square (OSM way 451336902), which is also the centre
  // of the base outline and of the wing footprint.
  origin: [-122.4027858, 37.7951663],
  height: 260, // to the tip of the glass crown
  padM: 42,    // covers the 54 m base outline (corners 38 m out) and the arcade
  // Bearing of the west face, the Montgomery Street front with the main entrance.
  frontageBearing: 260.8,
  // Model facts the geometry, tests and docs share (metres, building frame: faces face E, S, W, N).
  rotationDeg: 9.22,       // building frame to local east/south: +X' = bearing 80.78 deg
};
export const PALETTES = {
  light: {
    quartz: '#d8d5cb', shade: '#a39e91', concrete: '#bdb8aa', glass: '#2b2622', light: '#3b332c',
    aluminium: '#cfd6da', glow: '#e8eef0',
  },
  dark: {
    quartz: '#9aa0a8', shade: '#60666d', concrete: '#7d8289', glass: '#14110e', light: '#f2d9a0',
    aluminium: '#aab6c0', glow: '#fff0bd',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the Montgomery Street pavement at the lobby); no absolute altitude. The site is about 5 m above sea level (OSM ele=5), not baked in.',
  attribution: 'Original procedural mesh. Mapped footprint, orientation and wing outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: 260 m, 48 floors, 53.3 m base, 65 m spire, 3,678 windows. Mapped: axis, 9.2 degree rotation, 46 m square at 30 m, 54 m base outline, 27.9 x 6.5 m wing footprint (model wing face 13.8 m from the axis). Estimated from photographs: the four-storey base (A-frame arcade 11 m, fascia bands, 20.4 m to the first window row), window pocket proportions (recessed pockets 0.5 m deep with a 2.0 m opening on the lowest 14 rows, flat panes above, 1.37 m module), the wing tops, the spire louvres and the crown. Redwood Park, the glass pavilion east of the tower, the interior and the rooftop cameras are not modelled.',
};
