import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildRing, profile, KNOTS, TUNNEL, portalChord } from './calgary-central-library-site.js';
import { Soup, lerp, clamp, hash } from './calgary-central-library-mesh.js';

const ROOF = SPEC.roofY, LID = SPEC.height, PARAPET = 0.4;
// The plaza terraces exist only under the high part of the arch: they fade out below this lower-edge height (m).
const PLAZA_LOW = 6.5;
// Depth bias (m) that sets the glazing behind a near-vertical cedar strip where the recess closes to nothing.
const GLOW_BIAS = 0.02;
// Skylight over the atrium: an ellipse on the building's long axis (bearing about 7 degrees).
export const OCULUS = { c: [1, 4], a: 14, b: 6.2, axis: [0.12, 0.9928] };
// Hexagon side of the facade's crystalline pattern: 465 hexagons over about 6,000 m2 of wall is 13 m2 each.
export const HEX = 2.1;

// Where the facade is densely glazed: [OSM node, plus metres, height, sigma along, sigma up, strength].
const CLUSTERS = [
  [4, 7, 15, 9, 3.8, 0.9],      // the great glazed cluster over the arch
  [7, 0, 12, 3, 12, 0.8],       // the south-west corner, glazed up its full height
  [19, 8, 15.5, 7, 3.5, 0.75],  // over the portal at the north prow
  [23, 0, 13, 8, 4, 0.4], [8, 8, 11, 5, 5, 0.35], [12, 0, 14, 8, 4, 0.4], [16, 0, 11, 7, 4, 0.4], [2, 0, 16.5, 6, 3, 0.35],
];

