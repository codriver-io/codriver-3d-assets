import { FOOTPRINTS } from './footprint.js';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

// Site frame for the Calgary Central Library, measured from OpenStreetMap (read 2026-10-02) in the model frame:
// +X east, +Y up, +Z south, origin = area centroid of way 496824026. The street grid is not rotated, but the plan
// is a pointed ellipse whose long axis bears about 7 degrees; the real outline is the rotation, baked here.
const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
export const toLocal = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k];
const nodes = FOOTPRINTS[0].slice(0, -1).map(toLocal);

// The ring starts at the north tip (OSM node 19) and runs counter-clockwise on the map: down the curved west side,
// along the flat south wall, up the east side. OSM node 1 is a 0.5 m jog beside node 0 and is dropped. Sharp
// corners keep their angle; the rest is corner-cut so the wall is a smooth curve inside the mapped outline.
export const ORDER = [19, 20, 21, 22, 23, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const SHARP = new Set([19, 7, 9, 14, 15]);
export const HULL = ORDER.map((id) => ({ id, p: nodes[id], sharp: SHARP.has(id) }));
export const INSET = 0.25; // the wall stands this far inside the mapped outline

const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function chaikin(list, iterations) {
  let cur = list;
  for (let it = 0; it < iterations; it++) {
    const next = [];
    for (let i = 0; i < cur.length; i++) {
      const a = cur[i], b = cur[(i + 1) % cur.length];
      next.push(a.sharp ? a : { p: lerp2(a.p, b.p, 0.25), sharp: false });
      if (!b.sharp) next.push({ p: lerp2(a.p, b.p, 0.75), sharp: false });
    }
    cur = next;
  }
  return cur;
}

// The wall line: a closed polyline `pts` ({ x, z, s, nx, nz, m, sharp }) with arc length s from the north tip,
// outward unit normals (bisectors at vertices) and the mitre factor m that keeps an offset perpendicular to
// both faces. `at(s)` interpolates it, `anchor(id, plus)` finds s at an OSM node (plus metres further on).
export function buildRing(spacing) {
  const smoothed = chaikin(HULL.map((h) => ({ p: h.p, sharp: h.sharp })), 2);
  const raw = [];
  for (let i = 0; i < smoothed.length; i++) {
    const a = smoothed[i], b = smoothed[(i + 1) % smoothed.length], n = Math.max(1, Math.ceil(Math.hypot(b.p[0] - a.p[0], b.p[1] - a.p[1]) / spacing));
    for (let t = 0; t < n; t++) raw.push({ p: lerp2(a.p, b.p, t / n), sharp: t === 0 && a.sharp });
  }
  const N = raw.length, en = raw.map((a, i) => {
    const b = raw[(i + 1) % N], dx = b.p[0] - a.p[0], dz = b.p[1] - a.p[1], l = Math.hypot(dx, dz);
    return [-dz / l, dx / l]; // outward for this traversal
  });
  const pts = raw.map((r, i) => {
    const e0 = en[(i - 1 + N) % N], e1 = en[i];
    let nx = e0[0] + e1[0], nz = e0[1] + e1[1];
    const l = Math.hypot(nx, nz); nx /= l; nz /= l;
    const m = Math.min(2.5, 1 / Math.max(0.4, nx * e1[0] + nz * e1[1]));
    return { x: r.p[0] - nx * INSET * m, z: r.p[1] - nz * INSET * m, nx, nz, m, sharp: r.sharp, s: 0 };
  });
  let total = 0;
  for (let i = 0; i < N; i++) { pts[i].s = total; const b = pts[(i + 1) % N]; total += Math.hypot(b.x - pts[i].x, b.z - pts[i].z); }
  const wrap = (s) => ((s % total) + total) % total;
  function at(s0) {
    const s = wrap(s0);
    let lo = 0, hi = N - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (pts[mid].s <= s) lo = mid; else hi = mid - 1; }
    const a = pts[lo], b = pts[(lo + 1) % N], len = (lo + 1 < N ? pts[lo + 1].s : total) - a.s, t = len > 0 ? (s - a.s) / len : 0;
    let nx = a.nx + (b.nx - a.nx) * t, nz = a.nz + (b.nz - a.nz) * t; const l = Math.hypot(nx, nz); nx /= l; nz /= l;
    return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, nx, nz, m: a.m + (b.m - a.m) * t, i: lo };
  }
  const anchor = (id, plus = 0) => {
    const [x, z] = nodes[id];
    let best = 0, bd = Infinity;
    pts.forEach((p, i) => { const d = Math.hypot(p.x - x, p.z - z); if (d < bd) { bd = d; best = i; } });
    return wrap(pts[best].s + plus);
  };
  const corners = pts.filter((p) => p.sharp).map((p) => p.s);
  return { pts, total, at, anchor, corners, N };
}

// Piecewise-smooth periodic profile along s. knots: [osmNodeId, plusMetres, value].
export function profile(ring, knots) {
  const T = ring.total;
  const base = knots.map(([id, plus, v]) => [ring.anchor(id, plus), v]).sort((a, b) => a[0] - b[0]);
  const ext = [...base.map(([s, v]) => [s - T, v]), ...base, ...base.map(([s, v]) => [s + T, v])];
  return (s0) => {
    const s = ((s0 % T) + T) % T;
    let j = 0;
    while (j + 1 < ext.length - 1 && ext[j + 1][0] <= s) j++;
    const [sa, va] = ext[j], [sb, vb] = ext[j + 1], t = sb > sa ? Math.max(0, Math.min(1, (s - sa) / (sb - sa))) : 0;
    const e = t * t * (3 - 2 * t);
    return va + (vb - va) * e;
  };
}

