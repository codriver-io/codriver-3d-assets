// Third Granville Street Bridge (1954), with the 2025 west-side Connector.
export const SPEC = {
  id: 'granville-street-bridge', name: 'Granville Street Bridge', kind: 'bridge',
  ready: true, origin: [-123.133049, 49.272551], height: 42.5,
  padM: 850, frontageBearing: 45.2, footprintless: true,
};
export const PALETTES = {
  light: { concrete: '#bcbcaf', steel: '#63706b', asphalt: '#535b60', rail: '#8c9691', paint: '#e5e6d9', yellow: '#cab15a', lamp: '#dfded0' },
  dark: { concrete: '#707b80', steel: '#50686c', asphalt: '#29363d', rail: '#788b93', paint: '#aab5b8', yellow: '#a89656', lamp: '#ebd6a0' },
};
export const MANIFEST = {
  elevationDatum: 'Local metres east/up/south. Authored y=0 is sea/flat-map grade; deck 35 m, estimated from 27.4 m published clearance plus midspan truss/slab depth. Absolute-deck world policy fits ramp ends and pier feet to the shared DEM; no DEM baked into vertices.',
  attribution: 'Original procedural geometry; mapped alignment and envelope © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1954 fixed deck-truss bridge: seven steel spans, published range 29–121 m, concrete approach girders. Individual span registration, support dimensions and truss depth are photo/map estimates. Models the primary Granville crossing; branching Howe/Seymour/Fir/Hemlock ramps remain generic provider structures. Original eight-lane envelope; current west Connector and six fallback vehicle lanes. Original photographs used as references only, no textures.',
};
