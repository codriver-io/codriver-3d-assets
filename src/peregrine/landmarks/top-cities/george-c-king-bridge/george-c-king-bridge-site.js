// Shared dimensions and the bridge frame of the George C. King Bridge ("Skipping Stone", RFR, opened 20 Oct 2014),
// so the geometry, the inspector cameras, the config and the tests read one set of numbers.
//
// Frame. The model is authored in the bridge's own coordinates and turned once onto the mapped axis:
//   u  metres along the axis, 0 at mid-length, positive toward the NORTH end (Bridgeland bank);
//   y  metres above local flat-map grade (y = 0 is the provider's footway grade at both ends);
//   v  metres across the axis, positive to the right when facing +u (the east, downstream side).
// The axis bearing comes from the two end nodes of the mapped cycleway (OSM way 206004051, local-plane bearing
// 21.10 deg); the origin is the middle of those two nodes, 182.55 m apart.
export const BEARING = 21.098; // degrees clockwise from north, toward +u
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

// SOURCED: Wikipedia and WSP (the engineer): a pedestrian bridge over the Bow River, three spans, 182 m long,
// steel and concrete, network arches (inclined hangers cross between each arch and the deck), nicknamed the
// Skipping Stone Bridge. The 8th International Conference on Arch Bridges (2016) gives the three arch spans as
// 52 m (north), 31 m (centre) and 99 m (south), which sum to the 182 m.
// MAPPED (OSM): the axis (way 206004051), the outline of the whole structure (way 1328870003: about 8 m wide at the
// piers, which is the arches' plan) and the island ramp that leaves the deck at u = 23.9 m (way 779639382), the
// middle of the 31 m span.
// ESTIMATED (read from Commons photographs, not published): arch rises, section sizes, lean, deck width and rise,
// hanger count, rail design, pier and abutment masses.
export const DIM = {
  // sourced
  length: 182, spanSouth: 99, spanCentre: 31, spanNorth: 52,
  // mapped
  halfLength: 91.3, // the outline runs 182.6 m (u = -91.4 .. +91.4)
  rampU: 23.9,
  // estimated
  deckY: 0.05, // walking surface at the abutments: 5 cm over the provider's footway so the two never fight
  deckHalf: 2.2, // deck width 4.4 m
  slab: 0.2, // pale deck slab thickness
  girderDepth: 0.8, // steel box girder under the slab reaches this far below the walking surface
  springY: -2.4, // arch centre line at the piers and abutments, the lowest it goes (the flat map has no river bed)
  footLat: 4.0, // arch centre line distance from the axis at the springing: the arches stand outside the deck
  railY: 1.15, // top of the handrail above the walking surface
  railV: 2.08, // handrail and hanger line, from the axis
  archP: 2.3, // arch shape exponent: y = 1 - |2t-1|^p, steeper at the springing, flat at the crown
  footBottom: -2.95, // concrete footings and pier columns stop here: below the river bank and island ground, so Full 3D world buries them
  skewTop: 1.0, // top of the concrete skewback block each arch springs from: a metre over grade, so it stands clear of the ground beside the deck even where Full 3D world puts the bank at the deck line
};

