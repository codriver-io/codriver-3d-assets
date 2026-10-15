// Smithsonian Institution Building (the Castle), Washington, D.C.: James Renwick Jr., 1849-55, Seneca red sandstone.
export const SPEC = {
  id: 'smithsonian-castle', name: 'Smithsonian Institution Building (the Castle)', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-77.026, 38.88875], // Wikipedia/NRHP coordinate of the Castle; the mapped outline (OSM relation 7393969) spans x -63..72, z -28..19 m around it
  height: 44, // m: top of the north (octagonal) tower, 145 ft per Wikipedia
  padM: 80,
  frontageBearing: 0, // the long axis runs due east-west (mapped edges 89-90 deg), the Mall front faces north
  ownTolM: 1.5,
};
export const PALETTES = {
  light: { stone: '#80463f', trim: '#9a6758', slate: '#484d57', glass: '#2d2526' },
  dark: { stone: '#5c3b36', trim: '#704e46', slate: '#3b4049', glass: '#1c1819' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Tower heights 44 m (north), 36 m (campanile), 28 m (south) and the 91 x 37 ft south tower are sourced (Wikipedia/NRHP); roof pitches, eave heights, window rhythm and the minor turrets are estimated from photographs. Integration evidence and limits are recorded separately in the catalog and landmark documentation.',
};
