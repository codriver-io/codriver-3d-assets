// Pont Papineau-Leblanc, Autoroute 19 over the Rivière des Prairies · Montréal (Ahuntsic)–Laval, 1969.
// One of the first cable-stayed bridges in North America and the first with its towers in the roadway
// median: a rust-brown weathering-steel box girder with an orthotropic deck, 241 m main span between two
// 90 m side spans, hung from two single steel pylons by a fan of stays in one central plane. Fitted to the
// mapped A-19 carriageways by pont-papineau-leblanc-profile.js and drawn by createRegistryBridgeLayer
// (layer.js). Facts and estimates: docs/3d-quebec-pont-papineau-leblanc.md.
export const SPEC = {
  id: 'pont-papineau-leblanc', name: 'Pont Papineau-Leblanc', kind: 'bridge',
  ready: true, // the road layer, its tests and the near/far exports exist and pass
  // Structural anchor: the centre of the 241 m main span on the averaged straight axis of the two mapped
  // carriageways (OSM 965280263/165090517), the cable-stayed unit centred on the mapped bridge ways. No
  // pier is mapped.
  origin: [-73.6668392, 45.5761582],
  // Pylon tops: 38.4 m (published) above the 11.3 m deck (published height above the water); local y = 0
  // is the water.
  height: 49.7, padM: 60,
  // The bridge axis runs 142.5 deg (south-east), Laval to Montréal.
  frontageBearing: 142.5,
  // The provider draws no building on the deck: nothing for the layer to replace.
  footprintless: true,
  // Full 3D world: authored above the river, no corridor flattening; the deck takes its real absolute
  // heights, supports reach the DEM and the ends blend into the terrain roads (bridge-layer.js, layer.js).
  terrainPolicy: 'absolute-deck',
};

// Same keys in both themes. The bridge layer draws every name with baked directional shading (asphalt is
// recoloured to the map's own pavement at run time). Weathering steel (deck plate, box girder) weathers to a
// dark rust brown; the pylons read near-black chocolate in the photographs (their own `pylon` colour); the
// stays are dark steel; parapets, piers and abutments bare concrete; lamp posts
// galvanised. At night the steel falls dark, the road lamps glow and the pylon tops carry red obstruction
// lights.
export const PALETTES = {
  light: { steel: '#6b4632', girder: '#5c3d2c', pylon: '#372a24', cable: '#3b3634', concrete: '#c4c0b6', asphalt: '#555d63', paint: '#eceadf', pole: '#9ea3a6', lamp: '#f1ead4', light: '#e0453a' },
  dark: { steel: '#4a3328', girder: '#36271f', pylon: '#251f1e', cable: '#4a4643', concrete: '#686d74', asphalt: '#303c47', paint: '#b9bdbe', pole: '#565c62', lamp: '#ffcf73', light: '#ff4a3d' },
};

export const MANIFEST = {
  elevationDatum: 'Local y = 0 is the river on the flat Peregrine basemap; no absolute altitude, DEM or latitude stretch is baked in. The road surface is authored on one vertical profile: ramps from grade 0 on the approach roads (85 m beyond the Laval end, 120 m beyond the Montréal end), level at 11.3 m (published deck height above the water) across the main span. Cityscape fits the ramp feet to the loaded approach roads; Full 3D world refits the deck between the terrain roads and 28.2 m above sea level (river 16.9 m) at run time (pont-papineau-leblanc-profile.js, layer.js).',
  attribution: 'Original procedural mesh. Alignment (A-19 carriageways, approach roads, bridge outline and the ways passing under the ends) © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: opened 1969, cable-stayed with a fan of stays, weathering steel, orthotropic deck; 241 m main span, 90 m side spans, 421 m cable-stayed length (458.6 m over the abutments); 27.2 m wide, six lanes; two central steel pylons 1.8 m x 1.8 m, 38.4 m above the deck; four stay bundles of 12 cables; stays every 43-52 m along the deck; deck 11.3 m above the water, 7.6 m clearance. Mapped: the two carriageways (444.9 m, 142.4°), approach roads, junctions, bridge outline. Estimated: the cable-stayed unit centred on the mapped bridge (no pier is mapped), the stay anchor stations, the box-girder section, pier and abutment shapes, the short end spans, the vertical profile apart from the deck height, colours, lamps. Flat-map convention: ramps on the approach roads, 85 m (Laval, short of the Boulevard Lévesque exit) and 120 m (Montréal) beyond the bridge ends, steepest grade 7.2 %.',
};
