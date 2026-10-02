import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ANNEX_ROWS, CORNICE_OUT, EAST_ANNEX, EAVE_OVER, FRONT_V, RING_BODY, ROOF_RUN, ROWS, Y } from './calgary-city-hall-plan.js';
import {
  edgeFrame, gableSlopes, gableWall, hipFrustum, offsetRing, openingFrame, openingPanel, prismRing, rectFrame, rectRing,
  wallBox,
} from './calgary-city-hall-solids.js';
import { buildTower } from './calgary-city-hall-tower.js';

// Calgary City Hall ("Old City Hall", William M. Dodd, 1911): an original procedural model. The plan is the mapped outline
// (OSM way 37829977); heights, roof pitches and window rhythm are read from photographs (docs/3d-calgary-calgary-city-hall.md).
// Authored in building axes (x = u along the north front, y up, z = v into the building, south), then rotated once by
// SPEC.rotationDeg onto the mapped walls.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const ROT = new THREE.Matrix4().makeRotationY(-THREE.MathUtils.degToRad(SPEC.rotationDeg));
  const put = (g, m) => { g.applyMatrix4(ROT); b.put(g, m, 0, 0); };
  const at = (M) => (g, m) => { g.applyMatrix4(M); put(g, m); };
  const box = (m, u0, u1, y0, y1, v0, v1, bottom = false) => {
    const g = new THREE.BoxGeometry(u1 - u0, y1 - y0, v1 - v0); g.translate((u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2);
    if (!bottom) { const n = g.attributes.normal, idx = g.index, keep = []; for (let i = 0; i < idx.count; i += 3) { if (n.getY(idx.getX(i)) < -0.5) continue; keep.push(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2)); } g.setIndex(keep); }
    put(g, m);
  };

  // ---- edges of the main walls -----------------------------------------------------------------------------------
  const n = RING_BODY.length;
  const edges = RING_BODY.map((A, i) => {
    const B = RING_BODY[(i + 1) % n], fr = edgeFrame(A, B), P = RING_BODY[(i + n - 1) % n], Q = RING_BODY[(i + 2) % n];
    const cross = (a, c, d) => (c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0]);
    return { ...fr, A, B, idx: i, inv: fr.M.clone().invert(), convexB: cross(A, B, Q) > 0, convexA: cross(P, A, B) > 0 };
  });
  const sOf = (e, u, v) => new THREE.Vector3(u, 0, v).applyMatrix4(e.inv).x;
  const centres = (L, margin = 1.8, pitch = 3.6) => { const k = Math.max(1, Math.round((L - 2 * margin) / pitch)), step = (L - 2 * margin) / k; return Array.from({ length: k }, (_, i) => margin + step * (i + 0.5)); };

  // ---- shared drawing helpers (also used by the tower) -----------------------------------------------------------------------
  /** Rock-faced coursing: flat strips standing 7 cm proud of the wall every 0.6 m (windows sit 12 cm proud, hiding what is behind).
   *  A `skip` entry is [s0, s1] or [s0, s1, yTop]: the stretch stays bare below yTop (it is buried against another mass). */
  const freeIntervals = (L, skip) => {
    let out = [[0.15, L - 0.15]];
    for (const [sa, sb] of skip) out = out.flatMap(([p, q]) => (sb <= p || sa >= q ? [[p, q]] : [[p, Math.min(q, sa)], [Math.max(p, sb), q]].filter(([x, y]) => y - x > 0.2)));
    return out;
  };
  const strips = (fr, y0, y1, { skip = [] } = {}) => {
    const c = at(fr.M), all = freeIntervals(fr.L, skip.filter((k) => k[2] === undefined)), part = skip.some((k) => k[2] !== undefined);
    for (let y = y0; y + 0.38 <= y1; y += 0.6) {
      const free = part ? freeIntervals(fr.L, skip.filter((k) => k[2] === undefined || y < k[2])) : all;
      for (const [sa, sb] of free) c(wallBox(sa, sb, y, y + 0.38, 0, 0.07, 'fu'), 'stone');
    }
  };
  /** Dressed corner quoins: alternating long and short blocks on one or both ends of a wall. */
  const quoins = (fr, y0, y1, { both = false, s0 = both, sL = both } = {}) => {
    const c = at(fr.M);
    for (const [on, end] of [[s0, 0], [sL, 1]]) {
      if (!on) continue;
      let k = 0;
      for (let y = y0; y + 0.5 <= y1; y += 0.58, k++) {
        const w = k % 2 ? 0.6 : 0.95;
        c(end === 0 ? wallBox(0, w, y, y + 0.5, 0, 0.14, 'fl') : wallBox(fr.L - w, fr.L, y, y + 0.5, 0, 0.14, 'fr'), 'trim');
      }
    }
  };
  const ctx = { near, put, at, strips, quoins };
  // Faces seen from the streets (7 Avenue on the north, Macleod Trail on the west) get full relief surrounds; the east, south
  // and rear walls face the Municipal Building and its parkade and get flat surrounds (one sheet instead of an extruded U).
  const STREET = new Set([0, 7, 9, 10, 11]);

  // ---- masses -------------------------------------------------------------------------------------------------------------------
  put(prismRing(RING_BODY, 0, Y.cornice), 'stone');
  put(prismRing(offsetRing(RING_BODY, 0.3), 0, Y.plinth), 'stone');
  put(prismRing(offsetRing(RING_BODY, CORNICE_OUT), Y.cornice - 0.4, Y.cornice + 0.4, { bottom: true }), 'trim');
  // The mapped east bump (a 2.6 x 9.5 m jog on the east wall) is drawn as a flat-roofed two-storey sandstone wing, the plain lower
  // block the 1910 photograph hints at (and OSM maps a 2-level link block on this side). No pitched roof: nothing supports one.
  const AN = EAST_ANNEX;
  box('stone', AN.u0, AN.u1, 0, AN.top - 0.4, AN.v0, AN.v1);
  put(prismRing(rectRing(AN.u0, AN.u1 + 0.3, AN.v0 - 0.3, AN.v1 + 0.3), 0, Y.plinth), 'stone');
  box('trim', AN.u0 + 0.2, AN.u1 + 0.3, AN.top - 0.6, AN.top, AN.v0 - 0.3, AN.v1 + 0.3); // cornice cap: the flat roof edge

  // ---- roofs ----------------------------------------------------------------------------------------------------------------------
  const ring0 = RING_BODY;
  const u0 = ring0[0][0] - EAVE_OVER, u1 = ring0[1][0] + EAVE_OVER, v0 = FRONT_V - EAVE_OVER, v1 = ring0[2][1] + EAVE_OVER;
  put(hipFrustum([u0, u1, v0, v1, Y.eave], [u0 + ROOF_RUN, u1 - ROOF_RUN, v0 + ROOF_RUN, v1 - ROOF_RUN, Y.plateau]), 'roof');
  put(hipFrustum([-7, 8, -5, 5, Y.plateau - 0.1], [-3.5, 4.5, -1.6, 1.6, Y.plateau + 1.3]), 'roof'); // the raised crown over the central hall, tiled like the roof (a dark glass patch read as a hole from above)

  // ---- gables and dormers ---------------------------------------------------------------------------------------------------
  const dormer = (e, sc, hw, rise, back, lights) => {
    const c = at(e.M), y0 = Y.eave, m = rise / hw, dl = 0.18, hwT = hw + dl / m, street = STREET.has(e.idx);
    c(gableWall(sc, hw, y0, rise, 0.6), 'stone');
    c(gableSlopes(sc, hwT, y0, rise + dl, -0.6, -back), 'roof');
    if (!near) return;
    for (const [off, w, h] of lights) {
      c(openingPanel(sc + off, y0 + 0.55, w, h, 0.1, 4), 'glass');
      c(street ? openingFrame(sc + off, y0 + 0.55, w, h, 0.14, 0.17, 4) : openingFrame(sc + off, y0 + 0.55, w, h, 0.14, 0.14, 4, { flat: true }), 'trim');
    }
    for (const side of [-1, 1]) { // round shoulder turrets with tile caps
      const g = new THREE.CylinderGeometry(0.22, 0.22, rise * 0.55, 6, 1, true); g.translate(sc + side * hw, y0 + rise * 0.275, -0.28); c(g, 'trim');
      const k = new THREE.ConeGeometry(0.3, 0.75, 6, 1, true); k.translate(sc + side * hw, y0 + rise * 0.55 + 0.37, -0.28); c(k, 'roof');
    }
  };
  const small = [[-0.5, 0.6, 1.3], [0.5, 0.6, 1.3]];
  const wide = [[0, 0.8, 2.0], [-1.05, 0.65, 1.4], [1.05, 0.65, 1.4]];
  const D = (ei, u, v) => dormer(edges[ei], sOf(edges[ei], u, v), 2.0, 3.6, 4.5, small);
  dormer(edges[0], sOf(edges[0], 14.75, FRONT_V), 2.7, 4.7, 5.5, wide);
  D(0, -11.3, FRONT_V); D(0, 6.1, FRONT_V);
  for (const v of [-9, 0, 9]) D(1, 18.45, v);
  D(2, 14.5, 13.8); D(2, 6.5, 13.8); D(6, -13.4, 13.8); D(7, -17.9, 8.2); D(11, -17.9, -8.3);
  dormer(edges[9], 2.75, 2.75, 3.3, 8.8, [[0, 0.9, 1.9]]); // the west bay's gable
  dormer(edges[4], 5.9, 5.9, 4.4, 7.2, wide.map(([o, w, h]) => [o * 1.9, w * 1.1, h]));
  // two small cupolas on the roof
  const cupola = (u, v, base) => {
    box('trim', u - 0.62, u + 0.62, base - 1.2, base + 0.85, v - 0.62, v + 0.62);
    const g = new THREE.ConeGeometry(0.95, 1.5, 4, 1, true); g.rotateY(Math.PI / 4); g.translate(u, base + 0.85 + 0.75, v); put(g, 'roof');
  };
  cupola(-12.7, -8.6, Y.plateau);
  cupola(14.75, -10.9, Y.eave + 4.7 + 0.18);

  // ---- facades ------------------------------------------------------------------------------------------------------------------
  const frontSkip = [[18.45 - 3.8 + 0.1, 18.45 + 9.0 - 0.1]]; // s range of the tower base on the front wall
  const annexSkip = [[13.8 - 5.3 - 0.8, 13.8 + 4.2 + 0.8]];
  edges.forEach((e, i) => {
    if (e.L < 1.5) return;
    const c = at(e.M), front = i === 0, east = i === 1, street = STREET.has(i);
    // coursing and quoins
    if (near) {
      strips(e, 1.95, 11.1, { skip: front ? [[14.65, 27.45]] : east ? [[13.8 - (AN.v1 + 0.3), 13.8 - (AN.v0 - 0.3), AN.top]] : [] });
      quoins(e, 1.7, 11.3, { s0: e.convexB && (street || STREET.has((i + 1) % n)), sL: e.convexA && (street || STREET.has((i + n - 1) % n)) }); // only corners a street can see
    }
    // corbel table and string course
    if (near && e.L > 2.2) {
      const k = Math.max(2, Math.round((e.L - 0.8) / 0.95)), step = (e.L - 0.8) / k;
      for (let j = 0; j <= k; j++) { const s = 0.4 + j * step; if (front && s > 14.0 && s < 28.1) continue; c(wallBox(s - 0.2, s + 0.2, 11.45, 12.0, 0, 0.55, street ? 'fdlr' : 'fd'), 'trim'); }
    }
    if (!front && e.L > 2.2) c(wallBox(0, e.L, 6.8, 7.1, 0, 0.2, near ? 'fud' : 'f'), 'trim');
    // windows
    let list;
    if (front) list = [-15.3, -11.6, 7.45, 11.1, 14.75].map((u) => 18.45 - u);
    else list = e.L > 4 ? centres(e.L) : [];
    if (east) list = list.filter((s) => s < annexSkip[0][0] || s > annexSkip[0][1]);
    for (const s of list) {
      const rows = ['first', 'second'];
      if (!front && near) { c(new THREE.PlaneGeometry(ROWS.basement.w, ROWS.basement.h).translate(s, ROWS.basement.y + ROWS.basement.h / 2, 0.36), 'glass'); }
      for (const row of rows) {
        const r = ROWS[row], arch = row === 'second';
        if (!near) { c(arch ? openingPanel(s, r.y, r.w, r.h, 0.1, 2) : new THREE.PlaneGeometry(r.w, r.h).translate(s, r.y + r.h / 2, 0.1), 'glass'); continue; }
        c(arch ? openingPanel(s, r.y, r.w, r.h, 0.12, 6) : new THREE.PlaneGeometry(r.w, r.h).translate(s, r.y + r.h / 2, 0.12), 'glass');
        if (!street) { // flat surround and a two-face sill
          c(arch ? openingFrame(s, r.y, r.w, r.h, 0.3, 0.16, 6, { flat: true }) : rectFrame(s, r.y, r.w, r.h, 0.25, 0.16, { flat: true }), 'trim');
          c(wallBox(s - r.w / 2 - 0.35, s + r.w / 2 + 0.35, r.y - 0.25, r.y, 0, 0.36, 'fu'), 'trim');
          continue;
        }
        c(arch ? openingFrame(s, r.y, r.w, r.h, 0.3, 0.3, 6) : rectFrame(s, r.y, r.w, r.h, 0.25, 0.3), 'trim');
        c(wallBox(s - r.w / 2 - 0.35, s + r.w / 2 + 0.35, r.y - 0.25, r.y, 0, 0.36, 'fudlr'), 'trim');
        c(wallBox(s - 0.04, s + 0.04, r.y, arch ? r.y + r.h - r.w / 2 : r.y + r.h, 0.13, 0.2, 'flr'), 'trim');
      }
    }
  });
  // annex east face: two storeys of plain rectangular windows (flat surrounds, it faces the Municipal Building)
  { const e = edgeFrame([AN.u1, AN.v0], [AN.u1, AN.v1]), c = at(e.M);
    if (near) strips(e, 1.95, AN.top - 0.7);
    for (const s of centres(e.L, 1.4, 3.2)) {
      for (const [y, h] of ANNEX_ROWS) {
        c(new THREE.PlaneGeometry(1.3, h).translate(s, y + h / 2, near ? 0.12 : 0.1), 'glass');
        if (near) c(rectFrame(s, y, 1.3, h, 0.25, 0.16, { flat: true }), 'trim');
      }
    }
  }

  // ---- first-floor balcony over the veranda, on both wings of the front ---------------------------------------------------------
  { const e = edges[0], c = at(e.M);
    for (const [sa, sb] of [[0, 14.65 + 0.4], [27.45 - 0.4, e.L]]) {
      if (!near) { c(wallBox(sa, sb, Y.balcony - 0.3, 7.9, 0, 0.85, 'fudlr'), 'trim'); continue; }
      c(wallBox(sa, sb, Y.balcony - 0.3, Y.balcony, 0, 0.85, 'fudlr'), 'trim'); // slab
      c(wallBox(sa, sb, Y.balcony, Y.balcony + 0.16, 0.55, 0.8, 'fudlr'), 'trim'); // base rail
      c(wallBox(sa, sb, 7.72, 7.9, 0.5, 0.85, 'fudlr'), 'trim'); // handrail
      const k = Math.round((sb - sa) / 0.34);
      for (let j = 0; j <= k; j++) { const s = sa + 0.12 + j * ((sb - sa - 0.24) / k); c(wallBox(s - 0.055, s + 0.055, Y.balcony + 0.16, 7.72, 0.62, 0.73, 'f'), 'trim'); }
    }
  }

  buildTower(ctx);
  return b.finish();
}
