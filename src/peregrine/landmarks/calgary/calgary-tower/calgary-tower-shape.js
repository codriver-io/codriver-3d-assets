// Calgary Tower: the dimensions and profile functions the mesh, the tests and the docs all read.
// Real metres, +X east, +Y up (0 = flat-map grade), +Z south, about the tower's axis (config.js
// SPEC.origin, the centre of the mapped 19 m circle). A point at compass bearing b (deg, clockwise
// from north), radius r is (r sin b, -r cos b).
//
// Provenance: S published (Wikipedia infobox / history), M mapped (OSM), E estimated from the dossier
// photographs (calibrated on the 190.8 m total and the 171 m roof; see docs/3d-calgary-calgary-tower.md).

// --- overall heights (S) ---------------------------------------------------------------------
export const TIP = 190.8;       // S: antenna tip
export const ROOF = 171.0;      // S: roof (the top of the brown drum under the cauldron)
export const TOP_FLOOR = 157.6; // S: top (observation) floor; the model's glazing band starts at 157.3 (E)

// --- the shaft: a round concrete column that tapers toward the top and flares at the foot (E) ---
export const SHAFT = {
  rTop: 5.0,      // E: ~10 m across just under the pod (photographs: 0.31-0.33 of the pod's width)
  rFoot: 7.9,     // E: radius the taper reaches at grade (it is hidden inside the rotunda below 14 m)
  hTop: 145.4,    // E: the soffit of the pod meets the shaft here
  exponent: 1.8,  // E: concave flare, steeper near the ground (photographs 7 and 8)
};
export const shaftRadius = (h) => SHAFT.rTop + (SHAFT.rFoot - SHAFT.rTop) * Math.pow(1 - Math.min(1, h / SHAFT.hTop), SHAFT.exponent);

// --- the glass rotunda at the foot (M plan, E height): the mapped circle is ~19 m in radius ----
export const ROTUNDA = {
  r: 17.6,        // M/E: glazed wall; the mapped outline is 17.9-19.4 m from the axis
  rEave: 17.8,    // E: plinth, floor bands and eave sit just proud of the glass (inside the mapped ring)
  plinth: 0.5,    // E
  wallTop: 9.0,   // E: three storeys (OSM building:levels=3) at ~3 m
  eaveTop: 9.6,   // E
  floors: [3.0, 6.0], // E: floor-line bands
  roofTop: 14.0,  // E: where the cone meets the shaft (OSM roof:shape=cone; its pitch is a guess)
};

// --- the turret (observation pod): [radius, height] rows, bottom to top, E from photographs ----
export const POD = {
  rMax: 15.5,     // E: the roof rim, ~31 m across (calibrated on 190.8 m tip, 171 m roof, 4.7 px/m photograph scale)
  // Concave ribbed soffit (white concrete) flaring from the shaft up to the cladding.
  soffit: [[5.0, 145.4], [6.5, 146.03], [8.0, 146.86], [9.5, 147.88], [11.0, 149.11], [11.95, 150.4]],
  // Red cladding with vertical flutes (rows carry 1 where the ring is fluted, 0 for a plain ring; the
  // flute depth is `flute`, ramped in and out over the first and last row). Lower band: leans outward as it rises. The last row steps in to the glazing.
  flute: 0.22, panels: 88,
  redLow: [[11.95, 150.4, 0], [12.05, 151.2, 1], [12.6, 157.0, 1], [12.7, 157.3, 0], [12.5, 157.3, 0]],
  // Observation level (restaurant, glass-floor deck at 157.6 m): dark glazing recessed behind the red bands.
  obs: [[12.5, 157.3], [12.75, 159.4]],
  // Upper red band, overhanging the glazing by ~0.2 m; the last row steps in to the clerestory.
  redUp: [[12.75, 159.4, 0], [13.0, 159.4, 0], [13.05, 159.9, 1], [13.25, 161.2, 1], [13.28, 161.5, 0], [13.15, 161.5, 0]],
  clerestory: [[13.15, 161.5], [13.35, 162.9]],
  // Brown overhanging roof rim with the railing on top: underside, outer fascia, top.
  rim: [[13.35, 162.9], [15.2, 163.15], [15.5, 163.4], [15.5, 164.0], [15.3, 164.3], [12.4, 164.4]],
  skylights: { n: 10, r: 8.8, h: 166.58, tilt: 24 },
  // White dome roof, convex, up to the drum base; ten oval skylights (r 8.8 m, tilted with the dome's ~24 deg slope).
  dome: [[12.4, 164.4], [11.6, 165.0], [10.2, 165.95], [8.2, 166.85], [6.3, 167.45], [4.9, 167.8]],
  // Brown drum under the cauldron (flares slightly upward).
  drum: [[4.9, 167.8], [5.5, ROOF]],
  railing: { r: 15.25, post0: 164.25, post1: 165.45, rail: [165.38, 165.5], posts: 48 }, // posts start just under the deck, end inside the rail
  glassFloor: { bearing: 0, width: 3.6, out: 1.4, h0: 156.2, h1: 159.4 }, // E: north side, opened 2005 (Wikipedia)
};

// --- crown: pedestal, silver cauldron, flame, mast (E) -----------------------------------------
export const CROWN = {
  pedestal: { r: 0.95, h0: ROOF, h1: 172.9 },
  bowl: { rim: 2.3, under: [[0.95, 172.9], [2.3, 173.8]], lip: [[2.3, 173.8], [2.3, 174.3]], floor: [[2.3, 174.3], [0.2, 173.8]] },
  flame: [[0.85, 173.85], [0.7, 174.5], [0.4, 175.2], [0.02, 175.7]],
  mast: { r0: 0.34, r1: 0.12, h0: 173.6, h1: 190.2 },
  beacon: { r: 0.36, h: TIP - 0.36 }, // red aviation light on the tip (an octahedron: its apex is the tip)
};
