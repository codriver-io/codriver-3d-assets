// Facades of the Royal York: plinth, string courses and cornices, piers, the window grid, the arched
// features (Concert Hall arcade, the podium arcade on the west face, the tower loggia, the big arches
// on the west wing) and the street furniture at the base. All in (u, v) hotel axes through the site
// module: u along Front Street (east), v across the hotel (south, toward Front Street).
import { RINGS, U, V, at, along, inside, centroid } from './fairmont-royal-york-site.js';

const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
export const face = (e) => {
  const nu = dot(e.n, U), nv = dot(e.n, V);
  return nv > 0.9 ? 'S' : nv < -0.9 ? 'N' : nu > 0.9 ? 'E' : nu < -0.9 ? 'W' : '?';
};
const mid = (e) => [(e.p[0] + e.q[0]) / 2, (e.p[1] + e.q[1]) / 2];
// Local wall coordinate of a global (u, v) point on an edge.
const local = (e, u, v) => { const p = at(u, v); return (p[0] - e.p[0]) * e.t[0] + (p[1] - e.p[1]) * e.t[1]; };
const rowsBetween = (lo, hi, pitch) => { const n = Math.max(1, Math.round((hi - lo) / pitch)), s = (hi - lo) / n; return Array.from({ length: n }, (_, k) => lo + (k + 0.5) * s); };
// A wall edge where another slab's wall carries on upward, so a parapet would cut across it.
const carriesOn = (e, ring) => { const m = mid(e); return inside(ring, m[0] - e.n[0] * 0.7, m[1] - e.n[1] * 0.7); };

// An arched opening: recessed glass in a limestone frame with reveals, optional mullions and transoms.
export function archOpening(ctx, e, uc, w, y0, ys, { pointed = true, frame = 0.4, dFrame = 0.55, dGlass = 0.08, glass = 'glass', sill = true, mull = 0, trans = [] } = {}) {
  const { kit, near } = ctx, steps = near ? 5 : 2;
  const inner = kit.archProfile(uc - w / 2, uc + w / 2, y0, ys, { pointed, steps });
  const outer = kit.archProfile(uc - w / 2 - frame, uc + w / 2 + frame, y0, ys, { pointed, steps });
  const n = inner.length, o = e.p, t = e.t, nn = e.n;
  kit.fan(glass, inner.map(([u, y]) => kit.wp(o, t, nn, u, y, dGlass)), kit.hint(nn));
  const cu = uc, cy = (y0 + ys) / 2;
  for (let i = 1; i < n; i++) { // frame band on the front, skipping the bottom edge
    const j = (i + 1) % n;
    kit.quad('limestone', kit.wp(o, t, nn, outer[i][0], outer[i][1], dFrame), kit.wp(o, t, nn, outer[j][0], outer[j][1], dFrame), kit.wp(o, t, nn, inner[j][0], inner[j][1], dFrame), kit.wp(o, t, nn, inner[i][0], inner[i][1], dFrame), kit.hint(nn));
    // reveal: from the frame plane back to the glass, facing the opening's centre
    const mu = (inner[i][0] + inner[j][0]) / 2 - cu, my = (inner[i][1] + inner[j][1]) / 2 - cy;
    kit.quad('limestone', kit.wp(o, t, nn, inner[i][0], inner[i][1], dFrame), kit.wp(o, t, nn, inner[j][0], inner[j][1], dFrame), kit.wp(o, t, nn, inner[j][0], inner[j][1], dGlass), kit.wp(o, t, nn, inner[i][0], inner[i][1], dGlass), [-t[0] * mu, -my, -t[1] * mu]);
  }
  if (near) { // the outer edge closes the frame against the wall
    for (let i = 1; i < n; i++) {
      const j = (i + 1) % n, mu = (outer[i][0] + outer[j][0]) / 2 - cu, my = (outer[i][1] + outer[j][1]) / 2 - cy;
      kit.quad('limestone', kit.wp(o, t, nn, outer[i][0], outer[i][1], 0), kit.wp(o, t, nn, outer[j][0], outer[j][1], 0), kit.wp(o, t, nn, outer[j][0], outer[j][1], dFrame), kit.wp(o, t, nn, outer[i][0], outer[i][1], dFrame), [t[0] * mu, my, t[1] * mu]);
    }
    if (sill) kit.slab('limestone', o, t, nn, uc - w / 2 - frame - 0.25, uc + w / 2 + frame + 0.25, y0 - 0.35, y0 + 0.1, dFrame + 0.25);
    const top = pointed ? ys + w * 0.8 : ys + w * 0.45;
    for (let k = 1; k <= mull; k++) { const um = uc - w / 2 + (w * k) / (mull + 1); kit.slab('limestone', o, t, nn, um - 0.07, um + 0.07, y0, top, dFrame - 0.05); }
    for (const f of trans) { const y = y0 + (ys - y0) * f; kit.slab('limestone', o, t, nn, uc - w / 2, uc + w / 2, y - 0.07, y + 0.07, dFrame - 0.05); }
  }
}

