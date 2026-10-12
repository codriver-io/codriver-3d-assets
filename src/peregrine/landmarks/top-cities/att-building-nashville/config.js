// 333 Commerce, former AT&T/BellSouth tower; 1994 architectural silhouette.
export const SPEC = {
  id: 'att-building-nashville', name: 'AT&T Building ("Batman Building")', kind: 'building',
  ready: true, origin: [-86.7769592, 36.1624127], height: 188, padM: 62,
  frontageBearing: 197, planBearingDeg: 107, roofY: 138, crownY: 161,
};
export const PALETTES = {
  light: { stone: '#bcb9aa', glass: '#234457', crown: '#547d8f', brick: '#80594e', roof: '#777c78', metal: '#8b9a9e', glow: '#294b5b' },
  dark: { stone: '#747e84', glass: '#162e40', crown: '#2e5367', brick: '#51454a', roof: '#3e484d', metal: '#748591', glow: '#d2b580' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid base, no absolute elevation or terrain baked into geometry.',
  attribution: 'Original procedural mesh; mapped footprints © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '188 m spire height, 138 m occupied roof and 33 storeys sourced; plan and 107 degree axis mapped from OSM. Crown, stepped piers, window grid, winter garden and spire tier dimensions estimated from reference photographs. Both placement modes require separate integration review.',
};
