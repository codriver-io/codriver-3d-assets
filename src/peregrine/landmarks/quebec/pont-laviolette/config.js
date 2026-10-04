// Pont Laviolette, Autoroute 55 over the St. Lawrence · Trois-Rivières–Bécancour, 1967.
// The only bridge over the river between Montréal and Québec: a continuous steel through-truss with a
// through arch over the navigation channel, on long girder approaches. Fitted to the mapped A-55
// carriageways by pont-laviolette-profile.js and drawn by createRegistryBridgeLayer (layer.js).
// Facts and estimates: docs/3d-quebec-pont-laviolette.md.
export const SPEC = {
  id: 'pont-laviolette', name: 'Pont Laviolette', kind: 'bridge',
  ready: true, // the road layer, its tests and the near/far exports exist and pass
  // Structural anchor: the centre of the 335 m main span on the averaged straight axis of the two mapped
  // carriageways (OSM 84720759/84720761), 641 m + 3 x 119 m + 167 m + 167.5 m from the north end
  // (published spans). No pier is mapped.
  origin: [-72.5615492, 46.3074037],
  // Arch crown 106.6 m (published total height) above high water; local y = 0 is high water.
  height: 106.6, padM: 60,
  // The bridge axis runs 130.1 deg (south-east), Trois-Rivières to Bécancour.
  frontageBearing: 130.1,
  // The provider draws no building on the deck: nothing for the layer to replace.
  footprintless: true,
  // Full 3D world: authored above the river, no corridor flattening; the deck takes its real absolute
  // heights, supports reach the DEM and the ends blend into the terrain roads (bridge-layer.js, layer.js).
  terrainPolicy: 'absolute-deck',
};

// Same keys in both themes. The bridge layer draws every name with baked directional shading (asphalt is
// recoloured to the map's own pavement at run time). The arch and trusses are painted turquoise green, the
// approach plate girders a darker grey-green, the piers bare concrete; the hangers are dark steel rope. At
// night the steel falls dark but stays readable against the sky, the road lamps glow and the crown carries
// red obstruction lights.
export const PALETTES = {
  light: { steel: '#3f9c98', girder: '#55625f', floor: '#4b5553', cable: '#3c4446', concrete: '#c9c6bb', asphalt: '#555d63', paint: '#eceadf', lamp: '#f1ead4', light: '#e0453a' },
  dark: { steel: '#3d6f70', girder: '#3a4244', floor: '#323a3d', cable: '#2c3336', concrete: '#6c7279', asphalt: '#303c47', paint: '#b9bdbe', lamp: '#ffcf73', light: '#ff4a3d' },
};

export const MANIFEST = {
  elevationDatum: 'Local y = 0 is high water on the flat Peregrine basemap; no absolute altitude, DEM or latitude stretch is baked in. The road surface is authored on one vertical profile: ramps from grade 0 on the approach roads (75 m beyond the north end, 115 m beyond the south end), 4.4 m and 6.2 m at the bridge ends, 52.0 m at the crest over the arch (published 52.02 m from high water to the top of the deck). Cityscape fits the ramp feet to the loaded approach roads; Full 3D world refits the same shape between the terrain roads and 58.0 m above sea level (high water 6.02 m) at run time (pont-laviolette-profile.js, layer.js).',
  attribution: 'Original procedural mesh. Alignment (A-55 carriageways, approach roads and the roads passing under the approaches) © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: 2,707 m long; steel structure 1,383 m with a 335 m central span (a 269 m arch hung between two 33 m cantilevers) and 167 m anchor spans; steel approaches 641 m north and 683 m south (plate girders, then precast girders from pier S10); 34 piers and 2 abutments; deck 16.7 m wide, four lanes, a central wall; 52.02 m from high water to the deck top; 106.6 m overall; 304.8 m x 49.4 m navigation clearance; rope hangers at every lower-chord panel point of the arch. Mapped: the two carriageways, the bridge ends, the approach roads and the roads that pass under the approaches. Estimated: the main span placed 641 + 3 x 119 + 167 m from the north end, three equal 119 m truss spans each side, the approach pier positions (between the roads underneath), the vertical profile apart from the crest (knees over the roads under the ends, 3.7-3.9 % grades, a 700 m crest curve), truss depths and chord curves, panel counts, pier shapes, colours, lamp spacing. Flat-map convention: ramps on the approach roads, 75 m north and 115 m south of the bridge ends, steepest grade 9.3 %.',
};
