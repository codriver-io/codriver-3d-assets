// Pont de Québec, Route 175, the CN railway and a walkway over the St. Lawrence · Québec (Sainte-Foy)–Lévis, 1917.
// The world's longest cantilever span: a road-carrying steel K-truss bridge fitted to the mapped Route 175
// roadway by pont-de-quebec-profile.js and drawn by createRegistryBridgeLayer (layer.js).
// Facts and estimates: docs/3d-quebec-pont-de-quebec.md.
export const SPEC = {
  id: 'pont-de-quebec', name: 'Pont de Québec', kind: 'bridge',
  ready: true, // the road layer, its tests and the near/far exports exist and pass
  // Structural anchor: mid-span, halfway between the two mapped ends of the Route 175 roadway (OSM
  // 25734031) on its straight centreline. No pier is mapped.
  origin: [-71.2879747, 46.7457311],
  // Main posts 104 m above high water (published overall height); local y = 0 is high water.
  height: 104, padM: 60,
  // The bridge axis runs 157.6 deg (south-south-east), Québec to Lévis.
  frontageBearing: 157.6,
  // The provider draws no building on the deck: nothing for the layer to replace.
  footprintless: true,
  // Full 3D world: authored above the river, no corridor flattening (bridge-layer.js, layer.js).
  terrainPolicy: 'absolute-deck',
};
// Same keys in both themes. The bridge layer draws every name with baked directional shading (asphalt is
// recoloured to the map's own pavement at run time). The trusses are dark charcoal-brown steel, the piers and abutments are granite, the floor system a darker steel.
// Photographs show dark charcoal-brown steel and dark grey granite (not light grey or beige): both themes are
// scaled down together. At night the road lamps glow and the main posts carry red obstruction lights.
export const PALETTES = {
  light: { steel: '#4b3f38', stone: '#6f6c65', concrete: '#c4bfb2', asphalt: '#555d63', floor: '#5d5e5c', rail: '#4a4642', paint: '#eceadf', lamp: '#f1ead4', light: '#e0453a' },
  dark: { steel: '#484d50', stone: '#454645', concrete: '#6c7279', asphalt: '#303c47', floor: '#3c4146', rail: '#34373b', paint: '#b9bdbe', lamp: '#ffcf73', light: '#ff4a3d' },
};
export const MANIFEST = {
  elevationDatum: 'Local y = 0 is high water on the flat Peregrine basemap; no absolute altitude, DEM or latitude stretch is baked in. The road surface is authored level at 48.0 m between the two mapped bridge ends (45.72 m published clearance plus an estimated 2.3 m chord and floor); beyond them the flat-map ramps ease to the approach roads at run time (bridge-profile.js; the real-deck profile in Full 3D world, layer.js).',
  attribution: 'Original procedural mesh. Alignment (Route 175 roadway and approach roads, CN track, walkway) © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: 987 m long, main span 548.6 m (1,800 ft) between the main piers, anchor arms 157.0 m (515 ft), cantilever arms 176.8 m (580 ft), suspended span 195.07 m (640 ft), 104 m high, 45.72 m clearance at high tide, about 29 m wide; K-truss; three road lanes, one track, one walkway. Mapped: the roadway (9.17 m), the track and the walkway on the bridge, the bridge ends and the approach roads. Estimated: truss spacing 26.8 m (88 ft), the main span centred on the mapped bridge (no pier mapped), main-post and end-post heights, truss depths (21 m at the tips and anchor ends, 33 m at the suspended span crown), panel counts (10/11/12), bracing layout, pier and abutment masonry, the ~62 m deck-truss approach spans, floor depth, lamp spacing. Flat-map convention: the road is level between the bridge ends and ramps 560 m north (9.8 %) and 480 m south (11.7 %) down to the approach roads.',
};
