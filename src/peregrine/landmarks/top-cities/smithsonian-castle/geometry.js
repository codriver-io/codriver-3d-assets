import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Soup, arch, framed, facadeRows, sideRows, gableRoof, prism, pyramid, crenels, roundel, corbels, ribs } from './smithsonian-castle-parts.js';

// Smithsonian Institution Building, modelled from the mapped outline (OSM relation 7393969, x -63..72, z -28..19 m
// around the origin): an east-west range of red sandstone with a north "Mall" front (the 44 m octagonal tower and its
// 36 m pyramid-roofed neighbour either side of a steep gabled porch), the crenellated 28 m south tower, a 36 m
// campanile at the north-east corner and the smaller turrets. Heights of the towers are sourced; eaves, pitches and the
// window rhythm are estimated from photographs.

// Main body: [x0, x1, z0, z1, eave, ridge, rows(y, w, h)]. Ridges run east-west.
const R2 = [[1.5, 1.3, 3.2], [6.0, 1.5, 3.8]];
const R2C = [[1.5, 1.3, 3.2], [6.6, 1.5, 5.0]];
const R3 = [[1.5, 1.3, 3.2], [6.0, 1.4, 3.8], [10.6, 1.4, 3.2]];
const BODY = [
  ['west-wing', -60.3, -47.4, -8.7, 9.3, 11.5, 16.5, R2],
  ['west-range', -47.4, -26.5, -10.9, 5.8, 11, 14.5, R2],
  ['centre', -26.5, 32.2, -10.8, 5.7, 12.5, 16.5, R2C],
  ['east-range', 32.2, 51.4, -9.5, 5.2, 11, 14.5, R2],
  ['east-wing', 51.4, 67.2, -14.6, 10.3, 14.5, 20, R3],
];

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const glass = new Soup(), trim = new Soup();
  const wall = (x0, x1, z0, z1, y0, y1, mat = 'stone') => b.box(mat, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], [x1 - x0, y1 - y0, z1 - z0]);
  const pitch = near ? 4.6 : 5.4;
  const window = (cx, cz, nx, nz, y0, w, h, isNear = near) => framed(trim, glass, cx, cz, nx, nz, y0, w, h, isNear);

  // ---- main body: walls, a corbel course under every eave, slate gables ----
  BODY.forEach(([, x0, x1, z0, z1, eave, ridge], i) => {
    wall(x0, x1, z0, z1, 0, eave);
    wall(x0 - (i === 0 ? 0.25 : 0), x1 + (i === BODY.length - 1 ? 0.25 : 0), z0 - 0.25, z1 + 0.25, eave - 1.4, eave - 0.85, 'stone'); // corbel course, flush at the joints
    gableRoof(b, 'stone', x0, x1, z0, z1, eave, ridge, 'x', 0.3, [true, true]);
  });
  const [WW, WR, CE, ER, EW] = BODY;
  // North and south faces, with a pilaster on every bay boundary.
  const face = (x0, x1, z, nz, rows, eave, skips = []) => {
    const edges = facadeRows(glass, trim, x0, x1, z, nz, rows, pitch, near, skips);
    for (const x of edges) b.box('stone', [x, (eave - 1.4) / 2, z + nz * 0.2], [0.8, eave - 1.4, 0.6]);
    b.box('stone', [(x0 + x1) / 2, 5.3, z + nz * 0.18], [x1 - x0, 0.4, 0.36]);
    corbels(b, x0, x1, z, 0, nz, eave - 1.5, near); // floor string course
  };
  face(WR[1], WR[2], WR[3], -1, WR[7], WR[5]);
  face(CE[1], CE[2], CE[3], -1, CE[7], CE[5], [[-7.5, 11.7]]);
  face(ER[1] + 5.4, ER[2], ER[3], -1, ER[7], ER[5]);
  face(WR[1], WR[2], WR[4], 1, WR[7], WR[5], [[-29.5, -25.5]]);
  face(CE[1], CE[2], CE[4], 1, CE[7], CE[5], [[-3.4, 7], [-29.5, -25.5]]);
  face(ER[1] + 3.6, ER[2], ER[4], 1, ER[7], ER[5], [[32, 36]]);
  face(WW[1], WW[2], WW[4], 1, WW[7], WW[5]);
  face(EW[1], EW[2], EW[3], -1, EW[7], EW[5], [[62.9, 67.2]]);
  face(EW[1], EW[2], EW[4], 1, EW[7], EW[5], [[62.9, 67.2], [53, 57.5]]);
  sideRows(glass, trim, WW[3], WW[4], WW[1], -1, WW[7], pitch + 0.4, near, [[-12.6, -8.7]]);
  sideRows(glass, trim, EW[3] + 4.4, EW[4] - 4.4, EW[2], 1, [[1.5, 1.3, 3.6], [6.4, 1.4, 4.0], [11.2, 1.4, 3.2]], pitch + 0.6, near, [[-5.8, 1.7]]);

  // Tall north octagon: the photographed long belfry shaft ends in a flat stone crown, 145 ft.
  const B = { x: -3.0, z: -16.0, apo: 4.2 };
  prism(b, 'stone', B.x, B.z, 8, B.apo, 0, 43.0);
  for (const y of [10.6, 16.0, 26.0]) prism(b, 'stone', B.x, B.z, 8, B.apo + 0.25, y, y + 0.55);
  prism(b, 'stone', B.x, B.z, 8, B.apo + 0.4, 42.0, 42.6);
  prism(b, 'stone', B.x, B.z, 8, B.apo + 0.5, 42.6, 43.25);
  // Four small stone pinnacles rise from the parapet; the 44 m envelope is unchanged.
  for (const dx of [-3.05, 3.05]) for (const dz of [-3.05, 3.05]) {
    prism(b, 'stone', B.x + dx, B.z + dz, 4, 0.34, 43.2, 43.65);
    pyramid(b, 'stone', B.x + dx, B.z + dz, 4, 0.42, 43.65, 44, 0.02);
  }
  ribs(b, B.x, B.z, B.apo, 27, 41.9, near);
  for (const k of [0, 1, 2, 3, 4, 5, 6, 7]) {
    const a = k * Math.PI / 4, nx = Math.cos(a), nz = Math.sin(a);
    const cx = B.x + nx * B.apo, cz = B.z + nz * B.apo;
    for (const [y0, w, h] of [[3.0, 0.95, 6.2], [11.8, 0.95, 3.2], [17.5, 0.95, 4.0], [28.0, 1.05, 12.5]]) {
      for (const u of [-0.85, 0.85]) window(cx + nz * u, cz - nx * u, nx, nz, y0, w, h);
    }
    corbels(b, -1.45, 1.45, cz, nx, nz, 41.6, near, cx);
  }
  roundel(trim, glass, B.x, 23.6, B.z - B.apo, 0, -1, 1.3, near, 'clock');

  // ---- shorter north tower (east of the porch): square, steep pyramid ----
  const C = { x0: 4.9, x1: 11.7, z0: -21.9, z1: -14.6 };
  wall(C.x0, C.x1, C.z0, C.z1, 0, 27);
  wall(C.x0, 10.8, C.z1 - 0.2, -10.8, 0, 17.5); // the tower's foot runs back into the main block
  wall(C.x0 - 0.3, C.x1 + 0.3, C.z0 - 0.3, C.z1 + 0.3, 24.9, 25.7, 'stone');
  wall(C.x0 - 0.25, C.x1 + 0.25, C.z0 - 0.25, C.z1 - 0.3, 10.4, 10.95, 'stone');
  pyramid(b, 'slate', (C.x0 + C.x1) / 2, (C.z0 + C.z1) / 2, 4, 3.9, 27, 36.2, 0.05);
  for (const [y0, w, h] of [[3.0, 0.9, 4.2], [11.6, 0.9, 4.8], [19.6, 1.0, 5.4]]) {
    for (const u of [-0.95, 0.95]) {
      window( (C.x0 + C.x1) / 2 + u, C.z0, 0, -1, y0, w, h, near);
      window( C.x1, (C.z0 + C.z1) / 2 + u, 1, 0, y0, w, h, near);
    }
  }

  // ---- campanile at the north-east corner of the main body: 5.3 m square, 36 m ----
  const D = { x: 35.0, z: -11.25, half: 2.65 };
  wall(D.x - D.half, D.x + D.half, D.z - D.half, D.z + D.half, 0, 29.4);
  wall(D.x - D.half - 0.25, D.x + D.half + 0.25, D.z - D.half - 0.25, D.z + D.half + 0.25, 28.6, 29.5, 'stone');
  pyramid(b, 'slate', D.x, D.z, 4, D.half + 0.55, 29.5, 36, 0.05);
  for (const [y0, w, h] of [[4.8, 0.75, 4.0], [11.5, 0.75, 4.4], [18.2, 0.75, 4.4], [23.8, 1.1, 4.6]]) {
    window( D.x, D.z - D.half, 0, -1, y0, w, h, near);
    window( D.x + D.half, D.z - 1.0, 1, 0, y0, w, h, near);
    window( D.x - D.half, D.z - 1.0, -1, 0, y0, w, h, near);
  }

  for (const [x0, x1, z0, z1, top] of [[C.x0, C.x1, C.z0, C.z1, 24.8], [D.x-D.half, D.x+D.half, D.z-D.half, D.z+D.half, 28.5]]) {
    for (const z of [z0, z1]) corbels(b, x0, x1, z, 0, z === z0 ? -1 : 1, top, near);
    for (const x of [x0, x1]) for (const z of [z0, z1]) {
      b.box('stone', [x, 11.4, z], [0.65, 22.8, 0.65]);
      b.box('stone', [x, 22.9, z], [0.85, 0.35, 0.85]);
    }
  }

  // ---- gabled north porch: steep gable, great arched doorway, rose window ----
  wall(-1.6, 4.9, -28.2, -10.8, 0, 12);
  wall(-2.5, 5.8, -28.2, -10.8, 10.6, 12, 'stone');
  gableRoof(b, 'stone', -2.5, 5.8, -28.2, -10.8, 12, 18, 'z', 0.0, [true, false]);
  for (const x of [-1.2, 4.5]) pyramid(b, 'slate', x, -27.7, 4, 0.55, 12, 15, 0.03);
  arch(trim, 1.65, -28.2, 0, -1, 0, 4.4, 6.0, near, 0.1);
  arch(glass, 1.65, -28.2, 0, -1, 0, 3.2, 5.0, near, 0.2);
  for (const u of [-0.9, 0.9]) window( 1.65 + u, -28.2, 0, -1, 7.2, 1.2, 3.8, near, 0.16);
  roundel(trim, glass, 1.65, 14.6, -28.2, 0, -1, 2.0, near, 'rose');

  // ---- south tower: 28 m crenellated keep with the bay window and a taller flag turret ----
  const A = { x0: -3.0, x1: 6.6, z0: 5.7, z1: 18.0, h: 27 };
  wall(A.x0, A.x1, A.z0, A.z1, 0, A.h);
  wall(A.x0 - 0.25, A.x1 + 0.25, A.z0 + 0.3, A.z1 + 0.25, A.h - 2.0, A.h - 1.0, 'stone');
  wall(A.x0 - 0.25, A.x1 + 0.25, A.z0 + 0.3, A.z1 + 0.25, 14.8, 15.4, 'stone');
  wall(0.2, 3.4, A.z1 - 0.1, 19.1, 8.3, 14.3, 'stone'); // oriel on corbels
  wall(0.6, 3.0, A.z1 - 0.1, 18.8, 6.4, 8.3, 'stone');
  const ty = crenels(b, 'stone', A.x0, A.x1, A.z0, A.z1, A.h, near);
  wall(A.x0, -0.4, 5.9, 8.5, A.h, 31.2);
  const tt = crenels(b, 'stone', A.x0, -0.4, 5.9, 8.5, 31.2, near, 0.7, 0.7);
  b.bar('trim', [-1.7, 31.2 - 0.05, 7.2], [-1.7, 31.2 + 4.6, 7.2], 0.12, 0.12); // flag pole, stepped into the turret roof
  void tt;
  void ty;
  arch(trim, 1.8, A.z1, 0, 1, 0, 4.4, 6.4, near, 0.1);
  arch(glass, 1.8, A.z1, 0, 1, 0, 3.2, 5.2, near, 0.2);
  for (const u of [-0.9, 0.9]) window( 1.8 + u, 19.1, 0, 1, 9.0, 1.0, 4.4, near, 0.16); // oriel lights
  for (const u of [-1.7, 1.7]) window( 1.8 + u, A.z1, 0, 1, 16.2, 1.5, 6.4, near);
  for (const x of [A.x0, A.x1]) for (const [y0, w, h] of [[3.2, 1.1, 4.2], [8.8, 1.1, 4.6], [19.5, 1.1, 5.0]]) for (const z of [9.3, 14.5]) window( x, z, x < 0 ? -1 : 1, 0, y0, w, h, near);

  corbels(b, A.x0, A.x1, A.z1, 0, 1, 24.4, near);
  for (const x of [A.x0 + 0.35, A.x1 - 0.35]) {
    b.box('stone', [x, 12.3, A.z1 + 0.25], [0.7, 24.6, 0.8]);
    b.box('stone', [x, 24.7, A.z1 + 0.25], [1.0, 0.4, 1.0]);
  }
  // ---- low, flat-crowned north-west octagon and the annex either side of it ----
  const E = { x: -53.55, z: -12.7, apo: 2.0 };
  wall(-55.55, -47.4, -12.6, -8.7, 0, 9.5);
  wall(-63.1, -57.4, -12.6, -8.7, 0, 14);
  wall(-63.35, -57.15, -12.85, -8.4, 12.2, 13.0, 'stone');
  crenels(b, 'stone', -63.1, -57.4, -12.6, -8.7, 14, near, 0.8, 0.8);
  for (const [y0, w, h] of [[2.8, 0.9, 3.6], [8.2, 0.9, 3.8]]) {
    window( -63.1, -10.6, -1, 0, y0, w, h, near); window( -60.2, -12.6, 0, -1, y0, w, h, near);
  }
  prism(b, 'stone', E.x, E.z, 8, E.apo, 0, 23.0);
  for (const y of [9.0, 16.2]) prism(b, 'stone', E.x, E.z, 8, E.apo + 0.25, y, y + 0.55);
  prism(b, 'stone', E.x, E.z, 8, E.apo + 0.5, 22.4, 23.0);
  prism(b, 'stone', E.x, E.z, 8, E.apo + 0.5, 23.0, 24.0);
  ribs(b, E.x, E.z, E.apo, 16.8, 22.4, near);
  for (const k of [4, 5, 6, 7, 0]) {
    const a = k * Math.PI / 4, nxr = Math.cos(a), nzr = Math.sin(a), cx = E.x + nxr * E.apo, cz = E.z + nzr * E.apo;
    for (const [y0, w, h, n] of [[3.0, 0.8, 4.0, 1], [10.4, 0.8, 4.4, 1], [18.0, 0.9, 3.0, 1]]) for (let i = 0; i < n; i++) {

      const u = (i - (n - 1) / 2) * 1.5;
      window( cx + nzr * u, cz - nxr * u, nxr, nzr, y0, !near && w < 1 ? 1.1 : w, h, near);
    }
  }

  // ---- east wing: crenellated corner turrets, east porch, octagonal spire tower ----
  for (const [z0, z1] of [[-14.6, -10.3], [6.0, 10.3]]) {
    wall(62.9, 67.2, z0, z1, 0, 17.5);
    wall(62.65, 67.45, z0 - (z0 < 0 ? 0.25 : -0.3), z1 + (z0 < 0 ? 0.3 : 0.25), 15.7, 16.6, 'stone');
    crenels(b, 'stone', 62.9, 67.2, z0, z1, 17.5, near, 0.8, 0.8);
    const zf = z0 < 0 ? z0 : z1, nz = z0 < 0 ? -1 : 1;
    for (const [y0, w, h] of [[4.0, 0.8, 3.6], [10.2, 0.8, 3.8]]) { window( 65.05, zf, 0, nz, y0, w, h, near); window( 67.2, (z0 + z1) / 2, 1, 0, y0, w, h, near); }
  }
  wall(67.2, 72.3, -5.8, 1.7, 0, 8.5);
  wall(66.9, 72.55, -6.05, 1.95, 6.9, 7.6, 'stone');
  gableRoof(b, 'stone', 67.2, 72.3, -5.8, 1.7, 8.5, 12.6, 'x', 0.0, [false, true]);
  arch(trim, 72.3, -2.05, 1, 0, 0, 3.6, 5.4, near, 0.1);
  arch(glass, 72.3, -2.05, 1, 0, 0, 2.6, 4.4, near, 0.2);
  for (const u of [-1.2, 1.2]) window( 67.2, -2.05 + u, 1, 0, 11.2, 1.0, 3.0, near, 0.14);
  const spires = [[55.0, 8.5, 1.7, 21, 28.6], [-27.5, 7.7, 1.9, 12.6, 19.2], [34.0, 7.0, 1.5, 11.5, 17.6]];
  for (const [x, z, apo, hs, ht] of spires) {
    prism(b, 'stone', x, z, 8, apo, 0, hs, true);
    prism(b, 'stone', x, z, 8, apo + 0.2, hs - 0.7, hs);
    pyramid(b, 'slate', x, z, 8, apo + 0.35, hs, ht, 0.04);
    for (const k of [1, 2, 3]) {
      const a = k * Math.PI / 4; if (hs > 15 && k === 2) continue;
      window( x + Math.cos(a) * apo, z + Math.sin(a) * apo, Math.cos(a), Math.sin(a), hs - 6.2, 0.7, 3.8, near);
    }
  }


  // ---- roof stacks (small crenellated chimneys on the ridges) and gable windows on the wings ----
  for (const [x, z, ridge] of [[-37, -2.55, 14.5], [-12, -2.55, 16.5], [20, -2.55, 16.5], [44, -2.2, 14.5], [-54, 0.3, 16.5], [60, -2.2, 20]]) {
    b.box('stone', [x, ridge + 1.1, z], [1.5, 4.4, 1.5]);
    b.box('stone', [x, ridge + 3.5, z], [1.9, 0.5, 1.9]);
  }
  for (const u of [-1.0, 1.0]) window( -60.3, 0.3 + u, -1, 0, 12.1, 0.8, 2.0, near, 0.16);
  roundel(trim, glass, -60.3, 15.3, 0.3, -1, 0, 0.7, near, 'rose');
  for (const [x, nx] of [[67.2, 1], [51.4, -1]]) for (const u of [-3.4, 0, 3.4]) {
    window( x, -2.2 + u, nx, 0, 16.2, 0.9, 2.4, near, 0.16);
  }

  b.put(glass.geometry(), 'glass');
  if (!trim.empty) b.put(trim.geometry(), 'trim');
  return b.finish();
}