// A cheap round-headed window: glass with a thin limestone surround.
export function smallArch(ctx, e, uc, w, y0, ys, { glass = 'glass', frame = 0.2, dFrame = 0.3, dGlass = 0.1 } = {}) {
  const { kit } = ctx, o = e.p, t = e.t, n = e.n;
  const inner = kit.archProfile(uc - w / 2, uc + w / 2, y0, ys, { pointed: false, steps: 3 });
  const outer = kit.archProfile(uc - w / 2 - frame, uc + w / 2 + frame, y0, ys, { pointed: false, steps: 3 });
  kit.fan(glass, inner.map(([u, y]) => kit.wp(o, t, n, u, y, dGlass)), kit.hint(n));
  for (let i = 1; i < inner.length; i++) {
    const j = (i + 1) % inner.length;
    kit.quad('limestone', kit.wp(o, t, n, outer[i][0], outer[i][1], dFrame), kit.wp(o, t, n, outer[j][0], outer[j][1], dFrame), kit.wp(o, t, n, inner[j][0], inner[j][1], dFrame), kit.wp(o, t, n, inner[i][0], inner[i][1], dFrame), kit.hint(n));
  }
}

// A horizontal band (string course, cornice, parapet) along an edge, extended so corners close.
function band(ctx, e, y0, y1, d, mat = 'limestone', ext = d, top = true) {
  if (e.L < 1.5) return;
  ctx.kit.slab(mat, e.p, e.t, e.n, -ext, e.L + ext, y0, y1, d, { bottom: false, top });
}

// Plinth, string courses, cornices and parapets on every slab.
export function ground(ctx) {
  const { kit, slab } = ctx;
  for (const e of slab.A.edges) if (e.L >= 1.5) kit.slab('plinth', e.p, e.t, e.n, -0.28, e.L + 0.28, 0, 1.5, 0.28, { bottom: false });
  const top = (s, ring, cornice, parapet) => {
    for (const e of s.edges) {
      if (e.L < 1.5) continue;
      band(ctx, e, s.y1 - cornice[0], s.y1 - cornice[1], cornice[2], 'limestone');
      if (!carriesOn(e, ring)) {
        band(ctx, e, s.y1 - cornice[1], s.y1 + parapet[0], parapet[1], 'limestone', 0.3);
        band(ctx, e, s.y1 + parapet[0], s.y1 + parapet[0] + 0.3, parapet[1] + 0.3, 'copper', 0.6);
      }
    }
  };
  top(slab.A, RINGS.SHOULDERS, [2.3, 0.8, 0.9], [1.4, 0.35]);
  top(slab.B, RINGS.TOWER, [2.2, 0.8, 0.9], [1.4, 0.35]);
  top(slab.C, RINGS.STEP, [2.0, 0.7, 0.8], [1.3, 0.35]);
  top(slab.D, RINGS.CROWN, [1.2, 0.5, 0.6], [1.0, 0.3]);
  // string courses: over the ground floor, and breaking the tall walls into stages
  for (const e of slab.A.edges) band(ctx, e, 6.1, 6.7, 0.42, 'limestone', 0.42);
  if (ctx.near) {
    // belts sit on the boundaries between window rows, never across a window
    const rb = (lo, hi, pitch, k) => { const n = Math.max(1, Math.round((hi - lo) / pitch)); return lo + (k * (hi - lo)) / n; };
    const yB = rb(26.7, 62.4, 3.55, 5), yB2 = rb(26.7, 62.4, 3.55, 2), yC = rb(68.3, 84.2, 3.55, 2);
    for (const e of slab.B.edges) { band(ctx, e, yB - 0.32, yB + 0.32, 0.34, 'limestone', 0.34); band(ctx, e, yB2 - 0.14, yB2 + 0.14, 0.24, 'limestone', 0.24); }
    for (const e of slab.C.edges) band(ctx, e, yC - 0.32, yC + 0.32, 0.34, 'limestone', 0.34);
  }
}

