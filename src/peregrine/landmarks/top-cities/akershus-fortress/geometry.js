// Akershus slott (Akershus Fortress), Oslo, as it stands: Håkon V's castle of the 1290s, rebuilt for
// Christian IV as a Renaissance residence (Blåtårnet 1623, Romerikstårnet in the 1630s). Warm pink-tan
// rendered wings around the borggård, darker brick crow-step gables, steep dark roofs, two stair
// towers with verdigris caps, and a grey rubble rampart on the mapped bastion. Later barracks east
// of the castle are not part of this model.
// Frame: +X east, +Y up, +Z south, real metres. y = 0 is the inner-fortress grade. The rings already
// carry the mapped orientation, so nothing is rotated again.
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS } from './akershus-fortress-plan.js';
import { meshKit, ringEdges, buried, inside, distToRing } from './akershus-fortress-kit.js';

// OSM part heights make six-storey walls and leave the spires only a few metres above the ridges.
// The harbour photographs show three-storey wings and spires that clear the roofs, so the wings are
// brought down. Tower tips stay at the mapped 36 m. See the landmark doc.
const TUNE = {
  'Nordfløyen': { h: 21, roofH: 6.5, stoneTo: 4 },
  'Romeriksfløyen': { h: 17.5, roofH: 5, stoneTo: 3.8 },
  'Skriverstuefløyen': { h: 16, roofH: 3.6, stoneTo: 3.8 },
  'Sydfløyen': { h: 17, roofH: 4.5, stoneTo: 4 },
  'Fadebursfløyen': { h: 15, roofH: 4, stoneTo: 7 },
  'Fruerstuefløyen': { h: 16, roofH: 4.5, stoneTo: 4 },
  'Vågehalstårnet': { h: 13.5, roofH: 0.4, stoneTo: 13.5 },
  'south court link': { h: 12, roofH: 3, roofMat: 'slate', stoneTo: 6 },
  'Det kongelige mausoleum': { h: 9, roofH: 2.2 },
  'north gate': { h: 10, roofH: 2, stoneTo: 8 },
  'north-west cap': { h: 12, roofH: 3.5, stoneTo: 8 },
  'south-west pier': { h: 9, roofH: 0.3, stoneTo: 9 },
  'Den store pille': { h: 4.2, roofH: 3.2 },
  'Jomfrutårnet': { h: 14, roofH: 5 },
  'Munks tårn': { h: 11, roofH: 4 },
  'Knutstårnet': { h: 12 },
  'Blåtårnet': { shaft: 16.8 },
  'Romerikstårnet': { shaft: 22.5 },
  // Plateau parapets, not the quay cliff. Photo 5's 15–20 m of stone is the scarp below y=0.
  'west rampart': { parapet: 9.0 },
  'castle podium': { parapet: 6.8 },
  'north-east rampart': { parapet: 7.4 },
};

function tune(p) {
  const t = TUNE[p.name];
  return t ? { ...p, ...t } : p;
}

const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];

function frame(ring) {
  const edges = ringEdges(ring);
  const long = edges.reduce((a, e) => (e.L > a.L ? e : a));
  const t = long.t, n = [-t[1], t[0]];
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (const p of ring) {
    const u = dot2(p, t), v = dot2(p, n);
    u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v);
  }
  const at = (u, v, y) => [t[0] * u + n[0] * v, y, t[1] * u + n[1] * v];
  return { t, n, u0, u1, v0, v1, vm: (v0 + v1) / 2, at, edges };
}

function circle(cx, cz, r, sides) {
  const out = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    out.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
  }
  return out;
}

function centroid(ring) {
  let x = 0, z = 0;
  for (const p of ring) { x += p[0]; z += p[1]; }
  return [x / ring.length, z / ring.length];
}

function inscribed(ring, c) {
  let r = Infinity;
  for (const e of ringEdges(ring)) r = Math.min(r, Math.abs((c[0] - e.p[0]) * e.n[0] + (c[1] - e.p[1]) * e.n[1]));
  return Math.max(0.8, r);
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const kit = meshKit();
  build(kit, near);
  kit.flush(b);
  const root = b.finish();
  root.userData.tris = kit.stats.tris;
  return root;
}

function build(kit, near) {
  const parts = PARTS.map(tune);
  const buildings = parts.filter((p) => p.role === 'wing' || p.role === 'tower' || p.role === 'slab');
  const bases = parts.filter((p) => p.role === 'base');
  // A 2 m terrace must not delete a 12 m wall. Only full-height parts bury a neighbour.
  const blockers = buildings.filter((p) => p.role !== 'slab').map((p) => p.ring);
  const all = buildings.map((p) => p.ring);

  for (const base of bases) rampart(kit, base, all, bases, near);
  for (const p of buildings) {
    if (p.role === 'slab') slab(kit, p, all);
    else if (p.role === 'tower') tower(kit, p, blockers, near);
    else wing(kit, p, blockers, near);
  }
}

