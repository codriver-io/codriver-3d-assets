import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ferryKit } from './ferry-building-kit.js';
import { addTower } from './ferry-building-tower.js';
import { SIGN, wordBoxes, wordLength } from './ferry-building-sign.js';
import { ROTATION, PLAN, H } from './ferry-building-site.js';

const range = (n) => Array.from({ length: n }, (_, i) => i);
const centres = (a0, a1, n) => range(n).map((i) => a0 + ((i + 0.5) * (a1 - a0)) / n);

/**
 * The San Francisco Ferry Building (A. Page Brown, 1898), as it stands today: the 201.6 m block along the
 * Embarcadero with its arcaded city front (two storeys of round-headed openings, 18 bays a side), the 43 m
 * central pavilion that projects toward Market Street (three great arched windows over three portals between
 * paired columns), the 75 m clock tower of stepped stages above it, the Grand Nave roof with its glazed
 * clerestories, the arched bay side (22 lunettes over two glazed bands, a walkway canopy), the gabled ends and the
 * lit "PORT OF" / "SAN FRANCISCO" roof signs.
 *
 * Authored in the facade frame (u along the building toward the NNW, v from Market Street to the bay, y up; see
 * ferry-building-site.js) and rotated once onto east / up / south at the end. Walls with openings are slabs with
 * the openings punched through and the infill tucked into the back of the reveal, so no two same-facing faces share a
 * plane; trims stand proud by 0.1 m or more.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = ferryKit(b, near);
  const { box, slab, windowSet, prismU, cyl } = k;
  const arcN = k.seg(8, 0.5);
  const { u0: U0, u1: U1, v0: V0, v1: V1, pavU0, pavU1, pavV } = PLAN;
  const c0 = (pavU0 + pavU1) / 2;
  const END = 101.1; // horizontal courses run 0.3 m past the end walls

  // ---------------------------------------------------------------- city front: the two arcaded wings
  const WALL_T = 1.0, WALL_TOP = 13.7;
  const ARCADE_T = 2.2; // the ground storey is a deep arcade; the upper wall is 1 m thick
  function wing(u0, u1, n) {
    const cs = centres(u0, u1, n);
    const ground = cs.map((c) => ({ a0: c - 1.45, a1: c + 1.45, y0: 0, y1: 3.9, arch: true, rise: 1.45, kind: 'ground' }));
    const upper = cs.map((c) => ({ a0: c - 1.5, a1: c + 1.5, y0: 5.5, y1: 11.0, arch: true, rise: 1.5, kind: 'upper' }));
    slab('stone', 'u', u0, u1, 0, 4.6, V0, ARCADE_T, ground, -1, arcN);
    slab('stone', 'u', u0, u1, 4.6, WALL_TOP, V0, WALL_T, upper, -1, arcN);
    for (const h of ground) windowSet('u', V0, ARCADE_T, -1, h, 'glass', arcN, false);
    for (const h of upper) windowSet('u', V0, WALL_T, -1, h, 'glow', arcN, true);
    const e0 = u0 === U0 ? -END : u0, e1 = u1 === U1 ? END : u1;
    box('pale', e0, e1, 4.55, 5.05, V0 - 0.25, V0 + 0.1); // string course
    box('pale', e0, e1, 13.4, H.wing, V0 - 0.6, V0 + 1.4); // cornice
    if (near) for (let i = 1; i < n; i++) { // piers stand 0.18 m proud between the arches, under and over the string course
      const u = u0 + (i * (u1 - u0)) / n;
      box('stone', u - 0.4, u + 0.4, 0, 4.55, V0 - 0.18, V0 + 0.2);
      box('stone', u - 0.4, u + 0.4, 5.05, 13.4, V0 - 0.18, V0 + 0.2);
    }
  }
  wing(U0, pavU0, 18);
  wing(pavU1, U1, 18);

  // ---------------------------------------------------------------- the central pavilion
  const PV = { face: -31.4, t: 1.2, colV: -31.7 };
  {
    const bigs = [-9.35, 0, 9.35], sides = [-17.5, 17.5];
    const holes = [
      ...bigs.map((dx) => ({ a0: c0 + dx - 3.2, a1: c0 + dx + 3.2, y0: 5.6, y1: 11.0, arch: true, rise: 3.2, kind: 'great' })),
      ...bigs.map((dx) => ({ a0: c0 + dx - 3.1, a1: c0 + dx + 3.1, y0: 0, y1: 3.9, kind: 'portal' })),
      ...sides.map((dx) => ({ a0: c0 + dx - 1.6, a1: c0 + dx + 1.6, y0: 0, y1: 4.5, arch: true, rise: 1.6, kind: 'side' })),
      ...sides.flatMap((dx) => [-1.4, 0, 1.4].map((o) => ({ a0: c0 + dx + o - 0.45, a1: c0 + dx + o + 0.45, y0: 7.6, y1: 9.8, kind: 'small' }))),
    ];
    slab('stone', 'u', pavU0, pavU1, 0, 13.6, PV.face, PV.t, holes, -1, arcN);
    for (const h of holes) windowSet('u', PV.face, PV.t, -1, h, h.kind === 'great' || h.kind === 'small' ? 'glow' : 'glass', arcN, h.kind === 'great');
    // paired columns on tall plinths: six pairs, five bays
    for (const pc of [-20.3, -14, -4.7, 4.7, 14, 20.3]) {
      const hw = Math.abs(pc) > 20 ? 1.1 : 1.15;
      box('base', c0 + pc - hw, c0 + pc + hw, 0, 3.4, pavV, pavV + 1.6);
      for (const s of [-0.6, 0.6]) {
        const x = c0 + pc + s;
        cyl('stone', x, PV.colV, 0.42, 0.42, 3.3, 11.1, 8, true);
        box('pale', x - 0.55, x + 0.55, 11.0, 11.85, PV.colV - 0.55, PV.colV + 0.55);
      }
    }
    box('pale', pavU0 + 0.1, pavU1 - 0.1, 11.8, 13.3, -32.0, -31.0);     // entablature
    box('pale', pavU0 - 0.3, pavU1 + 0.3, 13.3, 14.1, -32.9, -30.4);     // cornice
    box('pale', pavU0 - 0.3, pavU0 + 0.5, 13.3, 14.1, -30.4, -22.6);     // side cornices
    box('pale', pavU1 - 0.5, pavU1 + 0.3, 13.3, 14.1, -30.4, -22.6);
    box('stone', pavU0 + 0.2, pavU1 - 0.2, 14.1, 15.9, -31.9, -30.5);    // attic parapet
    box('stone', pavU0 + 0.2, pavU0 + 0.8, 14.1, 15.9, -30.5, -23.9);
    box('stone', pavU1 - 0.8, pavU1 - 0.2, 14.1, 15.9, -30.5, -23.9);
    box('pale', pavU0 + 0.05, pavU1 - 0.05, 15.9, H.pavilion, -32.05, -30.35); // coping
    box('stone', pavU0 + 0.8, pavU1 - 0.8, 0, 15.0, -30.2, -22.6);       // the body behind the front slab
    box('roof', pavU0 + 0.8, pavU1 - 0.8, 15.0, 15.05, -30.2, -23.9);    // roof deck
    // returns: a ground arch and an upper window on each side face
    for (const [face, facing] of [[pavU0, -1], [pavU1, 1]]) {
      const holes2 = [
        { a0: -28.4, a1: -25.4, y0: 0, y1: 4.4, arch: true, rise: 1.5, kind: 'ground' },
        { a0: -28.4, a1: -25.4, y0: 5.6, y1: 11.0, arch: true, rise: 1.5, kind: 'upper' },
      ];
      slab('stone', 'v', -30.2, -22.6, 0, 13.6, face, 0.8, holes2, facing, arcN);
      for (const h of holes2) windowSet('v', face, 0.8, facing, h, h.kind === 'ground' ? 'glass' : 'glow', arcN, h.kind === 'upper');
    }
  }

  // ---------------------------------------------------------------- tower
  addTower(k, near, { u: PLAN.towerU, v: PLAN.towerV });

  // ---------------------------------------------------------------- bay side: lunettes over two glazed bands
  {
    const n = 22, t = 0.8, pitch = (U1 - U0) / n;
    const holes = centres(U0, U1, n).flatMap((c) => [
      { a0: c - 4.0, a1: c + 4.0, y0: 0.2, y1: 3.8, kind: 'shop' },
      { a0: c - 4.0, a1: c + 4.0, y0: 4.6, y1: 8.0, kind: 'band' },
      { a0: c - 3.95, a1: c + 3.95, y0: 8.9, y1: 12.85, arch: true, rise: 3.95, kind: 'lunette' },
    ]);
    slab('stone', 'u', U0, U1, 0, WALL_TOP, V1, t, holes, 1, near ? 14 : 6);
    for (const h of holes) windowSet('u', V1, t, 1, h, h.kind === 'lunette' ? 'glow' : 'glass', near ? 14 : 6, h.kind === 'lunette');
    if (near) {
      for (const h of holes) if (h.kind === 'band') for (const o of [-2, 2]) {
        const x = (h.a0 + h.a1) / 2 + o;
        k.wallQuad('metal', 'u', x - 0.06, x + 0.06, h.y0, h.y1, V1 - t + 0.15, 1);
      }
    }
    box('pale', -END, END, 8.3, 8.7, V1 - 0.6, V1 + 0.4);                     // course under the lunettes
    box('pale', -END, END, 13.4, H.wing, V1 - 0.8, V1 + 0.6);                  // cornice
    box('roof', -100.6, 100.6, 3.9, 4.2, V1 - 0.4, PLAN.canopyV);              // the walkway canopy (OSM building=roof)
    if (near) for (let i = 1; i < n; i++) box('metal', U0 + i * pitch - 0.11, U0 + i * pitch + 0.11, 0, 4.05, PLAN.canopyV - 0.35, PLAN.canopyV - 0.13);
  }

  // ---------------------------------------------------------------- gabled ends
  {
    const outline = [[V0, 0], [V1, 0], [V1, H.wing], [22.4, H.wing], [10.35, 15.3], [10.35, 16.5], [0, H.ridge], [-10.35, 16.5], [-10.35, 15.3], [-22.4, H.wing], [V0, H.wing]];
    const holes = [
      ...[-17.7, -5.9, 5.9, 17.7].map((c) => ({ a0: c - 4.0, a1: c + 4.0, y0: 0.3, y1: 4.4, kind: 'shop' })),
      ...[-13.2, 0, 13.2].map((c) => ({ a0: c - 3.2, a1: c + 3.2, y0: 6.2, y1: 13.4, arch: true, rise: 3.2, kind: 'gable' })),
    ];
    for (const [face, facing] of [[U1, 1], [U0, -1]]) {
      slab('stone', 'v', V0, V1, 0, H.ridge, face, 0.8, holes, facing, arcN, outline);
      for (const h of holes) windowSet('v', face, 0.8, facing, h, h.kind === 'gable' ? 'glow' : 'glass', arcN, h.kind === 'gable');
      box('pale', facing > 0 ? face - 0.1 : face - 0.15, facing > 0 ? face + 0.15 : face + 0.1, 4.95, 5.4, V0 - 0.3, V1 + 0.3);
    }
  }

  // ---------------------------------------------------------------- the Grand Nave roof: aisle slopes, glazed clerestories, nave gable
  prismU('roof', [[-22.4, 13.0], [-22.4, H.wing], [-10, 15.3], [-10, 13.0]], -100.0, 100.0);
  prismU('roof', [[22.4, 13.0], [22.4, H.wing], [10, 15.3], [10, 13.0]], -100.0, 100.0);
  prismU('roof', [[-10.15, 15.2], [-10.15, 16.5], [0, H.ridge], [10.15, 16.5], [10.15, 15.2]], -100.0, 100.0);
  box('glass', -100.0, 100.0, 15.3, 16.55, -10.3, -9.95);
  box('glass', -100.0, 100.0, 15.3, 16.55, 9.95, 10.3);

  // ---------------------------------------------------------------- roof signs
  const S = SIGN;
  for (const w of S.words) {
    const len = wordLength(w.text);
    if (near) {
      for (const [a, c, y0, y1] of wordBoxes(w.text, w.u0)) { // flat letters, one quad a side, seen from both the city and the bay
        k.wallQuad('sign', 'u', a, c, y0, y1, S.v, -1);
        k.wallQuad('sign', 'u', a, c, y0, y1, S.v, 1);
      }
      box('metal', w.u0 - 0.4, w.u0 + len + 0.4, S.yBase - 0.4, S.yBase + 0.12, S.v - 0.05, S.v + 0.5);
      box('metal', w.u0 - 0.4, w.u0 + len + 0.4, S.yBase + S.height - 0.12, S.yBase + S.height + 0.4, S.v - 0.05, S.v + 0.5);
      const posts = Math.max(2, Math.round(len / 7) + 1);
      for (let i = 0; i < posts; i++) {
        const x = w.u0 - 0.3 + ((len + 0.6) * i) / (posts - 1);
        box('metal', x - 0.16, x + 0.16, 17.25, S.yBase - 0.3, S.v - 0.05, S.v + 0.5);
      }
    } else {
      box('sign', w.u0, w.u0 + len, S.yBase + 0.7, S.yBase + S.height - 0.7, S.v - S.depth / 2, S.v + S.depth / 2);
      box('roof', w.u0 + 0.3, w.u0 + len - 0.3, 17.25, S.yBase + 0.7, S.v + 0.1, S.v + 0.45);
    }
  }

  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift'); // a building has no road or deck contract
    o.geometry.rotateY(ROTATION);
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
  });
  return root;
}
