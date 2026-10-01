import { pointInRing } from './oracle-park-mesh.js';
import { OUTER, EDGE_H, EDGE_M } from './oracle-park-site.js';

// The outer wall: every edge of the mapped ring (OSM way 24352572) stood up as a wall of its
// own height and material, with a plinth, cornice, window bays or arches, and an 8 m roof strip
// along its inside edge (the roof behind the cornice; the stands start where it ends).
const N = OUTER.length;
export const edge = (i) => {
  const a = OUTER[i], b = OUTER[(i + 1) % N], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
  const u = [dx / L, dz / L];
  let n = [u[1], -u[0]];
  const m = [(a[0] + b[0]) / 2 + n[0] * 0.4, (a[1] + b[1]) / 2 + n[1] * 0.4];
  if (pointInRing(m, OUTER)) n = [-n[0], -n[1]];
  return { a, b, L, u, n };
};
const at = (e, s, off, y) => [e.a[0] + e.u[0] * s + e.n[0] * off, y, e.a[1] + e.u[1] * s + e.n[1] * off];
const outV = (e) => [e.n[0], 0, e.n[1]];

// Rectangular panel on the wall plane: along-edge range [s0, s1], heights [y0, y1], pushed out by `off`.
function panel(buf, e, s0, s1, y0, y1, off) { buf.quad(at(e, s0, off, y0), at(e, s1, off, y0), at(e, s1, off, y1), at(e, s0, off, y1), outV(e)); }
// Slab protruding from the wall: front face, top and underside between [y0, y1], depth `out`.
function ledge(buf, e, s0, s1, y0, y1, out) {
  panel(buf, e, s0, s1, y0, y1, out);
  buf.quad(at(e, s0, 0, y1), at(e, s1, 0, y1), at(e, s1, out, y1), at(e, s0, out, y1), [0, 1, 0]);
  buf.quad(at(e, s0, 0, y0), at(e, s1, 0, y0), at(e, s1, out, y0), at(e, s0, out, y0), [0, -1, 0]);
}
function archOpening(buf, e, sc, w, y0, ySpring, off, steps) {
  const r = w / 2, pts = [at(e, sc - r, off, y0), at(e, sc + r, off, y0)];
  for (let k = 0; k <= steps; k++) { const a = k * Math.PI / steps; pts.push(at(e, sc + r * Math.cos(a), off, ySpring + r * Math.sin(a))); }
  buf.poly3(pts, outV(e));
}

