// Studio Bell, home of the National Music Centre, 850 4 Street SE, East Village, Calgary: Allied Works Architecture
// (Brad Cloepfil), opened 1 July 2016. Nine interlocking, subtly curved towers clad in glazed terracotta tile (dark gunmetal
// to bronze, with a soft gold sheen low down), narrow vertical slot windows, and an enclosed skybridge that spans 4 Street SE
// and carries on over the restored 1905 King Edward Hotel into the west block. See docs/3d-calgary-studio-bell.md for
// the sources, the dimension table and what is estimated.
export const SPEC = {
  id: 'studio-bell', name: 'Studio Bell, National Music Centre', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Anchor: the bounding-box centre of the mapped outline (OSM way 317559844); it falls over 4 Street SE, about
  // mid-span under the skybridge. Local grade y = 0 is the sidewalk/plaza level round the building.
  origin: [-114.0530586, 51.0445886],
  // Highest point: the sign tower, estimated at 34 m (not published). OSM tags the whole building 15.24 m / 5 levels,
  // which understates the double-height tower volumes; the photographs put the tallest tower at about 34 m.
  height: 34,
  // Disc round the origin that Full 3D world flattens: the farthest mapped corner (the west block) is 52 m out.
  // Downtown East Village is flat (about 1,045 m), so no terrain pad is declared.
  padM: 60,
  // The street front (the long wall onto 4 Street SE, under the skybridge landing) looks west: compass bearing 272 deg.
  // The mapped grid is rotated 2.4 deg clockwise from the cardinal axes; that rotation is baked into the geometry.
  frontageBearing: 272,
};

// Same keys in light and dark. Dark is the night look: dimmer tile; `glow` is the lit slot windows and the entrance
// glazing (drawn unshaded by the layer; by day it reads as dark glass).
export const PALETTES = {
  light: {
    tileDark: '#383a3c', tileBronze: '#443f39', tileGold: '#51483d',
    glass: '#40596a', glow: '#363c40', soffit: '#2e2f31', roof: '#4a4846',
    brick: '#7d4f3e', trim: '#a99c88',
  },
  dark: {
    tileDark: '#323032', tileBronze: '#3d352e', tileGold: '#473d31',
    glass: '#1c2c36', glow: '#e0aa5a', soffit: '#1f1f20', roof: '#403d3a',
    brick: '#6b4638', trim: '#8f8473',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the sidewalk and plaza level round the building); no absolute altitude. Rotation (2.4 deg clockwise from the cardinal grid) is baked into the geometry.',
  attribution: 'Original procedural mesh. Mapped outlines of Studio Bell (way 317559844) and the King Edward Hotel (way 550777783) © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Outline, orientation and the skybridge plan (8.2 m wide, about 32 m from the hotel street face to the east block, with 7 m flared ends) come from OSM; the 35 m span over 4 Street SE and the walkway about 19.8 m (65 ft) above the roadway are published figures quoted by architecture web summaries. Tower heights (34 m tallest), the split into seven east towers plus the west block and the bridge, the 30 m bridge top, the hotel heights (12.6 and 16.8 m for its three and five storeys), the tile tones (dark gunmetal with a bronze sheen, gold only in the lowest 10 m) and course height, slot windows, the triangular window (3.4 m wide, 15 to 22 m up, beside the bridge landing), the concave coves under the bridge ends and the entrance are estimated from photographs. The tower walls are flat with rounded corners (no barrelling). Tiles are merged horizontal courses, not individual tiles. No signage lettering, no interior, no trees or street furniture.',
};
