// Reunion Tower ("the Ball"), 300 Reunion Boulevard, Dallas. Welton Becket and Associates, 1978.
// Sourced: 561 ft (171 m) to the roof; a geodesic sphere (textbook "about 118 ft" / 36 m, an
// eight-frequency icosahedron with 259 light nodes) on four poured-concrete shafts — one central
// cylinder for stairs and mechanical plant, three outer shafts with glazed elevator faces.
// Mapped (OSM ways 1428779225 / 1491048358 and shaft parts 1491048359, 1491048355–57, read
// 2026-10-04): the ball ring is 16.45–17.47 m from the central-shaft axis, so the model sphere is
// the inscribed radius (centreline 16.15 m, light housings to 16.41 m) and the shaft radii and
// bearings are the mapped circles. The 118 ft figure is the loose schoolbook number; the map and
// the OSM vertical span (min_height 137, height 170) agree with a ~33 m ball under a 171 m top.
// See docs/3d-top-cities-reunion-tower.md.
export const SPEC = {
  id: 'reunion-tower',
  name: 'Reunion Tower',
  kind: 'building',
  ready: true,
  // Axis of the central concrete shaft, which is also the centre of the mapped ball ring.
  origin: [-96.808943125, 32.775362575],
  height: 171, // north-pole light housing; the strut centreline pole is at 170.8 m
  padM: 24, // the ball ring stays inside 17.5 m
  // Bearing of the southern elevator shaft (OSM 1491048357), the one that faces the river side.
  frontageBearing: 208.9,
  // A 171 m ball is the downtown skyline marker: draw it from a few kilometres, near LOD inside downtown.
  rangeM: 4500,
  minZoom: 12.5,
  nearM: 700,
  // Shared with the geometry and the tests. Metres, +X east, +Y up, +Z south.
  sphereR: 16.15,
  centerY: 154.59, // pole centreline 170.74; the 0.26 m light housings reach 171.0
  nodeR: 0.26,
  centerShaftR: 6.05,
  outerShaftR: 2.18,
  // Outer elevator shafts, centres relative to the axis. Bearings are degrees clockwise from north.
  shafts: [
    { x: 8.996, z: 1.804, bearing: 101.34 },
    { x: -6.821, z: -5.821, bearing: 310.48 },
    { x: -5.119, z: 9.254, bearing: 208.95 },
  ],
};

export const PALETTES = {
  light: {
    concrete: '#d2c4ae',
    concrete_dark: '#b5a790',
    glass: '#1c5c8c',
    metal: '#c5ccd3',
    // Light housings are unshaded: aluminium by day, the night light-show bands after dark.
    glow: '#d8dce0',
    light: '#d6dae0',
    lamp: '#dadde1',
  },
  dark: {
    concrete: '#8d8476',
    concrete_dark: '#6f685c',
    glass: '#071018',
    metal: '#7a838c',
    glow: '#ff4d6a',
    light: '#49d0ff',
    lamp: '#ffd15a',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The Reunion district grade is flat downtown fill, not baked in.',
  attribution: 'Original procedural mesh. Mapped footprint, ball ring and shaft circles © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sphere diameter follows the mapped ring (inscribed 32.7 m) rather than the schoolbook "about 118 ft". Shaft radii and bearings are mapped; band pitch, glass-band height, crown and the open underside of the geodesic are estimated from photographs. The Hyatt Regency, plaza and foundation piers are not modelled. Night lighting is three static colour bands on the 259-style nodes, not the animated show.',
};
