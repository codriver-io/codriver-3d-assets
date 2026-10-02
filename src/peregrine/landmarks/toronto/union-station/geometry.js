import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, materialFor } from './config.js';
import { unionStationKit } from './union-station-kit.js';
import { addLettering } from './union-station-letters.js';
import {
  ROTATION, H, V, U, COLUMNS, JUNCTION_COLUMNS, ARCH_U, SHED_W, SHED_E, STRIP, ATRIUM,
} from './union-station-site.js';

const range = (n) => Array.from({ length: n }, (_, i) => i);
const centres = (u0, u1, n) => range(n).map((i) => u0 + ((i + 0.5) * (u1 - u0)) / n);

/**
 * Union Station, Toronto. Authored in the facade frame (u along Front Street, v away from
 * it, y up; see union-station-site.js) and rotated once onto east / up / south at the end.
 *
 * Every solid is built so that no two same-facing faces share a plane: walls that carry
 * windows are slabs with the openings punched through, and the mass behind starts where the
 * slab ends, so a window shows the pane and the reveal, never a coplanar sheet.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // Every material goes through the draw-budget fold (config.js FOLD): near is unchanged, far shares draws.
  const { put: put0, box: box0 } = b, fold = (m) => materialFor(m, detail);
  b.put = (g, m, ...rest) => put0(g, fold(m), ...rest); b.box = (m, ...rest) => box0(fold(m), ...rest);
  const k = unionStationKit(b, near);
  const { box, wallU, wallV, paneU, paneV, slabs, prism, hip, column } = k;

  const T = 0.9;                       // wall slab thickness
  const VR = V.rear - T;               // where the bodies stop and the rear slabs begin
  const bodyH = 15.6;                  // wall top under the wing cornice (cornice tops out at H.wing)
  const roofPlate = (u0, u1, v0, v1, y, inset = 0.7) => box('roof', u0 + inset, u1 - inset, y, y + 0.06, v0 + inset, v1 - inset);
  const CORNICE = [[0.4, 0.15], [0.35, 0.35], [0.65, 0.7]];
  const cornice = (u0, u1, v0, v1, y, sides) => slabs('stone', u0, u1, v0, v1, y, CORNICE, sides);
  const roundel = (c, y, v, r = 0.55) => {
    const g = new THREE.CylinderGeometry(r, r, 0.14, 14); g.rotateX(Math.PI / 2); g.translate(c, y, v); b.put(g, 'base');
  };

  // Window rows for a long wall: one hole per bay in both models (far keeps the punched-window rhythm,
  // it only drops the muntins and the roundels).
  const rows = (cs, w, ys) => ys.flatMap(([y0, y1]) => cs.map((c) => ({ u0: c - w / 2, u1: c + w / 2, y0, y1 })));
  // One glass strip per window row, tucked into the back of the slab: it shows through every hole of the
  // row and hides inside the piers, so a wall of 60 windows costs four boxes, not sixty.
  function rowPanes(holes, plane, facing, axis) {
    const rowsMap = new Map();
    for (const h of holes) {
      if (h.arch) continue;
      const key = `${h.y0}:${h.y1}:${h.mat || ''}`, r = rowsMap.get(key) || { y0: h.y0, y1: h.y1, a: Infinity, z: -Infinity, mat: h.mat || 'glass' };
      r.a = Math.min(r.a, h.u0); r.z = Math.max(r.z, h.u1); rowsMap.set(key, r);
    }
    for (const r of rowsMap.values()) {
      const lo = facing < 0 ? plane - 0.05 : plane, hi = facing < 0 ? plane : plane + 0.05;
      if (axis === 'u') box(r.mat, r.a, r.z, r.y0, r.y1, lo, hi); else box(r.mat, lo, hi, r.y0, r.y1, r.a, r.z);
    }
  }
  const frame = (h, plane, facing, axis) => { // one upright and one transom, on the viewer's side of the pane
    if (!near || h.arch) return;
    const c = (h.u0 + h.u1) / 2, m = (h.y0 + h.y1) / 2, a = facing < 0 ? plane - 0.1 : plane + 0.05, z = facing < 0 ? plane - 0.05 : plane + 0.1;
    if (axis === 'u') { box('metal', c - 0.05, c + 0.05, h.y0, h.y1, a, z); box('metal', h.u0, h.u1, m - 0.05, m + 0.05, a, z); }
    else { box('metal', a, z, h.y0, h.y1, c - 0.05, c + 0.05); box('metal', a, z, m - 0.05, m + 0.05, h.u0, h.u1); }
  };
  function windowWallU(mat, u0, u1, y0, y1, vFace, holes, facing) {
    wallU(mat, u0, u1, y0, y1, vFace, T, holes, facing);
    const plane = facing < 0 ? vFace + T : vFace - T;
    rowPanes(holes, plane, facing, 'u');
    for (const h of holes) { if (h.arch) paneU(h.lit ? 'glow' : 'glass', h, plane, facing); else frame(h, plane, facing, 'u'); }
  }
  function windowWallV(mat, v0, v1, y0, y1, uFace, holes, facing) {
    wallV(mat, v0, v1, y0, y1, uFace, T, holes, facing);
    const plane = facing < 0 ? uFace + T : uFace - T;
    rowPanes(holes, plane, facing, 'v');
    for (const h of holes) { if (h.arch) paneV('glow', h, plane, facing); else frame(h, plane, facing, 'v'); }
  }
  // Granite plinth along a wall run, standing 0.2 m proud.
  const plinthU = (u0, u1, vFace, facing = -1) => box('base', u0, u1, 0, 1.0, facing < 0 ? vFace - 0.2 : vFace, facing < 0 ? vFace : vFace + 0.2);
  const plinthV = (v0, v1, uFace, facing = -1) => box('base', facing < 0 ? uFace - 0.2 : uFace, facing < 0 ? uFace : uFace + 0.2, 0, 1.0, v0, v1);

  const WING_ROWS = [[1.1, 4.5], [5.5, 8.9], [10.0, 13.4], [14.0, 15.2]];
  const REAR_ROWS = [[7.2, 10.6], [11.8, 15.0]];
  // The two rear ranges face the rail corridor, away from the street: near punches their window rows, far leaves them plain
  // (66 holes are a fifth of the far stone and the rows are a few pixels tall at far range).
  const rearHoles = (cs) => (near ? rows(cs, 2.6, REAR_ROWS) : []);

  // ---- the moat: glass roofs and the stone parapet in front of the wings ----
  for (const [u0, u1, vIn] of [[-100.3, -42.7, V.wing], [44.5, 99.2, V.wing]]) {
    box('atrium', u0, u1, 0.2, 0.55, V.moat + 0.7, vIn - 0.1); // ends inside the plinth, not flush with its back
    box('stone', u0 - 0.7, u1 + 0.7, 0, 1.05, V.moat, V.moat + 0.7);           // parapet, outer face
    box('stone', u0 - 0.7, u0, 0, 1.05, V.moat + 0.7, V.pavilion);             // returns
    box('stone', u1, u1 + 0.7, 0, 1.05, V.moat + 0.7, u1 > 0 ? V.pavilion + 0.2 : vIn);
    box('base', u0 - 0.8, u1 + 0.8, 1.05, 1.2, V.moat - 0.05, V.moat + 0.8); // coping
    if (near) for (let u = u0 + 4; u < u1; u += 4.4) box('stone', u - 0.35, u + 0.35, 1.15, 1.5, V.moat - 0.05, V.moat + 0.75); // capped piers
  }

  // ---- the west block: pavilion, front range, end range, light court, rear range ----
  windowWallU('stone', -100.3, -38.5, 0, bodyH, V.wing, rows(centres(-100.3, -38.5, 14), 2.6, WING_ROWS), -1);
  plinthU(-100.3, -38.5, V.wing);
  box('stone', -100.3, -38.5, 0, bodyH, V.wing + T, -3.4);
  cornice(-100.3, -38.5, V.wing, -3.4, bodyH, 'n'); roofPlate(-100.3, -38.5, V.wing - 0.7, -3.4, H.wing, 0.5);
  box('stone', -113.4, -100.3, 0, bodyH, -8.8, VR); cornice(-114.3, -100.3, -8.8, V.rear, bodyH, 'ws'); roofPlate(-114.3, -100.3, -8.8, V.rear, H.wing, 0.6);
  box('stone', -100.3, -90.7, 0, bodyH, -3.4, VR); cornice(-100.3, -90.7, -3.4, V.rear, bodyH, 's'); roofPlate(-100.3, -90.7, -3.4, V.rear, H.wing, 0.5);
  box('stone', -90.7, -38.5, 0, bodyH, 9.6, VR); cornice(-90.7, -38.5, 9.6, V.rear, bodyH, 's'); roofPlate(-90.7, -38.5, 9.6, V.rear, H.wing, 0.5);
  windowWallU('stone', -113.4, -38.5, 0, bodyH, V.rear, rearHoles(centres(-113.4, -38.5, 17)), 1);
  box('roof', -90.7, -38.5, 0, H.court, -3.4, 9.6);                         // light court floor (the roof of the concourse below)
  box('glass', -89.4, -41.3, H.court, H.court + 0.05, -2.5, 8.2);
  // ---- the east block ----
  windowWallU('stone', 42.1, 99.2, 0, bodyH, V.wing, rows(centres(42.1, 99.2, 13), 2.6, WING_ROWS), -1);
  plinthU(42.1, 99.2, V.wing);
  box('stone', 42.1, 99.2, 0, bodyH, V.wing + T, -4.1);
  cornice(42.1, 99.2, V.wing, -4.1, bodyH, 'n'); roofPlate(42.1, 99.2, V.wing - 0.7, -4.1, H.wing, 0.5);
  box('stone', 60.3, 99.2, 0, bodyH, -4.1, VR); cornice(60.3, 99.2, -4.1, V.rear, bodyH, 's'); roofPlate(60.3, 99.2, -4.1, V.rear, H.wing, 0.5);
  box('stone', 42.1, 60.3, 0, bodyH, 9.2, VR); cornice(42.1, 60.3, 9.2, V.rear, bodyH, 's'); roofPlate(42.1, 60.3, 9.2, V.rear, H.wing, 0.5);
  box('stone', 99.2, 112.9, 0, bodyH, -7.4, VR); cornice(99.2, 113.8, -7.4, V.rear, bodyH, 'es'); roofPlate(99.2, 113.8, -7.4, V.rear, H.wing, 0.6);
  windowWallU('stone', 42.1, 112.9, 0, bodyH, V.rear, rearHoles(centres(42.1, 112.9, 16)), 1);
  box('roof', 41.8, 60.3, 0, H.court, -4.1, 9.2);
  box('glass', 42.8, 50.3, H.court, H.court + 0.05, -1.5, 6.0);

  // ---- the pavilions: arched ground floor, two window rows, roundels, a copper pyramid roof; and the end walls ----
  function pavilion(u0, u1, vFront, vBack, west) {
    const cu = (u0 + u1) / 2, ac = [cu - 3.3, cu + 3.3];
    const arches = ac.map((c) => ({ u0: c - 1.8, u1: c + 1.8, y0: 0.6, y1: 8.6, arch: true, lit: true }));
    windowWallU('stone', u0, u1, 0, bodyH, vFront, [...arches, ...rows(ac, 2.4, [[10.1, 13.0], [13.8, 15.2]])], -1);
    plinthU(u0, u1, vFront);
    box('stone', west ? u0 + T : u0, west ? u1 : u1 - T, 0, bodyH, vFront + T, vBack);
    cornice(u0, u1, vFront, vBack, bodyH, west ? 'nw' : 'ne');
    // the mapped roof: a copper pyramid, roof:height 2.8, apex at 19.5 m (OSM parts 290168044 / 290168047);
    // its base sits just inside the cornice, so the pyramid emerges from the top slab at 17 m
    k.pyramid('copper', u0 + 0.9, u1 - 0.9, vFront + 0.9, vBack - 0.9, H.pavilion - 2.8, 2.8);
    if (near) for (const c of [cu - 5, cu, cu + 5]) roundel(c, 16.3, vFront - 0.12);
  }
  pavilion(-114.3, -100.3, V.pavilion, -8.8, true);
  pavilion(99.2, 113.8, V.pavilion + 0.2, -7.4, false);
  // end walls, facing Bay Street and York Street: the pavilion's arches, then the wing's window bays
  function endWall(uFace, facing, v0) {
    const pav = [v0 + 3.9, v0 + 8.9].map((c) => ({ u0: c - 1.7, u1: c + 1.7, y0: 0.6, y1: 8.4, arch: true, lit: true }));
    const cs = centres(-8.8, 20.9, 7);
    const holes = [...pav, ...rows(pav.map((h) => (h.u0 + h.u1) / 2), 2.4, [[10.1, 13.0], [13.8, 15.2]]), ...rows(cs, 2.6, WING_ROWS)];
    windowWallV('stone', v0 + T, V.rear, 0, bodyH, uFace, holes, facing);
    plinthV(v0 + T, V.rear, uFace, facing);
  }
  endWall(-114.3, -1, V.pavilion);
  endWall(113.8, 1, V.pavilion + 0.2);

  // ---- the central body: Great Hall block behind a deep colonnaded loggia ----
  const { loggiaW, loggiaE } = U;
  const archH = ARCH_U.map((c) => ({ u0: c - 4.3, u1: c + 4.3, y0: 0.4, y1: 13.2, arch: true, lit: true }));
  const winC = [-20.6, -15.8, -11.4, -6.97, -2.54, 1.9, 6.3, 10.7, 15.1, 19.6, 24.4];
  const halls = near ? winC.map((c) => ({ u0: c - 1.3, u1: c + 1.3, y0: 2.6, y1: 12.6 })) : [{ u0: -21.9, u1: 25.7, y0: 2.6, y1: 12.6 }];
  const vBack = V.loggia, backT = 0.7;
  wallU('stone', loggiaW, loggiaE, 0, 14.0, vBack, backT, [...archH, ...halls], -1);
  for (const h of [...archH, ...halls]) paneU(h.arch ? 'glow' : 'glass', h, vBack + backT, -1);
  if (near) {
    for (const h of archH) {
      // bronze grille: verticals, transoms and a plinth rail behind the columns
      const n = 13, r = (h.u1 - h.u0) / 2, cu = (h.u0 + h.u1) / 2, spring = h.y1 - r;
      for (let i = 1; i < n; i++) {
        const u = h.u0 + ((h.u1 - h.u0) * i) / n, top = spring + Math.sqrt(Math.max(0, r * r - (u - cu) ** 2));
        box('bronze', u - 0.05, u + 0.05, h.y0, top - 0.05, vBack + 0.52, vBack + 0.62);
      }
      for (const y of [2.6, 5.2, 7.8, 10.4]) box('bronze', h.u0, h.u1, y - 0.06, y + 0.06, vBack + 0.52, vBack + 0.62);
      box('bronze', h.u0, h.u1, 0.4, 0.6, vBack + 0.5, vBack + 0.62);
    }
    for (const h of halls) {
      const c = (h.u0 + h.u1) / 2;
      box('metal', c - 0.05, c + 0.05, h.y0, h.y1, vBack + 0.52, vBack + 0.62);
      for (const y of [5.3, 8.1]) box('metal', h.u0, h.u1, y - 0.05, y + 0.05, vBack + 0.52, vBack + 0.62);
    }
  }
  box('stone', -38.5, loggiaW, 0, H.main, -18.7, VR);                          // loggia end walls
  box('stone', loggiaE, 42.1, 0, H.main, -18.7, VR);
  box('stone', loggiaW, loggiaE, 0, H.main, vBack + backT, VR);                // main mass behind the back wall
  box('stone', loggiaW, loggiaE, 14.0, H.main, -18.7, vBack + backT);          // loggia ceiling and the attic over it
  // The rear of the Great Hall block: lower walls (below the clerestory) and the clerestory itself
  windowWallU('stone', -38.5, 42.1, H.strip, H.main, V.rear, rows(centres(-34.5, 38.1, 8), 2.8, [[7.4, 11.4], [12.6, 16.6]]), 1);
  // entablature strip over the columns: architrave and frieze, cornice slabs, attic parapet
  box('stone', -38.0, 41.9, 12.0, 16.3, V.entab, -18.7);
  slabs('stone', -38.0, 41.9, V.entab, -18.7, 16.3, [[0.35, 0.25], [0.55, 0.75], [0.5, 0.95]], 'n');
  box('stone', -37.4, 41.3, 17.7, 18.75, V.entab + 0.3, -18.7);
  box('stone', -37.7, 41.6, 18.75, 19.0, V.entab, -18.7);
  if (near) for (let u = -37.6; u < 41.6; u += 0.9) box('stone', u, u + 0.42, 15.85, 16.3, V.entab - 0.14, V.entab); // dentils
  for (const [u0, u1] of [[-37.6, -23.4], [27.2, 41.4]]) {
    box('stone', u0, u1, 12.0, 14.4, V.porch, V.entab);
    slabs('stone', u0, u1, V.porch, V.entab, 14.4, [[0.3, 0.2], [0.3, 0.45]], 'nwe');
    if (near) for (const c of centres(u0 + 1.2, u1 - 1.2, 4)) roundel(c, 13.3, V.porch - 0.1, 0.62);
  }
  for (const [u, v] of COLUMNS) column(u, v, 1.03);
  for (const [u, v] of JUNCTION_COLUMNS) column(u, v, 1.25);
  roofPlate(-37.4, 41.3, -18.7, -8.4, H.main, 0.4);                             // the roof terrace in front of the Great Hall

  // ---- the Great Hall: clerestory walls, cornice, low hipped copper roof ----
  const hallHoles = rows(centres(-34.5, 38.1, 8), 2.6, [[20.8, 24.4]]).map((h) => ({ ...h, mat: 'glow' })); // lit at night
  windowWallU('stone', -38.5, 42.1, H.main, 25.1, -8.4, hallHoles.map((h) => ({ ...h, lit: false })), -1);
  box('stone', -37.6, 41.2, H.main, 25.1, -8.4 + T, VR);
  windowWallU('stone', -37.6, 41.2, H.main, 25.1, V.rear, hallHoles.map((h) => ({ ...h })), 1);
  slabs('stone', -38.5, 42.1, -8.4, V.rear, 25.1, [[0.4, 0.15], [0.4, 0.4], [0.6, 0.75]], 'nswe');
  const endArch = [{ u0: 5.5, u1: 13.5, y0: 19.6, y1: 24.6, arch: true }]; // v range, then heights
  windowWallV('stone', -8.4 + T, V.rear, H.main, 25.1, 42.1 - 0.0, endArch, 1);
  windowWallV('stone', -8.4 + T, V.rear, H.main, 25.1, -38.5, endArch, -1);
  hip('copper', -36.2, 40.0, -5.7, 18.8, H.hall, H.ridge - H.hall);
  if (near) { // small hipped dormers along the eaves of both long slopes, as in the aerial photographs
    const pitch = (H.ridge - H.hall) / 12.25;
    for (const u of [-27, -16, -5, 6, 17, 28]) {
      const north = { v0: -3.6, v1: -2.0 }, south = { v0: 15.0, v1: 16.6 };
      for (const [d, dir] of [[north, -1], [south, 1]]) {
        const edge = dir < 0 ? d.v0 : d.v1, ySlope = H.hall + pitch * (dir < 0 ? edge + 5.7 : 18.8 - edge);
        box('stone', u - 0.9, u + 0.9, ySlope - 0.25, ySlope + 1.7, d.v0, d.v1);
        k.hip('copper', u - 1.05, u + 1.05, d.v0 - 0.15, d.v1 + 0.15, ySlope + 1.7, 0.55);
        const face = dir < 0 ? d.v0 - 0.04 : d.v1;
        box('glass', u - 0.4, u + 0.4, ySlope + 0.35, ySlope + 1.4, face, face + 0.04);
      }
    }
  }

  // ---- everything behind: the low range, the two sheds, the atrium ----
  prism('roof', 'base', STRIP, 0, H.strip);
  prism('shed', 'brick', SHED_W, 0, H.shed);
  prism('shed', 'brick', SHED_E, 0, H.shed);
  const A = ATRIUM;
  box('brick', A.u0, A.u1, 0, 4.5, A.v0, A.v1);
  box('atrium', A.u0, A.u1, 4.5, 7.5, A.v0, A.v1);
  const w = (A.u1 - A.u0) / 3;
  for (const i of range(3)) k.barrelU('atrium', A.u0 + i * w, A.u0 + (i + 1) * w, A.v0, A.v1, 7.5, 3.0, near ? 10 : 5);
  if (near) { // steel seams between the vaults, along the crowns, and a rib every 12 m across
    for (const i of range(4)) box('metal', A.u0 + i * w - 0.2, A.u0 + i * w + 0.2, 7.3, 7.8, A.v0, A.v1);
    for (const i of range(3)) box('metal', A.u0 + (i + 0.5) * w - 0.12, A.u0 + (i + 0.5) * w + 0.12, 10.5, 10.68, A.v0, A.v1);
    for (let v = A.v0 + 6; v < A.v1; v += 12) box('metal', A.u0, A.u1, 7.4, 7.6, v - 0.1, v + 0.1);
  }
  // Strips on the shed roofs, as in the roof photographs: alternate 13.8 m strips a shade darker, with a seam
  // between them (the far model uses double-width strips: a few boxes, no extra draw).
  const pitch = near ? 13.8 : 27.6, lo = H.shed, seamEnds = (u) => (u < 66 ? [35, 123.4] : [47, 109.6]);
  const strips = (u0, u1) => { for (let u = u0, n = 0; u < u1; u += pitch, n++) {
    const [v0, v1] = seamEnds(u);
    if (n % 2 === 0) box('roof', u, Math.min(u + pitch, u1), lo, lo + 0.05, v0, v1);
    if (u > u0) box('metal', u - 0.18, u + 0.18, lo - 0.1, lo + 0.12, v0, v1); // seam sunk into the shed roof: its underside shares no plane with the strips'
  } };
  strips(-170, -37.2); strips(42, 176);

  if (near) addLettering({ box }, { u: 1.9, y: 13.95, v: V.entab });

  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift'); // a building has no road or deck contract
    o.geometry.rotateY(ROTATION);
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
  });
  return root;
}
