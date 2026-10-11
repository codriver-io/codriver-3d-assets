import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, materialFor } from './config.js';
import { OUTLINE, HOTEL, RING_TOP, ROOF, site } from './rogers-centre-site.js';
import { halfWidth, roofHeight } from './rogers-centre-roof.js';
import { wordSegments } from './rogers-centre-letters.js';

// Rogers Centre with the roof closed: a 32 m concrete ring on the mapped envelope, the
// hotel's glass terraces on the north end, the low glass canopy round the south gates,
// the two leaning prows with their sculpture ledges, and the four white roof panels
// (fixed north cap, two sliding arches, rotating south cap) nested so each one further
// north stands proud of its neighbour, with south-facing steps, ribs, rails, and blue
// rim lights. Authored in (u east-ish, y up, v south-ish) and rotated by site() into the
// exported +X east, +Y up, +Z south. Real metres, y = 0 at the street.
const EDGE_MIN = 3.5, LEAN = 9, WALL_R = 99.6;

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // Every material goes through the draw-budget fold (config.js FOLD): near is unchanged, far shares draws.
  const { put: put0, box: box0, bar: bar0 } = b, fold = (m) => materialFor(m, detail);
  b.put = (g, m, ...rest) => put0(g, fold(m), ...rest); b.box = (m, ...rest) => box0(fold(m), ...rest); b.bar = (m, ...rest) => bar0(fold(m), ...rest);
  const { R } = ROOF;

  // ---- small geometry helpers ------------------------------------------------------
  // Winding is fixed against a direction the surface must face, so no face is inside out.
  function build(positions, indices, faceDir, mat) {
    if (faceDir) {
      for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i] * 3, c = indices[i + 1] * 3, d = indices[i + 2] * 3;
        const ux = positions[c] - positions[a], uy = positions[c + 1] - positions[a + 1], uz = positions[c + 2] - positions[a + 2];
        const vx = positions[d] - positions[a], vy = positions[d + 1] - positions[a + 1], vz = positions[d + 2] - positions[a + 2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        if (Math.hypot(nx, ny, nz) < 1e-9) continue;
        if (nx * faceDir[0] + ny * faceDir[1] + nz * faceDir[2] < 0) for (let k = 0; k < indices.length; k += 3) { const t = indices[k + 1]; indices[k + 1] = indices[k + 2]; indices[k + 2] = t; }
        break;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices); g.computeVertexNormals(); b.put(g, mat, 0, 0);
  }
  // A grid of world points rows[i][j], quads joined i to i+1 and j to j+1.
  function grid(mat, rows, faceDir) {
    const w = rows[0].length, positions = [], indices = [];
    for (const row of rows) for (const p of row) positions.push(...p);
    for (let i = 0; i + 1 < rows.length; i++) for (let j = 0; j + 1 < w; j++) {
      const a = i * w + j, c = a + 1, d = a + w, e = d + 1;
      indices.push(a, d, c, c, d, e);
    }
    build(positions, indices, faceDir, mat);
  }
  const strip = (mat, lower, upper, faceDir) => grid(mat, [lower, upper], faceDir);
  const W = (u, y, v) => site(u, y, v);
  const faceOf = (n2, up = 0) => { const [x, , z] = site(n2[0], 0, n2[1]); return [x, up, z]; };
  const angleOfUV = (t) => { const [x, , z] = site(t[0], 0, t[1]); return -Math.atan2(z, x); };
  const box = (mat, at, size, angle = 0) => b.box(mat, at, size, angle, 0, 0);
  const rnd = (i, k, salt = 0) => { const x = Math.sin(i * 127.1 + k * 311.7 + salt * 74.7) * 43758.5453; return x - Math.floor(x); };
  // A vertical prism over an (u, v) ring of positive area (outward = right of travel).
  function prism(ring, y0, y1, wallMat, capMat) {
    const n = ring.length, positions = [], indices = [];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, dx = ring[j][0] - ring[i][0], dv = ring[j][1] - ring[i][1], L = Math.hypot(dx, dv) || 1;
      positions.push(...W(ring[i][0], y0, ring[i][1]), ...W(ring[j][0], y0, ring[j][1]), ...W(ring[j][0], y1, ring[j][1]), ...W(ring[i][0], y1, ring[i][1]));
      build(positions.slice(i * 12, i * 12 + 12), [0, 1, 2, 0, 2, 3], faceOf([dv / L, -dx / L]), wallMat); // faced per wall, merged by put()
    }
    if (capMat) {
      const tri = THREE.ShapeUtils.triangulateShape(ring.map(([u, v]) => new THREE.Vector2(u, v)), []);
      const tp = [], ti = [];
      for (const [u, v] of ring) tp.push(...W(u, y1, v));
      for (const t of tri) ti.push(t[0], t[1], t[2]);
      build(tp, ti, [0, 1, 0], capMat);
    }
  }
  const area = (r) => { let s = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) s += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return s / 2; };

  // ---- the plan ring -------------------------------------------------------------------
  // The mapped south arc (r 104) is the outer edge of the glass canopy; the concrete face
  // stands 4.4 m inside it, right under the roof edge, as in the photographs.
  const isArc = ([u, v]) => v > 40 && Math.hypot(u, v) > 103 && Math.hypot(u, v) < 106.5;
  const isGateBlock = ([u, v]) => v > 106;
  const inset = ([u, v]) => { const r = Math.hypot(u, v); return [u * WALL_R / r, v * WALL_R / r]; };
  const ring = [];
  let gateDone = false;
  for (const p of OUTLINE) {
    if (isGateBlock(p)) { if (!gateDone) { for (const u of [10, 0, -10]) ring.push(inset([u, 105])); gateDone = true; } continue; }
    ring.push(isArc(p) ? inset(p) : p.slice());
  }
  const N = ring.length;
  const edges = ring.map((p, i) => {
    const q = ring[(i + 1) % N], dx = q[0] - p[0], dv = q[1] - p[1], L = Math.hypot(dx, dv);
    return { i, p, q, L, t: [dx / L, dv / L], n: [dv / L, -dx / L] };
  });
  let total = 0; for (const e of edges) { e.s0 = total; total += e.L; }
  const wallAt = (s) => {
    s = ((s % total) + total) % total;
    const e = edges.find((x) => s >= x.s0 && s < x.s0 + x.L) || edges[0], f = (s - e.s0) / e.L;
    return { p: [e.p[0] + (e.q[0] - e.p[0]) * f, e.p[1] + (e.q[1] - e.p[1]) * f], t: e.t, n: e.n };
  };
  const nearestS = (u, v) => {
    let best = Infinity, bs = 0;
    for (const e of edges) {
      const f = Math.max(0, Math.min(1, ((u - e.p[0]) * e.t[0] + (v - e.p[1]) * e.t[1]) / e.L));
      const d = Math.hypot(u - e.p[0] - e.t[0] * f * e.L, v - e.p[1] - e.t[1] * f * e.L);
      if (d < best) { best = d; bs = e.s0 + f * e.L; }
    }
    return bs;
  };
  // A box standing on a wall edge: s along the edge, yc centre height, d the centre's offset
  // along the outward normal, w along the wall, h tall, thick through the wall.
  function wbox(mat, e, s, yc, d, w, h, thick) {
    const u = e.p[0] + e.t[0] * s + e.n[0] * d, v = e.p[1] + e.t[1] * s + e.n[1] * d;
    box(mat, W(u, yc, v), [w, h, thick], angleOfUV(e.t));
  }

  // ---- 1. the concrete ring, prows leaning back ---------------------------------------
  const top = ring.map((p) => p.slice());
  const prowEdge = new Map(); // ring index of the prow vertex -> its main facet edge
  for (const [pu, pv] of [[-94.5, 60.9], [96.0, 60.9]]) {
    const i = ring.findIndex(([u, v]) => Math.hypot(u - pu, v - pv) < 0.6);
    if (i < 0) continue;
    // the facet runs toward the south arc: the longer neighbour of vertex i
    const a = edges[i], c = edges[(i + N - 1) % N], facet = a.L > c.L ? a : c;
    const j = facet.i, k = (facet.i + 1) % N;
    for (const m of [j, k]) if (Math.hypot(ring[m][0], ring[m][1]) > 105) { top[m][0] -= facet.n[0] * LEAN; top[m][1] -= facet.n[1] * LEAN; }
    prowEdge.set(facet.i, facet);
  }
  {
    const positions = [], indices = [];
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      positions.push(...W(ring[i][0], 0, ring[i][1]), ...W(ring[j][0], 0, ring[j][1]), ...W(top[j][0], RING_TOP, top[j][1]), ...W(top[i][0], RING_TOP, top[i][1]));
    }
    // each wall faced outward on its own, then merged
    for (let i = 0; i < N; i++) build(positions.slice(i * 12, i * 12 + 12), [0, 1, 2, 0, 2, 3], faceOf(edges[i].n, prowEdge.has(i) ? 0.3 : 0), 'concrete');
    const tri = THREE.ShapeUtils.triangulateShape(top.map(([u, v]) => new THREE.Vector2(u, v)), []);
    const tp = [], ti = [];
    for (const [u, v] of top) tp.push(...W(u, RING_TOP, v));
    for (const t of tri) ti.push(t[0], t[1], t[2]);
    build(tp, ti, [0, 1, 0], 'concrete_dark');
  }
  // the south gate block: the 20 m entrance core the map shows at the apex of the arc
  const gate = [[-20.8, 107.9], [-0.8, 109.9], [1.9, 110.2], [22.8, 108.0], [20.9, 97.4], [-19.3, 97.7]];
  const gateRing = area(gate) < 0 ? gate.slice().reverse() : gate;
  prism(gateRing, 0, 20, 'concrete', 'concrete_dark');

  // ---- 2. facade rhythm on the outer walls ----------------------------------------------
  const LEDGES = [6.5, 13, 19.5, 26];
  const facade = (e, h = RING_TOP, ledges = LEDGES) => {
    const nb = Math.max(1, Math.round(e.L / 10.5)), bay = e.L / nb, gateSide = (e.p[1] + e.q[1]) / 2 > 40;
    for (const y of ledges) wbox('concrete', e, e.L / 2, y, 0.2, e.L, 0.6, 0.55);
    wbox('concrete', e, e.L / 2, h + 0.5, -0.05, e.L, 1, 0.7);
    for (let k = 0; k <= nb; k++) wbox('concrete', e, k * bay, h / 2 + 0.4, 0.3, 0.9, h + 0.4, 0.6);
    if (!near) return;
    for (let k = 0; k < nb; k++) {
      const s = (k + 0.5) * bay, w = bay - 1.9, r = rnd(e.i + h, k), r2 = rnd(e.i + h, k, 2), lit = gateSide && r > 0.25;
      wbox(lit ? 'glow' : 'concrete_dark', e, s, 3.3, 0.15, w, 5.8, 0.4);
      if (lit) for (const m of [-0.5, 0.5]) wbox('concrete', e, s + m * w / 2.2, 3.3, 0.35, 0.22, 5.92, 0.4); // posts run 6 cm past the glazing: no shared plane
      const band = (y0, y1, pWin, pLouvre) => {
        if (y1 > h) return;
        const yc = (y0 + y1) / 2, bh = y1 - y0, q = rnd(e.i + h, k, y0);
        if (q < pWin) {
          wbox(q < pWin * 0.3 && y0 < 15 ? 'glow' : 'glass', e, s, yc, 0.15, w, bh, 0.4);
          for (const m of [-0.5, 0, 0.5]) wbox('concrete', e, s + m * (w - 0.1), yc, 0.32, 0.2, bh + 0.12, 0.3); // mullions and transom overlap the glazing by a hand,
          wbox('concrete', e, s, yc, 0.32, w + 0.12, 0.2, 0.3); // so none of their faces lies in the glass's plane
        } else if (q < pWin + pLouvre) {
          wbox('louvre', e, s, yc, 0.15, w, bh, 0.4);
          for (const m of [-0.25, 0.25]) wbox('concrete_dark', e, s, yc + m * bh, 0.36, w - 0.4, 0.18, 0.2);
        } else if (r2 > 0.55) wbox('concrete_dark', e, s, yc, 0.1, w * 0.7, bh * 0.55, 0.3);
      };
      band(7.4, 12.2, 0.55, 0.25); band(13.9, 18.6, 0.25, 0.3); band(20.3, 25.2, 0.15, 0.55); band(26.7, 31.2, 0.0, 0.55);
    }
  };
  for (const e of edges) if (e.L >= EDGE_MIN && !prowEdge.has(e.i) && !prowEdge.has((e.i + N - 1) % N) && !prowEdge.has((e.i + 1) % N)) facade(e);
  // gate block facade (20 m): its four outer faces
  for (let i = 0; i < gateRing.length; i++) {
    const p = gateRing[i], q = gateRing[(i + 1) % gateRing.length], dx = q[0] - p[0], dv = q[1] - p[1], L = Math.hypot(dx, dv);
    if (L < EDGE_MIN || (p[1] < 100 && q[1] < 100)) continue;
    facade({ i: 200 + i, p, q, L, t: [dx / L, dv / L], n: [dv / L, -dx / L] }, 20, [6.5, 13]);
  }

  // ---- 3. the glass canopy round the south gates ----------------------------------------
  {
    const arcs = OUTLINE.filter(isArc);
    const east = arcs.filter((p) => p[0] > 0).sort((a, c) => a[0] - c[0]).reverse(), west = arcs.filter((p) => p[0] < 0).sort((a, c) => a[0] - c[0]);
    for (const list of [east, west]) {
      for (let i = 0; i + 1 < list.length; i++) {
        const o0 = list[i], o1 = list[i + 1], i0 = inset(o0), i1 = inset(o1);
        const rows = [[W(i0[0], 7.5, i0[1]), W(i1[0], 7.5, i1[1])], [W(o0[0], 6.3, o0[1]), W(o1[0], 6.3, o1[1])]];
        grid('glass', rows, [0, 1, 0]);
        strip('steel', [W(o0[0], 5.7, o0[1]), W(o1[0], 5.7, o1[1])], [W(o0[0], 6.35, o0[1]), W(o1[0], 6.35, o1[1])], faceOf([o0[0] / Math.hypot(...o0), o0[1] / Math.hypot(...o0)]));
        if (near) {
          const mu = (o0[0] + o1[0]) / 2, mv = (o0[1] + o1[1]) / 2, mi = [(i0[0] + i1[0]) / 2, (i0[1] + i1[1]) / 2];
          b.bar('steel', W(mu, 6.2, mv), W(mi[0], 10.5, mi[1]), 0.16, 0.16, 0, false, 0);
        }
      }
    }
  }

  // ---- 4. the leaning prows: panels in the slanted plane, sculpture ledges ----------------
  const facetPoint = (facet, f, y, off = 0) => {
    const bu = facet.p[0] + (facet.q[0] - facet.p[0]) * f, bv = facet.p[1] + (facet.q[1] - facet.p[1]) * f;
    const tu = top[facet.i][0] + (top[(facet.i + 1) % N][0] - top[facet.i][0]) * f, tv = top[facet.i][1] + (top[(facet.i + 1) % N][1] - top[facet.i][1]) * f;
    const k = y / RING_TOP;
    return W(bu + (tu - bu) * k + facet.n[0] * off, y, bv + (tv - bv) * k + facet.n[1] * off);
  };
  const facetQuad = (mat, facet, f0, f1, y0, y1, off) => {
    const pts = [facetPoint(facet, f0, y0, off), facetPoint(facet, f1, y0, off), facetPoint(facet, f1, y1, off), facetPoint(facet, f0, y1, off)];
    build(pts.flat(), [0, 1, 2, 0, 2, 3], faceOf(facet.n, 0.3), mat);
  };
  for (const facet of prowEdge.values()) {
    facetQuad('jays', facet, 0.06, 0.62, 0, 8.5, 0.12);
    { // the team mark, simplified: white jay's head facing left, dark beak and eye, red maple leaf
      const at = ([x, y], off) => facetPoint(facet, 0.62 - x / facet.L, y, off);
      const poly = (mat, pts, off) => {
        const tri = THREE.ShapeUtils.triangulateShape(pts.map(([x, y]) => new THREE.Vector2(x, y)), []);
        build(pts.flatMap((p) => at(p, off)), tri.flat(), faceOf(facet.n, 0.3), mat);
      };
      poly('roof', [[0.9, 4.5], [2.4, 4.9], [3.0, 6.3], [3.9, 7.5], [4.6, 6.8], [5.2, 7.9], [5.9, 6.9], [6.7, 7.4], [6.9, 5.9], [7.8, 4.6], [7.6, 2.4], [5.6, 1.2], [3.8, 2.4], [2.5, 3.6], [1.0, 4.0]], 0.2);
      poly('concrete_dark', [[0.9, 4.5], [2.6, 4.95], [2.5, 3.7], [1.0, 4.0]], 0.26);
      poly('concrete_dark', [[3.3, 5.3], [3.8, 5.3], [3.8, 5.8], [3.3, 5.8]], 0.26);
      const leaf = []; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, r = i % 2 ? 0.42 : 0.95; leaf.push([8.45 + Math.sin(a) * r, 1.7 + Math.cos(a) * r]); }
      poly('sign', leaf, 0.24);
    }
    facetQuad('glass', facet, 0.12, 0.88, 10.2, 15.6, 0.12);
    for (const y of [10.2, 15.6]) facetQuad('concrete', facet, 0.1, 0.9, y - 0.3, y + 0.3, 0.3);
    facetQuad('concrete_dark', facet, 0.1, 0.9, 27.4, 27.9, 0.2);
    if (!near) continue;
    // two cantilevered ledges and the bronze crowd leaning out of them
    for (const [y, cnt] of [[19.4, 4], [25.0, 4]]) {
      const c = facetPoint(facet, 0.5, y, 0), [tx, , tz] = site(facet.t[0], 0, facet.t[1]), [nx, , nz] = site(facet.n[0], 0, facet.n[1]);
      const ang = -Math.atan2(tz, tx);
      box('concrete', [c[0] + nx * 2.2, y, c[2] + nz * 2.2], [11.5, 1.3, 4.6], ang);
      const TV = new THREE.Vector3(tx, 0, tz), NV = new THREE.Vector3(nx, 0, nz), UP = new THREE.Vector3(0, 1, 0), AX = new THREE.Vector3().crossVectors(UP, NV).normalize();
      for (let k = 0; k < cnt; k++) { // a leaning spectator: tapered torso, head, cap, one arm up and one out
        const s = (k - (cnt - 1) / 2) * 2.7, q = rnd(y, k), lean = 0.32 + q * 0.3, side = k % 2 ? 1 : -1;
        const base = new THREE.Vector3(c[0] + tx * s + nx * 2.7, y + 0.65, c[2] + tz * s + nz * 2.7);
        const up = (h) => UP.clone().multiplyScalar(h).applyAxisAngle(AX, lean).add(base);
        const torso = new THREE.CylinderGeometry(0.62, 0.9, 2.5, 8, 1);
        torso.translate(0, 1.25, 0); torso.applyMatrix4(new THREE.Matrix4().makeRotationAxis(AX, lean)); torso.translate(base.x, base.y, base.z);
        b.put(torso, 'bronze', 0, 0);
        const head = new THREE.SphereGeometry(0.66, 8, 6), hp = up(3.15); head.translate(hp.x, hp.y, hp.z); b.put(head, 'bronze', 0, 0);
        if (k % 3 !== 1) box('bronze', [hp.x + NV.x * 0.45, hp.y + 0.55, hp.z + NV.z * 0.45], [1.1, 0.22, 1.1], ang); // cap brim
        const shoulder = up(2.25);
        const arm = (dx, dy, dn, w = 0.42) => b.bar('bronze', shoulder.clone().addScaledVector(TV, side * 0.75).toArray(), shoulder.clone().addScaledVector(TV, side * (0.75 + dx)).addScaledVector(NV, dn).add(UP.clone().multiplyScalar(dy)).toArray(), w, w, 0, false, 0);
        arm(0.5, 2.1, 0.5); // the raised arm
        b.bar('bronze', shoulder.clone().addScaledVector(TV, -side * 0.75).toArray(), shoulder.clone().addScaledVector(TV, -side * 1.3).addScaledVector(NV, 1.4).addScaledVector(UP, -0.4).toArray(), 0.42, 0.42, 0, false, 0);
      }
    }
  }

  // ---- 5. the red ROGERS CENTRE signs, letter by letter along the wall -------------------
  {
    const word = wordSegments('ROGERS CENTRE', near ? 3.8 : 4.4, 1.1);
    for (const [su, sv] of [[-62, 80], [62, 80], [-108, -35], [109, -35]]) {
      const s0 = nearestS(su, sv), yBase = 26.8;
      const at = (x) => { const w = wallAt(s0 + word.width / 2 - x); return [w.p[0] + w.n[0] * 0.5, w.p[1] + w.n[1] * 0.5]; };
      if (near) for (const [[x0, y0], [x1, y1]] of word.segments) {
        const p0 = at(x0), p1 = at(x1);
        b.bar('sign', W(p0[0], yBase + y0, p0[1]), W(p1[0], yBase + y1, p1[1]), 0.55, 0.6, 0, false, 0);
      } else {
        // Far: the letters are 4 m tall and 28 m long, a few pixels at far range. Four red bars along the word's
        // mid-line keep the red band and its length for a tenth of the triangles (3,520 -> 192 over the four signs).
        const SEG = 4, bandY = yBase + 2.5;
        for (let i = 0; i < SEG; i++) {
          const p0 = at(word.width * i / SEG), p1 = at(word.width * (i + 1) / SEG);
          b.bar('sign', W(p0[0], bandY, p0[1]), W(p1[0], bandY, p1[1]), 1.5, 0.6, 0, false, 0);
        }
      }
    }
  }

  // ---- 6. hotel terraces on the north end -------------------------------------------------
  for (const { ring: hr, top: hTop } of HOTEL) {
    prism(hr, RING_TOP - 0.2, hTop, 'glass_hotel', 'concrete_dark');
    const n = hr.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, dx = hr[j][0] - hr[i][0], dv = hr[j][1] - hr[i][1], L = Math.hypot(dx, dv);
      if (L < 3.5) continue;
      const e = { p: hr[i], t: [dx / L, dv / L], n: [dv / L, -dx / L] };
      const mu = (hr[i][0] + hr[j][0]) / 2, mv = (hr[i][1] + hr[j][1]) / 2, out = (e.n[0] * mu + e.n[1] * mv) / Math.hypot(mu, mv);
      if (out < 0.55) continue; // only the outer face reads from the street
      for (let y = RING_TOP + 3.2; y < hTop - 0.5; y += near ? 3.4 : 6.8) wbox('concrete', e, L / 2, y, 0.08, L, 0.5, 0.35);
      if (near) for (let s = 0; s <= L + 0.01; s += 3.6) wbox('concrete', e, Math.min(s, L), (RING_TOP + hTop) / 2, 0.1, 0.22, hTop - RING_TOP, 0.3);
    }
  }

  // ---- 7. the roof: four panels, south-facing steps, rim skirts, ribs ---------------------
  const NU = near ? 64 : 24, capRows = near ? 20 : 8, archRows = near ? 14 : 6, skirtBottom = RING_TOP - 0.3;
  const seams = ROOF.seams;
  const panelRows = (idx) => {
    const rows = [];
    if (idx === 0 || idx === 3) {
      const sign = idx === 0 ? -1 : 1, th0 = Math.acos(Math.abs(idx === 0 ? seams[0] : seams[2]) / R);
      for (let i = 0; i <= capRows; i++) rows.push(sign * R * Math.cos(th0 * (1 - i / capRows)));
      return rows;
    }
    const v0 = idx === 1 ? seams[0] : seams[1], v1 = idx === 1 ? seams[1] : seams[2];
    for (let i = 0; i <= archRows; i++) rows.push(v0 + (v1 - v0) * i / archRows);
    return rows;
  };
  const pointAt = (u, v, panel, lift = 0) => W(u, roofHeight(u, v, panel) + lift, v);
  for (let panel = 0; panel < 4; panel++) {
    const rows = panelRows(panel).map((v) => {
      const hw = halfWidth(v), row = [];
      for (let j = 0; j <= NU; j++) row.push(pointAt(-hw + 2 * hw * j / NU, v, panel));
      return row;
    });
    grid('roof', rows, [0, 1, 0]);
    const left = rows.map((r) => r[0]), right = rows.map((r) => r[NU]), drop = (pts) => pts.map((p) => [p[0], skirtBottom, p[2]]);
    strip('roof_seam', drop(left), left, faceOf([-1, 0]));
    strip('roof_seam', drop(right), right, faceOf([1, 0]));
  }
  for (let s = 0; s < 3; s++) { // each panel to the north stands proud of the one south of it
    const v = seams[s], hw = halfWidth(v), lower = [], upper = [];
    for (let j = 0; j <= NU; j++) { const u = -hw + 2 * hw * j / NU; lower.push(pointAt(u, v, s + 1)); upper.push(pointAt(u, v, s)); }
    strip('roof_seam', lower, upper, faceOf([0, 1]));
    // the dark gap where the arch meets the panel under it, a hair proud of the step face
    const gapBottom = [], gapTop = [];
    for (let j = 0; j <= NU; j++) { const u = -hw + 2 * hw * j / NU, y = roofHeight(u, v, s + 1); gapBottom.push(W(u, y, v + 0.07)); gapTop.push(W(u, y + (near ? 0.9 : 1.4), v + 0.07)); }
    strip('steel', gapBottom, gapTop, faceOf([0, 1]));
  }
  function ridge(uvs, panel, half = 0.45, rise = 0.42) {
    const rows = [[], [], []];
    for (let i = 0; i < uvs.length; i++) {
      const a = uvs[Math.max(0, i - 1)], c = uvs[Math.min(uvs.length - 1, i + 1)];
      let du = c[0] - a[0], dv = c[1] - a[1]; const d = Math.hypot(du, dv) || 1; du /= d; dv /= d;
      const lu = -dv * half, lv = du * half, [u, v] = uvs[i];
      rows[0].push(pointAt(u - lu, v - lv, panel, 0.02)); rows[1].push(pointAt(u, v, panel, rise)); rows[2].push(pointAt(u + lu, v + lv, panel, 0.02));
    }
    grid('roof_seam', [rows[0], rows[1]], [0, 1, 0]); grid('roof_seam', [rows[1], rows[2]], [0, 1, 0]);
  }
  if (near) { // longitudinal ribs on the sliding arches, meridians on the caps
    for (const [panel, v0, v1] of [[1, seams[0], seams[1]], [2, seams[1], seams[2]]]) {
      const reach = Math.min(halfWidth(v0), halfWidth(v1)) - 2;
      for (let u = -Math.floor(reach / 7.5) * 7.5; u <= reach; u += 7.5) {
        const pts = []; for (let i = 0; i <= 12; i++) pts.push([u, v0 + 1 + (v1 - v0 - 2) * i / 12]);
        ridge(pts, panel);
      }
    }
    for (const sign of [-1, 1]) {
      const panel = sign < 0 ? 0 : 3, th0 = Math.acos(Math.abs(sign < 0 ? seams[0] : seams[2]) / R);
      for (let f = -0.9; f <= 0.91; f += 0.15) {
        const pts = [];
        for (let i = 1; i <= 16; i++) { const th = th0 * (1 - i / 17); pts.push([f * R * Math.sin(th), sign * R * Math.cos(th)]); }
        ridge(pts, panel);
      }
    }
  }

  // ---- 8. the rails and the wings where the arches land -----------------------------------
  for (const s of [-1, 1]) {
    const v0 = -ROOF.railV, v1 = ROOF.railV, n = near ? 14 : 6, edge = [];
    for (let i = 0; i <= n; i++) { const v = v0 + (v1 - v0) * i / n; edge.push([s * halfWidth(v), v]); }
    const wing = [...edge, [s * ROOF.railU, v1], [s * ROOF.railU, v0]];
    prism(area(wing) < 0 ? wing.slice().reverse() : wing, RING_TOP - 0.2, RING_TOP + 3.4, 'roof_seam', 'steel');
    const capY = RING_TOP + 3.4;
    // the arch ribs run on across the wing deck, with the joint between the two arches
    if (near) {
      const rib = (u, va, vb) => box('roof_seam', W(u, capY + 0.12, (va + vb) / 2), [0.5, 0.26, vb - va], angleOfUV([0, 1]) + Math.PI / 2);
      for (const u of [90, 97.5, 103]) {
        const vLo = Math.sqrt(Math.max(0, R * R - u * u)) + 0.6;
        if (vLo >= v1) continue;
        const vHi = Math.min(v1, Math.max(v1, vLo));
        if (vLo <= 0.7) rib(s * u, v0, v1); else { rib(s * u, vLo, vHi); rib(s * u, -vHi, -vLo); }
      }
      box('roof_seam', W(s * (halfWidth(0) + ROOF.railU) / 2, capY + 0.12, 0), [ROOF.railU - halfWidth(0), 0.26, 0.5], angleOfUV([1, 0]));
    }
    // the rail girder, and a dark seam line where the deck meets the roof edge
    box('concrete_dark', W(s * (ROOF.railU - 3.2), RING_TOP + 5.0, 0), [5.4, 3.0, v1 - v0], angleOfUV([0, 1]) + Math.PI / 2);
  }

  // ---- 9. blue rim lights round the roof edge ----------------------------------------------
  {
    const count = near ? 40 : 20, sz = near ? 1.1 : 2;
    for (let i = 0; i < count; i++) {
      const th = (i + 0.5) * Math.PI * 2 / count, u = R * Math.sin(th), v = -R * Math.cos(th);
      if (Math.abs(v) <= ROOF.railV && Math.abs(u) > R * 0.8) continue; // the wings own the sides
      box('light', W(u * 1.004, roofHeight(u, v) + 0.6, v * 1.004), [sz, sz, sz], angleOfUV([Math.cos(th), Math.sin(th)]));
    }
  }

  return b.finish();
}