function rampart(kit, base, buildings, bases, near) {
  const others = bases.filter((b) => b !== base).map((b) => b.ring);
  for (const e of ringEdges(base.ring)) {
    const mx = (e.p[0] + e.q[0]) / 2, mz = (e.p[1] + e.q[1]) / 2;
    const ox = mx + e.n[0] * 1.3, oz = mz + e.n[1] * 1.3;
    if (buildings.some((r) => inside(r, mx, mz) || inside(r, ox, oz) || distApprox(r, mx, mz) < 1.15)) continue;
    if (others.some((r) => inside(r, ox, oz))) continue;
    // Heavy foot, then a steeper upper face, so the curtain reads as a rubble mass.
    const y1 = base.parapet, y0w = y1 - 1.7, T = 4.1, yk = y1 * 0.46;
    const foot = 1.05, waist = 0.4;
    const at = (pt, d, y) => [pt[0] + e.n[0] * d, y, pt[1] + e.n[1] * d];
    const A0 = at(e.p, foot, 0), B0 = at(e.q, foot, 0);
    const Am = at(e.p, waist, yk), Bm = at(e.q, waist, yk);
    const A1 = [e.p[0], y1, e.p[1]], B1 = [e.q[0], y1, e.q[1]];
    kit.quad('stone', A0, B0, Bm, Am, [e.n[0], 0.38, e.n[1]]);
    kit.quad('stone', Am, Bm, B1, A1, [e.n[0], 0.12, e.n[1]]);
    rubbleCourses(kit, e, y1, yk, foot, waist, near);
    const ip = [e.p[0] - e.n[0] * T, e.p[1] - e.n[1] * T];
    const iq = [e.q[0] - e.n[0] * T, e.q[1] - e.n[1] * T];
    kit.wall('stone', iq, ip, y0w, y1, [-e.n[0], -e.n[1]]);
    kit.quad('stone', A1, B1, [iq[0], y1, iq[1]], [ip[0], y1, ip[1]], [0, 1, 0]);
    if (e.L > 7) merlons(kit, e, y1, near);
    if (near && e.L > 14 && y1 > 6) {
      const n = Math.max(1, Math.floor(e.L / 8));
      const slitY = y1 - 2.7;
      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) * (e.L / n);
        kit.panel('glass', e.p, e.t, e.n, u - 0.14, u + 0.14, slitY, slitY + 0.85, 0.1);
        kit.panel('trim', e.p, e.t, e.n, u - 0.22, u - 0.14, slitY - 0.06, slitY + 0.92, 0.14);
        kit.panel('trim', e.p, e.t, e.n, u + 0.14, u + 0.22, slitY - 0.06, slitY + 0.92, 0.14);
      }
    }
  }
}

// Projecting beds on the battered face. The proud edge stays inside the foot batter.
function rubbleCourses(kit, e, y1, yk, foot, waist, near) {
  const bands = near ? 4 : 2;
  const proudOf = (y) => {
    const d = y < yk ? foot - (foot - waist) * (y / yk) : waist * (1 - (y - yk) / Math.max(0.4, y1 - yk));
    return Math.min(d + 0.14, 1.28);
  };
  for (let i = 1; i <= bands; i++) {
    const yb = (y1 * i) / (bands + 1.15);
    const d = proudOf(yb), h = 0.2;
    const P = (pt, y, dd) => [pt[0] + e.n[0] * dd, y, pt[1] + e.n[1] * dd];
    kit.quad('stone', P(e.p, yb, d), P(e.q, yb, d), P(e.q, yb + h, d), P(e.p, yb + h, d), [e.n[0], 0.05, e.n[1]]);
  }
}

// Irregular coping. Projection stays inside the 1.05 m foot batter.
function merlons(kit, e, y, near) {
  const pitch = near ? 2.45 : 4.8;
  const n = Math.max(1, Math.floor(e.L / pitch));
  const slot = e.L / n;
  const out = 0.18;
  for (let i = 0; i < n; i++) {
    const mw = Math.min(near ? 1.2 : 1.7, slot * (i % 2 === 0 ? 0.64 : 0.46));
    const h = near ? (i % 3 === 1 ? 0.7 : 1.12) : 0.9;
    const u = (i + 0.5) * slot, u0 = u - mw / 2, u1 = u + mw / 2;
    const P = (uu, yy, d) => kit.wp(e.p, e.t, e.n, uu, yy, d);
    kit.quad('stone', P(u0, y, out), P(u1, y, out), P(u1, y + h, out), P(u0, y + h, out), kit.hint(e.n));
    kit.quad('stone', P(u0, y + h, 0), P(u1, y + h, 0), P(u1, y + h, out), P(u0, y + h, out), [0, 1, 0]);
    kit.quad('stone', P(u0, y, 0), P(u0, y, out), P(u0, y + h, out), P(u0, y + h, 0), [-e.t[0], 0, -e.t[1]]);
    kit.quad('stone', P(u1, y, out), P(u1, y, 0), P(u1, y + h, 0), P(u1, y + h, out), [e.t[0], 0, e.t[1]]);
    if (near) kit.quad('stone', P(u0, y + h, out), P(u1, y + h, out), P(u1, y + h - 0.12, out * 0.35), P(u0, y + h - 0.12, out * 0.35), kit.hint(e.n));
  }
}

function distApprox(ring, x, z) {
  let d = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const ax = ring[j][0], az = ring[j][1], bx = ring[i][0], bz = ring[i][1];
    const dx = bx - ax, dz = bz - az, len = dx * dx + dz * dz;
    const t = len ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / len)) : 0;
    d = Math.min(d, Math.hypot(x - ax - dx * t, z - az - dz * t));
  }
  return d;
}

function slab(kit, p, blockers) {
  kit.prism('stone', p.ring, 0, p.h, { blockers, self: p.ring });
  kit.cap('stone', p.ring, p.h, true);
}

function wing(kit, p, blockers, near) {
  const wallTop = p.h - (p.roofH || 0);
  const stoneTo = Math.min(p.stoneTo ?? wallTop, wallTop);
  kit.prism('stone', p.ring, 0, stoneTo, { blockers, self: p.ring });
  if (wallTop - stoneTo > 0.08) kit.prism(p.wall, p.ring, stoneTo, wallTop, { blockers, self: p.ring });
  if (p.roof === 'gable') gableRoof(kit, p, wallTop, p.h, near, blockers);
  else if (p.roof === 'hip') hipRoof(kit, p, wallTop, p.h, near, blockers);
  else if (p.roof === 'skillion') skillionRoof(kit, p, wallTop, p.h, blockers);
  else flatRoof(kit, p.ring, wallTop, p.roofMat, p.h - wallTop);
  const winFrom = p.wall === 'stone' ? Math.min(3.2, Math.max(0.4, wallTop - 2)) : stoneTo;
  dress(kit, p, winFrom, wallTop, blockers, near);
}

