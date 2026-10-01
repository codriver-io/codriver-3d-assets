import { BufferGeometry, Float32BufferAttribute, ShapeUtils, Vector2, Vector3 } from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { PROFILE as p, T1, W2, E2, SAS_W, SAS_E, PIERS, E16, SKYWAY_END, CROSSBEAMS, TOWER_H, layoutEdges, half } from './bay-bridge-east-span-profile.js';

const h = (s) => p.deckHeight(s);
const L = p.BRIDGE_LENGTH;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

// ---- Cross-section layout (lateral d, + = south; WB is d < 0, EB d > 0), from the mapped deck outlines.
/** Signed lateral [inner, outer] edges of one deck's structure at station s (side -1 WB, +1 EB). */
export function deckEdges(s, side) {
  const c = half(s);
  if (s < SAS_W) { const k = layoutEdges(s)[side < 0 ? 0 : 1]; return side < 0 ? [k[1] + 0.9, k[0] - 0.9] : [k[0] - 0.9, k[1] + 0.9]; }
  if (s <= SAS_E) return [side * (c - 14.1), side * (c + 16.0)];   // SAS orthotropic boxes: 6.8 .. 36.9 m (OSM)
  return [side * (c - 16.4), side * (c + 13.5)];                   // Skyway / touchdown girders: 4.5 .. 34.4 m (OSM)
}
export const PATH_W = 4.8;               // bike/pedestrian path, south side of the eastbound deck
export const PATH_FROM = SAS_W;          // west of the SAS the trail leaves for the YBI vista point
export const BOX_DEPTH = 5.5;            // SAS boxes and crossbeams
/** Skyway girder depth: 5.5 m at mid-span, 9 m at the piers (published), parabolic haunch. */
export function girderDepth(s) {
  if (s < SAS_E || s > SKYWAY_END) return 3.0;
  let near = Infinity, span = 160;
  for (let i = 0; i < PIERS.length; i++) {
    const d = Math.abs(s - PIERS[i]);
    if (d < near) { near = d; span = i < PIERS.length - 1 ? PIERS[i + 1] - PIERS[i] : PIERS[i] - PIERS[i - 1]; }
  }
  const u = clamp01(near / (span / 2));
  return 5.5 + 3.5 * (1 - u) * (1 - u);
}
/** Where a deck needs columns: its underside is more than this above grade. */
const MIN_CLEAR = 3.5;

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...p.CHAMPLAIN, palette: p.CHAMPLAIN.palette }, detail);
  const CUTS = [SAS_E, 1800, 2700];
  const chunk = (s) => (near ? CUTS.filter((c) => s >= c).length : 0);
  const P = (s, d, y) => { const q = p.bridgePoint(s, d, y); return [q.x, y, q.z]; };
  const frame = (s) => { const q = p.bridgePoint(s, 0); return { t: [q.tx, q.tz], n: [-q.tz, q.tx], o: [q.x, q.z] }; };

  // Stations: every alignment vertex plus a step that keeps chords under the HD overlay on the ramps.
  function stations(a, c, coarse = 1) {
    const set = new Set([a, c]);
    const step = (s) => (s < SAS_W + 40 ? 3 : s > E16 - 60 ? 4 : 10) * coarse * (near ? 1 : 2);
    for (let s = a + step(a); s < c - 0.5; s += step(s)) set.add(s);
    for (const v of p.ALIGNMENT) if (v.s > a + 0.3 && v.s < c - 0.3) set.add(v.s);
    return [...set].sort((u, v) => u - v);
  }
  // Split [a, c] at chunk boundaries.
  function pieces(a, c) {
    const cuts = [a, ...CUTS.filter((v) => near && v > a && v < c), c];
    return cuts.slice(1).map((v, i) => [cuts[i], v]);
  }

  /** Puts triangles whose winding is checked against an outward hint, flipping the batch if needed. */
  function emit(mat, pos, idx, ck, lift, outward) {
    if (!idx.length) return;
    if (outward) {
      const v = (k) => new Vector3(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]);
      const [i0, i1, i2] = outward.tri ?? idx.slice(0, 3), A = v(i0), N = v(i1).sub(A).cross(v(i2).sub(A));
      if (N.dot(outward.dir) < 0) for (let k = 0; k < idx.length; k += 3) [idx[k + 1], idx[k + 2]] = [idx[k + 2], idx[k + 1]];
    }
    // Drop vertices no triangle uses (open faces), so none is left with a zero normal.
    const remap = new Map(), packed = [];
    const index = idx.map((v) => { if (!remap.has(v)) { remap.set(v, remap.size); packed.push(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]); } return remap.get(v); });
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(packed, 3)); g.setIndex(index); g.computeVertexNormals();
    b.put(g, mat, ck, lift);
  }

  /**
   * A closed section swept along the alignment: section(s) -> [[d, y], ...] (same count at every station).
   * Optional end caps. `open` drops the faces listed (edge indices) - e.g. a bottom on the ground.
   */
  function sweep(mat, a, c, section, { caps = [false, false], open = [], coarse = 1, lift = 1 } = {}) {
    for (const [a0, c0] of pieces(a, c)) {
      const S = stations(a0, c0, coarse), ck = chunk((a0 + c0) / 2), pos = [], idx = [];
      const first = section(S[0]), n = first.length;
      // orientation of the section polygon (signed area in d-y), so outward = rotate edge by -90 deg
      let area = 0; for (let i = 0; i < n; i++) { const [x1, y1] = first[i], [x2, y2] = first[(i + 1) % n]; area += x1 * y2 - x2 * y1; }
      // Each face has its own vertex columns: crisp edges across, smooth along the sweep.
      for (const s of S) { const sec = section(s); for (let i = 0; i < n; i++) for (const k of [i, (i + 1) % n]) pos.push(...P(s, ...sec[k])); }
      const sideTris = [], m = 2 * n;
      for (let k = 0; k + 1 < S.length; k++) for (let i = 0; i < n; i++) {
        if (open.includes(i)) continue;
        const A = k * m + 2 * i, B = k * m + 2 * i + 1, C = (k + 1) * m + 2 * i + 1, D = (k + 1) * m + 2 * i;
        sideTris.push(A, B, C, A, C, D);
      }
      // outward hint for the first kept edge at the first station: perpendicular to the edge, away from the inside
      const e = [...Array(n).keys()].find((i) => !open.includes(i));
      if (e !== undefined && S.length > 1) {
        const [d1, y1] = first[e], [d2, y2] = first[(e + 1) % n], ed = d2 - d1, ey = y2 - y1;
        const od = area > 0 ? ey : -ey, oy = area > 0 ? -ed : ed;            // outward normal in (d, y)
        const fr = frame(S[0]), dir = new Vector3(fr.n[0] * od, oy, fr.n[1] * od);
        emit(mat, pos.slice(), sideTris, ck, lift, { dir, tri: [2 * e, 2 * e + 1, m + 2 * e + 1] });
      }
      // caps
      const capTri = ShapeUtils.triangulateShape(first.map(([d, y]) => new Vector2(d, y)), []);
      for (const [end, on] of [[0, caps[0] && a0 === a], [1, caps[1] && c0 === c]]) {
        if (!on) continue;
        const s = end ? S.at(-1) : S[0], sec = section(s), cp = [], ci = [];
        for (const [d, y] of sec) cp.push(...P(s, d, y));
        for (const t of capTri) ci.push(...t);
        const fr = frame(s), dir = new Vector3(fr.t[0], 0, fr.t[1]).multiplyScalar(end ? 1 : -1);
        emit(mat, cp, ci, ck, lift, { dir });
      }
    }
  }
  /** An up-facing ribbon between two lateral functions at y(s) (asphalt, paint, path). */
  function ribbon(mat, a, c, l, r, y, coarse = 1) {
    for (const [a0, c0] of pieces(a, c)) {
      const S = stations(a0, c0, coarse), pos = [], idx = [];
      S.forEach((s, k) => {
        pos.push(...P(s, l(s), y(s)), ...P(s, r(s), y(s)));
        if (k) idx.push(2 * k - 2, 2 * k - 1, 2 * k + 1, 2 * k - 2, 2 * k + 1, 2 * k);
      });
      emit(mat, pos, idx, chunk((a0 + c0) / 2), 1, { dir: new Vector3(0, 1, 0) });
    }
  }
  /** A vertical prism/loft through horizontal rings [{ y, pts:[[x,z]] }] (columns, tower legs). */
  function pillar(mat, rings, { top = true, bottom = false, ck = 0, lift = 1 } = {}) {
    const n = rings[0].pts.length, pos = [], idx = [], m = 2 * n;
    for (const r of rings) for (let i = 0; i < n; i++) for (const k of [i, (i + 1) % n]) pos.push(r.pts[k][0], r.y, r.pts[k][1]);
    for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < n; i++) {
      const A = k * m + 2 * i, B = k * m + 2 * i + 1, C = (k + 1) * m + 2 * i + 1, D = (k + 1) * m + 2 * i;
      idx.push(A, B, C, A, C, D);
    }
    const c0 = rings[0].pts.reduce((m, q) => [m[0] + q[0] / n, m[1] + q[1] / n], [0, 0]);
    const [x0, z0] = rings[0].pts[0], [x1, z1] = rings[0].pts[1], mx = (x0 + x1) / 2 - c0[0], mz = (z0 + z1) / 2 - c0[1];
    emit(mat, pos, idx, ck, lift, { dir: new Vector3(mx, 0, mz), tri: [0, 1, m + 1] });
    const tri = ShapeUtils.triangulateShape(rings[0].pts.map(([x, z]) => new Vector2(x, z)), []);
    for (const [k, on, up] of [[rings.length - 1, top, 1], [0, bottom, -1]]) {
      if (!on) continue;
      const cp = [], ci = [];
      for (const [x, z] of rings[k].pts) cp.push(x, rings[k].y, z);
      for (const t of tri) ci.push(...t);
      emit(mat, cp, ci, ck, lift, { dir: new Vector3(0, up, 0) });
    }
  }
  /** A ring of points around (s, d) in the bridge frame: along x across, chamfered corners. */
  function rect(s, d, along, across, ch = 0) {
    const fr = frame(s), q = p.bridgePoint(s, d), a = along / 2, w = across / 2;
    const pts = ch ? [[-a + ch, -w], [a - ch, -w], [a, -w + ch], [a, w - ch], [a - ch, w], [-a + ch, w], [-a, w - ch], [-a, -w + ch]] : [[-a, -w], [a, -w], [a, w], [-a, w]];
    return pts.map(([u, v]) => [q.x + fr.t[0] * u + fr.n[0] * v, q.z + fr.t[1] * u + fr.n[1] * v]);
  }
  const box = (mat, s, d, y0, y1, along, across, ck = chunk(s), lift = 1) =>
    pillar(mat, [{ y: y0, pts: rect(s, d, along, across) }, { y: y1, pts: rect(s, d, along, across) }], { top: true, bottom: true, ck, lift });
  const bar = (mat, A, B, w, ck, round = true, lift = 1) => b.bar(mat, A, B, w, w, ck, round, lift);

  // =============================== DECKS =====================================================
  for (const side of [-1, 1]) {
    const k = side < 0 ? 0 : 1;
    const kerb = (s, i) => layoutEdges(s)[k][i];
    const inner = (s) => (side < 0 ? kerb(s, 1) : kerb(s, 0)), outer = (s) => (side < 0 ? kerb(s, 0) : kerb(s, 1));
    // Roadway (recoloured to the map's pavement at run time).
    ribbon('asphalt', 0, L, (s) => kerb(s, 0), (s) => kerb(s, 1), h);
    // Concrete barriers on both kerbs: 0.5 m wide, 1.07 m tall, sloped faces.
    for (const edge of near ? [inner, outer] : [outer]) {
      const o = (s) => Math.sign(edge(s) - (side < 0 ? -half(s) : half(s)));   // outward from the carriageway
      sweep('rail', 0, L, (s) => {
        const d = edge(s), y = h(s), w = o(s);
        return [[d - w * 0.05, y - 0.3], [d + w * 0.55, y - 0.3], [d + w * 0.5, y + 1.07], [d + w * 0.12, y + 1.07], [d - w * 0.05, y + 0.3]];
      }, { open: [0], coarse: near ? 1 : 1.5 });
    }
    // Lane paint (near): edge lines and the four lane dividers as 3 m dashes every 12 m.
    if (near) {
      for (const [i, off] of [[0, 0.35], [1, -0.35]]) {
        const d = (s) => kerb(s, i) + off;
        ribbon('paint', 0, L, (s) => d(s) - 0.08, (s) => d(s) + 0.08, (s) => h(s) + 0.03);
      }
      const dash = new Map();
      for (let s = 240; s < L - 40; s += 12) for (let lane = 1; lane < 5; lane++) {
        const ck = chunk(s); if (!dash.has(ck)) dash.set(ck, { pos: [], idx: [] });
        const { pos, idx } = dash.get(ck);
        const c = side * half(s), d = c + (lane - 2.5) * 3.66, q0 = p.bridgePoint(s, d - 0.07, h(s) + 0.03), q1 = p.bridgePoint(s + 3, d - 0.07, h(s + 3) + 0.03);
        const r0 = p.bridgePoint(s, d + 0.07, h(s) + 0.03), r1 = p.bridgePoint(s + 3, d + 0.07, h(s + 3) + 0.03), base = pos.length / 3;
        pos.push(q0.x, q0.y, q0.z, r0.x, r0.y, r0.z, r1.x, r1.y, r1.z, q1.x, q1.y, q1.z); idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
      }
      for (const [ck, { pos, idx }] of dash) emit('paint', pos, idx, ck, 1, { dir: new Vector3(0, 1, 0) });
    }

    // ---- YBI transition: a concrete box girder per carriageway on single-column bents -----------
    // Where the deck is too low for a girder on columns it stands on a fill to the ground.
    const fill = (s) => { const [i, o] = deckEdges(s, side), y = h(s) - 0.3, bot = Math.min(0, y - 0.3); return [[i, y], [o, y], [o, bot], [i, bot]]; };
    const lift0 = (y) => (y > 0.05 ? 1 : 0);
    let wFill = 0; while (h(wFill) - 2.9 < 0.8) wFill += 1;
    if (wFill > 0) sweep('concrete', 0, wFill, fill, { caps: [true, false], open: [2], lift: lift0 });
    const tBox = (s) => { const [i, o] = deckEdges(s, side), y = h(s) - 0.3, bot = y - 2.6; return [[i, y], [o, y], [o - side * 2.5, bot], [i + side * 2.5, bot]]; };
    sweep('concrete', wFill, SAS_W, tBox, { caps: [true, false], lift: lift0 });
    for (const s of [95, 135, 175, 212]) {
      const [i, o] = deckEdges(s, side), d = (i + o) / 2, top = h(s) - 2.9;
      if (top < MIN_CLEAR) continue;
      pillar('concrete', [{ y: 0, pts: rect(s, d, 3.4, 4.2, 1.0) }, { y: top - 1.5, pts: rect(s, d, 3.0, 3.8, 0.9) }, { y: top, pts: rect(s, d, 3.4, 10, 0.9) }], { ck: 0, lift: (y) => clamp01(y / top) });
    }

    // ---- SAS: orthotropic steel box (white), 5.5 m deep with sloped soffit -----------------------
    sweep('steel', SAS_W, SAS_E, (s) => {
      const [i, o] = deckEdges(s, side), y = h(s) - 0.28;
      return [[i, y], [o, y], [o, y - 1.2], [o - side * 4.2, y - BOX_DEPTH], [i + side * 2.2, y - BOX_DEPTH], [i, y - 1.6]];
    }, { caps: [true, true] });

    // ---- Skyway and touchdown: haunched 3-cell concrete box with long wings ---------------------
    const girder = (s) => {
      const [i, o] = deckEdges(s, side), y = h(s) - 0.28, bot = y - girderDepth(s);
      return [[i, y], [o, y], [o, y - 0.55], [o - side * 4.8, y - 1.5], [o - side * 7.0, bot], [i + side * 7.0, bot], [i + side * 4.8, y - 1.5], [i, y - 0.55]];
    };
    let eFill = L; while (h(eFill) - 0.28 - girderDepth(eFill) < 0.8) eFill -= 1;
    sweep('concrete', SAS_E + 0.4, eFill, girder, { caps: [true, true], lift: lift0 });
    sweep('concrete', eFill, L, fill, { caps: [false, true], open: [2], lift: lift0 });

    // Inner barrier light poles (near): white masts every 50 m with a self-lit head over the lanes.
    if (near) for (let s = SAS_W + 20; s < L - 120; s += 50) {
      const y = h(s), ck = chunk(s);
      const dd = side * (Math.abs(inner(s)) - 0.25);
      bar('steel', P(s, dd, y + 1.0), P(s, dd, y + 13), 0.16, ck);
      bar('steel', P(s, dd, y + 12.6), P(s, dd + side * 2.2, y + 13.1), 0.1, ck, false);
      box('lamp', s, dd + side * 2.4, y + 12.75, y + 13.05, 0.9, 0.7, ck);
    }
  }

  // ---- Bike/pedestrian path cantilevered off the south side of the eastbound deck --------------
  const pathIn = (s) => deckEdges(s, 1)[1], pathOut = (s) => pathIn(s) + PATH_W;
  sweep('concrete', PATH_FROM, L, (s) => { const i = pathIn(s) - 0.1, o = pathOut(s), y = h(s) + 0.05; return [[i, y], [o, y], [o, y - 0.7], [i, y - 1.3]]; }, { caps: [true, true] });
  ribbon('path', PATH_FROM, L, (s) => pathIn(s) + 0.05, (s) => pathOut(s) - 0.3, (s) => h(s) + 0.1);
  // Outer railing: a top rail on a see-through fence (one double-sided sheet), inner fence low.
  for (const [d, top] of (near ? [[(s) => pathOut(s) - 0.15, 1.45], [(s) => pathIn(s) + 0.15, 1.1]] : [[(s) => pathOut(s) - 0.15, 1.45]])) {
    sweep('rail', PATH_FROM, L, (s) => { const x = d(s), y = h(s) + 0.1 + top; return [[x - 0.09, y - 0.12], [x + 0.09, y - 0.12], [x + 0.09, y + 0.05], [x - 0.09, y + 0.05]]; }, { coarse: near ? 1 : 2 });
    if (near) for (const [a0, c0] of pieces(PATH_FROM, L)) {
      const S = stations(a0, c0), pos = [], idx = [];
      // A see-through fence as one sheet; the back face has its own vertices so its normals do not cancel.
      S.forEach((s, k) => { pos.push(...P(s, d(s), h(s) + 0.12), ...P(s, d(s), h(s) + top - 0.1)); if (k) idx.push(2 * k - 2, 2 * k - 1, 2 * k + 1, 2 * k - 2, 2 * k + 1, 2 * k); });
      const n = pos.length / 3, back = idx.map((v, i) => n + idx[i - (i % 3) + [0, 2, 1][i % 3]]);
      emit('rail', [...pos, ...pos], [...idx, ...back], chunk((a0 + c0) / 2), 1, null);
    }
  }

  // =============================== SAS: CROSSBEAMS, PIERS, TOWER =============================
  for (const s of CROSSBEAMS) {
    if (Math.abs(s - W2) < 3) continue;   // the W2 cap beam is drawn below
    const i = deckEdges(s, 1)[0] + 0.3, y = h(s) - 0.3;
    sweep('steel', s - 5, s + 5, () => [[-i, y], [i, y], [i, y - BOX_DEPTH + 0.4], [-i, y - BOX_DEPTH + 0.4]], { caps: [true, true] });
  }
  // W2: prestressed cap beam across both decks on four columns (two per deck) on Yerba Buena Island.
  {
    const y = h(W2) - 0.3, o = deckEdges(W2, 1)[1] + 0.6;
    sweep('concrete', W2 - 8.3, W2 + 8.3, () => [[-o, y - 0.2], [o + PATH_W, y - 0.2], [o + PATH_W, y - 3], [o - 6, y - 8.5], [-o + 6, y - 8.5], [-o, y - 3]], { caps: [true, true] });
    for (const side of [-1, 1]) for (const off of [-7.5, 7.5]) {
      const d = side * (half(W2) + off), top = y - 8.4;
      pillar('concrete', [{ y: 0, pts: rect(W2, d, 6.5, 6.5, 1.2) }, { y: top, pts: rect(W2, d, 5.0, 5.0, 1.0) }], { ck: 0, lift: (yy) => clamp01(yy / top) });
    }
    if (near) for (const side of [-1, 1]) box('footing', W2, side * half(W2), 0, 2.5, 20, 20, 0, 0);
  }
  // E2: one flared concrete column per deck on a pile cap; the cable is anchored in the deck here.
  for (const side of [-1, 1]) {
    const d = side * (half(E2) + 1.5), top = h(E2) - 0.3 - BOX_DEPTH;
    box('footing', E2, d, 0, 4, 22, 24, 0, 0);
    pillar('concrete', [{ y: 4, pts: rect(E2, d, 7, 12, 1.4) }, { y: top - 9, pts: rect(E2, d, 6.2, 10.5, 1.2) }, { y: top, pts: rect(E2, d, 9, 24, 1.5) }], { ck: 0, lift: (y) => clamp01((y - 4) / (top - 4)) });
  }

  // ---- The tower: four tapered pentagonal steel legs joined by shear links -----------------------
  {
    const fr = frame(T1), q = p.bridgePoint(T1, 0), G = 3.4;
    // Attachment: the foot stays on its ground (the DEM in Full 3D world), from deck level up the tower
    // moves with the deck, so the superstructure keeps its real height above the deck in every mode.
    const towerLift = (y) => clamp01((y - 4) / (h(T1) - 4));
    const A = (y) => 17 - 7 * (y / TOWER_H), B = (y) => 12.4 - 4.6 * (y / TOWER_H);   // envelope along / across
    const W = (u, v) => [q.x + fr.t[0] * u + fr.n[0] * v, q.z + fr.t[1] * u + fr.n[1] * v];
    const leg = (sa, sb, y, k = 1) => {
      const a = (A(y) / 2) * k, w = (B(y) / 2) * k, g = G / 2, ch = Math.min(a - g, w - g) * 0.45;
      const pts = [[g, g], [a, g], [a, w - ch], [a - ch, w], [g, w]];
      const ring = pts.map(([u, v]) => W(sa * u, sb * v));
      return sa * sb > 0 ? ring : ring.reverse();
    };
    box('footing', T1, 0, 0, 4, 26, 21, 0, 0);
    for (const sa of [-1, 1]) for (const sb of [-1, 1]) {
      pillar('steel', [{ y: 4, pts: leg(sa, sb, 4) }, { y: h(T1), pts: leg(sa, sb, h(T1)) }, { y: 146, pts: leg(sa, sb, 146) }, { y: TOWER_H - 0.5, pts: leg(sa, sb, TOWER_H, 0.86) }], { ck: 0, lift: towerLift });
    }
    // Shear links: deep steel beams bridging the open gaps between the legs, every 12 m (24 m far),
    // set at mid-depth of the legs so the gaps read as a ladder from every side. Built in the tower frame.
    const link = (u0, u1, v0, v1, y0, y1) => pillar('steel', [{ y: y0, pts: [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => W(u, v)) }, { y: y1, pts: [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => W(u, v)) }], { top: true, bottom: true, ck: 0, lift: towerLift });
    for (let y = 14; y < 150; y += near ? 12 : 24) {
      const a = A(y) / 2, w = B(y) / 2, g = G / 2, e = 0.6, legU = (g + a) / 2, legV = (g + w) / 2;
      for (const sgn of [-1, 1]) {
        link(sgn * legU - 0.9, sgn * legU + 0.9, -g - e, g + e, y, y + 2.6);   // across the gap between the north and south legs
        link(-g - e, g + e, sgn * legV - 0.9, sgn * legV + 0.9, y, y + 2.6);   // across the gap between the west and east legs
      }
    }
    // Saddle housing at the top between the legs.
    const s0 = W(0, 0);
    b.box('steel', [s0[0], TOWER_H - 4.5, s0[1]], [6.5, 5, 5.2], -Math.atan2(fr.t[1], fr.t[0]));
  }

  // ---- The main cable: one loop in four inclined planes (saddle -> deck edges), and the W2 wrap ------
  const SAD_Y = TOWER_H - 3.2, SAD_D = 0.7;
  const yE = h(E2) + 1.0, yW = h(W2) + 0.4;
  const anchorD = (s) => deckEdges(s, 1)[1] - 0.6;   // suspender line, just inside the box's outer edge
  /** Cable height and lateral at station s on side sgn (main span east of the tower, back span west). */
  function cable(s, sgn) {
    let y;
    if (s >= T1) { const u = clamp01((s - T1) / (E2 - T1)), v = 1 - u; y = yE + (SAD_Y - yE) * (0.92 * v * v + 0.08 * v); }
    else { const u = clamp01((T1 - s) / (T1 - W2)), v = 1 - u; y = yW + (SAD_Y - yW) * (0.4 * v * v + 0.6 * v); }
    const yd = h(s) + 0.6, f = clamp01((y - yd) / (SAD_Y - yd));
    return [sgn * (anchorD(s) + (SAD_D - anchorD(s)) * f), y];
  }
  const R = 0.45, sides = near ? 7 : 4;
  function tube(points, ck = 0) {   // points: [x,y,z][]
    const pos = [], idx = [], n = sides;
    for (let k = 0; k < points.length; k++) {
      const a = new Vector3(...points[Math.max(0, k - 1)]), c = new Vector3(...points[Math.min(points.length - 1, k + 1)]);
      const t = c.sub(a).normalize(), u = new Vector3(0, 1, 0).cross(t).normalize(), v = t.clone().cross(u).normalize();
      for (let i = 0; i < n; i++) { const ang = (i / n) * Math.PI * 2, o = u.clone().multiplyScalar(Math.cos(ang) * R).add(v.clone().multiplyScalar(Math.sin(ang) * R)); pos.push(points[k][0] + o.x, points[k][1] + o.y, points[k][2] + o.z); }
      if (k) for (let i = 0; i < n; i++) { const j = (i + 1) % n, A = (k - 1) * n + i, B = (k - 1) * n + j, C = k * n + j, D = k * n + i; idx.push(A, C, B, A, D, C); }
    }
    // outward check on the first quad
    const p0 = new Vector3(...points[0]), first = new Vector3(pos[0], pos[1], pos[2]);
    emit('cable', pos, idx, ck, 1, { dir: first.clone().sub(p0), tri: idx.slice(0, 3) });
  }
  const NS = near ? 26 : 10;
  for (const sgn of [-1, 1]) {
    for (const [a, c] of [[T1, E2], [T1, W2]]) {
      const pts = [];
      for (let k = 0; k <= NS; k++) { const s = a + (c - a) * Math.pow(k / NS, 0.85); const [d, y] = cable(s, sgn); pts.push(P(s, d, y)); }
      tube(pts);
    }
  }
  // The wrap: from each deck edge at W2 down around the west end of the decks and under them.
  {
    const s = W2 - 9.6, top = h(W2) + 0.4, o = anchorD(W2), depth = 10.5, pts = [];
    pts.push(P(W2, -o, yW));
    for (let k = 0; k <= (near ? 18 : 8); k++) { const t = Math.PI * (k / (near ? 18 : 8)); pts.push(P(s, -o * Math.cos(t), top - 1.2 - depth * Math.sin(t))); }
    pts.push(P(W2, o, yW));
    tube(pts);
  }
  // Suspenders every 10 m from the cable to the outer box edges (far: every other one).
  const step = near ? 10 : 20;
  for (const sgn of [-1, 1]) {
    for (let s = T1 + 10; s < E2 - 5; s += step) {
      const [d, y] = cable(s, sgn), yd = h(s) + 0.6;
      if (y - yd < 1.2) continue;
      bar('cable', P(s, d, y), P(s, sgn * anchorD(s), yd), 0.13, 0);
    }
    for (let s = T1 - 10; s > W2 + 4; s -= step) {
      const [d, y] = cable(s, sgn), yd = h(s) + 0.6;
      if (y - yd < 1.2) continue;
      bar('cable', P(s, d, y), P(s, sgn * anchorD(s), yd), 0.13, 0);
    }
  }

  // =============================== SKYWAY PIERS AND TOUCHDOWN BENTS ==========================
  for (const s of PIERS) for (const side of [-1, 1]) {
    const [i, o] = deckEdges(s, side), d = (i + o) / 2, top = h(s) - 0.28 - girderDepth(s) + 0.1, ck = chunk(s);
    box('footing', s, d, 0, 3.5, 13, 19, ck, 0);
    // Column: four corner piers joined by shear walls (chamfered rectangle), flaring into the pier table.
    pillar('concrete', [{ y: 3.5, pts: rect(s, d, 5.2, 9.2, 1.3) }, { y: top - 7, pts: rect(s, d, 5.2, 9.2, 1.3) }, { y: top, pts: rect(s, d, 8.5, 15.5, 1.6) }],
      { ck, top: false, lift: (y) => clamp01((y - 3.5) / (top - 3.5)) });
  }
  for (let s = SKYWAY_END + 45; s < L; s += 45) for (const side of [-1, 1]) {
    const [i, o] = deckEdges(s, side), d = (i + o) / 2, top = h(s) - 0.28 - girderDepth(s) + 0.1;
    if (top < MIN_CLEAR) continue;
    pillar('concrete', [{ y: 0, pts: rect(s, d, 3.2, 6.0, 0.9) }, { y: top, pts: rect(s, d, 3.2, 9.0, 0.9) }], { ck: chunk(s), top: false, lift: (y) => clamp01(y / top) });
  }
  return b.finish();
}
