import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { APEX, AXIS_ANGLE, OUTLINE_SIGN, corners, arcPoints, arcAngles, faceHits, wallFrame } from './columbus-tower-site.js';
import { Mesh, Frame, sweepBand, lathe, capPolygon } from './columbus-tower-parts.js';

// Columbus Tower (the Sentinel Building), 916 Kearny St, drawn in real metres around
// SPEC.origin (+X east, +Y up, +Z south) on the mapped wedge outline. Levels are metres above
// grade and come from eight storeys (OSM height 29 m) measured against photographs.
export const WALL_IN = 0.5; // tile wall plane sits this far inside the mapped outline (cornice and turret ring reach it)
export const LEVELS = {
  ground: 4.2, // top of the Cafe Zoetrope storey; the oriels start here
  pitch: 2.9, floors: 6, // oriel floors 2-7
  spandrel: 1.4, // copper panel under each window row
  oriel: 0.55, // oriel head cap above the top window
  cornice: [22.8, 23.85], // verdigris cornice on the straight faces
  roof: 23.3, // flat roof, a 0.55 m parapet below the cornice crest and just under the turret cap ring
  capTop: 23.5, // turret cap ring (slim bell, 1.9 m tall)
  drumTop: 25.0, domeTop: 26.9, tip: 29.8, // drum 1.5 m, dome 1.9 m, finial group 2.9 m
};
const L = LEVELS;
const Y_TOP = L.ground + L.pitch * L.floors; // top of the highest window row, 22.2 m
const R_OUT = APEX.r; // turret ring radius at the mapped footprint, ~2.49 m
const R_BODY = R_OUT - WALL_IN; // turret body ~1.99 m
const R_RING = R_BODY + 0.12, R_IN = 1.7;
export const POSITIONS = { kearny: [2.6, 6.8, 11.0], columbus: [3.2, 8.9, 14.6] }; // oriel centres, m from the turret end of each face
export const KINDS = { kearny: ['canted', 'bow', 'canted'], columbus: ['canted', 'bow', 'bow'] };

