import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, materialFor } from './config.js';
import { site, BOWL, RINGS, LEVELS, ARCH, ARCH_V, MAST, seAt, seRing, roofY, archTop, archBottom } from './johan-cruijff-arena-site.js';
import { segmentsFor, archPanels, archU, hangers, struts, stairs } from './johan-cruijff-arena-parts.js';

// Johan Cruijff ArenA with the roof closed: a 104 x 85 m superellipse bowl in white concrete with red and
// teal ribbons on a promenade deck held up by Y-struts; a dark clerestory under a grey roof that climbs to
// the two sliding panels; and the two white lattice arches (75 m crown) that span the long axis from four
// pairs of corner masts, the roof hung from them. In front, the entrance pod and the logo box with its nine
// round windows. Authored in (u, y, v), rotated by site() into +X east, +Y up, +Z south. Real metres, y = 0 at grade.
export function create({ detail = 'near', omit = [] } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const { put: put0, box: box0, bar: bar0 } = b, fold = (m) => materialFor(m, detail);
  b.put = (g, m, ...rest) => put0(g, fold(m), ...rest); b.box = (m, ...rest) => box0(fold(m), ...rest); b.bar = (m, ...rest) => bar0(fold(m), ...rest);
  const N = segmentsFor(detail);        // segments round the bowl
  const keep = (part) => !omit.includes(part); // tests build the supports without the members they carry
  const W = (u, y, v) => site(u, y, v);
  const { cv } = BOWL;

  // ---- surfaces ---------------------------------------------------------------------------------------
  // rows[i][j] are world points; consecutive rows are joined, rows close on j when `closed`. Winding is
  // flipped as a whole so the triangles face `hint(point)` (a direction), never inside out.
  function surface(mat, rows, hint, { closed = true, pick = null } = {}) {
    const w = rows[0].length, positions = [], indices = [];
    for (const row of rows) for (const p of row) positions.push(...p);
    const cols = closed ? w : w - 1;
    for (let i = 0; i + 1 < rows.length; i++) for (let j = 0; j < cols; j++) {
      if (pick && !pick(i, j)) continue;
      const a = i * w + j, c = i * w + (j + 1) % w, d = a + w, e = c + w;
      indices.push(a, d, c, c, d, e);
    }
    const keep = [];
    let dot = 0;
    for (let k = 0; k < indices.length; k += 3) {
      const [p, q, r] = [0, 1, 2].map((m) => indices[k + m] * 3);
      const ux = positions[q] - positions[p], uy = positions[q + 1] - positions[p + 1], uz = positions[q + 2] - positions[p + 2];
      const vx = positions[r] - positions[p], vy = positions[r + 1] - positions[p + 1], vz = positions[r + 2] - positions[p + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      if (Math.hypot(nx, ny, nz) < 1e-7) continue;
      keep.push(indices[k], indices[k + 1], indices[k + 2]);
      const h = hint([positions[p], positions[p + 1], positions[p + 2]]);
      dot += (nx * h[0] + ny * h[1] + nz * h[2]) / Math.hypot(nx, ny, nz);
    }
    if (!keep.length) return;
    if (dot < 0) for (let k = 0; k < keep.length; k += 3) { const t = keep[k + 1]; keep[k + 1] = keep[k + 2]; keep[k + 2] = t; }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(keep); g.computeVertexNormals(); b.put(g, mat, 0, 0);
  }
  // Outward = away from the bowl's centre column, horizontally.
  const cx = W(0, 0, cv)[0], cz = W(0, 0, cv)[2];
  const outward = ([x, , z]) => [x - cx, 0, z - cz];
  const UP = () => [0, 1, 0], DOWN = () => [0, -1, 0];
  const loopOf = (pts, yOf) => pts.map(([u, v], i) => W(u, typeof yOf === 'function' ? yOf(i, u, v) : yOf, v));

  const ringEdge = seRing(RINGS.eave, N), ringWall = seRing(RINGS.wall, N);
  const rimY = ringEdge.map(([u, v]) => roofY(u, v));
  const wallTop = rimY.map((y) => y - 1.0);

  // ---- ground storey, promenade deck ------------------------------------------------------------------
  const ground = seRing(RINGS.ground, N), deckEdge = seRing(RINGS.deck, N);
  surface('glow', [loopOf(ground, 0), loopOf(ground, LEVELS.deckBottom)], outward);
  surface('concrete', [loopOf(deckEdge, LEVELS.deck), loopOf(ringWall, LEVELS.deck)], UP);
  surface('concrete', [loopOf(deckEdge, LEVELS.deckBottom), loopOf(deckEdge, LEVELS.deck)], outward);
  surface('concrete_dark', [loopOf(deckEdge, LEVELS.deckBottom), loopOf(ground, LEVELS.deckBottom)], DOWN);

  // ---- the facade bands (windows alternate teal / white by segment) -------------------------------------------
  const band = (mat, y0, y1, alt) => {
    const lo = loopOf(ringWall, y0), hi = loopOf(ringWall, y1);
    surface(mat, [lo, hi], outward, { pick: alt ? (_, j) => j % 2 === 0 : null });
    if (alt) surface(alt, [lo, hi], outward, { pick: (_, j) => j % 2 === 1 });
  };
  band('concrete', LEVELS.deck, 12.6);
  band('teal', 12.6, 17.6, 'concrete');
  band('red', 17.6, 19.8);
  band('concrete', 19.8, LEVELS.ledge - 0.6);
  // a cornice stands proud under the clerestory
  const cornice = seRing({ a: RINGS.wall.a + 0.7, b: RINGS.wall.b + 0.7 }, N);
  surface('concrete_dark', [loopOf(ringWall, LEVELS.ledge - 0.6), loopOf(cornice, LEVELS.ledge - 0.6)], DOWN);
  surface('concrete', [loopOf(cornice, LEVELS.ledge - 0.6), loopOf(cornice, LEVELS.ledge)], outward);
  surface('concrete', [loopOf(cornice, LEVELS.ledge), loopOf(ringWall, LEVELS.ledge)], UP);
  surface('glass', [loopOf(ringWall, LEVELS.ledge), loopOf(ringWall, (i) => wallTop[i])], outward);
  if (near) { // slim white fins stand proud on the upper concrete band
    const fin = seRing({ a: RINGS.wall.a + 0.5, b: RINGS.wall.b + 0.5 }, N);
    for (let i = 0; i < N; i += 2) b.bar('concrete', W(fin[i][0], 19.8, fin[i][1]), W(fin[i][0], LEVELS.ledge - 0.6, fin[i][1]), 0.6);
  }

  // ---- roof ------------------------------------------------------------------------------------------------
  // One grid in superellipse rays; the rim stands on the eave ring and the middle closes on the plateau.
  const rhos = near ? [1, 0.965, 0.93, 0.895, 0.86, 0.82, 0.78, 0.74, 0.7, 0.65, 0.6, 0.55, 0.5, 0.42, 0.3, 0.15, 0.0] : [1, 0.95, 0.9, 0.85, 0.8, 0.74, 0.68, 0.62, 0.56, 0.5, 0.4, 0.25, 0.0];
  const rays = Array.from({ length: N }, (_, i) => (i / N) * Math.PI * 2);
  const rows = rhos.map((r) => rays.map((t) => { const [u, v] = seAt(RINGS.eave.a, RINGS.eave.b, t, r); return W(u, roofY(u, v), v); }));
  surface('roof', rows, UP);
  // fascia and soffit
  surface('concrete_dark', [loopOf(ringEdge, (i) => rimY[i]), loopOf(ringEdge, (i) => rimY[i] - 1.0)], outward);
  surface('concrete_dark', [loopOf(ringEdge, (i) => rimY[i] - 1.0), loopOf(ringWall, (i) => wallTop[i])], DOWN);

  // thin strips laid on the roof along a (u, v) path: seams, rails, ribs
  // (a strip never leaves the roof: points outside the eave ring, less a 1.5 m margin, are dropped)
  const onRoof = (mat, path0, width, lift) => {
    const inRoof = ([u, v]) => (Math.abs(u) / (RINGS.eave.a - 1.5)) ** BOWL.n + (Math.abs(v - cv) / (RINGS.eave.b - 1.5)) ** BOWL.n <= 1;
    const path = path0.filter(inRoof);
    if (path.length < 2) return;
    const L = [], Rr = [];
    path.forEach(([u, v], i) => {
      const a = path[Math.max(0, i - 1)], c = path[Math.min(path.length - 1, i + 1)];
      let tu = c[0] - a[0], tv = c[1] - a[1]; const m = Math.hypot(tu, tv) || 1; tu /= m; tv /= m;
      const lu = u - tv * width / 2, lv = v + tu * width / 2, ru = u + tv * width / 2, rv = v - tu * width / 2;
      L.push(W(lu, roofY(lu, lv) + lift, lv)); Rr.push(W(ru, roofY(ru, rv) + lift, rv));
    });
    surface(mat, [L, Rr], UP, { closed: false });
  };
  const alongV = (u, vMax, step) => { const out = []; for (let v = cv - vMax; v <= cv + vMax + 1e-6; v += step) out.push([u, v]); return out; };
  const alongU = (v, uMax, step) => { const out = []; for (let u = -uMax; u <= uMax + 1e-6; u += step) out.push([u, v]); return out; };
  const vMax = 84.5;
  onRoof('roof_seam', alongV(0, vMax, near ? 4.5 : 9), 1.2, 0.2);                     // where the two panels meet
  for (const v of ARCH_V) onRoof('roof_seam', alongU(v, 101, near ? 5 : 10), 1.6, 0.2); // the rails the panels hang from
  if (near) {
    for (const u of [-80, -68, -56, -44, -32, -20, -8, 8, 20, 32, 44, 56, 68, 80]) onRoof('roof_seam', alongV(u, vMax, 4.5), 0.4, 0.15);
    for (const dv of [-14, 14]) onRoof('roof_seam', alongU(cv + dv, 98, 5), 0.5, 0.15);
  }
  // photovoltaic arrays low on the fixed roof along both long sides and on the panels' parking ends
  const pvQuad = (u0, u1, v0, v1, su = 1, sv = 2) => {
    const grid = [];
    for (let k = 0; k <= sv; k++) {
      const v = v0 + (v1 - v0) * k / sv, row = [];
      for (let m = 0; m <= su; m++) { const u = u0 + (u1 - u0) * m / su; row.push(W(u, roofY(u, v) + (near ? 0.32 : 0.7), v)); }
      grid.push(row);
    }
    surface('solar', grid, UP, { closed: false });
  };
  const colsPv = near ? 16 : 8, uSpan = 144, colW = uSpan / colsPv;
  for (const sgn of [-1, 1]) for (let r = 0; r < (near ? 3 : 1); r++) {
    const rowH = near ? 4.4 : 15, v0 = 60 + r * (near ? 5.4 : 0), v1 = v0 + rowH;
    for (let c = 0; c < colsPv; c++) pvQuad(-72 + c * colW + 0.35, -72 + (c + 1) * colW - 0.35, cv + sgn * v0, cv + sgn * v1);
  }
  for (const sgn of [-1, 1]) pvQuad(sgn > 0 ? 76 : -94, sgn > 0 ? 94 : -76, cv - 30, cv + 30, 3, 4);

  // ---- Y-struts under the deck ---------------------------------------------------------------------------------
  if (keep('struts')) for (const t of struts(detail)) b.bar('concrete', t.foot, t.head, near ? 0.8 : 1.4);

  // ---- entrance pod, logo box, drums, stairs ------------------------------------------------------------------------------
  const yaw = -Math.atan2(W(1, 0, 0)[2], W(1, 0, 0)[0]); // rotates a box's x axis onto +u
  const boxUV = (mat, u, y0, y1, v, du, dv) => b.box(mat, W(u, (y0 + y1) / 2, v), [du, y1 - y0, dv], yaw, 0, 0);
  const frontV = cv - RINGS.deck.b; // v of the deck edge on the entrance side
  // pod: a low glazed entrance hall under a concrete canopy slab
  boxUV('glow', 1, 0, 3.9, frontV - 10.5, 88, 22);
  boxUV('concrete_dark', 1, 3.9, 5.2, frontV - 10.5, 90, 23.6);
  // logo box in front of the facade, standing on the pod canopy: a white block with nine round windows
  const boxV = frontV + 1.5 - 3.5, boxFace = boxV - 3.5;
  boxUV('concrete', 0, 5.2, 33, boxV, 30, 7);
  const disc = (mat, u, y, v, r, seg, thick) => {
    const g = new THREE.CylinderGeometry(r, r, thick, seg); g.rotateX(Math.PI / 2); g.rotateY(yaw); g.translate(...W(u, y, v)); b.put(g, mat, 0, 0);
  };
  for (const u of [-9.5, 0, 9.5]) for (const y of [13.5, 20.5, 27.5]) disc('glass', u, y, boxFace - 0.15, 2.5, near ? 12 : 6, 0.3);
  // silver stair drums
  const cyl = (mat, u, y0, y1, v, r, seg) => { const g = new THREE.CylinderGeometry(r, r, y1 - y0, seg); g.translate(...W(u, (y0 + y1) / 2, v)); b.put(g, mat, 0, 0); };
  for (const u of [-66, 68]) cyl('metal', u, 0, 15, cv - 89.4, 3.8, near ? 14 : 8);
  // long stairs hugging the deck edge down to the forecourt
  const slab = (mat, p, q, width, thick) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2], L = Math.hypot(dx, dy, dz);
    const g = new THREE.BoxGeometry(width, thick, L); g.rotateX(-Math.asin(dy / L)); g.rotateY(Math.atan2(dx, dz));
    g.translate((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2); b.put(g, mat, 0, 0);
  };
  if (keep('stairs')) for (const st of stairs(detail)) slab('concrete', st.top, st.bottom, 3, 0.6);

  // ---- corner masts ---------------------------------------------------------------------------------------------
  for (const vA of ARCH_V) for (const sgn of [-1, 1]) {
    boxUV('concrete_dark', sgn * MAST.core.u, 0, MAST.core.top, vA, MAST.core.du, MAST.core.dv);
    for (const [uu, top] of [[MAST.tallU, MAST.tall], [MAST.shortU, MAST.short]]) {
      cyl('truss', sgn * uu, MAST.core.top - 0.2, top, vA, near ? 0.85 : 1.2, near ? 8 : 5);
      for (const k of [2, 1, 0]) cyl('truss', sgn * uu, top - 0.4 - k * 1.9, top + 0.1 - k * 1.9, vA, 3.1 - k * 0.25, near ? 12 : 6);
      cyl('light', sgn * uu, top + 0.1, top + 0.45, vA, 2.7, near ? 12 : 6);
    }
    b.bar('truss', W(sgn * MAST.tallU, 39, vA), W(sgn * MAST.shortU, 39, vA), near ? 0.7 : 1.1);
  }

  // ---- the two arches --------------------------------------------------------------------------------------------
  const P = archPanels(detail), hw = near ? ARCH.bottomHalfWidth : 0;
  const uAt = (i) => archU(detail, i);
  if (keep('arches')) for (const vA of ARCH_V) {
    const T = (i) => W(uAt(i), archTop(uAt(i)), vA);
    const B = (i, s) => W(uAt(i), archBottom(uAt(i)), vA + s * hw);
    const sides = near ? [-1, 1] : [0];
    for (let i = 0; i < P; i++) {
      b.bar('truss', T(i), T(i + 1), near ? 1.1 : 1.9);
      for (const s of sides) {
        b.bar('truss', B(i, s), B(i + 1, s), near ? 0.9 : 1.6);
        if (i % 2 === 0) b.bar('truss', T(i), B(i + 1, s), near ? 0.5 : 0.9); else b.bar('truss', B(i, s), T(i + 1), near ? 0.5 : 0.9);
      }
    }
    for (let i = 0; i <= P; i++) {
      const post = near ? i % 2 === 1 || i === 0 || i === P : i % 2 === 0;
      if (!post) continue;
      for (const s of sides) b.bar('truss', T(i), B(i, s), near ? 0.5 : 0.9);
      if (near) b.bar('truss', B(i, -1), B(i, 1), 0.5);
    }
  }
  // hangers: the roof panels hang from the arch's tie bars
  if (keep('hangers')) for (const h of hangers(detail)) b.bar('truss', h.top, h.bottom, near ? 0.45 : 0.9);
  return b.finish();
}
