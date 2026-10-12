// Completed 1992 shell; dimensions and approximations documented in the asset notes.
export const SPEC = {
  id: 'bank-of-america-plaza-atlanta', name: 'Bank of America Plaza (Atlanta)', kind: 'building',
  ready: true, origin: [-84.386139175, 33.770864835], height: 312, padM: 39,
  frontageBearing: 135.89789182665317,
};
export const DESIGN = { angle: 0.801069332099292, roof: 270, pyramidTop: 305.6, crownHalf: 16.52, floors: 55, floor0: 7, pitch: 4.75 };
export const PALETTES = {
  light: { granite: '#79584f', spandrel: '#584943', glass: '#35404a', glow: '#35404a', roof: '#61534d', light: '#b49751' },
  dark: { granite: '#493530', spandrel: '#30292a', glass: '#182531', glow: '#dfcf9d', roof: '#352d2b', light: '#ffcd55' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid foundation grade y=0; no sea-level or DEM height baked in.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '312 m architectural height, 55 floors and red-brown granite/gold crown are sourced. Photo-estimated crown springing at 270 m supersedes the prior literal 284 m roof interpretation to match the visible tapered summit. Mapped serrated plan and southeast facade bearing 135.90 degrees are baked into geometry. Shoulder heights, window spacing and lattice subdivision are photo estimates. Cityscape and Full 3D world are not tested; integration is checked separately.',
};
