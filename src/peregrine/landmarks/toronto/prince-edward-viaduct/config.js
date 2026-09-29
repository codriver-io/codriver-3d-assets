// Prince Edward Viaduct (Bloor Street Viaduct), Don Valley section, Toronto, 1918.
// A road-carrying bridge: fitted to the OSM roadway by prince-edward-viaduct-profile.js
// and drawn by createBridgeLayer (layer.js). Facts and estimates: docs/3d-toronto-prince-edward-viaduct.md.
export const SPEC = {
  id: 'prince-edward-viaduct', name: 'Prince Edward Viaduct (Bloor Street Viaduct)', kind: 'bridge',
  ready: true, // the road layer, its tests and the near/far exports exist and pass
  // Structural anchor: the centre of the middle (85.8 m) arch on the mapped roadway
  // (OSM way 4282643), station 262.6 m from its west end. About 8 m from the Don River.
  origin: [-79.3635537, 43.6753015],
  // Deck 40 m above the valley floor + the 5.6 m Luminous Veil + lamp arms; the deck
  // is authored at the published 40 m clearance (ramps to the approach datum at both ends).
  height: 46, padM: 140,
  // The road bearing (degrees clockwise from true north): the mapped bridge runs 74.7 deg.
  frontageBearing: 74.7,
  // The provider draws no building on the deck: nothing for the layer to replace.
  footprintless: true,
};

// Same keys in both themes. Names are drawn by the bridge layer with baked directional shading
// (asphalt is recoloured to the map's own pavement at runtime).
export const PALETTES = {
  light: {
    concrete: '#cfc9ba', stone: '#bcb19b', steel: '#3f4954', asphalt: '#555d63', paint: '#eceadf', yellow: '#d9b93d',
    rail: '#a9b1b5', veil: '#dfe4e4', lamp: '#eef1e4',
  },
  dark: {
    concrete: '#8e969d', stone: '#7f8790', steel: '#71808f', asphalt: '#303c47', paint: '#b9bdbe', yellow: '#a58f3b',
    rail: '#8f9ba6', veil: '#a9c4d8', lamp: '#ffe4a0',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the valley floor); no absolute altitude, DEM or latitude stretch is baked in. The deck is authored at the published 40 m clearance; its ends ease to the approach roads at runtime (bridge-profile.js).',
  attribution: 'Original procedural mesh. Alignment, deck outline, pier stations and crossing roads © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Five steel arch spans with the published pin spans (48.2, 73.6, 85.8, 73.6, 48.2 m) between six stone piers placed within 2.7 m of the notches in the mapped deck outline; deck 26.2 m wide from that outline. Estimated: arch rib depth and web pattern, the subway room, pier plan and taper, the approach girder and fill beyond the arches, veil post spacing and lean, lamp positions. The mapped structure is 469.5 m; the published 494 m includes approaches beyond the mapped bridge way. The deck is level at 40 m from the first pier to the last and ramps over 170 m at each end onto the mapped Bloor Street East / Danforth Avenue: a flat-map convention, not survey.',
};
