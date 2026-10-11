// Coit Tower parts: the fluted shaft, the observation crown with its arches, and the stepped
// base (rotunda, porch, block). Every number here is either published, mapped from OSM or a
// documented estimate (docs/3d-san-francisco-coit-tower.md). Frame: the shaft axis is the origin;
// the base is drawn in the block's own frame (lateral a, outward c) rotated to the 345.6 degree front.
import * as THREE from 'three';
import { SPEC } from './config.js';
import {
  soup, at, bayFrame, archOpening, rectOpening, ringWall, reveal, lathe, disc,
} from './coit-tower-mesh.js';

const RAD = Math.PI / 180;
export const FRONT = SPEC.frontageBearing;

// ---- levels (metres above the entrance grade, local y) ----
export const L = {
  drum: 6.5,          // entrance terrace (OSM part 451331532 says 5 m for the whole outline)
  rotunda: 8.5,       // rotunda drum with its cornice and the four corner piers (photograph, calibrated: 8.7 m)
  step: 8.0,          // front step (OSM part 451331535)
  porch: 10.0,        // entrance porch (OSM part 451331533)
  block: 12.0,        // the square block that carries the shaft (OSM part 451331534)
  plinthTop: 12.9,    // rounded foot of the shaft
  shaftTop: 52.9,     // top of the fluted shaft, under the ledge
  ledge: 53.9,        // the observation floor and its ledge; the balustrade top is 54.9 m = 180 ft
  crownTop: 64.0,     // 210 ft
};
const FLUTE_DEPTH = 0.15;
export const ridgeR = (y) => SPEC.shaftBaseR + (SPEC.shaftTopR - SPEC.shaftBaseR) * (y / SPEC.shaftTopY);
const FLUTE_COUNT = SPEC.flutes;

/** The 48 vertices of a fluted ring at height y: grooves centred on FRONT + 15k, ridges between. */
function fluteRing(y, extra = 0) {
  const ring = [];
  for (let i = 0; i < FLUTE_COUNT * 2; i++) {
    const groove = i % 2 === 0, r = ridgeR(y) + extra - (groove ? FLUTE_DEPTH : 0);
    ring.push({ r, bearing: FRONT + (i * 180) / FLUTE_COUNT, groove });
  }
  return ring;
}
const ringPoint = (v, y) => at(v.bearing, v.r, y);

// ---------------------------------------------------------------- shaft
export function shaft(sink, ctx) {
  const s = soup(), slit = soup();
  const y0 = L.plinthTop, y1 = L.shaftTop;
  // one smooth lift: the real pour seams are faint and read as shimmering dashes at driving range, so none are modelled
  const courses = 1, pitch = (y1 - y0) / courses, step = 0.02;
  for (let c = 0; c < courses; c++) {
    const ya = y0 + c * pitch, yb = ya + pitch;
    const bottom = fluteRing(ya, c ? step : 0), top = fluteRing(yb);
    const n = bottom.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const hint = at(bottom[i].bearing + 90 / FLUTE_COUNT, 1, 0);
      s.quad(ringPoint(bottom[i], ya), ringPoint(bottom[j], ya), ringPoint(top[j], yb), ringPoint(top[i], yb), hint);
      if (c < courses - 1) {
        // the 4 cm shoulder where the next pour begins: a thin underside, which reads as the pour line from below
        const next = fluteRing(yb, step);
        s.quad(ringPoint(top[i], yb), ringPoint(top[j], yb), ringPoint(next[j], yb), ringPoint(next[i], yb), [0, -1, 0]);
      }
    }
  }
  // the stair-lighting slits on the front: dark quads 6 cm proud of their facet
  if (ctx.near) {
    const slits = [[17.5, 47], [24, 0], [30.5, 47], [37, 0], [43.5, 47], [49.5, 0]];
    for (const [y, facet] of slits) {
      const ring = fluteRing(y);
      const a = ring[facet], b = ring[(facet + 1) % 48], mid = [0, 0, 0].map((_, t) => (ringPoint(a, y)[t] + ringPoint(b, y)[t]) / 2);
      const dir = at(a.bearing + 90 / FLUTE_COUNT, 1, 0), tang = [-dir[2], 0, dir[0]], w = 0.07, h = 0.4, o = 0.06;
      const p = (dx, dy) => [mid[0] + tang[0] * dx + dir[0] * o, mid[1] + dy, mid[2] + tang[2] * dx + dir[2] * o];
      slit.quad(p(-w, -h), p(w, -h), p(w, h), p(-w, h), dir);
    }
  }
  s.commit(sink, 'concrete'); slit.commit(sink, 'recess');
}