function tower(kit, p, blockers, near) {
  if (p.kind === 'pyramid') return pyramidTower(kit, p, blockers, near);
  if (p.kind === 'flat') return flatTower(kit, p, blockers, near);
  const sides = near ? 12 : 8;
  const c = centroid(p.ring);
  const r = inscribed(p.ring, c);
  const stoneTo = 4.2;
  // Stair towers stand in the corner of a wing. Skip the buried test or the harbour face
  // disappears for its whole height, including the part that clears the neighbouring roof.
  kit.prism('stone', p.ring, 0, stoneTo, {});
  kit.prism('render', p.ring, stoneTo, p.shaft, {});
  kit.cap('render', p.ring, p.shaft, true);
  dress(kit, { ...p, wall: 'render', roof: 'flat' }, stoneTo, p.shaft - 0.4, blockers, near);
  for (const e of ringEdges(p.ring)) {
    if (!buried(e, blockers, p.ring)) continue;
    windows(kit, e, Math.max(stoneTo, p.shaft - 7), p.shaft - 0.5, near);
  }
  if (p.kind === 'blatarn') {
    const bulb = p.shaft + 6.4;
    revolved(kit, c, r, p.shaft, bulb, [[0, 0.9], [0.14, 1.06], [0.34, 1.2], [0.55, 1.08], [0.74, 0.7], [0.88, 0.36], [1, 0.15]], sides, 'copper');
    spire(kit, c, r * 0.15, bulb, p.h, sides, 'copper');
    return;
  }
  // Romerikstårnet: a square lantern and a pointed copper spire, with a clock toward the harbour.
  const hw = r * 0.7;
  const sq = [[c[0] - hw, c[1] - hw], [c[0] + hw, c[1] - hw], [c[0] + hw, c[1] + hw], [c[0] - hw, c[1] + hw]];
  const lantern = p.shaft + 1.8;
  kit.prism('render', sq, p.shaft, lantern, {});
  kit.cap('copper', sq, lantern, true);
  for (const e of ringEdges(sq)) {
    kit.panel(near ? 'glow' : 'glass', e.p, e.t, e.n, e.L * 0.28, e.L * 0.72, p.shaft + 0.4, lantern - 0.35, 0.08);
  }
  const clockY = p.shaft - 2.5;
  for (const e of ringEdges(p.ring)) {
    if (e.n[0] < -0.45 || e.n[1] > 0.45) {
      disc(kit, e, clockY, near ? 0.78 : 0.7, 'trim', 0.1, near ? 12 : 8);
      disc(kit, e, clockY, near ? 0.55 : 0.5, 'iron', 0.16, near ? 12 : 8);
    }
  }
  const coneTop = Math.min(p.h - 5.5, lantern + 5.2);
  revolved(kit, c, r, lantern, coneTop, [[0, 0.62], [0.22, 0.48], [0.55, 0.24], [1, 0.08]], sides, 'copper');
  spire(kit, c, r * 0.08, coneTop, p.h, sides, 'copper');
}

function pyramidTower(kit, p, blockers, near) {
  const wallTop = p.h - p.roofH;
  kit.prism(p.wall, p.ring, 0, wallTop, { blockers, self: p.ring });
  const c = centroid(p.ring);
  cone(kit, p.ring, wallTop, [c[0], p.h, c[1]], p.roofMat);
  dress(kit, { ...p, wall: p.wall }, Math.min(5, wallTop * 0.4), wallTop, blockers, near);
}

function flatTower(kit, p, blockers, near) {
  const walk = p.h - 1.35;
  kit.prism('stone', p.ring, 0, walk, { blockers, self: p.ring });
  kit.cap('stone', p.ring, walk, true);
  for (const e of ringEdges(p.ring)) {
    if (buried(e, blockers, p.ring)) continue;
    const ip = [e.p[0] - e.n[0] * 0.45, e.p[1] - e.n[1] * 0.45];
    const iq = [e.q[0] - e.n[0] * 0.45, e.q[1] - e.n[1] * 0.45];
    kit.wall('stone', e.p, e.q, walk, p.h, e.n);
    kit.wall('stone', iq, ip, walk, p.h, [-e.n[0], -e.n[1]]);
    kit.quad('stone', [e.p[0], p.h, e.p[1]], [e.q[0], p.h, e.q[1]], [iq[0], p.h, iq[1]], [ip[0], p.h, ip[1]], [0, 1, 0]);
  }
  dress(kit, { ...p, wall: 'stone' }, 4, walk - 0.3, blockers, near);
}

function gableRoof(kit, p, y0, y1, near, blockers) {
  const F = frame(p.ring);
  for (const e of F.edges) {
    // A neighbour can touch the wall (a terrace, a lower link) without owning the roof.
    // Slope quads lie over this footprint and still draw; eaves and gable ends do not,
    // or they land inside the neighbour and the ridge ornaments read as floating.
    const shared = buried(e, blockers, p.ring);
    const facing = dot2(e.n, F.n);
    const a = [e.p[0], y0, e.p[1]], b = [e.q[0], y0, e.q[1]];
    if (Math.abs(facing) >= 0.4) {
      const ua = dot2(e.p, F.t), ub = dot2(e.q, F.t);
      const ra = F.at(ua, F.vm, y1), rb = F.at(ub, F.vm, y1);
      if (faceInside(p.ring, [a, b, ra, rb])) {
        kit.quad(p.roofMat, a, b, rb, ra, [e.n[0], 0.7, e.n[1]]);
        if (!shared && p.dormers && e.L > 10 && e.n[0] < -0.55) dormers(kit, e, F, y0, y1, near, p.roofMat, p.ring);
      }
      if (!shared) {
        eave(kit, e, y0);
        if (near && e.L > 8) corbels(kit, e, y0);
      }
    } else if (!shared) {
      const mid = [(e.p[0] + e.q[0]) / 2, y1, (e.p[1] + e.q[1]) / 2];
      const gableMat = near && p.steps ? 'brick' : (p.wall === 'stone' ? 'stone' : 'render');
      kit.tri(gableMat, a, b, mid, [e.n[0], 0.05, e.n[1]]);
      if (p.steps && e.L > 5 && e.L < 22) crowSteps(kit, e, y0, y1, near, near && p.steps ? 'brick' : 'trim');
      if (p.name === 'Nordfløyen' && e.n[0] < -0.6) {
        disc(kit, e, y0 + (y1 - y0) * 0.58, near ? 0.9 : 0.8, 'trim', 0.08, near ? 12 : 8);
        disc(kit, e, y0 + (y1 - y0) * 0.58, near ? 0.62 : 0.55, 'glass', 0.14, near ? 10 : 8);
      }
    }
  }
  if ((p.dormers || p.steps) && y1 + 2.05 < 36) chimneys(kit, F, y1, near, p.ring);
}

