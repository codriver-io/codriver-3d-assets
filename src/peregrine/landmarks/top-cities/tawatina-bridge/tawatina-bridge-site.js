// Tawatinâ Bridge: the numbers the geometry, the terrain pad and the tests share.
// The model is authored in the bridge's own frame: u runs NORTH along the deck from the centre of the mapped
// outline, v runs EAST across it, y is up. geometry.js maps (u, v, y) to scene (x = v, z = -u) and rotates the
// result once onto the mapped bearing.

// Mapped outline (OSM way 570036448, man_made=bridge): 259.8 m between its end edges, 12.7 m across, axis from
// mid south edge (-1.30, +129.9) to mid north edge (+1.29, -129.9) in x east, z south metres from the outline
// centroid, i.e. 0.57 deg east of true north.
export const BEARING = 0.569; // deg, east of north, derived from those two control points
export const MPER_LNG = 111320 * Math.cos(53.5404085 * Math.PI / 180);
export const MPER_LAT = 110574;
export const ORIGIN = [-113.477125825, 53.5404085];

export const DIM = {
  // Sourced: Wikipedia / Structurae: three spans (100 + 110 + 50 m), about 260 m long, 11 m wide upper deck,
  // 3.5 m deep box girder, 8 m wide shared-use path hung beneath it, 28 stay cables, one concrete pylon pair.
  halfLength: 130.6, // 261.2 m overall: the OSM outline is 259.8 m between its end edges, the abutment backwalls add 0.6 m a side
  deckWidth: 11.0,
  girderDepth: 3.5,
  pathWidth: 8.0,
  // Mapped: the Valley Line way breaks at z = -28.6 m (the pylon pier) from the outline centre.
  pylonU: 28.6, // pylon pier, 101 m from the north end (the 100 m span)
  southPierU: -81.4, // 110 m main span south of the pylon pier
  trackOffset: 2.25, // mapped track centres sit at x = -2.23 and +2.27 at the pylon pier
  // Estimated from the photographs and the DEM (docs/3d-top-cities-tawatina-bridge.md):
  deckTop: 14.0, // m above y = 0, the river-level datum (the flat map has no valley)
  pylonRise: 16, // pylon tops above the deck
  pylonLeanDeg: 9, // each pylon of the pair leans outward, away from the deck axis
  pylonBaseV: 6.2, // pylon axis offset at deck level
  haunchHalf: 24, // girder deepens over each pier for this far either side
  haunchDepth: [5.0, 4.4], // girder depth over the pylon pier, over the south pier
  pathTop: 4.8, // walking surface of the hung path above y = 0, flat between its ramps
  pathSlab: 0.4,
  pathFlat: [-55, 30], // u range where the path is level
  // The mapped cycleway on the bridge (OSM way 732161091) runs from u = -113.3 to 76.2, but the north bank climbs 15 % from
  // u = 40 (DEM profile, see the doc): the model's path stops where it meets the bank (u = 42, on an end wall) and the
  // provider draws the rest on the hillside; the south end lands 0.7 m above the floodplain at u = -113.3.
  pathEnds: [-113.3, 42],
  pathEndY: [1.9, 5.2], // walking surface at the south and north ends
};

// Stay cables: seven a side on each of the two planes, 28 in all. Main-span stays fan south of the pylon pier,
// back stays north over the 100 m side span. Anchor heights above the deck on the pylon, deck anchor offsets.
export const STAYS = {
  main: Array.from({ length: 7 }, (_, k) => ({ du: -(11 + 9 * k), pylonY: 9 + 1.0 * k })),
  back: Array.from({ length: 7 }, (_, k) => ({ du: 14 + 11 * k, pylonY: 9.5 + 0.9 * k })),
  deckV: 5.62, // anchor blisters sit just outside the deck edge
};

export const HANGER_V = 2.7; // rods hang from the girder's flat soffit, just inside its edge
export const girderDepthAt = (u) => {
  const bump = (centre, depth) => {
    const t = Math.abs(u - centre) / DIM.haunchHalf;
    return t >= 1 ? 0 : (depth - DIM.girderDepth) * 0.5 * (1 + Math.cos(Math.PI * t));
  };
  return DIM.girderDepth + bump(DIM.pylonU, DIM.haunchDepth[0]) + bump(DIM.southPierU, DIM.haunchDepth[1]);
};

