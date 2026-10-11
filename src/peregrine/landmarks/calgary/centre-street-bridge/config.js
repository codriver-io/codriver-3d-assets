// Centre Street Bridge (1916), Centre Street over the Bow River and Memorial Drive, Calgary.
// A road-carrying DOUBLE-DECK bridge: the upper deck (Centre Street, four lanes) is fitted to the
// OSM roadway by centre-street-bridge-profile.js and drawn by the shared bridge layer (layer.js);
// the lower deck (two reversible lanes, Riverfront Avenue to Memorial Drive) stays the provider's
// road. Facts and estimates: docs/3d-calgary-centre-street-bridge.md.
export const SPEC = {
  id: 'centre-street-bridge', name: 'Centre Street Bridge', kind: 'bridge',
  ready: true, // near/far GLBs exported, verified and catalogued
  // Structural anchor: mid-river, 1 m east of the mapped upper roadway (OSM way 4637525), 6 m north
  // of the middle span's centre. Local frame +X east, +Y up, +Z south (metres).
  origin: [-114.0625491, 51.0528614],
  // Upper road surface 9 m above flat-map grade (the provider's stacked-deck heights, see the
  // profile) plus the 7 m lamp standards on the balconies (the lions on their pavilions reach 15.8 m).
  height: 16.9,
  padM: 120,
  // The road bearing (degrees clockwise from true north): the mapped bridge chord runs 1.4 deg.
  frontageBearing: 1.4,
  // The provider extrudes no building here: the road layer fits the deck to the provider's roads.
  footprintless: true,
};

// Same keys in both themes. Names are drawn by the bridge layer with baked directional shading;
// `asphalt` is recoloured to the map's own pavement at runtime; `lamp` is drawn unshaded (self-lit).
// The upper deck's own materials (asphalt, paint, yellow, deck) fade while the followed car is on
// the lower deck (layer.js). `spandrel` is the darker tone of the arches' infill and soffit (the ring
// faces and piers are `concrete`); it is deliberately not `deck`, so the arches do not fade with the road.
export const PALETTES = {
  light: {
    concrete: '#d9d4c5', deck: '#d0cab9', spandrel: '#b4ad9b', balustrade: '#e6e2d6', lion: '#ddd7c9',
    asphalt: '#555d63', paint: '#eceadf', yellow: '#d9b93d', iron: '#3b4542', steel: '#6c7479', lamp: '#f4f0e2',
  },
  dark: {
    concrete: '#8a9198', deck: '#838a92', spandrel: '#6c737a', balustrade: '#9ea5ab', lion: '#a2a8ad',
    asphalt: '#303c47', paint: '#b9bdbe', yellow: '#a58f3b', iron: '#69757a', steel: '#5d6a75', lamp: '#ffe4a0',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (taken as the river); no absolute altitude, DEM or latitude stretch is baked in. The upper road surface is authored at 9.0 m, 4.0 m above the provider\'s 5 m lower deck; its ends ease onto the mapped approach roads at runtime (centre-street-bridge-profile.js). Full 3D world adds a datum through the DEM at the mapped deck ends.',
  attribution: 'Original procedural mesh. Upper and lower roadways, deck outline, pier bays, sidewalks and crossing roads © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Three open-spandrel reinforced-concrete arches on piers skewed 23 deg to the deck (the river\'s flow), placed on the mapped pier bays (within 1 m); upper deck 15 m with cantilevered balconies to 21 m (mapped outline 21.3 m); I-girder lower deck 5.5 m wide hung between the arch ribs at the mapped lower roadway, 4.0 m below the upper road (2.7 m clearance). Estimated: arch rise and ring depth, spandrel arcade rhythm, pier plan, end-span bents, balustrade and lamp spacing, pavilion and lion proportions (from photographs). Flat-map ramps are a convention, not survey.',
};
