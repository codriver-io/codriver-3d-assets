import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { MASSES, WALLS, TOWER, PORCH, TURRET, Y, EAVE, PAV_EAVE, CENTRE_EAVE, WING_RISE, PAV_RISE, wallSpan } from './old-city-hall-plan.js';
import { buildTower } from './old-city-hall-tower.js';
import { hipRoof, gableRoof, localGable, localShed, rakeBar, pyramid, archPoints, openingPanel, openingFrame, wallMatrix } from './old-city-hall-solids.js';

// Old City Hall (E. J. Lennox, 1899): an original procedural model. The plan is
// the mapped outline (OSM relation 3116); heights, roof pitches and window
// rhythm are read from photographs (see docs/3d-toronto-old-city-hall.md).
// Authoring frame: x = u along Queen St, y up, z = -v (Queen St frontage looks
// toward +z); one rotation onto the mapped grid at the end.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g, m) => b.put(g, m, 0, 0);
  const box = (m, u0, u1, y0, y1, v0, v1) => b.box(m, [(u0 + u1) / 2, (y0 + y1) / 2, -(v0 + v1) / 2], [u1 - u0, y1 - y0, v1 - v0], 0, 0, 0);
  const tri = near ? 1 : 0.5;
  const cyl = (m, u, v, y0, y1, r, rTop = r, seg = near ? 20 : 10, open = false) => {
    const g = new THREE.CylinderGeometry(rTop, r, y1 - y0, seg, 1, open); g.translate(u, (y0 + y1) / 2, -v); put(g, m);
  };
  const cone = (m, u, v, y0, y1, r, seg = near ? 20 : 10) => {
    const g = new THREE.ConeGeometry(r, y1 - y0, seg, 1, true); g.translate(u, (y0 + y1) / 2, -v); put(g, m);
  };

  // ---- masses -------------------------------------------------------------------
  for (const [, u0, u1, v0, v1, top] of MASSES) box('stone', u0, u1, 0, top, v0, v1);

  // ---- roofs --------------------------------------------------------------------
  const roof = (g) => put(g, 'roof');
  for (const [name, u0, u1, v0, v1] of MASSES) {
    if (name.endsWith('pavilion')) roof(hipRoof(u0, u1, v0, v1, PAV_EAVE, PAV_RISE, { over: 0.55, drop: 0.35 }));
  }
  // Wing roofs are pitched blocks whose ridge ends are buried in the pavilion hips.
  roof(gableRoof('u', -35.65, 35.75, -37.7, -13.4, EAVE, WING_RISE.S, { over: 0.55 }));
  roof(gableRoof('u', -35.65, 35.75, 24.9, 41.6, EAVE, WING_RISE.N, { over: 0.55 }));
  roof(gableRoof('v', -40.4, -15.7, -31.35, 35.05, EAVE, WING_RISE.W, { over: 0.55 }));
  roof(gableRoof('v', 15.7, 40.4, -31.75, 34.45, EAVE, WING_RISE.E, { over: 0.55 }));
  // The court: the four wing roofs slope down into it; its floor is a flat skylight deck, with the north-east
  // block that the court's L-shaped outline leaves out under a plain flat roof.
  box('glass', -15.9, 15.9, 24.3, 24.5, -13.6, 14.1);
  box('glass', -15.9, 5.1, 24.3, 24.5, 14.1, 25.1);
  box('roof', 4.7, 15.9, 24.6, 24.8, 13.9, 25.1);
  roof(hipRoof(-15.3, -10.7, -43.3, -37.7, EAVE, 8.6, { over: 0.45, drop: 0.3 })); // the small bay west of the tower

  // ---- facade walls -------------------------------------------------------------
  const levels = [
    // [y0, height, width, kind, count spacing]
    { y: 1.5, h: 2.9, w: 1.7, kind: 'rect', pitch: 4.2 },
    { y: 6.6, h: 4.6, w: 2.0, kind: 'arch', pitch: 4.2 },
    { y: 13.0, h: 4.2, w: 1.9, kind: 'arch', pitch: 4.2 },
    { y: 18.9, h: 3.0, w: 1.1, kind: 'arcade', pitch: 2.15 },
  ];
  for (const w of WALLS) {
    const M = wallMatrix(w.side, w.plane), [s0, s1] = wallSpan(w), L = s1 - s0, yMin = w.yMin ?? 0;
    const at = (g, m) => { g.applyMatrix4(M); put(g, m); };
    const wbox = (m, sa, sb, y0, y1, d0, d1) => { const g = new THREE.BoxGeometry(sb - sa, y1 - y0, d1 - d0); g.translate((sa + sb) / 2, (y0 + y1) / 2, (d0 + d1) / 2); at(g, m); };
    // string courses, plinth and cornice
    wbox('redstone', s0, s1, Math.max(yMin, 0), Y.base, -0.05, 0.28);
    for (const y of [Y.l0, Y.l1, Y.l2, Y.l3]) if (y > yMin) wbox('redstone', s0, s1, y - 0.28, y + 0.28, -0.05, 0.22);
    wbox('redstone', s0, s1, w.top - 2.3, w.top - 1.75, -0.05, 0.4);
    wbox('stone', s0 - 0.05, s1 + 0.05, w.top - 1.75, w.top - 0.1, -0.05, 0.7);
    wbox('redstone', s0 - 0.05, s1 + 0.05, w.top - 0.1, w.top + 0.12, -0.05, 0.78);
    if (near) for (let y = 2.1; y < w.top - 2.6; y += 2.1) { // banded ashlar courses
      if (Math.abs(y - Y.l0) < 1.0 || Math.abs(y - Y.l1) < 1.0 || Math.abs(y - Y.l2) < 1.0 || Math.abs(y - Y.l3) < 1.0 || y < yMin) continue;
      wbox('band', s0, s1, y, y + 0.34, -0.05, 0.07);
    }
    if (near && (w.kind === 'pavilion' || w.kind === 'centre' || w.kind === 'bay') && L > 8) for (const s of [s0 + 0.35, s1 - 0.35]) { // corner quoins
      for (let y = yMin ? Math.max(yMin, 0.9) : 0.9; y < w.top - 2.4; y += 1.0) wbox(Math.floor(y) % 2 ? 'band' : 'stone', s - 0.5, s + 0.5, y, y + 0.9, -0.05, 0.16);
    }
    if (w.kind === 'centre') { // lean-to roof over the projecting centre bay, up to the wing wall
      const depth = w.side === 'N' ? 3.3 : 3.1;
      at(localShed(s0, s1, 0, -depth, w.top, depth * 0.97, { over: 0.55 }), 'roof');
    }
    if (w.kind === 'return' || L < 3.2) continue;
    // windows
    const margin = w.kind === 'pavilion' ? 1.6 : w.kind === 'narrow' ? 0.9 : 1.4;
    const giant = w.kind === 'pavilion' || w.kind === 'centre';
    for (const lv of levels) {
      if (lv.y < yMin || (giant && (lv.kind === 'arch'))) continue;
      const n = Math.max(1, Math.round((L - 2 * margin) / lv.pitch)), step = (L - 2 * margin) / n;
      for (let i = 0; i < n; i++) {
        const c = s0 + margin + (i + 0.5) * step, w0 = lv.w;
        if (!near) { // far: dark openings only, no frames
          const g = lv.kind === 'rect' ? new THREE.PlaneGeometry(w0, lv.h).translate(c, lv.y + lv.h / 2, 0.12) : openingPanel(c, lv.y, w0, lv.h, 0.12, 2);
          at(g, 'glass'); continue;
        }
        at(lv.kind === 'rect' ? new THREE.PlaneGeometry(w0, lv.h).translate(c, lv.y + lv.h / 2, 0.12) : openingPanel(c, lv.y, w0, lv.h, 0.12, 5), 'glass');
        if (lv.kind === 'rect') { wbox('redstone', c - w0 / 2 - 0.25, c + w0 / 2 + 0.25, lv.y + lv.h, lv.y + lv.h + 0.4, 0.0, 0.38); wbox('stone', c - w0 / 2 - 0.2, c + w0 / 2 + 0.2, lv.y - 0.25, lv.y, 0.0, 0.32); }
        else { at(openingFrame(c, lv.y, w0, lv.h, lv.kind === 'arcade' ? 0.22 : 0.4, lv.kind === 'arcade' ? 0.22 : 0.34, 5), 'redstone'); if (lv.kind === 'arch') wbox('stone', c - 0.06, c + 0.06, lv.y, lv.y + lv.h - w0 / 2, 0.1, 0.24); }
      }
    }
    if (giant && yMin === 0) { // two-storey round arches over grouped, mullioned windows
      const n = Math.max(1, Math.round((L - 2 * margin) / 5.9)), step = (L - 2 * margin) / n;
      for (let i = 0; i < n; i++) {
        const c = s0 + margin + (i + 0.5) * step, aw = 4.3, y0 = 6.6, ah = 11.4;
        at(openingPanel(c, y0, aw, ah, 0.12, near ? 8 : 2), 'glass');
        if (!near) continue;
        at(openingFrame(c, y0, aw, ah, 0.55, 0.36, 8), 'redstone');
        at(openingFrame(c, y0, aw + 1.1, ah + 0.55, 0.22, 0.5, 8), 'stone');
        wbox('stone', c - 0.09, c + 0.09, y0, y0 + ah - aw / 2 + 0.6, 0.1, 0.3);
        for (const y of [10.6, 14.4]) wbox('stone', c - aw / 2, c + aw / 2, y, y + 0.28, 0.1, 0.3);
        wbox('redstone', c - aw / 2 - 0.3, c + aw / 2 + 0.3, y0 + 3.6, y0 + 3.95, 0.05, 0.45); // impost course
      }
    }
    // gables over the middle of pavilions, bays and centres (centres also take a smaller one either side)
    const gw = w.kind === 'centre' ? 9.6 : w.kind === 'pavilion' ? 9.0 : w.kind === 'bay' ? Math.min(7.6, L * 0.62) : 0;
    if (gw) {
      const c0 = (s0 + s1) / 2, slope = w.kind === 'pavilion' ? 2.25 : 1.2;
      const gables = [{ c: c0, gw, rise: w.kind === 'centre' ? 11.5 : w.kind === 'pavilion' ? 10.0 : 8.4 }];
      if (w.kind === 'centre' && L > 20) for (const k of [-1, 1]) gables.push({ c: c0 + k * 7.0, gw: 4.8, rise: 5.6 });
      for (const { c, gw: g0, rise } of gables) {
        const base = w.top - 0.4, depth = rise / slope + 2.5;
        const tg = new THREE.Shape([new THREE.Vector2(c - g0 / 2, base), new THREE.Vector2(c + g0 / 2, base), new THREE.Vector2(c, base + rise)]);
        if (near) { // small arches and a rose beneath the apex
          const arches = g0 > 6 ? 3 : 2;
          for (let k = 0; k < arches; k++) {
            const x = c + (k - (arches - 1) / 2) * (g0 > 6 ? 1.9 : 1.5);
            at(openingPanel(x, base + 1.3, 1.1, 2.3, 0.62, 5), 'glass'); at(openingFrame(x, base + 1.3, 1.1, 2.3, 0.2, 0.66, 5), 'redstone');
          }
          if (g0 > 6) { const rose = new THREE.CircleGeometry(0.55, 12); rose.translate(c, base + rise - 2.2, 0.63); at(rose, 'glass'); }
        }
        const g = new THREE.ExtrudeGeometry(tg, { depth: 0.6, bevelEnabled: false }); g.translate(0, 0, -0.05); at(g, 'stone');
        for (const k of [-1, 1]) at(rakeBar(c + k * (g0 / 2 + 0.05), base - 0.05, c + k * 0.05, base + rise + 0.15, 0.34, -0.05, 0.78), 'redstone'); // raking coping
        at(localGable(c - g0 / 2 + 0.5, c + g0 / 2 - 0.5, -depth, 0.42, base, rise - 0.75, { over: 0.0, drop: 0.0 }), 'roof');
      }
    }
  }

  // ---- porch of three portals, tower, round turret ------------------------------
  buildPorch({ b, put, near, box, cyl });
  buildTower({ b, put, near, box, cyl, cone });
  buildTurret({ put, near, cyl, cone });

  // ---- flanking turrets on the west and east central bays -----------------------
  for (const [u, v, dir] of [[-42.6, -8.85, -1], [-42.6, 12.55, -1], [42.4, -8.45, 1], [42.4, 12.15, 1]]) {
    const r = 1.55, base = 15.5;
    cyl('stone', u, v, base + 2.5, CENTRE_EAVE + 1.4, r, r, near ? 12 : 8);
    cyl('stone', u, v, base, base + 2.5, 0.55, r, near ? 12 : 8); // corbel
    cyl('redstone', u, v, CENTRE_EAVE + 1.0, CENTRE_EAVE + 1.7, r + 0.25, r + 0.25, near ? 12 : 8);
    cone('roof', u, v, CENTRE_EAVE + 1.7, CENTRE_EAVE + 10.6, r + 0.6, near ? 12 : 8);
    if (near) for (const y of [19.2, 23.0]) box('glass', u + dir * 1.38, u + dir * 1.52, y, y + 1.9, v - 0.32, v + 0.32);
  }
  // north central bay: two square turrets under pyramid roofs
  for (const u of [-6.6, 6.6]) {
    box('stone', u - 1.4, u + 1.4, 16.0, 29.5, 41.6, 44.6);
    box('redstone', u - 1.65, u + 1.65, 29.0, 29.8, 41.35, 44.85);
    put(pyramid(u, 43.1, 1.85, 29.8, 37.6), 'roof');
    if (near) { for (const y of [19.5, 24.0]) box('glass', u - 0.5, u + 0.5, y, y + 2.0, 44.6, 44.72); }
  }
  // chimney stacks on the wing ridges
  const chimney = (u, v, y0, y1) => { box('stone', u - 0.65, u + 0.65, y0, y1, v - 0.65, v + 0.65); box('redstone', u - 0.85, u + 0.85, y1, y1 + 0.4, v - 0.85, v + 0.85); };
  const ridgeS = EAVE + WING_RISE.S, ridgeN = EAVE + WING_RISE.N;
  for (const u of [-22, 9, 20]) chimney(u, -25.5, ridgeS - 2, ridgeS + 3.2);
  for (const u of [-18, -4, 12, 22]) chimney(u, 33.2, ridgeN - 2, ridgeN + 3.2);
  for (const v of [-14, 2, 18]) { chimney(-28.0, v, EAVE + WING_RISE.W - 2, EAVE + WING_RISE.W + 3.2); chimney(28.0, v, EAVE + WING_RISE.E - 2, EAVE + WING_RISE.E + 3.2); }

  // ridge cresting and pavilion finials
  const ridge = (u0, u1, v0, v1, y) => box('trim', Math.min(u0, u1) - 0.18, Math.max(u0, u1) + 0.18, y, y + 0.55, Math.min(v0, v1) - 0.18, Math.max(v0, v1) + 0.18);
  ridge(-35.65, 35.75, -25.55, -25.55, EAVE + WING_RISE.S - 0.05);
  ridge(-35.65, 35.75, 33.25, 33.25, EAVE + WING_RISE.N - 0.05);
  ridge(-28.05, -28.05, -31.35, 35.05, EAVE + WING_RISE.W - 0.05);
  ridge(28.05, 28.05, -31.75, 34.45, EAVE + WING_RISE.E - 0.05);
  for (const [name, u0, u1, v0, v1] of MASSES) if (name.endsWith('pavilion')) {
    const cu = (u0 + u1) / 2, cv = (v0 + v1) / 2, apex = PAV_EAVE + PAV_RISE - 0.35;
    cyl('trim', cu, cv, apex, apex + 2.6, 0.06, near ? 0.16 : 0.2, 6);
  }

  // ---- finish: rotate onto the mapped grid --------------------------------------
  const root = b.finish();
  const phi = THREE.MathUtils.degToRad(SPEC.rotationDeg);
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift');
    o.geometry.rotateY(phi); o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
    o.material.color.set(PALETTES.light[o.material.name]);
  });
  root.userData.elevationDatum = 'Local grade y=0; the Queen St frontage and courtyard are one level';
  void tri;
  return root;
}

