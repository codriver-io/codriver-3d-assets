// Plan, frame and roof surface of the California Academy of Sciences. Kept apart from
// geometry.js so the tests can ask "how high is the living roof here" without building a mesh.
//
// The building is authored in its own axes: u runs along the front (north-west, Music
// Concourse) facade toward the north-east end, v runs from the front facade into the building
// (toward the south-east), y is up. site() rotates that into the exported +X east, +Y up,
// +Z south. The mapped OSM outline is a 161 x 103 m rectangle whose long edges bear 48.1
// degrees (measured on four edge segments of way 28695389), with a 3 m notch cut from each
// corner. Origin = the outline's area centroid.
export const BETA_DEG = 48.1;
const B = BETA_DEG * Math.PI / 180;
const SU = [Math.sin(B), -Math.cos(B)], SV = [Math.cos(B), Math.sin(B)];
/** Rotation angle for THREE's box.rotateY so a box's local x runs along +u and local z along +v. */
export const THETA = Math.PI / 2 - B;
/** (u, y, v) -> exported local metres [x east, y up, z south]. */
export const site = (u, y, v) => [u * SU[0] + v * SV[0], y, u * SU[1] + v * SV[1]];
/** A direction (no translation) in the same rotation. */
export const dir = (du, dy, dv) => site(du, dy, dv);
/** Exported (x, z) -> (u, v). */
export const unsite = (x, z) => [x * SU[0] + z * SU[1], x * SV[0] + z * SV[1]];

/** The mapped outline, simplified to its notched rectangle (u, v), 12 vertices. */
export const OUTLINE = [
  [-77.5, -51.3], [77.5, -51.3], [77.5, -48.2], [80.45, -48.2], [80.45, 47.95], [77.2, 47.95],
  [77.2, 51.2], [-77.5, 51.2], [-77.5, 48.2], [-80.45, 48.2], [-80.45, -48.2], [-77.5, -48.2],
];
export const CANOPY_DEPTH = 11.85; // outline to the wall line: sets the green roof to the sourced ~1 ha
/** The wall line (half extents). */
export const WALL = { u: 68.6, v: 39.4 };
export const WALL_TOP = 9.7, SKIRT_OUT = 0.25, SKIRT_BOT = 9.5;
export const CAN_BOT = 9.2, CAN_TOP = 9.65, RIM_BOT = 9.1, RIM_TOP = 10.05;
export const ROOF_Y = 10.8; // the roof edge, ~35 ft: also the OSM height tag (11 m)
export const ROOF_HALF = { u: WALL.u + SKIRT_OUT, v: WALL.v + SKIRT_OUT };

/** The glazed piazza roof over the central courtyard (22 x 30 m published). */
export const PIAZZA = { u: 0, v: 0, hu: 11, hv: 15, edge: 11.0, rise: 1.9, kerb: 0.55, kerbTop: 11.25 };
/** The railed observation terrace (3,500 sq ft published = 18 x 18 m). */
export const TERRACE = { u: -56, v: -26, half: 9, deckTop: 11.4, deckBot: 10.3 };

/** Seven hills. The two largest (planetarium, rainforest) carry the dome vents. P is the rise
 *  over the roof edge (m), R the base radius, k the roundness of the spherical-cap profile
 *  (0 = a gentle bump, 1 = a hemisphere). */
export const HILLS = [
  { id: 'planetarium', u: 31, v: 3, R: 18, P: 15.0, k: 0.85, holes: { n: 14, r0: 3, r1: 14.4, phase: 0.4 } },
  { id: 'rainforest', u: -35, v: 3, R: 21, P: 15.0, k: 0.85, holes: { n: 11, r0: 12.4, r1: 17, phase: 1.1 } },
  { id: 'middle', u: 2, v: 27, R: 10.5, P: 6.0, k: 0.55, holes: { n: 4, r0: 2, r1: 7, phase: 0.2 } },
  { id: 'north-east', u: 55, v: -24, R: 11, P: 3.6, k: 0.5, holes: { n: 2, r0: 2, r1: 6, phase: 0.3 } },
  { id: 'south-west', u: -55, v: 26, R: 11, P: 3.0, k: 0.5, holes: { n: 2, r0: 2, r1: 6, phase: 2.0 } },
  { id: 'south-east', u: 55, v: 26, R: 11, P: 4.0, k: 0.5, holes: { n: 2, r0: 2, r1: 6, phase: 1.0 } },
  { id: 'front', u: -8, v: -30, R: 9, P: 2.4, k: 0.45, holes: { n: 0, r0: 0, r1: 0, phase: 0 } },
];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (t) => t * t * (3 - 2 * t);
// Spherical-cap profile: round at the crown, steepening toward the foot, zero at r = R.
const bump = (h, u, v) => {
  const r = Math.hypot(u - h.u, v - h.v) / h.R;
  if (r >= 1) return 0;
  const s0 = Math.sqrt(1 - h.k);
  // the last 18 % of the radius eases into the roof, so the foot has no crease
  return h.P * (Math.sqrt(1 - h.k * r * r) - s0) / (1 - s0) * (1 - smooth(clamp((r - 0.82) / 0.18)));
};
const rectGap = (u, v, c, hu, hv) => Math.max(Math.abs(u - c.u) - hu, Math.abs(v - c.v) - hv);

