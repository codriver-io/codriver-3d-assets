import { rayHit, pointInRing, norm2 } from './oracle-park-mesh.js';
import { OUTER, EDGE_H, T, Tpts } from './oracle-park-site.js';

// The seating bowl as stepped terraces. A "chain" is the mapped field edge (inner) with the
// mapped outer wall (OUTER) behind it; stations pair an inner point with the outer-wall point
// it faces, and a profile (distance from the field, height) is lofted between them. The inner
// chains are hand-picked vertices of the mapped field opening (OSM way 98224507), the outer
// wall is the mapped ring, so the stands always end at the facade.
const FIELD_CENTRE = T(5, 10);
const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const len2 = (v) => Math.hypot(v[0], v[1]);
const perp = (v) => [v[1], -v[0]];

export function stations(inner, extras = {}, maxGap = 14) {
  // subdivide long edges so the loft follows the curve; extras[i] lists extra outer targets
  // (as [x, z] points) for a fan around inner vertex i (the stands wrap a corner there)
  const pts = [], tag = [];
  for (let i = 0; i < inner.length; i++) {
    pts.push(inner[i]); tag.push(i);
    if (i < inner.length - 1) {
      const gap = len2(sub2(inner[i + 1], inner[i])), n = Math.ceil(gap / maxGap);
      for (let k = 1; k < n; k++) { pts.push([inner[i][0] + (inner[i + 1][0] - inner[i][0]) * k / n, inner[i][1] + (inner[i + 1][1] - inner[i][1]) * k / n]); tag.push(-1); }
    }
  }
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const t1 = i > 0 ? norm2(sub2(pts[i], pts[i - 1])) : null, t2 = i < pts.length - 1 ? norm2(sub2(pts[i + 1], pts[i])) : null;
    let nn = t1 && t2 ? norm2([perp(t1)[0] + perp(t2)[0], perp(t1)[1] + perp(t2)[1]]) : perp(t1 || t2);
    const away = sub2(pts[i], FIELD_CENTRE);
    if (nn[0] * away[0] + nn[1] * away[1] < 0) nn = [-nn[0], -nn[1]];
    const h = rayHit(pts[i], nn, OUTER, true);
    for (const target of (tag[i] >= 0 && extras[tag[i]]) || []) {
      const e = rayHit(pts[i], norm2(sub2(target, pts[i])), OUTER, true);
      if (e) out.push({ I: pts[i], O: e.point, h: EDGE_H[e.edge] });
    }
    if (h) out.push({ I: pts[i], O: h.point, h: EDGE_H[h.edge] });
  }
  return out;
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// A profile is a list of segments {d0,y0,d1,y1,mat,face}; face says which way the segment looks:
// 'up' (a tread or roof), 'in' (toward the field: a riser), 'out' (away from it), 'down'.
function builder() {
  const segs = []; let d = 0, y = 0;
  const add = (d1, y1, mat, face) => { segs.push({ d0: d, y0: y, d1, y1, mat, face }); d = d1; y = y1; };
  const jump = (d1, y1) => { d = d1; y = y1; };
  return { segs, add, jump, get d() { return d; }, get y() { return y; } };
}
function terraces(p, d1, y1, steps, tread = 'seat') {
  const d0 = p.d, y0 = p.y;
  for (let i = 0; i < steps; i++) {
    const di = d0 + (d1 - d0) * (i + 1) / steps, yi = y0 + (y1 - y0) * (i + 1) / steps;
    p.add(p.d, yi, tread, 'in'); p.add(di, yi, tread, 'up');
  }
}
function ramp(p, d1, y1, tread = 'seat') { p.add(d1, y1, tread, 'up'); }

