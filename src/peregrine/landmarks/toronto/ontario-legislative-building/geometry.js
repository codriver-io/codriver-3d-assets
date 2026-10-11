import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { kit, dropGroundFaces } from './ontario-legislative-building-kit.js';
import { PLAN } from './ontario-legislative-building-site.js';

// Ontario Legislative Building, "the Pink Palace" (Richardsonian Romanesque, 1893).
// Authored in the frame of ontario-legislative-building-site.js (x along the south front,
// z toward the front, y up, origin at the outline centroid) and turned onto the mapped
// footprint at the end by PLAN.angle. Real metres; y = 0 is flat local grade.
const S = 0, N = Math.PI, E = Math.PI / 2, W = -Math.PI / 2; // wall normals: +Z, -Z, +X, -X
const FACES = { S, N, E, W };

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = kit(b, near);
  const { box, frustum, polyPyramid, hipRoof, gableRoof, gableWall, lathe, cyl, cone, win, archRing, course, dormer, stack, put, onWall } = k;
  const P = PLAN, AX = P.axis, C = P.central;

  // Windows on one wall. `at` is the wall plane (z for S/N faces, x for E/W), a0..a1 the extent
  // along the wall. Each floor: { y, h, w, gap, arch, rise, pair, n }. Far LOD drops the frames and
  // every other window, so a wall still reads as a wall at a fraction of the cost.
  function facade(face, at, a0, a1, floors, margin = 1.6) {
    const ang = FACES[face], ns = face === 'S' || face === 'N';
    for (const f of floors) {
      const span = a1 - a0 - 2 * margin;
      if (span < 0.2) continue;
      const n = f.n ?? Math.max(1, Math.round(span / (f.gap || 4.2)) + 1);
      const step = !near && n > 3 ? 2 : 1;
      for (let i = 0; i < n; i += step) {
        const a = a0 + margin + (n === 1 ? span / 2 : span * i / (n - 1));
        for (const d of f.pair ? [-f.pair / 2, f.pair / 2] : [0]) {
          win(ns ? a + d : at, f.y, ns ? at : a + d, f.w, f.h, ang, { arch: f.arch, rise: f.rise, mat: f.mat || 'glass', frame: f.frame !== false });
        }
      }
    }
  }
  // Storey windows for a wall of height `eave`: 5.1 m pitch from a 1.8 m sill, the top storey arched.
  function storeys(eave, { w = 1.6, h = 3.3, gap = 4.2, arch = true, pair = 0 } = {}) {
    const out = [];
    for (let y = 1.8; y + h < eave - 1.4; y += 5.1) out.push({ y, h, w, gap, pair });
    if (arch && out.length > 2) { const t = out[out.length - 1]; t.arch = true; t.rise = t.w * 0.5; }
    return out;
  }
  // A plain block: walls to `h`, dark plinth, string courses between the storeys, cornice.
  function block(u0, u1, v0, v1, h, { belts = true, cornice = true, plinth = true } = {}) {
    box('stone', u0, u1, 0, h, v0, v1);
    if (plinth) box('stoneDark', u0 - 0.3, u1 + 0.3, 0, 1.4, v0 - 0.3, v1 + 0.3);
    if (belts) for (let y = 5.5; y < h - 3; y += 5.1) course('trim', u0, u1, v0, v1, y, 0.4, 0.22);
    if (cornice) course('trim', u0, u1, v0, v1, h - 0.9, 0.9, 0.55);
  }
  const walls = (u0, u1, v0, v1, eave, faces, opt) => {
    const f = storeys(eave, opt);
    for (const [face, a0, a1] of faces) {
      const at = face === 'S' ? v1 : face === 'N' ? v0 : face === 'E' ? u1 : u0;
      facade(face, at, a0, a1, f, 1.7);
    }
  };
  // Flat roof with a parapet ring and a dark membrane inside it.
  function flatRoof(u0, u1, v0, v1, h, t = 0.6, ph = 0.7) {
    box('roof', u0, u1, h + 0.1, h + 0.1, v0, v1, 'dsewn');     // the membrane: one quad, 7 cm above the cornice courses below
    box('trim', u0 - 0.3, u1 + 0.3, h, h + ph, v0 - 0.3, v0 + t, 'd'); box('trim', u0 - 0.3, u1 + 0.3, h, h + ph, v1 - t, v1 + 0.3, 'd');
    box('trim', u0 - 0.3, u0 + t, h, h + ph, v0 + t, v1 - t, 'd'); box('trim', u1 - t, u1 + 0.3, h, h + ph, v0 + t, v1 - t, 'd');
  }
  const ring = (rect, out) => [[rect.u0 - out, rect.v0 - out], [rect.u1 + out, rect.v0 - out], [rect.u1 + out, rect.v1 + out], [rect.u0 - out, rect.v1 + out]];

  // ==== central block: octagonal roof, four domed towers, portico, chamber ==========
  {
    box('stone', C.u0, C.u1, 0, C.eave, C.v0, C.v1);
    box('stoneDark', C.u0 - 0.3, C.u1 + 0.3, 0, 1.4, C.v0 - 0.3, C.v1 + 0.3);
    course('trim', C.u0, C.u1, C.v0, C.v1, C.eave - 0.9, 0.9, 0.9);                       // eave cornice
    // octagonal pyramid, 25 m of steep slate; a little eave overhang by scaling out from the apex
    const [ax, az] = P.apex, k1 = 1.06;
    polyPyramid('roof', P.octagon.map(([u, v]) => [ax + (u - ax) * k1, az + (v - az) * k1]), C.eave, [ax, C.peak, az]);
    if (near) for (const [u, v] of P.octagon) b.bar('trim', [ax, C.peak - 0.2, az], [ax + (u - ax) * k1, C.eave + 0.2, az + (v - az) * k1], 0.34, 0.34);
    cyl('trim', ax, C.peak, C.peak + 1.1, az, 0.55, 0.6, 8, 't'); cone('trim', ax, C.peak + 1.1, C.peak + 3.0, az, 0.42, 8);
    // south front between the towers
    const zf = C.v1;
    course('trim', AX - 10, AX + 10, zf - 0.2, zf, 11.0, 0.7, 0.55);                       // over the balcony
    course('trim', AX - 10, AX + 10, zf - 0.2, zf, 30.2, 0.9, 0.85);                       // frieze cornice
    for (const x of [-5.9, 0, 5.9]) {
      archRing(AX + x, 11.7, zf, 5.0, 10.6, S, { rim: 0.6, depth: 0.55, rise: 2.5 });
      win(AX + x, 11.7, zf, 5.0, 10.6, S, { arch: true, rise: 2.5, mat: 'glow', frame: false });
      if (near) { for (const y of [5.4, 9.8]) k.box('trim', AX + x - 2.5, AX + x + 2.5, 11.7 + y - 0.5, 11.7 + y - 0.25, zf, zf + 0.12); }
    }
    for (const x of [-2.95, 2.95, -8.85, 8.85]) if (near) cyl('trim', AX + x, 11.4, 20.2, zf + 0.2, 0.42, 0.42, 10, 't');
    for (const x of [-8.8, -4.4, 0, 4.4, 8.8]) {                                               // oculi and the arms medallion
      const r = x === 0 ? 1.55 : 1.15;
      put(onWall(new THREE.CircleGeometry(r, near ? 16 : 8), AX + x, 26.4, zf + 0.06, S), x === 0 ? 'trim' : 'glow');
      if (near) put(onWall(new THREE.TorusGeometry(r + 0.18, 0.2, 5, 16).translate(0, 0, 0.1), AX + x, 26.4, zf, S), 'trim');
    }
    dormer(AX, C.eave - 0.15, zf + 0.05, S, { w: 6.4, h: 4.6, rise: 3.6, depth: 7, panes: 3 });
    for (const s of [-1, 1]) if (near) cone('trim', AX + s * 3.6, C.eave + 4.4 + 2.0, C.eave + 4.4 + 3.6, zf - 0.2, 0.28, 6);
    // flanks between the towers and the wings
    facade('E', C.u1, 29.5, 44.2, storeys(C.eave, { w: 1.8, h: 3.6, gap: 5 }).map((f) => ({ ...f, y: f.y + (f.y > 6 ? 0.4 : 0) })), 1.6);
    facade('W', C.u0, 30.5, 44.0, storeys(C.eave, { w: 1.8, h: 3.6, gap: 5 }).map((f) => ({ ...f, y: f.y + (f.y > 6 ? 0.4 : 0) })), 1.6);
  }

  // ---- portico: three arches, balcony over, steps ----------------------------------
  {
    const { u0, u1, top } = P.porch, zf = P.porch.v1, zb = P.porch.v0, cu = AX;
    const arches = [[cu, 5.9, 8.6], [cu - 6.8, 4.5, 7.5], [cu + 6.8, 4.5, 7.5]];
    const outline = new THREE.Shape([[u0, 0], [u1, 0], [u1, top], [u0, top]].map(([x, y]) => new THREE.Vector2(x, y)));
    for (const [x, w, h] of arches) outline.holes.push(new THREE.Path(k.archShape(w, h, w * 0.5).getPoints(near ? 12 : 6).map((p) => new THREE.Vector2(p.x + x, p.y + 0.9))));
    const front = new THREE.ExtrudeGeometry(outline, { depth: 1.4, bevelEnabled: false, curveSegments: near ? 12 : 6 });
    front.translate(0, 0, zf - 1.4); put(front, 'stone');
    for (const s of [-1, 1]) box('stone', s < 0 ? u0 : u1 - 1.2, s < 0 ? u0 + 1.2 : u1, 0, top, zb, zf - 1.4);   // porch flanks
    box('stone', u0, u1, top - 0.5, top, zb, zf);                                                                // ceiling
    box('stone', u0, u1, 0, 0.9, zb, zf);                                                                        // porch floor
    for (const [x, w, h] of arches) {
      archRing(x, 0.9, zf - 0.02, w, h, S, { rim: 0.5, depth: 0.2, rise: w * 0.5 });
      put(onWall(new THREE.ShapeGeometry(k.archShape(w, h, w * 0.5), near ? 10 : 5), x, 0.9, zb + 0.15, S), 'iron');       // dim interior and doors
      if (near) win(x, 1.2, zb + 0.2, w - 1.4, h - 2.4, S, { arch: true, rise: (w - 1.4) / 2, frame: false, mat: 'glow' });
    }
    // balcony slab, balustrade
    box('trim', u0 - 0.9, u1 + 0.9, top, top + 1.0, zb - 0.1, zf + 0.9);
    if (near) {
      for (let x = u0 - 0.6; x <= u1 + 0.61; x += 0.8) box('trim', x - 0.15, x + 0.15, top + 1.0, top + 2.3, zf + 0.4, zf + 0.75, 'du');
      box('trim', u0 - 0.9, u1 + 0.9, top + 2.3, top + 2.55, zf + 0.3, zf + 0.85);
      for (const x of [u0 - 0.5, cu - 3, cu + 3, u1 + 0.5]) box('trim', x - 0.35, x + 0.35, top + 1.0, top + 2.8, zf + 0.25, zf + 0.95);
    } else box('trim', u0 - 0.9, u1 + 0.9, top + 1.0, top + 2.4, zf + 0.3, zf + 0.7);
    // clustered pier columns
    if (near) for (const x of [u0 + 0.6, cu - 3.4, cu + 3.4, u1 - 0.6]) for (const d of [-0.42, 0.42]) { cyl('stoneDark', x + d, 0.9, 6.6, zf + 0.15, 0.3, 0.32, 8, ''); box('trim', x + d - 0.42, x + d + 0.42, 6.6, 7.1, zf - 0.25, zf + 0.55); }
    // eight steps (OSM: front steps way 960958887)
    const st = P.steps, n = 8, run = (st.v1 - st.v0) / n;
    for (let i = 0; i < n; i++) box('stone', st.u0, st.u1, 0, 0.95 - i * 0.12, st.v0 + run * i, st.v0 + run * (i + 1));
  }

  // ---- four domed towers ---------------------------------------------------------
  for (const t of P.towers) {
    const cx = (t.u0 + t.u1) / 2, cz = (t.v0 + t.v1) / 2, hw = (t.u1 - t.u0) / 2;
    box('stone', t.u0, t.u1, 0, P.shaft, t.v0, t.v1);
    box('stoneDark', t.u0 - 0.3, t.u1 + 0.3, 0, 1.4, t.v0 - 0.3, t.v1 + 0.3);
    for (const y of [8.2, 16.2, 24.2]) course('trim', t.u0, t.u1, t.v0, t.v1, y, 0.45, 0.28);
    course('trim', t.u0, t.u1, t.v0, t.v1, P.shaft - 1.0, 1.0, 0.6);
    // engaged rock-faced turrets: stout piers up the outer corners of the tower's outward face, flared at the
    // foot, swelling course by course, corbelled and capped with a low stone dome below the belfry
    const tz = t.front ? t.v1 - 0.3 : t.v0 + 0.3;
    const foot = [[2.05, 0], [1.9, 1.2]];
    if (near) for (let y = 3.4; y < 32; y += 2.6) { const r = 1.78 - 0.3 * y / 32; foot.push([r + 0.09, y - 0.55], [r - 0.02, y]); }
    else foot.push([1.6, 16], [1.5, 30]);
    foot.push([1.5, 32.4], [1.68, 33.0], [2.1, 33.5], [2.1, 34.2], [1.55, 34.7], [0.95, 35.4], [0.4, 35.9], [0, 36.1]);
    // The quarter of each turret that turns toward the tower is buried in the shaft up to the belfry (y 32), so the
    // shaft part is a three-quarter sweep; the capped crown above it is a full one.
    const shaftPts = foot.filter((q) => q[1] <= 32.4), crownPts = foot.filter((q) => q[1] >= 32.4);
    for (const tx of [t.u0 + 1.05, t.u1 - 1.05]) {
      const west = tx < cx, phi0 = t.front ? (west ? Math.PI : 1.5 * Math.PI) : (west ? 0.5 * Math.PI : 0);
      lathe('stoneDark', tx, 0, tz, shaftPts, near ? 9 : 6, phi0, 1.5 * Math.PI);
      lathe('stoneDark', tx, 0, tz, crownPts, near ? 12 : 8);
    }
    // belfry drum and copper dome
    cyl('stone', cx, P.shaft, P.domeBase, cz, hw - 0.5, hw - 0.5, near ? 16 : 8, '');
    cyl('trim', cx, P.domeBase - 0.9, P.domeBase, cz, hw + 0.05, hw + 0.05, near ? 16 : 8, 'b');
    cyl('trim', cx, P.shaft, P.shaft + 0.5, cz, hw + 0.05, hw + 0.05, near ? 16 : 8, 't');
    const r0 = hw + 0.05, H = P.domeTop - P.domeBase;
    lathe('copper', cx, P.domeBase, cz, [[r0, 0], [r0 + 0.15, 0.4], [r0 - 0.15, 1.2], [r0 - 0.7, 2.2], [r0 - 1.5, 3.2], [r0 - 2.5, 4.1], [r0 - 3.4, 4.7], [0.4, H - 0.1], [0, H]]);
    cyl('trim', cx, P.domeTop, P.domeTop + 2.4, cz, 0.14, 0.14, 6, 't'); cone('trim', cx, P.domeTop + 2.4, P.domeTop + 3.2, cz, 0.3, 6);
    if (near) for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; win(cx + Math.sin(a) * (hw - 0.5), 33.4, cz + Math.cos(a) * (hw - 0.5), 1.1, 4.2, a, { arch: true, rise: 0.55 }); }
    // faces
    const facesOut = t.front ? [['S', t.v1], ['E', t.u1], ['W', t.u0]] : [['N', t.v0], ['E', t.u1], ['W', t.u0]];
    const flo = (w) => [{ y: 4.4, h: 3.8, w, gap: 2.6, arch: true, rise: w * 0.5 }, { y: 12.4, h: 4.2, w, gap: 2.6, arch: true, rise: w * 0.5 }, { y: 20.2, h: 3.8, w, gap: 2.6, arch: true, rise: w * 0.5 }];
    for (const [face, at] of facesOut) {
      const ns = face === 'S' || face === 'N';
      const fl = ns ? [{ y: 4.4, h: 3.8, w: 1.2, n: 1, arch: true, rise: 0.6 }, { y: 12.4, h: 4.2, w: 1.2, n: 1, arch: true, rise: 0.6 }, { y: 20.2, h: 3.8, w: 1.2, n: 1, arch: true, rise: 0.6 }] : flo(0.85);
      facade(face, at, ns ? t.u0 : t.v0, ns ? t.u1 : t.v1, fl, ns ? 2.6 : 3.4);
    }
    if (t.front) {                                                    // signature features of the two front towers
      if (t.u1 < 0) {                                                 // west tower: the rose window
        put(onWall(new THREE.CircleGeometry(1.3, near ? 24 : 10), cx, 28.6, t.v1 + 0.06, S), 'glass');
        put(onWall(new THREE.TorusGeometry(1.5, 0.22, 5, near ? 24 : 10).translate(0, 0, 0.12), cx, 28.6, t.v1, S), 'trim');
        if (near) for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; b.bar('trim', [cx, 28.6, t.v1 + 0.14], [cx + Math.cos(a) * 1.3, 28.6 + Math.sin(a) * 1.3, t.v1 + 0.14], 0.12, 0.12); }
      } else {                                                        // east tower: balcony and arched opening
        box('trim', cx - 2.5, cx + 2.5, 25.2, 25.9, t.v1 - 0.1, t.v1 + 1.1);
        if (near) { box('trim', cx - 2.5, cx + 2.5, 25.9, 27.0, t.v1 + 0.75, t.v1 + 1.0); }
        win(cx, 26.2, t.v1, 2.3, 5.4, S, { arch: true, rise: 1.15 });
      }
    }
  }

  // ==== wings ===================================================================
  {
    const w = P.wingW;
    block(w.u0, w.u1, w.v0, w.v1, w.eave);
    frustum('roof', [w.u0 - 5.3, w.u1, w.v0 - 0.9, w.v1 + 0.9], [w.u0 - 4.5, w.u1, w.flat[0], w.flat[1]], w.eave, w.top);
    facade('S', w.v1, -44.0, -19.0, storeys(w.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 1.8);
    facade('N', w.v0, -44.0, -18.4, storeys(w.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 1.8);
    for (const x of [-41, -36, -31, -26, -21.5]) dormer(x, w.eave + 0.9, w.v1 + 0.02, S, { w: 1.8, h: 3.4, rise: 2.4, depth: 4.5 });
    const e = P.wingE;
    block(e.u0, e.u1, e.v0, e.v1, e.eave);
    hipRoof('roof', e.u0, e.u1, e.v0, e.v1, e.eave, e.peak - e.eave, { over: 0.8 });
    facade('S', e.v1, 17.8, 36.9, storeys(e.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 1.8);
    facade('N', e.v0, 17.8, 36.9, storeys(e.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 1.8);
    const l = P.link;                                                           // 814: narrower toward the front
    block(l.u0, l.u1, l.v0, 29.5, l.h, { cornice: false }); flatRoof(l.u0, l.u1, l.v0, 29.5, l.h);
    block(40.0, l.u1, 29.5, l.v1, l.h, { cornice: false }); flatRoof(40.0, l.u1, 29.5, l.v1, l.h);
    facade('S', l.v1, 40.0, 46.6, storeys(l.h, { w: 1.6, h: 3.3, gap: 4.4 }), 1.6);
    facade('N', l.v0, 36.9, 43.0, storeys(l.h, { w: 1.6, h: 3.3, gap: 4.4 }), 1.6);
    facade('W', 40.0, 29.5, 36.4, storeys(l.h, { w: 1.6, h: 3.3, gap: 4.4 }), 1.0);
  }

  // ==== south-end pavilions: hipped roof with a front gable and an arcade =============
  for (const s of [-1, 1]) {
    const p = s < 0 ? P.pavW : P.pavE, cu = (p.u0 + p.u1) / 2, len = p.v1 - p.v0;
    block(p.u0, p.u1, p.v0, p.v1, p.eave);
    const ridgeLen = p.ridge[1] - p.ridge[0], inset = (len - ridgeLen) / 2;
    hipRoof('roof', p.u0, p.u1, p.v0, p.v1, p.eave, p.peak - p.eave, { along: 'z', inset, over: 0.8 });
    cone('trim', cu, p.peak, p.peak + 2.6, (p.ridge[0] + p.ridge[1]) / 2, 0.35, 6);
    // front gable
    const gw = 11.4, rise = 10.5;
    gableRoof('roof', cu - gw / 2, cu + gw / 2, p.v1 - 15, p.v1 - 0.6, p.eave, rise, { along: 'z', over: 0.3 });
    gableWall('stone', 'z', p.v1 - 0.3, cu - gw / 2, cu + gw / 2, p.eave, rise, 0.6, 0.2);
    for (const dx of [-3.4, -1.7, 0, 1.7, 3.4]) win(cu + dx, p.eave + 0.6, p.v1 + 0.02, 1.0, 2.0 + (1 - Math.abs(dx) / 3.4) * 3.2, S, { arch: true, rise: 0.5, frame: false });
    for (const x of [p.u0 + 1.2, p.u1 - 1.2]) { cyl('stoneDark', x, p.eave - 0.4, p.eave + 6.6, p.v1 - 0.7, 0.6, 0.55, near ? 8 : 5, ''); cone('roof', x, p.eave + 6.6, p.eave + 9.0, p.v1 - 0.7, 0.75, near ? 8 : 5); }
    const fl = [
      { y: 1.8, h: 3.3, w: 1.6, gap: 3.4 }, { y: 6.9, h: 3.3, w: 1.6, pair: 2.3, n: 3 }, { y: 12.0, h: 3.3, w: 1.5, pair: 2.3, n: 3, arch: true, rise: 0.75 },
      { y: 17.1, h: 3.0, w: 1.3, gap: 2.4, arch: true, rise: 0.65 }, ...(p.eave > 25 ? [{ y: 22.0, h: 2.6, w: 1.2, gap: 2.2, arch: true, rise: 0.6 }] : []),
    ];
    facade('S', p.v1, p.u0, p.u1, fl, 1.9);
    facade(s < 0 ? 'W' : 'E', s < 0 ? p.u0 : p.u1, p.v0 + 2, p.v1, storeys(p.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 2.0);
    facade(s < 0 ? 'E' : 'W', s < 0 ? p.u1 : p.u0, 31.2, p.v1, storeys(p.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 2.0);
  }

  // ==== arms and their north-end pavilions ============================================
  for (const s of [-1, 1]) {
    const a = s < 0 ? P.armW : P.armE, cu = (a.u0 + a.u1) / 2, vEnd = s < 0 ? 25 : 24;
    block(a.u0, a.u1, a.v0, a.v1, a.eave);
    gableRoof('roof', a.u0, a.u1, a.v0, vEnd, a.eave, a.ridge - a.eave, { along: 'z', over: 0.7 });
    const outer = s < 0 ? 'W' : 'E', inner = s < 0 ? 'E' : 'W', ou = s < 0 ? a.u0 : a.u1, iu = s < 0 ? a.u1 : a.u0;
    facade(outer, ou, s < 0 ? -12.9 : -12.9, a.v1 - 0.4, storeys(a.eave, { w: 1.7, h: 3.4, gap: 4.6 }), 1.8);
    if (s < 0) facade(inner, iu, -12.9, 2.0, storeys(a.eave, { w: 1.7, h: 3.4, gap: 4.6 }), 1.6);
    else facade(inner, iu, -19.3 + 1, -12.9, storeys(a.eave, { w: 1.7, h: 3.4, gap: 4.6 }), 1.0);
    const e = s < 0 ? P.endW : P.endE, ecu = (e.u0 + e.u1) / 2;
    if (s > 0) { block(e.u0, e.u1, -32.9, e.v1, e.eave); block(48.5, 56.1, e.v0, -32.9, e.eave, { belts: false }); }   // 817 projects to the north
    else block(e.u0, e.u1, e.v0, e.v1, e.eave);
    hipRoof('roof', e.u0, e.u1, e.v0, e.v1, e.eave, e.ridge - e.eave, { along: 'x', inset: s < 0 ? [9.6, 5] : [7, 7], over: 0.8 });
    facade('N', s > 0 ? -32.9 : e.v0, e.u0, e.u1, storeys(e.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 1.8);
    facade('W', e.u0, e.v0, e.v1, storeys(e.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 1.8);
    if (s > 0) facade('E', e.u1, e.v0, e.v1, storeys(e.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 1.8);
    else facade('E', e.u1, e.v0, -29, storeys(e.eave, { w: 1.7, h: 3.4, gap: 4.4 }), 1.8);
    // the tall ribbed stacks of the north gable ends
    if (s > 0) for (const x of [e.u0 + 1.6, e.u1 - 1.6]) stack(x, e.eave - 3, 40.5, -32.9 + 1.7, 3.0);
    else for (const x of [e.u0 + 1.6, e.u1 - 1.6]) stack(x, e.eave - 3, 40, e.v0 + 1.7, 3.0);
    // the round stair bays on the inner faces of the north-end pavilions (OSM 844 west, 29 m; 819 with roofs 815/816 east, 25 m)
    const bay = s < 0 ? { u: -41.5, v: -22.8, r: 4.5, h: 26, top: 29 } : { u: 40.4, v: -23.25, r: 4.35, h: 22, top: 25 };
    cyl('stone', bay.u, 0, bay.h, bay.v, bay.r, bay.r, near ? 16 : 8, ''); cyl('stoneDark', bay.u, 0, 1.3, bay.v, bay.r + 0.3, bay.r + 0.3, near ? 16 : 8, 't');
    cyl('trim', bay.u, bay.h - 0.8, bay.h, bay.v, bay.r + 0.45, bay.r + 0.45, near ? 16 : 8, 'b'); cone('roof', bay.u, bay.h, bay.top, bay.v, bay.r + 0.6, near ? 16 : 8);
    if (near) for (const phi of [-0.8, 0, 0.8]) for (const y of [4, 9, 14]) { const ang = (s < 0 ? E : W) + phi; win(bay.u + Math.sin(ang) * bay.r, y, bay.v + Math.cos(ang) * bay.r, 1.3, 3.3, ang, { frame: false }); }
    // entrance bay on the outer flank
    const eb = s < 0 ? { u0: -65.5, u1: -62.7, v0: 2.4, v1: 20.5 } : { u0: 62.7, u1: 65.8, v0: 2.7, v1: 19.9 };
    box('stone', eb.u0, eb.u1, 0, 22, eb.v0, eb.v1); course('trim', eb.u0, eb.u1, eb.v0, eb.v1, 21.1, 0.9, 0.35);
    const ebc = (eb.v0 + eb.v1) / 2;
    facade(s < 0 ? 'W' : 'E', s < 0 ? eb.u0 : eb.u1, eb.v0, eb.v1, [{ y: 9.4, h: 3.4, w: 1.6, gap: 4.2 }, { y: 14.5, h: 3.4, w: 1.6, gap: 4.2 }, { y: 18.4, h: 2.6, w: 1.4, gap: 4, arch: true, rise: 0.7 }], 1.8);
    // the flank entrance porch (Lieutenant Governor's and members' doors): a stone porch with a big arched door
    const pr = s < 0 ? P.porchW : P.porchE, outU = s < 0 ? pr.u0 : pr.u1, prc = (pr.v0 + pr.v1) / 2;
    box('stone', pr.u0, pr.u1, 0, 7.4, pr.v0, pr.v1); box('stoneDark', pr.u0 - 0.3, pr.u1 + 0.3, 0, 1.0, pr.v0 - 0.3, pr.v1 + 0.3);
    course('trim', pr.u0, pr.u1, pr.v0, pr.v1, 6.5, 0.9, 0.5);
    box('roof', pr.u0 + 0.3, pr.u1 - 0.3, 7.4, 7.6, pr.v0 + 0.3, pr.v1 - 0.3);
    archRing(outU, 0.6, prc, 5.6, 5.6, s < 0 ? W : E, { rim: 0.5, depth: 0.18, rise: 2.8 });
    put(onWall(new THREE.ShapeGeometry(k.archShape(5.6, 5.6, 2.8), near ? 10 : 5), outU + (s < 0 ? -0.04 : 0.04), 0.6, prc, s < 0 ? W : E), 'iron');
    facade(s < 0 ? 'N' : 'N', pr.v0, pr.u0, pr.u1, [{ y: 2.2, h: 3.2, w: 1.5, n: 2, arch: true, rise: 0.75 }], 2.2); facade('S', pr.v1, pr.u0, pr.u1, [{ y: 2.2, h: 3.2, w: 1.5, n: 2, arch: true, rise: 0.75 }], 2.2);
    void ecu;
  }

  // ==== rear of the central block ===============================================
  {
    const g = P.rearGable;
    block(g.u0, g.u1, g.v0, g.v1, g.eave, { belts: false });
    gableRoof('roof', g.u0, g.u1, g.v0, g.v1, g.eave, g.ridge - g.eave, { along: 'x', over: 0.6 });
    for (const py of [P.rearPyrE, P.rearPyrW]) {
      block(py.u0, py.u1, py.v0, py.v1, py.eave);
      hipRoof('roof', py.u0, py.u1, py.v0, py.v1, py.eave, py.peak - py.eave, { over: 0.8 });
      facade('N', py.v0, py.u0, py.u1, storeys(py.eave, { w: 1.6, h: 3.4, gap: 3.6 }), 1.6);
    }
    facade('W', P.rearPyrE.u0, P.rearPyrE.v0, 2.4, storeys(28, { w: 1.6, h: 3.4, gap: 3.6 }), 1.0);
    // the two tall round stacks with their little domes
    for (const s of P.stacks) {
      lathe('stone', s.u, 0, s.v, [[s.r + 0.5, 0], [s.r + 0.3, 8], [s.r + 0.1, s.h - 3], [s.r, s.h - 1.4]], near ? 16 : 8);
      cyl('trim', s.u, s.h - 1.4, s.h - 0.4, s.v, s.r + 0.45, s.r + 0.45, near ? 16 : 8, 'b');
      lathe('roof', s.u, s.h - 0.4, s.v, [[s.r + 0.45, 0], [s.r * 0.75, 0.9], [s.r * 0.35, 1.5], [0, 1.9]], near ? 16 : 8);
      for (const y of [14, 27, 40]) if (y < s.h - 2) cyl('trim', s.u, y, y + 0.5, s.v, s.r + 0.42, s.r + 0.42, near ? 16 : 8);
    }
  }

  // ==== spine and the 1909 north block ============================================
  {
    const sp = P.spine;
    block(sp.u0, sp.u1, sp.v0, sp.v1, sp.h, { belts: false, cornice: false }); flatRoof(sp.u0, sp.u1, sp.v0, sp.v1, sp.h, 0.5, 0.6);
    facade('E', sp.u1, sp.v0 + 2, sp.v1 - 6, storeys(sp.h, { w: 1.5, h: 3, gap: 5, arch: false }), 1.2);
    facade('W', sp.u0, sp.v0 + 2, sp.v1 - 6, storeys(sp.h, { w: 1.5, h: 3, gap: 5, arch: false }), 1.2);
    const nb = P.north, ns = P.northStub;
    block(nb.u0, nb.u1, nb.v0, nb.v1, nb.h, { cornice: false }); flatRoof(nb.u0, nb.u1, nb.v0, nb.v1, nb.h, 0.7, 0.9);
    course('trim', nb.u0, nb.u1, nb.v0, nb.v1, nb.h - 1.0, 1.0, 0.6);
    block(ns.u0, ns.u1, ns.v0, ns.v1, ns.h, { cornice: false }); flatRoof(ns.u0, ns.u1, ns.v0, ns.v1, ns.h, 0.7, 0.9);
    course('trim', ns.u0, ns.u1, ns.v0, ns.v1, ns.h - 1.0, 1.0, 0.6);
    const fl = storeys(nb.h, { w: 1.7, h: 3.4, gap: 4.6, arch: true });
    facade('S', ns.v1, ns.u0, sp.u0 - 0.2, fl, 1.7); facade('S', ns.v1, sp.u1 + 0.2, ns.u1, fl, 1.7);
    facade('E', ns.u1, ns.v0, ns.v1, fl, 1.7); facade('W', ns.u0, ns.v0, ns.v1, fl, 1.7);
    facade('E', nb.u1, nb.v0, -50, fl, 1.7); facade('E', nb.u1, -39, nb.v1, fl, 1.7);
    facade('W', nb.u0, nb.v0, -50, fl, 1.7); facade('W', nb.u0, -39, nb.v1, fl, 1.7);
    for (const bay of P.bays) {
      cyl('stone', bay.u, 0, bay.h, bay.v, bay.r, bay.r, near ? 16 : 8, ''); cyl('trim', bay.u, bay.h - 0.9, bay.h, bay.v, bay.r + 0.5, bay.r + 0.5, near ? 16 : 8);
      cyl('roof', bay.u, bay.h, bay.h + 0.15, bay.v, bay.r + 0.2, bay.r + 0.2, near ? 16 : 8, 't');
    }
    // north front: projecting centre bay, arched entrance flanked by lions, arcade, pediment
    const nz = nb.v0, cu = (nb.u0 + nb.u1) / 2 - 1.2;
    box('stone', cu - 7.2, cu + 7.2, 0, nb.h, nz - 1.4, nz); course('trim', cu - 7.2, cu + 7.2, nz - 1.4, nz, nb.h - 0.9, 0.9, 0.5);
    for (const y of [5.5, 10.6, 15.7]) course('trim', cu - 7.2, cu + 7.2, nz - 1.4, nz, y, 0.35, 0.2);
    for (const s of [-1, 1]) box('stone', cu + s * 8.2 - 1.4, cu + s * 8.2 + 1.4, 0, nb.h, nz - 0.5, nz);   // corner pilasters of the wings
    // entrance
    archRing(cu, 1.0, nz - 1.4, 5.2, 6.6, N, { rim: 0.8, depth: 0.5, rise: 2.6 });
    put(onWall(new THREE.ShapeGeometry(k.archShape(5.2, 6.6, 2.6), near ? 10 : 5), cu, 1.0, nz - 1.46, N), 'iron');
    for (const dx of [-3.7, 3.7]) box('stone', cu + dx - 0.7, cu + dx + 0.7, 1.4, 5.4, nz - 2.6, nz - 1.4);      // the lions' plinths
    box('trim', cu - 7.2, cu + 7.2, 8.6, 9.0, nz - 2.0, nz - 0.5);                                              // balcony
    if (near) for (let x = cu - 6.8; x <= cu + 6.81; x += 0.8) box('trim', x - 0.14, x + 0.14, 9.0, 10.0, nz - 1.95, nz - 1.65, 'du');
    for (const dx of [-4.6, 0, 4.6]) { archRing(cu + dx, 10.4, nz - 1.4, 3.6, 7.0, N, { rim: 0.55, depth: 0.4, rise: 1.8 }); win(cu + dx, 10.4, nz - 1.4, 3.6, 7.0, N, { arch: true, rise: 1.8, frame: false }); }
    // pediment over the centre with a five-arch blind arcade
    gableWall('trim', 'z', nz - 0.9, cu - 6.6, cu + 6.6, nb.h + 0.5, 4.0, 1.4, 0.3);
    if (near) for (const dx of [-4, -2, 0, 2, 4]) win(cu + dx, nb.h + 0.6, nz - 1.6, 1.1, 2.4 - Math.abs(dx) * 0.22, N, { arch: true, rise: 0.5, frame: false });
    // ground-floor windows either side of the entrance
    const flN = storeys(nb.h, { w: 1.7, h: 3.4, gap: 4.6, arch: true });
    facade('N', nz, nb.u0, cu - 9.7, flN, 1.7); facade('N', nz, cu + 9.7, nb.u1, flN, 1.7);
    void gableWall;
  }

  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift'); o.geometry.rotateY(P.angle); dropGroundFaces(o.geometry);
    o.geometry = mergeVertices(o.geometry, 1e-4); // flat faces share their corners: 4 vertices a quad, not 6
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
  });
  void ring;
  return root;
}