function hipRoof(kit, p, y0, y1, near, blockers) {
  const ring = p.ring, mat = p.roofMat;
  const F = frame(ring);
  const halfW = (F.v1 - F.v0) / 2;
  const ru0 = F.u0 + halfW * 0.85, ru1 = F.u1 - halfW * 0.85;
  if (ru1 - ru0 < 0.8) {
    const c = centroid(ring);
    cone(kit, ring, y0, [c[0], y1, c[1]], mat);
    return;
  }
  const R0 = F.at(ru0, F.vm, y1), R1 = F.at(ru1, F.vm, y1);
  for (const e of F.edges) {
    const shared = buried(e, blockers, ring);
    const a = [e.p[0], y0, e.p[1]], b = [e.q[0], y0, e.q[1]];
    const facing = Math.abs(dot2(e.n, F.n));
    const ua = dot2(e.p, F.t), ub = dot2(e.q, F.t);
    if (facing > 0.45) {
      const ca = Math.max(ru0, Math.min(ru1, ua)), cb = Math.max(ru0, Math.min(ru1, ub));
      const ra = F.at(ca, F.vm, y1), rb = F.at(cb, F.vm, y1);
      if (faceInside(ring, [a, b, ra, rb])) {
        kit.quad(mat, a, b, rb, ra, [e.n[0], 0.65, e.n[1]]);
        if (!shared && p.dormers && e.L > 10 && e.n[0] < -0.55) dormers(kit, e, F, y0, y1, near, mat, ring);
      }
    } else if (!shared) {
      const end = (ua + ub) / 2 < (F.u0 + F.u1) / 2 ? R0 : R1;
      if (faceInside(ring, [a, b, end])) kit.tri(mat, a, b, end, [e.n[0], 0.65, e.n[1]]);
    }
    if (!shared) {
      eave(kit, e, y0);
      if (near && e.L > 8) corbels(kit, e, y0);
    }
  }
}

function skillionRoof(kit, p, yLow, yHigh, blockers) {
  const edges = ringEdges(p.ring);
  let high = edges[0], best = Infinity;
  for (const e of edges) {
    const d = Math.hypot((e.p[0] + e.q[0]) / 2, (e.p[1] + e.q[1]) / 2);
    if (d < best) { best = d; high = e; }
  }
  const n = high.n;
  const dHigh = high.p[0] * n[0] + high.p[1] * n[1];
  let dMin = Infinity, dMax = -Infinity;
  for (const q of p.ring) {
    const d = q[0] * n[0] + q[1] * n[1];
    dMin = Math.min(dMin, d); dMax = Math.max(dMax, d);
  }
  const span = dMax - dMin || 1;
  const highAtMin = Math.abs(dHigh - dMin) <= Math.abs(dHigh - dMax);
  const yAt = (q) => {
    const d = q[0] * n[0] + q[1] * n[1];
    const t = highAtMin ? (dMax - d) / span : (d - dMin) / span;
    return yLow + (yHigh - yLow) * t;
  };
  const ccw = ringArea(p.ring) < 0 ? [...p.ring].reverse() : p.ring;
  // Local triangulation without pulling three into this branch twice: fan from a convex-ish ear clip via the kit cap's method.
  // A height field: reuse ShapeUtils through a one-off by asking the cap code path indirectly.
  heightField(kit, ccw, yAt, p.roofMat);
  for (const e of edges) {
    if (buried(e, blockers, p.ring)) continue;
    const ya = yAt(e.p), yb = yAt(e.q);
    if (ya > yLow + 0.05 || yb > yLow + 0.05) {
      kit.quad(p.wall, [e.p[0], yLow, e.p[1]], [e.q[0], yLow, e.q[1]], [e.q[0], yb, e.q[1]], [e.p[0], ya, e.p[1]], [e.n[0], 0.2, e.n[1]]);
    }
    eave(kit, e, Math.min(ya, yb));
  }
}

function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return a / 2;
}

function faceInside(ring, pts) {
  let x = 0, z = 0;
  for (const p of pts) {
    if (distToRing(ring, p[0], p[2]) > 1.25) return false;
    x += p[0]; z += p[2];
  }
  return distToRing(ring, x / pts.length, z / pts.length) < 0.7;
}

// Contiguous stretches of the ridge that stay inside the footprint. A single min/max span
// would bridge a courtyard gap and leave a crest hanging in the air.
function ridgeRuns(F, ring) {
  if (!ring) return [[F.u0, F.u1]];
  const runs = [];
  let a = null, prev = null;
  for (let u = F.u0; u <= F.u1 + 0.01; u += 0.6) {
    const p = F.at(u, F.vm, 0);
    if (distToRing(ring, p[0], p[2]) < 0.45) {
      if (a === null) a = u;
      prev = u;
    } else if (a !== null) {
      if (prev - a > 2) runs.push([a, prev]);
      a = null;
    }
  }
  if (a !== null && prev - a > 2) runs.push([a, prev]);
  return runs;
}

