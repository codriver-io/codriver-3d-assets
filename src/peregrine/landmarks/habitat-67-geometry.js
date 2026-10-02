import { assetBuilder } from './asset-geometry.js';
import { BufferGeometry, ConeGeometry, Float32BufferAttribute } from 'three';
import { HABITAT, HABITAT_PALETTES, habitatPoint } from './habitat-67-config.js';

// Explicit, editable composition: three interlocking stepped pyramids, two
// lower saddles, and L-paired boxes. Interpreted from the OSM plan, Safdie's
// river/street photos and Komocki's section; not an apartment-by-apartment BIM.
// 53 pairs per pyramid + 36 saddle modules = 354 modules. No random placement.
const COURSES = [6, 6, 6, 6, 5, 5, 4, 4, 4, 3, 2, 2];
// A repeating four-course structural rhythm, with offsets read as a stepped
// cluster rather than continuous horizontal apartment terraces.
const COURSE_SHIFT = [-2.4, 2.9, -1.6, 3.1, 0, -3.0, 2.6, -2.8, 1.6, -2.0, 3.1, -1.8];
export const HABITAT_PEAKS = [-99, 10, 97];
export const HABITAT_PLAZA = 0.65;
const [L, W, H] = HABITAT.module;
// Module pitch along a course: 14.0 m leaves ~2 m sky slots between neighbours (13.1 m left ~1 m).
const COURSE_PITCH = 14.0;
export function habitatModules() {
  const modules = [];
  for (const [cluster, center] of HABITAT_PEAKS.entries()) {
    for (const [level, count] of COURSES.entries()) {
      for (let j = 0; j < count; j++) {
        const offset = (j - (count - 1) / 2) * COURSE_PITCH + COURSE_SHIFT[level];
        let u = center + offset, v = -34 + level * 2.25 + Math.abs(offset) * 0.79;
        // Two paired lower-course openings per pyramid, with those modules
        // occupying the river-side end clusters under the street girders.
        if ((level === 1 || level === 2) && (j === 1 || j === count - 2)) {
          u = center + (j === 1 ? -32 : 32); v = 17 + (level - 1) * 2.25;
        }
        const handed = (level + j + cluster) % 2 ? 1 : -1;
        modules.push({ u, v, level, turn: false, cluster });
        // Long side meets the end wall of its mate, as in the construction paper.
        modules.push({ u: u + handed * (L - W) / 2, v: v + (L + W) / 2, level, turn: true, cluster });
      }
    }
  }
  for (const [cluster, u, v] of [[3, -45, 30], [4, 55, 20]]) {
    for (let level = 0; level < 6; level++) {
      for (let j = 0; j < 3; j++) modules.push({
        u: u + (j - 1) * 6.0 + (level % 2 ? 1.5 : 0),
        v: v + (j % 2) * 7 - level * 1.7,
        level, turn: true, cluster,
      });
    }
  }
  return modules;
}


