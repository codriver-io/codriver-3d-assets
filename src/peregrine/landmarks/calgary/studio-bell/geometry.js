import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { CELLS, HOTEL, BRIDGE, THETA, toLocal, GROUND_COURSE } from './studio-bell-site.js';
import { Soup, Surf, hash } from './studio-bell-mesh.js';

const CH = GROUND_COURSE;
const TRI = { s0: 5.0, s1: 8.4, base: 15, apex: 22 }; // the triangular window on the sign tower's west wall
const OFF = 0.15; // stand-off of glazing from large wall surfaces (contract: >= 0.15 m)

// The hotel as two brick volumes in the same cell list, so the neighbour rule shows the walls above the lower part.
const HOTEL_CELLS = [
  { id: 'hotel-north', u0: HOTEL.u0, u1: HOTEL.u1, v0: HOTEL.v0, v1: HOTEL.vSplit, h: HOTEL.hNorth, tone: 'brick' },
  { id: 'hotel-south', u0: HOTEL.u0, u1: HOTEL.u1, v0: HOTEL.vSplit, v1: HOTEL.v1, h: HOTEL.hSouth, tone: 'brick' },
];
const ALL = [...CELLS, ...HOTEL_CELLS];
ALL.forEach((c, i) => { c.index = i; });
const byId = (id) => ALL.find((c) => c.id === id);

// side frame: start point A (u, v), unit direction e along the side, outward normal n, length, and the stretch
// [r0, r1] of it that is a flat wall (the rest is a rounded corner)
const ROUND_ENDS = { W: ['NW', 'SW'], E: ['NE', 'SE'], N: ['NW', 'NE'], S: ['SW', 'SE'] };
function sideOf(c, side) {
  const f = side === 'W' ? { A: [c.u0, c.v0], e: [0, 1], n: [-1, 0], len: c.v1 - c.v0 }
    : side === 'E' ? { A: [c.u1, c.v0], e: [0, 1], n: [1, 0], len: c.v1 - c.v0 }
      : side === 'N' ? { A: [c.u0, c.v0], e: [1, 0], n: [0, -1], len: c.u1 - c.u0 }
        : { A: [c.u0, c.v1], e: [1, 0], n: [0, 1], len: c.u1 - c.u0 };
  const [a, z] = ROUND_ENDS[side];
  f.r0 = c.round?.[a] || 0; f.r1 = f.len - (c.round?.[z] || 0);
  return f;
}
const cellAt = (u, v) => ALL.find((c) => u > c.u0 && u < c.u1 && v > c.v0 && v < c.v1);