function heightField(kit, ring, yAt, mat) {
  // Ear clip in the plane. A triangle whose centroid leaves the ring is dropped (concave wings).
  const idx = earClip(ring);
  for (const [i, j, k] of idx) {
    const A = ring[i], B = ring[j], C = ring[k];
    const cx = (A[0] + B[0] + C[0]) / 3, cz = (A[1] + B[1] + C[1]) / 3;
    if (distToRing(ring, cx, cz) > 0.5) continue;
    kit.tri(mat, [A[0], yAt(A), A[1]], [B[0], yAt(B), B[1]], [C[0], yAt(C), C[1]], [0, 1, 0]);
  }
}

function earClip(ring) {
  const n = ring.length;
  if (n < 3) return [];
  if (n === 3) return [[0, 1, 2]];
  const V = ring.map((_, i) => i);
  const tris = [];
  const area = ringArea(ring);
  const cw = area < 0;
  const isEar = (a, b, c) => {
    const A = ring[a], B = ring[b], C = ring[c];
    const cross = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    if (cw ? cross > -1e-8 : cross < 1e-8) return false;
    for (let i = 0; i < n; i++) {
      if (i === a || i === b || i === c) continue;
      if (pointInTri(ring[i], A, B, C)) return false;
    }
    return true;
  };
  let guard = n * n;
  while (V.length > 3 && guard-- > 0) {
    let clipped = false;
    for (let i = 0; i < V.length; i++) {
      const a = V[(i + V.length - 1) % V.length], b = V[i], c = V[(i + 1) % V.length];
      if (!isEar(a, b, c)) continue;
      tris.push([a, b, c]);
      V.splice(i, 1);
      clipped = true;
      break;
    }
    if (!clipped) break;
  }
  if (V.length === 3) tris.push([V[0], V[1], V[2]]);
  if (!tris.length) for (let i = 1; i < n - 1; i++) tris.push([0, i, i + 1]);
  return tris;
}