// Home-plate grandstand: lower deck, club level behind glass, upper deck, back wall, roof deck.
// Every station gets the SAME list of segments (fixed step counts, no conditionals), because the
// loft joins segment i of one station to segment i of the next: a variable list twisted the
// shell and left holes near the north corner. Zero-length segments are dropped by the mesh.
export function profileGrandstand(W0, hE, near) {
  const p = builder(), W = Math.min(W0, 56), hz = hE - 0.3;
  const d2 = clamp(0.34 * W, 7, 17), club = clamp(0.13 * W, 3, 7), d4 = d2 + club;
  p.add(0, 2.6, 'concrete', 'in');
  const y2 = 2.6 + d2 * 0.5;
  near ? terraces(p, d2, y2, 7) : ramp(p, d2, y2);
  const yc = y2 + 7;
  p.add(d2, y2 + 1, 'concrete', 'in'); p.add(d2, yc - 0.9, 'glass', 'in'); p.add(d2, yc, 'concrete', 'in');
  p.add(d4, yc, 'roof', 'up');
  const y5 = yc + 0.6, d6 = Math.max(d4, W - 8.4);
  p.add(d4, y5, 'concrete', 'in');
  // the upper deck tapers away where the stand is shallow (first-base end), so it never rises above the arcade
  const taper = clamp((W0 - 28) / 14, 0, 1), y6 = y5 + (d6 - d4) * 0.57 * taper;
  near ? terraces(p, d6, y6, 9) : ramp(p, d6, y6);
  p.add(d6 + 0.8, y6, 'concrete', 'up');
  p.add(d6 + 0.8, hz, 'steel', y6 > hz ? 'out' : 'in');
  p.add(Math.max(d6 + 1, W0 - 3.5), hz, 'roof', 'up');
  return { segs: p.segs, y6, d6, taper };
}
export function profileCanopy(W, hE, g) {
  if (W < 44 || g.d6 - 16 < 20 || g.taper < 1) return [];
  const d0 = g.d6 - 15, d1 = g.d6 + 0.8, yT = g.y6 + 2.9;
  return [
    { d0, y0: yT - 0.8, d1: d0, y1: yT, mat: 'steel', face: 'in' },
    { d0, y0: yT, d1, y1: yT, mat: 'steel', face: 'up' },
    { d0: d1, y0: yT - 0.8, d1: d0, y1: yT - 0.8, mat: 'steel', face: 'down' },
    { d0: d1, y0: yT, d1, y1: yT - 0.8, mat: 'steel', face: 'out' },
  ];
}
// Left-field and centre-field bleachers: one tier, then a deck behind it.
export function profileBleacher(W, hE, near) {
  const p = builder();
  const len = clamp(0.5 * W, 11, 24);
  p.add(0, 1.8, 'concrete', 'in');
  near ? terraces(p, len, 11.4, 8) : ramp(p, len, 11.4);
  p.add(Math.max(len + 1, W - 3.5), 11.4, 'roof', 'up');
  return { segs: p.segs };
}
// Right-field arcade: the 7.3 m brick wall, a few rows of arcade seating, a concourse.
export function profileArcade(W, hE, near) {
  const p = builder();
  p.add(0, 7.3, 'brick', 'in');
  const len = clamp(0.5 * W, 3, 8);
  near ? terraces(p, len, 10.6, 4) : ramp(p, len, 10.6);
  p.add(Math.max(len + 1, W - 3.5), 10.6, 'roof', 'up');
  return { segs: p.segs };
}

const P = (s, d, W, y) => { const t = d / W; return [s.I[0] + (s.O[0] - s.I[0]) * t, y, s.I[1] + (s.O[1] - s.I[1]) * t]; };

export function loft(bufFor, sts, profile, { caps = [false, false], near = true } = {}) {
  const profs = sts.map((s) => { const W = Math.hypot(s.O[0] - s.I[0], s.O[1] - s.I[1]); const g = profile(W, s.h, near); return { W, ...g }; });
  for (let k = 0; k < sts.length - 1; k++) {
    const a = sts[k], b = sts[k + 1], pa = profs[k], pb = profs[k + 1];
    const count = Math.min(pa.segs.length, pb.segs.length);
    for (let i = 0; i < count; i++) {
      const sa = pa.segs[i], sb = pb.segs[i];
      const p0 = P(a, sa.d0, pa.W, sa.y0), p1 = P(a, sa.d1, pa.W, sa.y1), p2 = P(b, sb.d1, pb.W, sb.y1), p3 = P(b, sb.d0, pb.W, sb.y0);
      const dir = [a.O[0] - a.I[0] + b.O[0] - b.I[0], 0, a.O[1] - a.I[1] + b.O[1] - b.I[1]];
      const hint = sa.face === 'up' ? [0, 1, 0] : sa.face === 'down' ? [0, -1, 0] : sa.face === 'in' ? [-dir[0], 0, -dir[2]] : dir;
      bufFor(sa.mat).quad(p0, p1, p2, p3, hint);
    }
  }
  caps.forEach((on, which) => {
    if (!on) return;
    const k = which ? sts.length - 1 : 0, s = sts[k], pr = profs[k];
    const pts = [P(s, 0, pr.W, 0)];
    for (const sg of pr.segs) { pts.push(P(s, sg.d0, pr.W, sg.y0)); }
    const last = pr.segs[pr.segs.length - 1];
    pts.push(P(s, last.d1, pr.W, last.y1), P(s, pr.W, pr.W, 0));
    const ref = sts[which ? k - 1 : k + 1];
    const tangent = [s.I[0] - ref.I[0], 0, s.I[1] - ref.I[1]];
    bufFor('concrete').poly3(dedupe(pts), which ? tangent : tangent.map((v) => -v));
  });
  return profs;
}
const dedupe = (pts) => pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1], p[2] - pts[i - 1][2]) > 1e-3);

// Inner chains are vertices of the mapped field opening (OSM way 98224507); `extras` fan the
// stands around the north corner (inner vertex 0) out to the mapped outer-wall corners.
const A = [13.9, -53];
export const CHAINS = {
  grandstand: { inner: Tpts([A, [1.5, -42], [-27, -21.6], [-60, 12.4], [-64, 17.4], [-66.7, 27.6], [-64.8, 34.4], [-60, 39.8], [-11.8, 75.1], [16.8, 87]]), extras: { 0: [OUTER[40], OUTER[41], OUTER[0]] } },
  bleacher: { inner: Tpts([A, [20.7, -50.8], [42, -29.6], [63.1, -8.4], [70.2, -5.9]]), extras: {} },
  arcade: { inner: Tpts([[75.6, 39.3], [76.4, 51], [68.3, 57.7], [46.4, 72.6], [16.8, 87]]), extras: {} },
};
