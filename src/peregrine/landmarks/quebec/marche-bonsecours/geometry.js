import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { marcheKit } from './marche-bonsecours-kit.js';
import { addDome } from './marche-bonsecours-dome.js';
import { ROTATION, PLAN, H } from './marche-bonsecours-site.js';

const range = (n) => Array.from({ length: n }, (_, i) => i);
const centres = (a0, a1, n) => range(n).map((i) => a0 + ((i + 0.5) * (a1 - a0)) / n);
/** Rectangular openings, `rows` = [[y0, y1], ...], one column per bay centre. */
const holes = (a0, a1, n, w, rows, extra = {}) => centres(a0, a1, n).flatMap((c) => rows.map(([y0, y1]) => ({ a0: c - w / 2, a1: c + w / 2, y0, y1, ...extra })));
const WING_ROWS = [[2.5, 6.0], [7.3, 10.9]];            // ground and upper storey of the two-storey wings
const PAV_ROWS = [[2.5, 5.4], [6.1, 9.0], [9.7, 12.6]]; // the three storeys of the end pavilions and end bays
const Y0 = H.plinth - 0.05; // walls start 0.05 m inside the plinth
const WALL_TOP = 12.0, PAV_WALL_TOP = 13.9;

/**
 * The Marché Bonsecours as it stands today: the 164 m grey limestone market hall of William Footner (1847) between rue Saint-Paul and rue
 * de la Commune. Two storeys of tall windows in 4.7 m bays under a bold cornice, a stone plinth (with basement arches on the river
 * side), two projecting bays on the river wall and one on the Saint-Paul wall, three-storey gabled pavilions at both ends, and in the middle
 * the Doric portico of six columns and a pediment on rue Saint-Paul with the taller central block behind it carrying the drum and the
 * ribbed silver dome with its small lantern and mast.
 *
 * Authored in the facade frame (u along the block toward the NNE, v from rue Saint-Paul to the river, y up; see marche-bonsecours-site.js)
 * and rotated once onto east / up / south at the end. Walls with openings are slabs with the openings punched through and the glazing
 * tucked into the back of the reveal; trims stand proud by 0.15 m or more, so no two same-facing faces share a plane.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = marcheKit(b, near);
  const { box, wall, prismU, prismV, cyl } = k;
  const { front, river, blockU, pavU0, pavU1, pavV0, pavV1, endV0, endV1, uEnd } = PLAN;
  const sgns = [1, -1];
  const R = (s, a, c) => (s > 0 ? [a, c] : [-c, -a]); // an u-range on side s as [lo, hi]

  // ---------------------------------------------------------------- the two wings, front and river faces
  const FACES = [
    { v: front, facing: -1, bay: { 1: PLAN.bumpFront, [-1]: null }, arcade: false },
    { v: river, facing: 1, bay: { 1: PLAN.bayRiverE, [-1]: PLAN.bayRiverW }, arcade: true },
  ];
  function wingFace(s, F) {
    const [a0, a1] = R(s, blockU, pavU0);
    const bay = F.bay[s], f = F.facing, v = F.v;
    const segs = bay ? [[a0, bay.u0], [bay.u1, a1]].sort((p, q) => p[0] - q[0]) : [[a0, a1]];
    const hs = segs.flatMap(([s0, s1]) => holes(s0, s1, Math.max(1, Math.round((s1 - s0) / 4.7)), 1.5, WING_ROWS));
    wall('stone', 'u', a0, a1, Y0, WALL_TOP, v, 0.9, hs, f);
    // the plinth in front of the wall, and the basement arches of the river side (near: a slab, far: a box)
    for (const [s0, s1] of segs) {
      const pl = f < 0 ? [v - 0.15, v + 0.8] : [v - 0.8, v + 0.15];
      if (F.arcade) {
        const arches = holes(s0, s1, Math.max(1, Math.round((s1 - s0) / 4.7)), 1.5, [[0.2, 1.5]], { arch: true, rise: 0.75, mat: 'glass', bars: false });
        wall('base', 'u', s0, s1, 0, H.plinth + 0.05, v + f * 0.15, 0.95, arches, f, 6);
      } else box('base', s0, s1, 0, H.plinth + 0.05, pl[0], pl[1]);
    }
    // string course, cornice and parapet along the plain wall, then the bay on its own
    for (const [s0, s1] of segs) trimRun(s0 - 0.05, s1 + 0.05, v, f); // each run goes 5 cm into the block, pavilion or bay it butts against
    if (bay) {
      const bh = holes(bay.u0, bay.u1, 3, 1.5, WING_ROWS);
      wall('stone', 'u', bay.u0, bay.u1, Y0, WALL_TOP, bay.v, 0.9, bh, f);
      const bf = f < 0 ? [bay.v - 0.15, bay.v + 0.8] : [bay.v - 0.8, bay.v + 0.15];
      if (F.arcade) {
        const arches = holes(bay.u0, bay.u1, 3, 1.5, [[0.2, 1.5]], { arch: true, rise: 0.75, mat: 'glass', bars: false });
        wall('base', 'u', bay.u0, bay.u1, 0, H.plinth + 0.05, bay.v + f * 0.15, 0.95, arches, f, 6);
      } else box('base', bay.u0, bay.u1, 0, H.plinth + 0.05, bf[0], bf[1]);
      trimRun(bay.u0 - 0.1, bay.u1 + 0.1, bay.v, f); // the bay's own trim overhangs its sides by 10 cm
    }
    // the low metal roof: a shallow ridge along the whole wing, hidden behind the parapets from the street
    prismU('roof', [[front + 0.3, H.wing], [0.2, 15.4], [river - 0.3, H.wing]], a0, a1);
  }
  // string course, cornice and parapet along a stretch of wall at depth v (facing f)
  function trimRun(s0, s1, v, f) {
    const out = (d0, d1) => (f < 0 ? [v - d1, v - d0] : [v + d0, v + d1]); // [from, to] in v for an outward projection
    const c = out(-0.4, 0.55), p = out(-0.1, 0.25), sc = out(-0.3, 0.15);
    box('pale', s0, s1, 6.35, 6.75, sc[0], sc[1]);       // string course between the two storeys
    box('pale', s0, s1, WALL_TOP, H.wing, c[0], c[1]);   // cornice
    box('stone', s0, s1, H.wing, H.parapet, p[0], p[1]); // parapet
  }
  for (const F of FACES) for (const s of sgns) wingFace(s, F);

  // ---------------------------------------------------------------- the three-storey end pavilions with their gables and end bays
  function endBlock(s) {
    const [p0, p1] = R(s, pavU0, pavU1), [e0, e1] = R(s, pavU1, uEnd), mid = (p0 + p1) / 2;
    for (const [v, f] of [[pavV0, -1], [pavV1, 1]]) {
      const outline = [[p0, Y0], [p1, Y0], [p1, H.pav], [mid, H.pavRidge], [p0, H.pav]];
      wall('stone', 'u', p0, p1, Y0, H.pavRidge, v, 0.9, holes(p0, p1, 4, 1.3, PAV_ROWS), f, 8, outline);
      const c = f < 0 ? [v - 0.4, v + 0.3] : [v - 0.3, v + 0.4], pl = f < 0 ? [v - 0.15, v + 0.8] : [v - 0.8, v + 0.15];
      box('pale', p0 - 0.1, p1 + 0.1, PAV_WALL_TOP, H.pav, c[0], c[1]);      // cornice under the gable
      box('pale', p0 - 0.05, p1 + 0.05, 5.65, 6.0, f < 0 ? v - 0.15 : v - 0.1, f < 0 ? v + 0.1 : v + 0.15); // two string courses
      box('pale', p0 - 0.05, p1 + 0.05, 9.25, 9.6, f < 0 ? v - 0.15 : v - 0.1, f < 0 ? v + 0.1 : v + 0.15);
      box('base', p0, p1, 0, H.plinth + 0.05, pl[0], pl[1]);
    }
    // the gable roof, ridge along v, starting where the gable slabs end
    prismV('roof', [[p0, H.pav], [mid, H.pavRidge], [p1, H.pav]], pavV0 + 0.9, pavV1 - 0.9);
    // the 2.4 m returns toward the wing and the 2.1 m ones toward the end bay
    const inner = s > 0 ? p0 : p1, outer = s > 0 ? p1 : p0;
    box('stone', ...(s > 0 ? [inner, inner + 0.9] : [inner - 0.9, inner]), Y0, H.pav, pavV0, front);
    box('stone', ...(s > 0 ? [inner, inner + 0.9] : [inner - 0.9, inner]), Y0, H.pav, river, pavV1);
    box('stone', ...(s > 0 ? [outer - 0.9, outer] : [outer, outer + 0.9]), Y0, H.pav, pavV0, endV0);
    box('stone', ...(s > 0 ? [outer - 0.9, outer] : [outer, outer + 0.9]), Y0, H.pav, endV1, pavV1);
    // end bay: the end wall (4 bays, 3 storeys) and the two short faces
    const ue = s * uEnd;
    wall('stone', 'v', endV0, endV1, Y0, PAV_WALL_TOP, ue, 0.9, holes(endV0, endV1, 4, 1.3, PAV_ROWS), s, 8);
    for (const [v, f] of [[endV0, -1], [endV1, 1]]) wall('stone', 'u', e0, e1, Y0, PAV_WALL_TOP, v, 0.9, holes(e0, e1, 1, 1.3, PAV_ROWS), f, 8);
    const cu = s > 0 ? [ue - 0.4, ue + 0.55] : [ue - 0.55, ue + 0.4];
    box('pale', ...cu, PAV_WALL_TOP, H.pav, endV0 - 0.4, endV1 + 0.4);                              // cornice round the end bay
    box('pale', e0, e1, PAV_WALL_TOP, H.pav, endV0 - 0.4, endV0 + 0.1); box('pale', e0, e1, PAV_WALL_TOP, H.pav, endV1 - 0.1, endV1 + 0.4);
    box('roof', e0 + (s > 0 ? 0 : 0.5), e1 - (s > 0 ? 0.5 : 0), H.pav - 0.35, H.pav - 0.2, endV0 + 0.4, endV1 - 0.4); // flat metal roof
    box('base', ...(s > 0 ? [ue - 0.8, ue + 0.15] : [ue - 0.15, ue + 0.8]), 0, H.plinth + 0.05, endV0 - 0.15, endV1 + 0.15);
    box('base', e0, e1, 0, H.plinth + 0.05, endV0 - 0.15, endV0 + 0.8); box('base', e0, e1, 0, H.plinth + 0.05, endV1 - 0.8, endV1 + 0.15);
  }
  for (const s of sgns) endBlock(s);

  // ---------------------------------------------------------------- the central block, portico and dome
  {
    const U = blockU, bv = PLAN.blockV1;
    // river face of the block: three bays of the two storeys, the small attic windows above, the basement arches under
    const riverHoles = [...holes(-U, U, 3, 1.5, WING_ROWS), ...holes(-U, U, 3, 1.1, [[14.6, 16.9]])];
    wall('stone', 'u', -U, U, Y0, 17.9, bv, 0.9, riverHoles, 1);
    wall('base', 'u', -U, U, 0, H.plinth + 0.05, bv + 0.15, 0.95, holes(-U, U, 3, 1.5, [[0.2, 1.5]], { arch: true, rise: 0.75, mat: 'glass', bars: false }), 1, 6);
    box('pale', -U - 0.4, U + 0.4, 6.35, 6.75, bv - 0.1, bv + 0.15);
    // the two side faces above the wing roofs: a row of small windows each
    for (const s of sgns) wall('stone', 'v', front, bv, WALL_TOP, 17.9, s * U, 0.9, holes(front, bv, 5, 1.1, [[14.6, 16.9]]), s, 8);
    // cornice round the block, a flat roof inside it
    box('pale', -U - 0.35, U + 0.35, 17.9, H.block, front - 0.45, front + 0.5);
    box('pale', -U - 0.35, U + 0.35, 17.9, H.block, bv - 0.5, bv + 0.4);
    box('pale', -U - 0.35, -U + 0.5, 17.9, H.block, front + 0.5, bv - 0.5);
    box('pale', U - 0.5, U + 0.35, 17.9, H.block, front + 0.5, bv - 0.5);
    box('roof', -U + 0.5, U - 0.5, 18.45, 18.65, front + 0.5, bv - 0.5);

    // the portico of rue Saint-Paul: the back wall with three doors and windows, six Doric columns, entablature, pediment, stepped podium
    const doors = [{ a0: -1.3, a1: 1.3, y0: H.plinth, y1: 6.4, mat: 'glass', bars: false }, { a0: -6.5, a1: -4.7, y0: H.plinth, y1: 5.6, mat: 'glass', bars: false }, { a0: 4.7, a1: 6.5, y0: H.plinth, y1: 5.6, mat: 'glass', bars: false },
      { a0: -0.75, a1: 0.75, y0: 7.5, y1: 10.9 }, { a0: -6.35, a1: -4.85, y0: 7.5, y1: 10.9 }, { a0: 4.85, a1: 6.35, y0: 7.5, y1: 10.9 }];
    wall('stone', 'u', -U, U, Y0, 17.9, front, 0.9, doors, -1);
    const tiers = [[10.5, 0.6, -13.3], [10.3, 1.2, -13.0], [10.1, H.plinth, -12.7]];
    for (const [hw, top, v0] of tiers) box('pale', -hw, hw, 0, top, v0, front + 0.05);
    const colU = [-8.9, -5.34, -1.78, 1.78, 5.34, 8.9], colV = -11.9;
    for (const c of colU) {
      cyl('pale', c, colV, 0.58, 0.48, H.plinth, 8.9, 14, true, 0.5);               // fluted-looking shaft, tapered
      cyl('pale', c, colV, 0.48, 0.72, 8.9, 9.4, 12, false, 0.5);                   // echinus
      box('pale', c - 0.7, c + 0.7, 9.4, 9.85, colV - 0.7, colV + 0.7);              // abacus
    }
    box('pale', -10.2, 10.2, 9.8, 12.0, -12.95, front + 0.05);                       // architrave and frieze, solid so the soffit closes the portico
    box('pale', -10.5, 10.5, 12.0, H.portico, -13.25, front + 0.05);                 // cornice
    // pediment: a stone slab with a raking cornice, a roof behind it
    const apex = H.pedimentApex;
    wall('stone', 'u', -10.2, 10.2, H.portico - 0.05, apex, -12.9, 0.5, [], -1, 3, [[-10.2, H.portico - 0.05], [10.2, H.portico - 0.05], [0, apex]]);
    for (const sg of sgns) b.bar(k.mat('pale'), [sg * 10.3, H.portico + 0.0, -12.55], [0, apex + 0.45, -12.55], 0.45, 0.7);
    prismV('roof', [[-10.0, H.portico], [0, apex - 0.1], [10.0, H.portico]], -12.4, front + 0.05);
    k.disc('base', 0, 13.55, -12.9 - 0.12, 0.95, -1, 16);                            // the medallion in the tympanum
    // four stone chimney stacks on the block roof, two on each side of the drum
    for (const su of sgns) for (const [sv, w] of [[-7.6, 1.2], [8.6, 1.2]]) {
      box('stone', su * 8.8 - w / 2, su * 8.8 + w / 2, 18.6, 21.0, sv - w / 2, sv + w / 2);
      box('pale', su * 8.8 - w / 2 - 0.15, su * 8.8 + w / 2 + 0.15, 21.0, 21.25, sv - w / 2 - 0.15, sv + w / 2 + 0.15);
    }
    addDome(k, near);
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
