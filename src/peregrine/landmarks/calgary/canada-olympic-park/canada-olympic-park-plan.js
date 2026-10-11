// Canada Olympic Park ski jumps: every number the geometry, the terrain pad, the tests and the docs share.
// Frame: real metres, +x east, +y up, +z south, origin = centre of the 90 m (K114) tower head (config.js ORIGIN).
//
// y = 0 is the ground at the K89 (70 m) take-off edge, the LOWEST footing of the complex. Every other part stands at its
// real height above that point on the Paskapoo Slopes (public AWS Terrarium DEM, z13 as the app samples it, 2026-10-02;
// see docs/3d-calgary-canada-olympic-park.md, "Placement"), and every support continues straight down to y = 0:
//   Cityscape (flat)      the whole complex stands on the flat map; the part of each support below its real ground stands in
//                         for the hill (plain concrete or steel, no grass, no earthwork).
//   Full 3D world         the group sits on the DEM at the K89 take-off (spec.terrainPad); the hill rises round the uphill parts
//                         and hides each support below its real ground, so nothing floats and no pit or mound is cut.
// Nothing goes below y = 0.

/** Ground (DEM z13 on the app's ~24 m TIN) at each footing, metres above the K89 take-off ground. Measured, not sourced. */
// Tower values are the mean over the shaft corners (90 m: 24.4-26.6; 70 m: 17.2-19.0); take-offs at the edge centre.
export const GROUND = Object.freeze({ k89TakeOff: 0, k114TakeOff: 4.2, tower70: 18.1, tower90: 25.5, k63TakeOff: 18.1, tower50: 29.3, k38TakeOff: 11.1, k38Start: 20.8 });

/**
 * Inrun profiles (skisprungschanzen.com hill data for Canada Olympic Park): inrun length e from the highest start to the
 * take-off edge, inrun angle gamma, take-off angle alpha and length t, take-off (table) height s above the landing hill below
 * the edge. The transition radius r1 is estimated with the FIS rule r1 = 0.14 v0^2 (v0 about 25.5 / 23.5 m/s).
 * Plan position: the take-off edge T (x, z) measured on aerial imagery and checked against the mapped inrun ways; bearing
 * = downhill direction, degrees clockwise from north.
 */
export const JUMPS = Object.freeze({
  k114: {
    name: 'K114 (90 m, large hill)', e: 111, gamma: 35, alpha: 11, t: 7, s: 4.0, r1: 91,
    takeOff: [15.8, -101.8], bearing: 8.8, ground: GROUND.k114TakeOff,
    width: 5.6, depth: 3.6, shallow: 2.5, parapet: 1.2, stairSide: -1,
  },
  k89: {
    name: 'K89 (70 m, normal hill)', e: 88.2, gamma: 35, alpha: 10, t: 6.2, s: 3.2, r1: 77,
    takeOff: [-0.1, -130.0], bearing: 13.3, ground: GROUND.k89TakeOff,
    width: 4.8, depth: 3.0, shallow: 2.5, parapet: 1.1, stairSide: -1,
  },
  // The two training hills east of the Olympic pair (K63 / HS67 and K38 / HS40): no published profile, so e, gamma, alpha,
  // t, s and r1 are ESTIMATED for hills of that size, and checked against their mapped plan lengths (63 m and 47 m).
  k63: {
    name: 'K63 (training)', estimated: true, e: 70, gamma: 35, alpha: 10, t: 5, s: 2.5, r1: 62,
    takeOff: [68.9, -18.0], bearing: 4.6, ground: GROUND.k63TakeOff,
    width: 4.2, depth: 2.4, shallow: 1.4, parapet: 1.0, stairSide: -1,
  },
  k38: {
    name: 'K38 (training)', estimated: true, e: 50, gamma: 32, alpha: 9, t: 4, s: 1.8, r1: 45,
    takeOff: [92.7, -44.2], bearing: 1.6, ground: GROUND.k38TakeOff,
    width: 3.4, depth: 1.6, shallow: 1.0, parapet: 0.8, stairSide: -1,
  },
});