/** Pylon centre-line offset v (outward, +/-) at height `y` above the deck. */
export const pylonV = (side, yAboveDeck) => side * (DIM.pylonBaseV + yAboveDeck * Math.tan(DIM.pylonLeanDeg * Math.PI / 180));

export const PATH_DECK = 0.1; // decking proud of the slab
/** The hung path's walking-surface height at u: level in the middle, ramping to the bank at its two ends (above the DEM). */
export const pathYAt = (u) => {
  const [f0, f1] = DIM.pathFlat, [e0, e1] = DIM.pathEnds, [y0, y1] = DIM.pathEndY;
  if (u >= f0 && u <= f1) return DIM.pathTop;
  if (u < f0) return Math.max(y0, DIM.pathTop + (DIM.pathTop - y0) * (u - f0) / (f0 - e0));
  return Math.min(y1, DIM.pathTop + (y1 - DIM.pathTop) * (u - f1) / (e1 - f1));
};

// ---- guideway approaches ---------------------------------------------------------------------------------------
// The structure is not an island: the Valley Line runs on (OSM bridge ways 1221895802 / 1221212789 and 1221212818 /
// 672849775: 200 m more viaduct south of the main spans, swinging west) and descends to grade at LRT grade. The model
// continues the girder both ways at 5.5 % from the abutment piers down to the ground, so on the flat map the
// guideway lands instead of ending in the air. In Full 3D world the south viaduct stands on the real floodplain and the
// north one runs into the hillside (terrain 19 m above the datum at the north abutment).
export const APPROACH = { grade: 0.055, endY: 0.45, depth: [3.5, 2.6], taper: 24, pierEvery: 32 };
export const approachLength = (DIM.deckTop - APPROACH.endY) / APPROACH.grade;
/** Deck level of an approach, `s` metres beyond the abutment. */
export const approachY = (s) => Math.max(APPROACH.endY, DIM.deckTop - APPROACH.grade * s);
// North end: the Valley Line goes underground (OSM tunnel ways 1221895805 / 674098689, u = 172). The model ends the north
// guideway in a concrete portal: a headwall with a dark opening, wing walls splaying back along the cutting, and a short
// recess the tracks and wires run into. It stands at u = 169.5, 2.5 m short of the mapped start, because that is where the
// hill begins in Full 3D world: the near terrain lattice (22.7 m) holds the cutting floor only up to its node column at
// u = 168.4 and the TIN then climbs 0.8 m per metre (probed in the app: 11.3 m at u = 168, 13.5 at 172, 20.4 at 180, rising
// to 31 m), so a recess any deeper, or a headwall any further on, is buried by the hill and the opening reads as ground.
// Foot of every wall is the datum (y = 0): on the flat map the portal stands to the ground, in Full 3D world the hill
// buries its lower part.
export const PORTAL = {
  u: 169.5, // headwall front face
  thick: 1.2, // headwall depth
  half: 5.6, // half width of the opening, clear of the 11 m girder and its parapets
  headHalf: 10.3, // half width of the headwall
  top: 20.3, // headwall crest
  floorY: 10.6, // floor of the opening, just under the girder shoulders
  roofY: 18.5, // underside of the lintel and of the recess roof: 6.6 m over the rail slab at the portal
  depth: 2.4, // the recess runs this far past the headwall front: 1.2 m of reveal and a 0.6 m dark end wall
  wingLen: 12, // wing walls run this far back (south) from the headwall
  wingHalf: [9.5, 13.0], // wing inner face v at the headwall and at its far end
  wingThick: 0.8,
  endS: 41.0, // the north approach ends inside the dark end wall
  dropS: 40.4, // overhead-wire ends hang from the recess roof here
};
export const PORTAL_S = PORTAL.u - DIM.halfLength; // 38.9 m along the north approach
export const approachDepth = (s) => APPROACH.depth[1] + (APPROACH.depth[0] - APPROACH.depth[1]) * Math.max(0, 1 - s / APPROACH.taper);
// South alignment: mean of the two mapped tracks, in scene metres (x east, z south from the model origin).
export const SOUTH_LINE = [[-1.3, 130.6], [-1.6, 158], [-2, 186], [-2.1, 197.1], [-4.3, 241], [-6.6, 260], [-10, 270.5], [-13.5, 284], [-20, 296.8], [-29, 314], [-37.5, 326], [-42, 333.2]];
const NORTH_T = [Math.sin(BEARING * Math.PI / 180), -Math.cos(BEARING * Math.PI / 180)];
export const NORTH_LINE = [[-SOUTH_LINE[0][0], -SOUTH_LINE[0][1]], [-SOUTH_LINE[0][0] + NORTH_T[0] * 300, -SOUTH_LINE[0][1] + NORTH_T[1] * 300]];

