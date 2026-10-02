// Shared dimensions and the bridge frame of the Peace Bridge (Calatrava, 2012), so the geometry, the
// inspector cameras, the config's terrain pad and the tests read one set of numbers.
//
// Frame. The model is authored in the bridge's own coordinates and turned once onto the mapped axis:
//   u  metres along the axis, 0 at mid-span, positive toward the SOUTH-EAST end (Sunnyside / Memorial Drive bank);
//   y  metres above local flat-map grade (y = 0 is the provider's footway grade, both banks);
//   v  metres across the axis, positive to the right when facing +u (the south-west, upstream-ish side).
// The axis bearing comes from the two end nodes of the mapped cycleway (OSM way 158753074, Mercator
// bearing 137.88 deg); the origin is that way's middle node, which is also mid-span of the mapped outline
// (OSM way 1313657677, building=bridge, 120.6 x 7.25 m, centred on it to the centimetre).
export const BEARING = 137.88; // degrees clockwise from north, toward +u
export const YAW = (90 - BEARING) * Math.PI / 180; // rotation about +Y that carries +u onto the bearing

/** Bridge coordinate (u, y, v) to scene metres (x east, y up, z south) around SPEC.origin. */
export function toScene(u, y, v) {
  const b = BEARING * Math.PI / 180;
  return [u * Math.sin(b) + v * Math.cos(b), y, -u * Math.cos(b) + v * Math.sin(b)];
}
/** Scene point to bridge coordinate: the inverse of toScene. */
export function toBridge(x, y, z) {
  const b = BEARING * Math.PI / 180;
  return { u: x * Math.sin(b) - z * Math.cos(b), y, v: x * Math.cos(b) + z * Math.sin(b) };
}

// SOURCED (Wikipedia, "Peace Bridge (Calgary)", infobox and Dimensions): single span, tube girder 126 m, out to
// out 130.6 m, total height 5.85 m, inside width 6.2 m (3.7 m pedestrians + 2.5 m cycleway), helical steel
// structure with a glass roof, no pier in the water, reinforced-concrete abutments and deck.
// MAPPED (OSM): axis, origin and the 7.25 m outline width of way 1313657677 (outline length 120.6 m).
// ESTIMATED (read from the Commons photographs): the ring shape, tube sizes, strand count and pitch, rail
// height, panel layout, abutment mass.
export const DIM = {
  // sourced
  outToOut: 130.6, tubeLength: 126, height: 5.85, inside: 6.2, pedestrian: 3.7, cycleway: 2.5,
  // mapped
  outlineWidth: 7.25, outlineLength: 120.6,
  // estimated
  deckY: 0.05, // walking surface: 5 cm over the provider's footway so the two never fight
  slab: 0.45, // deck slab thickness
  deckHalf: 3.1, // half of the 6.2 m inside width
  ringA: 3.45, // half width of the tube ring centre line (outer face 3.63 = half of the mapped 7.25 m outline)
  ringB: 2.745, // half height of the ring centre line: 2 x (2.745 + 0.18) = the sourced 5.85 m total height
  strandR: 0.25, // helix tube radius, near LOD (diameter 0.5 m; the photographs show members of about 0.5-0.7 m)
  strandRFar: 0.35, // helix tube radius, far LOD: fatter so the lattice still reads beyond about 200 m
  hoopR: 0.18, // ring (hoop) tube radius
  endHoopR: 0.30, // heavier end rings where the strands land on the abutments
  strands: 6, // strands of each hand: 6 right-handed + 6 left-handed make the double helix
  halfCells: 40, // planes between the end rings: nodes every 3.15 m along the axis
  abutIn: 62.6, // abutment front face along the axis (just inside the end rings)
  abutDepth: -2.9, // abutment base: nothing below -3 m on the flat Cityscape map
  abutHalf: 4.0, // abutment half width (8 m total width)
};
DIM.tubeHalf = DIM.tubeLength / 2; // 63.0
DIM.halfOverall = DIM.outToOut / 2; // 65.3
DIM.planeStep = DIM.tubeLength / DIM.halfCells; // 3.15 m between node planes
DIM.pitch = 2 * DIM.strands * DIM.planeStep; // 37.8 m: axis length of one full turn of a strand
DIM.omega = 2 * Math.PI / DIM.pitch; // radians per metre
// Ring centre height so the crown is `height - underDeck` above the walking surface and the soffit is
// `underDeck` below it (top of the hoop tube is the bridge's top).
DIM.crownAbove = 4.0; // top of the tubes above the walking surface
DIM.ringYc = DIM.deckY + DIM.crownAbove - DIM.hoopR - DIM.ringB;
DIM.topY = DIM.ringYc + DIM.ringB + DIM.hoopR;
DIM.bottomY = DIM.ringYc - DIM.ringB - DIM.hoopR;

/**
 * Point on the tube-ring centre line at angle th (0 = +v side, 90 deg = crown) and axis position u. `inset` pulls it
 * in toward the axis (both semi-axes shrink by it): the strands are fatter than the hoops, so their centre line
 * sits `strandR - hoopR` inside the hoops' and every tube keeps the same outer envelope (7.25 m x 5.85 m).
 */
export const ringPoint = (th, u, inset = 0) => [u, DIM.ringYc + (DIM.ringB - inset) * Math.sin(th), (DIM.ringA - inset) * Math.cos(th)];
/** Inset of a strand centre line for a strand tube of radius r (see ringPoint). */
export const strandInset = (r) => r - DIM.hoopR;
/** Angle of strand j of a hand (+1 right, -1 left) at axis position u. */
export const strandAngle = (hand, j, u) => 2 * Math.PI * j / DIM.strands + hand * DIM.omega * u;
/** Axis position of node plane q (q = -halfCells/2 .. +halfCells/2). Even planes also carry the hoops. */
export const planeU = (q) => q * DIM.planeStep;
/**
 * Roof cells: diamonds whose centre is on the glazed arc, from 30 to 150 degrees round the ring (sin >= 0.45: five of
 * the six diamond rows, down to the shoulders; the photographs show glass all over the upper openings and open
 * sides below). Returns [{ c, phi }] by centre plane c and angle phi.
 */
export function roofCells() {
  const half = DIM.halfCells / 2, out = [];
  for (let c = -half + 1; c <= half - 1; c++) {
    for (let j = 0; j < DIM.strands; j++) {
      const phi = (Math.PI / DIM.strands) * (2 * j + c + 1);
      if (Math.sin(phi) >= 0.45) out.push({ c, phi: Math.atan2(Math.sin(phi), Math.cos(phi)) });
    }
  }
  return out;
}