export function buildFacade(B, { near }) {
  const m = (name) => B(name);
  for (let i = 0; i < N; i++) {
    if (i >= 29 && i <= 36) continue; // the east end is the open ferry plaza, not building
    const e = edge(i), H = EDGE_H[i], mat = EDGE_M[i], wall = m(mat), trim = m('stone');
    // the wall itself
    wall.quad(at(e, 0, 0, 0), at(e, e.L, 0, 0), at(e, e.L, 0, H), at(e, 0, 0, H), outV(e));
    // Inner face only where the inside can be seen from outside: the walls beside the open east plaza (the
    // arcade end and the 2nd Street wall). Elsewhere a roof strip covers the inside, and an inner face would
    // show as a stray sliver above a lower neighbouring wall. A free end gets a return wall under the strip.
    const skipped = (k) => { const m = (k + N) % N; return m >= 29 && m <= 36; }, free = { a: skipped(i - 1), b: skipped(i + 1) };
    if (i === 28 || (i >= 37 && i <= 39)) wall.quad(at(e, 0, -0.06, 0), at(e, e.L, -0.06, 0), at(e, e.L, -0.06, H), at(e, 0, -0.06, H), [-e.n[0], 0, -e.n[1]]);
    for (const [end, s, sign] of [['a', 0, -1], ['b', e.L, 1]]) {
      if (!free[end]) continue;
      const Dr = Math.min(8, 0.7 * e.L), top = H - (i % 2 ? 0 : 0.15), p0 = at(e, s, 0, 0), p1 = at(e, s, -Dr, 0), p2 = at(e, s, -Dr, top), p3 = at(e, s, 0, top);
      wall.quad(p0, p1, p2, p3, [e.u[0] * sign, 0, e.u[1] * sign]);
      wall.quad(p0, p1, p2, p3, [-e.u[0] * sign, 0, -e.u[1] * sign]);
    }
    // roof strip, parity-offset so the strips of neighbouring edges never share a plane
    const D = Math.min(8, 0.7 * e.L), rh = H - (i % 2 ? 0 : 0.15), inn = (s, y) => [e.a[0] + e.u[0] * s - e.n[0] * D, y, e.a[1] + e.u[1] * s - e.n[1] * D];
    const roof = m('roof');
    roof.quad(at(e, 0, 0, rh), at(e, e.L, 0, rh), inn(e.L, rh), inn(0, rh), [0, 1, 0]);
    // corner fill where this edge turns away from the next (a convex corner leaves a notch)
    const nx = edge((i + 1) % N), cross = e.u[0] * nx.u[1] - e.u[1] * nx.u[0], corner = [e.b[0], rh, e.b[1]];
    const turnsOut = pointInRing([e.b[0] - (e.n[0] + nx.n[0]) * 0.3, e.b[1] - (e.n[1] + nx.n[1]) * 0.3], OUTER);
    const Dn = Math.min(8, 0.7 * nx.L);
    if (turnsOut && Math.abs(cross) > 0.05) roof.tri(corner, [e.b[0] - e.n[0] * D, rh, e.b[1] - e.n[1] * D], [e.b[0] - nx.n[0] * Dn, rh, e.b[1] - nx.n[1] * Dn], [0, 1, 0]);
    if (e.L < 7) continue;
    // plinth and cornice
    if (mat !== 'concrete') {
      if (near) { ledge(trim, e, 0, e.L, 0, 1.3, 0.22); ledge(trim, e, 0, e.L, H - 1.1, H - 0.05, 0.4); }
      else panel(trim, e, 0, e.L, H - 1.1, H - 0.05, 0.3);
    }
    if (mat === 'concrete') continue;
    const glass = m('glass');
    if (!near) {
      // far LOD: one dark band per window row, and plain rectangles for the cove arches
      if (i === 27) { const n = Math.round(e.L / 5.9), pitch = e.L / n; for (let k = 0; k < n; k++) panel(glass, e, (k + 0.5) * pitch - 1.4, (k + 0.5) * pitch + 1.4, 0.9, 5.6, 0.12); }
      else {
        // a few short dark groups per row, so the brick still reads at 800 m
        const groups = Math.max(1, Math.round(e.L / 16)), gp = e.L / groups, gw = gp * 0.5, rows = H > 18 ? [[3.2, 6.4], [12.6, 15.8]] : [[3.2, Math.min(7, H - 3.5)]];
        for (let k = 0; k < groups; k++) for (const [y0, y1] of rows) panel(glass, e, (k + 0.5) * gp - gw / 2, (k + 0.5) * gp + gw / 2, y0, y1, 0.12);
      }
      continue;
    }
    // brick/stone facades: tall window bays between pilasters
    const n = Math.max(1, Math.round(e.L / 6.6)), pitch = e.L / n, ww = pitch * 0.56;
    for (let k = 0; k < n; k++) {
      const c = (k + 0.5) * pitch;
      if (H > 18) { panel(glass, e, c - ww / 2, c + ww / 2, 2.2, 9.2, 0.12); panel(glass, e, c - ww / 2, c + ww / 2, 11.4, H - 3.4, 0.12); }
      else panel(glass, e, c - ww / 2, c + ww / 2, 2.2, H - 3, 0.12);
    }
    for (let k = 0; k <= n; k++) {
      const s = k * pitch, w = 0.5;
      if (s - w / 2 < 0 || s + w / 2 > e.L) continue;
      const c0 = at(e, s, 0.2, 0);
      wall.box([c0[0], (H - 1.3) / 2, c0[2]], [w, H - 1.3, 0.36], -Math.atan2(e.u[1], e.u[0]));
    }
  }
}

// A vertical prism over a convex ring: walls facing outward and a flat top.
export function prism(buf, ring, y0, y1) {
  const c = ring.reduce((s, p) => [s[0] + p[0] / ring.length, s[1] + p[1] / ring.length], [0, 0]);
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    buf.quad([a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]], [(a[0] + b[0]) / 2 - c[0], 0, (a[1] + b[1]) / 2 - c[1]]);
  }
  buf.cap(ring, y1);
}