// Profile tables. Anchors are OSM node ids of the mapped outline (see footprint.js): 19 north tip, 20-23 the
// north-west flank, 0 the westernmost node, 2-6 the curved west side, 7 the south-west corner, 9 the south-east
// corner, 16-18 the east side up to the tip.
export const KNOTS = {
  // Height of the facade's lower edge: the soffit's outer edge. The cedar arch spans the west side and peaks at 10 m
  // south of the westernmost node; the prow is lifted over the tunnel mouth; the south and east walls stand on the ground.
  he: [[16, 0, 0], [16, 11, 2.5], [17, 0, 6.5], [18, 0, 9.6], [19, 0, 9.6], [20, 0, 9.6], [21, 0, 8.6], [22, 0, 6.8], [23, 0, 4.6], [0, 0, 4.0], [2, 0, 6.0], [3, 0, 8.0], [4, 0, 9.4], [4, 8, 10.0], [5, 0, 9.2], [6, 0, 4.0], [7, 0, 0], [9, 0, 0]],
  // Recess depth: how far the glazing stands behind the facade's lower edge.
  d: [[16, 0, 0], [17, 0, 1.5], [18, 0, 4.0], [19, 0, 4.5], [20, 0, 4.5], [21, 0, 4.0], [22, 0, 3.8], [23, 0, 4.4], [0, 0, 5.6], [2, 0, 8.4], [3, 0, 10.6], [4, 0, 12.6], [4, 8, 13.6], [5, 0, 10.4], [6, 0, 4.2], [7, 0, 0], [9, 0, 0]],
  // Terrace floor at the glazing: the entrance plaza rising to the portal (the geometry fades it out where the arch
  // is low, so the plaza is narrower than the arch).
  fl: [[16, 0, 0], [20, 0, 0], [21, 0, 0], [22, 0, 0.5], [23, 0, 1.1], [0, 0, 1.3], [2, 0, 1.9], [3, 0, 2.4], [4, 0, 3.1], [4, 8, 3.3], [5, 0, 2.9], [6, 0, 1.1], [7, 0, 0], [9, 0, 0]],
};

// CTrain South Line, the two tunnel tracks under the north prow: OSM ways 19166950 and 481522733 (their centreline,
// local metres, from the mouth at the north-west going south-south-east) and the open air beyond the mouth (ways
// 481522734 and 132895852). The mapped tunnel mouth lies about 10 m outside the building outline; the model's portal
// wall stands `portalAt` m along the centreline, under the lifted prow, where the wedge is wide enough for it.
export const TUNNEL = {
  centre: [[-16.5, -79.5], [-9.6, -71.2], [-4.6, -63.7], [2.2, -51.1], [6.7, -36.3], [8.9, -23.1]],
  portalAt: 18,
  width: 10.4, height: 5.6, depth: 14, // opening, estimated from the photograph
  tracks: [[[-15.1, -81.2], [-7.7, -72.0], [-2.5, -64.1]], [[-17.9, -77.9], [-11.4, -70.4], [-6.6, -63.2]]],
  grade: [[-15.1, -81.2], [-20.8, -85.6], [-27.7, -90.3], [-34.6, -94.2], [-41.2, -97.1], [-49.5, -99.5], [-56.2, -100.7], [-63.7, -101.5]],
};

// The portal wall: a straight chord across the prow's wedge, square to the tunnel at `portalAt`. Returns the point
// C on the centreline, its unit tangent t (into the building), perp (toward the east wall) and the arc positions
// sW / sE where the chord meets the wall line on the north-west and east sides.
export function portalChord(ring) {
  const M = TUNNEL.centre, cum = [0];
  for (let i = 1; i < M.length; i++) cum.push(cum[i - 1] + Math.hypot(M[i][0] - M[i - 1][0], M[i][1] - M[i - 1][1]));
  let i = 1; while (i < M.length - 1 && cum[i] < TUNNEL.portalAt) i++;
  const a = M[i - 1], b = M[i], u = (TUNNEL.portalAt - cum[i - 1]) / (cum[i] - cum[i - 1]), dl = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const C = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], t = [(b[0] - a[0]) / dl, (b[1] - a[1]) / dl], perp = [t[1], -t[0]];
  const hits = [];
  ring.pts.forEach((p, k) => {
    const q = ring.pts[(k + 1) % ring.N], dx = q.x - p.x, dz = q.z - p.z, den = perp[0] * dz - perp[1] * dx;
    if (Math.abs(den) < 1e-9) return;
    const mu = ((p.x - C[0]) * dz - (p.z - C[1]) * dx) / den, w = ((p.x - C[0]) * perp[1] - (p.z - C[1]) * perp[0]) / den;
    if (w >= 0 && w <= 1) hits.push({ mu, s: p.s + w * Math.hypot(dx, dz) });
  });
  hits.sort((x, y) => x.mu - y.mu);
  return { C, t, perp, sW: hits[0].s, sE: hits[hits.length - 1].s, muW: hits[0].mu, muE: hits[hits.length - 1].mu };
}