/** Smooth arc-length parameterisation of a polyline (Catmull-Rom, 2 m samples), extended straight past its end. */
export function alignment(points, length) {
  const dense = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 2));
    for (let k = 0; k < n; k++) {
      const t = k / n, f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
      dense.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  dense.push(points.at(-1));
  const cum = [0];
  for (let i = 1; i < dense.length; i++) cum.push(cum[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const total = cum.at(-1);
  return {
    total,
    at(s) { // position and unit tangent at arc length s (beyond the end: straight on)
      const q = Math.max(0, s);
      let i = 1;
      if (q >= total) { const a = dense.at(-2), b = dense.at(-1), l = Math.hypot(b[0] - a[0], b[1] - a[1]), t = [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; return { x: b[0] + t[0] * (q - total), z: b[1] + t[1] * (q - total), tx: t[0], tz: t[1] }; }
      while (i < cum.length - 1 && cum[i] < q) i++;
      const a = dense[i - 1], b = dense[i], l = cum[i] - cum[i - 1] || 1, f = (q - cum[i - 1]) / l, d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return { x: a[0] + (b[0] - a[0]) * f, z: a[1] + (b[1] - a[1]) * f, tx: (b[0] - a[0]) / d, tz: (b[1] - a[1]) / d };
    },
  };
}

/** One stay as [a, b] in (u, v, y): pylon anchor to deck-edge blister, one per plane side. */
export function stayList() {
  const out = [];
  for (const side of [-1, 1]) {
    for (const [kind, list] of [['main', STAYS.main], ['back', STAYS.back]]) {
      list.forEach((s, k) => out.push({
        kind, side, k,
        a: [DIM.pylonU, pylonV(side, s.pylonY), DIM.deckTop + s.pylonY],
        b: [DIM.pylonU + s.du, side * STAYS.deckV, DIM.deckTop - 0.05],
      }));
    }
  }
  return out;
}

/** Hanger rods under the girder: u, v, and the top (girder soffit) and bottom (inside the path slab) of each. */
export function hangerList(near = true) {
  const step = near ? 7 : 14, out = [];
  const [e0, e1] = DIM.pathEnds;
  let i = 0;
  for (let u = Math.ceil((e0 + 6) / step) * step; u < e1 - 6; u += step, i++) {
    const slabTop = pathYAt(u), soffit = DIM.deckTop - girderDepthAt(u);
    if (soffit - slabTop > 9.5) continue;
    for (const v of [-HANGER_V, HANGER_V]) out.push({ u, v, bottom: slabTop - 0.1, top: soffit + 0.15, lamp: near && i % 2 === 0 });
  }
  return out;
}

/** Model metres (u north, v east) to [lng, lat], for the terrain-pad rings. Axis bearing is under 0.6 deg: applied. */
export function lngLat(u, v) {
  const t = BEARING * Math.PI / 180;
  const east = v * Math.cos(t) + u * Math.sin(t), north = u * Math.cos(t) - v * Math.sin(t);
  return [+(ORIGIN[0] + east / MPER_LNG).toFixed(7), +(ORIGIN[1] + north / MPER_LAT).toFixed(7)];
}
export const rect = (u0, u1, v0, v1) => [lngLat(u0, v0), lngLat(u1, v0), lngLat(u1, v1), lngLat(u0, v1)];
