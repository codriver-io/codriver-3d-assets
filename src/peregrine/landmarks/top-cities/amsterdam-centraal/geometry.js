import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  ROTATION, toWorld, H, PLAN, GABLES, SHEDS, shedRise,
} from './amsterdam-centraal-site.js';

const wp = (u, y, v) => { const [x, z] = toWorld(u, v); return [x, y, z]; };

/**
 * Amsterdam Centraal. Authored in the facade frame (u along the platforms, v toward the
 * city, y up) and rotated once onto east / up / south. Masses are inset from the mapped
 * rings; trims sit 0.12–0.2 m off the face they dress so nothing shares a plane.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const box = (mat, u0, u1, y0, y1, v0, v1) => {
    if (u1 - u0 < 0.02 || y1 - y0 < 0.02 || v1 - v0 < 0.02) return;
    const [x, z] = toWorld((u0 + u1) / 2, (v0 + v1) / 2);
    b.box(mat, [x, (y0 + y1) / 2, z], [u1 - u0, y1 - y0, v1 - v0], ROTATION);
  };
  function put(mat, positions, indices) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    b.put(g, mat);
  }
  // One triangle, CCW as seen from outside. Corners are [u, y, v].
  const tri = (mat, a, c, d) => put(mat, [...wp(...a), ...wp(...c), ...wp(...d)], [0, 1, 2]);
  // One quad, CCW as seen from outside.
  const quad = (mat, a, c, d, e) => put(mat, [...wp(...a), ...wp(...c), ...wp(...d), ...wp(...e)], [0, 1, 2, 0, 2, 3]);

  // Polygon in the (u, y) plane, CCW when seen from the city (+v), extruded from vInner to vOuter.
  function extrudeV(mat, poly, vOuter, vInner) {
    const n = poly.length, pos = [], id = [], add = (u, y, v) => { pos.push(...wp(u, y, v)); return pos.length / 3 - 1; };
    const outer = poly.map(([u, y]) => add(u, y, vOuter));
    const inner = poly.map(([u, y]) => add(u, y, vInner));
    for (let i = 1; i < n - 1; i++) id.push(outer[0], outer[i], outer[i + 1]);
    for (let i = 1; i < n - 1; i++) id.push(inner[0], inner[i + 1], inner[i]);
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      id.push(outer[i], outer[j], inner[j], outer[i], inner[j], inner[i]);
    }
    put(mat, pos, id);
  }

  // A gable roof: ridge along u at (vRidge, yRidge), eaves at yEave on vFront and vBack.
  // End triangles close the two u ends. Slopes face up.
  function gableRoof(mat, u0, u1, vFront, vBack, yEave, yRidge, closeMat) {
    const vR = (vFront + vBack) / 2;
    // City slope faces up and toward +v; track slope faces up and toward −v.
    quad(mat, [u0, yEave, vFront], [u1, yEave, vFront], [u1, yRidge, vR], [u0, yRidge, vR]);
    quad(mat, [u1, yEave, vBack], [u0, yEave, vBack], [u0, yRidge, vR], [u1, yRidge, vR]);
    if (closeMat) {
      tri(closeMat, [u0, yEave, vBack], [u0, yEave, vFront], [u0, yRidge, vR]);
      tri(closeMat, [u1, yEave, vFront], [u1, yEave, vBack], [u1, yRidge, vR]);
    }
  }

  // Square pyramid, open underneath (it sits in a cornice). Apex above the centre.
  function pyramid(mat, u0, u1, v0, v1, yBase, yApex) {
    const ap = [(u0 + u1) / 2, yApex, (v0 + v1) / 2];
    const c = [[u0, yBase, v0], [u1, yBase, v0], [u1, yBase, v1], [u0, yBase, v1]];
    // Walk the base clockwise so each face's normal points up and out.
    for (let i = 0; i < 4; i++) tri(mat, c[(i + 1) % 4], c[i], ap);
  }

  // Slate skirt between two squares. `inset` shrinks the top toward the centre.
  // Same corner order as pyramid(), so each face points up and out.
  function frustum(mat, u0, u1, v0, v1, inset, y0, y1) {
    const o = [[u0, y0, v0], [u1, y0, v0], [u1, y0, v1], [u0, y0, v1]];
    const inn = [[u0 + inset, y1, v0 + inset], [u1 - inset, y1, v0 + inset], [u1 - inset, y1, v1 - inset], [u0 + inset, y1, v1 - inset]];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      quad(mat, o[j], o[i], inn[i], inn[j]);
    }
  }

  // Semicircular train-shed shell. Outer skin, inner skin, end rims, and iron ribs proud of the glass.
  function shed(spec, segs, ribEvery) {
    const { u0, u1, v0, v1 } = spec;
    const rise = shedRise(spec), span = v1 - v0, R = rise, cv = (v0 + v1) / 2, cy = H.spring;
    const thick = 0.42, ribOut = 0.22;
    const profile = (t, inset) => {
      const ang = Math.PI * (1 - t); // π at v0 → 0 at v1, so the crown is t = 0.5
      const v = cv + R * Math.cos(ang), y = cy + R * Math.sin(ang);
      const nx = Math.cos(ang), ny = Math.sin(ang);
      return [v - nx * inset, Math.max(0.08, y - ny * inset)];
    };
    const N = segs, pos = [], id = [];
    const add = (u, v, y) => { pos.push(...wp(u, y, v)); return pos.length / 3 - 1; };
    // Station the shell every ~24 m (far: ~48 m). Ribs are a separate strip.
    const step = near ? 24 : 48;
    const stations = [];
    for (let u = u0; u < u1 - 1; u += step) stations.push(u);
    stations.push(u1);
    const skin = (inset, flip) => {
      const base = pos.length / 3;
      for (let s = 0; s < stations.length; s++) {
        for (let i = 0; i <= N; i++) {
          const [v, y] = profile(i / N, inset);
          add(stations[s], v, y);
        }
      }
      const row = N + 1;
      for (let s = 0; s < stations.length - 1; s++) {
        for (let i = 0; i < N; i++) {
          const a = base + s * row + i, c = a + 1, d = a + row, e = d + 1;
          if (flip) id.push(a, d, c, c, d, e);
          else id.push(a, c, d, c, e, d);
        }
      }
    };
    skin(0, false);
    skin(thick, true);
    // End rims, so the arch reads as a thin shell rather than a paper edge.
    for (const u of [u0, u1]) {
      const outer = [], inner = [];
      for (let i = 0; i <= N; i++) {
        const [vo, yo] = profile(i / N, 0), [vi, yi] = profile(i / N, thick);
        outer.push(add(u, vo, yo)); inner.push(add(u, vi, yi));
      }
      const west = u === u0;
      for (let i = 0; i < N; i++) {
        if (west) id.push(outer[i], inner[i], outer[i + 1], outer[i + 1], inner[i], inner[i + 1]);
        else id.push(outer[i], outer[i + 1], inner[i], outer[i + 1], inner[i + 1], inner[i]);
      }
    }
    put('glass', pos, id);
    // Ribs: a band proud of the outer skin, every ribEvery metres, including both ends.
    const ribs = [], rid = [];
    const radd = (u, v, y) => { ribs.push(...wp(u, y, v)); return ribs.length / 3 - 1; };
    for (let u = u0; u <= u1 + 0.01; u += ribEvery) {
      const uu = Math.min(u, u1);
      const half = uu === u0 || uu === u1 ? 0.28 : 0.34;
      const a0 = [], a1 = [];
      for (let i = 0; i <= N; i++) {
        const [v, y] = profile(i / N, -ribOut);
        a0.push(radd(uu - half, v, y)); a1.push(radd(uu + half, v, y));
      }
      for (let i = 0; i < N; i++) rid.push(a0[i], a0[i + 1], a1[i], a1[i], a0[i + 1], a1[i + 1]);
      // Inward face on its own vertices, so the truss reads from the platform and the normals stay consistent.
      const b0 = [], b1 = [];
      for (let i = 0; i <= N; i++) {
        const [v, y] = profile(i / N, -ribOut);
        b0.push(radd(uu - half, v, y)); b1.push(radd(uu + half, v, y));
      }
      for (let i = 0; i < N; i++) rid.push(b0[i], b1[i], b0[i + 1], b1[i], b1[i + 1], b0[i + 1]);
    }
    put('iron', ribs, rid);
    // A low sill under each foot, so the arch meets grade on a rail rather than a knife edge.
    box('iron', u0, u1, 0, H.spring + 0.45, v0 - 0.28, v0 + 0.45);
    box('iron', u0, u1, 0, H.spring + 0.45, v1 - 0.45, v1 + 0.28);
  }

  // --- Headhouse wing (the long brick block, ridge 23.3 m) ----------------------
  const wing = PLAN.wing;
  box('brick', wing.u0, wing.u1, 2.85, H.wingEave, wing.v0, wing.v1);
  box('stone', wing.u0, wing.u1, 0, 3.05, wing.v0, wing.v1 + 0.1);
  // City face: window bands in the brick, stone courses proud of them, mullions only up close.
  const face = wing.v1;
  const winV0 = face + 0.16, winV1 = face + 0.28;
  const bandV0 = face + 0.36, bandV1 = face + 0.54;
  const rows = [[3.45, 6.35], [7.35, 10.7], [11.7, 15.35]];
  const bands = [[6.5, 7.15], [10.85, 11.5], [15.5, 16.15], [17.05, H.wingEave + 0.08]];
  // Punched windows between stone string courses. Far keeps every other bay.
  for (const [u0, u1] of [[wing.u0 + 0.5, -19.4], [26.6, wing.u1 - 0.5]]) {
    for (const [y0, y1] of bands) box('stone', u0 - 0.15, u1 + 0.15, y0, y1, bandV0, bandV1);
    const pitch = near ? 4.5 : 9.0;
    for (let u = u0 + pitch * 0.5; u < u1 - 0.7; u += pitch) {
      for (const [y0, y1] of rows) {
        box('glow', u - 0.72, u + 0.72, y0, y1, winV0, winV1);
        if (near) box('stone', u - 0.06, u + 0.06, y0 + 0.08, y1 - 0.08, winV1 + 0.06, winV1 + 0.18);
      }
    }
  }
  // Track-side wall, a quieter echo of the same courses (the sheds hide the lower part).
  for (const [y0, y1] of [[8.2, 11.2], [12.6, 15.4]]) box('glow', wing.u0 + 1, wing.u1 - 1, y0, y1, wing.v0 - 0.16, wing.v0 - 0.06);
  gableRoof('slate', wing.u0 + 0.15, -11.55, face - 0.15, wing.v0 + 0.2, H.wingEave - 0.25, H.wingRidge, 'brick');
  gableRoof('slate', 18.85, wing.u1 - 0.15, face - 0.15, wing.v0 + 0.2, H.wingEave - 0.25, H.wingRidge, 'brick');

  // Cross-gables on the city facade. The triangle starts inside the wall so its base is not
  // a second lid on the cornice; the slate slopes fall back into the main roof.
  for (const g of GABLES) {
    const mid = (g.u0 + g.u1) / 2, y0 = H.wingEave - 0.35, vF = face + 0.62, depth = g.mapped ? 3.7 : 2.8;
    extrudeV('brick', [[g.u0, y0], [g.u1, y0], [mid, g.peak]], vF, vF - 0.55);
    if (g.mapped) {
      quad('stone', [g.u0 - 0.12, y0 + 0.1, vF + 0.08], [mid, g.peak + 0.18, vF + 0.08], [mid, g.peak - 0.55, vF - 0.2], [g.u0 + 0.35, y0 + 0.45, vF - 0.2]);
      quad('stone', [g.u1 + 0.12, y0 + 0.1, vF + 0.08], [g.u1 - 0.35, y0 + 0.45, vF - 0.2], [mid, g.peak - 0.55, vF - 0.2], [mid, g.peak + 0.18, vF + 0.08]);
    }
    quad('slate', [g.u0 + 0.2, y0 + 0.15, vF - 0.2], [mid, g.peak - 0.15, vF - 0.15], [mid, y0 + 1.3, vF - depth], [g.u0 + 0.45, y0 + 0.05, vF - depth]);
    quad('slate', [g.u1 - 0.2, y0 + 0.15, vF - 0.2], [g.u1 - 0.45, y0 + 0.05, vF - depth], [mid, y0 + 1.3, vF - depth], [mid, g.peak - 0.15, vF - 0.15]);
    const wy0 = g.mapped ? g.peak - 4.3 : g.peak - 2.6, wy1 = wy0 + (g.mapped ? 2.1 : 1.35);
    box('glow', mid - 0.55, mid + 0.55, wy0, wy1, vF + 0.02, vF + 0.14);
  }

  // --- Clock towers -----------------------------------------------------------
  const tower = (t) => {
    const { u0, u1, v0, v1 } = t;
    const um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
    box('brick', u0, u1, 3.15, H.towerEave - 0.15, v0, v1);
    box('stone', u0 - 0.08, u1 + 0.08, 0, 3.35, v0 - 0.08, v1 + 0.08);
    if (near) {
      for (const [uu0, uu1] of [[u0 - 0.1, u0 + 0.38], [u1 - 0.38, u1 + 0.1]]) {
        box('stone', uu0, uu1, 3.2, 18.2, v1 - 0.05, v1 + 0.16);
      }
    }
    box('stone', u0 - 0.18, u1 + 0.18, H.towerEave - 0.55, H.towerEave + 0.18, v0 - 0.12, v1 + 0.18);
    box('glow', um - 1.15, um + 1.15, 8.4, 12.2, v1 + 0.06, v1 + 0.18);
    box('glow', um - 1.05, um + 1.05, 14.2, 17.55, v1 + 0.06, v1 + 0.18);
    // Narrow stone band around the dial. The brick shaft shows inside and outside it.
    const inn = 1.56, out = 2.08;
    box('stone', um - out, um - inn, 22.15 - out, 22.15 + out, v1 + 0.1, v1 + 0.3);
    box('stone', um + inn, um + out, 22.15 - out, 22.15 + out, v1 + 0.1, v1 + 0.3);
    box('stone', um - inn, um + inn, 22.15 + inn, 22.15 + out, v1 + 0.1, v1 + 0.3);
    box('stone', um - inn, um + inn, 22.15 - out, 22.15 - inn, v1 + 0.1, v1 + 0.3);
    const frame = (uf0, uf1) => {
      const s0 = vm - 1.15, s1 = vm + 1.15, yb = 19.35, yt = 24.7, t = 0.26;
      box('stone', uf0, uf1, yb, yt, s0, s0 + t);
      box('stone', uf0, uf1, yb, yt, s1 - t, s1);
      box('stone', uf0, uf1, yb, yb + t, s0 + t, s1 - t);
      box('stone', uf0, uf1, yt - t, yt, s0 + t, s1 - t);
    };
    if (u0 < 0) frame(u0 - 0.26, u0 - 0.08);
    else frame(u1 + 0.08, u1 + 0.26);
    clock(um, 22.15, v1 + 0.48, 1.42);
    // Corner pinnacles on the cornice. The slate skirt starts inboard of them.
    const pin = near ? 2.85 : 2.05;
    for (const [uu, vv] of [[u0 + 0.05, v0 + 0.05], [u1 - 0.05, v0 + 0.05], [u1 - 0.05, v1 - 0.05], [u0 + 0.05, v1 - 0.05]]) {
      box('stone', uu - 0.16, uu + 0.16, H.towerEave + 0.22, H.towerEave + pin, vv - 0.16, vv + 0.16);
      pyramid('slate', uu - 0.2, uu + 0.2, vv - 0.2, vv + 0.2, H.towerEave + pin - 0.08, H.towerEave + pin + 0.72);
    }
    // Tiered spire: lower slate skirt, a stone lantern, then the upper slate spire.
    const skirt = 1.15;
    const su0 = u0 + 0.58, su1 = u1 - 0.58, sv0 = v0 + 0.5, sv1 = v1 - 0.5;
    frustum('slate', su0, su1, sv0, sv1, skirt, H.towerEave + 0.32, 29.4);
    const lu0 = su0 + skirt, lu1 = su1 - skirt, lv0 = sv0 + skirt, lv1 = sv1 - skirt;
    box('stone', lu0, lu1, 29.48, 31.2, lv0, lv1);
    box('glow', um - 0.4, um + 0.4, 29.78, 30.88, lv1 + 0.06, lv1 + 0.2);
    if (near) {
      box('glow', lu0 - 0.16, lu0 - 0.04, 29.82, 30.82, vm - 0.38, vm + 0.38);
      box('glow', lu1 + 0.04, lu1 + 0.16, 29.82, 30.82, vm - 0.38, vm + 0.38);
    }
    pyramid('slate', lu0 + 0.12, lu1 - 0.12, lv0 + 0.12, lv1 - 0.12, 31.1, H.tower);
    // Articulated finial. Both LODs end on the same iron point at H.finial.
    box('stone', um - 0.3, um + 0.3, H.tower - 0.06, H.tower + 0.42, vm - 0.3, vm + 0.3);
    const bulb = new THREE.OctahedronGeometry(near ? 0.52 : 0.44, 0);
    bulb.translate(...wp(um, H.tower + 1.12, vm));
    bulb.computeVertexNormals();
    b.put(bulb, 'iron');
    box('iron', um - 0.08, um + 0.08, H.tower + 0.48, H.finial - 0.5, vm - 0.08, vm + 0.08);
    const ball = new THREE.OctahedronGeometry(0.26, 0);
    ball.translate(...wp(um, H.finial - 0.26, vm));
    ball.computeVertexNormals();
    b.put(ball, 'iron');
  };

  // Clock: iron rim, pale face, two hands. Faces the city (+v).
  function clock(u, y, vFace, r) {
    const segs = near ? 14 : 8;
    const faceDisc = new THREE.CylinderGeometry(r, r, 0.12, segs);
    const rim = new THREE.CylinderGeometry(r + 0.22, r + 0.22, 0.1, segs);
    const axis = new THREE.Vector3(...wp(0, 0, 1)).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
    for (const [g, mat, v] of [[rim, 'iron', vFace - 0.08], [faceDisc, 'lamp', vFace]]) {
      g.applyQuaternion(q);
      g.translate(...wp(u, y, v));
      g.computeVertexNormals();
      b.put(g, mat);
    }
    if (near) {
      box('iron', u - 0.045, u + 0.045, y - 0.15, y + r * 0.72, vFace + 0.02, vFace + 0.1);
      box('iron', u - r * 0.55, u + 0.12, y - 0.04, y + 0.05, vFace + 0.02, vFace + 0.1);
    }
  }

  tower(PLAN.westTower);
  tower(PLAN.eastTower);

  // --- Central pavilion -------------------------------------------------------
  // The three glazed arches are the upper storey, not the doors. The ground floor is a
  // stone porch of rectangular bays. The gable is one steep triangle with a stone outline
  // and a slender pinnacle, roofed in slate behind it.
  const c = PLAN.center, cx = (c.u0 + c.u1) / 2;
  const vPorch = c.v1 + 0.72;
  box('brick', c.u0, c.u1, 0.2, 20.95, c.v0, c.v1 - 0.15);
  box('stone', c.u0 - 0.08, c.u1 + 0.08, 0, 7.35, c.v1 + 0.06, vPorch);
  const bayU = near
    ? [cx - 11.2, cx - 7.5, cx - 3.75, cx, cx + 3.75, cx + 7.5, cx + 11.2]
    : [cx - 7.5, cx, cx + 7.5];
  const halfB = near ? 1.15 : 1.7;
  for (const u of bayU) box('glow', u - halfB, u + halfB, 1.28, 5.42, vPorch + 0.06, vPorch + 0.2);
  // Lit band over the doors, where the "Amsterdam Centraal" sign is. No letter strokes.
  box('lamp', cx - 7.4, cx + 7.4, 5.95, 6.78, vPorch + 0.14, vPorch + 0.36);

  const archU = [cx - 8.35, cx, cx + 8.35];
  const halfW = 2.95, yA0 = 8.15, ySpring = 16.15;
  const pier = (a, d) => {
    if (d - a <= 0.25) return;
    const y1 = ySpring + halfW + 0.45;
    const band = Math.min(0.38, (d - a) * 0.28);
    box('brick', a + 0.02, d - 0.02, yA0 - 0.12, y1 - 0.08, c.v1 - 0.02, c.v1 + 0.26);
    box('stone', a, a + band, yA0 - 0.15, y1, c.v1 + 0.08, c.v1 + 0.42);
    box('stone', d - band, d, yA0 - 0.15, y1, c.v1 + 0.08, c.v1 + 0.42);
  };
  pier(c.u0 - 0.06, archU[0] - halfW - 0.28);
  pier(archU[0] + halfW + 0.28, archU[1] - halfW - 0.28);
  pier(archU[1] + halfW + 0.28, archU[2] - halfW - 0.28);
  pier(archU[2] + halfW + 0.28, c.u1 + 0.06);
  box('brick', c.u0, c.u1, 19.85, 21.15, c.v1 - 0.2, c.v1 + 0.08);
  for (const u of archU) tallArch(u, c.v1 + 0.58, halfW, yA0, ySpring);

  // Steep triangular gable. Slate ridge sits just behind the face so a plan ray at v=0.7
  // still finds the mapped 29.25 m peak.
  const yG0 = 21.25, halfG = 6.35, vG = 1.22;
  extrudeV('brick', [[cx - halfG, yG0], [cx + halfG, yG0], [cx, H.center]], vG, 0.88);
  gableOutline(cx, halfG, yG0, H.center, vG + 0.16);
  centerRoof(cx, halfG + 0.3, 0.7, c.v0 + 0.8, yG0 + 0.1, H.center - 0.05, H.centerWall + 0.1);
  box('stone', cx - halfG - 0.15, cx + halfG + 0.15, yG0 - 0.08, yG0 + 0.38, vG + 0.04, vG + 0.24);
  box('stone', cx - halfG - 0.2, cx - halfG + 0.7, yG0 + 0.2, yG0 + 1.7, vG + 0.08, vG + 0.36);
  box('stone', cx + halfG - 0.7, cx + halfG + 0.2, yG0 + 0.2, yG0 + 1.7, vG + 0.08, vG + 0.36);
  clock(cx, 24.35, vG + 0.32, 1.55);
  box('stone', cx - 0.22, cx + 0.22, H.center - 0.12, H.center + 1.05, vG - 0.2, vG + 0.18);
  const needle = new THREE.OctahedronGeometry(0.28, 0);
  needle.translate(...wp(cx, H.center + 1.4, vG - 0.02));
  needle.computeVertexNormals();
  b.put(needle, 'iron');
  box('iron', cx - 0.08, cx + 0.08, H.center + 1.58, 33.45, vG - 0.1, vG + 0.06);

  // Tall round-headed window. Glass faces the city; the stone archivolt is proud of it.
  function tallArch(u, vOuter, r, y0, ySpring) {
    const segs = near ? 8 : 5;
    const glass = [], gid = [];
    const gadd = (uu, y, v) => { glass.push(...wp(uu, y, v)); return glass.length / 3 - 1; };
    const gOuter = [];
    gOuter.push(gadd(u - r, y0, vOuter - 0.46));
    for (let i = 0; i <= segs; i++) {
      const a = Math.PI - (Math.PI * i) / segs;
      gOuter.push(gadd(u + r * Math.cos(a), ySpring + r * Math.sin(a), vOuter - 0.46));
    }
    gOuter.push(gadd(u + r, y0, vOuter - 0.46));
    for (let i = 1; i < gOuter.length - 1; i++) gid.push(gOuter[0], gOuter[i + 1], gOuter[i]);
    // Same dark glazing as the wing windows. The shed vaults stay on `glass`.
    put('glow', glass, gid);
    // One mullion and two transoms, both LODs. Clear of the ray the test sends through the pane.
    box('stone', u - 0.07, u + 0.07, y0 + 0.08, ySpring + r * 0.32, vOuter - 0.32, vOuter - 0.1);
    for (const t of [0.34, 0.67]) {
      const y = y0 + (ySpring - y0) * t;
      box('stone', u - r + 0.15, u + r - 0.15, y - 0.06, y + 0.06, vOuter - 0.32, vOuter - 0.1);
    }
    const ring = [], rid = [];
    const radd = (uu, y, v) => { ring.push(...wp(uu, y, v)); return ring.length / 3 - 1; };
    const path = (rad) => {
      const pts = [radd(u - rad, y0, vOuter + 0.1)];
      for (let i = 0; i <= segs; i++) {
        const a = Math.PI - (Math.PI * i) / segs;
        pts.push(radd(u + rad * Math.cos(a), ySpring + rad * Math.sin(a), vOuter + 0.1));
      }
      pts.push(radd(u + rad, y0, vOuter + 0.1));
      return pts;
    };
    const outerP = path(r + 0.4), innerP = path(r);
    for (let i = 0; i < outerP.length - 1; i++) {
      rid.push(outerP[i], innerP[i], outerP[i + 1], outerP[i + 1], innerP[i], innerP[i + 1]);
    }
    put('stone', ring, rid);
  }

  // Pale chevron. Order is CCW with +u to the right and +y up, which is the city-facing side.
  function gableOutline(cu, half, y0, y1, v) {
    quad('stone',
      [cu - half - 0.5, y0 - 0.06, v],
      [cu - half + 0.62, y0 + 0.4, v],
      [cu - 0.18, y1 - 0.5, v],
      [cu - 0.62, y1 + 0.22, v]);
    quad('stone',
      [cu + half - 0.62, y0 + 0.4, v],
      [cu + half + 0.5, y0 - 0.06, v],
      [cu + 0.62, y1 + 0.22, v],
      [cu + 0.18, y1 - 0.5, v]);
  }

  // Gable roof whose ridge runs toward the platforms and drops to the wing-ridge line.
  function centerRoof(cu, half, vFront, vBack, yEave, yRidgeFront, yRidgeBack) {
    quad('slate',
      [cu - half, yEave, vFront],
      [cu, yRidgeFront, vFront],
      [cu, yRidgeBack, vBack],
      [cu - half, yEave, vBack]);
    quad('slate',
      [cu + half, yEave, vFront],
      [cu + half, yEave, vBack],
      [cu, yRidgeBack, vBack],
      [cu, yRidgeFront, vFront]);
    tri('brick', [cu - half, yEave, vBack], [cu, yRidgeBack, vBack], [cu + half, yEave, vBack]);
  }

  // --- West gambrel wing, Koningspaviljoen, De Oost ---------------------------
  // `outward > 0` faces −u (the west). Proved by a ray from the west, which missed the reversed winding.
  const gambrelEnd = (u, v0, v1, vRidge, yBreak, outward) => {
    const p = [[v1, 7.7], [vRidge + 3.1, yBreak], [vRidge, H.west], [vRidge - 3.1, yBreak], [v0, 7.7]];
    for (let i = 1; i < p.length - 1; i++) {
      const a = [u, p[0][1], p[0][0]], c = [u, p[i][1], p[i][0]], d = [u, p[i + 1][1], p[i + 1][0]];
      if (outward > 0) tri('brick', a, c, d); else tri('brick', a, d, c);
    }
  };
  const gambrelSlopes = (u0, u1, v0, v1, vRidge, yBreak) => {
    quad('slate', [u0, 7.85, v1], [u1, 7.85, v1], [u1, yBreak, vRidge + 3.1], [u0, yBreak, vRidge + 3.1]);
    quad('slate', [u1, 7.85, v0], [u0, 7.85, v0], [u0, yBreak, vRidge - 3.1], [u1, yBreak, vRidge - 3.1]);
    quad('slate', [u0, yBreak, vRidge + 3.1], [u1, yBreak, vRidge + 3.1], [u1, H.west, vRidge], [u0, H.west, vRidge]);
    quad('slate', [u1, yBreak, vRidge - 3.1], [u0, yBreak, vRidge - 3.1], [u0, H.west, vRidge], [u1, H.west, vRidge]);
  };
  const w = PLAN.westLow, cap = PLAN.westCap;
  const wvR = (w.v0 + w.v1) / 2, yBreak = 10.15;
  box('brick', cap.u0, w.u0 + 0.4, 2.4, 8.05, cap.v0, cap.v1);
  box('stone', cap.u0, w.u0 + 0.4, 0, 2.6, cap.v0 - 0.04, cap.v1 + 0.08);
  box('brick', w.u0, w.u1, 2.4, 8.05, w.v0, w.v1);
  box('stone', w.u0, w.u1, 0, 2.6, w.v0 - 0.04, w.v1 + 0.08);
  const wPitch = near ? 5.4 : 10.8;
  for (let u = cap.u0 + 2.4; u < cap.u1 - 1; u += wPitch) box('glow', u - 0.65, u + 0.65, 3.3, 6.4, cap.v1 + 0.1, cap.v1 + 0.2);
  for (let u = w.u0 + 2.2; u < w.u1 - 1.5; u += wPitch) box('glow', u - 0.65, u + 0.65, 3.3, 6.4, w.v1 + 0.1, w.v1 + 0.2);
  gambrelSlopes(cap.u0, w.u0 + 0.6, cap.v0, cap.v1, wvR, yBreak);
  gambrelSlopes(w.u0, w.u1, w.v0, w.v1, wvR, yBreak);
  gambrelEnd(cap.u0, cap.v0, cap.v1, wvR, yBreak, 1);
  gambrelEnd(w.u1, w.v0, w.v1, wvR, yBreak, -1);

  // Koningspaviljoen follows the mapped L: a city block, a lower rear leg, and the entrance bay.
  const k = PLAN.koning, kr = PLAN.koningRear, kp = PLAN.koningPorch;
  box('brick', k.u0, k.u1, 3.2, 18.4, k.v0, k.v1);
  box('stone', k.u0, k.u1, 0, 3.4, k.v0 - 0.04, k.v1 + 0.08);
  for (let u = k.u0 + 2.4; u < k.u1 - 1.6; u += (near ? 4.6 : 9.2)) {
    for (const [y0, y1] of [[5.2, 8.6], [10.2, 13.6], [15.0, 17.6]]) {
      box('glow', u - 0.65, u + 0.65, y0, y1, k.v1 + 0.12, k.v1 + 0.22);
    }
  }
  box('stone', k.u0, k.u1, 18.15, 18.65, k.v0 - 0.04, k.v1 + 0.12);
  gableRoof('slate', k.u0 + 0.25, k.u1 - 0.25, k.v1 - 0.08, k.v0 + 0.25, 18.3, H.pavilion, 'brick');
  box('brick', kr.u0, kr.u1, 2.5, 13.6, kr.v0, kr.v1);
  box('stone', kr.u0, kr.u1, 0, 2.7, kr.v0 - 0.04, kr.v1);
  gableRoof('slate', kr.u0 + 0.2, kr.u1 - 0.2, kr.v1 - 0.1, kr.v0 + 0.2, 13.4, 17.2, 'brick');
  box('brick', kp.u0, kp.u1, 3.3, 18.15, kp.v0, kp.v1);
  box('stone', kp.u0 - 0.08, kp.u1 + 0.08, 0, 3.55, kp.v0, kp.v1 + 0.1);
  const ku = (kp.u0 + kp.u1) / 2;
  extrudeV('brick', [[ku - 1.45, 18.05], [ku + 1.45, 18.05], [ku, 25]], kp.v1 + 0.18, kp.v1 - 0.35);
  box('glow', ku - 0.45, ku + 0.45, 20.2, 22.3, kp.v1 + 0.08, kp.v1 + 0.18);
  box('iron', ku - 0.12, ku + 0.12, 24.7, 27.1, kp.v1 - 0.55, kp.v1 - 0.15);

  const o = PLAN.oost;
  box('brick', o.u0, o.u1, 2.6, H.oostEave, o.v0, o.v1);
  box('stone', o.u0, o.u1, 0, 2.85, o.v0 - 0.06, o.v1 + 0.1);
  const oPitch = near ? 5.2 : 10.4;
  for (let u = o.u0 + 2.4; u < o.u1 - 2; u += oPitch) {
    for (const [y0, y1] of [[3.6, 6.5], [8.0, 11.0], [12.0, 14.4]]) {
      box('glow', u - 0.8, u + 0.8, y0, y1, o.v1 + 0.16, o.v1 + 0.28);
    }
  }
  box('stone', o.u0, o.u1, H.oostEave - 0.45, H.oostEave + 0.08, o.v0 - 0.04, o.v1 + 0.22);
  gableRoof('slate', o.u0 + 0.2, o.u1 - 0.2, o.v1 - 0.05, o.v0 + 0.25, H.oostEave - 0.2, H.oost, 'brick');

  // --- The three platform sheds, south to north (city to IJ) ------------------
  const segs = near ? 14 : 8;
  const rib = near ? 12 : 36;
  shed(SHEDS.zuid, segs, rib);
  shed(SHEDS.midden, Math.max(8, segs - 2), rib + 4);
  shed(SHEDS.noord, segs, rib);

  return b.finish();
}