// ---------------------------------------------------------------- crown
const CROWN = {
  // the crown wall steps in 0.46 m from the shaft's top (aerial telephoto: crown about 9% narrower than the shaft just below)
  R: 5.05, Rin: 4.1, Rback: 3.8, Rbal: 4.8,
  sill: 53.9, lowHalf: 1.15, lowSpring: 57.75,
  smallLo: 60.3, smallHalf: 0.2, smallTop: 61.1, smallAt: [-0.65, 0, 0.65],
  upLo: 61.5, upHalf: 1.0, upSpring: 61.9,
  cavityTop: 63.2, wallTop: 63.75, capR: 4.75,
};

export function crown(sink, ctx) {
  const c = CROWN, bays = SPEC.bays, bearing0 = FRONT;
  const wall = soup(), rec = soup(), glass = soup(), glow = soup();
  const nLow = ctx.near ? 8 : 4, nUp = ctx.near ? 6 : 4;
  const lower = archOpening(c.lowHalf, c.sill, c.lowSpring, nLow);
  const upper = archOpening(c.upHalf, c.upLo, c.upSpring, nUp);
  const smalls = ctx.near ? c.smallAt.map((x) => {
    const o = rectOpening(c.smallHalf, c.smallLo, c.smallTop);
    return { ...o, u: o.u.map((v) => v + x) };
  }) : [];
  const openings = [lower, ...smalls, upper];

  // outer wall, with all three tiers of openings cut through every bay
  ringWall(wall, { R: c.R, y0: L.ledge, y1: c.wallTop, bays, bearing0, openings });
  // hollow arcade ring: the inner wall faces the axis and has the same arches
  ringWall(glow, { R: c.Rin, y0: c.upLo, y1: c.cavityTop, bays, bearing0, openings: [upper], inward: true, plain: 1 });
  disc(glow, c.Rin, c.upLo, ctx.near ? 24 : 16, 1);
  disc(glow, c.Rin, c.cavityTop, ctx.near ? 24 : 16, -1);

  for (let k = 0; k < bays; k++) {
    const bearing = bearing0 + (360 / bays) * k;
    reveal(rec, { bearing, o: lower, Ro: c.R, Ri: c.Rback });                       // deep alcove: reveal in shade
    reveal(glow, { bearing, o: lower, Ro: c.R, Ri: c.Rback, tube: false, back: true }); // its back wall: floodlit at night
    reveal(wall, { bearing, o: upper, Ro: c.R, Ri: c.Rin });                       // the arcade is open through the wall
    for (const o of smalls) { reveal(rec, { bearing, o, Ro: c.R, Ri: c.R - 0.45 }); reveal(glass, { bearing, o, Ro: c.R, Ri: c.R - 0.45, tube: false, back: true }); }
    // stone balustrade across the alcove, with a darker baluster band on the near model
    const f = bayFrame(bearing), a = (x) => Math.sqrt(c.Rbal * c.Rbal - x * x), top = c.sill + 1.0, hw = c.lowHalf;
    const xs = ctx.near ? [-hw, -hw / 2, 0, hw / 2, hw] : [-hw, 0, hw];
    for (let i = 0; i < xs.length - 1; i++) {
      const p0 = f.point(xs[i], a(xs[i]), c.sill), p1 = f.point(xs[i + 1], a(xs[i + 1]), c.sill);
      const q1 = f.point(xs[i + 1], a(xs[i + 1]), top), q0 = f.point(xs[i], a(xs[i]), top);
      wall.quad(p0, p1, q1, q0, f.radial(0, 1));
      const t1 = f.point(xs[i + 1], a(xs[i + 1]) - 0.3, top), t0 = f.point(xs[i], a(xs[i]) - 0.3, top);
      wall.quad(q0, q1, t1, t0, [0, 1, 0]);
    }
    if (ctx.near) {
      const aa = (x) => Math.sqrt((c.Rbal + 0.05) ** 2 - x * x);
      for (const x of [-0.9, -0.45, 0, 0.45, 0.9]) {
        glass.quad(f.point(x - 0.12, aa(x - 0.12), c.sill + 0.2), f.point(x + 0.12, aa(x + 0.12), c.sill + 0.2),
          f.point(x + 0.12, aa(x + 0.12), top - 0.25), f.point(x - 0.12, aa(x - 0.12), top - 0.25), f.radial(0, 1));
      }
      if (k === 0) {
        // the round window in the alcove at the front (oculus), a dark disc just off the back wall
        const ac = Math.sqrt(c.Rback * c.Rback - 0.2) + 0.05, cy = c.lowSpring - 0.45, n = 10;
        for (let i = 0; i < n; i++) {
          const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI;
          glass.tri(f.point(0, ac, cy), f.point(0.42 * Math.cos(t0), ac, cy + 0.42 * Math.sin(t0)), f.point(0.42 * Math.cos(t1), ac, cy + 0.42 * Math.sin(t1)), f.radial(0, 1));
        }
      }
    }
  }

  // ledge: a corbelled platform under the crown, its top shelf and the rounded cap
  const seg = ctx.near ? 48 : 24;
  lathe(wall, [[5.30, L.shaftTop], [5.52, L.shaftTop], [5.62, 53.3], [5.62, L.ledge], [c.R, L.ledge]], seg);
  lathe(wall, [[c.R, c.wallTop], [c.capR, L.crownTop]], seg);
  disc(wall, c.capR, L.crownTop, seg, 1);
  wall.commit(sink, 'concrete'); rec.commit(sink, 'recess'); glass.commit(sink, 'glass'); glow.commit(sink, 'glow');
}

