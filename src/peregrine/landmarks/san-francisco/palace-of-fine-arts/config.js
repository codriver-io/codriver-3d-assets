// Palace of Fine Arts, 3601 Lyon Street, Marina District · San Francisco, California: Bernard Maybeck's
// 1915 Panama-Pacific Exposition rotunda and colonnades, rebuilt in concrete 1964-1974, with the curved
// exhibition hall (the theatre and former Exploratorium) behind. See docs/3d-san-francisco-palace-of-fine-arts.md
// for the sources, the dimension table and what is estimated.
export const SPEC = {
  id: 'palace-of-fine-arts', name: 'Palace of Fine Arts', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Anchor: the centre of the rotunda dome (the circle of OSM building:part 456820271). Local grade
  // y = 0 is the ground at the foot of the rotunda steps and the colonnade plinths; the lagoon is not modelled.
  origin: [-122.4484043, 37.8029184],
  // Highest point: the crown of the rotunda dome, 162 ft (49.4 m; NRHP / Wikipedia).
  height: 49.4,
  // Disc round the origin that Full 3D world flattens: the farthest mapped part is the hall's north
  // end block, 139 m from the rotunda; the colonnade ends are 110 m out.
  padM: 145,
  // The lagoon-facing front arch looks east by north: compass bearing 80 deg (math angle 10 deg, see
  // palace-of-fine-arts-site.js). The geometry already carries it; nothing is rotated afterwards.
  frontageBearing: 80,
  axisDeg: 10,
};

// Same keys in light and dark. Dark is the night look: dimmer stone; `glow` is the floodlit underside of
// the rotunda (drawn unshaded by the layer, as the real dome is lit from below at night).
export const PALETTES = {
  light: {
    stone: '#e2ae83', stoneDark: '#c79c78', base: '#bda78d', dome: '#e8dfc9', hall: '#cdbfa9', roof: '#8f9492', glow: '#c99863',
  },
  dark: {
    stone: '#a7896f', stoneDark: '#7d5f45', base: '#6e665c', dome: '#b3aa94', hall: '#7a7368', roof: '#50565a', glow: '#ffd9a2',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the ground at the foot of the rotunda steps); no absolute altitude. The lagoon and its banks are not modelled.',
  attribution: 'Original procedural mesh. Mapped footprint, building parts and plan © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan, bearing (arches at 10 deg), pier and colonnade positions, the hall sector, its 12/15/17 m levels and the 49.4 m height come from the mapped OSM building parts and the NRHP/Wikipedia figure of 162 ft; column and arch sizes, entablature stacks, capitals, planter boxes and weeping-woman figures, attic panels and the dome profile are estimated from photographs and simplified. Column capitals are a flared block, fluting is a faceted shaft, sculpture is blocks. No interior, no lagoon, no planting.',
};