function pointInTri(p, a, b, c) {
  const s = (x, y, z) => (x[0] - z[0]) * (y[1] - z[1]) - (y[0] - z[0]) * (x[1] - z[1]);
  const d1 = s(p, a, b), d2 = s(p, b, c), d3 = s(p, c, a);
  const neg = d1 < 0 || d2 < 0 || d3 < 0, pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

function flatRoof(kit, ring, y, mat, parapet) {
  kit.cap(mat, ring, y, true);
  if (parapet < 0.2) return;
  for (const e of ringEdges(ring)) {
    const ip = [e.p[0] - e.n[0] * 0.4, e.p[1] - e.n[1] * 0.4];
    const iq = [e.q[0] - e.n[0] * 0.4, e.q[1] - e.n[1] * 0.4];
    kit.wall(mat, e.p, e.q, y, y + parapet, e.n);
    kit.wall(mat, iq, ip, y, y + parapet, [-e.n[0], -e.n[1]]);
    kit.quad(mat, [e.p[0], y + parapet, e.p[1]], [e.q[0], y + parapet, e.q[1]], [iq[0], y + parapet, iq[1]], [ip[0], y + parapet, ip[1]], [0, 1, 0]);
  }
}

function dress(kit, p, y0, y1, blockers, near) {
  if (y1 - y0 < 2) return;
  for (const e of ringEdges(p.ring)) {
    if (buried(e, blockers, p.ring) || e.L < 3.2) continue;
    const hall = harbourHall(p, e);
    if (hall) hallWindows(kit, e, y0, y1, near);
    else windows(kit, e, y0, y1, near);
    if (hall) courses(kit, e, y0 + Math.min(5.3, (y1 - y0) * 0.62), y1);
    else courses(kit, e, y0, y1);
    kit.panel('stone', e.p, e.t, e.n, 0, e.L, 0, 0.38, 0.06);
    if (near && e.L > 5.5) quoins(kit, e, y1);
    if (!hall && near && (p.h || 0) > 8 && e.L > 9 && (e.n[0] < -0.2 || Math.abs(e.n[1]) > 0.35)) arcade(kit, e);
    if (p.gate && e.L > 3.5) {
      const u = e.L / 2;
      kit.arch('glass', e.p, e.t, e.n, u - 0.85, u + 0.85, 0.35, 2.5, 0.1, near ? 7 : 4);
      if (near) {
        kit.panel('trim', e.p, e.t, e.n, u - 1.05, u - 0.85, 0.2, 3.55, 0.16);
        kit.panel('trim', e.p, e.t, e.n, u + 0.85, u + 1.05, 0.2, 3.55, 0.16);
      }
    }
  }
}

const FLOOR_H = 2.8;

// The two long harbour wings (west faces). Photo 5: tall arched lower windows, smaller ones above.
function harbourHall(p, e) {
  return (p.name === 'Romeriksfløyen' || p.name === 'Skriverstuefløyen') && e.n[0] < -0.55 && e.L > 12;
}

function hallWindows(kit, e, y0, y1, near) {
  const cols = Math.max(3, Math.floor(e.L / 3.15));
  const pitch = e.L / cols;
  const wu = Math.min(1.28, pitch * 0.42);
  const stride = near ? 1 : 2;
  const sill = y0 + 0.28;
  const spring = y0 + Math.min(4.55, (y1 - y0) * 0.52);
  const crown = spring + wu / 2;
  for (let c = 0; c < cols; c += stride) {
    const u = (c + 0.5) * pitch;
    const u0 = u - wu / 2, u1 = u + wu / 2;
    if (u0 < 0.85 || u1 > e.L - 0.85 || crown > y1 - 1.3) continue;
    const lit = c % 5 !== 2;
    kit.arch(lit ? 'glow' : 'glass', e.p, e.t, e.n, u0, u1, sill, spring, 0.07, near ? 5 : 3);
    if (near) {
      kit.panel('trim', e.p, e.t, e.n, u0 - 0.14, u0, sill, crown + 0.06, 0.14);
      kit.panel('trim', e.p, e.t, e.n, u1, u1 + 0.14, sill, crown + 0.06, 0.14);
      kit.panel('stone', e.p, e.t, e.n, u0 - 0.06, u1 + 0.06, crown + 0.02, crown + 0.16, 0.12);
    } else {
      kit.panel('trim', e.p, e.t, e.n, u0 - 0.08, u1 + 0.08, crown, crown + 0.12, 0.1);
    }
  }
  const uh = 0.9, uw = Math.min(0.68, pitch * 0.24);
  const yb = Math.max(crown + 0.42, y1 - uh - 0.7);
  if (yb + uh > y1 - 0.18) return;
  for (let c = 0; c < cols; c += stride) {
    const u = (c + 0.5) * pitch - uw / 2;
    if (u < 0.9 || u + uw > e.L - 0.9) continue;
    sash(kit, e, u, yb, uw, uh, near, c % 4 !== 1);
  }
}

function windows(kit, e, y0, y1, near) {
  const floors = Math.max(1, Math.floor((y1 - y0 - 0.3) / FLOOR_H));
  const cols = Math.max(1, Math.floor(e.L / 2.4));
  const pitch = e.L / cols;
  const wu = Math.min(0.96, pitch * 0.52);
  const wh = 1.55;
  const stride = near ? 1 : 2;
  if (near && cols > 1 && y1 - y0 > 3) {
    for (let c = 0; c <= cols; c++) {
      const u = c * pitch;
      if (u < 0.85 || u > e.L - 0.85) continue;
      pier(kit, e, u, y0 + 0.15, y1 - 0.2);
    }
  }
  for (let f = 0; f < floors; f += stride) {
    const yb = y0 + 0.42 + f * FLOOR_H;
    if (yb + wh > y1 - 0.22) break;
    for (let c = 0; c < cols; c += stride) {
      const u = (c + 0.5) * pitch - wu / 2;
      if (u < 1.0 || u + wu > e.L - 1.0) continue;
      sash(kit, e, u, yb, wu, wh, near, ((f + c) % 4) !== 2);
    }
  }
}

function sash(kit, e, u, y, w, h, near, lit) {
  const d = 0.16, dg = 0.07, t = 0.085;
  const P = (uu, yy, dd) => kit.wp(e.p, e.t, e.n, uu, yy, dd);
  kit.panel('trim', e.p, e.t, e.n, u, u + t, y, y + h, d);
  kit.panel('trim', e.p, e.t, e.n, u + w - t, u + w, y, y + h, d);
  kit.panel('trim', e.p, e.t, e.n, u + t, u + w - t, y + h - t, y + h, d);
  kit.panel('trim', e.p, e.t, e.n, u - 0.04, u + w + 0.04, y - 0.08, y + 0.1, d);
  kit.panel(lit ? 'glow' : 'glass', e.p, e.t, e.n, u + t, u + w - t, y + t, y + h - t, dg);
  if (!near) return;
  const mid = u + w / 2;
  kit.panel('trim', e.p, e.t, e.n, mid - 0.032, mid + 0.032, y + t, y + h - t, d);
  const ty = y + h * 0.55;
  kit.panel('trim', e.p, e.t, e.n, u + t, u + w - t, ty - 0.028, ty + 0.028, d);
  kit.quad('trim', P(u, y, 0.02), P(u, y + h, 0.02), P(u, y + h, d), P(u, y, d), [-e.t[0], 0, -e.t[1]]);
  kit.quad('trim', P(u + w, y + h, 0.02), P(u + w, y, 0.02), P(u + w, y, d), P(u + w, y + h, d), [e.t[0], 0, e.t[1]]);
  kit.quad('trim', P(u, y + h, d), P(u + w, y + h, d), P(u + w, y + h, 0.02), P(u, y + h, 0.02), [0, 1, 0]);
  kit.quad('trim', P(u - 0.04, y - 0.08, 0.02), P(u + w + 0.04, y - 0.08, 0.02), P(u + w + 0.04, y - 0.08, d), P(u - 0.04, y - 0.08, d), [0, 1, 0]);
  const sy0 = y + 0.15, sy1 = y + h - 0.1;
  kit.panel('stone', e.p, e.t, e.n, u - 0.05, u + w + 0.05, y + h + 0.02, y + h + 0.12, 0.1);
  kit.panel('trim', e.p, e.t, e.n, u - 0.28, u - 0.08, sy0, sy1, 0.05);
  kit.panel('trim', e.p, e.t, e.n, u + w + 0.08, u + w + 0.28, sy0, sy1, 0.05);
}

function pier(kit, e, u, y0, y1) {
  const d = 0.05, w = 0.07;
  const P = (uu, yy, dd) => kit.wp(e.p, e.t, e.n, uu, yy, dd);
  kit.panel('trim', e.p, e.t, e.n, u - w, u + w, y0, y1, d);
  kit.quad('trim', P(u - w, y0, 0.02), P(u - w, y1, 0.02), P(u - w, y1, d), P(u - w, y0, d), [-e.t[0], 0, -e.t[1]]);
  kit.quad('trim', P(u + w, y1, 0.02), P(u + w, y0, 0.02), P(u + w, y0, d), P(u + w, y1, d), [e.t[0], 0, e.t[1]]);
}

function courses(kit, e, y0, y1) {
  const P = (uu, yy, dd) => kit.wp(e.p, e.t, e.n, uu, yy, dd);
  kit.panel('trim', e.p, e.t, e.n, 0.15, e.L - 0.15, y0 - 0.02, y0 + 0.12, 0.08);
  for (let y = y0 + 2.28; y < y1 - 0.3; y += FLOOR_H) {
    kit.panel('trim', e.p, e.t, e.n, 0.15, e.L - 0.15, y, y + 0.12, 0.08);
    kit.quad('trim', P(0.15, y, 0.02), P(e.L - 0.15, y, 0.02), P(e.L - 0.15, y, 0.08), P(0.15, y, 0.08), [0, -1, 0]);
  }
}

function quoins(kit, e, y1) {
  const bh = 0.78;
  const rows = Math.min(18, Math.floor((y1 - 0.2) / bh));
  for (let r = 0; r < rows; r++) {
    const wide = r % 2 === 0;
    const yb = 0.2 + r * bh;
    const w = wide ? 0.92 : 0.58;
    kit.panel('trim', e.p, e.t, e.n, 0.08, w, yb + 0.04, yb + bh - 0.05, 0.13);
    kit.panel('trim', e.p, e.t, e.n, e.L - w, e.L - 0.08, yb + 0.04, yb + bh - 0.05, 0.13);
  }
}

function arcade(kit, e) {
  const n = Math.max(1, Math.floor(e.L / 2.7));
  const slot = e.L / n;
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) * slot;
    kit.arch('glass', e.p, e.t, e.n, u - 0.46, u + 0.46, 0.62, 1.85, 0.07, 6);
    kit.panel('trim', e.p, e.t, e.n, u - 0.62, u - 0.46, 0.45, 2.45, 0.14);
    kit.panel('trim', e.p, e.t, e.n, u + 0.46, u + 0.62, 0.45, 2.45, 0.14);
    kit.panel('stone', e.p, e.t, e.n, u - 0.58, u + 0.58, 2.32, 2.55, 0.15);
  }
}

