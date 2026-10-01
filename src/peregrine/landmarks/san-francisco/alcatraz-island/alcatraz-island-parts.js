import * as THREE from 'three';
import { MASSES, TIERS, FACES, MONITORS, LIGHTHOUSE, TOWER, YARD_WALL, YARD, GUARD_TOWERS, RUIN } from './alcatraz-island-plan.js';

// ---- the Main Cellhouse, Dining Hall and Administration Block ---------------------------------------------------
export function cellhouse(k, near) {
  for (const m of MASSES) {
    // Masses that touch overlap by 3 cm along u so no hairline crack shows between coplanar neighbours (same colour, same normal).
    const [u0, u1] = [m.u[0] - (m.share?.uMin ? 0.03 : 0), m.u[1] + (m.share?.uMax ? 0.03 : 0)], [w0, w1] = m.w, H = m.H, T = TIERS[H];
    const cs = (side) => (m.share?.[side] ? 0 : 0.35), ins = (side) => (m.share?.[side] ? -0.1 : 0.7);
    k.box('base', u0, u1, 0, T.base, w0, w1);
    k.box('stone', u0, u1, T.base, H - 0.8, w0, w1);
    k.box('trim', u0 - cs('uMin'), u1 + cs('uMax'), H - 0.8, H, w0 - cs('wMin'), w1 + cs('wMax'));
    k.box('roof', u0 + ins('uMin'), u1 - ins('uMax'), H, H + 0.22, w0 + ins('wMin'), w1 - ins('wMax'));
  }
  for (const [u0, u1, w0, w1, y0, rise] of MONITORS) monitor(k, u0, u1, w0, w1, y0, rise);
  for (const f of FACES) dressFace(k, f, near);
}

function monitor(k, u0, u1, w0, w1, y0, rise) {
  const wm = (w0 + w1) / 2, yr = y0 + rise;
  k.face('roof', [[u0, y0, w0], [u1, y0, w0], [u1, yr, wm], [u0, yr, wm]], [0, 1, -1]);
  k.face('roof', [[u0, y0, w1], [u1, y0, w1], [u1, yr, wm], [u0, yr, wm]], [0, 1, 1]);
  k.face('roof', [[u0, y0, w0], [u0, y0, w1], [u0, yr, wm]], [-1, 0, 0]);
  k.face('roof', [[u1, y0, w0], [u1, y0, w1], [u1, yr, wm]], [1, 0, 0]);
}

function dressFace(k, f, near) {
  const { axis, c, a, b, n, H } = f, T = TIERS[H];
  const P = (s, y, d) => (axis === 'u' ? [s, y, c + n * d] : [c + n * d, y, s]);
  const out = axis === 'u' ? [0, 0, n] : [n, 0, 0];
  const fb = (m, s0, s1, y0, y1, d0, d1) => {
    const e0 = c + n * d0, e1 = c + n * d1, lo = Math.min(e0, e1), hi = Math.max(e0, e1);
    if (axis === 'u') k.box(m, s0, s1, y0, y1, lo, hi); else k.box(m, lo, hi, y0, y1, s0, s1);
  };
  const L = b - a, count = Math.max(1, Math.round(L / 4.3)), step = L / count;
  if (near) {
    fb('trim', a, b, T.base, T.base + 0.22, 0, 0.14); // string course on top of the rusticated base
    if (T.band) fb('trim', a, b, T.band, T.band + 0.25, 0, 0.12);
    for (let i = 0; i <= count; i++) { // pilasters between the bays
      const s = a + i * step, s0 = i === 0 ? a - 0.06 : i === count ? b - 0.84 : s - 0.45;
      fb('trim', s0, s0 + 0.9, T.base + 0.22, H - 0.8, -0.1, 0.3);
    }
  }
  for (let i = 0; i < count; i++) {
    const cs = a + (i + 0.5) * step;
    for (const [y0, y1, wid, mull] of T.tiers) {
      const hw = Math.min(wid, step - 1.5) / 2;
      k.face('glass', [P(cs - hw, y0, 0.06), P(cs + hw, y0, 0.06), P(cs + hw, y1, 0.06), P(cs - hw, y1, 0.06)], out);
      if (!near) continue;
      fb('trim', cs - hw - 0.12, cs + hw + 0.12, y0 - 0.18, y0, 0, 0.2); // sill
      if (mull) { // barred sash: one mullion and one transom
        fb('trim', cs - 0.04, cs + 0.04, y0, y1, 0.06, 0.13);
        fb('trim', cs - hw, cs + hw, y0 + (y1 - y0) * 0.62, y0 + (y1 - y0) * 0.62 + 0.08, 0.06, 0.13);
      }
    }
  }
}