// The window grid, piers and the street level, laid out once the arcades have claimed their zones.
export function wing(ctx) {
  const { kit, slab, near, rand } = ctx;
  ctx.zones = [];
  const skipZones = (e, uc, yc, h) => ctx.zones.some((z) => z.e === e && uc + 0.9 > z.u0 && uc - 0.9 < z.u1 && yc + h / 2 > z.y0 && yc - h / 2 < z.y1);
  const grid = (s, rows, { bay = 3.4, w = 1.7, h = 2.25, d = 0.16, margin = 1.3, lit = 0.3, piers = 0 } = {}) => {
    for (const e of s.edges) {
      if (e.L < 4.2) continue;
      const n = Math.max(1, Math.round((e.L - 2 * margin) / bay)), pitch = (e.L - 2 * margin) / n;
      if (!near) { // far: one dark slot per two bays, the full height of the wall
        const lo = rows[0] - h / 2, hi = rows[rows.length - 1] + h / 2;
        for (let i = 0; i < n; i += 2) {
          const uc = margin + pitch * (i + (i + 1 < n ? 1 : 0.5));
          let segs = [[lo, hi]]; // the slot is cut around any arcade that claimed this stretch of wall
          for (const z of ctx.zones) {
            if (z.e !== e || uc + 0.9 <= z.u0 || uc - 0.9 >= z.u1) continue;
            segs = segs.flatMap(([a, b]) => { const out = []; if (z.y0 > a) out.push([a, Math.min(b, z.y0)]); if (z.y1 < b) out.push([Math.max(a, z.y1), b]); return out; });
          }
          for (const [a, b] of segs) if (b - a > 2.5) kit.slab('glass', e.p, e.t, e.n, uc - 1.0, uc + 1.0, a, b, 0.2, { bottom: false });
        }
        continue;
      }
      for (let i = 0; i < n; i++) {
        const uc = margin + pitch * (i + 0.5);
        for (const yc of rows) {
          if (skipZones(e, uc, yc, h)) continue;
          // a window is one quad proud of the wall, its mullion a slender quad in front (paired lights): no boxes
          kit.panel(rand() < lit ? 'glow' : 'glass', e.p, e.t, e.n, uc - w / 2, uc + w / 2, yc - h / 2, yc + h / 2, d);
          kit.panel('limestone', e.p, e.t, e.n, uc - 0.07, uc + 0.07, yc - h / 2, yc + h / 2, d + 0.07);
        }
      }
      if (piers) { // slender piers every few bays and at both ends, clear of the arcades
        const y0 = s.y0 + 0.4, y1 = s.y1 - 2.4;
        for (let i = 0; i <= n; i += piers) {
          const u = margin + pitch * i;
          if (skipZones(e, u, (y0 + y1) / 2, y1 - y0)) continue;
          kit.slab('limestone', e.p, e.t, e.n, u - 0.42, u + 0.42, y0, y1, 0.3, { bottom: false });
        }
      }
    }
  };
  ctx.finishWindows = () => {
    grid(slab.A, rowsBetween(7.4, 22.3, 3.3));
    grid(slab.B, rowsBetween(26.7, 62.4, 3.55), { piers: 3 });
    grid(slab.C, rowsBetween(68.3, 84.2, 3.55), { piers: 3 });
    streetLevel(ctx, skipZones);
  };
}

