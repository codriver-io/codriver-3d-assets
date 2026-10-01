import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  THETA, ROOF_Y, SOFFIT_Y, TOP_Y, OUTLINE, FRONT_V, HOLES, RECESS, TOWER_QUADS, OBSERVATION_QUAD, CAP_QUAD,
  TOWER_TRUNK_TOP, TOWER_GLASS_TOP,
} from './de-young-museum-site.js';
import { Soup, inPoly, triangulate, hash } from './de-young-museum-mesh.js';

const RECESS_V = FRONT_V - RECESS.depth;
const TOWER_BASE = { u0: 62.9, u1: 72.3, v0: -37.9, v1: -9.8 }; // the first tower slab sits on the roof here
const PANEL_OFF = 0.15, GLASS_OFF = 0.2; // large surfaces: stand-offs of at least 0.15 m (contract)
const isSolid = (u, v) => inPoly([u, v], OUTLINE) && !HOLES.some((h) => inPoly([u, v], h)) && !(u > RECESS.u0 && u < RECESS.u1 && v > RECESS_V);
const lerp2 = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add3 = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const unit = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

/**
 * de Young Museum, Golden Gate Park, in metres: +X east, +Y up, +Z south, origin = the museum's outline centroid,
 * y = 0 the plaza/garden level. Authoring only (exporter, inspector, tests); never the map.
 *
 * The plan is authored in the building frame (u along the museum, v across it) and rotated once by THETA, so the
 * orientation on the mapped footprint is baked in.
 * near: the copper skin as bays of near-uniform mauve-brown (tone varies about 8% per bay), a fully glazed, mullioned ground floor recessed under the cantilever with a dark fascia lip, courtyard
 * glazing, slit windows; the tower as a finely subdivided loft with storey ribs, stair flights, a mullioned glazed
 * level and a deep lid.
 * far: same silhouette and negative space (courtyards, soffit, lip, tower twist in storey bands, glazed level, lid).
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const soups = new Map();
  const S = (m) => { if (!soups.has(m)) soups.set(m, new Soup()); return soups.get(m); };
  const dark = near ? 'soffit' : 'copperDark'; // far folds the soffit into the dark copper (draw budget)

  // ------------------------------------------------------------------ facades (vertical walls on the plan)
  const facades = [];
  const addFacade = (a, bb, y0, y1, kind) => {
    const len = Math.hypot(bb[0] - a[0], bb[1] - a[1]);
    if (len < 0.4) return;
    const e = [(bb[0] - a[0]) / len, (bb[1] - a[1]) / len];
    let n = [e[1], -e[0]];
    const mid = [(a[0] + bb[0]) / 2, (a[1] + bb[1]) / 2];
    if (isSolid(mid[0] + n[0] * 0.4, mid[1] + n[1] * 0.4)) n = [-n[0], -n[1]]; // outward = towards the empty side
    facades.push({ a, b: bb, y0, y1, len, e, n, kind, glass: [] });
  };
  OUTLINE.forEach((a, i) => {
    const bb = OUTLINE[(i + 1) % OUTLINE.length];
    if (a[1] === FRONT_V && bb[1] === FRONT_V) { // the entrance front: flush ends, upper volume over the recessed glazed ground floor
      addFacade(a, [RECESS.u1, FRONT_V], 0, ROOF_Y, 'front');
      addFacade([RECESS.u1, FRONT_V], [RECESS.u0, FRONT_V], SOFFIT_Y, ROOF_Y, 'overhang');
      addFacade([RECESS.u0, FRONT_V], bb, 0, ROOF_Y, 'frontLeft');
    } else addFacade(a, bb, 0, ROOF_Y, i === 0 ? 'nw' : 'end');
  });
  addFacade([RECESS.u1, FRONT_V], [RECESS.u1, RECESS_V], 0, SOFFIT_Y, 'return');
  addFacade([RECESS.u1, RECESS_V], [RECESS.u0, RECESS_V], 0, SOFFIT_Y, 'recessBack');
  addFacade([RECESS.u0, RECESS_V], [RECESS.u0, FRONT_V], 0, SOFFIT_Y, 'return');
  HOLES.forEach((h) => h.forEach((a, i) => addFacade(a, h[(i + 1) % h.length], 0, ROOF_Y, 'court')));

  // glazing, in (s along the facade from its first point, y) ranges
  const BACK_Y0 = 0.2, BACK_Y1 = 5.6, MULLION = 3.4;
  for (const f of facades) {
    if (f.kind === 'recessBack') { // s runs from u = 60 towards u = -58: dark glass wall, lit doors and cafe window in it
      const end = f.len - 0.8;
      f.glass.push({ s0: 0.8, s1: 2, y0: BACK_Y0, y1: BACK_Y1, m: 'glass' });
      f.glass.push({ s0: 2, s1: 20, y0: BACK_Y0, y1: BACK_Y1, m: 'glow' });    // the cafe window, u 40 .. 58
      f.glass.push({ s0: 20, s1: 63, y0: BACK_Y0, y1: BACK_Y1, m: 'glass' });
      f.glass.push({ s0: 63, s1: 77, y0: 0, y1: BACK_Y1, m: 'glow' });          // the entrance doors, u -17 .. -3
      f.glass.push({ s0: 77, s1: end, y0: BACK_Y0, y1: BACK_Y1, m: 'glass' }); // the long storefront, u -17 .. -57
    } else if (f.kind === 'frontLeft') f.glass.push({ s0: 10, s1: 12, y0: 3, y1: 11.5, m: 'glass' }); // tall slit window at the south-west end
    else if (f.kind === 'nw') f.glass.push({ s0: 52.5, s1: 66.5, y0: 0, y1: 5.2, m: 'glass' }); // north-west entrance portal
    else if (f.kind === 'court' && f.len > 6) f.glass.push({ s0: f.len * 0.08, s1: f.len * 0.92, y0: 0.3, y1: 4.4, m: 'glass' });
  }

  const wall = (f) => {
    const mid = [(f.a[0] + f.b[0]) / 2, (f.y0 + f.y1) / 2, (f.a[1] + f.b[1]) / 2];
    S('copperDark').quad([f.a[0], f.y0, f.a[1]], [f.b[0], f.y0, f.b[1]], [f.b[0], f.y1, f.b[1]], [f.a[0], f.y1, f.a[1]], [mid[0] + f.n[0] * 5, mid[1], mid[2] + f.n[1] * 5]);
  };
  // a flat rectangle on a facade: s0..s1 along it, y0..y1, standing `off` out from the wall
  const onFacade = (f, s0, s1, y0, y1, off, mat) => {
    const p = (s, y) => [f.a[0] + f.e[0] * s + f.n[0] * off, y, f.a[1] + f.e[1] * s + f.n[1] * off];
    S(mat).quad(p(s0, y0), p(s1, y0), p(s1, y1), p(s0, y1), [(p(s0, y0)[0] + p(s1, y1)[0]) / 2 + f.n[0] * 5, (y0 + y1) / 2, (p(s0, y0)[2] + p(s1, y1)[2]) / 2 + f.n[1] * 5]);
  };
  // a thin post standing on a facade (front face and both sides), s centre, width w, depth d, from the wall out
  const post = (f, s, y0, y1, w, off, d, mat) => {
    const P = (ss, y, o) => [f.a[0] + f.e[0] * ss + f.n[0] * o, y, f.a[1] + f.e[1] * ss + f.n[1] * o];
    const so = (ss, o) => [f.a[0] + f.e[0] * ss + f.n[0] * o, (y0 + y1) / 2, f.a[1] + f.e[1] * ss + f.n[1] * o];
    const a = s - w / 2, c = s + w / 2;
    S(mat).quad(P(a, y0, off + d), P(c, y0, off + d), P(c, y1, off + d), P(a, y1, off + d), so(s, off + d + 5));
    S(mat).quad(P(a, y0, off), P(a, y0, off + d), P(a, y1, off + d), P(a, y1, off), so(s - 5, off));
    S(mat).quad(P(c, y0, off), P(c, y0, off + d), P(c, y1, off + d), P(c, y1, off), so(s + 5, off));
  };
  facades.forEach((f, fi) => {
    wall(f);
    for (const g of f.glass) if (near || g.s1 - g.s0 > 5 && f.kind !== 'court') onFacade(f, g.s0, g.s1, g.y0, g.y1, GLASS_OFF, g.m);
    if (f.kind === 'recessBack') {
      if (near) for (let s = 0.8; s < f.len - 0.7; s += MULLION) post(f, s, BACK_Y0, BACK_Y1, 0.3, GLASS_OFF, 0.3, 'copperDark');
      if (near) onFacade(f, 0.8, f.len - 0.8, 4.35, 4.6, GLASS_OFF + 0.12, 'copperDark'); // a transom over the doors
      return; // the wall behind the glass is not seen
    }
    if (f.len < 1.5) return;
    // The perforated, dimpled copper: bays whose tone varies about 8% from one to the next (a mauve-brown, nearly
    // uniform at a distance), each bay a joint-lined group of tiles. Flat quads off the wall.
    const bays = Math.max(1, Math.round(f.len / (near ? 6.8 : 11))), bands = Math.max(1, Math.round((f.y1 - f.y0) / 6.5)), per = near ? 2 : 1;
    const cols = bays * per, rows = bands * per, cw = f.len / cols, ch = (f.y1 - f.y0) / rows;
    const off = near ? PANEL_OFF : 0.3, gap = near ? 0.06 : 0.15;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const s0 = i * cw, s1 = s0 + cw, y0 = f.y0 + j * ch, y1 = y0 + ch;
      if (f.glass.some((g) => s1 > g.s0 && s0 < g.s1 && y1 > g.y0 && y0 < g.y1)) continue;
      const r = hash(Math.floor(i / per), Math.floor(j / per), fi);
      const mat = r < 0.3 ? 'copperDark' : r < 0.7 ? 'copper' : (near ? 'copperWarm' : 'copper');
      onFacade(f, s0 + gap, s1 - gap, y0 + gap, y1 - gap, off, mat);
    }
  });

  // ------------------------------------------------------------------ cantilever: soffit, fascia lip; roof
  const FASCIA = 0.3, LIP_Y1 = SOFFIT_Y + 1;
  S(dark).quad([RECESS.u0, SOFFIT_Y, RECESS_V], [RECESS.u1, SOFFIT_Y, RECESS_V], [RECESS.u1, SOFFIT_Y, FRONT_V + FASCIA], [RECESS.u0, SOFFIT_Y, FRONT_V + FASCIA], [0, SOFFIT_Y - 10, 0]);
  { // a ~1 m dark fascia lip along the lower edge of the overhanging volume (front, top ledge, two ends)
    const fv = FRONT_V + FASCIA, mid = [(RECESS.u0 + RECESS.u1) / 2, (SOFFIT_Y + LIP_Y1) / 2, FRONT_V];
    S(dark).quad([RECESS.u0, SOFFIT_Y, fv], [RECESS.u1, SOFFIT_Y, fv], [RECESS.u1, LIP_Y1, fv], [RECESS.u0, LIP_Y1, fv], [mid[0], mid[1], fv + 5]);
    S(dark).quad([RECESS.u0, LIP_Y1, FRONT_V], [RECESS.u1, LIP_Y1, FRONT_V], [RECESS.u1, LIP_Y1, fv], [RECESS.u0, LIP_Y1, fv], [mid[0], LIP_Y1 + 5, mid[2]]);
    for (const [u, dir] of [[RECESS.u0, -1], [RECESS.u1, 1]]) S(dark).quad([u, SOFFIT_Y, FRONT_V], [u, SOFFIT_Y, fv], [u, LIP_Y1, fv], [u, LIP_Y1, FRONT_V], [u + dir * 5, mid[1], FRONT_V]);
  }
  for (const t of triangulate(OUTLINE, HOLES)) S('roof').tri([t[0][0], ROOF_Y, t[0][1]], [t[1][0], ROOF_Y, t[1][1]], [t[2][0], ROOF_Y, t[2][1]], [t[0][0], ROOF_Y + 10, t[0][1]]);
  if (near) { // roof: a few broad darker and green-tinged patches, away from the courtyards and the tower foot
    const C = 8;
    for (let i = 0, u0 = -72.5; u0 < 72.2; i++, u0 += C) for (let j = 0, v0 = -37.8; v0 < 38.4; j++, v0 += C) {
      let ok = true;
      for (let k = 0; k < 9 && ok; k++) ok = isSolid(u0 + 0.3 + (C - 0.6) * (k % 3) / 2, v0 + 0.3 + (C - 0.6) * Math.floor(k / 3) / 2);
      if (!ok || (u0 + C > TOWER_BASE.u0 - 0.2 && u0 < TOWER_BASE.u1 && v0 + C > TOWER_BASE.v0 && v0 < TOWER_BASE.v1 + 0.2)) continue;
      const r = hash(i, j, 99);
      const mat = r < 0.5 ? null : r < 0.92 ? 'roofPanel' : 'roofPatina';
      if (!mat) continue;
      const y = ROOF_Y + PANEL_OFF, up = [u0, y + 10, v0];
      S(mat).quad([u0 + 0.1, y, v0 + 0.1], [u0 + C - 0.1, y, v0 + 0.1], [u0 + C - 0.1, y, v0 + C - 0.1], [u0 + 0.1, y, v0 + C - 0.1], up);
    }
  }

  // ------------------------------------------------------------------ Hamon Observation Tower: a loft of twisting quads
  const STOREYS = 6, dy = (TOWER_TRUNK_TOP - ROOF_Y) / STOREYS;
  const rings = TOWER_QUADS.map((q, k) => ({ y: ROOF_Y + dy * k, q }));
  rings.push({ y: TOWER_TRUNK_TOP, q: TOWER_QUADS[5] });
  const slits = near ? [1.5, 4.5].map((k) => [ROOF_Y + dy * k - 0.45, ROOF_Y + dy * k + 0.45]) : [];
  const ys = new Set(rings.map((r) => r.y));
  if (near) for (let k = 0; k + 1 < rings.length; k++) ys.add((rings[k].y + rings[k + 1].y) / 2);
  for (const [lo, hi] of slits) { ys.add(lo); ys.add(hi); }
  const breaks = [...ys].sort((p, q) => p - q);
  const sample = (y) => {
    let k = 0; while (k + 2 < rings.length && y > rings[k + 1].y + 1e-9) k++;
    const t = (y - rings[k].y) / (rings[k + 1].y - rings[k].y);
    return rings[k].q.map((p, i) => lerp2(p, rings[k + 1].q[i], t));
  };
  const centre = (q) => [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4];
  // The long faces (sides 0 and 2) are ruled, warped surfaces: cut into columns so no big non-planar quad is split
  // across one diagonal (that gave a dark zig-zag); the short faces are planar.
  const NS = near ? 6 : 3;
  for (let m = 0; m + 1 < breaks.length; m++) {
    const lo = breaks[m], hi = breaks[m + 1], ql = sample(lo), qh = sample(hi), c = centre(ql), ym = (lo + hi) / 2;
    const inSlit = slits.some(([a, z]) => ym > a && ym < z);
    const storey = Math.min(STOREYS - 1, Math.floor((ym - ROOF_Y) / dy + 1e-9));
    const trunk = near ? 'tower' : (storey % 2 ? 'towerRib' : 'tower'); // far: storey bands carry the twist
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, long = i % 2 === 0, cols = long ? NS : 1;
      const mat = inSlit && long ? 'glass' : trunk;
      for (let s = 0; s < cols; s++) {
        const a = lerp2(ql[i], ql[j], s / cols), bb = lerp2(ql[i], ql[j], (s + 1) / cols), cc = lerp2(qh[i], qh[j], (s + 1) / cols), d = lerp2(qh[i], qh[j], s / cols);
        const mx = (a[0] + bb[0]) / 2, mz = (a[1] + bb[1]) / 2;
        S(mat).quad([a[0], lo, a[1]], [bb[0], lo, bb[1]], [cc[0], hi, cc[1]], [d[0], hi, d[1]], [mx + (mx - c[0]) * 4, ym, mz + (mz - c[1]) * 4]);
      }
    }
  }
  // patch point and outward normal on side i at (s along 0..1, height y)
  const patch = (i, s, y) => { const q = sample(y), p = lerp2(q[i], q[(i + 1) % 4], s); return [p[0], y, p[1]]; };
  const patchN = (i, s, y) => {
    const p = patch(i, s, y), ds = sub3(patch(i, Math.min(1, s + 0.02), y), patch(i, Math.max(0, s - 0.02), y)), dv = sub3(patch(i, s, y + 0.3), patch(i, s, y - 0.3));
    let n = unit(cross(ds, dv)); const c = centre(sample(y));
    if (n[0] * (p[0] - c[0]) + n[2] * (p[2] - c[1]) < 0) n = [-n[0], -n[1], -n[2]];
    return n;
  };
  if (near) {
    // Storey ribs: a belt round every face at each floor (front, ledge above, soffit below), 0.3 m proud.
    const miter = (q, d) => q.map((p, i) => {
      const pv = q[(i + 3) % 4], nx = q[(i + 1) % 4], c = centre(q);
      const nrm = (a, z) => { const l = Math.hypot(z[0] - a[0], z[1] - a[1]) || 1; let n = [(z[1] - a[1]) / l, -(z[0] - a[0]) / l]; const m = [(a[0] + z[0]) / 2 - c[0], (a[1] + z[1]) / 2 - c[1]]; if (n[0] * m[0] + n[1] * m[1] < 0) n = [-n[0], -n[1]]; return n; };
      const n1 = nrm(pv, p), n2 = nrm(p, nx), k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1]);
      return [p[0] + (n1[0] + n2[0]) * k, p[1] + (n1[1] + n2[1]) * k];
    });
    for (let k = 1; k < STOREYS; k++) {
      const y = ROOF_Y + dy * k, q0 = sample(y), q1 = miter(q0, 0.3), c = centre(q0);
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4, mx = (q1[i][0] + q1[j][0]) / 2, mz = (q1[i][1] + q1[j][1]) / 2, out = [mx + (mx - c[0]) * 4, y, mz + (mz - c[1]) * 4];
        S('towerRib').quad([q1[i][0], y - 0.15, q1[i][1]], [q1[j][0], y - 0.15, q1[j][1]], [q1[j][0], y + 0.2, q1[j][1]], [q1[i][0], y + 0.2, q1[i][1]], out);
        S('towerRib').quad([q1[i][0], y + 0.2, q1[i][1]], [q1[j][0], y + 0.2, q1[j][1]], [q0[j][0], y + 0.2, q0[j][1]], [q0[i][0], y + 0.2, q0[i][1]], [mx, y + 5, mz]);
        S('towerRib').quad([q1[i][0], y - 0.15, q1[i][1]], [q0[i][0], y - 0.15, q0[i][1]], [q0[j][0], y - 0.15, q0[j][1]], [q1[j][0], y - 0.15, q1[j][1]], [mx, y - 5, mz]);
      }
    }
    // Stair flights: a zig-zag of diagonal flights up the north-east long face, one a storey, with the landings at the ribs.
    for (let k = 0; k < STOREYS; k++) {
      const y0 = ROOF_Y + dy * k + 0.5, y1 = ROOF_Y + dy * (k + 1) - 0.35, rev = k % 2, sa = rev ? 0.86 : 0.14, sb = rev ? 0.14 : 0.86, ds = 0.9 / 28;
      const A = patchN(2, sa, y0), B = patchN(2, sb, y1), w = rev ? -ds : ds;
      const pa = patch(2, sa, y0), pa2 = patch(2, sa + w, y0), pb = patch(2, sb, y1), pb2 = patch(2, sb + w, y1);
      const up = (p, n, o) => add3(p, n, o);
      const mid = add3([(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2], A, 5), side = unit(sub3(pa2, pa));
      S('towerRib').quad(up(pa, A, 0.4), up(pa2, A, 0.4), up(pb2, B, 0.4), up(pb, B, 0.4), mid);
      S('towerRib').quad(up(pa, A, -0.05), up(pa, A, 0.4), up(pb, B, 0.4), up(pb, B, -0.05), add3(add3([(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2], A, 0.2), side, -5));
      S('towerRib').quad(up(pa2, A, -0.05), up(pa2, A, 0.4), up(pb2, B, 0.4), up(pb2, B, -0.05), add3(add3([(pa2[0] + pb2[0]) / 2, (pa2[1] + pb2[1]) / 2, (pa2[2] + pb2[2]) / 2], A, 0.2), side, 5));
    }
  }

  const lid = (q, y, mat, dir) => { const c = centre(q); S(mat).quad([q[0][0], y, q[0][1]], [q[1][0], y, q[1][1]], [q[2][0], y, q[2][1]], [q[3][0], y, q[3][1]], [c[0], y + dir * 10, c[1]]); };
  const prism = (q, y0, y1, mat, caps) => {
    const c = centre(q);
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, mx = (q[i][0] + q[j][0]) / 2, mz = (q[i][1] + q[j][1]) / 2;
      S(mat).quad([q[i][0], y0, q[i][1]], [q[j][0], y0, q[j][1]], [q[j][0], y1, q[j][1]], [q[i][0], y1, q[i][1]], [mx + (mx - c[0]) * 4, (y0 + y1) / 2, mz + (mz - c[1]) * 4]);
    }
    if (caps) { lid(q, y1, mat, 1); lid(q, y0, mat, -1); }
  };
  lid(rings[rings.length - 1].q, TOWER_TRUNK_TOP, 'tower', 1);                   // the ledge round the glazed level
  prism(OBSERVATION_QUAD, TOWER_TRUNK_TOP, TOWER_GLASS_TOP, 'glow', false);     // the glazed observation level
  prism(CAP_QUAD, TOWER_GLASS_TOP, TOP_Y, 'tower', true);                        // the solid copper lid (7 m) overhanging it
  if (near) { // mullions on the glazed level: a post every ~3 m round its four faces
    const q = OBSERVATION_QUAD, c = centre(q);
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, a = q[i], z = q[j], len = Math.hypot(z[0] - a[0], z[1] - a[1]), n = Math.max(1, Math.round(len / 3));
      for (let k = 0; k <= n; k++) {
        if ((k === 0 || k === n)) continue; // the corners are the lid's and the ledge's
        const p = lerp2(a, z, k / n), tx = (z[0] - a[0]) / len, tz = (z[1] - a[1]) / len;
        let nx = tz, nz = -tx; if (nx * (p[0] - c[0]) + nz * (p[1] - c[1]) < 0) { nx = -nx; nz = -nz; }
        const w = 0.12, d = 0.25, P = (side, o) => [p[0] + tx * side + nx * o, 0, p[1] + tz * side + nz * o];
        const y0 = TOWER_TRUNK_TOP, y1 = TOWER_GLASS_TOP, at = (v, y) => [v[0], y, v[2]];
        S('towerRib').quad(at(P(-w, d), y0), at(P(w, d), y0), at(P(w, d), y1), at(P(-w, d), y1), [p[0] + nx * 5, (y0 + y1) / 2, p[1] + nz * 5]);
        S('towerRib').quad(at(P(-w, 0), y0), at(P(-w, d), y0), at(P(-w, d), y1), at(P(-w, 0), y1), [p[0] - tx * 5, (y0 + y1) / 2, p[1] - tz * 5]);
        S('towerRib').quad(at(P(w, 0), y0), at(P(w, d), y0), at(P(w, d), y1), at(P(w, 0), y1), [p[0] + tx * 5, (y0 + y1) / 2, p[1] + tz * 5]);
      }
    }
  }

  for (const [m, s] of soups) {
    if (s.empty) continue;
    const g = s.geometry(); g.rotateY(THETA); b.put(g, m);
  }
  return b.finish();
}