// ---- faces, not boxes -------------------------------------------------------------------------
// Every module is built from the faces that can be seen: walls minus the parts abutting a
// same-level neighbour, tops minus the parts under the course above, bottoms minus the parts on
// the course below or the plaza. Windows are single quads 4.5 cm proud of their wall and their
// mullions 9.5 cm: no two materials share a plane, and no hidden box backs are exported.
const WIN = 0.045, MUL = 0.095, TOL = 0.02;
const rectOf = (m) => {
  const du = m.turn ? W : L, dv = m.turn ? L : W, y0 = HABITAT_PLAZA + m.level * H;
  return { u0: m.u - du / 2, u1: m.u + du / 2, v0: m.v - dv / 2, v1: m.v + dv / 2, y0, y1: y0 + H, m };
};
function subtractRects(rect, cutters) {
  let pieces = [{ u0: rect.u0, u1: rect.u1, v0: rect.v0, v1: rect.v1 }];
  for (const c of cutters) {
    const next = [];
    for (const p of pieces) {
      if (c.u1 <= p.u0 + 1e-6 || c.u0 >= p.u1 - 1e-6 || c.v1 <= p.v0 + 1e-6 || c.v0 >= p.v1 - 1e-6) { next.push(p); continue; }
      if (c.u0 > p.u0) next.push({ u0: p.u0, u1: c.u0, v0: p.v0, v1: p.v1 });
      if (c.u1 < p.u1) next.push({ u0: c.u1, u1: p.u1, v0: p.v0, v1: p.v1 });
      const a = Math.max(p.u0, c.u0), b = Math.min(p.u1, c.u1);
      if (c.v0 > p.v0) next.push({ u0: a, u1: b, v0: p.v0, v1: c.v0 });
      if (c.v1 < p.v1) next.push({ u0: a, u1: b, v0: c.v1, v1: p.v1 });
    }
    pieces = next;
  }
  return pieces.filter(p => (p.u1 - p.u0) * (p.v1 - p.v0) > 0.05);
}
// Intervals of [lo, hi] left after removing the cut intervals.
function subtractIntervals(lo, hi, cuts) {
  let out = [[lo, hi]];
  for (const [a, b] of cuts) {
    const next = [];
    for (const [x, y] of out) {
      if (b <= x + 1e-6 || a >= y - 1e-6) { next.push([x, y]); continue; }
      if (a > x) next.push([x, a]);
      if (b < y) next.push([b, y]);
    }
    out = next;
  }
  return out.filter(([x, y]) => y - x > 0.05);
}
// Plaza wings (stone, top at HABITAT_PLAZA); level-0 module undersides over them are hidden.
function plazaRects() {
  const rects = [];
  for (const center of HABITAT_PEAKS) for (const sign of [-1, 1]) for (let j = 0; j < 4; j++) {
    const u = center + sign * (j * 11.8 + 4), v = -26 + j * 9.3;
    rects.push({ u0: u - 7.2, u1: u + 7.2, v0: v - 12, v1: v + 12 });
  }
  for (const [u, v] of [[-45, 30], [55, 20]]) rects.push({ u0: u - 12, u1: u + 12, v0: v - 14.5, v1: v + 14.5 });
  return rects;
}
const hash = (m, k = 0) => {
  let h = Math.imul(m.cluster + 1, 73856093) ^ Math.imul(m.level + 1, 19349663) ^ Math.imul(Math.round(m.u * 10), 83492791) ^ Math.imul(Math.round(m.v * 10), 2654435761) ^ Math.imul(k + 1, 40503);
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; return h >>> 0;
};
// Opening patterns: offsets from the wall centre, width, height, centre height above the floor.
const LONG_WALL = [
  { w: [[-3.7, 2.25, 1.63, 1.62], [0.2, 2.25, 1.63, 1.62], [4, 2.25, 1.63, 1.62]], mull: [] },
  { w: [[0, 8.6, 1.35, 1.68]], mull: [-2.15, 0, 2.15] },
  { w: [[-3.1, 4.6, 1.95, 1.58], [3.1, 4.6, 1.95, 1.58]], mull: [-3.1, 3.1] },
  { w: [[-4.7, 0.8, 1.95, 1.58], [1.2, 5.2, 1.6, 1.62]], mull: [1.2] },
  { w: [[3.4, 1.3, 1.1, 1.7]], mull: [] },
];
const LONG_WEIGHT = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4]; // 30% / 20% / 20% / 20% / 10%
const END_WALL = [
  { w: [[0, 4.18, 2.05, 1.55]], mull: [0] },
  { w: [[0.9, 2.2, 2.2, 1.2 + 0.55], [-1.5, 1.2, 1.3, 1.9]], mull: [] },
  { w: [[0, 2.6, 1.9, 1.55]], mull: [] },
  { w: [], mull: [] },
];
const END_WEIGHT = [0, 0, 0, 1, 1, 2, 2, 3, 3];