function corbels(kit, e, y) {
  const n = Math.max(1, Math.floor(e.L / 2.15));
  const slot = e.L / n;
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) * slot;
    const P = (uu, yy, d) => kit.wp(e.p, e.t, e.n, uu, yy, d);
    kit.quad('stone', P(u - 0.11, y - 0.55, 0.05), P(u + 0.11, y - 0.55, 0.05), P(u + 0.11, y - 0.08, 0.22), P(u - 0.11, y - 0.08, 0.22), kit.hint(e.n));
    kit.quad('stone', P(u - 0.11, y - 0.08, 0.22), P(u + 0.11, y - 0.08, 0.22), P(u + 0.11, y - 0.08, 0.02), P(u - 0.11, y - 0.08, 0.02), [0, -1, 0]);
  }
}

function eave(kit, e, y) {
  const d = 0.4;
  const A2 = [e.p[0] + e.n[0] * d, y, e.p[1] + e.n[1] * d];
  const B2 = [e.q[0] + e.n[0] * d, y, e.q[1] + e.n[1] * d];
  const A3 = [e.p[0] + e.n[0] * d, y - 0.22, e.p[1] + e.n[1] * d];
  const B3 = [e.q[0] + e.n[0] * d, y - 0.22, e.q[1] + e.n[1] * d];
  kit.quad('trim', [e.p[0], y, e.p[1]], [e.q[0], y, e.q[1]], B2, A2, [0, 1, 0]);
  kit.quad('trim', A2, B2, B3, A3, [e.n[0], 0, e.n[1]]);
  kit.quad('trim', [e.p[0], y, e.p[1]], A2, A3, [e.p[0], y - 0.22, e.p[1]], [-e.t[0], 0, -e.t[1]]);
  kit.quad('trim', [e.q[0], y, e.q[1]], [e.q[0], y - 0.22, e.q[1]], B3, B2, [e.t[0], 0, e.t[1]]);
}

function crowSteps(kit, e, y0, y1, near, mat) {
  const n = near ? 7 : 4;
  const midU = e.L / 2;
  const depth = 0.3;
  for (const side of [-1, 1]) {
    for (let i = 1; i < n; i++) {
      const t = i / n;
      const u = midU + side * (midU * (1 - t));
      const y = y0 + (y1 - y0) * t;
      const half = ((e.L / 2) / n) * 0.38;
      const rise = ((y1 - y0) / n) * 0.72;
      const P = (uu, yy, d) => kit.wp(e.p, e.t, e.n, uu, yy, d);
      kit.quad(mat, P(u - half, y, depth), P(u + half, y, depth), P(u + half, y + rise, depth), P(u - half, y + rise, depth), kit.hint(e.n));
      kit.quad(mat, P(u - half, y + rise, 0.04), P(u + half, y + rise, 0.04), P(u + half, y + rise, depth), P(u - half, y + rise, depth), [0, 1, 0]);
      if (near) {
        kit.quad(mat, P(u - half, y, 0.04), P(u - half, y, depth), P(u - half, y + rise, depth), P(u - half, y + rise, 0.04), [-e.t[0], 0, -e.t[1]]);
        kit.quad(mat, P(u + half, y, depth), P(u + half, y, 0.04), P(u + half, y + rise, 0.04), P(u + half, y + rise, depth), [e.t[0], 0, e.t[1]]);
      }
    }
  }
}