// ---------------------------------------------------------------- base
const frame = bayFrame(FRONT);
const P = (a, cc, y) => frame.point(a, cc, y);        // lateral a (+ right of the front), outward c (+ toward the front), height y
const D = (da, dc) => [da * frame.l[0] + dc * frame.e[0], 0, da * frame.l[1] + dc * frame.e[1]];

const RD = 11.2, PIER = 8.8, BLOCK = 5.85, HALF = BLOCK, FRONT_C = 11.0, PIER_C = 8.4;
const polar = (r, deg) => [r * Math.cos(deg * RAD), r * Math.sin(deg * RAD)];
const deg = (v) => v / RAD;
const ARCS = [
  [180 - deg(Math.asin(BLOCK / RD)), 180 + deg(Math.asin(5.8 / RD))],       // west
  [180 + deg(Math.acos(HALF / RD)), 360 - deg(Math.acos(HALF / RD))],       // rear (south)
  [360 - deg(Math.asin(5.8 / RD)), 360 + deg(Math.asin(BLOCK / RD))],       // east
];

/**
 * The rotunda mass (OSM part 451331532 rebuilt, counter-clockwise in (a, c)): three arcs of radius 11.2 m,
 * four corner piers and the notch between the two front piers that the entrance terrace fills. `inner` marks
 * the edges that face the lower terrace and so show only above it.
 */