/**
 * Girder depth below the deck at u: the full box over the free span from the tower, tapering over the lower inrun (which
 * lies on the knoll in life) to `shallow` at the take-off table; the Olympic pair never thins below 2.5 m (photographs: a deep
 * dark trough). The lower GIRDER_STEEL of the depth is dark steel (parts.js), the rest white-grey cladding.
 */
export function girderDepth(jump, profile, u) {
  const a = profile.uT * 0.62, c = profile.uT - 8;
  if (u <= a) return jump.depth;
  if (u >= c) return jump.shallow;
  return jump.depth + (jump.shallow - jump.depth) * (u - a) / (c - a);
}

/** Fraction of the girder depth, from the underside up, whose flanks are steel (the dark soffit band). */
export const GIRDER_STEEL = 0.55;

/** Unit vectors of a jump: d downhill, r to the right of a skier (both in x, z). */
export function axes(bearing) {
  const b = bearing * Math.PI / 180;
  return { d: [Math.sin(b), -Math.cos(b)], r: [Math.cos(b), Math.sin(b)] };
}

/**
 * The inrun deck centreline from the highest start (u = 0) to the take-off edge (u = uT): straight at gamma, a circular
 * transition of radius r1 down to alpha, then the take-off table of length t at alpha. y is the deck surface; the edge
 * stands s above the jump's ground. `arcSteps` samples the transition.
 */
export function inrunProfile(jump, arcSteps = 8) {
  const D = Math.PI / 180, g = jump.gamma * D, a = jump.alpha * D;
  const arcLen = jump.r1 * (g - a), straight = jump.e - arcLen - jump.t;
  // Walk backwards from the edge (d = plan distance before the edge, h = height above the edge).
  const back = [[0, 0, jump.alpha]];
  const tableEnd = [jump.t * Math.cos(a), jump.t * Math.sin(a)];
  back.push([tableEnd[0], tableEnd[1], jump.alpha]);
  for (let i = 1; i <= arcSteps; i++) {
    const th = a + (g - a) * i / arcSteps;
    back.push([tableEnd[0] + jump.r1 * (Math.sin(th) - Math.sin(a)), tableEnd[1] + jump.r1 * (Math.cos(a) - Math.cos(th)), th / D]);
  }
  const arcEnd = back[back.length - 1];
  back.push([arcEnd[0] + straight * Math.cos(g), arcEnd[1] + straight * Math.sin(g), jump.gamma]);
  const uT = back[back.length - 1][0], edgeY = jump.ground + jump.s;
  const points = back.reverse().map(([d, h, slope]) => ({ u: uT - d, y: edgeY + h, slope }));
  return { uT, edgeY, startY: points[0].y, straight, arcLen, points };
}

/** Deck height at plan distance u from the start (linear between profile samples). */
export function deckY(profile, u) {
  const p = profile.points;
  if (u <= p[0].u) return p[0].y;
  for (let i = 1; i < p.length; i++) if (u <= p[i].u) { const f = (u - p[i - 1].u) / (p[i].u - p[i - 1].u); return p[i - 1].y + f * (p[i].y - p[i - 1].y); }
  return p[p.length - 1].y;
}

/** (u, v) in a jump's frame (u from the start, v to the skier's right) → [x, z] in the model frame. */
export function jumpPoint(jump, profile, u, v) {
  const { d, r } = axes(jump.bearing), k = u - profile.uT;
  return [jump.takeOff[0] + k * d[0] + v * r[0], jump.takeOff[1] + k * d[1] + v * r[1]];
}

/**
 * The 90 m tower (heritage height 58 m, J.H. Cook, 1986), in the K114 frame (u = 0 at the start gate, on the head's north
 * face). Plan and storey heights are estimated from photographs; the shaft continues below its real ground to y = 0.
 */
