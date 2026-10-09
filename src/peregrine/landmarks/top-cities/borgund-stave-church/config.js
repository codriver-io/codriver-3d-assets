// Borgund stavkyrkje; dimensions other than the mapped plan are estimates.
export const SPEC = {
  id: 'borgund-stave-church', name: 'Borgund Stave Church', kind: 'building',
  ready: true, origin: [7.81229, 61.047203], height: 20, padM: 12,
  frontageBearing: 256, axisDegrees: 14,
};
export const PALETTES = {
  light: { timber: '#35281f', roof: '#332f29', shingle: '#3c362c', worn: '#4b3b2b', trim: '#231e19', stone: '#716d61' },
  dark: { timber: '#211d1b', roof: '#222426', shingle: '#313337', worn: '#3b3430', trim: '#1b1c1d', stone: '#454e55' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid foundation on local grade y=0; no absolute altitude or terrain baked into the asset.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Conserved Borgund stavkyrkje, c.1180–1200. Mapped plan and 76° eastward nave axis; 20 m overall height and roof heights, gallery openings, timber and simplified dragon carving dimensions estimated from photographs. Separate bell tower and newer church excluded. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