export function createHabitat67({ detail = 'near' } = {}) {
  const b = assetBuilder(HABITAT, detail), near = detail === 'near';
  const rotation = Math.PI / 2 - HABITAT.bearing * Math.PI / 180;
  const box = (mat, u, v, y, du, dv, dy) => b.box(mat, habitatPoint(u, v, y), [du, dy, dv], rotation);
  const bar = (mat, a, c, w, d = w) => {
    const from = habitatPoint(...a), to = habitatPoint(...c);
    if (Math.abs(from[1] - to[1]) < 1e-6) {
      // A pedestrian street has a horizontal top, irrespective of plan angle.
      const dx = to[0] - from[0], dz = to[2] - from[2];
      b.box(mat, from.map((v, i) => (v + to[i]) / 2), [Math.hypot(dx, dz), w, d], -Math.atan2(dz, dx));
    } else b.bar(mat, from, to, w, d);
  };
  // Quad accumulator: one merged geometry per material, unshared vertices (flat normals).
  const batches = new Map();
  const quad = (mat, pts, out) => {
    let w = pts.map(p => habitatPoint(...p));
    const e = (i, j) => [w[j][0] - w[i][0], w[j][1] - w[i][1], w[j][2] - w[i][2]], a = e(0, 1), c = e(0, 2);
    const n = [a[1] * c[2] - a[2] * c[1], a[2] * c[0] - a[0] * c[2], a[0] * c[1] - a[1] * c[0]];
    if (Math.hypot(...n) < 1e-9) return;
    const o = habitatPoint(...out);
    if (n[0] * o[0] + n[1] * o[1] + n[2] * o[2] < 0) w = w.reverse();
    if (!batches.has(mat)) batches.set(mat, { pos: [], idx: [] });
    const t = batches.get(mat), base = t.pos.length / 3;
    for (const p of w) t.pos.push(...p);
    t.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };
  // Axis-aligned faces in authoring (u, v, y).
  const top = (mat, r, y, dy = 0) => quad(mat, [[r.u0, r.v0, y + dy], [r.u1, r.v0, y + dy], [r.u1, r.v1, y + dy], [r.u0, r.v1, y + dy]], [0, 0, 1]);
  const bottom = (mat, r, y) => quad(mat, [[r.u0, r.v0, y], [r.u1, r.v0, y], [r.u1, r.v1, y], [r.u0, r.v1, y]], [0, 0, -1]);
  // Wall on plane u (axis 'u') or v (axis 'v'), spanning [a0, a1] along the other axis, facing sign.
  const wall = (mat, axis, plane, a0, a1, y0, y1, sign) => axis === 'u'
    ? quad(mat, [[plane, a0, y0], [plane, a1, y0], [plane, a1, y1], [plane, a0, y1]], [sign, 0, 0])
    : quad(mat, [[a0, plane, y0], [a1, plane, y0], [a1, plane, y1], [a0, plane, y1]], [0, sign, 0]);
  // Box from y0 to y1 without the listed faces ('b' bottom, 't' top).
  const column = (mat, u, v, y0, y1, du, dv, skip = '') => {
    const r = { u0: u - du / 2, u1: u + du / 2, v0: v - dv / 2, v1: v + dv / 2 };
    if (!skip.includes('t')) top(mat, r, y1);
    if (!skip.includes('b')) bottom(mat, r, y0);
    wall(mat, 'u', r.u1, r.v0, r.v1, y0, y1, 1); wall(mat, 'u', r.u0, r.v0, r.v1, y0, y1, -1);
    wall(mat, 'v', r.v1, r.u0, r.u1, y0, y1, 1); wall(mat, 'v', r.v0, r.u0, r.u1, y0, y1, -1);
  };

  const modules = habitatModules(), rects = modules.map(rectOf), plazas = plazaRects();
  const byLevel = new Map();
  for (const r of rects) { if (!byLevel.has(r.m.level)) byLevel.set(r.m.level, []); byLevel.get(r.m.level).push(r); }
  const at = (level) => byLevel.get(level) || [];

  // The low plaza is split into the same zigzag wings; no giant parcel slab. Undersides stay on the ground.
  for (const p of plazas) column('stone', (p.u0 + p.u1) / 2, (p.v0 + p.v1) / 2, 0, HABITAT_PLAZA, p.u1 - p.u0, p.v1 - p.v0, 'b');

  for (const r of rects) {
    const { m, y0, y1 } = r;
    const du = r.u1 - r.u0, dv = r.v1 - r.v0;
    const neighbours = at(m.level).filter(n => n !== r);
    // Precast props beneath modules that bear on no box below (their toes stay at ground).
    if (m.level && !at(m.level - 1).some(n => Math.abs(n.m.u - m.u) < (du + (n.u1 - n.u0)) / 2 && Math.abs(n.m.v - m.v) < (dv + (n.v1 - n.v0)) / 2)) {
      for (const sign of [-1, 1]) column('concrete', m.u + sign * du * 0.3, m.v, 0, y0, 0.55, 0.55, 'b');
    }
    // Underside: only the part not resting on the course below / the plaza.
    const under = m.level ? at(m.level - 1) : plazas;
    if (near) for (const piece of subtractRects(r, under)) bottom('concrete', piece, y0); // far is never seen from below
    // Walls.
    const dirs = [
      { axis: 'u', sign: 1, plane: r.u1, lo: r.v0, hi: r.v1, mid: m.v, len: dv, covers: n => n.u0 - TOL <= r.u1 && r.u1 < n.u1 - TOL, span: n => [n.v0, n.v1] },
      { axis: 'u', sign: -1, plane: r.u0, lo: r.v0, hi: r.v1, mid: m.v, len: dv, covers: n => n.u0 + TOL < r.u0 && r.u0 <= n.u1 + TOL, span: n => [n.v0, n.v1] },
      { axis: 'v', sign: 1, plane: r.v1, lo: r.u0, hi: r.u1, mid: m.u, len: du, covers: n => n.v0 - TOL <= r.v1 && r.v1 < n.v1 - TOL, span: n => [n.u0, n.u1] },
      { axis: 'v', sign: -1, plane: r.v0, lo: r.u0, hi: r.u1, mid: m.u, len: du, covers: n => n.v0 + TOL < r.v0 && r.v0 <= n.v1 + TOL, span: n => [n.u0, n.u1] },
    ];
    for (const [index, d] of dirs.entries()) {
      d.visible = subtractIntervals(d.lo, d.hi, neighbours.filter(d.covers).map(d.span));
      const long = d.len > 8;
      const pattern = long ? LONG_WALL[LONG_WEIGHT[hash(m, index) % LONG_WEIGHT.length]] : END_WALL[END_WEIGHT[hash(m, index) % END_WEIGHT.length]];
      for (const [a, c] of d.visible) {
        wall('concrete', d.axis, d.plane, a, c, y0, y1, d.sign);
        const proud = d.plane + d.sign * WIN, mullion = d.plane + d.sign * MUL;
        if (!near) {
          // Far: one dark band per visible wall run (a module row), no panes or mullions.
          if (c - a > (long ? 4 : 3.2)) wall('glass', d.axis, proud, a + (long ? 0.8 : 0.6), c - (long ? 0.8 : 0.6), y0 + 0.9, y0 + 2.45, d.sign);
          continue;
        }
        for (const [off, w, h, yc] of pattern.w) {
          const lo = d.mid + off - w / 2, hi = d.mid + off + w / 2;
          if (lo - 0.25 < a || hi + 0.25 > c) continue; // the opening must sit inside this visible run
          const yLo = y0 + Math.max(0.4, yc - h / 2), yHi = Math.min(y1 - 0.25, yLo + h);
          wall('glass', d.axis, proud, lo, hi, yLo, yHi, d.sign);
          for (const mo of pattern.mull) if (mo > off - w / 2 + 0.2 && mo < off + w / 2 - 0.2) wall('rail', d.axis, mullion, d.mid + mo - 0.035, d.mid + mo + 0.035, yLo, yHi, d.sign);
        }
      }
    }
    // Terraces: the roof surface left uncovered by the course above. Near adds a low railing on the
    // open perimeter, a few green patches and the odd conifer, as on the river-side gardens.
    const above = at(m.level + 1);
    for (const piece of subtractRects(r, above)) {
      top('roof', piece, y1);
      if (!near) continue;
      const area = (piece.u1 - piece.u0) * (piece.v1 - piece.v0), pu = (piece.u0 + piece.u1) / 2, pv = (piece.v0 + piece.v1) / 2;
      for (const d of dirs) {
        const edge = d.axis === 'u' ? (d.sign > 0 ? piece.u1 : piece.u0) : (d.sign > 0 ? piece.v1 : piece.v0);
        if (Math.abs(edge - d.plane) > 1e-6) continue;
        const [pa, pb] = d.axis === 'u' ? [piece.v0, piece.v1] : [piece.u0, piece.u1];
        for (const [a, c] of d.visible) {
          const lo = Math.max(a, pa), hi = Math.min(c, pb);
          if (hi - lo < 0.6) continue;
          const plane = d.plane - d.sign * 0.16;
          wall('concrete', d.axis, plane, lo + 0.16, hi - 0.16, y1, y1 + 0.9, d.sign);
          wall('concrete', d.axis, plane - d.sign * 0.001, lo + 0.16, hi - 0.16, y1, y1 + 0.9, -d.sign);
        }
      }
      const h = hash(m, 9);
      if (area > 7 && h % 3 === 0) top('steel', { u0: pu - 1.3, u1: pu + 1.3, v0: pv - 1.3, v1: pv + 1.3 }, y1, WIN);
      if (area > 9 && m.level >= 2 && m.level <= 10 && h % 4 === 1) {
        const g = new ConeGeometry(0.85, 3.4, 5, 1, true); g.rotateY(rotation); g.translate(...habitatPoint(pu + 1.5, pv, y1 + 1.7)); b.put(g, 'steel');
      }
    }
  }

  // Three split elevator cores: the central slot remains open in both LODs.
  // Street girders at levels 5 and 9 tie the stepped wings to these cores.
  for (const center of HABITAT_PEAKS) {
    for (const offset of [-2.35, 2.35]) box('concrete', center + offset, 1.5, 19, 1.65, 5.4, 38);
    for (const y of [HABITAT_PLAZA + H * 4, HABITAT_PLAZA + H * 8, 37.5]) box('concrete', center, 1.5, y, 6.3, 5.4, 0.65);
    for (const level of [4, 8]) for (const sign of [-1, 1]) {
      const y = HABITAT_PLAZA + H * level, span = level === 4 ? 34 : 23;
      const a = [center, 2.0, y], c = [center + sign * span, 2 + span * 0.70, y];
      bar('concrete', a, c, 1.25, 3.3);
      if (near) for (const side of [-1, 1]) bar('rail', [a[0], a[1] + side * 1.3, y + 1.1], [c[0], c[1] + side * 1.3, y + 1.1], 0.11);
      // Escape stair shafts support the distal ends; intermediate columns stay
      // on ground rather than hanging from the authored plaza datum.
      box('concrete', c[0], c[1], (y + 0.7) / 2, 2.7, 3.2, y + 0.7);
      if (near) for (let h = 2; h < y; h += H) wall('glass', 'u', c[0] + sign * (1.35 + WIN), c[1] - 0.9, c[1] + 0.9, h - 0.2, h + 0.2, sign);
    }
    for (const sign of [-1, 1]) box('concrete', center + sign * 12, 7.5, H * 2, 0.65, 0.65, H * 4);
    // Ground supports under the relocated end clusters and transfer members
    // over the two lower courtyard openings.
    for (const sign of [-1, 1]) {
      for (const dv of [16, 27]) box('concrete', center + sign * 32, dv, (HABITAT_PLAZA + H) / 2, 0.7, 0.7, HABITAT_PLAZA + H);
      box('concrete', center + sign * 19.65, -18.5, HABITAT_PLAZA + H * 3 - 0.31, 18, 0.9, 0.7);
    }
  }
  // The fifth-level pedestrian street remains continuous through both low
  // saddles. These short links join the three pyramids into one complex.
  for (const [a, middle, c] of [
    [[-65, 25.8], [-45, 30], [-24, 25.8]],
    [[44, 25.8], [55, 28], [63, 25.8]],
  ]) {
    const y = HABITAT_PLAZA + H * 4;
    for (const [from, to] of [[a, middle], [middle, c]]) {
      bar('concrete', [...from, y], [...to, y], 1.25, 3.3);
      if (near) for (const sign of [-1, 1]) bar('rail', [from[0], from[1] + sign * 1.3, y + 1.1], [to[0], to[1] + sign * 1.3, y + 1.1], 0.10);
    }
  }
  for (const [mat, t] of batches) {
    const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(t.pos, 3)); g.setIndex(t.idx); g.computeVertexNormals(); b.put(g, mat);
  }
  const model = b.finish();
  model.traverse(o => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift'); // Buildings have no road/deformation contract.
    o.material.color.set(HABITAT_PALETTES.light[o.material.name]);
  });
  model.userData.moduleCount = modules.length;
  return model;
}