function rotundaOutline(stepDeg) {
  const pts = [];
  const add = (a, cc, arc = false, inner = false) => pts.push({ a, cc, arc, inner });
  const arc = ([from, to]) => {
    const n = Math.max(1, Math.round(Math.abs(to - from) / stepDeg));
    for (let i = 0; i <= n; i++) { const [a, cc] = polar(RD, from + ((to - from) * i) / n); add(a, cc, true); }
  };
  add(-PIER, BLOCK); arc(ARCS[0]);
  add(-PIER, -5.8); add(-PIER, -8.8); add(-HALF, -8.8); arc(ARCS[1]);
  add(HALF, -8.8); add(PIER, -8.8); add(PIER, -5.8); arc(ARCS[2]);
  add(PIER, BLOCK); add(PIER, PIER_C); add(HALF, PIER_C, false, true); add(HALF, BLOCK, false, true); add(-HALF, BLOCK, false, true); add(-HALF, PIER_C); 
  return pts;
}

function slab(s, { a0, a1, c0, c1, y0, y1, skip = [] }) {
  const q = (name, p0, p1, p2, p3, hint) => { if (!skip.includes(name)) s.quad(p0, p1, p2, p3, hint); };
  q('north', P(a1, c1, y0), P(a0, c1, y0), P(a0, c1, y1), P(a1, c1, y1), D(0, 1));
  q('south', P(a0, c0, y0), P(a1, c0, y0), P(a1, c0, y1), P(a0, c0, y1), D(0, -1));
  q('west', P(a0, c1, y0), P(a0, c0, y0), P(a0, c0, y1), P(a0, c1, y1), D(-1, 0));
  q('east', P(a1, c0, y0), P(a1, c1, y0), P(a1, c1, y1), P(a1, c0, y1), D(1, 0));
  q('top', P(a0, c0, y1), P(a1, c0, y1), P(a1, c1, y1), P(a0, c1, y1), [0, 1, 0]);
  q('bottom', P(a0, c0, y0), P(a1, c0, y0), P(a1, c1, y0), P(a0, c1, y0), [0, -1, 0]);
}

