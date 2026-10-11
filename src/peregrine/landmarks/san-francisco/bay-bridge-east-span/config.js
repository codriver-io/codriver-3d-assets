// San Francisco–Oakland Bay Bridge, East Span (2013 replacement), I-80 from Yerba Buena Island to the
// Oakland touchdown. A road-fitted bridge: fitted to the mapped carriageways by
// bay-bridge-east-span-profile.js and drawn by createRegistryBridgeLayer (layer.js).
// Facts and estimates: docs/3d-san-francisco-bay-bridge-east-span.md.
export const SPEC = {
  id: 'bay-bridge-east-span', name: 'San Francisco–Oakland Bay Bridge (East Span)', kind: 'bridge',
  ready: true, // near/far GLBs exported, verified in the inspector and the app, catalogued
  // Structural anchor: the centroid of the mapped SAS tower outline (OSM way 237735191), which sits on
  // the midline between the two decks (0.1 m off it).
  origin: [-122.3585059, 37.8152652],
  // The single tower: published 160 m (525 ft) above the water.
  height: 160,
  padM: 120,
  // Real deck (road surface) height above the water over the SAS, about 57 m (Caltrans elevation:
  // 0.35 of the 160 m tower; estimated, +-3 m). The flat-map profile uses a lower deck (30-40 m over
  // the SAS) because the Cityscape YBI ramp is short; a terrain mode with real heights reads this.
  realDeckM: 57,
  // Bearing of the self-anchored suspension span (degrees clockwise from true north), from the mapped decks.
  frontageBearing: 54.3,
};

// Same keys in both themes. The bridge layer bakes directional shading into vertex colours and
// recolours asphalt to the map's own pavement; `lamp` is drawn unshaded (self-lit) by convention.
export const PALETTES = {
  light: {
    steel: '#e8eae6', concrete: '#d3d1c7', footing: '#aaa79d', cable: '#c7cdd0', asphalt: '#555d63',
    paint: '#eceadf', rail: '#b4babd', path: '#a39f94', lamp: '#f4f3e8',
  },
  dark: {
    steel: '#a4b0b9', concrete: '#8a949c', footing: '#646e76', cable: '#b9c6d0', asphalt: '#303c47',
    paint: '#b9bdbe', rail: '#8f9ba6', path: '#5b646d', lamp: '#fff1c8',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the water); no absolute altitude, DEM or latitude stretch is baked in. The deck is authored at an estimated 48 m over the SAS and eases to the approach roads at runtime (bridge-profile.js).',
  attribution: 'Original procedural mesh. Alignment, carriageway separation, tower position, crossbeams and trail © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Self-anchored suspension span with the published spans (10 + 180 + 385 + 49.385 m), the single 160 m four-leg tower on its mapped outline, one looped main cable in four inclined planes, suspenders every 10 m to the outer box edges, twin decks 41.8 m apart (mapped) with the crossbeams at their mapped stations, and the bike path on the south. Estimated: deck heights (48 m over the SAS, 22 m at E16), Skyway pier stations (E3 160 m past E2, 9 x 160 m then 4 x 122.5 m), girder haunch (5.5 to 9 m), tower leg sections and shear-link spacing, cable sag, the YBI transition and Oakland touchdown structures. The flat-map ramps are a convention, not survey.',
};
