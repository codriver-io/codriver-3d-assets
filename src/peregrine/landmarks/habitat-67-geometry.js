import { assetBuilder } from './asset-geometry.js';
import { BufferGeometry, Float32BufferAttribute } from 'three';
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
export function habitatModules() {
  const modules = [];
  for (const [cluster, center] of HABITAT_PEAKS.entries()) {
    for (const [level, count] of COURSES.entries()) {
      for (let j = 0; j < count; j++) {
        const offset = (j - (count - 1) / 2) * 13.1 + COURSE_SHIFT[level];
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
  const modules = habitatModules();
  // The low plaza is split into the same zigzag wings; no giant parcel slab.
  for (const center of HABITAT_PEAKS) for (const sign of [-1, 1]) {
    for (let j = 0; j < 4; j++) box('stone', center + sign * (j * 11.8 + 4), -26 + j * 9.3,
      HABITAT_PLAZA / 2, 14.4, 24, HABITAT_PLAZA);
  }
  for (const [u, v] of [[-45, 30], [55, 20]]) box('stone', u, v, HABITAT_PLAZA / 2, 24, 29, HABITAT_PLAZA);

  for (const m of modules) {
    const y = HABITAT_PLAZA + m.level * H;
    const width = m.turn ? W : L, depth = m.turn ? L : W;
    const restsOnBox = modules.some(n => n.level === m.level - 1
      && Math.abs(n.u - m.u) < (width + (n.turn ? W : L)) / 2
      && Math.abs(n.v - m.v) < (depth + (n.turn ? L : W)) / 2);
    if (m.level && !restsOnBox) {
      // Precast props beneath the open lower clusters, matching the support
      // vocabulary in the engineering reference. Their toes stay at ground.
      for (const sign of [-1, 1]) box('concrete', m.u + sign * width * 0.3, m.v, y / 2, 0.55, 0.55, y);
    }
    // Local module coordinates preserve the right-angle L pair.
    const part = (mat, a, c, h, da, dc, dh) => {
      if (mat === 'glass' || mat === 'rail') {
        // Window/mullion faces have no hidden box backs: two triangles each.
        const end = da < 0.15, width = end ? dc : da;
        const coords = [[-width / 2, -dh / 2], [width / 2, -dh / 2], [width / 2, dh / 2], [-width / 2, dh / 2]];
        const positions = coords.flatMap(([w, hh]) => {
          const aa = a + (end ? 0 : w), cc = c + (end ? w : 0);
          return habitatPoint(m.u + (m.turn ? cc : aa), m.v + (m.turn ? aa : cc), y + h + hh);
        });
        const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(positions, 3));
        const reverse = (end ? a > 0 : c < 0) !== m.turn;
        g.setIndex(reverse ? [0, 2, 1, 0, 3, 2] : [0, 1, 2, 0, 2, 3]); g.computeVertexNormals(); b.put(g, mat); return;
      }
      box(mat, m.u + (m.turn ? c : a), m.v + (m.turn ? a : c), y + h,
        m.turn ? dc : da, m.turn ? da : dc, dh);
    };
    // Recessed glazing behind concrete perimeter walls, roof and floor.
    if (near) {
      part('concrete', 0, 0, 0.16, L, W, 0.32);
      part('concrete', 0, 0, H - 0.15, L, W, 0.30);
      part('concrete', 0, 0, H / 2, L - 0.46, W - 0.54, H - 0.62);
    } else part('concrete', 0, 0, H / 2, L - 0.22, W - 0.12, H);
    for (const sign of [-1, 1]) {
      // Deep, broad end windows: frame thickness is legible at road distance.
      part('glass', sign * (L / 2 - 0.09), 0, H * 0.51, 0.05, W - 1.15, H - 1.0);
      if (near) for (const c of [-W / 2 + 0.20, W / 2 - 0.20]) part('concrete', sign * (L / 2 - 0.20), c, H / 2, 0.4, 0.4, H);
      // Side window rhythm alternates generous living-room and narrow openings.
      for (const a of near ? [-3.7, 0.2, 4] : [-2.9, 3.1]) {
        part('glass', a, sign * (W / 2 - 0.03), H * 0.53, near ? 2.25 : 3.1, 0.06, 1.63);
        if (near) part('rail', a, sign * (W / 2 + 0.005), H * 0.53, 0.07, 0.09, 1.63);
      }
      if (near) part('rail', sign * (L / 2 - 0.045), 0, H * 0.51, 0.065, 0.09, H - 1.0);
    }
    // Only exposed roof strips get terraces; never fill inter-module voids.
    const above = modules.filter(n => n.level === m.level + 1);
    const du = m.turn ? W : L, dv = m.turn ? L : W;
    const exposed = !above.some(n => Math.abs(n.u - m.u) < (du + (n.turn ? W : L)) * 0.38 && Math.abs(n.v - m.v) < (dv + (n.turn ? L : W)) * 0.38);
    if (exposed) {
      box('roof', m.u, m.v, y + H + 0.035, du - 0.5, dv - 0.5, 0.07);
      if (near) for (const sign of [-1, 1]) {
        box('rail', m.u, m.v + sign * (dv / 2 - 0.16), y + H + 0.85, du, 0.075, 0.075);
        box('rail', m.u + sign * (du / 2 - 0.16), m.v, y + H + 0.85, 0.075, dv, 0.075);
        if (near) for (const t of [-0.45, 0, 0.45]) box('rail', m.u + t * du, m.v + sign * (dv / 2 - 0.16), y + H + 0.43, 0.065, 0.065, 0.86);
      }
      if (near && m.level % 3 === 0) {
        box('stone', m.u + du * 0.28, m.v, y + H + 0.27, 1.3, 2.2, 0.48);
        box('steel', m.u + du * 0.28, m.v, y + H + 0.73, 1.15, 2, 0.65);
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
      for (const side of [-1, 1]) bar('rail', [a[0], a[1] + side * 1.3, y + 1.1], [c[0], c[1] + side * 1.3, y + 1.1], 0.11);
      if (near) for (let j = 0; j <= span; j += 3.5) {
        const u = center + sign * j, v = 2 + j * 0.70;
        for (const side of [-1, 1]) bar('rail', [u, v + side * 1.3, y + 0.55], [u, v + side * 1.3, y + 1.15], 0.08);
      }
      // Escape stair shafts support the distal ends; intermediate columns stay
      // on ground rather than hanging from the authored plaza datum.
      box('concrete', c[0], c[1], (y + 0.7) / 2, 2.7, 3.2, y + 0.7);
      if (near) for (let h = 2; h < y; h += H) box('glass', c[0] + sign * 1.37, c[1], h, 0.05, 1.8, 0.40);
    }
    for (const sign of [-1, 1]) box('concrete', center + sign * 12, 7.5, H * 2, 0.65, 0.65, H * 4);
    // Ground supports under the relocated end clusters and transfer members
    // over the two lower courtyard openings.
    for (const sign of [-1, 1]) {
      for (const dv of [16, 27]) box('concrete', center + sign * 32, dv, (HABITAT_PLAZA + H) / 2, 0.7, 0.7, HABITAT_PLAZA + H);
      box('concrete', center + sign * 19.65, -18.5, HABITAT_PLAZA + H * 3 - 0.35, 18, 0.9, 0.7);
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
      for (const sign of [-1, 1]) bar('rail', [from[0], from[1] + sign * 1.3, y + 1.1], [to[0], to[1] + sign * 1.3, y + 1.1], 0.10);
    }
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