export function base(sink, ctx) {
  const stone = soup(), warm = soup(), rec = soup(), glass = soup();
  const outline = rotundaOutline(ctx.near ? 7.5 : 15);
  const poly = outline.filter((p, i) => { const q = outline[(i + 1) % outline.length]; return Math.hypot(p.a - q.a, p.cc - q.cc) > 1e-6; });
  let area = 0; poly.forEach((p, i) => { const q = poly[(i + 1) % poly.length]; area += p.a * q.cc - q.a * p.cc; });
  const ccw = area > 0;

  // rotunda walls: smooth around the arcs, flat on the piers; edges facing the terrace start at the terrace roof
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const edge = [q.a - p.a, q.cc - p.cc], out = ccw ? [edge[1], -edge[0]] : [-edge[1], edge[0]], hint = D(out[0], out[1]);
    const y0 = p.inner ? L.drum : 0;
    const p0 = P(p.a, p.cc, y0), p1 = P(q.a, q.cc, y0), q1 = P(q.a, q.cc, L.rotunda), q0 = P(p.a, p.cc, L.rotunda);
    if (p.arc && q.arc) {
      const np = D(p.a, p.cc).map((v) => v / RD), nq = D(q.a, q.cc).map((v) => v / RD);
      stone.quad(p0, p1, q1, q0, hint, [np, nq, nq, np]);
    } else stone.quad(p0, p1, q1, q0, hint);
  }
  const contour = poly.map((p) => new THREE.Vector2(p.a, p.cc));
  for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(contour, [])) {
    stone.tri(P(poly[i].a, poly[i].cc, L.rotunda), P(poly[j].a, poly[j].cc, L.rotunda), P(poly[k].a, poly[k].cc, L.rotunda), [0, 1, 0]);
  }
  if (ctx.near) rotundaDetail(stone, glass);

  // entrance terrace between the front piers: roof, side walls beyond the piers, the front wall with its door
  stone.quad(P(-HALF, BLOCK, L.drum), P(HALF, BLOCK, L.drum), P(HALF, FRONT_C, L.drum), P(-HALF, FRONT_C, L.drum), [0, 1, 0]);
  stone.quad(P(HALF, PIER_C, 0), P(HALF, FRONT_C, 0), P(HALF, FRONT_C, L.drum), P(HALF, PIER_C, L.drum), D(1, 0));
  stone.quad(P(-HALF, FRONT_C, 0), P(-HALF, PIER_C, 0), P(-HALF, PIER_C, L.drum), P(-HALF, FRONT_C, L.drum), D(-1, 0));
  frontWall(stone, rec, glass, { a: HALF, cc: FRONT_C }, { a: -HALF, cc: FRONT_C }, D(0, 1));

  // stepped volumes: front step, porch (two parts), the block that carries the shaft
  slab(warm, { a0: -2.9, a1: 3.2, c0: PIER_C, c1: FRONT_C, y0: L.drum, y1: L.step, skip: ['bottom'] });
  slab(warm, { a0: -2.0, a1: 2.3, c0: BLOCK, c1: PIER_C, y0: L.drum, y1: L.porch, skip: ['bottom', 'south', 'north'] });
  slab(warm, { a0: -2.0, a1: 2.3, c0: PIER_C, c1: 10.6, y0: L.step, y1: L.porch, skip: ['bottom', 'south'] });
  slab(warm, { a0: -BLOCK, a1: BLOCK, c0: -BLOCK, c1: BLOCK, y0: L.rotunda, y1: L.block, skip: ['bottom'] });
  if (ctx.near) relief(warm, rec);

  // the rounded foot of the shaft on top of the block
  lathe(warm, [[5.85, L.block], [5.83, 12.4], [5.78, 12.7], [5.70, L.plinthTop], [5.5, L.plinthTop]], ctx.near ? 32 : 16);
  stone.commit(sink, 'concrete'); warm.commit(sink, 'concrete_warm'); rec.commit(sink, 'recess'); glass.commit(sink, 'glass');
}

// the entrance door in the terrace front wall (a recess with a dark glazed back)
function frontWall(stone, rec, glass, p, q, hint) {
  const y1 = L.drum, left = Math.min(p.a, q.a), right = Math.max(p.a, q.a), dw = 1.1, dh = 3.0, depth = 1.0, c = FRONT_C;
  const piece = (a0, a1, ya, yb) => stone.quad(P(a0, c, ya), P(a1, c, ya), P(a1, c, yb), P(a0, c, yb), hint);
  piece(left, -dw, 0, y1); piece(dw, right, 0, y1); piece(-dw, dw, dh, y1);
  const q4 = (a, b, c2, d2, h) => rec.quad(a, b, c2, d2, h);
  q4(P(-dw, c, 0), P(-dw, c - depth, 0), P(-dw, c - depth, dh), P(-dw, c, dh), D(1, 0));
  q4(P(dw, c, 0), P(dw, c - depth, 0), P(dw, c - depth, dh), P(dw, c, dh), D(-1, 0));
  q4(P(-dw, c, dh), P(dw, c, dh), P(dw, c - depth, dh), P(-dw, c - depth, dh), [0, -1, 0]);
  glass.quad(P(-dw, c - depth, 0), P(dw, c - depth, 0), P(dw, c - depth, dh), P(-dw, c - depth, dh), D(0, 1));
}

