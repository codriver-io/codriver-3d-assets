// Golden Gate Bridge, US 101 over the Golden Gate strait · San Francisco–Marin, California, 1937.
// A road-carrying bridge: fitted to the mapped OSM carriageways by golden-gate-bridge-profile.js and
// drawn by createRegistryBridgeLayer (layer.js). Facts and estimates: docs/3d-san-francisco-golden-gate-bridge.md.
export const SPEC = {
  id: 'golden-gate-bridge', name: 'Golden Gate Bridge', kind: 'bridge',
  ready: true, // the road layer, its tests and the near/far exports exist and pass
  // Structural anchor: mid-span, halfway between the two mapped tower centres (OSM tower leg
  // parts 1329761877/1329558939 and 1330832688/1330832671), on the straight bridge axis.
  origin: [-122.4785625, 37.8197595],
  // Towers 746 ft (227.4 m) above the water (GGBHTD); local y = 0 is mean high water.
  height: 227.4, padM: 60,
  // The bridge axis runs 354.7 deg (north by a little west), San Francisco to Marin.
  frontageBearing: 354.7,
  // The provider draws no building on the deck: nothing for the layer to replace.
  footprintless: true,
  // Full 3D world: authored above sea level, so no corridor flattening; the structure keeps its
  // heights, supports reach the DEM and the ramps blend into the terrain road (bridge-layer.js).
  terrainPolicy: 'absolute-deck',
};

// Same keys in both themes. The bridge layer draws every name with baked directional shading
// (asphalt is recoloured to the map's own pavement at run time). `tower` and `steel` are both
// International Orange (#c0362c) by day; at night the floodlit towers stay bright and the deck
// steel and cables fall dark, and the deck lamps glow.
export const PALETTES = {
  light: {
    tower: '#c0362c', steel: '#b9372d', concrete: '#cdc6b6', asphalt: '#555d63', paint: '#eceadf', lamp: '#f1ead4',
  },
  dark: {
    tower: '#c4553b', steel: '#b0503f', concrete: '#6c7279', asphalt: '#303c47', paint: '#b9bdbe', lamp: '#ffcf73',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local y = 0 is mean high water on the flat Peregrine basemap; no absolute altitude, DEM or latitude stretch is baked in. The deck is authored at its published height (road 75.4 m: towers 227.4 m above the water, 152 m above the roadway) from pylon S2 to pylon N1, and its ends ease to the approach roads at run time (bridge-profile.js).',
  attribution: 'Original procedural mesh. Alignment (US 101 carriageways), tower, pylon, anchorage and fender positions © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: main span 1,280.2 m, side spans 342.9 m, towers 227.4 m above water and 152 m above the roadway, mid-span clearance 67 m, cables 27.4 m apart and 0.92 m thick, suspenders every 15.24 m, roadway 18.9 m between kerbs with 3.05 m sidewalks, Fort Point arch 97 m. Mapped: tower, pylon and anchorage positions, tower leg setbacks and portal strut heights (OSM building parts). Estimated: cable sag and side-span cable ends, leg recesses and strut ornament, the X-bracing below the deck, truss panel layout, the Fort Point arch rise and web, approach viaduct bents, anchorage massing above ground, lamp spacing. Flat-map convention: the deck is level from pylon S2 to pylon N1 and ramps over 900 m at each end down to the approach roads (steepest grade 12.6 %), over the approach viaducts and out along the mapped toll plaza / Presidio Parkway and Redwood Highway.',
};
