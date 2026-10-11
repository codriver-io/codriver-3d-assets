// Conservatory of Flowers, 100 John F Kennedy Drive, Golden Gate Park · San Francisco, California.
// 1879 wood-and-glass Victorian greenhouse. See docs/3d-san-francisco-conservatory-of-flowers.md.
export const SPEC = {
  id: 'conservatory-of-flowers', name: 'Conservatory of Flowers', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Anchor: the axis of the central dome, 3.95 m west and 2.85 m north of the OSM footprint
  // centroid, measured along the building's own axes (way 30675038).
  origin: [-122.460228, 37.772612],
  // Highest point: the finial on the lantern of the central dome, "nearly 60 feet (18 m)".
  height: 18,
  // Terrain pad: the mapped outline reaches 41 m from the dome axis (west lobe corner); the
  // entrance steps and lawn terraces in front are site landscape and are not modelled.
  padM: 48,
  // The front (vestibule, steps, lawn) faces south: the building's own axis is turned 5.9 deg
  // anticlockwise from east-west, so the frontage looks toward bearing 174 deg.
  frontageBearing: 174,
  // Baked rotation of the building frame (p along the long axis, q across it): 5.9 deg about +Y.
  axisDeg: 5.9,
  ownTolM: 0.8,
};
// Materials. `glow` is self-lit (drawn unshaded): it is the lit glazing of the vertical walls,
// drum and lantern. In daylight it must read as pale glass; at night as warm light from inside.
export const PALETTES = {
  light: {
    stone: '#a98a78',  // red-brown masonry foundation course
    frame: '#fbfaf4',  // white-painted wood: arches, mullions, cornices, dormers, finials
    glass: '#86a6b4',  // roof glazing: a cooler, darker blue-grey so the white ribs read (shaded)
    glow: '#a8c1cc',   // wall glazing (unshaded)
    roof: '#6b5f55',   // flat service roof behind the pavilion: warm slate, off the green ground
  },
  dark: {
    stone: '#4e4240',
    frame: '#b4bdc3',
    glass: '#1f3647',
    glow: '#e6d39a',
    roof: '#3b3531',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the foot of the masonry foundation course on the building terrace; the 14-step entrance stair, the lawn terraces and the slope of Conservatory Valley are not modelled. No absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan and axis from OSM way 30675038; dome diameter, drum and lantern heights, wing eave and ridge heights and the rear service houses are estimated from published photographs and an aerial view. Glazing is opaque (glass and glow materials); the glass panes are not individually modelled.',
};