/**
 * Calgary Central Library in metres (+X east, +Y up, +Z south, origin = area centroid of OSM way 496824026, the
 * outline's rotation baked in). Authoring only (exporter, inspector, tests).
 *
 * near: the pointed-ellipse wall in white aluminium with its hexagon-derived crystalline panels (glazed, fritted
 * and silver rhombi proud of the wall), the steam-bent cedar arch lifted over a terraced plaza on the west side,
 * the lifted prow over the CTrain tunnel mouth with its stone portal, the roof and the raised oculus. far: the same
 * silhouette, arch, prow, portal and oculus with a coarser wall, flat glazed cells only and no steps or skirts.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const FOLD = { silver: 'panel', frit: 'glass', cedarDark: 'cedar' }; // far folds minor materials into their neighbours to stay within 8 draws
  const soups = new Map();
  const S = (m) => { const k = near ? m : (FOLD[m] || m); if (!soups.has(k)) soups.set(k, new Soup()); return soups.get(k); };

  const ring = buildRing(near ? 2.6 : 5.6);
  const { pts: P, N, total: T } = ring;
  const HE = profile(ring, KNOTS.he), DD = profile(ring, KNOTS.d), FL = profile(ring, KNOTS.fl);
  const chord = portalChord(ring), { C: PC, t: PT, perp: PP } = chord;
  // The prow wedge Z: the wall line from the east end of the portal chord round the tip to its north-west end. The
  // lifted wedge has a soffit but no recess line of its own: the portal wall is the straight chord across its base.
  const inZ = (s) => s <= chord.sW || s >= chord.sE;
  const sstep = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
  // Recess depth: the profile, ramping up from the chord's two ends so the recess line leaves the wall line cleanly.
  const Dn = (s) => (inZ(s) ? 0 : Math.max(0.5, Math.min(DD(s), s > chord.sW ? 0.45 * (s - chord.sW) : 0.45 * (chord.sE - s))));
  const act = (s) => HE(s) >= 0.6 && (inZ(s) || DD(s) >= 0.5);
  // Stone base under the glazing along the lifted prow (the portal block): 7 m across the chord, following the lift
  // along the east flank and the north-west flank until the west arch begins.
  const ST = (s) => {
    if (inZ(s)) return 7;
    const base = clamp((HE(s) - 1.8) * 0.9, 0, 7);
    if (s > chord.sW) return base * (1 - sstep((s - chord.sW - 18) / 14));
    return base * sstep((s - (chord.sE - 36)) / 10);
  };
  const V = P.map((p) => {
    const wedge = inZ(p.s), he = HE(p.s), d = Dn(p.s), beyond = p.s > chord.sW ? p.s - chord.sW : chord.sE - p.s;
    const rise = wedge ? 1.4 : lerp(Math.min(0.28 * d + 0.4, 0.4 * d), 1.4, 1 - sstep(beyond / 10));
    return { ...p, wedge, he, d, rise, hg: he + rise, fl: wedge ? 0 : FL(p.s) * sstep((he - PLAZA_LOW) / 2.5), st: ST(p.s), a: act(p.s), rx: p.x - p.nx * d * p.m, rz: p.z - p.nz * d * p.m, fx: p.nx, fz: p.nz };
  });
  const nxt = (i) => (i + 1) % N, prv = (i) => (i + N - 1) % N;
  // Wedge vertices in order from the east end of the chord (iE) round the tip to the north-west end (iW): their recess
  // points are spread along the chord by arc fraction, so the soffit is a fan of quads from the wall line to the chord.
  const zi = V.map((v, i) => (v.wedge ? i : -1)).filter((i) => i >= 0);
  const iE = zi.find((i) => !V[prv(i)].wedge), run = [];
  for (let i = iE; V[i].wedge; i = nxt(i)) run.push(i);
  const iW = run[run.length - 1], cum = run.map((_, k) => run.slice(1, k + 1).reduce((a, i2, q) => a + Math.hypot(V[i2].x - V[run[q]].x, V[i2].z - V[run[q]].z), 0)), arc = cum[cum.length - 1];
  const E3 = [V[iE].x, V[iE].z], W3 = [V[iW].x, V[iW].z];
  run.forEach((i, k) => {
    const u = cum[k] / arc;
    V[i].rx = lerp(E3[0], W3[0], u); V[i].rz = lerp(E3[1], W3[1], u); V[i].fx = -PT[0]; V[i].fz = -PT[1];
  });
  const segActive = (i) => V[i].a && V[nxt(i)].a;
  const O = (i, y) => [V[i].x, y, V[i].z], R = (i, y) => [V[i].rx, y, V[i].rz];
  // The glazing plane: set GLOW_BIAS behind the recess line wherever the recess is under 1 m deep, so the (then
  // near-vertical) cedar strips of the soffit never share its plane.
  const G = (i, y) => { const k = V[i].d < 1 ? GLOW_BIAS : 0; return [V[i].rx - V[i].fx * k, y, V[i].rz - V[i].fz * k]; };
  const facing = (i) => [V[i].fx, V[i].fz];
  const out3 = (c, i, k = 10) => [c[0] + V[i].fx * k, c[1], c[2] + V[i].fz * k]; // a point in front of the recess face
  const mid = (...ps) => ps[0].map((_, k) => ps.reduce((s, p) => s + p[k], 0) / ps.length);

  // ---------------------------------------------------------------- the wall
  for (let i = 0; i < N; i++) {
    const j = nxt(i), on = segActive(i), yi = on ? V[i].he : 0, yj = on ? V[j].he : 0;
    const a = O(i, yi), c = O(j, yj), d = O(j, LID), e = O(i, LID);
    S('panel').quad(a, c, d, e, [(a[0] + c[0]) / 2 + (V[i].nx + V[j].nx) * 5, (a[1] + d[1]) / 2, (a[2] + c[2]) / 2 + (V[i].nz + V[j].nz) * 5]);
  }

  // ---------------------------------------------------------------- the cedar soffit, glazing, stone, steps
  const rows = near ? [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1] : [0, 0.5, 1];
  const curve = (f) => f ** 2.2;
  const sof = (i, f) => { const k = clamp(f, 0, 1); return [lerp(V[i].x, V[i].rx, k), V[i].he + V[i].rise * curve(k), lerp(V[i].z, V[i].rz, k)]; };

  // The tunnel opening in the portal wall: the chord vertices within half the opening width of the centreline.
  const lat = (i) => (V[i].rx - PC[0]) * PP[0] + (V[i].rz - PC[1]) * PP[1];
  const open = run.filter((i) => Math.abs(lat(i)) <= TUNNEL.width / 2);
  const [ia, ib] = open.length ? [open[0], open[open.length - 1]] : [-1, -1];
  const inOpening = (i) => open.length > 1 && run.indexOf(i) >= run.indexOf(ia) && run.indexOf(i) < run.indexOf(ib);

  for (let i = 0; i < N; i++) {
    const j = nxt(i);
    if (!segActive(i)) continue;
    // Soffit: from the facade's lower edge up and inward to the glazing, a dished cedar surface.
    for (let r = 0; r + 1 < rows.length; r++) {
      const a = sof(i, rows[r]), c = sof(j, rows[r]), d = sof(j, rows[r + 1]), e = sof(i, rows[r + 1]);
      const m = mid(a, c, d, e);
      S(r & 1 ? 'cedarDark' : 'cedar').quad(a, c, d, e, [m[0], m[1] - 5, m[2]]);
    }
    // Glazing above the terrace or the stone base, and the stone base itself.
    const hbi = Math.max(V[i].fl, V[i].st), hbj = Math.max(V[j].fl, V[j].st);
    if (V[i].hg - hbi > 0.3 || V[j].hg - hbj > 0.3) {
      const a = G(i, hbi), c = G(j, hbj), d = G(j, V[j].hg), e = G(i, V[i].hg);
      S('glow').quad(a, c, d, e, out3(mid(a, c, d, e), i));
    }
    if (V[i].st > 0.05 || V[j].st > 0.05) {
      const lo = inOpening(i) ? TUNNEL.height : 0;
      if (V[i].st > lo + 0.05 || V[j].st > lo + 0.05) {
        const a = R(i, lo), c = R(j, lo), d = R(j, Math.max(lo, V[j].st)), e = R(i, Math.max(lo, V[i].st));
        S('stone').quad(a, c, d, e, out3(mid(a, c, d, e), i));
      }
    }
    // The entrance plaza: stepped terraces rising from the facade line to the glazing.
    if (V[i].fl > 0.25 || V[j].fl > 0.25) {
      const inset = 0.6, Ox = (q) => V[q].x - V[q].nx * inset * V[q].m, Oz = (q) => V[q].z - V[q].nz * inset * V[q].m;
      const pos = (q, f, y) => [lerp(Ox(q), V[q].rx, f), y, lerp(Oz(q), V[q].rz, f)];
      const up = (c) => [c[0], c[1] + 10, c[2]];
      if (near) {
        for (let k = 0; k < 3; k++) {
          const f0 = k / 3, f1 = (k + 1) / 3;
          const ra = pos(i, f0, V[i].fl * f0), rb = pos(j, f0, V[j].fl * f0), rc = pos(j, f0, V[j].fl * f1), rd = pos(i, f0, V[i].fl * f1);
          S('stone').quad(ra, rb, rc, rd, out3(mid(ra, rb, rc, rd), i));
          const ta = pos(i, f0, V[i].fl * f1), tb = pos(j, f0, V[j].fl * f1), tc = pos(j, f1, V[j].fl * f1), td = pos(i, f1, V[i].fl * f1);
          S('stone').quad(ta, tb, tc, td, up(mid(ta, tb, tc, td)));
        }
      } else {
        const ta = pos(i, 0, 0), tb = pos(j, 0, 0), tc = pos(j, 1, V[j].fl), td = pos(i, 1, V[i].fl);
        S('stone').quad(ta, tb, tc, td, up(mid(ta, tb, tc, td)));
      }
    }
  }

  // Mullions: slim silver fins proud of the glazing, one per vertex of the recess line (near only).
  if (near) {
    for (let i = 0; i < N; i++) {
      if (!(segActive(i) && segActive(prv(i)))) continue;
      const y0 = Math.max(V[i].fl, V[i].st), y1 = V[i].hg;
      if (y1 - y0 < 0.8) continue;
      const a = V[prv(i)], c = V[nxt(i)], tl = Math.hypot(c.rx - a.rx, c.rz - a.rz);
      if (tl < 0.5) continue;
      const tx = (c.rx - a.rx) / tl, tz = (c.rz - a.rz) / tl, [nx, nz] = facing(i);
      const hw = 0.08, pr = 0.14;
      const pt = (side, out, y) => [V[i].rx + tx * hw * side + nx * pr * out, y, V[i].rz + tz * hw * side + nz * pr * out];
      const cen = [V[i].rx + nx * pr / 2, (y0 + y1) / 2, V[i].rz + nz * pr / 2];
      S('silver').quad(pt(-1, 1, y0), pt(1, 1, y0), pt(1, 1, y1), pt(-1, 1, y1), [cen[0] + nx * 5, cen[1], cen[2] + nz * 5]);
      S('silver').quad(pt(-1, 0, y0), pt(-1, 1, y0), pt(-1, 1, y1), pt(-1, 0, y1), [cen[0] - tx * 5, cen[1], cen[2] - tz * 5]);
      S('silver').quad(pt(1, 0, y0), pt(1, 1, y0), pt(1, 1, y1), pt(1, 0, y1), [cen[0] + tx * 5, cen[1], cen[2] + tz * 5]);
    }
  }

  // Reveals: the vertical ends of the recess where the arch meets the ground (and the lift ends on the east flank).
  for (let i = 0; i < N; i++) {
    if (!V[i].a) continue;
    const onNext = segActive(i), onPrev = segActive(prv(i));
    if (onNext && onPrev) continue;
    const j = onNext ? nxt(i) : prv(i);
    const D = Math.hypot(V[i].rx - V[i].x, V[i].rz - V[i].z);
    if (D < 0.05) continue;
    const poly = [[0, 0], [1, 0], [1, V[i].hg], ...[...rows].reverse().slice(1).map((f) => [f, V[i].he + V[i].rise * curve(f)])];
    const idx = THREE.ShapeUtils.triangulateShape(poly.map(([u, y]) => new THREE.Vector2(u * D, y)), []);
    const at = ([u, y]) => [lerp(V[i].x, V[i].rx, u), y, lerp(V[i].z, V[i].rz, u)];
    const c = at([0.5, V[i].hg / 2]), tx = V[j].x - V[i].x, tz = V[j].z - V[i].z, tl = Math.hypot(tx, tz);
    for (const [p, q, r] of idx) S('cedar').tri(at(poly[p]), at(poly[q]), at(poly[r]), [c[0] + tx / tl * 6, c[1], c[2] + tz / tl * 6]);
  }

  // Tunnel box behind the opening: dark walls, ceiling and end wall (the real tunnel runs on under the building).
  if (ia >= 0) {
    const [ex, ez] = PT, depth = TUNNEL.depth, h = TUNNEL.height;
    const A = [V[ia].rx, V[ia].rz], B = [V[ib].rx, V[ib].rz], A2 = [A[0] + ex * depth, A[1] + ez * depth], B2 = [B[0] + ex * depth, B[1] + ez * depth];
    const inside = [(A[0] + B[0] + A2[0] + B2[0]) / 4, h / 2, (A[1] + B[1] + A2[1] + B2[1]) / 4];
    const wallQuad = (p, q) => S('tunnel').quad([p[0], 0, p[1]], [q[0], 0, q[1]], [q[0], h, q[1]], [p[0], h, p[1]], inside);
    wallQuad(A, A2); wallQuad(B, B2); wallQuad(A2, B2);
    S('tunnel').quad([A[0], h, A[1]], [B[0], h, B[1]], [B2[0], h, B2[1]], [A2[0], h, A2[1]], [inside[0], 0, inside[2]]);
  }

  // ---------------------------------------------------------------- roof and oculus
  {
    const ux = OCULUS.axis[0], uz = OCULUS.axis[1], vx = uz, vz = -ux, M = near ? 40 : 20;
    const hole = Array.from({ length: M }, (_, i) => { const t = i / M * Math.PI * 2; return [OCULUS.c[0] + ux * OCULUS.a * Math.cos(t) + vx * OCULUS.b * Math.sin(t), OCULUS.c[1] + uz * OCULUS.a * Math.cos(t) + vz * OCULUS.b * Math.sin(t)]; });
    const contour = P.map((p) => [p.x - p.nx * PARAPET * p.m, p.z - p.nz * PARAPET * p.m]);
    // Parapet: a 0.4 m silver coping and its inner face, 0.3 m above the roof.
    for (let i = 0; i < N; i++) {
      const j = nxt(i), qa = contour[i], qb = contour[j];
      S('silver').quad(O(i, LID), O(j, LID), [qb[0], LID, qb[1]], [qa[0], LID, qa[1]], [V[i].x, 100, V[i].z]);
      const inner = [[qa[0], ROOF, qa[1]], [qb[0], ROOF, qb[1]], [qb[0], LID, qb[1]], [qa[0], LID, qa[1]]];
      S('panel').quad(...inner, [V[i].x - V[i].nx * 6, (ROOF + LID) / 2, V[i].z - V[i].nz * 6]);
    }
    const tris = THREE.ShapeUtils.triangulateShape(contour.map(([x, z]) => new THREE.Vector2(x, z)), [hole.map(([x, z]) => new THREE.Vector2(x, z))]);
    const all = [...contour, ...hole];
    for (const [p, q, r] of tris) S('roof').tri([all[p][0], ROOF, all[p][1]], [all[q][0], ROOF, all[q][1]], [all[r][0], ROOF, all[r][1]], [all[p][0], 100, all[p][1]]);
    for (let i = 0; i < M; i++) {
      const a = hole[i], c = hole[(i + 1) % M];
      S('silver').quad([a[0], ROOF, a[1]], [c[0], ROOF, c[1]], [c[0], LID, c[1]], [a[0], LID, a[1]], [(a[0] + c[0]) / 2 + (a[0] - OCULUS.c[0]) * 3, (ROOF + LID) / 2, (a[1] + c[1]) / 2 + (a[1] - OCULUS.c[1]) * 3]);
      S('glow').tri([OCULUS.c[0], LID, OCULUS.c[1]], [a[0], LID, a[1]], [c[0], LID, c[1]], [OCULUS.c[0], 100, OCULUS.c[1]]);
    }
  }

  // ---------------------------------------------------------------- the crystalline panels
  {
    const sharp = ring.corners.filter((s) => s > 0.1);
    const clusters = CLUSTERS.map(([id, plus, y, ss, sy, amp]) => ({ s: ring.anchor(id, plus), y, ss, sy, amp }));
    const density = (s, y) => {
      let dn = 0.045;
      for (const c of clusters) { const ds = Math.min(Math.abs(s - c.s), T - Math.abs(s - c.s)); dn += c.amp * Math.exp(-(ds * ds / (2 * c.ss * c.ss) + (y - c.y) ** 2 / (2 * c.sy * c.sy))); }
      return clamp(dn, 0, 0.97);
    };
    const lowAt = (s) => (act(s) ? HE(s) : 0);
    const W = Math.sqrt(3) * HEX, top = LID - 0.4, s0 = 0.37 * W;
    const g3 = (s, y, off) => { const q = ring.at(s); return [q.x + q.nx * off * q.m, y, q.z + q.nz * off * q.m]; };
    const OFF = { glass: 0.16, frit: 0.16, silver: 0.24 };
    const cells = [];
    for (let k = 0; ; k++) {
      const yc = top - HEX - k * 1.5 * HEX;
      if (yc - HEX < 0.2) break;
      for (let j = -1; j <= Math.ceil(T / W) + 1; j++) {
        const xc = s0 + (j + (k & 1) * 0.5) * W, w2 = W / 2;
        const v = [[0, HEX], [w2, HEX / 2], [w2, -HEX / 2], [0, -HEX], [-w2, -HEX / 2], [-w2, HEX / 2]].map(([du, dy]) => [xc + du, yc + dy]);
        const quads = [[[xc, yc], v[5], v[0], v[1]], [[xc, yc], v[1], v[2], v[3]], [[xc, yc], v[3], v[4], v[5]]];
        quads.forEach((q, r) => {
          const smin = Math.min(...q.map((p) => p[0])), smax = Math.max(...q.map((p) => p[0]));
          if (smin < 0.3 || smax > T - 0.3) return;
          if (sharp.some((c) => c > smin + 0.05 && c < smax - 0.05)) return;
          if (q.some(([s, y]) => y < lowAt(s) + 0.3 || y > top + 1e-6)) return;
          const cs = q.reduce((a, p) => a + p[0], 0) / 4, cy = q.reduce((a, p) => a + p[1], 0) / 4;
          let type = null;
          if (hash(k + 50, j + 50, r) < density(cs, cy)) type = hash(k + 50, j + 50, r + 7) < 0.33 ? 'frit' : 'glass';
          else if (near && hash(k + 50, j + 50, r + 13) < 0.24) type = 'silver';
          if (type) cells.push({ q, type, off: OFF[type] });
        });
      }
    }
    const key = (p, q) => { const a = `${Math.round(p[0] * 100)},${Math.round(p[1] * 100)}`, c = `${Math.round(q[0] * 100)},${Math.round(q[1] * 100)}`; return a < c ? `${a}|${c}` : `${c}|${a}`; };
    const edges = new Map();
    for (const cell of cells) for (let e = 0; e < 4; e++) { const kk = key(cell.q[e], cell.q[(e + 1) % 4]); if (!edges.has(kk)) edges.set(kk, []); edges.get(kk).push(cell); }
    for (const cell of cells) {
      const [a, c, d, e] = cell.q.map(([s, y]) => g3(s, y, cell.off));
      const centre = mid(a, c, d, e), n = ring.at(cell.q[0][0]);
      S(cell.type).quad(a, c, d, e, [centre[0] + n.nx * 10, centre[1], centre[2] + n.nz * 10]);
      if (!near) continue;
      for (let e2 = 0; e2 < 4; e2++) {
        const p = cell.q[e2], q = cell.q[(e2 + 1) % 4], others = edges.get(key(p, q)).filter((o) => o !== cell);
        const lo = others.length ? Math.max(...others.map((o) => o.off)) : 0;
        if (cell.off <= lo + 1e-6) continue;
        const bp = g3(p[0], p[1], lo), bq = g3(q[0], q[1], lo), tp = g3(p[0], p[1], cell.off), tq = g3(q[0], q[1], cell.off), sm = mid(bp, bq, tp, tq);
        S(cell.type).quad(bp, bq, tq, tp, [sm[0] + (sm[0] - centre[0]) * 5, sm[1] + (sm[1] - centre[1]) * 5, sm[2] + (sm[2] - centre[2]) * 5]);
      }
    }
  }

  for (const [m, s] of soups) if (!s.empty) b.put(s.geometry(), m);
  return b.finish();
}
