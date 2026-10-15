// Restored clock-tower version of the 1892 Dallas County Courthouse.
export const SPEC = {
  id: 'old-red-courthouse', name: 'Old Red Courthouse', kind: 'building', ready: true,
  origin: [-96.80732, 32.77861], height: 57.5, padM: 37,
  frontageBearing: 255.5, rotationDeg: 14.5,
  eavesM: 22, turretTopM: 30, clockCenterM: 41.5,
};
export const PALETTES = {
  light: { red: '#9e4f39', granite: '#747f8b', trim: '#aaa392', roof: '#73797a', tile: '#743e3c', glass: '#28363a', light: '#ddd9bc' },
  dark: { red: '#603d39', granite: '#4e5b65', trim: '#717d82', roof: '#455563', tile: '#54424a', glass: '#172c39', light: '#d6bd83' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local building foundation y=0; east/up/south real metres, no terrain or altitude baked in.',
  attribution: 'Original procedural geometry by Codriver. Footprint and building parts © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright. Reference photographs are not shipped.',
  note: '1892 Richardsonian Romanesque courthouse with the 2007 reconstructed central clock tower. Complete OSM outline 27940349 and 33 nested parts. Tower tip 57.5 m is a photo-calibrated review estimate (OSM tags give 54 m); 30 m main roofs and turret cone tips follow OSM tags, not a measured survey; floor heights, openings, carving, clock and lantern are photo estimates. Baked 14.5 degree rotation. Cityscape and Full 3D world appearance checked in g8b scratch app captures; lifecycle and device performance not tested.',
};
