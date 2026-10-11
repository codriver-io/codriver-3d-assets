// Casa Loma, 1 Austin Terrace, Toronto: Sir Henry Pellatt's 1911-14 Gothic Revival
// castle (architect E. J. Lennox) and the stables complex at 330 Walmer Road.
// See docs/3d-toronto-casa-loma.md for sources, the dimension table and what is estimated.
export const SPEC = {
  id: 'casa-loma', name: 'Casa Loma', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Anchor: the centre of the joint bounding box of the castle (OSM way 198471666) and the
  // stables (way 198471670), which stand ~175 m apart. Centring on the pair keeps both
  // inside one terrain pad (padM) instead of needing a 210 m disc round the castle alone.
  origin: [-79.4100918, 43.6787216],
  // Highest point: the finial on the conical roof of the south-east round tower ("Scottish
  // Tower"), about 35.9 m above the local ground-floor terrace. Published: "more than
  // 130 ft (40 m) from the ground" measured on the escarpment side, ~4-5 m lower ground.
  height: 36,
  // Disc round the origin that Full 3D world flattens to the datum. Covers both buildings
  // (farthest mapped point ~137 m) plus the model's wall footings.
  padM: 150,
  // Bearing (deg, clockwise from north) the castle's north entrance front faces: the
  // Toronto street grid's own 342 deg, Austin Terrace running along the front at 72 deg.
  frontageBearing: 342,
  // Frame: +u along bearing 72 deg (the lake-shore / Austin Terrace direction), v across it
  // toward bearing 162 deg. The geometry is authored in (u, v) and rotated onto east/south once.
  frameBearing: 72,
  // Site slope is NOT modelled (see MANIFEST.note): the castle stands on Davenport Hill's brow,
  // its south terrace ~20 m above Davenport Road; y = 0 is the ground-floor / courtyard level.
  ownTolM: 0.8,
};

// Materials. Names are shared by both themes. `glow` is self-lit (drawn unshaded): tall
// bay windows and the conservatory. In daylight it must read as glass, so the light value
// is a dim window-glass blue and the dark (night) value is warm lamp light.
export const PALETTES = {
  light: {
    stone: '#a09a8b',   // Credit Valley sandstone rubble: grey-tan with dark bands
    rubble: '#84806f',  // the darker, rougher footing course
    trim: '#d9d1bd',    // cream limestone / cast "Roman stone" dressings, merlons, quoins
    roof: '#80372c',    // terracotta pan tile, deep red-brown as in the photographs
    copper: '#6f9e8a',  // weathered copper flashing and eave gutters (verdigris)
    glass: '#39474f',   // leaded windows
    glow: '#566770',    // tall bay windows and conservatory glazing (lit at night)
    lead: '#7c858a',    // flat lead roofs and the conservatory hall roof (blue-grey)
    brick: '#84392d',   // stables: red brick
  },
  dark: {
    stone: '#65686c',
    rubble: '#4f5357',
    trim: '#9c9fa0',
    roof: '#4f2a25',
    copper: '#48705f',
    glass: '#1f2a31',
    glow: '#ffd58a',
    lead: '#464d52',
    brick: '#512a25',
  },
};

// Draw-call budget (docs/3d-toronto-casa-loma.md): design names on the left, the exported material on the right.
// Near keeps all nine (9 draws). Far folds the 12-triangle porte-cochere opening into the blue-grey lead, which leaves
// eight; the weight comes down by dropping hidden floors/caps and sub-pixel courses (see the doc), not by merging.
export const FOLD = {
  near: {},
  far: { glass: 'lead' },
};
/** The exported material for a design name at a detail level. */
export const materialFor = (name, detail) => FOLD[detail]?.[name] ?? name;

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 at the castle\'s ground-floor terrace and north courtyard on the flat Peregrine basemap; no absolute altitude. The real site stands ~140 m above sea level on the brow of Davenport Hill (66 m above Lake Ontario); that slope is deliberately NOT baked in.',
  attribution: 'Original procedural mesh. Mapped footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Outline and orientation are the mapped OSM footprints; every height, roof shape, window position, tower detail and the conservatory dome are estimated from photographs (only "more than 130 ft" for the tallest tower, the 98 rooms / 64,700 sq ft floor area and the 243 m tunnel are published). The tower/wing naming used by public sources is inconsistent, so towers are described by shape. The base is rigid at y=0; the hillside is not modelled.',
};