/**
 * Studio Bell and the King Edward Hotel, Calgary, in metres: +X east, +Y up, +Z south, origin = the mapped outline's
 * bounding-box centre (over 4 Street SE), y = 0 the sidewalk/plaza level. Authoring only (exporter, inspector, tests);
 * never the map. The plan is authored in the street frame (u east, v south) and rotated once by THETA (2.4 deg), so
 * the orientation on the mapped footprint is baked in.
 *
 * near: eight tile-clad towers (flat walls, rounded corners) in horizontal terracotta courses (dark gunmetal and bronze,
 * a soft gold only in the lowest 10 m), slot windows, the triangular window, the street entrance, roof vaults and plant;
 * the skybridge as a flared band over 4 Street SE with dark faces, a dark soffit, a long window strip and a concave
 * cove under each end; the brick hotel with windows, storefront and cornice.
 * far: same silhouette and negative space (the 18.6 m clear span under the bridge, the stepped towers, the hotel)
 * with coarser courses.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const CHN = near ? CH : CH * 3; // far draws coarser courses
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const soups = new Map(), surfs = new Map();
  const fold = near ? {} : { tileGold: 'tileBronze', trim: 'brick' }; // far folds minor materials into neighbours (draw budget)
  const mat = (m) => fold[m] || m;
  const soup = (m) => { m = mat(m); if (!soups.has(m)) soups.set(m, new Soup()); return soups.get(m); };
  const surf = (m) => { m = mat(m); if (!surfs.has(m)) surfs.set(m, new Surf()); return surfs.get(m); };
  const P = (u, y, v) => { const [x, z] = toLocal(u, v); return [x, y, z]; };

  // ---------------------------------------------------------------- terracotta walls
  const TONES = { // material odds per course (cumulative thresholds): one dominant glaze, a few accent courses
    dark: [['tileDark', 0.78], ['tileBronze', 0.97], ['tileGold', 1]],
    bronze: [['tileBronze', 0.6], ['tileGold', 0.86], ['tileDark', 1]],
    gold: [['tileGold', 0.5], ['tileBronze', 0.9], ['tileDark', 1]],
  };
  const GOLD_TOP = 10; // the soft gold sheen stays low: above this height a gold course is drawn bronze
  const courseMat = (tone, k, seed) => {
    if (tone === 'brick') return 'brick';
    const r = hash(Math.floor(k / 2) + (k % 2) * 3, seed, 7), m = TONES[tone].find(([, t]) => r < t)[0];
    return m === 'tileGold' && k * CHN > GOLD_TOP ? 'tileBronze' : m;
  };

  // a point on a cell wall: s along the side from its first corner, y up, `off` out along the normal
  const wallPoint = (c, side, s, y, off = 0) => {
    const { A, e, n } = sideOf(c, side);
    return P(A[0] + e[0] * s + n[0] * off, y, A[1] + e[1] * s + n[1] * off);
  };

  const bandRows = (yA, yB) => {
    const ys = [yA];
    for (let y = (Math.floor(yA / CHN) + 1) * CHN; y < yB - 0.25; y += CHN) ys.push(y);
    ys.push(yB);
    return ys;
  };
  const CORNERS = { NW: [0, 0, 180], NE: [1, 0, 270], SE: [1, 1, 0], SW: [0, 1, 90] }; // [u side, v side, arc start deg]
  const cornerPts = (c, name, r, steps) => {
    const [iu, iv, a0] = CORNERS[name], cu = iu ? c.u1 - r : c.u0 + r, cv = iv ? c.v1 - r : c.v0 + r;
    return Array.from({ length: steps + 1 }, (_, i) => { const a = (a0 + 90 * i / steps) * Math.PI / 180; return [cu + r * Math.cos(a), cv + r * Math.sin(a)]; });
  };

  function cellWalls(c) {
    for (const side of ['W', 'E', 'N', 'S']) {
      const { A, e, n, r0, r1 } = sideOf(c, side);
      const cuts = new Set([r0, r1]);
      for (const o of ALL) {
        if (o === c) continue;
        for (const q of e[0] ? [o.u0 - A[0], o.u1 - A[0]] : [o.v0 - A[1], o.v1 - A[1]]) if (q > r0 + 0.01 && q < r1 - 0.01) cuts.add(q);
      }
      const list = [...cuts].sort((p, q) => p - q);
      for (let i = 0; i < list.length - 1; i++) {
        const s0 = list[i], s1 = list[i + 1], sm = (s0 + s1) / 2;
        const nb = cellAt(A[0] + e[0] * sm + n[0] * 0.05, A[1] + e[1] * sm + n[1] * 0.05);
        const yA = nb ? nb.h : 0, yB = c.h;
        if (yB - yA < 0.05) continue;
        const ys = bandRows(yA, yB);
        const toward = P(A[0] + e[0] * sm + n[0] * 12, (yA + yB) / 2, A[1] + e[1] * sm + n[1] * 12);
        for (let j = 0; j < ys.length - 1; j++) {
          const k = Math.round((ys[j] + ys[j + 1]) / 2 / CHN);
          const rows = [ys[j], ys[j + 1]].map((y) => [wallPoint(c, side, s0, y), wallPoint(c, side, s1, y)]);
          surf(courseMat(c.tone, k, c.index * 13 + 5)).grid(rows, toward);
        }
      }
    }
    // rounded exterior corners: a quarter cylinder in the same courses
    const outline = [];
    for (const name of ['NW', 'NE', 'SE', 'SW']) {
      const r = c.round?.[name] || 0;
      if (!r) { const [iu, iv] = CORNERS[name]; outline.push([iu ? c.u1 : c.u0, iv ? c.v1 : c.v0]); continue; }
      const pts = cornerPts(c, name, r, near ? 6 : 2);
      outline.push(...pts);
      const ys = bandRows(0, c.h), mid = pts[Math.floor(pts.length / 2)];
      const cu = (c.u0 + c.u1) / 2, cv = (c.v0 + c.v1) / 2, dl = Math.hypot(mid[0] - cu, mid[1] - cv) || 1;
      const toward = P(mid[0] + (mid[0] - cu) / dl * 12, c.h / 2, mid[1] + (mid[1] - cv) / dl * 12);
      for (let j = 0; j < ys.length - 1; j++) {
        const k = Math.round((ys[j] + ys[j + 1]) / 2 / CHN);
        surf(courseMat(c.tone, k, c.index * 13 + 5)).grid([ys[j], ys[j + 1]].map((y) => pts.map(([u, v]) => P(u, y, v))), toward);
      }
    }
    // flat roof (a convex fan over the outline)
    const ctr = [(c.u0 + c.u1) / 2, (c.v0 + c.v1) / 2], up = P(ctr[0], c.h + 10, ctr[1]);
    for (let i = 0; i < outline.length; i++) {
      const p = outline[i], q = outline[(i + 1) % outline.length];
      if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6) continue;
      soup('roof').tri(P(ctr[0], c.h, ctr[1]), P(p[0], c.h, p[1]), P(q[0], c.h, q[1]), up);
    }
  }
  ALL.forEach(cellWalls);

  // an overlay (glass, slot, portal) that follows a cell wall: s0..s1 along the side, from y0 up to top(s), `off` out
  function overlay(m, c, side, s0, s1, y0, top, off = OFF, cols = 1, rowStep = 3) {
    const { A, e, n } = sideOf(c, side);
    const topAt = typeof top === 'function' ? (s) => Math.max(top(s), y0 + 0.3) : () => top;
    const ss = Array.from({ length: cols + 1 }, (_, q) => s0 + (s1 - s0) * q / cols);
    const maxTop = Math.max(...ss.map(topAt));
    const rowsN = near ? Math.max(1, Math.ceil((maxTop - y0) / rowStep)) : 1;
    const rows = [];
    for (let j = 0; j <= rowsN; j++) rows.push(ss.map((s) => { const t = topAt(s); return wallPoint(c, side, s, y0 + (t - y0) * j / rowsN, off); }));
    const sm = (s0 + s1) / 2;
    surf(m).grid(rows, P(A[0] + e[0] * sm + n[0] * 12, (y0 + maxTop) / 2, A[1] + e[1] * sm + n[1] * 12));
  }

  // ---------------------------------------------------------------- slot windows (narrow, tall, lit at night)
  const SLOTS = [
    ['sign', 'N', 14.9, 16.0, 3, 29], ['north-east', 'N', 0.5, 1.6, 3, 21.5], ['north-east', 'E', 6, 7.1, 3, 22],
    ['bridge-pier', 'W', 0.5, 1.5, 2, 12], ['centre', 'N', 3.4, 4.4, 25, 30.2],
    ['east', 'E', 5.2, 6.3, 3, 19.4], ['south-east', 'S', 4.2, 5.3, 3, 25], ['south-east', 'E', 0.8, 1.9, 3, 25.5],
    ['south-west', 'W', 2.2, 3.3, 3, 17.4], ['west-block', 'W', 14.4, 15.5, 3, 28], ['west-block', 'S', 6.2, 7.3, 3, 28],
  ];
  for (const [id, side, s0, s1, y0, y1] of SLOTS) if (near || ['sign', 'north-east', 'south-east', 'west-block'].includes(id)) overlay('glow', byId(id), side, s0, s1, y0, y1, OFF, 1, 3.2);

  // the triangular window beside the skybridge landing (apex up, 3.4 m wide, base 15 m, apex 22 m), the street entrance
  // arch and the plinth glazing. s runs south along the sign tower's street wall from its north-west corner (v -18):
  // the window stands on the flat part, just north of where the bridge's flare begins to cover the wall (v -11.7).
  if (near) {
    const sign = byId('sign'), pier = byId('bridge-pier'), sw = byId('south-west');
    const tri = [[TRI.s0, TRI.base], [TRI.s1, TRI.base], [(TRI.s0 + TRI.s1) / 2, TRI.apex]];
    soup('glass').tri(wallPoint(sign, 'W', ...tri[0], 0.25), wallPoint(sign, 'W', ...tri[1], 0.25), wallPoint(sign, 'W', ...tri[2], 0.25), P(-20, 12, -14));
    overlay('glow', pier, 'W', 1.6, 11.6, 0.2, (s) => 0.2 + 7.4 * Math.sqrt(Math.max(0, 1 - ((s - 6.6) / 5) ** 2)), 0.25, 14, 1.6);
    overlay('glass', sw, 'S', 6.2, 15.8, 0.2, 4.2, 0.25, 4, 4);
  }

  // ---------------------------------------------------------------- roof vaults and plant
  function vault(c, u0, u1, v0, v1, rise, m) {
    const N = near ? 10 : 5, arc = (t) => c.h + rise * (1 - (2 * t - 1) ** 2);
    const rows = Array.from({ length: N + 1 }, (_, j) => { const t = j / N, v = v0 + (v1 - v0) * t; return [P(u0, arc(t), v), P(u1, arc(t), v)]; });
    surf(m).grid(rows, P((u0 + u1) / 2, c.h + rise + 12, (v0 + v1) / 2));
    for (const [u, dir] of [[u0, -1], [u1, 1]]) {
      const pts = Array.from({ length: N + 1 }, (_, j) => P(u, arc(j / N), v0 + (v1 - v0) * j / N));
      for (let j = 1; j < N; j++) soup(m).tri(pts[0], pts[j], pts[j + 1], P(u + dir * 10, c.h + 1, (v0 + v1) / 2));
    }
  }
  vault(byId('centre'), 25.5, 36.5, 0, 8, 2.8, 'tileBronze');
  vault(byId('south-east'), 26, 46, 11.2, 16.4, 2.2, 'tileBronze');
  vault(byId('north-east'), 26, 46, -15.5, -4, 1.8, 'tileBronze');
  if (near) {
    const plant = [['north-east', 38, -9, 4, 2.2, 3], ['east', 43, 4, 5, 2, 3.5], ['south-west', 15, 13, 5, 2.4, 3], ['bridge-pier', 15, 1, 6, 2.2, 3], ['west-block', -43, 0, 5, 2.4, 6]];
    for (const [id, u, v, w, hgt, d] of plant) {
      const c = byId(id), [x, z] = toLocal(u, v);
      b.box('roof', [x, c.h + hgt / 2 - 0.02, z], [w, hgt, d], -THETA);
    }
  }

  // ---------------------------------------------------------------- the skybridge over 4 Street SE
  const R = BRIDGE.radius, steps = near ? 8 : 3;
  const arcPts = (cu, cv, from, to) => Array.from({ length: steps + 1 }, (_, i) => { const a = (from + (to - from) * i / steps) * Math.PI / 180; return [cu + R * Math.cos(a), cv + R * Math.sin(a)]; });
  const north = [
    ...arcPts(BRIDGE.uEast - R, BRIDGE.vNorth - R, 0, 90),
    ...arcPts(BRIDGE.uWest + R, BRIDGE.vNorth - R, 90, 180),
  ];
  const south = [
    ...arcPts(BRIDGE.uEast - R, BRIDGE.vSouth + R, 0, -90),
    ...arcPts(BRIDGE.uWest + R, BRIDGE.vSouth + R, -90, -180),
  ];
  const flank = (pts, outV, name, seed) => {
    const ys = bandRows(BRIDGE.soffit, BRIDGE.top);
    for (let j = 0; j < ys.length - 1; j++) {
      const k = Math.round((ys[j] + ys[j + 1]) / 2 / CHN);
      surf(courseMat('dark', k, seed)).grid([ys[j], ys[j + 1]].map((y) => pts.map(([u, v]) => P(u, y, v))), P(-12, (BRIDGE.soffit + BRIDGE.top) / 2, outV));
    }
  };
  flank(north, -40, 'north', 101);
  flank(south, 40, 'south', 103);
  // top and soffit: a ladder of quads between paired flank points, from wall plane to wall plane
  for (let i = 0; i < north.length - 1; i++) {
    const q = [north[i], north[i + 1], south[i + 1], south[i]];
    soup('roof').quad(...q.map(([u, v]) => P(u, BRIDGE.top, v)), P(-12, BRIDGE.top + 12, -1));
    soup('soffit').quad(...q.map(([u, v]) => P(u, BRIDGE.soffit, v)), P(-12, BRIDGE.soffit - 12, -1));
  }
  // a concave cove under each end of the bridge: the underside sweeps down into the tower wall as a quarter-round
  // (4 quads near, 3 far) across the straight span, closed at both sides by a vertical fan, all in the dark tile
  for (const [uw, dir, r] of [[BRIDGE.uEast, -1, BRIDGE.cove.east], [BRIDGE.uWest, 1, BRIDGE.cove.west]]) {
    const n = near ? 4 : 3, uc = uw + dir * r, yc = BRIDGE.soffit - r, vN = BRIDGE.vNorth, vS = BRIDGE.vSouth;
    const arc = Array.from({ length: n + 1 }, (_, k) => { const a = (Math.PI / 2) * k / n; return [uc - dir * r * Math.cos(a), yc + r * Math.sin(a)]; }); // wall -> soffit
    surf('tileDark').grid(arc.map(([u, y]) => [P(u, y, vN), P(u, y, vS)]), P(uc, yc, (vN + vS) / 2));
    for (const [v, out] of [[vN, vN - 10], [vS, vS + 10]]) for (let k = 0; k < n; k++) {
      soup('tileDark').tri(P(uw, BRIDGE.soffit, v), P(arc[k][0], arc[k][1], v), P(arc[k + 1][0], arc[k + 1][1], v), P(uw + dir * r / 2, BRIDGE.soffit - r / 2, out));
    }
  }
  // the long window strip along both flanks of the straight span, with mullions (near only)
  {
    const uA = -28.4, uB = -1.6, y0 = 22.6, y1 = 25.4;
    for (const [v, outV] of [[BRIDGE.vNorth - OFF, -40], [BRIDGE.vSouth + OFF, 40]]) {
      soup('glow').quad(P(uA, y0, v), P(uB, y0, v), P(uB, y1, v), P(uA, y1, v), P(-12, (y0 + y1) / 2, outV));
      if (near) for (let u = uA + 1.9; u < uB - 0.5; u += 2.7) {
        const vv = v + Math.sign(outV) * 0.08;
        soup('tileDark').quad(P(u - 0.12, y0, vv), P(u + 0.12, y0, vv), P(u + 0.12, y1, vv), P(u - 0.12, y1, vv), P(-12, (y0 + y1) / 2, outV));
      }
    }
  }

  // ---------------------------------------------------------------- the brick hotel: windows, storefront, cornice
  if (near) {
    const WOFF = 0.1;
    const floorsNorth = [[5.0, 7.0], [9.2, 11.2]];
    const floorsSouth = [[4.06, 5.96], [7.42, 9.32], [10.78, 12.68], [14.14, 16.04]];
    const stripWin = (axis, fixed, from, to, floors, outward) => { // axis 'v': a wall at u = fixed, windows along v
      for (let s = from; s + 1.3 <= to; s += 3.1) for (const [y0, y1] of floors) {
        const a = axis === 'v' ? P(fixed + outward * WOFF, y0, s) : P(s, y0, fixed + outward * WOFF);
        const bq = axis === 'v' ? P(fixed + outward * WOFF, y0, s + 1.3) : P(s + 1.3, y0, fixed + outward * WOFF);
        const cq = axis === 'v' ? P(fixed + outward * WOFF, y1, s + 1.3) : P(s + 1.3, y1, fixed + outward * WOFF);
        const dq = axis === 'v' ? P(fixed + outward * WOFF, y1, s) : P(s, y1, fixed + outward * WOFF);
        soup('glass').quad(a, bq, cq, dq, axis === 'v' ? P(fixed + outward * 12, (y0 + y1) / 2, s) : P(s, (y0 + y1) / 2, fixed + outward * 12));
      }
    };
    stripWin('v', HOTEL.u1, HOTEL.v0 + 2, HOTEL.vSplit - 0.8, floorsNorth, 1);
    stripWin('v', HOTEL.u1, HOTEL.vSplit + 1.2, HOTEL.v1 - 1.5, floorsSouth, 1);
    stripWin('u', HOTEL.v0, HOTEL.u0 + 1.4, HOTEL.u1 - 1, floorsNorth, -1);
    stripWin('u', HOTEL.v1, HOTEL.u0 + 1.4, HOTEL.u1 - 1, floorsSouth, 1);
    // ground-floor storefront on the street side, between brick piers
    for (let s = HOTEL.v0 + 1.5; s + 3.4 <= HOTEL.v1 - 1; s += 4) {
      soup('glass').quad(P(HOTEL.u1 + WOFF, 0.3, s), P(HOTEL.u1 + WOFF, 0.3, s + 3.4), P(HOTEL.u1 + WOFF, 3.0, s + 3.4), P(HOTEL.u1 + WOFF, 3.0, s), P(HOTEL.u1 + 12, 1.6, s + 1.7));
    }
    // cornice: a stone band proud of the wall just under each roof, on the street and end walls
    const corn = (c, side) => {
      const { A, e, n, len } = sideOf(c, side), mid = len / 2;
      const [x, z] = toLocal(A[0] + e[0] * mid + n[0] * 0.125, A[1] + e[1] * mid + n[1] * 0.125);
      const along = n[0] ? [0.5, 0.65, len] : [len, 0.65, 0.5];
      b.box('trim', [x, c.h - 0.175, z], along, -THETA);
    };
    const hn = byId('hotel-north'), hs = byId('hotel-south');
    corn(hn, 'E'); corn(hn, 'N'); corn(hs, 'E'); corn(hs, 'S');
  }

  if (!near) { // far: each hotel floor as one glass band on the street front
    const bands = [[HOTEL.v0 + 2, HOTEL.vSplit - 0.8, [[5.0, 7.0], [9.2, 11.2]]], [HOTEL.vSplit + 1.2, HOTEL.v1 - 1.5, [[4.06, 5.96], [7.42, 9.32], [10.78, 12.68], [14.14, 16.04]]]];
    for (const [va, vb, floors] of bands) for (const [y0, y1] of floors) {
      const u = HOTEL.u1 + 0.1;
      soup('glass').quad(P(u, y0, va), P(u, y0, vb), P(u, y1, vb), P(u, y1, va), P(u + 12, (y0 + y1) / 2, (va + vb) / 2));
    }
  }
  for (const [m, s] of soups) if (!s.empty) b.put(s.geometry(), m);
  for (const [m, s] of surfs) if (!s.empty) b.put(s.geometry(), m);
  return b.finish();
}
