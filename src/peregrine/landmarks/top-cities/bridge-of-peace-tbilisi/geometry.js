// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  LENGTH, RAMP_W, RAMP_E, deckY, halfWidth, point, toStation, canopySection, ribPoint, envelope,
  STAIRS, STAIR_WIDTH, PIERS,
} from './bridge-of-peace-tbilisi-parts.js';

// Closed longitudinal loft, one flat-shaded prism: the section is [d, y] pairs listed clockwise as seen towards
// increasing station (left-upper first). `omit` drops edges whose faces are hidden or would be coplanar.
function loft(b, mat, ss, section, omit = []) {
  const pos = [], ix = [];
  let n = 0;
  for (const s of ss) { const sec = section(s); n = sec.length; for (const [d, y] of sec) pos.push(...point(s, d, Math.max(0, y))); } // nothing below grade
  for (let i = 1; i < ss.length; i++) {
    for (let k = 0; k < n; k++) {
      if (omit.includes(k)) continue;
      const a = (i - 1) * n + k, c = (i - 1) * n + (k + 1) % n, d = i * n + k, e = i * n + (k + 1) % n;
      ix.push(a, c, d, c, e, d);
    }
  }
  for (let k = 1; k < n - 1; k++) ix.push(0, k + 1, k);
  const last = (ss.length - 1) * n;
  for (let k = 1; k < n - 1; k++) ix.push(last, last + k, last + k + 1);
  // Where the girder is clamped to grade at the landings its faces collapse: drop those zero-area slivers.
  const keep = [], va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3();
  for (let i = 0; i < ix.length; i += 3) {
    va.fromArray(pos, ix[i] * 3); vb.fromArray(pos, ix[i + 1] * 3); vc.fromArray(pos, ix[i + 2] * 3);
    if (vb.sub(va).cross(vc.sub(va)).lengthSq() > 1e-8) keep.push(ix[i], ix[i + 1], ix[i + 2]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(keep);
  const flat = g.toNonIndexed();
  flat.computeVertexNormals();
  b.put(flat, mat);
}

// Flat triangles with an explicit outward hint, so winding never depends on the order the corners were listed.
function tris(list) {
  const pos = [];
  for (const [a, c, d, hint] of list) {
    const n = new THREE.Vector3().subVectors(new THREE.Vector3(...c), new THREE.Vector3(...a)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...d), new THREE.Vector3(...a)));
    if (n.lengthSq() < 1e-8) continue;
    if (n.dot(new THREE.Vector3(...hint)) < 0) pos.push(...a, ...d, ...c); else pos.push(...a, ...c, ...d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

// A flight of solid steps from foot F (y = 0) up to T (y = yTop), `n` risers, `w` wide. One prism: treads, risers, sides.
function flight(b, mat, F, T, yTop, w, n) {
  const dx = T[0] - F[0], dz = T[1] - F[1], len = Math.hypot(dx, dz), ex = dx / len, ez = dz / len, lx = -ez, lz = ex;
  const at = (t, d, y) => [F[0] + ex * t + lx * d, y, F[1] + ez * t + lz * d];
  const dt = len / n, dh = yTop / n, hw = w / 2, list = [];
  const up = [0, 1, 0], down = [-ex, 0, -ez], left = [-lx, 0, -lz], right = [lx, 0, lz];
  for (let k = 0; k < n; k++) {
    const t0 = k * dt, t1 = t0 + dt, y0 = k * dh, y1 = y0 + dh;
    list.push([at(t0, -hw, y1), at(t1, -hw, y1), at(t1, hw, y1), up], [at(t0, -hw, y1), at(t1, hw, y1), at(t0, hw, y1), up]); // tread
    list.push([at(t0, -hw, y0), at(t0, hw, y0), at(t0, hw, y1), down], [at(t0, -hw, y0), at(t0, hw, y1), at(t0, -hw, y1), down]); // riser
    list.push([at(t0, -hw, 0), at(t1, -hw, 0), at(t1, -hw, y1), left], [at(t0, -hw, 0), at(t1, -hw, y1), at(t0, -hw, y1), left]);
    list.push([at(t0, hw, 0), at(t1, hw, 0), at(t1, hw, y1), right], [at(t0, hw, 0), at(t1, hw, y1), at(t0, hw, y1), right]);
  }
  list.push([at(len, -hw, 0), at(len, hw, 0), at(len, hw, yTop), [ex, 0, ez]], [at(len, -hw, 0), at(len, hw, yTop), at(len, -hw, yTop), [ex, 0, ez]]);
  b.put(tris(list), mat);
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), contacts = [];
  // Every thin member records its two terminals and the materials that must hold them (see the landmark test).
  const member = (id, mat, a, c, width, supportsA, supportsC, tolA, tolC = tolA) => {
    b.bar(mat, a, c, width, width, 0, true);
    contacts.push({ id, material: mat, a, c, supportsA, supportsC, tolA, tolC });
  };

  // Stations: every 3 m (near) / 9 m (far) plus the ramp breakpoints, so the deck profile is exact.
  const step = near ? 3 : 9;
  const ss = [...new Set([0, LENGTH, RAMP_W, LENGTH - RAMP_E, ...Array.from({ length: Math.floor(LENGTH / step) }, (_, i) => (i + 1) * step)])].sort((x, y) => x - y);
  const hw = halfWidth, Y = deckY, env = envelope;

  // ---- Deck: white box girder, 0.85 m vertical fascia then a chamfer, deeper mid-river; walking surface on top.
  const girder = (s) => {
    const w = hw(s), yt = Y(s) - 0.1, bot = yt - (1.0 + 0.4 * env(s));
    return [[-w, yt], [w, yt], [w, yt - 0.85], [w - 1.0, bot], [-(w - 1.0), bot], [-w, yt - 0.85]];
  };
  loft(b, 'deck', ss, girder);
  loft(b, 'walk', ss, (s) => { const w = hw(s) - 0.1, y = Y(s); return [[-w, y], [w, y], [w, y - 0.1], [-w, y - 0.1]]; }, [2]);
  // Warm LED lines under the girder edges, 0.1 m proud of the soffit.
  for (const side of [-1, 1]) {
    loft(b, 'lamp', ss, (s) => {
      const w = hw(s) - 1.0, bot = Y(s) - 0.1 - (1.0 + 0.4 * env(s)), d0 = side * (w - 0.5), d1 = side * (w - 0.2), lo = Math.min(d0, d1), hi = Math.max(d0, d1);
      return [[lo, bot - 0.1], [hi, bot - 0.1], [hi, bot], [lo, bot]];
    }, [2]);
  }

  // ---- Stairs: four flights of the two V landings (OSM steps), each from the deck fascia down to grade.
  const stairInfo = STAIRS.map((st) => {
    const { s: sa } = toStation(st.apex[0], st.apex[1]);
    // Walk from the apex along the stair until its centre is 1.3 m beyond the fascia, so the top tread tucks under the deck edge.
    const dx = st.foot[0] - st.apex[0], dz = st.foot[1] - st.apex[1], len = Math.hypot(dx, dz);
    let t = 0;
    for (; t < len; t += 0.1) { const q = toStation(st.apex[0] + dx * t / len, st.apex[1] + dz * t / len); if (Math.abs(q.d) >= hw(q.s) + 1.3) break; }
    const top = [st.apex[0] + dx * t / len, st.apex[1] + dz * t / len], q = toStation(top[0], top[1]);
    return { ...st, top, sTop: q.s, dTop: q.d, yTop: Y(q.s) - 0.15, sa };
  });
  for (const st of stairInfo) {
    const n = near ? Math.round(st.yTop / 0.15) : Math.max(6, Math.round(st.yTop / 0.6));
    flight(b, 'stair', st.foot, st.top, st.yTop, STAIR_WIDTH, n);
    contacts.push({ id: `stair-${st.id}`, material: 'stair', a: [st.top[0], st.yTop - 0.05, st.top[1]], c: [st.foot[0], 0.05, st.foot[1]], supportsA: ['deck'], supportsC: ['stair'], tolA: 1.6, tolC: 0.2 });
  }

  // ---- Glass parapets along both deck edges, interrupted where the flights come up; handrail on top.
  const gaps = stairInfo.map((st) => [Math.sign(st.dTop), st.sTop - 2.9, st.sTop + 2.9]);
  for (const side of [-1, 1]) {
    const cuts = gaps.filter((g) => g[0] === side).map((g) => [g[1], g[2]]).sort((x, y) => x[0] - y[0]);
    const spans = []; let from = 0;
    for (const [c0, c1] of cuts) { spans.push([from, c0]); from = c1; }
    spans.push([from, LENGTH]);
    for (const [s0, s1] of spans) {
      const part = ss.filter((s) => s > s0 && s < s1);
      const list = [s0, ...part, s1];
      const dd = (s) => side * (hw(s) - 0.14);
      loft(b, 'glass', list, (s) => [[dd(s) - 0.025, Y(s) + 1.1], [dd(s) + 0.025, Y(s) + 1.1], [dd(s) + 0.025, Y(s) + 0.05], [dd(s) - 0.025, Y(s) + 0.05]], [0, 2]);
      loft(b, 'rail', list, (s) => [[dd(s) - 0.05, Y(s) + 1.18], [dd(s) + 0.05, Y(s) + 1.18], [dd(s) + 0.05, Y(s) + 1.1], [dd(s) - 0.05, Y(s) + 1.1]], [2]);
    }
  }

  // ---- Canopy: sheared elliptical ribs on a grid of stations x arc points, joined by a diamond lattice.
  const NS = near ? 48 : 16, M = near ? 18 : 10, JC = M / 2;
  const P = [];
  for (let i = 0; i <= NS; i++) { const s = i * LENGTH / NS; P.push(Array.from({ length: M + 1 }, (_, j) => ribPoint(s, j / M))); }
  const rr = near ? 0.25 : 0.36, longR = near ? [0.34, 0.46] : [0.42, 0.56], dr = near ? 0.07 : 0.12;
  const grown = (s) => canopySection(s).b > 0.35;
  for (let i = 0; i <= NS; i++) {
    if (!grown(i * LENGTH / NS)) continue;
    for (let j = 0; j < M; j++) member(`rib-${i}-${j}`, 'steel', P[i][j], P[i][j + 1], rr, j === 0 ? ['deck'] : ['joint'], j === M - 1 ? ['deck'] : ['joint'], 0.6);
  }
  // Longitudinal tubes along both feet and the crest; the three ends of the lens rest on the landing decks.
  for (let i = 0; i < NS; i++) for (const [j, w] of [[0, longR[0]], [JC, longR[1]], [M, longR[0]]]) {
    member(`long-${i}-${j}`, 'tube', P[i][j], P[i + 1][j], w, i === 0 ? ['deck'] : ['joint'], i === NS - 1 ? ['deck'] : ['joint'], 0.65);
  }
  // The wavy hem: the free edge of the glazing swings up and down the south flank, the real bridge's signature S-curve.
  const hemU = (s) => 0.3 + 0.17 * Math.sin(2 * Math.PI * 1.5 * (s / LENGTH) + 1.0);
  const hemStations = Array.from({ length: (near ? 64 : 24) + 1 }, (_, i) => i * LENGTH / (near ? 64 : 24));
  for (let i = 0; i < hemStations.length - 1; i++) {
    const s0 = hemStations[i], s1 = hemStations[i + 1];
    if (!grown(s0) && !grown(s1)) continue;
    member(`hem-${i}`, 'tube', ribPoint(s0, hemU(s0)), ribPoint(s1, hemU(s1)), near ? 0.42 : 0.5, i === 0 || !grown(s0) ? ['deck'] : ['joint'], i === hemStations.length - 2 || !grown(s1) ? ['deck'] : ['joint'], 0.7);
  }
  for (let i = 0; i < NS; i++) for (let j = 0; j < M; j++) {
    if (!grown(i * LENGTH / NS) && !grown((i + 1) * LENGTH / NS)) continue;
    const even = (i + j) % 2 === 0, a = even ? P[i][j] : P[i][j + 1], c = even ? P[i + 1][j + 1] : P[i + 1][j];
    const ribbed = (k) => grown(k * LENGTH / NS);
    member(`diag-${i}-${j}`, 'glow', a, c, dr, ribbed(i) ? ['joint'] : ['deck'], ribbed(i + 1) ? ['joint'] : ['deck'], 0.6);
  }
  // Glass above the hem and over the crest to the north foot, offset inward so it clears the tubes.
  const glass = [];
  for (let i = 0; i < NS; i++) {
    const sm = (i + 0.5) * LENGTH / NS, j0 = Math.max(JC - 3, Math.ceil(hemU(sm) * M));
    for (let j = j0; j < M - 1; j++) {
      const q = [P[i][j], P[i + 1][j], P[i + 1][j + 1], P[i][j + 1]];
      const c = canopySection(sm), ctr = point(sm, c.k * c.b * 0.4, c.base + c.b * 0.35);
      const cent = q.reduce((m, v) => m.map((x, k) => x + v[k] / 4), [0, 0, 0]);
      const nrm = new THREE.Vector3(...q[1]).sub(new THREE.Vector3(...q[0])).cross(new THREE.Vector3(...q[3]).sub(new THREE.Vector3(...q[0])));
      if (nrm.length() < 0.5) continue;
      nrm.normalize();
      if (nrm.dot(new THREE.Vector3(...ctr).sub(new THREE.Vector3(...cent))) > 0) nrm.negate(); // nrm now points OUT of the canopy
      // Two thin sheets 4 cm apart: the outer faces out, the inner faces in, so the roof is solid from the road and from under it.
      for (const [off, sign] of [[0.4, 1], [0.44, -1]]) {
        const o = q.map((v) => [v[0] - nrm.x * off, v[1] - nrm.y * off, v[2] - nrm.z * off]), hint = nrm.clone().multiplyScalar(sign).toArray();
        glass.push([o[0], o[1], o[2], hint], [o[0], o[2], o[3], hint]);
      }
    }
  }
  b.put(tris(glass), 'glass');

  // ---- Piers: two white A-frames under the deck, feet on small plinths at grade.
  for (const sp of PIERS) {
    const w = hw(sp), yb = Y(sp) - 0.1 - (1.0 + 0.4 * env(sp));
    for (const side of [-1, 1]) for (const k of [-1, 1]) {
      const top = point(sp + k * 0.6, side * (w - 1.0), yb + 0.12), foot = point(sp + k * 3.4, side * (w + 1.5), 0.3);
      member(`pier-${sp.toFixed(0)}-${side}-${k}`, 'steel', top, foot, near ? 0.42 : 0.5, ['deck'], ['stair'], 0.6, 0.8);
      const f = point(sp + k * 3.4, side * (w + 1.5), 0), plinth = [f[0], 0.2, f[2]];
      b.box('stair', plinth, [1.6, 0.4, 1.6], Math.atan2(point(1, 0)[2] - point(0, 0)[2], point(1, 0)[0] - point(0, 0)[0]) * -1);
    }
    for (const k of [-1, 1]) {
      const a = point(sp + k * 0.6, -(w - 1.0), yb - 0.2), c = point(sp + k * 0.6, w - 1.0, yb - 0.2);
      b.bar('deck', a, c, 0.5, 0.45, 0, false); // cross-beam, top 0.05 inside the soffit
    }
  }

  const model = b.finish();
  model.userData.contacts = contacts;
  model.userData.stairs = stairInfo.map(({ id, top, foot, yTop }) => ({ id, top, foot, yTop }));
  return model;
}
