// The historic 1939 headhouse; platforms and neighboring offices remain provider-owned.
export const SPEC = {
  id: 'los-angeles-union-station', name: 'Los Angeles Union Station', kind: 'building',
  ready: true, origin: [-118.23615775695308, 34.05605795849651], height: 38.71, padM: 145, frontageBearing: 280,
};
export const PALETTES = {
  light: { stucco: '#e8dfcc', trim: '#b69b78', roof: '#774a38', glass: '#3c4945', bronze: '#78684b', glow: '#716951', foliage: '#526b42', trunk: '#84715a' },
  dark: { stucco: '#777b7c', trim: '#6d6d67', roof: '#503e38', glass: '#283438', bronze: '#575449', glow: '#b9985b', foliage: '#35473a', trunk: '#534d45' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local pavement y=0; no absolute altitude or terrain baked in.',
  attribution: 'Original procedural geometry by Codriver. Mapped outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Present historic Mission Moderne headhouse. Tower 127 ft (38.71 m), four 12 ft clocks from the official historic guide; plans from OSM relation 1483140 plus canopy ways 1409126574, 1409126588 and 1409126586. Hall heights, roof pitch, tower tiers and rear ranges estimated from photographs. Rotation -10 degrees baked in. Platforms and neighboring offices excluded. Both-mode local snapshot QA recorded separately; terrain and lifecycle certification are not implied.',
};
