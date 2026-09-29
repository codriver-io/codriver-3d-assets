// The Humber Bay Arch Bridge's structural frame, shared by the geometry and its
// tests so both read one set of numbers.
//
// Local frame BEFORE the bearing rotation: u runs along the bridge axis (west
// end negative, east end positive), v across it (right-hand side positive), y
// up from the flat-map datum. geometry.js rotates u/v onto the mapped bearing.
//
// SOURCED  (Wikipedia, Montgomery Sisam, Structurae; see the catalog record):
//   overall length 139 m, clear span 100 m, two steel-pipe ribs of 1 200 mm,
//   44 stainless hangers of 50 mm, arch rise 21.3 m "above grade", parabolic
//   ribs, post-tensioned concrete deck on steel beams hung from the hangers,
//   oversized concrete abutments, triangulated steel between the ribs.
// ESTIMATED (read off the Commons photographs listed in the catalog record):
//   everything else here, the deck height above water, deck and rib offsets,
//   the ramp that lets a deck 4.5 m above the flat datum meet the ground.
export const DIM = {
  // sourced
  overall: 139, clearSpan: 100, ribDiameter: 1.2, hangerDiameter: 0.05, hangerCount: 44, riseAboveGrade: 21.3,
  // estimated
  deckY: 4.5,            // paving surface above water / flat datum
  deckHalf: 2.7,         // half width between rail lines
  slab: 0.3,             // paving slab thickness
  girderDepth: 0.62,     // dark steel edge beam below the surface
  outrigger: 3.35,       // white cross beams stop here; hangers land here
  springU: 50.8,         // rib centre at the springing, along the axis
  springY: 0.6,          // rib centre at the springing
  springV: 5.5,          // rib centre offset at the springing (OSM plan outline flares to 6.2 m at the springings)
  crownV: 1.65,          // rib centre offset at the crown (ribs lean inwards, about 3.3 m apart)
  approachU: 69.5,       // 139 / 2: end of the level abutment platform
  rampLength: 30,        // flat-map adaptation: a deck 4.5 m up meets ground at y=0
  hangerSpan: 42.6,      // outermost hanger along the axis (a rod at least 2 m long)
  hangersPerRib: 22,
  ladderClear: 4.6,      // the steel between the ribs starts where the pipes are this far above the deck (headroom under the spine)
  finDrop: 1.5,          // the white triangular fin under the rib carries each hanger this far below the pipe centre line
  spineDrop: 0.5,        // the central spine hangs this far below the rib centre line
  spineDepth: 1.2,       // and is this deep
  spineHalf: 0.45,       // half width of the central spine
};

// Rib crown (centre line) and the pipe's top surface, which is the bridge's height.
DIM.crownY = DIM.deckY + DIM.riseAboveGrade - DIM.ribDiameter / 2;
DIM.topY = DIM.crownY + DIM.ribDiameter / 2;
DIM.halfLength = DIM.approachU + DIM.rampLength;
// Axis position where a rib centre line is `ladderClear` above the paving: the ladder between the ribs starts there.
DIM.ladderFoot = DIM.springU * Math.sqrt(1 - (DIM.deckY + DIM.ladderClear - DIM.springY) / (DIM.crownY - DIM.springY));

/** Rib centre-line height at axis position u (a parabola through the springings). */
export const ribY = (u) => DIM.springY + (DIM.crownY - DIM.springY) * (1 - (u / DIM.springU) ** 2);
/** Rib centre-line offset from the axis at height y: the plane leans in, linearly. */
export const ribV = (y) => DIM.springV - (DIM.springV - DIM.crownV) * (y - DIM.springY) / (DIM.crownY - DIM.springY);
/** Point on the +v (side = 1) or -v (side = -1) rib centre line at axis position u. */
export const ribPoint = (side, u) => { const y = ribY(u); return [u, y, side * ribV(y)]; };

/** Axis positions of one rib's hangers: 22 per rib, 44 in all. */
export const hangerStations = () => Array.from({ length: DIM.hangersPerRib }, (_, k) => -DIM.hangerSpan + (2 * DIM.hangerSpan * k) / (DIM.hangersPerRib - 1));

/** Where a hanger starts (the tip of the fin under the rib pipe) and ends (on the outrigger tip). */
export const hangerEnds = (side, u) => {
  const y = ribY(u) - DIM.finDrop, top = [u, y, side * ribV(y)];
  return [top, [u, DIM.deckY - 0.28, side * DIM.outrigger]];
};

/** Paving surface height along the axis: level through the abutments, then down the ramp to the ground. */
export const surfaceY = (u) => {
  const a = Math.abs(u);
  if (a <= DIM.approachU) return DIM.deckY;
  return Math.max(0, DIM.deckY * (1 - (a - DIM.approachU) / DIM.rampLength));
};
