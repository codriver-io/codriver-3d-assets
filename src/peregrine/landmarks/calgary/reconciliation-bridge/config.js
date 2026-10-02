// Reconciliation Bridge (the Langevin Bridge until 2017), Bow River, Calgary, 1910: a two-span riveted
// steel Parker camelback through truss carrying southbound 4 Street NE / Edmonton Trail traffic from
// Bridgeland into downtown (4 Avenue SE). A road-carrying bridge: fitted to the OSM roadway by
// reconciliation-bridge-profile.js and drawn by createRegistryBridgeLayer (layer.js).
// Facts and estimates: docs/3d-calgary-reconciliation-bridge.md.
export const SPEC = {
  id: 'reconciliation-bridge', name: 'Reconciliation Bridge', kind: 'bridge',
  ready: true, // the road layer, its tests and the near/far exports exist and pass
  // Structural anchor: the river pier, at the middle of the mapped roadway (OSM way 257636719, 114.5 m).
  origin: [-114.0523221, 51.0499241],
  // Top of the top chord at mid-span (11.0 m truss depth on a chord 0.15 m below the road) plus the LED strip.
  height: 11.3,
  padM: 70,
  // The direction of travel on the one-way roadway, degrees clockwise from true north (southbound).
  frontageBearing: 209.1,
  // The provider draws no building on the bridge: nothing for the layer to replace.
  footprintless: true,
};

// Same keys in both themes. The bridge layer bakes directional shading into every material and
// recolours by name for the dark theme; asphalt takes the map's own pavement colour at runtime.
// steel = the mid-grey painted trusses (photographs); deck = the weathered steel sidewalk plates and fascia;
// rail = the lattice balustrade; light = the programmable LED strips on the top chords (2009), pale
// steel by day and lit at night; banner = the art banners hung on the verticals.
export const PALETTES = {
  light: {
    steel: '#9b9fa0', concrete: '#bdb7aa', asphalt: '#555d63', paint: '#eceadf', deck: '#857565',
    rail: '#a4aaac', light: '#d7dbdc', banner: '#9a5a4a',
  },
  dark: {
    steel: '#646e76', concrete: '#7c848b', asphalt: '#303c47', paint: '#b9bdbe', deck: '#585a5c',
    rail: '#8a96a0', light: '#86d8ff', banner: '#6e4a46',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local y=0 is the road surface, level with the approach streets on both banks (the real deck is at bank level, several metres above the Bow). No absolute altitude, DEM or latitude stretch is baked in. On the flat Cityscape map the deck stays level with the loaded approach roads (no ramp); in Full 3D world (terrainPolicy absolute-deck) the deck spans between the two approach roads\' ground while the pier and abutments reach their own ground. Pier and abutment feet stop at y=-2.9.',
  attribution: 'Original procedural mesh. Alignment, deck outline, sidewalks and the paths under the deck © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: 1910 two-span riveted steel Parker camelback through truss, 8 panels per span, 190 ft (57.9 m) spans, 116.58 m long, 14.02 m wide, one concrete river pier and two abutments, 1.5 m steel sidewalks with a lattice balustrade on either side (City of Calgary heritage inventory via HistoricBridges.org); southbound one-way, 2 lanes, signed clearance 4.2 m (OSM). Mapped: alignment, bearing 209.1 deg, deck outline and sidewalks. Estimated from photographs: truss depth (7.8 m at the hips to 11.0 m at mid-span), member sizes, laced verticals and struts, portal and sway bracing (kept >= 5 m over the carriageway), floor system, pier plan and cutwaters, abutments, balustrade pattern, LED strip and banner positions, colours.',
};
