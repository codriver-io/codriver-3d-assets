import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, KERB, BARRIER, roadEdgesAt } from './pont-pierre-laporte-profile.js';
import {
  h, TRUSS_BOTTOM, TRUSS_TOP, TRUSS_D, FLOOR_HALF, MAIN_PANELS, SIDE_PANELS, PIER_TOP, FOOTING_TOP, LEG_TOP, TOWER_TOP,
  LEG_INNER, legAt, PORTAL, STRUT, CABLE_R, cableY, CABLE_END_S, SUSPENDERS, ANCHOR_BLOCK, ANCHOR_HALF, FILL_BELOW,
  TOWER_S, ANCHOR_S, BRIDGE_START, BRIDGE_END, CABLE_D,
} from './pont-pierre-laporte-structure.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const UP = new Vector3(0, 1, 0);

/**
 * Pont Pierre-Laporte: two pale cruciform-legged steel towers joined at the top by a round-arched
 * portal and under the deck by a deep strut with an arched soffit, the two main cables with 65 pairs of
 * suspenders each, the grey Warren stiffening trusses carried continuously between the anchorages, the
 * clifftop anchorages and the approach girders, carrying six lanes of the A-73 with a median barrier and
 * lamp standards. Real metres, +X east, +Y up, +Z south, built on the mapped roadway
 * (pont-pierre-laporte-profile.js) so it is one surface with the car, route and HD road.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  // The ramps are gentle (smoothstep over 800 m): a 12.5 m chord sags < 1 cm below the curve.
  const STEP = near ? 12.5 : 25;
  const b = bridgeBuilder({ ...p, meshStep: STEP }, detail), L = p.BRIDGE_LENGTH;
  // Three spatial chunks along the 2.6 km alignment (near only): culling.
  const CUTS = [L / 3, 2 * L / 3];
  const chunk = (s) => (near ? (s < CUTS[0] ? 0 : s < CUTS[1] ? 1 : 2) : 0);
  const frame = (s) => { const q = p.bridgePoint(s, 0); return { T: new Vector3(q.tx, 0, q.tz), N: new Vector3(-q.tz, 0, q.tx) }; };
  const P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return new Vector3(q.x, y, q.z); };

  // ---- Mesh helpers ---------------------------------------------------------------------------------
  // Flat-shaded custom geometry: every quad owns its four vertices, so the baked directional shading
  // stays crisp on the towers' faces.
  const lists = new Map();
  function list(mat, ck, lift, crisp = true) {
    const key = `${mat}|${ck}|${typeof lift === 'function' ? lift.key : lift}|${crisp}`;
    if (!lists.has(key)) lists.set(key, { mat, ck, lift, pos: [], idx: [] });
    return lists.get(key);
  }
  const liftBelow = (top, foot = 0) => Object.assign((y) => clamp01((y - foot) / Math.max(1, top - foot)), { key: `below:${top.toFixed(2)}:${foot}` });
  const _e1 = new Vector3(), _e2 = new Vector3();
  function quad(l, A, B, C, D) {
    if (_e1.subVectors(C, A).cross(_e2.subVectors(D, B)).lengthSq() < 1e-8) return;
    const i = l.pos.length / 3;
    l.pos.push(A.x, A.y, A.z, B.x, B.y, B.z, C.x, C.y, C.z, D.x, D.y, D.z);
    l.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  function tri(l, A, B, C) { const i = l.pos.length / 3; l.pos.push(A.x, A.y, A.z, B.x, B.y, B.z, C.x, C.y, C.z); l.idx.push(i, i + 1, i + 2); }
  /** A quad whose front faces `out` (a direction away from the solid). */
  function face(l, A, B, C, D, out) {
    const n = new Vector3().subVectors(B, A).cross(new Vector3().subVectors(C, A));
    if (n.dot(out) >= 0) quad(l, A, B, C, D); else quad(l, A, D, C, B);
  }
  /** An open box (four sides, no end caps) between two points: `w` wide, `t` thick. */
  function member(mat, A, B, w, t, ck = 0, lift = 1, s = null) {
    const axis = new Vector3().subVectors(B, A), len = axis.length();
    if (len < 1e-3) return;
    axis.divideScalar(len);
    const { T, N } = frame(s ?? p.projectBridge(A.x, A.z).s);
    let u = new Vector3().crossVectors(axis, N);
    if (u.lengthSq() < 0.09) u = new Vector3().crossVectors(axis, T);
    u.normalize();
    const v = new Vector3().crossVectors(u, axis).normalize();
    // Thin members share their eight corners (soft shading costs nothing visible at their size).
    const crisp = w > 1.5 || t > 1.5, l = list(mat, ck, lift, crisp), c = [];
    for (const E of [A, B]) for (const [i, j] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) c.push(E.clone().addScaledVector(u, i * w / 2).addScaledVector(v, j * t / 2));
    const base = l.pos.length / 3;
    if (!crisp) for (const q of c) l.pos.push(q.x, q.y, q.z);
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4, mid = c[k].clone().add(c[k2]).multiplyScalar(0.5).sub(A);
      const out = mid.addScaledVector(axis, -mid.dot(axis));
      if (crisp) { face(l, c[k], c[k2], c[4 + k2], c[4 + k], out); continue; }
      const n = new Vector3().subVectors(c[k2], c[k]).cross(new Vector3().subVectors(c[4 + k2], c[k]));
      const [a0, a1, a2, a3] = [base + k, base + k2, base + 4 + k2, base + 4 + k];
      if (n.dot(out) >= 0) l.idx.push(a0, a1, a2, a0, a2, a3); else l.idx.push(a0, a3, a2, a0, a2, a1);
    }
  }
  /** A closed box in the bridge frame: centre (s, d, y), size along/across/up. */
  const box = (mat, s, d, y, along, across, up, ck, lift = 1) => b.box(mat, s, d, y, along, across, up, ck, lift);
  /** A flat-shaded loft of horizontal rings (same vertex count, wound the same way) with a top cap. */
  function loft(mat, rings, centre, ck = 0, lift = 1) {
    const l = list(mat, ck, lift), n = rings[0].length;
    const e0 = new Vector3().subVectors(rings[0][1], rings[0][0]), m0 = rings[0][0].clone().add(rings[0][1]).multiplyScalar(0.5);
    const out0 = new Vector3(m0.x - centre(rings[0][0].y).x, 0, m0.z - centre(rings[0][0].y).z);
    const flip = new Vector3().crossVectors(e0, UP).dot(out0) < 0;
    for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, A = rings[k][i], B = rings[k][j], C = rings[k + 1][j], D = rings[k + 1][i];
      if (flip) quad(l, A, D, C, B); else quad(l, A, B, C, D);
    }
    const top = rings.at(-1), c = centre(top[0].y);
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; if (flip) tri(l, c, top[j], top[i]); else tri(l, c, top[i], top[j]); }
  }
  /**
   * A cruciform leg section in the bridge frame: a rectangle `along` x `across` with notched corners
   * and (near) a recessed vertical groove down the middle of every face.
   */
  function section(s, d, y, along, across, notch = 0.5) {
    const { T, N } = frame(s), o = P(s, d, y), A = along / 2, B = across / 2, n = notch;
    if (!near) return [[A, -B + n], [A, B - n], [A - n, B - n], [A - n, B], [-A + n, B], [-A + n, B - n], [-A, B - n], [-A, -B + n], [-A + n, -B + n], [-A + n, -B], [A - n, -B], [A - n, -B + n]]
      .map(([u, v]) => o.clone().addScaledVector(T, u).addScaledVector(N, v));
    const gu = across * 0.3, gv = along * 0.24, r = 0.3;
    const uv = [
      [A, -B + n], [A, -gu / 2], [A - r, -gu / 2], [A - r, gu / 2], [A, gu / 2], [A, B - n], [A - n, B - n],
      [A - n, B], [gv / 2, B], [gv / 2, B - r], [-gv / 2, B - r], [-gv / 2, B], [-A + n, B], [-A + n, B - n],
      [-A, B - n], [-A, gu / 2], [-A + r, gu / 2], [-A + r, -gu / 2], [-A, -gu / 2], [-A, -B + n], [-A + n, -B + n],
      [-A + n, -B], [-gv / 2, -B], [-gv / 2, -B + r], [gv / 2, -B + r], [gv / 2, -B], [A - n, -B], [A - n, -B + n],
    ];
    return uv.map(([u, v]) => o.clone().addScaledVector(T, u).addScaledVector(N, v));
  }
  /** A ribbon along the roadway, sampled every STEP on the ramps and at alignment vertices where level. */
  function ribbon(mat, a, c, l, r, off, thick, ck) {
    const lAt = typeof l === 'function' ? l : () => l, rAt = typeof r === 'function' ? r : () => r;
    const set = new Set([a, c]);
    for (let s = Math.ceil(a / STEP) * STEP; s < c; s += STEP) if (s < ANCHOR_S[0] || s > ANCHOR_S[1]) set.add(s);
    for (const v of p.ALIGNMENT) if (v.s > a && v.s < c) set.add(v.s);
    const ss = [...set].sort((u, v) => u - v).filter((s, i, all) => !i || s - all[i - 1] > 0.05 || s === c), pos = [], idx = [], stride = thick ? 4 : 2;
    if (ss.length > 2 && ss.at(-1) - ss.at(-2) <= 0.05) ss.splice(-2, 1);
    ss.forEach((s, i) => {
      const L0 = lAt(s), R0 = rAt(s);
      for (const [d, dy] of thick ? [[L0, 0], [R0, 0], [L0, -thick], [R0, -thick]] : [[L0, 0], [R0, 0]]) pos.push(...b.xyz(s, d, h(s) + off + dy));
      if (!i) return;
      const x = (i - 1) * stride, y = i * stride;
      idx.push(x, x + 1, y, x + 1, y + 1, y);
      if (thick) idx.push(x + 2, y + 2, x + 3, x + 3, y + 2, y + 3, x, y, x + 2, x + 2, y, y + 2, x + 1, x + 3, y + 1, x + 3, y + 3, y + 1);
    });
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.put(g, mat, ck, 1);
  }
  /** A ribbon along the roadway, split at the chunk cuts. */
  function strips(mat, a, c, l, r, off = 0, thick = 0) {
    const cuts = near ? [a, ...CUTS.filter((v) => v > a && v < c), c] : [a, c];
    for (let i = 1; i < cuts.length; i++) (mat === 'asphalt' && typeof l !== 'function' ? b.strip : ribbon)(mat, cuts[i - 1], cuts[i], l, r, off, thick, chunk((cuts[i - 1] + cuts[i]) / 2));
  }
  const both = (fn) => { fn(-1); fn(1); };
  /** A closed block (top, sides, ends; no bottom) from y0 up to topAt(s), between two stations. */
  function block(mat, s0, s1, dl, dr, y0, topAt, ck, lift) {
    const l = list(mat, ck, lift), n = Math.max(1, Math.ceil((s1 - s0) / 8));
    const ss = Array.from({ length: n + 1 }, (_, k) => s0 + (s1 - s0) * k / n);
    for (let k = 0; k < n; k++) {
      const a = ss[k], c = ss[k + 1], { N, T } = frame(a);
      face(l, P(a, dl, topAt(a)), P(c, dl, topAt(c)), P(c, dr, topAt(c)), P(a, dr, topAt(a)), UP);
      face(l, P(a, dl, y0), P(c, dl, y0), P(c, dl, topAt(c)), P(a, dl, topAt(a)), N.clone().negate());
      face(l, P(a, dr, y0), P(c, dr, y0), P(c, dr, topAt(c)), P(a, dr, topAt(a)), N);
      if (!k) face(l, P(a, dl, y0), P(a, dr, y0), P(a, dr, topAt(a)), P(a, dl, topAt(a)), T.clone().negate());
      if (k === n - 1) face(l, P(c, dl, y0), P(c, dr, y0), P(c, dr, topAt(c)), P(c, dl, topAt(c)), T);
    }
  }

  // ---- The deck: roadway, median barrier, service strips, railings -----------------------------------
  const [A0, A1] = [ANCHOR_S[0] + 4, ANCHOR_S[1] - 4];   // the suspended deck between the anchorage faces
  // Beyond the mapped bridge the carriageways drift apart (pont-pierre-laporte-profile.js#roadEdgesAt):
  // each keeps its own pavement on one wide ramp deck, the median between them is bare deck.
  const outerE = (s) => roadEdgesAt(s)[0][0], innerE = (s) => roadEdgesAt(s)[0][1];
  const innerW = (s) => roadEdgesAt(s)[1][0], outerW = (s) => roadEdgesAt(s)[1][1];
  const EXT = [[0, A0], [A1, L]];
  strips('asphalt', A0, A1, -KERB, KERB, 0, 0);
  for (const [a, c] of EXT) { strips('asphalt', a, c, outerE, innerE, 0, 0); strips('asphalt', a, c, innerW, outerW, 0, 0); }
  if (near) strips('concrete', BRIDGE_START, BRIDGE_END, -BARRIER, BARRIER, 0.82, 0.84);      // median barrier
  // On the suspended deck: steel floor out to the trusses, a concrete traffic barrier at each kerb, a
  // service strip behind it and the outer railing on the truss top chord.
  strips('steel', A0, A1, -FLOOR_HALF, FLOOR_HALF, -0.3, 0.6);
  both((o) => {
    const k = o * KERB;
    if (near) strips('concrete', A0, A1, Math.min(k, k + o * 0.4), Math.max(k, k + o * 0.4), 0.85, 0.9);
    if (near) strips('concrete', A0, A1, Math.min(k + o * 0.4, o * (TRUSS_D - 0.5)), Math.max(k + o * 0.4, o * (TRUSS_D - 0.5)), 0.15, 0.4);
    strips('steel', A0, A1, Math.min(o * TRUSS_D, o * (TRUSS_D + 0.2)), Math.max(o * TRUSS_D, o * (TRUSS_D + 0.2)), 1.3, 1.5);
  });
  // Beyond the suspended deck (over the anchorages, the Marie-Victorin viaduct and the flat-map ramps):
  // a concrete deck with parapets.
  const edgeE = (s) => outerE(s) - 0.9, edgeW = (s) => outerW(s) + 0.9;
  for (const [a, c] of EXT) {
    strips('concrete', a, c, edgeE, edgeW, -0.06, 0.9);
    if (near) {
      strips('concrete', a, c, edgeE, (s) => outerE(s) - 0.35, 1.0, 1.06);
      strips('concrete', a, c, (s) => outerW(s) + 0.35, edgeW, 1.0, 1.06);
    }
  }
  // Lane paint (the HD pavement's own paint replaces it in the app).
  if (near) {
    const line = (d, a, c, w = 0.15) => ribbon('paint', a, c, typeof d === 'function' ? (s) => d(s) - w / 2 : d - w / 2, typeof d === 'function' ? (s) => d(s) + w / 2 : d + w / 2, 0.025, 0, chunk((a + c) / 2));
    both((o) => {
      for (const [a, c] of [[A0, CUTS[0]], [CUTS[0], CUTS[1]], [CUTS[1], A1]]) { line(o * (KERB - 0.3), a, c); line(o * (BARRIER + 0.35), a, c); }
      for (let s = A0 + 2; s < A1 - 4; s += 12.2) for (const d of [3.85, 7.4]) line(o * d, s, s + 3.05, 0.13);
    });
    for (const [a, c] of EXT) for (const [f, k] of [[outerE, 0.3], [innerE, -0.3], [innerW, 0.3], [outerW, -0.3]]) line((s) => f(s) + k, a, c);
  }

  // ---- Stiffening trusses (Warren with verticals), continuous from anchorage to anchorage --------------
  const yTop = (s) => h(s) - TRUSS_TOP, yBot = (s) => h(s) - TRUSS_BOTTOM;
  const runs = [[A0, TOWER_S[0], SIDE_PANELS], [TOWER_S[0], TOWER_S[1], MAIN_PANELS], [TOWER_S[1], A1, SIDE_PANELS]];
  for (const [a, c, n] of runs) {
    const step = (c - a) / n;
    both((o) => {
      const d = o * TRUSS_D;
      strips('steel', a, c, d - 0.45, d + 0.45, -TRUSS_TOP, 1.0);                      // top chord
      strips('steel', a, c, d - 0.45, d + 0.45, -(TRUSS_BOTTOM - 1.0), 1.0);           // bottom chord
      for (let k = 0; k <= n; k++) {
        const s = a + k * step, ck = chunk(s);
        if (near) member('steel', P(s, d, yBot(s) + 1.0), P(s, d, yTop(s) - 1.0), 0.6, 0.6, ck, 1, s);   // verticals
        if (k < n && (near || k % 2 === 0)) {                                     // diagonals (far: every other panel)
          const s2 = a + (k + (near ? 1 : 2)) * step, up = k % (near ? 2 : 4) === 0;
          if (s2 <= c + 1e-6) member('steel', P(up ? s : s2, d, yBot(up ? s : s2) + 1.0), P(up ? s2 : s, d, yTop(up ? s2 : s) - 1.0), 0.55, 0.5, ck, 1, s);
        }
      }
    });
    if (near) {   // bottom lateral bracing and floor-beam struts between the two trusses, every two panels
      for (let k = 0; k < n; k += 2) {
        const s = a + k * step, s2 = s + 2 * step, y = yBot(s) + 0.5, ck = chunk(s);
        member('steel', P(s, -TRUSS_D, y), P(s2, TRUSS_D, y), 0.4, 0.4, ck, 1, s);
        member('steel', P(s, TRUSS_D, y), P(s2, -TRUSS_D, y), 0.4, 0.4, ck, 1, s);
        member('steel', P(s, -TRUSS_D, y), P(s, TRUSS_D, y), 0.5, 0.5, ck, 1, s);
      }
    }
  }

  // ---- The towers ----------------------------------------------------------------------------------
  function tower(s0) {
    const ck = chunk(s0), pierLift = liftBelow(PIER_TOP);
    // Concrete footing at the water's edge and a pedestal under each leg; the footing reaches the bed
    // in Full 3D world (weight 0 at its base).
    const foot = legAt(PIER_TOP);
    box('concrete', s0, 0, FOOTING_TOP / 2, 13, 2 * (foot.centre + foot.across / 2) + 5, FOOTING_TOP, ck, pierLift);
    for (const o of [-1, 1]) box('concrete', s0, o * foot.centre, (FOOTING_TOP + PIER_TOP) / 2, foot.along + 2.4, foot.across + 2.0, PIER_TOP - FOOTING_TOP, ck, pierLift);
    // Two cruciform legs, inner faces vertical just outside the trusses, tapering outward and along.
    for (const o of [-1, 1]) {
      const rings = [PIER_TOP, LEG_TOP].map((y) => { const g = legAt(y); return section(s0, o * g.centre, y, g.along, g.across); });
      loft('tower', rings, (y) => P(s0, o * legAt(y).centre, y), ck, 1);
      // saddle housing on the leg top, over the cable
      box('tower', s0, o * CABLE_D, (LEG_TOP - 0.2 + TOWER_TOP) / 2, 3.6, 2.6, TOWER_TOP - LEG_TOP + 0.2, ck);
      // red obstruction light on the housing's outer face
      box('light', s0, o * (CABLE_D + 1.42), TOWER_TOP - 0.8, 0.7, 0.24, 0.7, ck);
    }
    // The portal (top) and the deck-level strut (under the trusses), in the tower's cross plane.
    const l = list('tower', ck, 1), { T } = frame(s0);
    /** A plate between the legs' inner faces: top edge at `top`, underside lower(d); depth along. */
    function plate(top, lower, depth, n) {
      // into the legs' grooves at both ends
      const ds = [-LEG_INNER - 0.35, ...Array.from({ length: n + 1 }, (_, k) => -LEG_INNER + 2 * LEG_INNER * k / n), LEG_INNER + 0.35];
      for (const side of [-1, 1]) {
        const s = s0 + side * depth / 2, out = T.clone().multiplyScalar(side);
        for (let k = 0; k + 1 < ds.length; k++) face(l, P(s, ds[k], lower(ds[k])), P(s, ds[k + 1], lower(ds[k + 1])), P(s, ds[k + 1], top), P(s, ds[k], top), out);
      }
      const a = s0 - depth / 2, c = s0 + depth / 2;
      for (let k = 0; k + 1 < ds.length; k++) {
        face(l, P(a, ds[k], lower(ds[k])), P(c, ds[k], lower(ds[k])), P(c, ds[k + 1], lower(ds[k + 1])), P(a, ds[k + 1], lower(ds[k + 1])), UP.clone().negate());
        face(l, P(a, ds[k], top), P(c, ds[k], top), P(c, ds[k + 1], top), P(a, ds[k + 1], top), UP);
      }
    }
    // Top portal: an elliptical arch from the legs' inner faces (springing PORTAL.rise below the crown).
    {
      const n = near ? 24 : 12, spring = PORTAL.crown - PORTAL.rise;
      plate(PORTAL.top, (d) => spring + PORTAL.rise * Math.sqrt(Math.max(0, 1 - (d / LEG_INNER) ** 2)), PORTAL.depth, n);
    }
    // Deck-level strut: a segmental arch soffit, STRUT.atLegs deep at the legs and STRUT.atCentre mid-way.
    {
      const r = STRUT.atLegs - STRUT.atCentre, c = LEG_INNER, R = (c * c + r * r) / (2 * r), base = STRUT.top - STRUT.atLegs;
      plate(STRUT.top, (d) => base + Math.sqrt(R * R - d * d) - (R - r), STRUT.depth, near ? 16 : 8);
    }
  }
  for (const s of TOWER_S) tower(s);

  // ---- Main cables and suspenders ---------------------------------------------------------------------
  function tube(mat, pts, r, sides, ck) {
    const pos = [], idx = [];
    for (let i = 0; i < pts.length; i++) {
      const t = new Vector3().subVectors(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)]).normalize();
      const u = new Vector3().crossVectors(t, UP).normalize(), v = new Vector3().crossVectors(u, t);
      for (let k = 0; k < sides; k++) {
        const a = 2 * Math.PI * k / sides;
        pos.push(...pts[i].clone().addScaledVector(u, Math.cos(a) * r).addScaledVector(v, Math.sin(a) * r).toArray());
      }
      if (i) for (let k = 0; k < sides; k++) {
        const k2 = (k + 1) % sides, a0 = (i - 1) * sides;
        idx.push(a0 + k, i * sides + k, a0 + k2, a0 + k2, i * sides + k, i * sides + k2);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const n0 = new Vector3(), A = new Vector3().fromArray(pos, 0), B = new Vector3().fromArray(pos, sides * 3), C = new Vector3().fromArray(pos, 3);
    n0.subVectors(B, A).cross(new Vector3().subVectors(C, A));
    if (n0.dot(new Vector3().subVectors(A, pts[0])) < 0) { for (let i = 0; i < idx.length; i += 3) [idx[i + 1], idx[i + 2]] = [idx[i + 2], idx[i + 1]]; g.setIndex(idx); g.computeVertexNormals(); }
    b.put(g, mat, ck, 1);
  }
  // far (2-8 km): a thicker five-sided cable so it still reads as a line
  const sides = near ? 8 : 5, R = near ? CABLE_R : 0.45;
  for (const o of [-1, 1]) {
    const d = o * CABLE_D, span = (a, c, n) => Array.from({ length: n + 1 }, (_, k) => { const s = a + (c - a) * k / n; return P(s, d, cableY(s)); });
    tube('cable', span(TOWER_S[0], TOWER_S[1], near ? 24 : 12), R, sides, chunk(TOWER_S[0] + 10));
    tube('cable', span(CABLE_END_S[0], TOWER_S[0], near ? 10 : 5), R, sides, chunk(CABLE_END_S[0]));
    tube('cable', span(TOWER_S[1], CABLE_END_S[1], near ? 10 : 5), R, sides, chunk(CABLE_END_S[1]));
  }
  // Suspender pairs: one flat ribbon per pair, from the cable down to the truss top chord.
  for (const [k, s] of SUSPENDERS.entries()) {
    if (!near && k % 2) continue;   // far: every other
    const top = cableY(s) - CABLE_R, foot = h(s) - TRUSS_TOP;
    if (top - foot < 1.0) continue;
    for (const o of [-1, 1]) member('cable', P(s, o * TRUSS_D, foot), P(s, o * CABLE_D, top), near ? 0.36 : 0.45, near ? 0.12 : 0.2, chunk(s), 1, s);
  }

  // ---- Anchorages: stepped concrete blocks under the road at both clifftops, cable housings beside it --
  for (const [i, [a, c]] of ANCHOR_BLOCK.entries()) {
    const ck = chunk((a + c) / 2), top = (s) => h(s) - 0.97, lift = liftBelow(top((a + c) / 2)), low = 0.5 * top((a + c) / 2);
    block('concrete', a - 3, c + 3, -ANCHOR_HALF - 2.5, ANCHOR_HALF + 2.5, 0, () => low, ck, lift);
    block('concrete', a, c, -ANCHOR_HALF, ANCHOR_HALF, low, top, ck, lift);
    if (near) for (const side of [-1, 1]) for (let s = a + 5; s < c - 2; s += 8) box('concrete', s, side * (ANCHOR_HALF + 0.3), (low + top(s)) / 2, 2.0, 0.6, top(s) - low - 2, ck, lift);
    // Cable housings: the cables run into their inclined faces just above the railing.
    const s0 = ANCHOR_S[i], dir = i ? 1 : -1, face0 = s0 - dir * 4, back = s0 + dir * 12;
    const hTop = (s) => h(s0) + 3.6 - 1.6 * clamp01((s - face0) / (back - face0));
    for (const o of [-1, 1]) block('concrete', Math.min(face0, back), Math.max(face0, back), o * CABLE_D - 1.7, o * CABLE_D + 1.7, h(s0) - 1.1, hTop, ck, 1);
  }

  // ---- Approaches: concrete girder on two-column piers while high, solid fill below -------------------
  function solid(s0, s1) {
    const n = Math.max(2, Math.ceil((s1 - s0) / 4)), pos = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, top = Math.max(h(s) - 0.12, 0.05);
      for (const [d, y] of [[edgeE(s), top], [edgeW(s), top], [edgeE(s), 0], [edgeW(s), 0]]) pos.push(...b.xyz(s, d, y));
      if (!i) continue;
      const u = (i - 1) * 4, v = i * 4;
      idx.push(u, u + 1, v, u + 1, v + 1, v, u, v, u + 2, u + 2, v, v + 2, u + 1, u + 3, v + 1, u + 3, v + 3, v + 1);
    }
    idx.push(0, 2, 1, 1, 2, 3, n * 4, n * 4 + 1, n * 4 + 2, n * 4 + 1, n * 4 + 3, n * 4 + 2);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.put(g, 'concrete', chunk((s0 + s1) / 2), (y) => (y > 0.05 ? 1 : 0));
  }
  // The fill starts where the deck is 0.25 m up: below that the ramp is pavement on grade.
  let fillN = 0; while (h(fillN) < FILL_BELOW) fillN += 0.5;
  let fillS = L; while (h(fillS) < FILL_BELOW) fillS -= 0.5;
  let footN = 0; while (h(footN) < 0.25) footN += 0.5;
  let footS = L; while (h(footS) < 0.25) footS -= 0.5;
  solid(footN, fillN); solid(fillS, footS);
  for (const [a, c] of [[fillN, ANCHOR_BLOCK[0][0] - 3], [ANCHOR_BLOCK[1][1] + 3, fillS]]) {
    strips('concrete', a, c, (s) => edgeE(s) + 4, (s) => edgeW(s) - 4, -0.96, 2.2);       // box girder
    const n = Math.max(1, Math.round((c - a) / 40));
    for (let k = 1; k < n; k++) {
      if (!near && k % 2) continue;
      const s = a + (c - a) * k / n, top = h(s) - 3.1, ck = chunk(s), dl = edgeE(s) + 5, dr = edgeW(s) - 5;
      for (const d of [dl, dr]) member('concrete', P(s, d, 0), P(s, d, top), 2.4, 2.4, ck, liftBelow(top), s);
      box('concrete', s, (dl + dr) / 2, top + 0.6, 2.6, dr - dl + 4, 1.2, ck, 1);
    }
  }

  // ---- Lamps: standards on the kerb barriers with the head over the roadway (near only) --------------
  for (let s = A0 + 20; near && s < A1 - 10; s += 45.6) {
    if (TOWER_S.some((t) => Math.abs(s - t) < 8)) continue;
    const ck = chunk(s);
    for (const o of [-1, 1]) {
      const d = o * (KERB + 0.2), y = h(s);
      member('steel', P(s, d, y + 1.7), P(s, d, y + 10.5), 0.24, 0.24, ck, 1, s);
      member('steel', P(s, d, y + 10.5), P(s, d - o * 1.8, y + 11.0), 0.18, 0.18, ck, 1, s);
      box('lamp', s, d - o * 1.95, y + 10.85, 1.2, 0.5, 0.3, ck);
    }
  }

  for (const l of lists.values()) {
    if (!l.idx.length) continue;
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(l.pos, 3)); g.setIndex(l.idx); g.computeVertexNormals();
    b.put(g, l.mat, l.ck, l.lift);
  }
  return b.finish();
}