// rotunda: pilasters, glazed bays on the rear and a cornice band on every arc
function rotundaDetail(stone, glass) {
  const cornice = 5.8, R2 = RD + 0.3;
  // cornice band over the three arcs
  for (const [from, to] of ARCS) {
    const n = Math.max(2, Math.round((to - from) / 7.5));
    for (const t of [from, to]) { // close the band at both ends
      const [a0, c0] = polar(RD, t), [b0, d0] = polar(R2, t), dir = t === from ? -1 : 1, tg = [-Math.sin(t * RAD) * dir, Math.cos(t * RAD) * dir];
      stone.quad(P(a0, c0, cornice), P(b0, d0, cornice), P(b0, d0, L.rotunda), P(a0, c0, L.rotunda), D(tg[0], tg[1]));
    }
    for (let i = 0; i < n; i++) {
      const t0 = from + ((to - from) * i) / n, t1 = from + ((to - from) * (i + 1)) / n;
      const [a0, c0] = polar(RD, t0), [a1, c1] = polar(RD, t1), [b0, d0] = polar(R2, t0), [b1, d1] = polar(R2, t1);
      const n0 = D(b0, d0).map((v) => v / R2), n1 = D(b1, d1).map((v) => v / R2);
      stone.quad(P(b0, d0, cornice), P(b1, d1, cornice), P(b1, d1, L.rotunda), P(b0, d0, L.rotunda), [n0[0] + n1[0], 0, n0[2] + n1[2]], [n0, n1, n1, n0]);
      stone.quad(P(a0, c0, cornice), P(a1, c1, cornice), P(b1, d1, cornice), P(b0, d0, cornice), [0, -1, 0]);
      stone.quad(P(a0, c0, L.rotunda), P(b0, d0, L.rotunda), P(b1, d1, L.rotunda), P(a1, c1, L.rotunda), [0, 1, 0]);
    }
  }
  // pilasters and glass between them on the rear arc (bearing south of the front)
  const pil = 0.35, face = R2;
  const phis = [240, 252, 264, 276, 288, 300];
  for (const phi of phis) {
    const [ca, cc] = polar(1, phi), tang = [-cc, ca];
    const pt = (r, side, y) => P(ca * r + tang[0] * side * pil, cc * r + tang[1] * side * pil, y);
    const hintOut = D(ca, cc);
    stone.quad(pt(face, -1, 0), pt(face, 1, 0), pt(face, 1, cornice), pt(face, -1, cornice), hintOut);
    stone.quad(pt(RD - 0.1, 1, 0), pt(face, 1, 0), pt(face, 1, cornice), pt(RD - 0.1, 1, cornice), D(tang[0], tang[1]));
    stone.quad(pt(face, -1, 0), pt(RD - 0.1, -1, 0), pt(RD - 0.1, -1, cornice), pt(face, -1, cornice), D(-tang[0], -tang[1]));
  }
  for (let k = 0; k < phis.length - 1; k++) {
    for (let h = 0; h < 2; h++) {
      const t0 = phis[k] + 2.2 + (h * (12 - 4.4)) / 2, t1 = phis[k] + 2.2 + ((h + 1) * (12 - 4.4)) / 2;
      const [a0, c0] = polar(RD + 0.08, t0), [a1, c1] = polar(RD + 0.08, t1);
      glass.quad(P(a0, c0, 1.3), P(a1, c1, 1.3), P(a1, c1, 5.4), P(a0, c0, 5.4), D(a0 + a1, c0 + c1));
    }
  }
}

// the phoenix roundel and the two fasces above the entrance, on the porch front
function relief(warm, rec) {
  const c = 10.6, a0 = 0.15, y = 9.0, r = 0.75, n = 12, off = 0.06;
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * 2 * Math.PI, t1 = ((i + 1) / n) * 2 * Math.PI;
    rec.tri(P(a0, c + off, y), P(a0 + r * Math.cos(t0), c + off, y + r * Math.sin(t0)), P(a0 + r * Math.cos(t1), c + off, y + r * Math.sin(t1)), D(0, 1));
  }
  for (const da of [-1.35, 1.65]) {
    slab(rec, { a0: a0 + da - 0.12, a1: a0 + da + 0.12, c0: c, c1: c + 0.12, y0: 8.2, y1: 9.8, skip: ['bottom', 'south'] });
  }
}