// Three round-arched portals with stepped archivolts, clustered columns, a heavy
// cornice and three steps. The portals are open recesses 1.4 m deep.
function buildPorch({ b, put, near, box, cyl }) {
  const { u0, u1, v0, top, arch, pier, springY } = PORCH, M = wallMatrix('S', v0);
  const at = (g, m) => { g.applyMatrix4(M); put(g, m); };
  const wbox = (m, sa, sb, y0, y1, d0, d1) => { const g = new THREE.BoxGeometry(sb - sa, y1 - y0, d1 - d0); g.translate((sa + sb) / 2, (y0 + y1) / 2, (d0 + d1) / 2); at(g, m); };
  const depth = 1.5, ends = (u1 - u0 - 3 * arch - 2 * pier) / 2;
  const centres = [0, 1, 2].map((i) => u0 + ends + arch / 2 + i * (arch + pier));
  // front wall with three arched portals, then the solid mass behind it
  const shape = new THREE.Shape([[u0, 0], [u1, 0], [u1, top], [u0, top]].map(([s, y]) => new THREE.Vector2(s, y)));
  for (const c of centres) shape.holes.push(new THREE.Path(archPoints(c, 0.05, arch, springY + arch / 2, near ? 10 : 6).map(([s, y]) => new THREE.Vector2(s, y))));
  const wall = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }); wall.translate(0, 0, -depth); at(wall, 'redstone');
  wbox('redstone', u0, u1, 0, top - 0.05, -depth - 9.9, -depth);
  wbox('roof', u0, u1, top - 0.05, top, -depth - 9.9, -0.02);
  for (const c of centres) {
    at(openingPanel(c, 0, arch - 0.1, springY + arch / 2 - 0.05, -depth + 0.02, near ? 10 : 6), 'glass');
    at(openingFrame(c, 0, arch, springY + arch / 2, 0.42, 0.34, near ? 10 : 6), 'stone');
    if (near) {
      at(openingFrame(c, 0, arch + 0.84, springY + arch / 2 + 0.42, 0.34, 0.5, 10), 'redstone');
      for (const s of [-1, 1]) for (const k of [0, 1]) { // clustered columns at each jamb
        const g = new THREE.CylinderGeometry(0.2, 0.2, springY - 0.35, 10); g.translate(c + s * (arch / 2 + 0.05 + k * 0.42), (springY - 0.35) / 2 + 0.25, 0.45 - k * 0.15); at(g, 'stone');
        wbox('stone', c + s * (arch / 2 + 0.05 + k * 0.42) - 0.3, c + s * (arch / 2 + 0.05 + k * 0.42) + 0.3, springY - 0.1, springY + 0.25, 0.1 - k * 0.15, 0.8 - k * 0.15);
      }
    }
  }
  // rusticated courses on the porch's front, and a plinth (its east return too)
  wbox('band', u0, u1, 0, 0.9, -0.02, 0.24);
  if (near) for (let y = 1.5; y < top - 1.6; y += 1.3) for (const c of centres) { void c; }
  if (near) for (let y = 1.5; y < top - 1.7; y += 1.3) {
    if (y < springY + 1.2) { // between the portals, only the piers
      for (let i = 0; i <= 3; i++) { const sa = i === 0 ? u0 : centres[i - 1] + arch / 2, sb = i === 3 ? u1 : centres[i] - arch / 2; wbox('band', sa, sb, y, y + 0.3, -0.02, 0.1); }
    } else wbox('band', u0, u1, y, y + 0.3, -0.02, 0.1);
  }
  // heavy cornice, parapet and steps
  wbox('stone', u0, u1 + 0.3, top - 1.4, top, 0, 1.0); wbox('redstone', u0, u1 + 0.3, top - 0.35, top + 0.1, 0, 1.12);
  wbox('stone', u0, u1, top, top + 0.9, 0.0, 0.5);
  for (let i = 0; i < 3; i++) wbox('stone', u0 + 0.4, u1 - 0.4, 0, 0.36 * (3 - i), 0.0, 0.3 + 0.17 * (3 - i) + 0.05);
  void box; void cyl;
}

