import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PLAN as P } from './hotel-du-parlement-plan.js';
import { kit, dropGroundFaces } from './hotel-du-parlement-kit.js';

// Hôtel du Parlement (Taché, Second Empire, 1877-86): a quadrangle of four wings round a courtyard, grey ashlar, four storeys under slate
// mansards, four corner pavilions with taller mansards, a projecting central frontispiece carrying the clock tower, bronze statues in the
// facade niches. Authored in the building frame of hotel-du-parlement-plan.js (x along the front, z out of it) and rotated onto the mapped
// ring once at the end. Real metres; y = 0 is the foot of the walls on flat local grade.
const FACES = { S: 0, N: Math.PI, E: Math.PI / 2, W: -Math.PI / 2 };
const SGN = { S: 1, W: 1, N: -1, E: -1 };
const T = P.tower, TH = P.tower_, C = P.court, PI = P.pavIn, BL = P.block;

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = kit(b, near);
  const { box, poly, strip, frustum, loft, lathe, cyl, cone, win, dormer, statue, wbox, onWall, put } = k;

  // ---- wall helpers ---------------------------------------------------------------------------------------------------------------
  const xz = (face, plane, a) => (face === 'S' || face === 'N' ? [a, plane] : [plane, a]);
  const origin = (face, plane) => (face === 'S' || face === 'N' ? [0, 0, plane] : [plane, 0, 0]);
  // a slab standing proud of a wall plane by d0..d1 over a0..a1 along it (only the faces that show)
  function wb(m, face, plane, a0, a1, y0, y1, d0, d1, faces = 'fudlr') {
    const [sa, sb] = SGN[face] > 0 ? [a0, a1] : [-a1, -a0];
    const [ox, oy, oz] = origin(face, plane);
    wbox(m, sa, sb, y0, y1, d0, d1, faces, ox, oy, oz, FACES[face]);
  }
  const centres = (a0, a1, n) => Array.from({ length: n }, (_, i) => a0 + (a1 - a0) * (i + 0.5) / n);
  const WALL_ROWS = [
    { y: 1.6, w: 1.55, h: 3.2, arch: true, mat: 'glow' },
    { y: 7.3, w: 1.45, h: 3.2 },
    { y: 12.8, w: 1.4, h: 2.9 },
  ];
  const ATTIC = { y: 19.9, w: 1.4, h: 2.3 };         // the pavilions' fourth storey
  const ATTIC_B = { y: 19.7, w: 1.4, h: 1.8 };       // the central block's low attic, under its cornice
  function windows(face, plane, a0, a1, n, { rows = WALL_ROWS, skip = {}, ring = false, frame = near } = {}) {
    rows.forEach((r, ri) => centres(a0, a1, n).forEach((a, i) => {
      if (skip[ri]?.includes(i)) return;
      const [x, z] = xz(face, plane, a);
      win(x, r.y, z, r.w, r.h, FACES[face], { arch: !!r.arch, mat: r.mat || 'glass', frame, ring: ring && !!r.arch });
    }));
  }
  // string courses, frieze and cornice of a wall piece
  const courses = (face, plane, a0, a1, { s = true, top = P.corniceW } = {}) => {
    if (s) { wb('trim', face, plane, a0, a1, P.s1, P.s1 + 0.5, 0, 0.3); wb('trim', face, plane, a0, a1, P.s2, P.s2 + 0.5, 0, 0.3); wb('trim', face, plane, a0, a1, P.frieze, P.frieze + 0.45, 0, 0.26); }
    wb('trim', face, plane, a0, a1, top - 1.2, top, 0, 0.6);
  };
  const plinth = (face, plane, a0, a1) => wb('stoneDark', face, plane, a0, a1, 0, P.plinth, 0, 0.28);
  // mansard strip on a wing: wall plane tO (outer) and courtyard face tI
  function mansard(axis, a0, a1, tO, tI) {
    const s = tO > tI ? 1 : -1, y0 = P.corniceW, y1 = P.deckW, mid = (tO + tI) / 2, am = (a0 + a1) / 2;
    strip('roof', axis, a0, a1, [[tO + s * 0.35, y0], [tO - s * 2.0, y1], [tI + s * 2.0, y1], [tI - s * 0.35, y0]], axis === 'x' ? [am, y0 - 1, mid] : [mid, y0 - 1, am]);
    if (near) for (const t of [tO - s * 2.0, tI + s * 2.0]) {
      if (axis === 'x') box('iron', a0, a1, y1, y1 + 0.55, t - 0.04, t + 0.04, 'dsn'); else box('iron', t - 0.04, t + 0.04, y1, y1 + 0.55, a0, a1, 'dwe');
    }
  }
  // dormers on a wing's mansard, one over each window column (their fronts stand 0.2 m proud of the wall plane)
  function dormerRow(face, plane, cs, { y = P.corniceW + 0.1, inset = -0.2, ...opt } = {}) {
    if (!near) return;
    for (const a of cs) {
      const [x, z] = xz(face, plane, a);
      const dx = face === 'E' ? -inset : face === 'W' ? inset : 0, dz = face === 'S' ? -inset : face === 'N' ? inset : 0;
      dormer(x + dx, y, z + dz, FACES[face], { w: 1.4, h: 2.1, rise: 0.8, depth: 2.4, ...opt });
    }
  }
  // a niche statue: dark recess panel in the wall, bronze figure on a small ledge
  function niche(face, plane, a, y, { ped = 0.5 } = {}) {
    if (!near) return;
    wb('stoneDark', face, plane, a - 0.65, a + 0.65, y + ped - 0.1, y + ped + 2.0, 0, 0.1, 'f');
    const [x, z] = xz(face, plane, a); statue(x, y, z + (face === 'S' ? 0.1 : face === 'N' ? -0.1 : 0), FACES[face], { ped });
  }

  // a triangular pediment standing 0.4 m proud of a wall (its back 5 cm off the wall)
  function pediment(face, plane, a, y, w, rise, mat = 'trim') {
    if (!near) return;
    const sh = new THREE.Shape([new THREE.Vector2(-w / 2, 0), new THREE.Vector2(w / 2, 0), new THREE.Vector2(0, rise)]);
    const [x, z] = xz(face, plane, a);
    put(onWall(new THREE.ExtrudeGeometry(sh, { depth: 0.4, bevelEnabled: false }).translate(0, 0, 0.05), x, y, z, FACES[face]), mat);
  }

  // ---- the wings ---------------------------------------------------------------------------------------------------------------------
  // walls: only the two faces that show (the ends touch the pavilions and the block, the top and foot are covered)
  box('stone', -PI, -BL.x1, 0, P.corniceW, C.z1, P.zW, 'wedu'); box('stone', BL.x1, PI, 0, P.corniceW, C.z1, P.zW, 'wedu');   // front wings
  box('stone', -PI, PI, 0, P.corniceW, P.zBW, C.z0, 'wedu');                                                                      // back wing
  box('stone', -P.xW, C.x0, 0, P.corniceW, C.z0, C.z1, 'nsdu'); box('stone', C.x1, P.xW, 0, P.corniceW, C.z0, C.z1, 'nsdu');        // side wings
  mansard('x', -PI, -BL.x1, P.zW, C.z1); mansard('x', BL.x1, PI, P.zW, C.z1);
  mansard('x', -PI, PI, P.zBW, C.z0);
  mansard('z', C.z0, C.z1, -P.xW, C.x0); mansard('z', C.z0, C.z1, P.xW, C.x1);

  // ---- corner pavilions --------------------------------------------------------------------------------------------------------------
  function pavilion(sx, sz) {
    const x0 = sx > 0 ? PI : -P.xP, x1 = sx > 0 ? P.xP : -PI;
    const z0 = sz > 0 ? C.z1 : P.zBP, z1 = sz > 0 ? P.zP : C.z0;
    box('stone', x0, x1, 0, P.corniceP, z0, z1, 'du');
    const fo = sz > 0 ? 'S' : 'N', so = sx > 0 ? 'E' : 'W';
    const fp = sz > 0 ? P.zP : P.zBP, sp = sx > 0 ? P.xP : -P.xP, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    for (const [face, plane, a0, a1] of [[fo, fp, x0, x1], [so, sp, z0, z1]]) {
      if (face === 'S') { plinth(face, plane, a0, cx - 1.7); plinth(face, plane, cx + 1.7, a1); } else plinth(face, plane, a0, a1);
      courses(face, plane, a0, a1, { top: P.corniceP });
      wb('trim', face, plane, a0, a1, P.corniceW - 1.2, P.corniceW, 0, 0.5);          // the wings' cornice line runs on round the pavilion
    }
    wb('trim', sx > 0 ? 'W' : 'E', sx > 0 ? x0 : x1, z0, z1, P.corniceP - 1.2, P.corniceP, 0, 0.6);   // inner flanks: cornice only
    wb('trim', sz > 0 ? 'N' : 'S', sz > 0 ? z0 : z1, x0, x1, P.corniceP - 1.2, P.corniceP, 0, 0.6);
    windows(fo, fp, x0, x1, 3, { rows: [...WALL_ROWS, ATTIC], skip: sz > 0 ? { 0: [1] } : {}, ring: sz > 0 });
    windows(so, sp, z0, z1, 4, { rows: [...WALL_ROWS, ATTIC] });
    if (near) {   // corner pilaster on the outer corner
      const ox = sx * P.xP, oz = sz > 0 ? P.zP : P.zBP;
      box('trim', Math.min(ox - sx * 0.8, ox + sx * 0.2), Math.max(ox - sx * 0.8, ox + sx * 0.2), P.plinth + 0.28, P.corniceP - 1.2, Math.min(oz - sz * 0.8, oz + sz * 0.2), Math.max(oz - sz * 0.8, oz + sz * 0.2), 'd');
    }
    if (sz > 0) {   // entrance door in the middle of the front pavilions, with steps
      win(cx, 0, fp, 2.2, 4.0, FACES.S, { arch: true, mat: 'iron', ring: true, sill: false });
      pediment('S', fp, cx, ATTIC.y + ATTIC.h + 0.3, 3.0, 1.0);
      if (near) { box('stoneDark', cx - 1.6, cx + 1.6, 0, 0.3, fp, fp + 1.0, 'dn'); box('stoneDark', cx - 1.3, cx + 1.3, 0.3, 0.6, fp + 0.45, fp + 1.0, 'dn'); }
    }
    // mansard: steep lower slope, shallow upper hip, flat crown with iron cresting and a mast
    const e = 0.3, r0 = [x0 - e, x1 + e, z0 - e, z1 + e], r1 = [x0 + 2.0, x1 - 2.0, z0 + 2.0, z1 - 2.0], r2 = [x0 + 4.6, x1 - 4.6, z0 + 4.6, z1 - 4.6];
    frustum('roof', r0, r1, P.corniceP, P.breakP, { top: false });
    frustum('roof', r1, r2, P.breakP, P.topP, { top: true });
    if (near) {
      const [a0, a1, c0, c1] = r2, h = 0.6;
      box('iron', a0, a1, P.topP, P.topP + h, c0 - 0.04, c0 + 0.04, 'dsn'); box('iron', a0, a1, P.topP, P.topP + h, c1 - 0.04, c1 + 0.04, 'dsn');
      box('iron', a0 - 0.04, a0 + 0.04, P.topP, P.topP + h, c0, c1, 'dwe'); box('iron', a1 - 0.04, a1 + 0.04, P.topP, P.topP + h, c0, c1, 'dwe');
      dormerRow(fo, fp, [cx], { y: P.corniceP + 0.4, inset: -0.1, w: 1.2, h: 1.9, rise: 0.7, depth: 2.6 });
      dormerRow(so, sp, [cz], { y: P.corniceP + 0.4, inset: -0.1, w: 1.2, h: 1.9, rise: 0.7, depth: 2.6 });
    }
    b.bar('iron', [cx, P.topP - 0.1, cz], [cx, P.mastP, cz], 0.12, 0.12);
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) pavilion(sx, sz);

  // ---- front elevation: wings and central frontispiece ------------------------------------------------------------------------------
  for (const [a0, a1] of [[-PI, -BL.x1], [BL.x1, PI]]) {
    plinth('S', P.zW, a0, a1); courses('S', P.zW, a0, a1);
    windows('S', P.zW, a0, a1, 6, { ring: true });
    dormerRow('S', P.zW, centres(a0, a1, 6));
    if (near) for (let i = 1; i < 6; i++) { const x = a0 + (a1 - a0) * i / 6; statue(x, 0, P.zW + 0.3, 0, { ped: 0.9 }); }
  }
  box('stone', BL.x0, BL.x1, 0, P.corniceB, C.z1, P.zP, 'du');
  for (const [a0, a1] of [[BL.x0, T.x0], [T.x1, BL.x1]]) {
    plinth('S', P.zP, a0, a1); courses('S', P.zP, a0, a1, { top: P.corniceB });
    wb('trim', 'S', P.zP, a0, a1, P.corniceW - 1.2, P.corniceW, 0, 0.5);
    windows('S', P.zP, a0, a1, 2, { rows: [...WALL_ROWS, ATTIC_B], ring: true });
  }
  for (const face of ['E', 'W']) wb('trim', face, face === 'E' ? BL.x1 : BL.x0, C.z1, P.zP, P.corniceB - 1.2, P.corniceB, 0, 0.6);
  poly('roof', [[BL.x0, P.corniceB, C.z1], [BL.x1, P.corniceB, C.z1], [BL.x1, P.corniceB, P.zP], [BL.x0, P.corniceB, P.zP]], [0, 0, 0]);   // flat roof behind the cornice
  for (const sx of [-1, 1]) {
    const c = sx * 10.0;   // the pier between the two window columns beside the (wider) tower
    // statues in niches on the pier between the two window columns (ground pedestal, three niches), an aedicule with a sculpture group above
    if (near) { statue(c, 0, P.zP + 0.3, 0, { ped: 0.9 }); for (const y of [8.1, 13.6, 19.2]) niche('S', P.zP, c, y); }
    box('stone', c - 1.9, c + 1.9, P.corniceB, P.corniceB + 3.0, P.zP - 3.2, P.zP - 0.2, 'd');
    wb('trim', 'S', P.zP - 0.2, c - 2.2, c + 2.2, P.corniceB + 2.7, P.corniceB + 3.2, 0, 0.35);
    wb('trim', 'S', P.zP - 0.2, c - 1.2, c + 1.2, P.corniceB + 0.6, P.corniceB + 2.3, 0, 0.12, 'f');
    pediment('S', P.zP - 0.2, c, P.corniceB + 3.2, 4.2, 1.3);
    if (near) for (const [dx, ped, sc] of [[-0.95, 0, 0.7], [0, 0.3, 0.8], [0.95, 0, 0.7]]) statue(c + dx, P.corniceB + 3.2, P.zP - 1.9, 0, { ped, scale: sc });
    else box('iron', c - 1.2, c + 1.2, P.corniceB + 3.2, P.corniceB + 4.6, P.zP - 2.3, P.zP - 1.5);
    cone('trim', sx * 13.7, P.corniceB, P.corniceB + 2.6, P.zP - 0.8, 0.45, 6);
  }

  // ---- sides, back and courtyard -----------------------------------------------------------------------------------------------------
  for (const sx of [-1, 1]) {
    const face = sx > 0 ? 'E' : 'W', plane = sx * P.xW;
    plinth(face, plane, C.z0, C.z1); courses(face, plane, C.z0, C.z1);
    windows(face, plane, C.z0, C.z1, 19);
    dormerRow(face, plane, centres(C.z0, C.z1, 19));
    const cf = sx > 0 ? 'W' : 'E', cp = sx > 0 ? C.x1 : C.x0;   // the courtyard face of the same wing
    courses(cf, cp, C.z0, C.z1, { s: false });
    if (near) { windows(cf, cp, C.z0, C.z1, 19, { frame: false }); dormerRow(cf, cp, centres(C.z0, C.z1, 19)); }
  }
  for (const [a0, a1] of [[-PI, P.rear[0]], [P.rear[1], PI]]) {
    plinth('N', P.zBW, a0, a1); courses('N', P.zBW, a0, a1);
    windows('N', P.zBW, a0, a1, 6);
    dormerRow('N', P.zBW, centres(a0, a1, 6));
  }
  {   // rear central pavilion: a shallow projection with its own low roof
    const [a0, a1] = P.rear;
    box('stone', a0, a1, 0, P.corniceW, P.zRear, P.zBW + 1.0, 'dus');
    plinth('N', P.zRear, a0, a1); courses('N', P.zRear, a0, a1);
    windows('N', P.zRear, a0, a1, 3);
    frustum('roof', [a0 - 0.3, a1 + 0.3, P.zRear - 0.3, P.zBW + 0.2], [a0 + 2.0, a1 - 2.0, P.zRear + 0.6, P.zBW - 0.2], P.corniceW, P.corniceW + 3.2, { top: true });
  }
  courses('N', C.z1, C.x0, -4.8, { s: false }); courses('N', C.z1, 6.5, C.x1, { s: false }); courses('S', C.z0, C.x0, C.x1, { s: false });   // courtyard cornices
  if (near) {   // inner courtyard faces of the front and back wings
    windows('N', C.z1, C.x0, -4.8, 8, { frame: false }); windows('N', C.z1, 6.5, C.x1, 8, { frame: false }); windows('S', C.z0, C.x0, C.x1, 20, { frame: false });
    dormerRow('N', C.z1, [...centres(C.x0, -4.8, 8), ...centres(6.5, C.x1, 8)]); dormerRow('S', C.z0, centres(C.x0, C.x1, 20));
  }

  // ---- the central chamber body inside the courtyard -----------------------------------------------------------------------------------
  {
    const B = P.body, S = P.stem;
    box('stone', B.x0, B.x1, 0, P.bodyTop, B.z0, B.z1, 'du'); box('stone', S.x0, S.x1, 0, P.bodyTop, B.z1 - 1.0, S.z1, 'dusn');
    for (const [face, plane, a0, a1] of [['N', B.z0, B.x0, B.x1], ['S', B.z1, B.x0, S.x0], ['S', B.z1, S.x1, B.x1], ['E', B.x1, B.z0, B.z1], ['W', B.x0, B.z0, B.z1], ['E', S.x1, B.z1, C.z1], ['W', S.x0, B.z1, C.z1]]) {
      wb('trim', face, plane, a0, a1, P.bodyTop - 1.0, P.bodyTop, 0, 0.5);
      if (near) windows(face, plane, a0, a1, Math.max(1, Math.round((a1 - a0) / 3.1)), { rows: [{ y: 2.0, w: 1.4, h: 2.8, arch: true }, { y: 8.2, w: 1.4, h: 3.0 }, { y: 12.4, w: 1.3, h: 2.6 }], frame: false });
    }
    frustum('roof', [B.x0 - 0.3, B.x1 + 0.3, B.z0 - 0.3, B.z1 + 0.3], [B.x0 + 2.4, B.x1 - 2.4, B.z0 + 2.4, B.z1 - 2.4], P.bodyTop, P.bodyTop + 3.6, { top: true });
    poly('roof', [[S.x0, P.bodyTop, B.z1 + 0.3], [S.x1, P.bodyTop, B.z1 + 0.3], [S.x1, P.bodyTop, C.z1], [S.x0, P.bodyTop, C.z1]], [0, 0, 0]);
  }

  // ---- the clock tower ---------------------------------------------------------------------------------------------------------------
  {
    const x0 = T.x0, x1 = T.x1, z0 = T.z0, z1 = P.zT, cz = (z0 + z1) / 2;
    box('stone', x0, x1, 0, TH.shaftTop, z0, z1, 'd');   // its top shows as a ledge round the spire's foot
    plinth('S', z1, x0, -2.4); plinth('S', z1, 2.4, x1);
    win(0, 0, z1, 3.6, 5.2, FACES.S, { arch: true, mat: 'iron', ring: true, sill: false });   // portal
    if (near) {
      for (const sx of [-1, 1]) cyl('trim', sx * 2.55, 0.3, 5.0, z1 + 0.35, 0.28, 0.28, 8, 't');
      box('stoneDark', -3.2, 3.2, 0, 0.3, z1, z1 + 1.4, 'dn'); box('stoneDark', -2.9, 2.9, 0.3, 0.6, z1, z1 + 0.9, 'dn');
    }
    const around = (y0, y1, out) => {
      for (const f of ['S', 'N']) wb('trim', f, f === 'S' ? z1 : z0, x0 - out, x1 + out, y0, y1, 0, out);
      for (const f of ['E', 'W']) wb('trim', f, f === 'E' ? x1 : x0, z0, z1, y0, y1, 0, out);
    };
    around(P.s1, P.s1 + 0.4, 0.22); around(P.s2, P.s2 + 0.4, 0.22); around(P.frieze, P.frieze + 0.35, 0.18);
    around(TH.cornice1 - 1.2, TH.cornice1, 0.6); around(TH.belfry - 1.2, TH.belfry, 0.7); around(TH.shaftTop - 1.3, TH.shaftTop, 0.5);
    for (const [face, plane, a0, a1] of [['S', z1, x0, x1], ['E', x1, z0, z1], ['W', x0, z0, z1], ['N', z0, x0, x1]]) {
      const [wx, wz] = xz(face, plane, (a0 + a1) / 2), ang = FACES[face];
      for (const [y, h] of [[9.0, 2.9], [14.6, 2.9], [19.4, 2.4]]) if (face === 'S' || near) win(wx, y, wz, 1.7, h, ang, { arch: true, frame: near, mat: 'glass' });
      win(wx, 25.2, wz, 2.1, 3.3, ang, { arch: true, ring: true, frame: near, mat: 'glass' });
      win(wx, 35.7, wz, 2.3, 4.7, ang, { arch: true, ring: true, frame: near, mat: 'glow' });
      put(onWall(new THREE.CircleGeometry(1.2, near ? 14 : 8).translate(0, 0, 0.08), wx, 31.2, wz, ang), 'glow');
    }
    // clock dials, proud of the wall: a cream dial inside a stone ring, with hands
    for (const [face, plane, a0, a1] of [['S', z1, x0, x1], ['E', x1, z0, z1], ['W', x0, z0, z1], ['N', z0, x0, x1]]) {
      const [wx, wz] = xz(face, plane, (a0 + a1) / 2), ang = FACES[face];
      put(onWall(new THREE.RingGeometry(1.2, 1.65, near ? 14 : 8).translate(0, 0, 0.14), wx, 31.2, wz, ang), 'trim');
      if (near) { put(onWall(new THREE.PlaneGeometry(0.1, 0.9).translate(0, 0.45, 0.2), wx, 31.2, wz, ang), 'iron'); put(onWall(new THREE.PlaneGeometry(0.1, 0.7).rotateZ(-1.9).translate(0, 0, 0.2), wx, 31.2, wz, ang), 'iron'); }
    }
    // statues flanking the central windows of the front (the lower two pairs and the stage above the clock's)
    if (near) for (const y of [8.9, 14.5, 24.8]) for (const sx of [-1, 1]) niche('S', z1, sx * 2.5, y, { ped: 0.3 });
    if (near) for (const sx of [-1, 1]) for (const cz2 of [z0, z1]) {   // corner pilasters of the lower stages
      const ox = sx * x1, sz = cz2 === z1 ? 1 : -1;
      box('trim', Math.min(ox - sx * 0.9, ox + sx * 0.25), Math.max(ox - sx * 0.9, ox + sx * 0.25), 0.6, TH.cornice1 - 1.2, Math.min(cz2 - sz * 0.9, cz2 + sz * 0.25), Math.max(cz2 - sz * 0.9, cz2 + sz * 0.25), 'd');
    }
    // turrets, belfry roof, crest, lantern, flagpole and flag
    for (const sx of [-1, 1]) for (const [tz, ctz] of [[z0, z0], [z1, z1]]) {
      cyl('stone', sx * x1, TH.belfry, TH.shaftTop - 0.1, ctz, 1.25, 1.25, near ? 8 : 5, '');
      if (near) cyl('trim', sx * x1, TH.belfry + 4.4, TH.belfry + 4.8, ctz, 1.4, 1.4, 8, '');
      cone('roof', sx * x1, TH.shaftTop - 0.1, TH.shaftTop + 3.0, ctz, 1.35, near ? 8 : 5);
      void tz;
    }
    loft('roof', 0, cz, [{ y: TH.shaftTop, hx: 5.1, hz: 5.0 }, { y: 45.4, hx: 4.5, hz: 4.4 }, { y: 47.2, hx: 3.75, hz: 3.6 }, { y: 49.2, hx: 2.8, hz: 2.7 }, { y: 51.0, hx: 1.95, hz: 1.9 }, { y: TH.apex, hx: 1.3, hz: 1.3 }]);
    if (near) dormer(0, 45.2, z1 - 0.6, 0, { w: 0.9, h: 1.5, rise: 0.6, depth: 2.2 });
    // iron crest: a railed platform on the spire, an open lantern of ribs under a dome, the finial and the pole
    cyl('iron', 0, TH.apex, TH.apex + 0.4, cz, 1.95, 1.95, near ? 10 : 6, 't');
    if (near) {
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; b.bar('iron', [Math.cos(a) * 1.7, TH.apex + 0.4, cz + Math.sin(a) * 1.7], [Math.cos(a) * 1.15, 55.6, cz + Math.sin(a) * 1.15], 0.1, 0.1); }
      cyl('iron', 0, 54.0, 54.25, cz, 1.45, 1.45, 10, '');
    } else cyl('iron', 0, TH.apex + 0.4, 55.6, cz, 1.6, 1.2, 6, '');
    lathe('iron', 0, 55.6, cz, [[1.2, 0], [0.95, 0.5], [0.5, 1.1], [0.15, 1.5], [0.0, 1.65]], near ? 8 : 5);
    b.bar('iron', [0, 57.0, cz], [0, TH.pole, cz], 0.14, 0.14);
    // the Québec flag, flying toward -x: a blue field with the white cross and four fleurs-de-lis
    {
      const y1 = TH.pole - 0.1, y0 = y1 - 3.2, f = 4.4, e = 0.03;
      for (const sd of [1, -1]) {
        const z = cz + sd * e, quad = (m, xa, xb, ya, yb, dz = 0) => poly(m, [[xa, ya, z + sd * dz], [xb, ya, z + sd * dz], [xb, yb, z + sd * dz], [xa, yb, z + sd * dz]], [0, (ya + yb) / 2, cz]);
        quad('sign', -f, 0, y0, y1);
        if (near) {
          quad('trim', -f, 0, (y0 + y1) / 2 - 0.2, (y0 + y1) / 2 + 0.2, 0.03); quad('trim', -f / 2 - 0.2, -f / 2 + 0.2, y0, y1, 0.03);
          for (const [fx, fy] of [[-f * 0.25, 0.25], [-f * 0.75, 0.25], [-f * 0.25, 0.75], [-f * 0.75, 0.75]]) {
            const cy = y0 + (y1 - y0) * fy, cxm = fx; poly('trim', [[cxm - 0.28, cy, z + sd * 0.03], [cxm, cy - 0.38, z + sd * 0.03], [cxm + 0.28, cy, z + sd * 0.03], [cxm, cy + 0.38, z + sd * 0.03]], [cxm, cy, cz]);
          }
        }
      }
    }
  }

  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift'); o.geometry.rotateY(P.angle); dropGroundFaces(o.geometry);
    o.geometry = mergeVertices(o.geometry, 1e-4);
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
  });
  return root;
}