// Dormers sit on the roof slope, inset from the eave, at the same stations on both LODs.
function dormers(kit, e, F, y0, y1, near, roofMat, ring) {
  const count = Math.max(2, Math.round(e.L / 9));
  const halfW = Math.abs((F.v1 - F.v0) / 2) || 1;
  const w = 1.15, h = 1.15, depth = 0.9, inset = 2.05;
  for (let i = 0; i < count; i++) {
    const u = (i + 0.5) * (e.L / count);
    const s1 = inset - depth;
    const along = [e.p[0] + e.t[0] * u - e.n[0] * inset, e.p[1] + e.t[1] * u - e.n[1] * inset];
    if (ring && distToRing(ring, along[0], along[1]) > 0.7) continue;
    const v = along[0] * F.n[0] + along[1] * F.n[1];
    const roofY = y1 - (Math.abs(v - F.vm) / halfW) * (y1 - y0);
    if (roofY < y0 + 0.15 || roofY > y1 - 0.2) continue;
    const yb = roofY + 0.06;
    const P = (uu, s, y) => [e.p[0] + e.t[0] * uu - e.n[0] * s, y, e.p[1] + e.t[1] * uu - e.n[1] * s];
    const u0 = u - w / 2, u1 = u + w / 2, yTop = yb + h;
    kit.quad('render', P(u0, s1, yb), P(u1, s1, yb), P(u1, s1, yTop), P(u0, s1, yTop), [e.n[0], 0.15, e.n[1]]);
    kit.quad('glow', P(u0 + 0.14, s1 - 0.06, yb + 0.16), P(u1 - 0.14, s1 - 0.06, yb + 0.16), P(u1 - 0.14, s1 - 0.06, yTop - 0.16), P(u0 + 0.14, s1 - 0.06, yTop - 0.16), [e.n[0], 0.1, e.n[1]]);
    kit.quad(roofMat, P(u0, inset, yb), P(u0, s1, yb), P(u0, s1, yTop), P(u0, inset, yTop), [-e.t[0], 0, -e.t[1]]);
    kit.quad(roofMat, P(u1, s1, yb), P(u1, inset, yb), P(u1, inset, yTop), P(u1, s1, yTop), [e.t[0], 0, e.t[1]]);
    const ridge = P(u, (inset + s1) / 2, yTop + 0.48);
    kit.tri(roofMat, P(u0 - 0.08, s1, yTop), P(u1 + 0.08, s1, yTop), ridge, [e.n[0], 0.7, e.n[1]]);
    kit.tri(roofMat, P(u1 + 0.08, inset, yTop), P(u0 - 0.08, inset, yTop), ridge, [-e.n[0], 0.7, -e.n[1]]);
    if (near) {
      kit.tri(roofMat, P(u0 - 0.08, inset, yTop), P(u0 - 0.08, s1, yTop), ridge, [-e.t[0], 0.4, -e.t[1]]);
      kit.tri(roofMat, P(u1 + 0.08, s1, yTop), P(u1 + 0.08, inset, yTop), ridge, [e.t[0], 0.4, e.t[1]]);
      kit.quad('trim', P(u0, s1 - 0.12, yb), P(u0 + 0.1, s1 - 0.12, yb), P(u0 + 0.1, s1 - 0.12, yTop), P(u0, s1 - 0.12, yTop), [e.n[0], 0, e.n[1]]);
      kit.quad('trim', P(u1 - 0.1, s1 - 0.12, yb), P(u1, s1 - 0.12, yb), P(u1, s1 - 0.12, yTop), P(u1 - 0.1, s1 - 0.12, yTop), [e.n[0], 0, e.n[1]]);
    }
  }
}

function chimneys(kit, F, y, near, ring) {
  const runs = ridgeRuns(F, ring).filter((s) => s[1] - s[0] > 6);
  if (!runs.length) return;
  const span = runs.reduce((a, b) => (b[1] - b[0] > a[1] - a[0] ? b : a));
  const n = near ? 3 : 2;
  for (let i = 0; i < n; i++) {
    const u = span[0] + (span[1] - span[0]) * ((i + 1) / (n + 1));
    const at = F.at(u, F.vm, 0);
    if (ring && distToRing(ring, at[0], at[2]) > 0.3) continue;
    const s = 0.42, pot = 0.22;
    const ringAt = (rad) => {
      const pts = [F.at(u - rad, F.vm - rad, 0), F.at(u + rad, F.vm - rad, 0), F.at(u + rad, F.vm + rad, 0), F.at(u - rad, F.vm + rad, 0)];
      return pts.map((p) => [p[0], p[2]]);
    };
    const shaft = ringAt(s), cap = ringAt(pot);
    kit.prism('stone', shaft, y + 0.04, y + 1.35, {});
    kit.cap('stone', shaft, y + 1.35, true);
    kit.prism('copper', cap, y + 1.35, y + 1.82, {});
    kit.cap('copper', cap, y + 1.82, true);
  }
}

function revolved(kit, c, r, y0, y1, profile, sides, mat) {
  const rings = profile.map(([, s]) => circle(c[0], c[1], Math.max(0.05, r * s), sides));
  const ys = profile.map(([t]) => y0 + (y1 - y0) * t);
  for (let k = 0; k < rings.length - 1; k++) {
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      const A = rings[k][i], B = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i];
      const mx = (A[0] + B[0]) / 2 - c[0], mz = (A[1] + B[1]) / 2 - c[1];
      kit.quad(mat, [A[0], ys[k], A[1]], [B[0], ys[k], B[1]], [C[0], ys[k + 1], C[1]], [D[0], ys[k + 1], D[1]], [mx, (ys[k + 1] - ys[k]) * 0.15, mz]);
    }
  }
}

function spire(kit, c, r, y0, y1, sides, mat) {
  const base = circle(c[0], c[1], Math.max(0.04, r), sides);
  const apex = [c[0], y1, c[1]];
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    kit.tri(mat, [base[i][0], y0, base[i][1]], [base[j][0], y0, base[j][1]], apex, [base[i][0] - c[0], 0.45, base[i][1] - c[1]]);
  }
}

function cone(kit, ring, y, apex, mat) {
  for (const e of ringEdges(ring)) kit.tri(mat, [e.p[0], y, e.p[1]], [e.q[0], y, e.q[1]], apex, [e.n[0], 0.55, e.n[1]]);
}

function disc(kit, e, y, rad, mat, d, sides) {
  const c = kit.wp(e.p, e.t, e.n, e.L / 2, y, d);
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    pts.push(kit.wp(e.p, e.t, e.n, e.L / 2 + Math.cos(a) * rad, y + Math.sin(a) * rad, d));
  }
  for (let i = 0; i < sides; i++) kit.tri(mat, c, pts[i], pts[(i + 1) % sides], kit.hint(e.n));
}