// The narrow round turret at the porch's east end: a rusticated drum with banded
// windows, a corbelled top and a tall conical roof.
function buildTurret({ put, near, cyl, cone }) {
  const { u, v, r, drumTop, roofTop } = TURRET, seg = near ? 20 : 10;
  cyl('stone', u, v, 0, drumTop, r, r, seg);
  for (const y of [Y.l0, Y.l1, Y.l2]) cyl('redstone', u, v, y - 0.3, y + 0.3, r + 0.16, r + 0.16, seg);
  cyl('stone', u, v, drumTop - 2.6, drumTop, r, r + 0.75, seg); // corbelled top
  cyl('redstone', u, v, drumTop, drumTop + 0.55, r + 0.9, r + 0.9, seg);
  cone('roof', u, v, drumTop + 0.55, roofTop, r + 0.95, seg);
  const tip = new THREE.CylinderGeometry(0.06, 0.1, 1.6, 6); tip.translate(u, roofTop + 0.5, -v); put(tip, 'trim');
  if (near) for (const y of [2.6, 8.4, 14.6, 20.4, 26.0]) for (const a of [-20, 30, 80, 130]) {
    const ang = THREE.MathUtils.degToRad(a);
    const g = new THREE.BoxGeometry(0.75, 2.0, 0.18);
    g.rotateY(Math.PI / 2 - ang); g.translate(u + (r + 0.02) * Math.cos(ang), y + 1.0, -v + (r + 0.02) * Math.sin(ang)); put(g, 'glass');
  }
}