// ---- the 1909 lighthouse ------------------------------------------------------------------------------------------
export function lighthouse(k, near) {
  const { u, w, baseTop, shaftTop } = LIGHTHOUSE, seg = near ? 8 : 8, yaw = Math.PI / 8;
  k.box('tower', u - 3.0, u + 3.0, 0, baseTop, w - 3.0, w + 3.0); // the masonry base block
  k.box('trim', u - 3.3, u + 3.3, baseTop, baseTop + 0.4, w - 3.3, w + 3.3);
  const cyl = (m, rT, rB, y0, y1, open = false, s = seg) => { const g = new THREE.CylinderGeometry(rT, rB, y1 - y0, s, 1, open); g.translate(0, (y0 + y1) / 2, 0); k.mesh(m, g, u, w, yaw); };
  cyl('tower', 1.84, 2.38, baseTop + 0.4, shaftTop - 0.7, true); // tapered octagonal shaft
  cyl('trim', 2.5, 1.84, shaftTop - 0.7, shaftTop, true); // corbelled flare
  cyl('trim', 2.55, 2.55, shaftTop, shaftTop + 0.4); // gallery deck
  cyl('tower', 1.75, 1.75, shaftTop + 0.4, shaftTop + 2.0); // watch room
  cyl('glow', 1.15, 1.15, shaftTop + 2.0, shaftTop + 4.0, true); // the lantern: lit at night
  cyl('roof', 0.1, 1.45, shaftTop + 4.0, shaftTop + 5.1, false); // cap
  k.box('steel', u - 0.06, u + 0.06, shaftTop + 5.1, LIGHTHOUSE.top, w - 0.06, w + 0.06); // vane
  if (!near) return;
  for (const s of [-1, 1]) for (const y of [12.0, 17.0]) { // the narrow shaft windows
    const ap = (2.38 - (y - baseTop - 0.4) / (shaftTop - 0.7 - baseTop - 0.4) * 0.54) * Math.cos(Math.PI / 8);
    k.box('glass', u - 0.25, u + 0.25, y, y + 1.2, w + s * (ap - 0.05), w + s * (ap + 0.05));
  }
  for (let i = 0; i < 8; i++) { // lantern astragals and gallery posts
    const t = (i + 0.5) * Math.PI / 4 + yaw, r = 1.15 * Math.cos(Math.PI / 8) / Math.cos(Math.PI / 8);
    k.box('steel', u + Math.sin(t) * 1.17 - 0.05, u + Math.sin(t) * 1.17 + 0.05, shaftTop + 2.0, shaftTop + 4.0, w + Math.cos(t) * 1.17 - 0.05, w + Math.cos(t) * 1.17 + 0.05);
    k.box('steel', u + Math.sin(t) * 2.45 - 0.04, u + Math.sin(t) * 2.45 + 0.04, shaftTop + 0.4, shaftTop + 1.4, w + Math.cos(t) * 2.45 - 0.04, w + Math.cos(t) * 2.45 + 0.04);
  }
  const rail = new THREE.CylinderGeometry(2.5, 2.5, 0.08, 8, 1, true); rail.translate(0, shaftTop + 1.4, 0); k.mesh('steel', rail, u, w, yaw);
  k.box('glass', u - 0.7, u + 0.7, 2.2, 5.0, w + 2.95, w + 3.05); // the base block's doorway (south-west)
}

