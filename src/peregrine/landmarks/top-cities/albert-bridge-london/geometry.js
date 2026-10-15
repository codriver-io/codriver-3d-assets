import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PROFILE as P, deckHeight as h, roadHalfAt, TOWER_S, BOOTH_S, CENTRE_S, MAIN_SPAN, ABUTMENT_S, L,
  FOOT_OUT, GIRDER_OUT, COLUMN_D } from './albert-bridge-london-profile.js';
import { COL, GIRDER_TOP, GIRDER_BOTTOM, stays, chains, hangers } from './albert-bridge-london-members.js';

// Original architectural interpretation of Albert Bridge. Station s follows the mapped road north
// to south; lateral d is right of travel (west). Geometry and navigation share this one frame.
export const CENTRAL_PIER_D = 8.6, CENTRAL_PIER_R = 2.4, BOOTH_D = 7.4;
export const boothBaseY = s => Math.max(h(s - 2.2), h(s + 2.2)) + 0.17;
const ease = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
// An approach footway flares around each booth; its flat seat joins the existing raised walk.
export function footOutAt(s) {
  const bulge = Math.max(...BOOTH_S.map(t => 1 - ease((Math.abs(s - t) - 2.8) / 5)));
  return roadHalfAt(s) + (FOOT_OUT - 4.1) + bulge * 3.65;
}
export function footwayY(s) {
  let y = h(s) + 0.15;
  for (const t of BOOTH_S) {
    const blend = 1 - ease((Math.abs(s - t) - 2.8) / 5);
    y += (boothBaseY(t) - y) * blend;
  }
  return y;
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // Far merges minor materials into their neighbours (and drops gold and LEDs).
  const FAR = { blue: 'glow', concrete: 'stone', paving: 'stone', gold: null, light: 'white' };
  const M = m => (near ? m : (m in FAR ? FAR[m] : m));
  const xyz = (s, d, y) => { const q = P.bridgePoint(s, d, y); return [q.x, q.y, q.z]; };
  const tan = s => { const q = P.bridgePoint(s); return [q.tx, q.tz]; };
  const heading = s => { const [tx, tz] = tan(s); return -Math.atan2(tz, tx); };
  const ground = y => (y > 0.01 ? 1 : 0);
  const put = (g, mat, lift = 1) => { const m = M(mat); if (m) b.put(g, m, 0, lift); };
  const box = (mat, s, d, y, along, across, tall, lift = 1) => {
    const m = M(mat); if (!m) return;
    const q = P.bridgePoint(s, d, y); b.box(m, [q.x, q.y, q.z], [along, tall, across], heading(s), 0, lift);
  };
  const bar = (mat, a, c, w, dep = w, round = false, lift = 1) => { const m = M(mat); if (m) b.bar(m, xyz(...a), xyz(...c), w, dep, 0, round, lift); };
  // Vertical prism / frustum (octagonal columns, cylindrical piers) centred on (s, d).
  function prism(mat, s, d, y0, y1, r0, r1 = r0, seg = 8, lift = 1, turn = 0) {
    if (y1 - y0 < 1e-3) return;
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, seg, 1, false);
    g.rotateY(heading(s) + turn); const q = xyz(s, d, (y0 + y1) / 2); g.translate(...q); put(g, mat, lift);
  }
  function cone(mat, s, d, y0, height, r, seg = 8, lift = 1) {
    const g = new THREE.ConeGeometry(r, height, seg); g.rotateY(heading(s));
    const q = xyz(s, d, y0 + height / 2); g.translate(...q); put(g, mat, lift);
  }
  // Thin disc on a girder face, its axis across the road.
  function disc(mat, s, d, y, r, thick) {
    const [tx, tz] = tan(s), g = new THREE.CylinderGeometry(r, r, thick, near ? 8 : 6);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-tz, 0, tx)));
    g.translate(...xyz(s, d, y)); put(g, mat);
  }
  // Closed strip along the alignment. left/right/top/bottom are numbers or functions of s.
  // Every face's winding is checked against its outward direction.
  const KEYS = [...[3,9,15,21,27].flatMap(s => [s,L-s]), ...TOWER_S, ...ABUTMENT_S, CENTRE_S, 14, L - 14, TOWER_S[0] - 10, TOWER_S[1] + 10, ...BOOTH_S.flatMap(s => [-7.8, -2.8, 0, 2.8, 7.8].map(v => s + v))];
  const val = (f, s) => (typeof f === 'function' ? f(s) : f);
  function ribbon(mat, a, c, left, right, top, bottom, { inner = true, outer = true, ends = true, step = near ? 3 : 6, lift = 1, across = 1 } = {}) {
    const m = M(mat); if (!m || c - a < 1e-3) return;
    if (val(left, (a + c) / 2) > val(right, (a + c) / 2)) { [left, right] = [right, left]; [inner, outer] = [outer, inner]; }
    const set = new Set([a, c]);
    for (let s = Math.ceil(a / step) * step; s < c; s += step) if (s > a) set.add(s);
    for (const v of P.ALIGNMENT) if (v.s > a && v.s < c) set.add(v.s);
    for (const k of KEYS) if (k > a && k < c) set.add(k);
    const ss = [...set].sort((u, v) => u - v), pos = [];
    const quad = (A, B, C, D, out) => {
      const n = new THREE.Vector3().crossVectors(new THREE.Vector3(...B).sub(new THREE.Vector3(...A)), new THREE.Vector3(...C).sub(new THREE.Vector3(...A)));
      if (n.length() < 1e-6) return; // zero-area (a ramp end at grade)
      if (n.dot(out) >= 0) pos.push(...A, ...B, ...C, ...A, ...C, ...D); else pos.push(...A, ...C, ...B, ...A, ...D, ...C);
    };
    for (let i = 1; i < ss.length; i++) {
      const u = ss[i - 1], v = ss[i], [tx, tz] = tan((u + v) / 2);
      const side = new THREE.Vector3(-tz, 0, tx), fwd = new THREE.Vector3(tx, 0, tz);
      const p = (s, d, y) => xyz(s, val(d, s), val(y, s));
      const A = p(u, left, top), B = p(u, right, top), C = p(v, right, top), D = p(v, left, top);
      const E = p(u, left, bottom), F = p(u, right, bottom), G = p(v, right, bottom), H = p(v, left, bottom);
      // Ground-fitted pavement needs interior vertices: a two-edge chord can cut through a
      // lateral terrain crest even when both edges and navigation are above their own DEM.
      const lateral = (s, k) => val(left, s) + (val(right, s) - val(left, s)) * k / across;
      for (let k = 0; k < across; k++) quad(p(u, lateral(u,k), top), p(u, lateral(u,k+1), top),
        p(v, lateral(v,k+1), top), p(v, lateral(v,k), top), new THREE.Vector3(0,1,0));
      if (val(bottom, u) > 0.001 || val(bottom, v) > 0.001) quad(E, F, G, H, new THREE.Vector3(0, -1, 0));
      if (inner) quad(A, D, H, E, side.clone().negate());
      if (outer) quad(B, C, G, F, side);
      if (ends && i === 1) quad(A, B, F, E, fwd.clone().negate());
      if (ends && i === ss.length - 1) quad(D, C, G, H, fwd);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals(); b.put(mergeVertices(g, 1e-5), m, 0, lift);
  }
  const mirror = (lo, hi) => [[s => -val(hi, s), s => -val(lo, s)], [lo, hi]];
  const [A0, A1] = ABUTMENT_S;

  // ROADWAY. Asphalt over the whole alignment, easing to the mapped streets on land.
  ribbon('asphalt', 0, L, s => -roadHalfAt(s), s => roadHalfAt(s), h, s => (s > A0 && s < A1 ? h(s) - 0.3 : 0), { inner: false, outer: false, across: near ? 12 : 6 });
  // Footways (raised 15 cm), structure and land; land skirts close the ramp down to grade.
  const footOut = footOutAt;
  for (const [lo, hi] of mirror(s => roadHalfAt(s), footOut)) {
    const west = val(lo, 0) > 0;
    ribbon('paving', 0, L, lo, hi, footwayY, s => Math.max(0, h(s) - 0.3), west ? { outer: false, across: near ? 4 : 2 } : { inner: false, across: near ? 4 : 2 });
  }
  // (No end faces: the footway's end covers the street end, the abutment the river end.)
  for (const [a, c] of [[0, Math.max(A0 + 0.4, BOOTH_S[0] + 7.8)], [Math.min(A1 - 0.4, BOOTH_S[1] - 7.8), L]]) for (const [lo, hi] of mirror(s => footOut(s) - 0.3, footOut)) {
    ribbon('stone', a, c, lo, hi, s => footwayY(s) - 0.15, 0, { lift: ground, ends: false });
  }
  // Iron floor and cross girders under the structure.
  ribbon('iron', A0, A1, -FOOT_OUT, FOOT_OUT, s => h(s) - 0.35, s => Math.max(0.02, h(s) - 1.0), { inner: false, outer: false });
  if (near) for (let s = A0 + 3; s < A1 - 2; s += 4) if (h(s) > 1.7) box('iron', s, 0, h(s) - 1.15, 0.3, 2 * FOOT_OUT, 0.4);
  // Pink outer girders / parapets with white caps, stiffeners and gilded roundels on both faces.
  for (const o of [-1, 1]) {
    const lo = o > 0 ? FOOT_OUT : -GIRDER_OUT, hi = o > 0 ? GIRDER_OUT : -FOOT_OUT;
    ribbon('pink', A0, A1, lo, hi, s => h(s) + GIRDER_TOP, s => Math.max(0, h(s) + GIRDER_BOTTOM));
    ribbon('white', A0 - 0.05, A1 + 0.05, o * (FOOT_OUT - 0.05), o * (GIRDER_OUT + 0.05), s => h(s) + GIRDER_TOP + 0.12, s => h(s) + GIRDER_TOP - 0.03);
    if (near) {
      ribbon('light', A0, A1, o * 6.17, o * 6.23, s => h(s) + GIRDER_TOP + 0.18, s => h(s) + GIRDER_TOP + 0.1, { step: 6 });
      for (let s = A0 + 1.2; s < A1 - 0.6; s += 2.4) {
        const lowest = Math.max(0, h(s) + GIRDER_BOTTOM), top = h(s) + GIRDER_TOP;
        box('white', s, o * (GIRDER_OUT + 0.05), (lowest + top) / 2, 0.16, 0.14, top - lowest - 0.06);
        if (TOWER_S.some(t => Math.abs(t - s - 1.2) < 1.6)) continue;
        disc('gold', s + 1.2, o * (GIRDER_OUT + 0.035), (Math.max(lowest + 0.5, h(s) - 0.07)), 0.42, 0.17);
        if (Math.round((s - A0) / 2.4) % 2 === 0) disc('gold', s + 1.2, o * (FOOT_OUT - 0.035), h(s) + 0.68, 0.3, 0.17);
      }
    }
  }
  // Masonry abutments at the embankment walls (the toll booths stand on their landward side).
  for (const [i, s] of ABUTMENT_S.entries()) {
    const toLand = i ? 1 : -1, top = h(s) - 0.4;
    box('stone', s + toLand * 0.7, 0, top / 2, 2.4, 2 * GIRDER_OUT + 0.6, top, ground);
  }

  // TOWERS: four octagonal cast-iron columns on cylindrical iron piers, linked by a lattice arch.
  for (const sT of TOWER_S) {
    const yD = h(sT), y0 = yD + COL.pierTop;
    for (const o of [-1, 1]) {
      const d = o * COLUMN_D;
      prism('iron', sT, d, 0, y0, 2.3, 2.2, near ? 16 : 10, ground);
      prism('white', sT, d, y0 - 0.4, y0 + 0.06, 2.4, 2.4, near ? 16 : 10);
      prism('white', sT, d, y0 - 0.02, yD + COL.plinth, 1.35, 1.35, 8);
      prism('white', sT, d, yD + 1.3, yD + 1.75, 1.5, 1.2, 8);
      prism('glow', sT, d, yD + 1.7, yD + COL.capital, near ? 0.88 : 0.95, near ? 0.88 : 0.95, near ? 8 : 6);
      if (near) for (const [u, v] of [[0.67, 0.67], [-0.67, 0.67], [0.67, -0.67], [-0.67, -0.67]]) prism('blue', sT + u, d + v, yD + 1.7, yD + COL.capital - 0.05, 0.24, 0.24, 6);
      for (const r of near ? [4.5, 7.5, 10.5, 13.5, 16.3] : [7.5, 13.5]) prism('white', sT, d, yD + r, yD + r + 0.3, 1.22, 1.22, 8);
      prism('white', sT, d, yD + COL.capital, yD + COL.capitalTop, 1.0, 1.4, 8);
      // Open cast-iron lantern in BOTH LODs. A small internal lamp leaves the window bays open.
      prism('light', sT, d, yD + COL.capitalTop + 0.35, yD + COL.lantern - 0.25, 0.18, 0.18, near ? 8 : 4);
      for (let k = 0; k < 8; k++) {
        const a = k * Math.PI / 4;
        prism('white', sT + 0.85 * Math.cos(a), d + 0.85 * Math.sin(a), yD + COL.capitalTop - 0.02, yD + COL.lantern + 0.03, 0.075, 0.075, 4);
      }
      prism('white', sT, d, yD + COL.lantern, yD + COL.spire, 0.98, 0.98, 8);
      // A short opaque weather cap; the tall crown above it is a light open cage, not a cone.
      cone('white', sT, d, yD + COL.spire - 0.02, 0.45, 0.73, 8);
      for (let k = 0; k < 8; k++) {
        const a = k * Math.PI / 4;
        bar('white', [sT + 0.46 * Math.cos(a), d + 0.46 * Math.sin(a), yD + COL.spire + 0.15],
          [sT, d, yD + COL.spireTop], near ? 0.045 : 0.06);
      }
      // Four delicate corner pinnacles sit on the lantern rim in near and far.
      for (const [u, v] of [[0.62, 0.62], [-0.62, 0.62], [0.62, -0.62], [-0.62, -0.62]])
        cone('white', sT + u, d + v, yD + COL.spire - 0.02, 0.85, 0.11, 4);
      bar('white', [sT, d, yD + COL.spireTop - 0.05], [sT, d, yD + COL.finial], near ? 0.055 : 0.075);
      // Iron bracket from the column plinth to the girder, at deck level.
      box('white', sT, o * (GIRDER_OUT + 0.475), yD + 0.2, 0.9, 0.95, 1.2);
    }
    // Portal: lattice girder and arch between the column heads, cresting and a central finial.
    const R = COLUMN_D - 0.75, yS = yD + 14.6, A = 2.7, yT = yD + 18.1;
    box('white', sT, 0, yT, 0.5, 2 * COLUMN_D, 0.7);
    const n = near ? 12 : 6, arch = [];
    for (let i = 0; i <= n; i++) { const t = Math.PI * i / n; arch.push([-R * Math.cos(t), yS + A * Math.sin(t)]); }
    for (let i = 1; i <= n; i++) bar('white', [sT, arch[i - 1][0], arch[i - 1][1]], [sT, arch[i][0], arch[i][1]], 0.36, 0.42);
    for (let i = 1; i < n; i++) {
      if (!near && i % 2) continue;
      bar('white', [sT, arch[i][0], arch[i][1] - 0.1], [sT, arch[i][0], yT - 0.3], 0.14, 0.2);
      if (near) bar('white', [sT, arch[i][0], arch[i][1] - 0.1], [sT, arch[i + (arch[i][0] < 0 ? 1 : -1)][0], yT - 0.3], 0.1, 0.16);
    }
    if (near) for (let d = -COLUMN_D + 1.6; d <= COLUMN_D - 1.5; d += 0.8) box('white', sT, d, yT + 0.55, 0.12, 0.12, 0.5);
    cone('white', sT, 0, yT + 0.3, 1.6, 0.35, 6);
  }

  // STAYS (Ordish, 32 flat bars), CHAINS (Bazalgette, eyebars) and HANGERS, from the shared layout.
  for (const { top, foot } of stays()) bar('white', top, foot, 0.42, 0.2);
  for (const { f, segments: n } of chains(detail)) for (let i = 1; i <= n; i++) {
    const a = f((i - 1) / n), c = f(i / n);
    bar('chain', a, c, 0.5, 0.3);
    if (near) bar('light', [a[0], a[1], a[2] + 0.2], [c[0], c[1], c[2] + 0.2], 0.09, 0.09);
  }
  for (const { top, foot } of hangers(detail)) bar('white', top, foot, near ? 0.045 : 0.12, near ? 0.045 : 0.12, near);

  // 1973 GLC central piers: two concrete cylinders and a crosshead under the girders.
  {
    const s = CENTRE_S, top = h(s) + GIRDER_BOTTOM - 0.9;
    for (const o of [-1, 1]) prism('concrete', s, o * CENTRAL_PIER_D, 0, top + 0.05, CENTRAL_PIER_R, CENTRAL_PIER_R, near ? 16 : 10, ground);
    box('concrete', s, 0, (top + h(s) - 0.98) / 2, 3.2, 2 * (CENTRAL_PIER_D + CENTRAL_PIER_R), h(s) - 0.98 - top);
  }

  // Octagonal toll booths (1873) seated directly on the locally widened approach footways.
  for (const s of BOOTH_S) for (const o of [-1, 1]) {
    const d = o * BOOTH_D, yF = boothBaseY(s);
    prism('roof', s, d, yF - 0.02, yF + 0.6, 2.02, 2.02, 8);
    if (near) prism('booth', s, d, yF + 0.58, yF + 3.3, 1.92, 1.92, 8);
    prism('white', s, d, yF + 3.28, yF + 3.6, 2.3, 2.25, 8);
    cone('roof', s, d, yF + 3.58, 1.3, 2.4, 8);
    bar('white', [s, d, yF + 4.7], [s, d, yF + 5.3], 0.1, 0.1, near);
    const phi = heading(s), c = xyz(s, d, 0);
    for (let k = 0; k < 8; k++) {
      const a = phi + k * Math.PI / 4, f = a + Math.PI / 8;
      // CylinderGeometry corner k sits at (sin a, cos a); faces sit between corners.
      const at = (r, y, w, tall, dep, ang, mat) => {
        const g = new THREE.BoxGeometry(w, tall, dep); g.rotateY(ang);
        g.translate(c[0] + r * Math.sin(ang), y, c[2] + r * Math.cos(ang)); put(g, mat);
      };
      if (near) at(1.94, yF + 1.95, 0.28, 2.7, 0.28, a, 'blue');
      const ap = 1.92 * Math.cos(Math.PI / 8);
      if (near) {
        at(ap + 0.07, yF + 1.35, 0.85, 1.0, 0.2, f, 'pink');
        at(ap + 0.07, yF + 2.55, 0.8, 0.95, 0.2, f, 'roof');
      } else {
        // Far uses a split facade with recessed panels, not overlays on a closed prism.
        const half = 1.92 * Math.sin(Math.PI / 8);
        const pt = (x, y, r = ap) => [c[0] + r * Math.sin(f) + x * Math.cos(f), yF + y, c[2] + r * Math.cos(f) - x * Math.sin(f)];
        const quad = (mat, pts) => {
          const g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.Float32BufferAttribute([...pts[0], ...pts[1], ...pts[2], ...pts[0], ...pts[2], ...pts[3]], 3));
          g.computeVertexNormals(); put(g, mat);
        };
        const panel = (mat, x0, x1, y0, y1, r = ap) => quad(mat, [pt(x0,y0,r),pt(x1,y0,r),pt(x1,y1,r),pt(x0,y1,r)]);
        for (const [y0,y1] of [[0.58,0.85],[1.85,2.075],[3.025,3.3]]) panel('booth',-half,half,y0,y1);
        for (const [mat,w,y0,y1] of [['pink',0.425,0.85,1.85],['roof',0.4,2.075,3.025]]) {
          panel('booth',-half,-w,y0,y1); panel('booth',w,half,y0,y1);
          panel(mat,-w,w,y0,y1,ap-0.04);
          for (const [x0,yA,x1,yB] of [[-w,y0,w,y0],[w,y0,w,y1],[w,y1,-w,y1],[-w,y1,-w,y0]])
            quad('booth',[pt(x0,yA),pt(x1,yB),pt(x1,yB,ap-0.04),pt(x0,yA,ap-0.04)]);
        }
      }
    }
  }

  // Ornamental lamp standards along the footways.
  if (near) for (const s of [A0 + 9, TOWER_S[0] - 9, TOWER_S[0] + 9, CENTRE_S - 26, CENTRE_S + 26, TOWER_S[1] - 9, TOWER_S[1] + 9, A1 - 9]) {
    for (const o of [-1, 1]) {
      const d = o * (FOOT_OUT - 0.35), y = h(s) + 0.15;
      bar('roof', [s, d, y - 0.05], [s, d, y + 4.3], 0.08, 0.08, true);
      prism('light', s, d, y + 4.25, y + 4.85, 0.22, 0.28, 6);
      cone('roof', s, d, y + 4.83, 0.35, 0.33, 6);
    }
  }
  return b.finish();
}
