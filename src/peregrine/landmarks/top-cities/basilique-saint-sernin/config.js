// Place Saint-Sernin, Toulouse. Current Romanesque basilica, original procedural model.
export const SPEC = {
  id: 'basilique-saint-sernin', name: 'Basilique Saint-Sernin', kind: 'building',
  ready: true,
  origin: [1.44197, 43.60838], // dossier anchor, crossing 19 m ENE in the authoring frame
  height: 65, // Toulouse Mairie Métropole; OSM's 67 m is not used
  padM: 64,
  frontageBearing: 238.706961, // west front, mapped nave axis
};
export const PALETTES = {
  light: { brick: '#9b6a54', stone: '#c9b99a', roof: '#6c503a', tile: '#987455', recess: '#32312e', glass: '#455350', iron: '#71685a', spire: '#667078' },
  dark: { brick: '#61483d', stone: '#887a61', roof: '#392f29', tile: '#564538', recess: '#1b2024', glass: '#283437', iron: '#55534b', spire: '#3e4951' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat grade y=0 at Place Saint-Sernin. No terrain/sea-level elevation or latitude stretch baked in.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Official city: 115 m length, 64 m transept, 65 m tower. The model follows the approximately 110 × 63 m mapped exterior envelope rather than stretching it; OSM roof/eaves levels and photographic detail are approximate. Five brick octagonal belfry tiers with recessed backed bays, terracotta roofs, chevet chapels and Renaissance gate. Sculpture and the 2024 Othoniel rose glazing are simplified; no interiors. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
