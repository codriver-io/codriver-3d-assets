// Pont Pierre-Laporte, Autoroute 73 over the St. Lawrence · Québec (Sainte-Foy)–Lévis, 1970.
// A road-carrying suspension bridge: fitted to the mapped OSM carriageways by
// pont-pierre-laporte-profile.js and drawn by createRegistryBridgeLayer (layer.js).
// Facts and estimates: docs/3d-quebec-pont-pierre-laporte.md.
export const SPEC = {
  id: 'pont-pierre-laporte', name: 'Pont Pierre-Laporte', kind: 'bridge',
  ready: true, // the road layer, its tests and the near/far exports exist and pass
  // Structural anchor: mid-span, halfway between the two mapped ends of the bridge carriageways
  // (OSM ways 157685069/157685071) on their averaged straight axis. No tower is mapped.
  origin: [-71.290433, 46.7451018],
  // Towers 122.5 m (402 ft) above mean high water; local y = 0 is mean high water.
  height: 122.5, padM: 60,
  // The bridge axis runs 157.6 deg (south-south-east), Québec to Lévis.
  frontageBearing: 157.6,
  // The provider draws no building on the deck: nothing for the layer to replace.
  footprintless: true,
  // Full 3D world: authored above the river, so no corridor flattening; the structure keeps its heights,
  // supports reach the DEM and the ramps blend into the terrain roads (bridge-layer.js, layer.js).
  terrainPolicy: 'absolute-deck',
};

// Same keys in both themes. The bridge layer draws every name with baked directional shading (asphalt
// is recoloured to the map's own pavement at run time). The towers are painted a pale cream; the
// stiffening trusses, floor and railings are grey steel; the cables and suspenders a darker grey. At
// night the unlit towers and steel fall dark, the road lamps glow and the tower tops carry red
// obstruction lights.
export const PALETTES = {
  light: {
    tower: '#ddd3ba', steel: '#9ea4a4', cable: '#80878b', concrete: '#c4bfb2', asphalt: '#555d63', paint: '#eceadf', lamp: '#f1ead4', light: '#e0453a',
  },
  dark: {
    tower: '#8f8b7e', steel: '#727a7f', cable: '#6a737a', concrete: '#6c7279', asphalt: '#303c47', paint: '#b9bdbe', lamp: '#ffcf73', light: '#ff4a3d',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local y = 0 is mean high water on the flat Peregrine basemap; no absolute altitude, DEM or latitude stretch is baked in. The road surface is authored level at 54.0 m from the north anchorage to the south anchorage (45.7 m published clearance at mid-span plus an estimated 8.3 m truss and floor) and the ends ease to the approach roads at run time (bridge-profile.js; the real-deck profile in Full 3D world, layer.js).',
  attribution: 'Original procedural mesh. Alignment (A-73 carriageways and approach roads) © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: main span 667.5 m, side spans 186.5 m, 1,040.6 m between anchorages, towers 122.5 m above mean high water, 45.7 m clearance at mid-span, cable planes 27.4 m apart, roadway 21.9 m, six lanes, cables 0.62 m. Mapped: the two carriageways, the bridge ends and the approach roads. Estimated: tower positions (centred on the mapped bridge, both at the water\'s edge), leg sections and taper, portal arches, the deck-level strut, truss depth and panel layout, suspender spacing (15.2 m), cable sag, anchorage and pier massing, approach viaduct piers, lamp spacing. Flat-map convention: the deck is level between the anchorages and ramps over 800 m at each end down to the approach roads (steepest grade 10.1 %).',
};