// The mapped island ramp (OSM way 779639382, bridge=yes, 78 m): a footway bridge that leaves the deck at u = 24.0 m
// (v = +0.5) and runs almost straight across the river to St Patrick's Island (u = 38.1, v = 77.5). Width and
// heights are estimated: it descends from just under the deck to a landing a little proud of the island path.
const rampEnds = { u0: 24.0, v0: 0.5, u1: 38.1, v1: 77.5 };
const rampLen = Math.hypot(rampEnds.u1 - rampEnds.u0, rampEnds.v1 - rampEnds.v0);
const rampDir = [(rampEnds.u1 - rampEnds.u0) / rampLen, (rampEnds.v1 - rampEnds.v0) / rampLen];
export const RAMP = {
  ...rampEnds, length: rampLen, dir: rampDir, normal: [rampDir[1], -rampDir[0]], // normal: toward the north-west edge
  half: 1.5, // 3.0 m wide
  railHalf: 1.4, // handrail line
  yStart: 0.3, // walking surface where it leaves the deck: 10 cm under the deck edge, so the two never share a plane
  yEnd: 0.1, // walking surface at the landing, 10 cm over the island path
  slab: 0.2, girder: 0.3,
  posts: [0.33, 0.66], // fractions of the length that carry a concrete pier column
  landingDrop: -0.5, // Full 3D world only: vertical shift of the landing end, m (walking surface 0.1 -> -0.4; the island path is at -0.45)
  landingTaper: 22, // metres before the landing over which that shift is eased in (smoothstep)
};
// Full 3D world only (the building layer's `terrainOffsets`; Cityscape keeps the flat authored heights): the bridge's
// datum is the median DEM over the two abutment pads (about 1043.46 m, Terrarium z15), and St Patrick's Island sits
// about 0.45 m under it (1043.0 m at the ramp's landing and the path beyond). Over its last `taper` metres the ramp
// (slab, girder, rails, supports, landing abutment) settles by `drop` so the landing meets the island path instead of
// standing 0.55 m proud of it on an exposed abutment.
/** Full 3D world vertical shift of a ramp vertex at bridge coordinates (u, v): 0 until the taper starts, landingDrop at the landing. */
export function rampLandingOffset(u, v) {
  const s = (u - RAMP.u0) * RAMP.dir[0] + (v - RAMP.v0) * RAMP.dir[1];
  const k = Math.min(1, Math.max(0, (s - (RAMP.length - RAMP.landingTaper)) / RAMP.landingTaper));
  return RAMP.landingDrop * k * k * (3 - 2 * k);
}
/** Ramp walking-surface height at distance s along its centre line from (u0, v0). */
export const rampY = (s) => RAMP.yStart + (RAMP.yEnd - RAMP.yStart) * Math.min(1, Math.max(0, s / RAMP.length));
/** Where an edge line at lateral offset `lat` from the ramp centre crosses the deck's handrail line (v = railV, east side). */
export function rampRailStart(lat) {
  const [du, dv] = RAMP.dir, [nu, nv] = RAMP.normal, s = (DIM.railV - RAMP.v0 - lat * nv) / dv;
  return { s, u: RAMP.u0 + du * s + nu * lat };
}
// Each span: ends u0..u1 (piers at -91.3 / 8.1 / 39.1 / 91.3), arch crown top height above the walking surface,
// crown lateral offset (the arch pair lean in toward each other), arch section (in-plane depth, across width), the
// deck's rise over the span (the skipping-stone profile) and the hanger spacing.
export const SPANS = [
  { name: 'south', u0: -91.3, u1: 8.1, crown: 17.5, lc: 1.6, depth: 1.1, width: 0.8, rise: 1.0, hangerEvery: 5.5 },
  { name: 'centre', u0: 8.1, u1: 39.1, crown: 6.6, lc: 2.4, depth: 0.76, width: 0.56, rise: 0.35, hangerEvery: 5.2 },
  { name: 'north', u0: 39.1, u1: 91.3, crown: 10.8, lc: 1.9, depth: 0.92, width: 0.66, rise: 0.6, hangerEvery: 5.8 },
];
export const PIERS = [-91.3, 8.1, 39.1, 91.3];

/** Which span contains u (clamped). */
export const spanAt = (u) => SPANS.find((s) => u <= s.u1) || SPANS[SPANS.length - 1];
/** Walking-surface height at axis position u: a gentle arch over each span, back down to the deck line at the piers. */
export function deckHeight(u) {
  const s = spanAt(u), t = (u - s.u0) / (s.u1 - s.u0), k = Math.max(0, Math.min(1, t));
  return DIM.deckY + s.rise * 4 * k * (1 - k);
}
const shape = (t) => 1 - Math.abs(2 * t - 1) ** DIM.archP;
/** Centre line of one arch of a span at parameter t (0 at the south pier, 1 at the north), side s = +1 / -1: [u, y, v]. */
export function archPoint(span, t, side) {
  const sh = shape(t), yc = span.crown - span.depth / 2;
  return [span.u0 + t * (span.u1 - span.u0), DIM.springY + (yc - DIM.springY) * sh, side * (DIM.footLat - (DIM.footLat - span.lc) * sh)];
}
