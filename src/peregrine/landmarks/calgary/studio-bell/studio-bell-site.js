// Plan of Studio Bell and the King Edward Hotel in the street frame: u runs east along 9 Avenue, v south along
// 4 Street SE, both rotated by THETA (2.4 deg clockwise) from the cardinal axes, origin at the mapped outline's
// bounding-box centre. The OSM outline (way 317559844) is a near-perfect rectangle in this frame: the east block
// u 6.3..48.5 by v -18.1..18.6, the west block u -48.6..-37.2 by v -18.8..17.8, and the skybridge between them.
// Everything here is metres; heights are above local grade y = 0.

export const THETA = 2.4 * Math.PI / 180;
const C = Math.cos(THETA), S = Math.sin(THETA);
export const toLocal = (u, v) => [u * C - v * S, u * S + v * C]; // -> [x east, z south]
export const fromLocal = (x, z) => [x * C + z * S, -x * S + z * C]; // -> [u, v]

// Tower "vessels". Walls are drawn only where they rise above their neighbour, so the towers read as interlocked.
// tone picks the dominant tile family of its terracotta courses. Exterior cell edges stand 0.1 m inside the mapped
// outline; the walls are flat (the real concave swoops are the coves under the bridge, see BRIDGE.cove).
export const CELLS = [
  // east block (seven towers), u 7.3..48.0, v -17.7..18.1
  { id: 'sign', u0: 7.3, u1: 24, v0: -18, v1: -6, h: 34, tone: 'dark', round: { NW: 4 } }, // the tallest, flat-faced "StudioBell" tower
  { id: 'north-east', u0: 24, u1: 48.4, v0: -18, v1: -2, h: 24, tone: 'dark', round: { NE: 5 } },
  { id: 'bridge-pier', u0: 7.3, u1: 24, v0: -6, v1: 8.5, h: 30, tone: 'bronze' }, // lands the skybridge
  { id: 'centre', u0: 24, u1: 38, v0: -2, v1: 9.5, h: 31, tone: 'gold' },
  { id: 'east', u0: 38, u1: 48.4, v0: -2, v1: 9.5, h: 21, tone: 'dark' },
  { id: 'south-west', u0: 7.3, u1: 24, v0: 8.5, v1: 18.5, h: 19, tone: 'bronze', round: { SW: 5 } },
  { id: 'south-east', u0: 24, u1: 48.4, v0: 9.5, v1: 18.5, h: 27, tone: 'dark', round: { SE: 5 } },
  // west block (the ninth tower), behind the hotel
  { id: 'west-block', u0: -48.5, u1: -37.3, v0: -18.7, v1: 17.7, h: 30, tone: 'bronze', round: { NW: 4, SW: 4 } },
];

// King Edward Hotel (1905-1910): brick, a three-storey north part and a five-storey south part; walls are drawn by the
// same neighbour rule, windows and cornice in the geometry.
export const HOTEL = {
  u0: -37.3, u1: -24.7, v0: -18.8, v1: 20.2, vSplit: -4.5, hNorth: 12.6, hSouth: 16.8, cornice: 0.5,
};

// The skybridge. Clear height under it, deck/top levels and plan, with 7 m radius fillets where it grows out of the
// east block and the west block.
export const BRIDGE = {
  soffit: 18.6, // underside; the walkway floor (65 ft = 19.8 m above the roadway) sits ~1.2 m above it
  top: 30,
  vNorth: -4.7, vSouth: 3.5, // flanks (8.2 m wide), from the OSM outline
  uEast: 7.3, uWest: -37.3, // the wall planes it grows out of
  radius: 7,
  // The concave cove where the underside of the bridge sweeps down into the tower wall at each end: a quarter-round of
  // this radius (m) across the straight 8.2 m of the span. The west end is small because it stands 1.8 m over the hotel roof.
  cove: { east: 5.5, west: 1.6 },
};

export const GROUND_COURSE = 1.2; // terracotta course height drawn as merged bands (m)
