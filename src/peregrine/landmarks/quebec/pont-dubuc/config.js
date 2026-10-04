// Pont Dubuc, Route 175 over the Saguenay · Chicoutimi–Chicoutimi-Nord (Saguenay), opened October 1972.
// An ordinary, functional crossing rather than an architectural one: a 458 m continuous steel box-girder
// deck in seven spans on twin-column concrete piers, four lanes split by a median wall, a sidewalk each
// side. It replaced the 1933 Pont de Sainte-Anne (the truss bridge 250 m downstream). Fitted to the mapped
// Route 175 carriageways by pont-dubuc-profile.js and drawn by createRegistryBridgeLayer (layer.js).
// Facts and estimates: docs/3d-quebec-pont-dubuc.md.
export const SPEC = {
  id: 'pont-dubuc', name: 'Pont Dubuc', kind: 'bridge',
  ready: true, // the road layer, its tests and the near/far exports exist and pass
  // Structural anchor: the middle of the mapped bridge (OSM 252486247/1387995420, 485.5 m) on the averaged
  // straight axis of the two carriageways. No pier is mapped.
  origin: [-71.0704956, 48.4327514],
  // Lamp-post tops on the median, 12 m above a deck 12 m above the river (local y = 0).
  height: 24.2, padM: 60,
  // The bridge axis runs 20.7 deg (north-north-east), Chicoutimi to Chicoutimi-Nord.
  frontageBearing: 20.7,
  // The provider draws no building on the deck: nothing for the layer to replace.
  footprintless: true,
  // Full 3D world: authored above the river, no corridor flattening; the deck takes its real absolute
  // heights, the piers reach the DEM and the ends blend into the terrain roads (bridge-layer.js, layer.js).
  terrainPolicy: 'absolute-deck',
};

// Same keys in both themes. The bridge layer draws every name with baked directional shading (asphalt is
// recoloured to the map's own pavement at run time). The steel box, its brackets and the fascia stringers
// are painted a dark green; the piers, parapets and median wall are bare concrete; the railings and lamp
// posts are galvanised steel. At night the steel falls dark and the 26 sodium lamps glow amber.
export const PALETTES = {
  light: { steel: '#3f6a5c', concrete: '#c6c3b8', asphalt: '#555d63', paint: '#eceadf', rail: '#a9b0b2', lamp: '#f1ead4' },
  dark: { steel: '#2f4a43', concrete: '#6c7279', asphalt: '#303c47', paint: '#b9bdbe', rail: '#7d878c', lamp: '#ffc46b' },
};

export const MANIFEST = {
  elevationDatum: 'Local y = 0 is the Saguenay on the flat Peregrine basemap; no absolute altitude, DEM or latitude stretch is baked in. The road surface is authored on one vertical profile: ramps from grade 0 at the alignment ends (35 m beyond the mapped south end, just before the southbound exit; the mapped north end, just before Route 172 passes under the Route 175) to 12.0 m over the river spans. Cityscape fits the ramp feet to the loaded approach roads; Full 3D world refits the same shape between the terrain roads and 16.0 m above sea level (the DEM river at 4 m) at run time (pont-dubuc-profile.js, layer.js).',
  attribution: 'Original procedural mesh. Alignment (Route 175 carriageways, the approach roads, the junctions and the roads passing under the north approach) © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: opened October 1972 (built 1970-1972, 12 M$); 458 m in seven continuous spans on steel box girders with plate-girder members, seven reinforced-concrete piers; four lanes separated by a concrete wall; 13 lamp posts with two lamps each; refurbished 2016-2023 (girders sandblasted and repainted). Mapped: the two carriageways (485.5 m, straight at 20.7 deg), the bridge outline (22.9 m wide, a joint 26 m from the south end), the sidewalks, the junctions and roads at both ends. Estimated: the span layout (two 53 m end spans and five 70.4 m spans; photographs show equal interior spans), the box girder running south over the concrete end pier P1 (at the mapped outline joint, 26 m from the south end) to the abutment, as far as the flat-map deck can hold it, the deck height (12 m above the river), the cross-section, the box and bracket dimensions, the pier shapes, colours and lamp spacing. Flat-map convention: the ramps climb over the end spans (no room on the approach roads, see the documentation); steepest grade 6.7 %.',
};