/** Living-roof surface height at (u, v): the roof edge, a gentle undulation, and the hills. */
export function roofHeight(u, v) {
  let hills = 0;
  for (const h of HILLS) hills += bump(h, u, v);
  // hills never run up the piazza's kerb
  hills *= smooth(clamp((rectGap(u, v, PIAZZA, PIAZZA.hu + PIAZZA.kerb, PIAZZA.hv + PIAZZA.kerb) - 0.6) / 2.5));
  const edge = Math.min(ROOF_HALF.u - Math.abs(u), ROOF_HALF.v - Math.abs(v));
  const flat = Math.min(
    smooth(clamp(rectGap(u, v, PIAZZA, PIAZZA.hu + PIAZZA.kerb, PIAZZA.hv + PIAZZA.kerb) / 4)),
    smooth(clamp(rectGap(u, v, TERRACE, TERRACE.half, TERRACE.half) / 4)),
  );
  const undulation = 0.34 * Math.sin(u / 9.5 + 1.3) * Math.cos(v / 7.5 + 0.4) * smooth(clamp(edge / 9)) * flat * clamp(1 - hills / 2);
  return ROOF_Y + hills + undulation;
}

/** Unit surface normal of the roof at (u, v) in the (u, y, v) frame. */
export function roofNormal(u, v) {
  const e = 0.25, du = (roofHeight(u + e, v) - roofHeight(u - e, v)) / (2 * e), dv = (roofHeight(u, v + e) - roofHeight(u, v - e)) / (2 * e);
  const l = Math.hypot(du, 1, dv);
  return [-du / l, 1 / l, -dv / l];
}

/** The rainforest sphere that breaks through its hill as a glass cap (published 90 ft = 27.4 m
 *  across; its crown is the building's highest point). A white collar ring (radius rc, rising
 *  0.65 m over the green) makes a clean base: the glass stands inside it, the green meets its
 *  outside wall. */
const RAINFOREST = HILLS[1];
export const CAP = { u: RAINFOREST.u, v: RAINFOREST.v, top: 27.4, Rs: 13.7 };
CAP.cy = CAP.top - CAP.Rs;
const hillAt = (r) => { let m = 0; for (let k = 0; k < 8; k++) m += roofHeight(CAP.u + r * Math.cos(k * Math.PI / 4), CAP.v + r * Math.sin(k * Math.PI / 4)); return m / 8; };
Object.assign(CAP, (() => {
  for (let rc = 8; rc < 13; rc += 0.05) {
    const collarTop = hillAt(rc) + 0.65, dy = collarTop - CAP.cy;
    const rin = Math.sqrt(Math.max(0, CAP.Rs * CAP.Rs - dy * dy));
    if (rin <= rc - 0.85) return { rc, collarTop, collarBot: collarTop - 1.8, rin, theta: Math.asin(Math.min(0.99, (rin + 0.3) / CAP.Rs)) };
  }
  throw new Error('no collar fits');
})());

/** Inset a right-angled polygon (u, v) by d (miter). Works for either winding. */
export function insetPolygon(poly, d) {
  const n = poly.length;
  let area = 0;
  for (let i = 0; i < n; i++) { const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % n]; area += x1 * y2 - x2 * y1; }
  const sgn = area > 0 ? 1 : -1; // CCW in (u, v) plane: outward normal is (dy, -dx)
  const outN = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [sgn * dy / l, -sgn * dx / l]; };
  return poly.map((p, i) => {
    const a = poly[(i + n - 1) % n], c = poly[(i + 1) % n], n1 = outN(a, p), n2 = outN(p, c);
    const k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1]);
    return [p[0] - (n1[0] + n2[0]) * k, p[1] - (n1[1] + n2[1]) * k];
  });
}
export { outwardNormals };
function outwardNormals(poly) {
  const n = poly.length;
  let area = 0;
  for (let i = 0; i < n; i++) { const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % n]; area += x1 * y2 - x2 * y1; }
  const sgn = area > 0 ? 1 : -1;
  return poly.map((a, i) => { const b = poly[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [sgn * dy / l, -sgn * dx / l]; });
}