const deg = Math.PI / 180;
const lit = (a, b, c) => ((Math.imul(a + 1, 73856093) ^ Math.imul(b + 1, 19349663) ^ Math.imul(c + 1, 83492791)) >>> 0) % 4 === 0;
const unit = (a) => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; };
const frameOf = (w) => new Frame(w.o, w.t, w.n);

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const V = near ? 'verdigris' : 'copper'; // pale verdigris on the cornice, dome and finial (merged into copper in far)
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const M = {};
  const mesh = (m) => (M[m] ||= new Mesh());
  const sweep = (m, points, profile, opts = {}) => b.put(sweepBand(points, profile, { sign: OUTLINE_SIGN, ...opts }), m);
  const latheTo = (m, profile, from, to, segs, c = APEX.c) => b.put(lathe(profile, c, segs, { from, to }), m);

  // ---------------------------------------------------------------- ground floor: Cafe Zoetrope storey
  const arcSteps = near ? 18 : 8;
  const gRun = (d) => { const c = corners(d); return [c.sw, ...arcPoints(d, arcSteps), c.se]; };
  const g = gRun(0.2);
  sweep('base', g, [[0, 0.4], [0, 0.9], [-0.12, 0.9]]); // stall riser
  sweep('tile', g, [[0.06, 0], [0.06, 0.34], [0, 0.4]]); // pale stone plinth
  sweep('base', g, [[-0.12, 3.25], [0, 3.25], [0, 3.95]]); // lintel / sign band
  sweep('tile', g, [[0, 3.95], [0.1, 3.95], [0.1, 4.12], [0, L.ground], [-0.3, L.ground]]); // white moulding under the oriels
  sweep('glow', g, [[-0.12, 0.9], [-0.12, 3.25]]); // shop glass behind the posts (lit café at night)
  sweep('base', g, [[-0.05, 2.5], [-0.05, 2.62]]); // transom bar
  {
    const cc = corners(0.2);
    sweep('tile', [cc.se, cc.sw], [[0, 0], [0, L.ground]], { closed: false }); // party wall to 900 Kearny (hidden by it)
  }
  // shop posts every ~2.3 m along both faces, and round the turret; a corner door on the turret axis
  const [g0, g1] = arcAngles(0.2), rg = APEX.r - 0.2;
  const doorSpan = 16 * deg;
  if (near) {
    const pmb = mesh('base');
    for (let i = 1; i < 8; i++) {
      const a = g0 + (g1 - g0) * i / 8, hw = 0.17 / rg, P = (ang, r, y) => [APEX.c[0] + Math.cos(ang) * r, y, APEX.c[1] + Math.sin(ang) * r];
      if (Math.abs(a - AXIS_ANGLE) < doorSpan) continue; // the door replaces the post on the axis
      const [a0, a1] = [a - hw, a + hw], rOut = rg + 0.07, rIn = rg - 0.2;
      pmb.quad(P(a0, rOut, 0.9), P(a1, rOut, 0.9), P(a1, rOut, 3.25), P(a0, rOut, 3.25), [Math.cos(a), 0, Math.sin(a)]);
      pmb.quad(P(a0, rIn, 0.9), P(a0, rOut, 0.9), P(a0, rOut, 3.25), P(a0, rIn, 3.25), [Math.sin(a0), 0, -Math.cos(a0)]);
      pmb.quad(P(a1, rIn, 0.9), P(a1, rOut, 0.9), P(a1, rOut, 3.25), P(a1, rIn, 3.25), [-Math.sin(a1), 0, Math.cos(a1)]);
    }
    // the corner door: two glazed leaves and a transom in a stained-wood frame, on a white step
    const r0 = rg + 0.04, tan = [-Math.sin(AXIS_ANGLE), Math.cos(AXIS_ANGLE)], nrm = [Math.cos(AXIS_ANGLE), Math.sin(AXIS_ANGLE)], w = 1.4;
    const DF = new Frame([APEX.c[0] + nrm[0] * r0 - tan[0] * w / 2, APEX.c[1] + nrm[1] * r0 - tan[1] * w / 2], tan, nrm);
    windowRow(DF, 0, w, 0.16, 2.45, 0, 0, 91, 'glow');
    windowRow(DF, 0, w, 2.5, 3.2, 0, 0, 92, 'glow');
    DF.box(mesh('frame'), w / 2 - 0.03, w / 2 + 0.03, 0.2, 2.4, -0.09, -0.02, ['back', 'top', 'bottom']); // meeting stile
    DF.box(mesh('tile'), -0.8, w + 0.8 - 0.0, 0, 0.14, -0.25, 0.5, ['back', 'bottom']); // step
  }
  for (const name of ['kearny', 'columbus']) {
    const W = wallFrame(name, 0.2), F = frameOf(W), n = Math.max(2, Math.round(W.length / 2.3));
    for (let i = 0; i <= n; i++) {
      const s = i === 0 ? 0.15 : i === n ? W.length - 0.15 : (W.length * i) / n;
      F.box(mesh('base'), s - 0.17, s + 0.17, 0.9, 3.25, -0.12, 0.07, ['back', 'top', 'bottom']);
    }
  }
  // red canvas canopies, one per shop bay, each with a sloped top, a valance and closed ends
  {
    const am = mesh('awning');
    const canopy = (F, s0, s1, oF = 0.7) => {
      F.slope(am, s0, s1, 3.0, oF, 3.7, 0.05);
      F.quad(am, s0, s1, 2.65, 3.0, oF);
      am.quad(F.pt(s0, 2.65, oF), F.pt(s1, 2.65, oF), F.pt(s1, 3.55, 0.05), F.pt(s0, 3.55, 0.05), [-F.n[0] * 0.8, -0.7, -F.n[1] * 0.8]);
      for (const [s, sgn] of [[s0, -1], [s1, 1]]) am.quad(F.pt(s, 2.65, oF), F.pt(s, 3.0, oF), F.pt(s, 3.7, 0.05), F.pt(s, 3.55, 0.05), [F.t[0] * sgn, 0, F.t[1] * sgn]);
    };
    if (near) {
      for (const name of ['kearny', 'columbus']) {
        const W = wallFrame(name, 0.2), F = frameOf(W), n = Math.max(2, Math.round(W.length / 2.3));
        const stop = W.length - 1.2; // stop short of the acute party-wall corner
        for (let i = 0; i < n; i++) {
          const s0 = (i === 0 ? 0.15 : (W.length * i) / n) + 0.07, s1 = Math.min(stop, (i + 1 === n ? W.length - 0.15 : (W.length * (i + 1)) / n) - 0.07);
          if (s1 - s0 > 0.4) canopy(F, s0, s1);
        }
      }
      for (let i = 0; i < 8; i++) { // round the turret: one canopy per chord
        const a0 = g0 + (g1 - g0) * i / 8 + 0.025, a1 = g0 + (g1 - g0) * (i + 1) / 8 - 0.025, rr = rg;
        const p0 = [APEX.c[0] + Math.cos(a0) * rr, APEX.c[1] + Math.sin(a0) * rr], p1 = [APEX.c[0] + Math.cos(a1) * rr, APEX.c[1] + Math.sin(a1) * rr];
        const t = unit([p1[0] - p0[0], p1[1] - p0[1]]), am2 = (a0 + a1) / 2;
        canopy(new Frame(p0, t, [Math.cos(am2), Math.sin(am2)]), 0, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]));
      }
    } else {
      // far: the awning as one swept strip
      const a = gRun(0.2), cut = (p, q, d) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [p[0] + (q[0] - p[0]) * d / l, p[1] + (q[1] - p[1]) * d / l]; };
      a[0] = cut(a[0], a[1], 1.2); a[a.length - 1] = cut(a[a.length - 1], a[a.length - 2], 1.2);
      sweep('awning', a, [[0.7, 2.65], [0.7, 3.0], [0.05, 3.7]]);
      sweep('awning', a, [[0.05, 3.55], [0.7, 2.65]]);
    }
  }

  // ---------------------------------------------------------------- the white tile wall above the shops
  const wallC = corners(WALL_IN);
  const wallRun = [wallC.ct, wallC.se, wallC.sw, wallC.kt]; // in outline order, so "outside" is outside
  sweep('tile', wallRun, [[0, L.ground], [0, L.cornice[0]]], { closed: false });
  // white string courses at every floor line, and a heavier one under the cornice (visible between the oriels)
  if (near) {
    for (let f = 1; f < L.floors; f++) { const y = L.ground + f * L.pitch + 0.02; sweep('tile', wallRun, [[0, y], [0.09, y], [0.09, y + 0.16], [0, y + 0.22]], { closed: false }); }
    sweep('tile', wallRun, [[0, Y_TOP + 0.02], [0.12, Y_TOP + 0.02], [0.12, Y_TOP + 0.3], [0, Y_TOP + 0.4]], { closed: false });
  }
  // copper cornice, straight faces only (the turret has its own ring)
  const cornice = [[0, L.cornice[0]], [0.12, L.cornice[0]], [0.12, L.cornice[0] + 0.15], [0.32, L.cornice[0] + 0.3], [0.46, L.cornice[0] + 0.6], [0.55, L.cornice[0] + 0.7], [0.55, L.cornice[1] - 0.25], [0.42, L.cornice[1] - 0.12], [0, L.cornice[1]], [0, L.roof]];
  sweep(V, wallRun, near ? cornice : [[0, L.cornice[0]], [0.12, L.cornice[0]], [0.46, L.cornice[0] + 0.6], [0.55, L.cornice[0] + 0.7], [0.55, L.cornice[1] - 0.25], [0, L.cornice[1]], [0, L.roof]], { closed: false });
  // flat roof inside the cornice
  {
    const roofRing = [wallC.sw, ...arcPoints(WALL_IN, near ? 14 : 8), wallC.se];
    b.put(capPolygon(roofRing, L.roof), 'roof');
  }

  // ---------------------------------------------------------------- oriels
  // An oriel is an open plan polyline (s along the wall, out from it) swept up the six floors:
  // copper spandrel panels with a recessed patina field, window rows between full-height posts.
  const spandrelA = (y) => [[-0.2, y], [0.1, y], [0.1, y + 0.26], [0.05, y + 0.3]];
  const spandrelB = (y) => [[0.05, y + 1.05], [0.1, y + 1.1], [0.1, y + 1.25], [0.17, y + 1.32], [0.17, y + L.spandrel], [-0.2, y + L.spandrel]];
  function windowRow(F, s0, s1, y0, y1, out, floor, k, forced) {
    // frame ring (stained wood), meeting rail, glass set back behind them
    const w = 0.06, glassOut = out - 0.09, fm = mesh('frame');
    F.quad(fm, s0, s1, y0, y0 + w, out); F.quad(fm, s0, s1, y1 - w, y1, out);
    F.quad(fm, s0, s0 + w, y0 + w, y1 - w, out); F.quad(fm, s1 - w, s1, y0 + w, y1 - w, out);
    const ym = (y0 + y1) / 2;
    F.quad(fm, s0 + w, s1 - w, ym - 0.03, ym + 0.03, out);
    F.quad(mesh(forced || (lit(floor, k, 7) ? 'glow' : 'glass')), s0 + w, s1 - w, y0 + w, y1 - w, glassOut);
  }
  function oriel(wall, c, kind, tag) {
    const F = frameOf(wall);
    let pts; // [s, out] plan polyline, hugging the wall at both ends, with the ends carried into the wall
    if (kind === 'canted') pts = [[c - 1.3, 0], [c - 0.82, 0.5], [c + 0.82, 0.5], [c + 1.3, 0]];
    else {
      const half = 1.2, depth = 0.58, R = (half * half + depth * depth) / (2 * depth), a1 = Math.asin(half / R), n = near ? 4 : 3;
      pts = [];
      for (let i = 0; i <= n; i++) { const th = -a1 + (2 * a1 * i) / n; pts.push([c + R * Math.sin(th), depth - R + R * Math.cos(th)]); }
    }
    const real = pts.length;
    const first = pts[0], second = pts[1], last = pts[real - 1], prev = pts[real - 2];
    const ext = (p, q) => { const d = unit([p[0] - q[0], p[1] - q[1]]); return [p[0] + d[0] * 0.55, p[1] + d[1] * 0.55]; };
    const all = [ext(first, second), ...pts, ext(last, prev)];
    const world = all.map(([s, o]) => { const q = F.pt(s, 0, o); return [q[0], q[2]]; });
    // orient the run so "outside" is outside the building
    const en = (i) => { const p = world[i], q = world[i + 1], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1; return [OUTLINE_SIGN * dz / l, -OUTLINE_SIGN * dx / l]; };
    const flip = en(2)[0] * wall.n[0] + en(2)[1] * wall.n[1] < 0;
    const run = flip ? [...world].reverse() : world;
    // body: corbelled apron, six floors of panels, head cap
    const y0 = L.ground;
    sweep('copper', run, [[-0.2, y0 - 0.35], [0, y0 - 0.35], [0.1, y0 - 0.22], [0.1, y0 + 0.26], [0.05, y0 + 0.3]], { closed: false });
    for (let f = 0; f < L.floors; f++) {
      const y = y0 + f * L.pitch;
      if (!near) continue;
      if (f > 0) sweep('copper', run, spandrelA(y), { closed: false });
      sweep('patina', run, [[0.05, y + 0.3], [0.05, y + 1.05]], { closed: false });
      sweep('copper', run, spandrelB(y), { closed: false });
    }
    if (!near) sweep('copper', run, [[0.1, y0 + 0.26], [0.1, Y_TOP]], { closed: false });
    // head cap and lid
    sweep('copper', run, [[-0.2, Y_TOP], [0.13, Y_TOP], [0.13, Y_TOP + 0.2], [0.05, Y_TOP + 0.28], [0.05, Y_TOP + 0.4], [0.14, Y_TOP + 0.48], [0.14, Y_TOP + L.oriel]], { closed: false });
    {
      // lid: the plan polygon of the head (offset 0.18), flat at the top of the cap
      const inner = world.slice(1, -1), poly = [];
      const pts3 = inner;
      const dirs = pts3.map((p, i) => { const prevP = pts3[Math.max(0, i - 1)], nextP = pts3[Math.min(pts3.length - 1, i + 1)]; const t = unit([nextP[0] - prevP[0], nextP[1] - prevP[1]]); return [OUTLINE_SIGN * t[1], -OUTLINE_SIGN * t[0]]; });
      const sign = flip ? -1 : 1;
      pts3.forEach((p, i) => poly.push([p[0] + sign * dirs[i][0] * 0.14, p[1] + sign * dirs[i][1] * 0.14]));
      const back = [pts3[pts3.length - 1], pts3[0]];
      b.put(capPolygon([...poly, back[0], back[1]].filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-4), Y_TOP + L.oriel), 'copper');
    }
    // the arched attic window above the head cap: a segmental copper arch with two lights, in the wall plane
    if (near) {
      const a = kind === 'bow' ? 1.25 : 0.95, rise = 0.6, yb = Y_TOP + L.oriel, n = 10;
      const ell = (rx, ry, t) => [c + rx * Math.cos(Math.PI * (1 - t)), yb + ry * Math.sin(Math.PI * (1 - t))];
      const cm = mesh('copper'), gm = mesh('glass');
      for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n;
        const o0 = ell(a, rise, t0), o1 = ell(a, rise, t1), i0 = ell(a - 0.24, rise - 0.2, t0), i1 = ell(a - 0.24, rise - 0.2, t1);
        cm.quad(F.pt(o0[0], o0[1], 0.12), F.pt(o1[0], o1[1], 0.12), F.pt(i1[0], i1[1], 0.12), F.pt(i0[0], i0[1], 0.12), F.normal);
        const centre = F.pt(c, yb, 0.06);
        gm.tri(centre, F.pt(i0[0], i0[1], 0.06), F.pt(i1[0], i1[1], 0.06), F.normal);
      }
      F.quad(mesh('frame'), c - 0.03, c + 0.03, yb, yb + rise - 0.2, 0.09);
    }
    // faces, posts, windows
    const faces = [];
    for (let i = 1; i < real; i++) {
      const a = F.pt(pts[i - 1][0], 0, pts[i - 1][1]), bpt = F.pt(pts[i][0], 0, pts[i][1]);
      const t = unit([bpt[0] - a[0], bpt[2] - a[2]]);
      const nrm = [OUTLINE_SIGN * t[1], -OUTLINE_SIGN * t[0]];
      const outward = nrm[0] * wall.n[0] + nrm[1] * wall.n[1] >= 0 ? nrm : [-nrm[0], -nrm[1]];
      faces.push({ frame: new Frame([a[0], a[2]], t, outward), length: Math.hypot(bpt[0] - a[0], bpt[2] - a[2]), a, b: bpt });
    }
    // posts at every real vertex, full height of the window rows (hidden inside the panels)
    const pm = mesh('copper');
    for (let i = 0; near && i < real; i++) {
      const fa = faces[Math.min(i, faces.length - 1)], fb = faces[Math.max(0, i - 1)];
      const bis = unit([fa.frame.n[0] + fb.frame.n[0], fa.frame.n[1] + fb.frame.n[1]]);
      const v = i === 0 ? fa.a : i === real - 1 ? fb.b : fa.a;
      const pf = new Frame([v[0] - (-bis[1]) * 0.11, v[2] - bis[0] * 0.11], [-bis[1], bis[0]], bis);
      pf.box(pm, 0, 0.22, y0 + L.spandrel, Y_TOP, -0.2, 0.07, ['back', 'top', 'bottom']);
    }
    // windows
    faces.forEach((face, i) => {
      const usable0 = 0.11, usable1 = face.length - 0.11, nWin = usable1 - usable0 > 1.4 ? 2 : 1, gap = 0.2;
      if (near && nWin === 2) {
        const mid = face.length / 2;
        face.frame.box(pm, mid - 0.1, mid + 0.1, y0 + L.spandrel, Y_TOP, -0.2, 0.07, ['back', 'top', 'bottom']);
      }
      for (let w = 0; w < nWin; w++) {
        const span = (usable1 - usable0 - (nWin - 1) * gap) / nWin;
        const s0 = usable0 + w * (span + gap), s1 = s0 + span;
        for (let f = 0; f < L.floors; f++) {
          const y = y0 + f * L.pitch;
          if (near) windowRow(face.frame, s0, s1, y + L.spandrel, y + L.pitch, -0.1, f, tag * 11 + i * 3 + w);
          else face.frame.quad(mesh(lit(f, tag * 11 + i * 3 + w, 3) ? 'glow' : 'glass'), s0, s1, y + L.spandrel + 0.05, y + L.pitch - 0.05, 0.17);
        }
      }
    });
    return faces;
  }

  const wallK = wallFrame('kearny', WALL_IN), wallC2 = wallFrame('columbus', WALL_IN);
  let tag = 0;
  const orielFaces = {};
  for (const [wall, name] of [[wallK, 'kearny'], [wallC2, 'columbus']]) {
    orielFaces[name] = POSITIONS[name].map((c, i) => oriel(wall, c, KINDS[name][i], tag++));
    // a low roof hatch behind the cornice above each oriel
    const F = frameOf(wall);
    for (const c of POSITIONS[name]) F.box(mesh(V), c - 0.8, c + 0.8, L.roof - 0.1, L.cornice[1] + 0.2, -1.8, -0.9, ['bottom']); // low roof hatches, set back behind the cornice
  }

  // ---------------------------------------------------------------- the corner turret
  {
    const C = APEX.c, ang = (u) => AXIS_ANGLE + u * deg;
    const hit = (R) => faceHits(R, WALL_IN);
    const [aK, aC] = hit(R_RING), segs = near ? 22 : 9;
    const lo = Math.min(aK, aC), hi = Math.max(aK, aC);
    // floor-by-floor rings: copper spandrels with a patina field, windows recessed between piers
    const turretFloor = (y) => {
      if (near) {
        latheTo('copper', [[R_IN, y], [R_RING, y], [R_RING, y + 0.26]], lo, hi, segs);
        latheTo('copper', [[R_RING, y + 0.26], [R_RING - 0.05, y + 0.3]], lo, hi, segs);
        latheTo('patina', [[R_RING - 0.05, y + 0.3], [R_RING - 0.05, y + 1.05]], lo, hi, segs);
        latheTo('copper', [[R_RING - 0.05, y + 1.05], [R_RING, y + 1.1], [R_RING, y + 1.25], [R_RING + 0.06, y + 1.32], [R_RING + 0.06, y + L.spandrel], [R_IN, y + L.spandrel]], lo, hi, segs);
      } else {
        latheTo('copper', [[R_IN, y], [R_RING, y], [R_RING, y + L.spandrel], [R_IN, y + L.spandrel]], lo, hi, segs);
      }
    };
    for (let f = 0; f < L.floors; f++) turretFloor(L.ground + f * L.pitch);
    // window layout around the axis: a pier on the axis, then windows between 6-degree piers, ending in a buttress
    const side = (sign, h) => {
      const span = h - 10 - 5, n = Math.max(1, Math.round((span + 6) / 36)), w = (span - (n - 1) * 6) / n;
      const wins = [];
      for (let i = 0; i < n; i++) wins.push([5 + i * (w + 6), 5 + i * (w + 6) + w]);
      return { sign, wins, h };
    };
    const hK = Math.abs(((aK - AXIS_ANGLE) / deg)), hC = Math.abs(((aC - AXIS_ANGLE) / deg));
    const layout = [side(Math.sign(aK - AXIS_ANGLE), hK), side(Math.sign(aC - AXIS_ANGLE), hC)];
    const pm = mesh('copper');
    const dirAt = (a, r) => [C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r];
    const piece = (u0, u1, y0, y1, rOut = R_RING - 0.04) => { // a flat-faced pier between two angles
      const a0 = Math.min(u0, u1), a1 = Math.max(u0, u1);
      const P = (a, r, y) => { const q = dirAt(a, r); return [q[0], y, q[1]]; };
      const mid = (a0 + a1) / 2, hint = [Math.cos(mid), 0, Math.sin(mid)];
      pm.quad(P(a0, rOut, y0), P(a1, rOut, y0), P(a1, rOut, y1), P(a0, rOut, y1), hint);
      pm.quad(P(a0, 1.6, y0), P(a0, rOut, y0), P(a0, rOut, y1), P(a0, 1.6, y1), [Math.sin(a0), 0, -Math.cos(a0)]);
      pm.quad(P(a1, 1.6, y0), P(a1, rOut, y0), P(a1, rOut, y1), P(a1, 1.6, y1), [-Math.sin(a1), 0, Math.cos(a1)]);
    };
    for (let f = 0; f < L.floors; f++) {
      const y = L.ground + f * L.pitch, yw0 = y + L.spandrel, yw1 = y + L.pitch;
      piece(ang(-5), ang(5), yw0, yw1);
      for (const sd of layout) {
        const sgn = sd.sign || 1;
        // piers between windows and the buttress at the wall
        let prev = 5;
        sd.wins.forEach(([u0, u1], wi) => {
          if (u0 > prev) piece(ang(sgn * prev), ang(sgn * u0), yw0, yw1);
          prev = u1;
          const um = (u0 + u1) / 2, am = ang(sgn * um), half = ((u1 - u0) / 2) * deg;
          const wWidth = 2 * 1.74 * Math.sin(half);
          const tan = [-Math.sin(am), Math.cos(am)];
          const o = dirAt(am, 1.74);
          const F = new Frame([o[0] - tan[0] * wWidth / 2, o[1] - tan[1] * wWidth / 2], tan, [Math.cos(am), Math.sin(am)]);
          if (near) windowRow(F, 0, wWidth, yw0, yw1, 0, f, 40 + wi + (sgn > 0 ? 5 : 0));
          else F.quad(mesh(lit(f, wi + (sgn > 0 ? 5 : 0), 9) ? 'glow' : 'glass'), 0.04, wWidth - 0.04, yw0 + 0.05, yw1 - 0.05, 0.3);
        });
        piece(ang(sgn * prev), ang(sgn * (sd.h + 4)), yw0, yw1);
      }
    }
    // cap ring: a slim bell of copper under the drum
    const [cK, cC] = hit(R_OUT);
    const rm = R_OUT - 0.05; // widest point of the bell, just inside the mapped turret
    const capProfile = [[R_IN, Y_TOP], [R_RING, Y_TOP], [R_RING + 0.06, Y_TOP + 0.25], [R_OUT - 0.2, Y_TOP + 0.6], [rm, Y_TOP + 0.95], [rm, Y_TOP + 1.2], [rm - 0.14, Y_TOP + 1.5], [R_OUT - 0.4, Y_TOP + 1.75], [1.62, L.capTop]];
    latheTo('copper', near ? capProfile : [[R_IN, Y_TOP], [R_RING, Y_TOP], [rm, Y_TOP + 0.95], [rm, Y_TOP + 1.2], [R_OUT - 0.4, Y_TOP + 1.75], [1.62, L.capTop]], Math.min(cK, cC), Math.max(cK, cC), near ? 26 : 10);
    // drum, dome, finial: full circles on the roof
    const full = near ? 20 : 10;
    const full2 = (m, profile, s = full) => b.put(lathe(profile, C, s), m);
    full2(V, [[1.62, L.roof], [1.62, L.drumTop - 0.3], [1.74, L.drumTop - 0.2], [1.74, L.drumTop]]);
    // drum windows (north side)
    for (let i = 0; i < (near ? 5 : 3); i++) {
      const u = near ? -48 + 24 * i : -30 + 30 * i, am = ang(u), tan = [-Math.sin(am), Math.cos(am)], wWidth = 0.6, o = dirAt(am, 1.62);
      const F = new Frame([o[0] - tan[0] * wWidth / 2, o[1] - tan[1] * wWidth / 2], tan, [Math.cos(am), Math.sin(am)]);
      if (near) windowRow(F, 0, wWidth, L.capTop + 0.35, L.capTop + 1.2, 0.16, 9, 70 + i);
      else F.quad(mesh('glass'), 0, wWidth, L.capTop + 0.35, L.capTop + 1.2, 0.1);
    }
    const dm = (r, y) => [r, L.drumTop + y];
    const dome = [dm(1.74, 0), dm(1.8, 0.12), dm(1.74, 0.5), dm(1.56, 0.95), dm(1.28, 1.35), dm(0.92, 1.65), dm(0.6, 1.82), dm(0.4, 1.9)];
    full2(V, near ? dome : [dm(1.74, 0), dm(1.78, 0.2), dm(1.28, 1.35), dm(0.6, 1.82), dm(0.4, 1.9)]);
    // finial group: neck, secondary bulb, collar, gilded ball, spire
    const nk = (r, y) => [r, L.domeTop + y];
    full2(V, [nk(0.4, 0), nk(0.52, 0.06), nk(0.52, 0.16), nk(0.38, 0.24), nk(0.3, 0.36), nk(0.3, 0.42), nk(0.4, 0.5), nk(0.44, 0.68), nk(0.4, 0.86), nk(0.3, 0.96), nk(0.26, 1.05), nk(0.26, 1.15), nk(0.38, 1.2), nk(0.3, 1.26)], near ? 12 : 6);
    full2(near ? 'gold' : 'copper', [nk(0.3, 1.26), nk(0.2, 1.34), nk(0.29, 1.45), nk(0.3, 1.58), nk(0.26, 1.72), nk(0.15, 1.82), nk(0.001, 1.86)], near ? 10 : 5);
    full2(V, [nk(0.05, 1.8), nk(0.03, L.tip - L.domeTop - 0.3), nk(0.001, L.tip - L.domeTop)], near ? 5 : 4);
  }

  // ---------------------------------------------------------------- fire escape on the Columbus face (iron)
  if (!near) {
    // simplified: the six landings with a front rail, and a ribbon for each stair run (dark base material)
    const F = frameOf(wallC2), im = mesh('base'), c = POSITIONS.columbus[0], s0 = c - 2.0, s1 = c + 2.0, o0 = 0.85, o1 = 1.55;
    for (let f = 0; f < L.floors; f++) {
      const yp = L.ground + f * L.pitch + 1.3;
      F.box(im, s0, s1, yp, yp + 0.07, o0, o1, ['back', 'bottom']);
      F.box(im, s0, s1, yp + 0.95, yp + 1.0, o1 - 0.05, o1, ['bottom', 'back', 'left', 'right']);
      if (f < L.floors - 1) for (const sgn of [1, -1]) im.quad(F.pt(s1 - 0.4, yp + 0.07, o0 + 0.3), F.pt(s0 + 0.9, yp + L.pitch, o0 + 0.3), F.pt(s0 + 0.9, yp + L.pitch - 0.22, o0 + 0.3), F.pt(s1 - 0.4, yp - 0.15, o0 + 0.3), F.normal.map((v) => v * sgn));
    }
  }
  if (near) {
    const F = frameOf(wallC2), im = mesh('iron'), c = POSITIONS.columbus[0];
    const s0 = c - 2.0, s1 = c + 2.0, o0 = 0.85, o1 = 1.55;
    for (let f = 0; f < L.floors; f++) {
      const yp = L.ground + f * L.pitch + 1.3; // landing level, just under the window sills
      F.box(im, s0, s1, yp, yp + 0.07, o0, o1);
      // cantilever beams back to the wall (clear of the oriel, which spans c +- 1.62)
      for (const s of [s0 + 0.12, s1 - 0.12]) F.box(im, s - 0.05, s + 0.05, yp - 0.18, yp, 0.0, o0, ['back', 'front']);
      // rails: front and both ends, posts at the corners
      F.box(im, s0, s1, yp + 0.95, yp + 1.0, o1 - 0.05, o1, ['bottom']);
      F.box(im, s0, s0 + 0.05, yp + 0.95, yp + 1.0, o0, o1 - 0.05, ['bottom', 'left']);
      F.box(im, s1 - 0.05, s1, yp + 0.95, yp + 1.0, o0, o1 - 0.05, ['bottom', 'right']);
      for (const [s, o] of [[s0, o1], [s1 - 0.05, o1], [s0, o0 + 0.05], [s1 - 0.05, o0 + 0.05], [(s0 + s1) / 2, o1]]) F.box(im, s, s + 0.05, yp + 0.07, yp + 0.95, o - 0.05, o, ['bottom', 'top']);
      // stair run up to the next landing, along the free end
      if (f < L.floors - 1) {
        const ya = yp + 0.07, yb = yp + L.pitch, sa = s1 - 0.4, sb = s0 + 0.9, oa = o0 + 0.05, ob = o0 + 0.65;
        for (const o of [oa, ob]) for (const sgn of [1, -1]) im.quad(F.pt(sa, ya, o), F.pt(sb, yb, o), F.pt(sb, yb - 0.22, o), F.pt(sa, ya - 0.22, o), F.normal.map((v) => v * sgn));
      }
    }
  }

  // ---------------------------------------------------------------- roof clutter (near)
  if (near) {
    const F = frameOf(wallC2), ik = mesh('roof');
    F.box(ik, 8.2, 10.0, L.roof, L.roof + 1.1, -3.0, -1.6, ['bottom']); // stair penthouse set back from the long face
    F.box(mesh('iron'), 12.2, 12.32, L.roof, L.roof + 1.8, -1.6, -1.48, ['bottom', 'top']); // vent pipe
  }

  for (const [m, mm] of Object.entries(M)) b.put(mm.geometry(), m);
  return b.finish();
}