// ---- the 1940 water tower: six cross-braced legs under a 250 000 gallon tank (published 94 ft; legs shortened here, see docs) ----
export function waterTower(k, near) {
  const { u, w, footY, bowlY } = TOWER, top = TOWER.top, seg = near ? 20 : 10, legSeg = near ? 5 : 3;
  const cylY = bowlY + 3.4, roofY = cylY + 5.8;
  const lathe = (pts, m) => { const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg); k.mesh(m, g, u, w); };
  lathe([[0.01, bowlY], [2.4, bowlY + 0.35], [4.2, bowlY + 1.2], [5.6, bowlY + 2.2], [6.4, bowlY + 3.0], [6.6, cylY]], 'steel'); // bowl
  lathe([[6.6, cylY], [6.6, roofY]], 'steel'); // tank wall
  lathe([[6.6, roofY], [6.2, roofY + 0.6], [4.6, roofY + 1.7], [2.0, roofY + 2.4], [0.4, roofY + 2.6]], 'roof'); // shallow dome
  k.box('roof', u - 0.5, u + 0.5, roofY + 2.5, top, w - 0.5, w + 0.5); // vent hatch
  const ring = new THREE.CylinderGeometry(7.5, 7.5, 0.12, seg, 1, false); ring.translate(0, cylY, 0); k.mesh('steel', ring, u, w); // balcony
  const rail = new THREE.CylinderGeometry(7.5, 7.5, 0.1, seg, 1, true); rail.translate(0, cylY + 1.05, 0); k.mesh('steel', rail, u, w);
  const R = (y) => 7.2 + (5.4 - 7.2) * (y - footY) / (bowlY - footY), legAt = (i, y) => [u + R(y) * Math.cos(i * Math.PI / 3), y, w + R(y) * Math.sin(i * Math.PI / 3)];
  const levels = [footY, footY + (bowlY - footY) / 3, footY + (2 * (bowlY - footY)) / 3, bowlY];
  for (let i = 0; i < 6; i++) {
    k.bar('steel', legAt(i, footY), legAt(i, bowlY + 0.2), 0.24, legSeg);
    const j = (i + 1) % 6;
    for (let p = 0; p < 3; p++) {
      const y0 = levels[p], y1 = levels[p + 1];
      k.bar('steel', legAt(i, y0), legAt(j, y1), 0.12, legSeg); k.bar('steel', legAt(j, y0), legAt(i, y1), 0.12, legSeg);
      if (p > 0) k.bar('steel', legAt(i, y0), legAt(j, y0), 0.14, legSeg);
    }
    k.bar('steel', legAt(i, bowlY), legAt(j, bowlY), 0.16, legSeg);
    k.box('base', u + 7.2 * Math.cos(i * Math.PI / 3) - 0.7, u + 7.2 * Math.cos(i * Math.PI / 3) + 0.7, footY, footY + 2.9, w + 7.2 * Math.sin(i * Math.PI / 3) - 0.7, w + 7.2 * Math.sin(i * Math.PI / 3) + 0.7); // concrete footings
  }
  const riser = new THREE.CylinderGeometry(0.45, 0.45, bowlY - footY, near ? 8 : 5, 1, true); riser.translate(0, (bowlY + footY) / 2, 0); k.mesh('steel', riser, u, w);
}

// ---- the Warden's House ruins: a roofless shell, openings kept, stepped gable and a free chimney ----------------
export function ruins(k, near) {
  const { u0, u1, w0, w1, t } = RUIN, tiers = [[0.8, 2.5], [3.9, 5.6], [7.0, 8.7]];
  // [pier height, column height] per bay: the south-west and north-east walls break down toward the right-hand end
  const walls = [
    { axis: 'u', c: w1, inner: -1, a: u0, b: u1, bays: [[10.2, 10.2], [10.2, 9.6], [9.8, 7.0], [9.6, 6.0], [6.4, 6.4]] },
    { axis: 'u', c: w0, inner: 1, a: u0, b: u1, bays: [[10.4, 10.4], [10.0, 10.0], [7.2, 3.4], [10.0, 9.4], [5.6, 5.6]] },
    { axis: 'w', c: u0, inner: 1, a: w0 + t, b: w1 - t, bays: [[10.2, 10.2], [10.2, 10.2], [9.8, 9.8], [10.2, 10.2]], gable: true },
    { axis: 'w', c: u1, inner: -1, a: w0 + t, b: w1 - t, bays: [[7.2, 7.2], [8.4, 4.4], [6.0, 6.0], [7.6, 7.6]] },
  ];
  for (const wl of walls) {
    const L = wl.b - wl.a, nb = wl.bays.length, p = L / nb, ow = 1.25, pw = (p - ow) / 2;
    // a wall slab occupies c .. c + inner * t (towards the inside of the shell)
    const wb = (s0, s1, y0, y1) => {
      if (y1 - y0 < 0.02 || s1 - s0 < 0.02) return;
      const e = wl.c + wl.inner * t, lo = Math.min(wl.c, e), hi = Math.max(wl.c, e);
      if (wl.axis === 'u') k.box('ruin', s0, s1, y0, y1, lo, hi); else k.box('ruin', lo, hi, y0, y1, s0, s1);
    };
    for (let i = 0; i < nb; i++) {
      const s0 = wl.a + i * p, [pierTop, colTop] = wl.bays[i];
      wb(s0, s0 + pw, 0, pierTop); wb(s0 + p - pw, s0 + p, 0, pierTop);
      const o0 = s0 + pw, o1 = s0 + p - pw; let y = 0;
      for (const [y0, y1] of tiers) { // sill / spandrel below each opening
        if (colTop <= y0) { y = colTop; break; }
        wb(o0, o1, y, y0); y = y1;
        if (colTop < y1) { y = colTop; break; }
      }
      if (y < colTop) wb(o0, o1, y, colTop);
    }
    if (wl.gable) { // stepped gable over the north-west end wall
      for (const [h0, h1, half] of [[10.2, 11.0, 5.2], [11.0, 11.8, 3.4], [11.8, 12.6, 1.6]]) {
        const mid = (wl.a + wl.b) / 2; wb(mid - half, mid + half, h0, h1);
      }
    }
  }
  if (near) { // broken floor slabs hanging off the inside of the long walls
    for (const [ua, ub, y, side] of [[u0 + 0.6, u0 + 9.5, 3.4, 1], [u0 + 0.6, u0 + 6.2, 6.7, 1], [u0 + 8.5, u1 - 0.6, 3.4, -1], [u0 + 9.8, u0 + 14.6, 6.7, -1]]) {
      const wall = side > 0 ? w1 : w0, inner = side > 0 ? wall - t : wall + t;
      k.box('ruin', ua, ub, y - 0.15, y + 0.15, Math.min(inner, inner - side * 1.7), Math.max(inner, inner - side * 1.7));
    }
  }
  const cu = u0 + 4.2, cw = (w0 + w1) / 2 + 0.6; // free-standing fireplace stack inside the shell, standing well above the broken walls
  k.box('ruin', cu - 0.8, cu + 0.8, 0, 14.4, cw - 1.0, cw + 1.0);
  k.box('ruin', cu - 1.0, cu + 1.0, 14.4, 14.9, cw - 1.2, cw + 1.2);
  k.box('ruin', u1, u1 + 2.9, 0, 3.4, w0 + 1.6, w0 + 6.6); // low wing at the south-east end
}

