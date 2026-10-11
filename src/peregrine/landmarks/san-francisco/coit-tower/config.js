// Coit Tower (Coit Memorial Tower), 1 Telegraph Hill Boulevard, San Francisco. Arthur Brown Jr. and Henry
// Howard, 1933. Sourced: 210 ft (64 m) to the crown, unpainted reinforced concrete; an outer fluted shaft of
// 24 grooves 15 degrees apart that tapers by 18 in (top diameter smaller than the base), 180 ft (55 m) high,
// carrying the observation level 32 ft (9.8 m) below the top, an arcade of arches above it; a rotunda and
// stepped entrance volumes at the foot. Mapped (OSM way 28824850 and its building:part ways): the shaft
// circle (r = 5.51 m), the 11.4 m square block (12 m), the porch (10 m), the front step (8 m), the rotunda
// outline and the 345.6 degree front. shaftTopR is the mapped circle (the ledge under the crown); the crown wall
// itself steps in to 5.05 m. See docs/3d-san-francisco-coit-tower.md.
export const SPEC = {
  id: 'coit-tower', name: 'Coit Tower', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-122.4058354, 37.8023738], // the shaft axis: centre of the mapped shaft circle (OSM part 451331530)
  height: 64, // to the crown parapet; no mast, flagpole not modelled
  padM: 18, // the rotunda and entrance terraces reach 12.4 m from the axis; the entrance steps need a little more
  frontageBearing: 345.6, // the porch and the entrance face the Columbus statue forecourt, 14.4 degrees west of north
  // Model facts the geometry, tests and docs share.
  shaftBaseR: 5.74, shaftTopR: 5.51, shaftTopY: 52.9, flutes: 24, bays: 8,
};
export const PALETTES = {
  light: { concrete: '#d8d0c0', concrete_warm: '#dccfbc', recess: '#ada28f', glass: '#37444a', glow: '#b3a995' },
  dark: { concrete: '#aaa69b', concrete_warm: '#ada69b', recess: '#5d6168', glass: '#1a2227', glow: '#dcc795' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 at the entrance forecourt on the flat Peregrine basemap; no absolute altitude. Telegraph Hill is about 85-89 m above sea level there and is not modelled.',
  attribution: 'Original procedural mesh. Mapped footprint, shaft circle, block and entrance steps © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Total height, shaft height, flute count, taper and observation level are published; the crown arch sizes, the rotunda height, the stepped base heights beyond the mapped parts, the pour lines and the relief are estimated from photographs; the Columbus statue (removed 2020), the flagpole, the hill and the car loop are not modelled; interior is empty.',
};