// Ground floor windows and doors, the red awnings, and the entrance marquee on Front Street.
function streetLevel(ctx) {
  const { kit, slab, near } = ctx;
  for (const e of slab.A.edges) {
    if (e.L < 4.2) continue;
    const f = face(e), n = Math.max(1, Math.round((e.L - 2.4) / 3.4)), pitch = (e.L - 2.4) / n;
    for (let i = 0; i < n; i++) {
      const uc = 1.2 + pitch * (i + 0.5);
      if (near) smallArch(ctx, e, uc, 1.6, 1.9, 4.3, { frame: 0.22, dFrame: 0.32 });
      else kit.slab('glass', e.p, e.t, e.n, uc - 0.8, uc + 0.8, 1.9, 5.4, 0.15, { bottom: false });
    }
    // awnings on Front Street and the west face
    if (near && (f === 'S' || f === 'W')) {
      const m = Math.max(1, Math.round(e.L / 6.6)), p = e.L / m;
      for (let i = 0; i < m; i++) awning(kit, e, p * (i + 0.5), 2.7);
    }
  }
  // Entrance marquee over the porte-cochere at the middle of the S3 pavilion (u 10.7 .. 28.2).
  const s3 = slab.A.edges.find((e) => face(e) === 'S' && e.L > 15 && e.L < 20 && along(e.p) > 5 && along(e.p) < 15);
  if (s3) {
    const c = s3.L / 2;
    kit.slab('metal', s3.p, s3.t, s3.n, c - 4.6, c + 4.6, 4.7, 5.3, 3.6, { bottom: true });
    kit.slab('limestone', s3.p, s3.t, s3.n, c - 4.6, c + 4.6, 5.3, 5.6, 3.7, {});
    if (near) for (const u of [c - 4.2, c + 4.2]) for (const d of [3.3]) kit.slab('metal', s3.p, s3.t, s3.n, u - 0.14, u + 0.14, 0, 4.7, d + 0.14, { top: false, bottom: false });
  }
}

// A sloped fabric awning, wall at the top, valance at the front.
function awning(kit, e, uc, w) {
  const o = e.p, t = e.t, n = e.n, yTop = 5.4, yFront = 4.3, d = 1.5, half = w / 2;
  const A = kit.wp(o, t, n, uc - half, yTop, 0.02), B = kit.wp(o, t, n, uc + half, yTop, 0.02), C = kit.wp(o, t, n, uc + half, yFront, d), D = kit.wp(o, t, n, uc - half, yFront, d);
  kit.quad('awning', A, B, C, D, [n[0] * 0.5, 1, n[1] * 0.5]);
  const Cb = kit.wp(o, t, n, uc + half, yFront - 0.4, d), Db = kit.wp(o, t, n, uc - half, yFront - 0.4, d);
  kit.quad('awning', D, C, Cb, Db, kit.hint(n));
  kit.tri('awning', A, D, kit.wp(o, t, n, uc - half, yFront, 0.02), [-t[0], 0, -t[1]]);
  kit.tri('awning', B, kit.wp(o, t, n, uc + half, yFront, 0.02), C, [t[0], 0, t[1]]);
}