// ---- recreation-yard wall: weathered concrete with buttress piers, a pale coping line and a rusty catwalk rail ------
export function yard(k, near) {
  const Y = YARD, cx = YARD_WALL.reduce((a, p) => a + p[0], 0) / YARD_WALL.length, cz = YARD_WALL.reduce((a, p) => a + p[1], 0) / YARD_WALL.length;
  if (near) {
    k.strip('wall', YARD_WALL, Y.thickness, 0, Y.height - Y.coping);
    k.strip('trim', YARD_WALL, Y.copingThickness, Y.height - Y.coping, Y.height); // coping line
  } else k.strip('wall', YARD_WALL, Y.thickness, 0, Y.height);
  k.strip('steel', YARD_WALL, 0.14, Y.height, Y.height + Y.rail);
  if (near) { // buttress piers on the outer face every ~6.2 m
    for (let i = 0; i < YARD_WALL.length - 1; i++) {
      const [a, b] = [YARD_WALL[i], YARD_WALL[i + 1]], dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz), d = [dx / len, dz / len];
      let n = [-d[1], d[0]]; if ((a[0] - cx) * n[0] + (a[1] - cz) * n[1] < 0) n = [-n[0], -n[1]]; // outward, away from the yard
      const count = Math.max(1, Math.round(len / Y.pier.every)), step = len / count;
      for (let j = 0; j <= count; j++) {
        if ((i > 0 && j === 0) || (i < YARD_WALL.length - 2 && j === count)) continue; // corners are shared with the next run
        const t = j * step, off = Y.thickness / 2 + Y.pier.out / 2 - 0.05, pu = a[0] + d[0] * t + n[0] * off, pw = a[1] + d[1] * t + n[1] * off;
        const g = new THREE.BoxGeometry(Y.pier.width, Y.pier.height, Y.pier.out + 0.1); g.translate(0, Y.pier.height / 2, 0);
        k.mesh('base', g, pu, pw, Math.atan2(-dz, dx));
      }
    }
  }
  for (const [u, w] of GUARD_TOWERS) {
    k.box('wall', u - 0.8, u + 0.8, 0, Y.height, w - 0.8, w + 0.8);
    k.box('stone', u - 1.7, u + 1.7, Y.height, Y.height + 2.8, w - 1.7, w + 1.7);
    k.box('glass', u - 1.75, u + 1.75, Y.height + 0.8, Y.height + 2.0, w - 1.75, w + 1.75);
    k.box('roof', u - 2.1, u + 2.1, Y.height + 2.8, Y.height + 3.1, w - 2.1, w + 2.1);
  }
}
