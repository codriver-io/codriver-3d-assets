import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, materialFor } from './config.js';
import { Soup, extrude } from './art-gallery-of-ontario-mesh.js';
import { PLAN, HULL, TEARS, LEVEL_M, ROT_DEG, pt, along, hullY } from './art-gallery-of-ontario-site.js';

const ROT = ROT_DEG * Math.PI / 180;
const dir = (du, dy, dv) => pt(du, dy, dv); // pt is linear: a site vector maps to a model vector

// Section normals of the Galleria's cross-section, in (v, y): outward is toward Dundas and up.
const secNormal = (dv, dy) => { const l = Math.hypot(dv, dy) || 1; return [-dy / l, dv / l]; };

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // Every material goes through the draw-budget fold (config.js FOLD): near is unchanged, far shares draws.
  const { put, box, bar } = b, fold = (m) => materialFor(m, detail);
  b.put = (g, m, ...rest) => put(g, fold(m), ...rest); b.box = (m, ...rest) => box(fold(m), ...rest); b.bar = (m, ...rest) => bar(fold(m), ...rest);
  const soups = {}, S = (m) => (soups[fold(m)] ??= new Soup());

  // Site-aligned box: (u, y, v) centre, (along Dundas, height, depth).
  const ubox = (m, u, y, v, du, h, dv) => b.box(m, pt(u, y, v), [du, h, dv], ROT);
  // Box laid along a site segment a -> b (metres in u/v), between two heights.
  const seg = (m, a, c, y0, y1, thick) => {
    const [ax, , az] = pt(a[0], 0, a[1]), [cx, , cz] = pt(c[0], 0, c[1]);
    const dx = cx - ax, dz = cz - az, len = Math.hypot(dx, dz);
    if (len < 1e-3) return;
    b.box(m, [(ax + cx) / 2, (y0 + y1) / 2, (az + cz) / 2], [len, y1 - y0, thick], Math.atan2(-dz, dx));
  };

  // Rectangular tube swept along `path` (model points). frames[i] = { B, N } unit vectors;
  // the profile is [aMin, aMax] along B and [bMin, bMax] along N.
  function sweep(soup, path, frames, a0, a1, b0, b1) {
    const corner = (i, a, bb) => [path[i][0] + frames[i].B[0] * a + frames[i].N[0] * bb, path[i][1] + frames[i].B[1] * a + frames[i].N[1] * bb, path[i][2] + frames[i].B[2] * a + frames[i].N[2] * bb];
    const prof = [[a0, b0], [a1, b0], [a1, b1], [a0, b1]];
    for (let i = 0; i < path.length - 1; i++) {
      for (let k = 0; k < 4; k++) {
        const [pa, pb] = prof[k], [qa, qb] = prof[(k + 1) % 4], f = frames[i];
        const hint = [f.B[0] * (pa + qa) / 2 + f.N[0] * (pb + qb) / 2, f.B[1] * (pa + qa) / 2 + f.N[1] * (pb + qb) / 2, f.B[2] * (pa + qa) / 2 + f.N[2] * (pb + qb) / 2];
        soup.quad(corner(i, pa, pb), corner(i + 1, pa, pb), corner(i + 1, qa, qb), corner(i, qa, qb), hint);
      }
    }
  }

  // ------------------------------------------------------------------ masses
  const H = { west: 5 * LEVEL_M, central: 6 * LEVEL_M, ring: 4 * LEVEL_M, east: 4 * LEVEL_M, brick: 3 * LEVEL_M, base: 12, sliver: 4 * LEVEL_M };
  const wallBy = (rule) => (mu, mv, i, len) => S(rule(mu, mv, i, len));
  const precast = () => 'precast';
  const MASSES = [];
  const mass = (poly, y0, y1, walls = precast, top = 'roof') => { MASSES.push({ poly, y1, walls }); extrude(poly, y0, y1, pt, wallBy(walls), S(top)); };
  mass(PLAN.WEST_WING, 0, H.west);
  mass(PLAN.CENTRAL, 0, H.central);
  mass(PLAN.RING, 0, H.ring);
  mass(PLAN.EAST_WING, 0, H.east);
  mass(PLAN.SLIVER_W, 0, H.sliver);
  mass(PLAN.SLIVER_E, 0, H.sliver);
  mass(PLAN.BRICK, 0, H.brick, () => 'brick');
  mass(PLAN.BASE_BLUE, 0, H.base, (mu, mv) => (mv > 40 ? 'brick' : 'precast'));
  // Storey reveals on walls that face the street or the park: a wall that another mass covers gets none.
  const inside = (poly, u, v) => { let c2 = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [ax, ay] = poly[j], [bx, by] = poly[i]; if ((ay > v) !== (by > v) && u < (bx - ax) * (v - ay) / (by - ay) + ax) c2 = !c2; } return c2; };
  const hullPoly = [...HULL.front, ...[...HULL.back].reverse()];
  function reveals(mass2) {
    const { poly, y1 } = mass2;
    let area = 0; for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; area += p[0] * q[1] - q[0] * p[1]; }
    const sg = area > 0 ? 1 : -1;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], c2 = poly[(i + 1) % poly.length], len = Math.hypot(c2[0] - a[0], c2[1] - a[1]);
      if (len < 6) continue;
      const nu = sg * (c2[1] - a[1]) / len, nv = -sg * (c2[0] - a[0]) / len, mu = (a[0] + c2[0]) / 2 + nu * 0.5, mv = (a[1] + c2[1]) / 2 + nv * 0.5;
      let covered = inside(hullPoly, mu, mv) ? 20 : 0;
      for (const o of MASSES) if (o !== mass2 && inside(o.poly, mu, mv)) covered = Math.max(covered, o.y1);
      const out2 = dir(nu, 0, nv);
      for (let y = LEVEL_M; y < y1 - 0.5; y += LEVEL_M) {
        if (y < covered) continue;
        S('roof').quad(pt(a[0] + nu * 0.06, y, a[1] + nv * 0.06), pt(c2[0] + nu * 0.06, y, c2[1] + nv * 0.06), pt(c2[0] + nu * 0.06, y + 0.14, c2[1] + nv * 0.06), pt(a[0] + nu * 0.06, y + 0.14, a[1] + nv * 0.06), out2);
      }
    }
  }
  if (near) MASSES.slice().forEach(reveals);

  // Roof plant: white mechanical boxes on the central roof and on the titanium box.
  const plant = (u, v, du, dv, h, y) => ubox('paint', u, y + h / 2, v, du, h, dv);
  for (const [u, v, du, dv, y] of [[24, 34, 8, 6, H.central], [29, 43, 6, 5, H.central], [-60, 8, 9, 5, H.central], [-63, 40, 6, 6, H.central], [56, -9, 8, 4, H.east]]) plant(u, v, du, dv, 2.6, y);
  // (The three white boxes on the titanium roof are placed with the box, below.)

  // ------------------------------------------------------------- Galleria hull
  const { u0, u1, beltY0, beltY1, ribs } = HULL;
  const bay = (u1 - u0) / ribs;
  const vf = (u) => along(HULL.front, u), vb = (u) => along(HULL.back, u);
  const out = dir(0, 0, -1); // toward Dundas, in model space
  const hint = [out[0], 1.4, out[2]];
  // Station table: one per rib bay edge.
  const stations = Array.from({ length: ribs + 1 }, (_, i) => u0 + i * bay);
  const tRows = near ? [0, 0.05, 0.11, 0.19, 0.28, 0.38, 0.49, 0.61, 0.74, 0.87, 1] : [0, 0.12, 0.3, 0.55, 1];
  const surf = (u, t) => pt(u, hullY(t), vf(u) + t * (vb(u) - vf(u)));

  // The ribbed glass. Station columns share the rib bays so ribs sit on the seams.
  S('glow').grid(tRows.map((t) => stations.map((u) => surf(u, t))), hint);

  // Glued-laminated Douglas-fir ribs: 47 arches (16 in the far LOD), from the belt up over the ridge.
  const ribStep = near ? 1 : 3, ribsAt = [];
  for (let i = 0; i < ribs; i += ribStep) ribsAt.push(u0 + (i + 0.5) * bay);
  ribsAt.push(u0 + 0.02, u1 - 0.02); // the end arches frame the glazed ends
  const ribT = near ? [0.03, 0.09, 0.16, 0.25, 0.35, 0.47, 0.6, 0.74, 0.88, 1] : [0.1, 0.35, 0.65, 1];
  for (const u of ribsAt) {
    const f = vf(u), w = vb(u) - f;
    const pts = [[f, beltY0 + 0.15], [f, (beltY0 + beltY1) / 2], [f, beltY1], ...ribT.map((t) => [f + t * w, hullY(t)])];
    const path = pts.map(([v, y]) => pt(u, y, v)), frames = pts.map((_, i) => {
      const p = pts[Math.max(0, i - 1)], q = pts[Math.min(pts.length - 1, i + 1)], n = secNormal(q[0] - p[0], q[1] - p[1]);
      return { B: dir(1, 0, 0), N: dir(0, n[1], n[0]) };
    });
    sweep(S('timber'), path, frames, near ? -0.16 : -0.3, near ? 0.16 : 0.3, -0.18, near ? 0.36 : 0.5);
  }
  // Secondary grid: horizontal timber purlins that follow the surface.
  if (near) {
    for (const t of [0.05, 0.13, 0.22, 0.32, 0.43, 0.55, 0.68, 0.81, 0.93]) {
      const path = stations.map((u) => surf(u, t)), frames = stations.map((u) => {
        const w = vb(u) - vf(u), dt = 0.02, a = [vf(u) + (t - dt) * w, hullY(t - dt)], c2 = [vf(u) + (t + dt) * w, hullY(Math.min(1, t + dt))];
        const n = secNormal(c2[0] - a[0], c2[1] - a[1]), tg = [c2[0] - a[0], c2[1] - a[1]], l = Math.hypot(...tg);
        return { B: dir(0, tg[1] / l, tg[0] / l), N: dir(0, n[1], n[0]) };
      });
      sweep(S('timber'), path, frames, -0.11, 0.11, -0.05, 0.24);
    }
  }

  // Glass belt under the ribs (lit lower gallery level) and the podium it overhangs.
  const belt = stations.map((u) => [u, vf(u)]);
  for (let i = 0; i < belt.length - 1; i++) {
    const [ua, va] = belt[i], [ub, vb2] = belt[i + 1];
    S('light').quad(pt(ua, beltY0, va), pt(ub, beltY0, vb2), pt(ub, beltY1, vb2), pt(ua, beltY1, va), out);
    // podium (ground floor): dark glazing recessed under the overhang, stone soffit above the arcade
    const r = 2.4;
    S('glass').quad(pt(ua, 0, va + r), pt(ub, 0, vb2 + r), pt(ub, beltY0, vb2 + r), pt(ua, beltY0, va + r), out);
    S('metal').quad(pt(ua, beltY0, va), pt(ub, beltY0, vb2), pt(ub, beltY0, vb2 + r), pt(ua, beltY0, va + r), [0, -1, 0]);
    S('precast').quad(pt(ua, beltY0, vb(ua)), pt(ub, beltY0, vb(ub)), pt(ub, HULL.ridgeY, vb(ub)), pt(ua, HULL.ridgeY, vb(ua)), dir(0, 0, 1)); // hull back wall
  }
  // Belt mullions, rails and podium piers.
  const beltPost = (u) => {
    const f = vf(u); ubox('metal', u, (beltY0 + beltY1) / 2, f - 0.12, near ? 0.18 : 0.4, beltY1 - beltY0, 0.3);
  };
  for (let i = 0; i < ribs; i += near ? 1 : 3) beltPost(u0 + (i + 0.5) * bay);
  for (const y of near ? [beltY0 + 0.1, 7, beltY1 - 0.1] : [beltY0 + 0.1, beltY1 - 0.1]) {
    const path = stations.map((u) => pt(u, y, vf(u) - 0.12)), frames = stations.map(() => ({ B: [0, 1, 0], N: out }));
    sweep(S('metal'), path, frames, -0.12, 0.12, -0.1, 0.2);
  }
  const pierEvery = 6.5;
  for (let u = u0 + 3.2; u < u1 - 2; u += pierEvery) ubox('stone', u, beltY0 / 2, vf(u) + 1.4, 1.5, beltY0, 2.0);
  // Ends: glazed like the rest of the hull (ribbed glass over the lit belt), framed by an end arch
  // and transoms in timber, so the ribs read as running through; the podium's stone end stays solid.
  const tOf = (y) => 1 - Math.pow(1 - (y - beltY1) / 10, 1 / 2.6);
  for (const [u, side] of [[u0, -1], [u1, 1]]) {
    const f = vf(u), w = vb(u) - f, end = dir(side, 0, 0);
    S('glow').cap([[f, beltY1], ...tRows.filter((t) => t > 0).map((t) => [f + t * w, hullY(t)]), [f + w, beltY1]].map(([v, y]) => pt(u, y, v)), end);
    S('light').cap([[f, beltY0], [f, beltY1], [f + w, beltY1], [f + w, beltY0]].map(([v, y]) => pt(u, y, v)), end);
    S('stone').cap([[f + 2.4, 0], [f + w, 0], [f + w, beltY0], [f + 2.4, beltY0]].map(([v, y]) => pt(u, y, v)), end);
    if (near) {
      for (const y of [11.6, 14, 16.4, 18.6]) b.bar('timber', pt(u + side * 0.05, y, f + tOf(y) * w), pt(u + side * 0.05, y, f + w), 0.16, 0.22);
      for (const v of [f + 0.33 * w, f + 0.66 * w]) b.bar('timber', pt(u + side * 0.05, beltY0 + 0.1, v), pt(u + side * 0.05, hullY((v - f) / w) - 0.1, v), 0.14, 0.2);
    }
  }

  // ----------------------------------------------------------- the two tears
  // Glass ribbon that peels away from each end of the hull: a framed sail with
  // timber diagonals, taller than the hull. Resampled to about 3.4 m bays.
  function sail(path, y0, y1) {
    const pts = [path[0]];
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1], c2 = path[i], n = Math.max(1, Math.round(Math.hypot(c2[0] - a[0], c2[1] - a[1]) / 3.4));
      for (let k = 1; k <= n; k++) pts.push([a[0] + (c2[0] - a[0]) * k / n, a[1] + (c2[1] - a[1]) * k / n]);
    }
    // Outward (Dundas-facing) normal at every vertex, averaged over its two segments so the skirt has no wedge gaps.
    const seg2n = (i) => { const du = pts[i + 1][0] - pts[i][0], dv = pts[i + 1][1] - pts[i][1], l = Math.hypot(du, dv); let nu = dv / l, nv = -du / l; if (nv > 0) { nu = -nu; nv = -nv; } return [nu, nv]; };
    const vn = pts.map((_, i) => { const a = seg2n(Math.max(0, i - 1)), c2 = seg2n(Math.min(pts.length - 2, i)), u = a[0] + c2[0], v = a[1] + c2[1], l = Math.hypot(u, v) || 1; return [u / l, v / l]; });
    for (let i = 0; i < pts.length - 1; i++) {
      const A = pts[i], B = pts[i + 1], [nu, nv] = seg2n(i);
      const outward = dir(nu, 0, nv), inward = dir(-nu, 0, -nv);
      const a0 = pt(A[0], y0, A[1]), a1 = pt(A[0], y1, A[1]), c0 = pt(B[0], y0, B[1]), c1 = pt(B[0], y1, B[1]);
      S('glow').quad(a0, c0, c1, a1, outward); S('glow').quad(a0, c0, c1, a1, inward);
      // The tilted glass skirt that projects from the sail's foot over the pavement.
      const k = 2.2, s0 = pt(A[0] + vn[i][0] * k, y0 - 2.8, A[1] + vn[i][1] * k), s1 = pt(B[0] + vn[i + 1][0] * k, y0 - 2.8, B[1] + vn[i + 1][1] * k);
      S('glass').quad(a0, c0, s1, s0, [outward[0], 0.6, outward[2]]);
      S('metal').quad(a0, c0, s1, s0, [inward[0], -0.6, inward[2]]);
      if (near) {
        const H2 = y1 - y0;
        b.bar('timber', a0, c1, 0.15, 0.34); b.bar('timber', a1, c0, 0.15, 0.34);
        for (const kk of [1, 2]) seg('metal', A, B, y0 + H2 * kk / 3 - 0.09, y0 + H2 * kk / 3 + 0.09, 0.32);
        b.bar('metal', s0, s1, 0.16, 0.16);
      } else if (i % 2 === 0) {
        b.bar('timber', a0, c1, 0.32, 0.5);
      }
    }
    for (const P of pts) b.box('metal', pt(P[0], (y0 + y1) / 2, P[1]), [near ? 0.2 : 0.4, y1 - y0, near ? 0.36 : 0.5], ROT);
    for (const y of [y0, y1]) for (let i = 0; i < pts.length - 1; i++) seg('metal', pts[i], pts[i + 1], y - 0.13, y + 0.13, near ? 0.34 : 0.5);
  }
  sail(TEARS.west, 10, 25);
  sail(TEARS.east, 10, 26);

  // ----------------------------------------------------------- blue titanium box
  const BOX = { y0: 12, y1: 38 };
  const hash = (a, c2) => { let h = Math.imul(a * 73856093 ^ c2 * 19349663, 83492791); h ^= h >>> 13; h = Math.imul(h, 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const winSouth = (a, c2) => Math.abs(a[1] - 49.1) < 0.05 && Math.abs(c2[1] - 49.1) < 0.05 && Math.abs(a[0] - c2[0]) > 20;
  // Walls in a patchwork of bright and deep titanium panels (near) or one tone (far).
  const panelWalls = (poly) => {
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], c2 = poly[(i + 1) % poly.length], len = Math.hypot(c2[0] - a[0], c2[1] - a[1]);
      if (len < 0.05 || winSouth(a, c2)) continue;
      const cols = near ? Math.max(1, Math.round(len / 3.3)) : 1, rows = near ? 10 : 1;
      let area = 0; for (let k = 0; k < poly.length; k++) { const p = poly[k], q = poly[(k + 1) % poly.length]; area += p[0] * q[1] - q[0] * p[1]; }
      const sgn = area > 0 ? 1 : -1, o2 = dir(sgn * (c2[1] - a[1]) / len, 0, -sgn * (c2[0] - a[0]) / len);
      for (let cI = 0; cI < cols; cI++) for (let r = 0; r < rows; r++) {
        const k0 = cI / cols, k1 = (cI + 1) / cols, y0 = BOX.y0 + (BOX.y1 - BOX.y0) * r / rows, y1 = BOX.y0 + (BOX.y1 - BOX.y0) * (r + 1) / rows;
        const p0 = [a[0] + (c2[0] - a[0]) * k0, a[1] + (c2[1] - a[1]) * k0], p1 = [a[0] + (c2[0] - a[0]) * k1, a[1] + (c2[1] - a[1]) * k1];
        const mat = near && hash(i * 31 + cI, r) < 0.3 ? 'titaniumDeep' : 'titanium';
        S(mat).quad(pt(p0[0], y0, p0[1]), pt(p1[0], y0, p1[1]), pt(p1[0], y1, p1[1]), pt(p0[0], y1, p0[1]), o2);
      }
    }
  };
  panelWalls(PLAN.BLUE_BOX);
  extrude(PLAN.BLUE_BOX, BOX.y0, BOX.y1, pt, () => null, S('roof'));
  // The recessed window is stepped (photo: Art_Gallery_of_Ontario_overlooking_Grange): full width from 21.4 to 35 m,
  // then a narrower step down to 15 m. Blue corner blocks flush with the face fill what the step leaves.
  const wu0 = -27.4, wu1 = 0.4, wv = 49.1, fv = 50.1, stepY = 21.4, su0 = wu0 + 3.3, su1 = wu1 - 3.3;
  S('titanium').quad(pt(wu0, 12, fv), pt(wu1, 12, fv), pt(wu1, 15, fv), pt(wu0, 15, fv), dir(0, 0, 1));
  S('titanium').quad(pt(wu0, 35, fv), pt(wu1, 35, fv), pt(wu1, 38, fv), pt(wu0, 38, fv), dir(0, 0, 1));
  S('titaniumDeep').quad(pt(wu0, 15, wv), pt(wu1, 15, wv), pt(wu1, 15, fv), pt(wu0, 15, fv), [0, 1, 0]);
  S('titaniumDeep').quad(pt(wu0, 35, wv), pt(wu1, 35, wv), pt(wu1, 35, fv), pt(wu0, 35, fv), [0, -1, 0]);
  S('glass').quad(pt(wu0, stepY, wv), pt(wu1, stepY, wv), pt(wu1, 35, wv), pt(wu0, 35, wv), dir(0, 0, 1));
  S('glass').quad(pt(su0, 15, wv), pt(su1, 15, wv), pt(su1, stepY, wv), pt(su0, stepY, wv), dir(0, 0, 1));
  for (const [a, c2, inward] of [[wu0, su0, 1], [su1, wu1, -1]]) {
    S('titanium').quad(pt(a, 15, fv), pt(c2, 15, fv), pt(c2, stepY, fv), pt(a, stepY, fv), dir(0, 0, 1));   // corner block, flush with the face
    S('titaniumDeep').quad(pt(a, stepY, wv), pt(c2, stepY, wv), pt(c2, stepY, fv), pt(a, stepY, fv), [0, 1, 0]); // its top, under the big window
    S('titaniumDeep').quad(pt(inward > 0 ? c2 : su1, 15, wv), pt(inward > 0 ? c2 : su1, 15, fv), pt(inward > 0 ? c2 : su1, stepY, fv), pt(inward > 0 ? c2 : su1, stepY, wv), [inward, 0, 0]); // reveal
  }
  if (near) {
    for (let u = wu0 + 2.3; u < wu1 - 1; u += 2.3) { const low = u > su0 && u < su1, y0 = low ? 15 : stepY; ubox('metal', u, (y0 + 35) / 2, wv + 0.08, 0.14, 35 - y0, 0.16); }
    for (const y of [24.9, 28.2, 31.5, stepY + 0.05]) ubox('metal', (wu0 + wu1) / 2, y, wv + 0.08, wu1 - wu0, 0.13, 0.16);
    ubox('metal', (su0 + su1) / 2, 18.3, wv + 0.08, su1 - su0, 0.13, 0.16);
  }
  // The spiral stair: one connected helical flight, two turns that leave the window low on the left, sweep
  // out and round in front of the glass and climb 10 m. Stainless-steel skin, a glass ribbon inside a steel
  // roof lip, an inner glass wall and a broad steel underside, all swept along the same helix so the pods
  // and the ramps between them are one form. Where the helix passes behind the glass it is left out.
  {
    const uc = -22, vc = wv + 2.1, R = 3.8, y0 = 21.0, rise = 10.6, a0 = -0.75 * Math.PI, aN = 2.75 * Math.PI, n = near ? 36 : 16;
    const arcs = [[a0, 0.75 * Math.PI], [1.25 * Math.PI, aN]];
    for (const [from, to] of arcs) {
      const path = [], frames = [];
      for (let i = 0; i <= n; i++) {
        const a = from + (to - from) * i / n, rad = R * (1 - 0.1 * Math.cos(a * 0.9)), y = y0 + rise * (a - a0) / (aN - a0);
        path.push(pt(uc + rad * Math.sin(a), y, vc + rad * Math.cos(a)));
        frames.push({ B: [0, 1, 0], N: dir(Math.sin(a), 0, Math.cos(a)) });
      }
      sweep(S('metal'), path, frames, 0, 1.6, -0.2, 0.2);        // outer skin
      sweep(S('glass'), path, frames, 1.6, 3.3, -0.14, 0.08);    // glass ribbon
      sweep(S('metal'), path, frames, 3.3, 3.6, -2.0, 0.4);      // roof lip
      sweep(S('metal'), path, frames, -0.55, 0, -2.0, 0.2);      // underside of the flight
      if (near) sweep(S('glass'), path, frames, 0, 3.3, -2.05, -1.9); // inner wall
    }
  }
  // Rooftop plant on the box: three white boxes along the north edge.
  for (const u of [-33, -13, 7]) plant(u, 28, 8.5, 6, 3.5, BOX.y1);

  // --------------------------------------------------------- Walker Court roof
  const [cu0, cu1, cv0, cv1] = [-28.15, 1.15, -1.75, 24.2], ridge = 18, eave = H.ring, um = (cu0 + cu1) / 2;
  S('glass').quad(pt(cu0, eave, cv0), pt(cu0, eave, cv1), pt(um, ridge, cv1), pt(um, ridge, cv0), [0, 1, 0]);
  S('glass').quad(pt(cu1, eave, cv0), pt(cu1, eave, cv1), pt(um, ridge, cv1), pt(um, ridge, cv0), [0, 1, 0]);
  if (near) {
    for (let v = cv0 + 0.5; v <= cv1 - 0.4; v += 3.6) {
      b.bar('metal', pt(cu0, eave, v), pt(um, ridge, v), 0.22, 0.3); b.bar('metal', pt(cu1, eave, v), pt(um, ridge, v), 0.22, 0.3);
    }
    b.bar('metal', pt(um, ridge + 0.1, cv0), pt(um, ridge + 0.1, cv1), 0.3, 0.3);
  }

  // ------------------------------------------------------------------ The Grange
  const G = PLAN.GRANGE_MAIN, gu0 = -16.8, gu1 = 3, gv0 = 51, gv1 = 65.05, eaveG = 7, ridgeG = 10;
  extrude(G, 0, eaveG, pt, () => S('brick'), null);
  extrude(PLAN.GRANGE_WEST, 0, eaveG, pt, () => S('brick'), S('roof'));
  const hipRun = (gv1 - gv0) / 2, ridgeU0 = gu0 + hipRun, ridgeU1 = gu1 - hipRun, mid = (gv0 + gv1) / 2;
  const R0 = pt(ridgeU0, ridgeG, mid), R1 = pt(ridgeU1, ridgeG, mid);
  const g = (u, v) => pt(u, eaveG, v);
  S('roof').tri(g(gu0, gv0), g(gu0, gv1), R0, [0, 1, 0]);
  S('roof').tri(g(gu1, gv1), g(gu1, gv0), R1, [0, 1, 0]);
  S('roof').quad(g(gu0, gv0), g(gu1, gv0), R1, R0, [0, 1, 0]);
  S('roof').quad(g(gu1, gv1), g(gu0, gv1), R0, R1, [0, 1, 0]);
  ubox('brick', gu0 + 3.2, ridgeG + 0.6, mid, 1.1, 2.4, 1.4); ubox('brick', gu1 - 3.2, ridgeG + 0.6, mid, 1.1, 2.4, 1.4);
  // Portico on the Grange Park front: four columns under a pediment.
  const pu = -6.9, pv = 66.4;
  ubox('stone', pu, 0.3, pv, 7.6, 0.6, 3.8);
  for (const du of [-2.6, -0.87, 0.87, 2.6]) b.bar('stone', pt(pu + du, 0.6, pv + 0.8), pt(pu + du, 4.4, pv + 0.8), 0.28, 0.28, 0, true);
  ubox('stone', pu, 4.75, pv, 7.2, 0.7, 3.4);
  // Pediment: two triangular faces and two sloped stone soffits.
  const pedA = [pt(pu - 3.6, 5.1, pv + 1.7), pt(pu + 3.6, 5.1, pv + 1.7), pt(pu, 6.6, pv + 1.7)], pedB = [pt(pu - 3.6, 5.1, pv - 1.7), pt(pu + 3.6, 5.1, pv - 1.7), pt(pu, 6.6, pv - 1.7)];
  S('stone').tri(...pedA, dir(0, 0, 1)); S('stone').tri(...pedB, dir(0, 0, -1));
  S('roof').quad(pedA[0], pedB[0], pedB[2], pedA[2], [-0.4, 1, 0]); S('roof').quad(pedA[1], pedB[1], pedB[2], pedA[2], [0.4, 1, 0]);
  if (near) {
    for (const y of [1.2, 4.2]) for (let k = 0; k < 5; k++) { const u = gu0 + 2.2 + k * 3.7; if (Math.abs(u - pu) < 1.2) continue; ubox('glass', u, y + 1, gv1 + 0.06, 1.1, 1.9, 0.14); }
  }

  for (const [m, soup] of Object.entries(soups)) b.put(soup.geometry(), m);
  return b.finish();
}
