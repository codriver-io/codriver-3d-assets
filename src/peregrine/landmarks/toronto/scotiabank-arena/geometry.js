import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, materialFor } from './config.js';
import { V, RINGS, shoelace, centroid, edgeFrame, roundCorner, makePath, makeRoofHeight } from './scotiabank-arena-site.js';
import { GLYPHS, TEXT } from './scotiabank-arena-sign.js';

// Scotiabank Arena, 40 Bay Street. Real metres, +X east, +Y up, +Z south, origin = SPEC.origin.
// Everything is built from the mapped building:part outlines in scotiabank-arena-site.js, so the
// model turns with the real (Lake Shore / Bay Street) geometry, not with a rotated box.
//   - retained 1941 Postal Delivery Building limestone facade, east (Bay) and south (Lake Shore)
//   - black metal attic wall and the low, two-way arched roof of the 1999 arena above it
//   - glazed plaza front on the west with the 9.1 x 15.2 m video screen and the red sign
//   - plaza sculpture (three crossing Cor-Ten columns) in front of it
// The 15-storey office tower on the same lot is left to the map provider.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // Every material goes through the draw-budget fold (config.js FOLD): near is unchanged, far shares draws.
  const { put: put0, box: box0 } = b, fold = (m) => materialFor(m, detail);
  b.put = (g, m, ...rest) => put0(g, fold(m), ...rest); b.box = (m, ...rest) => box0(fold(m), ...rest);
  const { eave, rise } = SPEC.roof, LIME = SPEC.facadeM, ATR = SPEC.atriumM;
  const roofH = makeRoofHeight(SPEC.roof);
  const acc = new Map();
  const bucket = (mat) => { mat = fold(mat); if (!acc.has(mat)) acc.set(mat, { pos: [], idx: [] }); return acc.get(mat); };

  // ---- primitives -------------------------------------------------------
  // A quad p0..p3 (arrays [x,y,z]) wound so its normal faces `out`.
  function quad(mat, p0, p1, p2, p3, out) {
    const g = bucket(mat), o = g.pos.length / 3;
    g.pos.push(...p0, ...p1, ...p2, ...p3);
    const ux = p1[0] - p0[0], uy = p1[1] - p0[1], uz = p1[2] - p0[2], vx = p2[0] - p0[0], vy = p2[1] - p0[1], vz = p2[2] - p0[2];
    const d = (uy * vz - uz * vy) * out[0] + (uz * vx - ux * vz) * out[1] + (ux * vy - uy * vx) * out[2];
    if (d >= 0) g.idx.push(o, o + 1, o + 2, o, o + 2, o + 3); else g.idx.push(o, o + 2, o + 1, o, o + 3, o + 2);
  }
  // Vertical wall between ring points a and b from y0 to y1 (per-end heights allowed).
  function wall(mat, a, c, y0, y1, f, y0c = y0, y1c = y1) {
    quad(mat, [a[0], y0, a[1]], [c[0], y0c, c[1]], [c[0], y1c, c[1]], [a[0], y1, a[1]], [f.nx, 0, f.nz]);
  }
  // Horizontal face of a ring at height y, facing up, triangulated (earcut).
  function cap(mat, ring, y) {
    const g = bucket(mat), o = g.pos.length / 3;
    ring.forEach((p) => g.pos.push(p[0], y, p[1]));
    for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(ring.map((p) => new THREE.Vector2(p[0], p[1])), [])) {
      const ax = ring[j][0] - ring[i][0], az = ring[j][1] - ring[i][1], bx = ring[k][0] - ring[i][0], bz = ring[k][1] - ring[i][1];
      // normal.y = az*bx - ax*bz for (x,z) axes; make it point up
      if (az * bx - ax * bz >= 0) g.idx.push(o + i, o + j, o + k); else g.idx.push(o + i, o + k, o + j);
    }
  }
  // Extruded ring with separate wall and cap materials; `skip` lists edge indices with no wall.
  function prism(ring, y0, y1, wallMat, capMat, skip = []) {
    const sign = Math.sign(shoelace(ring));
    ring.forEach((p, i) => {
      if (skip.includes(i)) return;
      const q = ring[(i + 1) % ring.length];
      wall(wallMat, p, q, y0, y1, edgeFrame(p, q, sign));
    });
    if (capMat) cap(capMat, ring, y1);
  }
  // Box aligned with an edge frame: station s along it, offset o along the outward normal, centre height y.
  function onEdge(mat, f, s, o, y, len, h, depth) {
    b.box(mat, [f.a[0] + f.ux * s + f.nx * o, y, f.a[1] + f.uz * s + f.nz * o], [len, h, depth], f.angle);
  }
  // The same on an arclength path (station s -> position and tangent).
  function onPath(mat, path, s, o, y, len, h, depth) {
    const q = path.at(s);
    b.box(mat, [q.x + q.nx * o, y, q.z + q.nz * o], [len, h, depth], q.angle);
  }

  // Lettering as geometry: `place(s, y, len, h)` puts one lit run at reading-distance s from the
  // text centre (left to right as seen from outside); dir flips it when the edge runs right to left.
  function lettering(text, cell, baseY, place) {
    const pitch = 6 * cell, total = text.length * pitch - cell;
    text.split('').forEach((ch, ci) => {
      const rows = GLYPHS[ch]; if (!rows) return;
      rows.forEach((row, r) => {
        for (let c = 0; c < 5;) {
          if (row[c] !== '#') { c++; continue; }
          let e = c; while (e + 1 < 5 && row[e + 1] === '#') e++;
          const x0 = ci * pitch + c * cell, x1 = ci * pitch + (e + 1) * cell;
          place((x0 + x1) / 2 - total / 2, baseY + (6.5 - r) * cell, x1 - x0, cell);
          c = e + 1;
        }
      });
    });
    return total;
  }

  // ---- 1. retained limestone facade (Postal Delivery Building, 1941) -------
  const limeSign = Math.sign(shoelace(RINGS.lime));
  const arc1 = roundCorner(V.O0, V.O1, V.O2, 2.5, near ? 4 : 2), arc2 = roundCorner(V.O1, V.O2, V.O3, 6, near ? 10 : 4);
  const facadePts = [V.O0, ...arc1, ...arc2, V.O3, V.Q0];
  const facade = makePath(facadePts, limeSign);
  const iA1 = 1 + arc1.length - 1, iA2 = iA1 + 1, iA2e = iA2 + arc2.length - 1;
  const sBay0 = facade.cum[iA1], sBay1 = facade.cum[iA2], sSou0 = facade.cum[iA2e], sSou1 = facade.cum[iA2e + 1];
  for (let i = 0; i < facadePts.length - 1; i++) wall('limestone', facadePts[i], facadePts[i + 1], 0, LIME, edgeFrame(facadePts[i], facadePts[i + 1], limeSign));
  wall('limestone', V.P0, V.O0, 0, LIME, edgeFrame(V.P0, V.O0, limeSign)); // west side of the stub beside the tower
  cap('roof', [...facadePts, V.P1, V.P0], LIME);
  // Black granite base course, then cornice, running the whole facade.
  const CH = 6.0; // chain step for the wrapped corner
  const chain = (path, s0, s1, fn) => {
    const n = Math.max(1, Math.ceil((s1 - s0) / CH)), step = (s1 - s0) / n;
    for (let i = 0; i < n; i++) fn(s0 + step * (i + 0.5), step);
  };
  chain(facade, 0, facade.length, (s, l) => { onPath('plinth', facade, s, 0.2, 0.55, l + 0.05, 1.1, 0.52); onPath('limestone', facade, s, 0.4, LIME - 0.55, l + 0.05, 1.1, 0.8); });
  // Tall vertical windows between pink-grey granite pilasters: pitch 8 m (4.8 m glass + 3.2 m pilaster).
  const PITCH = 8;
  function colonnade(s0, bays) {
    for (let i = 0; i <= bays; i++) {
      const s = s0 + i * PITCH;
      onPath('granite', facade, s, 0.5, (3.4 + 17.9) / 2, 3.2, 17.9 - 3.4, 1.0);
      onPath('plinth', facade, s, 0.55, 1.5, 3.6, 3.0, 1.1);
    }
    for (let i = 0; i < bays; i++) {
      const s = s0 + i * PITCH + PITCH / 2;
      onPath('glass', facade, s, 0.14, (4.3 + 17.0) / 2, 4.8, 17.0 - 4.3, 0.3);
      onPath('glass', facade, s, 0.14, 2.4, 4.8, 3.6, 0.3);
      onPath('frame', facade, s, 0.2, 4.3, 5.0, 0.3, 0.4);
      if (near) {
        for (const k of [-1.2, 0, 1.2]) onPath('frame', facade, s + k, 0.22, (4.2 + 17.1) / 2, 0.14, 17.1 - 4.2, 0.36); // mullions run a hand past the glass sill and head
        for (let y = 6.0; y < 17.0; y += 1.9) onPath('frame', facade, s, 0.22, y, 5.0, 0.12, 0.36);
      }
    }
  }
  colonnade(sBay0 + 15.3, 8); // Bay Street: 8 bays between the two end blocks
  colonnade(sSou0 + 10.0, 6); // Lake Shore: 6 bays
  // Streamline-moderne end blocks: two horizontal ribbon windows, wrapping the rounded corners.
  function ribbon(s0, s1) {
    for (const [y0, y1] of [[7.4, 11.4], [13.0, 16.0]]) chain(facade, s0, s1, (s, l) => {
      onPath('glass', facade, s, 0.16, (y0 + y1) / 2, l + 0.02, y1 - y0, 0.3);
      if (near) { onPath('frame', facade, s, 0.3, (y0 + y1) / 2, l + 0.16, 0.14, 0.4); onPath('frame', facade, s, 0.3, y0 - 0.1, l + 0.16, 0.2, 0.4); onPath('frame', facade, s, 0.3, y1 + 0.1, l + 0.16, 0.2, 0.4); } // sill and head sit just outside the glass, not flush with it
    });
  }
  ribbon(sBay0 + 0.8, sBay0 + 14.3); // north end block
  ribbon(sBay0 + 15.3 + 8 * PITCH + 1.2, sSou0 + 8.8); // south-east corner block, round the bend
  ribbon(sSou0 + 10.0 + 6 * PITCH + 1.2, sSou1 - 1.0); // west end block on Lake Shore
  // Verdigris frieze line and a projecting limestone cornice.
  chain(facade, 0, facade.length, (s, l) => {
    onPath('patina', facade, s, 0.32, 17.5, l + 0.05, 0.4, 0.5);
    onPath('limestone', facade, s, 0.4, LIME - 0.45, l + 0.05, 0.9, 0.9);
  });
  // "Scotiabank Arena" in the limestone frieze over the Bay Street colonnade (bronze letters).
  {
    const sc0 = sBay0 + 15.3 + 4 * PITCH, q = facade.at(sc0), dir = (q.nz * q.ux - q.nx * q.uz) >= 0 ? 1 : -1;
    if (near) lettering(TEXT, 0.14, 17.95, (x, y, len, h) => onPath('frame', facade, sc0 + dir * x, 0.9, y, len, h, 0.12));
  }
  // The ledge above the cornice steps up to the black attic; a light coping edge on the cornice.
  chain(facade, 0, facade.length, (s, l) => onPath('roof', facade, s, 0.5, LIME + 0.12, l + 0.05, 0.24, 0.3));

  // ---- 2. attic wall and roof of the arena ----------------------------------
  const bowlSign = Math.sign(shoelace(RINGS.bowl));
  const runs = [ // [from, to, base of the exposed wall]
    [V.P0, V.P1, LIME], [V.P1, V.Q0, LIME], [V.Q0, V.P2, 12], [V.P2, V.A0, ATR], [V.A0, V.P3, 9],
    [V.P3, V.N1, 18], [V.N1, V.Na, 0], [V.Na, V.Nb, 0], [V.Nb, V.Nc, 0], [V.Nc, V.Nd, 0], [V.Nd, V.N2, 0], [V.N2, V.N3, 0], [V.N3, V.P0, 0],
  ];
  const step = near ? 4.5 : 6, BAY = near ? 9.0 : 12.0;
  for (const [a, c, base] of runs) {
    const f = edgeFrame(a, c, bowlSign), n = Math.max(1, Math.ceil(f.len / step));
    const pt = (i) => [a[0] + f.ux * f.len * i / n, a[1] + f.uz * f.len * i / n];
    for (let i = 0; i < n; i++) {
      const p = pt(i), q = pt(i + 1), t0 = roofH(p[0], p[1]), t1 = roofH(q[0], q[1]);
      const m0 = base + (t0 - base) * 0.4, m1 = base + (t1 - base) * 0.4;
      wall('cladding', p, q, base, m0, f, base, m1);
      wall('louvre', p, q, m0, t0 - 0.6, f, m1, t1 - 0.6);
      wall('roof', p, q, t0 - 0.6, t0, f, t1 - 0.6, t1); // pale coping band
    }
    // fins between the louvre bays (wider spacing in the far model, so the band still reads as bays)
    {
      const bays = Math.max(1, Math.round(f.len / BAY));
      for (let k = 0; k <= bays; k++) {
        const s = f.len * k / bays, x = a[0] + f.ux * s, z = a[1] + f.uz * s, top = roofH(x, z);
        b.box('cladding', [x + f.nx * 0.2, (base + top) / 2, z + f.nz * 0.2], [0.5, top - base, 0.45], f.angle);
      }
    }
  }
  // roof: rings scaled about the centroid so the arch is a real surface, not a lid
  {
    const ring = RINGS.bowl, c0 = centroid(ring), g = bucket('roof_surface');
    const rim = [], spacing = near ? 5.5 : 9;
    ring.forEach((p, i) => {
      const q = ring[(i + 1) % ring.length], m = Math.max(1, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / spacing));
      for (let k = 0; k < m; k++) rim.push([p[0] + (q[0] - p[0]) * k / m, p[1] + (q[1] - p[1]) * k / m]);
    });
    const K = near ? 7 : 4, M = rim.length, at = (k, j) => { const r = k / K, p = rim[j % M]; return [c0[0] + (p[0] - c0[0]) * r, c0[1] + (p[1] - c0[1]) * r]; };
    const idx = (k, j) => (k === 0 ? 0 : 1 + (k - 1) * M + (j % M));
    g.pos.push(c0[0], roofH(c0[0], c0[1]), c0[1]);
    for (let k = 1; k <= K; k++) for (let j = 0; j < M; j++) { const p = at(k, j); g.pos.push(p[0], roofH(p[0], p[1]), p[1]); }
    const up = (i, j, k) => {
      const A = g.pos.slice(i * 3, i * 3 + 3), B = g.pos.slice(j * 3, j * 3 + 3), C = g.pos.slice(k * 3, k * 3 + 3);
      const ny = (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2]);
      if (ny >= 0) g.idx.push(i, j, k); else g.idx.push(i, k, j);
    };
    for (let j = 0; j < M; j++) up(0, idx(1, j), idx(1, j + 1));
    for (let k = 1; k < K; k++) for (let j = 0; j < M; j++) { up(idx(k, j), idx(k + 1, j), idx(k + 1, j + 1)); up(idx(k, j), idx(k + 1, j + 1), idx(k, j + 1)); }
    g.smooth = true;
    // rooftop plant, deterministic, kept clear of the rim
    if (near) {
      let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let n = 0; n < 16; n++) {
        const r = 0.15 + rnd() * 0.45, a = rnd() * Math.PI * 2, x = c0[0] + Math.cos(a) * r * 60, z = c0[1] + Math.sin(a) * r * 48;
        const w = 1.4 + rnd() * 2.0, d = 1.2 + rnd() * 1.6, h = 0.6 + rnd() * 0.9;
        b.box('frame', [x, roofH(x, z) + h / 2 - 0.05, z], [w, h, d], rnd() * 0.6);
      }
    }
  }

  // Standing-seam joints across the roof, along the Lake Shore axis, clipped to the bowl outline and
  // draped on the arch (0.1 m above it, clear of the chord sag): breaks up the membrane so it reads as roofing, not a plate.
  {
    const ax = edgeFrame(V.P2, V.P1, 1), ux = ax.ux, uz = ax.uz, vx = -uz, vz = ux, ring = RINGS.bowl, c0 = centroid(ring);
    const pitch = near ? 6 : 12, seg = near ? 4 : 10, w = near ? 0.2 : 0.35, dOf = (p) => (p[0] - c0[0]) * vx + (p[1] - c0[1]) * vz;
    const ds = ring.map(dOf), dmin = Math.min(...ds), dmax = Math.max(...ds);
    for (let d = Math.ceil(dmin / pitch) * pitch; d <= dmax; d += pitch) {
      const ts = [];
      ring.forEach((p, i) => {
        const q = ring[(i + 1) % ring.length], dp = dOf(p), dq = dOf(q);
        if ((dp - d) * (dq - d) < 0) { const f = (d - dp) / (dq - dp); ts.push((p[0] + (q[0] - p[0]) * f - c0[0]) * ux + (p[1] + (q[1] - p[1]) * f - c0[1]) * uz); }
      });
      ts.sort((a, c) => a - c);
      for (let k = 0; k + 1 < ts.length; k += 2) {
        const t0 = ts[k] + 0.8, t1 = ts[k + 1] - 0.8, n = Math.max(1, Math.ceil((t1 - t0) / seg));
        for (let i = 0; i < n; i++) {
          const ta = t0 + (t1 - t0) * i / n, tb = t0 + (t1 - t0) * (i + 1) / n;
          const pa = [c0[0] + vx * d + ux * ta, c0[1] + vz * d + uz * ta], pb = [c0[0] + vx * d + ux * tb, c0[1] + vz * d + uz * tb];
          const ha = roofH(pa[0], pa[1]) + 0.1, hb = roofH(pb[0], pb[1]) + 0.1;
          quad('louvre', [pa[0] - vx * w / 2, ha, pa[1] - vz * w / 2], [pa[0] + vx * w / 2, ha, pa[1] + vz * w / 2], [pb[0] + vx * w / 2, hb, pb[1] + vz * w / 2], [pb[0] - vx * w / 2, hb, pb[1] - vz * w / 2], [0, 1, 0]);
        }
      }
    }
  }

  // ---- 3. glazed plaza front, return and wing; north wall band ------------------
  const glazed = (ring, y0, y1, skip, capMat = 'roof') => {
    prism(ring, y0, y1, 'glass', capMat, skip);
    const sign = Math.sign(shoelace(ring));
    ring.forEach((p, i) => {
      if (skip.includes(i)) return;
      const q = ring[(i + 1) % ring.length], f = edgeFrame(p, q, sign), pitch = near ? 3.0 : 6.0;
      const cols = Math.max(1, Math.round(f.len / pitch));
      for (let k = 0; k <= cols; k++) onEdge('frame', f, f.len * k / cols, 0.1, (y0 + y1) / 2, 0.22, y1 - y0, 0.26);
      if (near) for (let y = y0 + 4.5; y < y1 - 0.5; y += 3.6) onEdge('frame', f, f.len / 2, 0.1, y, f.len, 0.2, 0.26);
    });
  };
  glazed(RINGS.atrium, 0, ATR, [6, 7]);
  wall('glass', V.s2, V.P2, 12, ATR, edgeFrame(V.s2, V.P2, Math.sign(shoelace(RINGS.atrium)))); // step above the lower return
  glazed(RINGS.ret, 0, 12, [0, 8, 9]);
  glazed(RINGS.wing, 0, 9, [0, 5]);
  prism(RINGS.skirt, 0, 18, 'louvre', 'louvre', [0, 8]);
  // The north service face (62 m, the long side facing the rail corridor): dark base course and two
  // bands, five roll-up loading doors with surrounds, pedestrian doors, vent panels and panel joints.
  {
    const f = edgeFrame(V.K3, V.K4, Math.sign(shoelace(RINGS.skirt)));
    for (const [y, h] of [[0.6, 1.2], [9.0, 0.7], [16.9, 1.0]]) onEdge('cladding', f, f.len / 2, 0.07, y, f.len, h, 0.16);
    for (const s of [7, 18.5, 31, 43.5, 55]) {
      onEdge('plinth', f, s, 0.1, 2.5, 5.0, 5.0, 0.2);
      onEdge('frame', f, s, 0.14, 5.1, 5.7, 0.4, 0.24);
      if (near) for (const d of [-2.65, 2.65]) onEdge('frame', f, s + d, 0.14, 2.5, 0.35, 4.8, 0.24);
      onEdge('cladding', f, s, 0.13, 6.6, 4.4, 1.6, 0.18); // vent panel over each dock door
    }
    for (const s of [12.6, 25, 37, 49.5]) onEdge('plinth', f, s, 0.1, 1.4, 1.5, 2.8, 0.2);
    if (near) for (let s = 3.1; s < f.len - 1; s += 3.1) onEdge('frame', f, s, 0.05, 9.5, 0.1, 18, 0.1);
  }
  // Entrance canopy at 5.5 m and the thick fascia at the top of the front (W2 -> SW).
  const atrSign = Math.sign(shoelace(RINGS.atrium));
  const frontEdges = [[V.W2, V.W3], [V.W3, V.W4], [V.W4, V.SW], [V.SW, V.s1], [V.s1, V.s2]].map(([p, q]) => edgeFrame(p, q, atrSign));
  for (const f of frontEdges) {
    onEdge('frame', f, f.len / 2, 1.2, 5.6, f.len + 0.3, 0.7, 2.6);
    onEdge('frame', f, f.len / 2, 0.85, ATR - 0.75, f.len + 0.3, 2.3, 2.0);
  }
  // Video screen, 9.1 x 15.2 m (published), on the long straight of the front.
  const fs = frontEdges[1], screen = SPEC.screen, sc = fs.len * 0.46;
  onEdge('frame', fs, sc, 0.45, 7.0 + screen.height / 2, screen.width + 0.7, screen.height + 0.7, 0.5);
  onEdge('glow', fs, sc, 0.72, 7.0 + screen.height / 2, screen.width, screen.height, 0.2);
  // Red rooftop sign, built letter by letter from a 5 x 7 grid; a plain bar in the far model.
  {
    const cell = 0.22, base = ATR + 0.55, dir = (fs.nz * fs.ux - fs.nx * fs.uz) >= 0 ? 1 : -1;
    if (near) lettering(TEXT, cell, base, (x, y, len, h) => onEdge('sign', fs, sc + dir * x, 0.6, y, len, h, 0.32));
    else { const total = TEXT.length * 6 * cell - cell; onEdge('sign', fs, sc, 0.6, base + 3.5 * cell, total, 7 * cell * 0.8, 0.32); }
  }
  // Two flagpoles on the front canopy roof (Canada, USA), as in every photograph of the front.
  if (near) for (const k of [0.16, 0.3]) onEdge('frame', fs, fs.len * k, -1.5, ATR + 5.5, 0.18, 11, 0.18);

  // ---- 4. plaza sculpture: two long tapered Cor-Ten columns crossing beside a short thick one ----
  {
    const f = frontEdges[0]; // W2 -> W3, the northern stretch of the front
    const pos = (s, o) => [f.a[0] + f.ux * s + f.nx * o, f.a[1] + f.uz * s + f.nz * o];
    const tube = (base, lean, len, r0, r1, sideways = 0) => {
      const d = new THREE.Vector3(f.ux * lean + f.nx * sideways, 1, f.uz * lean + f.nz * sideways).normalize();
      const lift = r0 * Math.sqrt(1 - d.y * d.y) + 0.05; // keep the tilted foot on the ground
      const g = new THREE.CylinderGeometry(r1, r0, len, near ? 12 : 6, 1, false);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d));
      g.translate(base[0] + d.x * len / 2, lift + d.y * len / 2, base[1] + d.z * len / 2);
      b.put(g, 'corten');
    };
    tube(pos(4, 15), 0.5, 31, 1.35, 0.65, 0.05);
    tube(pos(12.5, 15), -0.45, 27, 1.25, 0.6, 0.05);
    tube(pos(8.5, 13), 0, 13, 1.9, 1.6);
  }

  // ---- flush accumulated geometry ------------------------------------------------
  for (const [mat, g] of acc) {
    if (!g.idx.length) continue;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(g.pos, 3));
    geo.setIndex(g.idx); geo.computeVertexNormals();
    b.put(geo, g.smooth ? 'roof' : mat);
  }
  const root = b.finish();
  root.userData.elevationDatum = 'Local grade y=0; roof crown ' + (eave + rise) + ' m above it.';
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift');
    o.material.color.set(PALETTES.light[o.material.name]);
    if (o.material.name === 'sign' || o.material.name === 'glow') { o.material.emissive.set(PALETTES.light[o.material.name]); o.material.emissiveIntensity = o.material.name === 'sign' ? 0.6 : 0.5; }
  });
  return root;
}
