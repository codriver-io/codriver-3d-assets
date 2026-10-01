// San Francisco–Oakland Bay Bridge, West Span (1936): I-80 from Rincon Hill to the Yerba Buena Island tunnel.
// A road-carrying double-deck bridge: fitted to the OSM roadway by bay-bridge-west-span-profile.js and drawn
// by createRegistryBridgeLayer (layer.js). Facts and estimates: docs/3d-san-francisco-bay-bridge-west-span.md.
export const SPEC = {
  id: 'bay-bridge-west-span', name: 'San Francisco–Oakland Bay Bridge (West Span)', kind: 'bridge',
  ready: true, // near/far GLBs exported, verified in the inspector and the app, catalogued
  // Structural anchor: the centre of the central anchorage W4 ("Moran's Island", OSM way 236374789).
  origin: [-122.3778604, 37.7981899],
  // Towers W3 and W5 rise 502 ft (153 m) above low water (HAER CA-32); plus their aviation beacons.
  height: 154,
  padM: 60,
  // The road bearing (degrees clockwise from true north) of the mapped West Span, San Francisco to the island.
  frontageBearing: 40.3,
  // Road bridges replace no provider building through FOOTPRINTS (registry-landmarks-layer.js prepares
  // footprints for buildings only); the towers and W4 extrusions are listed in footprint.js for reference.
  footprintless: true,
};

// Same keys in both themes. The bridge layer draws every name with baked directional shading
// (asphalt is recoloured to the map's own pavement at runtime). `bay` is the north-side suspenders,
// which carry the Bay Lights LED sculpture at night; `beacon` the red aviation lights on the towers.
export const PALETTES = {
  light: {
    steel: '#a9afb4', cable: '#8e959b', hanger: '#99a0a6', bay: '#99a0a6', concrete: '#c4bfb3', asphalt: '#555d63', paint: '#eceadf',
    rail: '#b8bdc1', beacon: '#b8463c',
    asphaltUpper: '#555d63', paintUpper: '#eceadf', deckUpper: '#c4bfb3', pier: '#8c9193', void: '#2a2e33',
  },
  dark: {
    steel: '#626d78', cable: '#c8d4e2', hanger: '#56616c', bay: '#eef5ff', concrete: '#7c848b', asphalt: '#303c47', paint: '#b9bdbe',
    rail: '#8e99a4', beacon: '#ff4a36',
    asphaltUpper: '#303c47', paintUpper: '#b9bdbe', deckUpper: '#7c848b', pier: '#4d545a', void: '#0e1216',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the bay at low water); no absolute altitude, DEM or latitude stretch is baked in. Towers, piers and anchorages stand on y=0. The decks are authored at estimated heights from the published clearance and tower heights; their ends ease to the approach roads at runtime (bridge-profile.js).',
  attribution: 'Original procedural mesh. Alignment, supports and approach roads © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Two suspension bridges end to end (side spans 1160 ft, main spans 2310 ft, HAER CA-32) sharing the central anchorage W4, with every support placed on its mapped OSM outline. Estimated: the deck elevations (from the 220 ft clearance, the 35 ft truss depth and the tower heights), the truss panel and member sizes, the tower bracing proportions, the anchorages above water, the cable sag. On the flat map the deck rises from the SoMa viaduct to the San Francisco anchorage and falls from tower W6 to the Yerba Buena Island tunnel, which the real bridge does not.',
};
