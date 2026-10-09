// Nidaros Cathedral (Nidarosdomen), Trondheim. Kongsgårdsgata, on the river terrace south of the centre.
// Height is the 2016 control survey (Store norske leksikon): the tower with its spire is 87 m.
// Older guides said 91 m, and some popular accounts still say about 97 m.
export const SPEC = {
  id: 'nidaros-cathedral',
  name: 'Nidaros Cathedral',
  kind: 'building',
  ready: true,
  origin: [10.3968665, 63.4269167], // centroid of OSM way 417245741
  height: 87,
  padM: 70,
  frontageBearing: 268.108, // west screen, 1.892° south of due west
};

export const PALETTES = {
  light: {
    stone: '#6f746c', // grey-green soapstone
    trim: '#626760', // ribs and statue bands, a step darker than the wall
    recess: '#2a312e',
    roof: '#5f9a82', // muted verdigris
    spire: '#5f9a82',
    glass: '#3d5160',
    glow: '#3e5166',
  },
  dark: {
    stone: '#454944',
    trim: '#3a3e3a',
    recess: '#1c221f',
    roof: '#2c4e40',
    spire: '#356454',
    glass: '#1a242e',
    glow: '#f0c27a',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the west-front pavement. The close is a flat river terrace; no absolute altitude is baked in.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Heights follow Store norske leksikon (102 × 50 m, nave vault 21 m, tower and spire 87 m after the 2016 survey) and the OSM Simple 3D eaves. The copper spire ends at 84 m and a cross carries the tip to 87 m; OSM tags the copper at 82 m. West-front statues are relief bands, not the restored portrait set. Bay count is the seven mapped aisle nibs. The chapter house is a hall with an east apse, not the real miniature cruciform plan. No terrain pad: the terrace under the footprint varies by less than 2 m.',
};