export const TOWER90 = Object.freeze({
  height: 58, base: GROUND.tower90, roof: GROUND.tower90 + 58,
  head: { u0: -15, u1: 0, v0: -8, v1: 8, y0: 51.5 }, // walls from y0 (32 m with the cap, was 25.5) up to `eave`, then the cap; the K114 girder enters the north face
  eave: GROUND.tower90 + 58 - 3.2, capSetback: 3.4, // the roof's north edge is chamfered back over the inrun
  shaft: { u0: -14.7, u1: -4.2, v0: -4.4, v1: 6.8 }, // 10.5 x 11.2 m = 70 % of the head, at its back (south-east): the lift core
  flare: { h: 6, out: 1.2 }, // the lowest 6 m of the shaft widen by 1.2 m on every side (y = 0 to 6: the Cityscape footing)
  frustumY: 46, // the head's underside tapers to the shaft here: the "prow" seen from the west and north-west
  gateOpening: 0.7, // dark margin round the girder where it enters the head (the start gate)
  bands: [[71.6, 73.4], [74.6, 76.4]], // two glazed bands, 7 to 12 m below the roof (photographs)
  mullion: 1.6, // spacing of the vertical mullion quads on the bands
  core: { u0: -14.2, u1: -12.6 }, // vertical glazed strip of the stair/lift core on the west face, from the real ground up
  rings: { u: -7.2, y: 80.2, r: 1.25, tube: 0.17, off: 0.07 }, // Olympic rings on the west face (2005 photographs); top-row centre, flat annuli `off` proud of the wall
  penthouse: { u0: -14.2, u1: -9, v0: -2, v1: 5, h: 2.6 },
  mast: { u: -11.5, v: 2.6, top: 9.5 }, // lattice antenna mast above the roof, metres
});

/** The 70 m tower: a concrete shaft carrying a box head with the K89 start, in the K89 frame. Estimated from photographs. */
export const TOWER70 = Object.freeze({
  jump: 'k89', base: GROUND.tower70,
  head: { u0: -10, u1: 0, v0: -5, v1: 5, y0: 39.2, top: 50.8 }, // walls 11.6 m (was 9.3)
  shaft: { u0: -8.7, u1: -1.7, v0: -3.5, v1: 3.5 }, // 7 x 7 m = 70 % of the head
  flare: { h: 6, out: 1 },
  frustumY: 34.7,
  band: [47.0, 48.6],
});

/** The K63 start tower: the same language, smaller (photographs 2 and 5). Estimated. */
export const TOWER50 = Object.freeze({
  jump: 'k63', base: GROUND.tower50,
  head: { u0: -7.5, u1: 0, v0: -3.8, v1: 3.8, y0: 48.9, top: 57.4 }, // walls 8.5 m (was 6.8)
  shaft: { u0: -6.5, u1: -1.25, v0: -2.65, v1: 2.65 }, // 5.25 x 5.3 m = 70 % of the head
  flare: { h: 6, out: 0.8 },
  frustumY: 46.3,
  band: [54.6, 55.8],
});

/** The K38 start: a small hut on four steel legs over the slope. Estimated. */
export const HUT38 = Object.freeze({ jump: 'k38', box: { u0: -3.2, u1: 0.4, v0: -2.4, v1: 2.4 }, below: 2.2, above: 2.6, base: GROUND.k38Start });

/**
 * Supports under the inruns: concrete piers (u along the inrun), then steel trestle bents every `pitch` metres down to the
 * take-off table. The Olympic pair follows the photographs (one big pier, a trestle down the lower inrun); the training
 * hills get two plain piers each, so the flat map does not show a forest of legs where the real inrun lies on the slope.
 */
export const SUPPORTS = Object.freeze({
  k114: { piers: [{ u: 44, along: 4.2, across: 3.6 }], trestle: { from: 56, pitch: 8.5 }, table: 9 },
  k89: { piers: [{ u: 26, along: 3.4, across: 3.0 }], trestle: { from: 36, pitch: 8 }, table: 8 },
  k63: { piers: [{ u: 19, along: 2.6, across: 2.4 }, { u: 39, along: 2.6, across: 2.4 }], trestle: null, table: 6 },
  k38: { piers: [{ u: 14, along: 2.2, across: 2.0 }, { u: 29, along: 2.2, across: 2.0 }], trestle: null, table: 5 },
});