// Arched features. Zones are recorded first (windows keep out), then everything is drawn.
export function arcade(ctx) {
  const { kit, slab, near } = ctx;
  const A = slab.A.edges, B = slab.B.edges, C = slab.C.edges;
  const find = (edges, f, test) => edges.filter((e) => face(e) === f && e.L > 3 && test(e));
  const sEdge = (edges, u0, u1) => find(edges, 'S', (e) => { const a = along(e.p), c = along(e.q); return Math.min(a, c) > u0 - 1 && Math.max(a, c) < u1 + 1; });
  const zone = (e, u0, u1, y0, y1) => ctx.zones.push({ e, u0: Math.min(u0, u1), u1: Math.max(u0, u1), y0, y1 });

  // Concert Hall arcade on Front Street: eight pointed arches over a balcony (A, u 28.3..55).
  const hall = sEdge(A, 29, 56.2)[0];
  if (hall) {
    const n = 8, pitch = hall.L / n;
    zone(hall, 0, hall.L, 6.4, 21);
    for (let i = 0; i < n; i++) archOpening(ctx, hall, pitch * (i + 0.5), 2.3, 8.2, 16.2, { mull: 1, trans: [0.55] });
    if (near) kit.slab('limestone', hall.p, hall.t, hall.n, -0.4, hall.L + 0.4, 6.9, 7.7, 1.2); // balcony
    if (near) for (let i = 0; i <= n; i++) kit.slab('limestone', hall.p, hall.t, hall.n, pitch * i - 0.22, pitch * i + 0.22, 8.2, 17.4, 0.75);
  }
  // West face of the podium: a long arcade of tall pointed arches on the second and third floors.
  for (const e of A.filter((q) => face(q) === 'W' && q.L > 20)) {
    const n = Math.round(e.L / 5.0), pitch = e.L / n;
    zone(e, 0, e.L, 6.4, 21);
    for (let i = 0; i < n; i++) archOpening(ctx, e, pitch * (i + 0.5), 2.2, 8.2, 16.6, { mull: 1, trans: [0.5] });
    if (near) kit.slab('limestone', e.p, e.t, e.n, -0.4, e.L + 0.4, 6.9, 7.6, 0.9);
  }
  // The long Front Street wall (A, u -55.6..10.7): arched windows with balconies.
  for (const e of sEdge(A, -55, 12.5)) {
    if (e.L < 8) continue;
    const n = Math.max(1, Math.round(e.L / 6.6)), pitch = e.L / n;
    zone(e, 0, e.L, 6.4, 21);
    for (let i = 0; i < n; i++) {
      archOpening(ctx, e, pitch * (i + 0.5), 1.9, 8.4, 15.2, { mull: 1 });
      if (near) kit.slab('limestone', e.p, e.t, e.n, pitch * (i + 0.5) - 1.8, pitch * (i + 0.5) + 1.8, 7.6, 8.4, 0.95);
    }
  }
  // The west wing's south face: one big round-headed window three storeys tall.
  for (const e of find(B, 'S', (q) => along(q.p) < -50)) {
    if (e.L < 8) continue;
    zone(e, e.L / 2 - 4, e.L / 2 + 4, 44, 64);
    archOpening(ctx, e, e.L / 2, 4.6, 46.5, 58.5, { pointed: false, frame: 0.5, dFrame: 0.7, mull: 1, trans: [0.3, 0.6] });
    if (near) kit.slab('limestone', e.p, e.t, e.n, e.L / 2 - 3.6, e.L / 2 + 3.6, 45.7, 46.5, 1.1);
  }
  // The tower loggia: five round arches on the spine's south face, just under the crown.
  const spineC = find(C, 'S', (e) => e.L > 50)[0];
  if (spineC) {
    const uc = along(centroid(RINGS.CROWN));
    for (let k = -2; k <= 2; k++) {
      const lc = local(spineC, uc + k * 4.3, 0);
      zone(spineC, lc - 2.2, lc + 2.2, 70, 81);
      archOpening(ctx, spineC, lc, 3.2, 72.4, 77.4, { pointed: false, frame: 0.42, dFrame: 0.6, mull: 1, trans: [0.4] });
      if (near) kit.slab('limestone', spineC.p, spineC.t, spineC.n, lc - 2.3, lc + 2.3, 71.6, 72.4, 1.0);
    }
    if (near) kit.slab('limestone', spineC.p, spineC.t, spineC.n, local(spineC, uc - 11.2, 0), local(spineC, uc + 11.2, 0), 70.9, 71.5, 0.6);
  }
  // Tall slender arches along the west face of the west wing, near its top.
  for (const e of B.filter((q) => face(q) === 'W' && q.L > 20)) {
    const n = Math.round(e.L / 7.4), pitch = e.L / n;
    zone(e, 0, e.L, 46, 64);
    for (let i = 0; i < n; i++) archOpening(ctx, e, pitch * (i + 0.5), 1.7, 47, 60, { frame: 0.35, dFrame: 0.45, mull: 1 });
  }
  ctx.finishWindows();
}
