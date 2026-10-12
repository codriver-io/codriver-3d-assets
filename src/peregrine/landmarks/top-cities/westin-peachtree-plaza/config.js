// Westin Peachtree Plaza, Atlanta. Geographic rotation is baked into geometry.
export const SPEC = {
  id: 'westin-peachtree-plaza', name: 'Westin Peachtree Plaza', kind: 'building', ready: false,
  origin: [-84.388577, 33.7594283], height: 220.37, radius: 19.6, podiumHeight: 24,
  restaurantBase: 208.2, restaurantTop: 218.9,
  elevatorBearing: 58, elevatorOffset: 20.5, elevatorRadius: 2.55,
  padM: 68, frontageBearing: 90.3,
};
export const PALETTES = {
  light: { glass: '#7d8178', glassShade: '#777970', elevatorGlass: '#6e858b', frame: '#4c4f49', stone: '#a39f91', roof: '#656960', glow: '#656b62' },
  dark: { glass: '#435159', glassShade: '#3e4c52', elevatorGlass: '#3f5965', frame: '#30383d', stone: '#505b61', roof: '#354149', glow: '#b8a477' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map hotel grade y=0; rigid base, no sea level or DEM baked in.',
  attribution: 'Original procedural model for Codriver, CC BY 4.0. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '220.37 m roof; 39.2 m diameter fitted independently to OSM, versus a conflicting published 57 m. Restaurant tiers, facade bays and podium heights are photo estimates. Historical 269.1 m antenna omitted: current mast configuration unverified. Both app modes require separate integration QA.',
};
