// Frank Gehry's 2014 museum in the Bois de Boulogne; metric frame at the mapped outline's centre.
export const SPEC = {
  id: 'fondation-louis-vuitton', name: 'Fondation Louis Vuitton', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [2.26333, 48.87667], height: 46, padM: 70,
  frontageBearing: 108, // OSM outline's longest edge (bearing 108 deg, west-north-west to east-south-east)
};
export const PALETTES = {
  light: { ice: '#e8e5db', stone: '#d6ccb6', glass: '#9db4bb', metal: '#c4ccd0', frame: '#d9dedf', steel: '#8e979c', timber: '#b3814a', water: '#5b7c86', glow: '#f1d9a0' },
  dark: { ice: '#8d9199', stone: '#80807f', glass: '#3c5662', metal: '#7b878f', frame: '#8b9499', steel: '#5f696f', timber: '#7a5a3c', water: '#1f343d', glow: '#ffd78a' },
};
export const MANIFEST = {
  elevationDatum: 'Local terrace grade y=0 on the flat Peregrine basemap; no absolute altitude baked in.',
  attribution: 'Original procedural geometry, Codriver 2026. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Twelve glass sails, iceberg block layout, sail sizes and the basin are estimated from attributed photographs; the 46 m top and the mapped outline are the fixed constraints. No textures or external meshes.',
};
