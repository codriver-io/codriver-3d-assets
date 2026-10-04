// Cuypers' Rijksmuseum, as it stands: brown-red brick, pale bands, slate ridges,
// the two north clock towers, the passage under the arch, and the Museumplein
// front. Authored in building axes (rijksmuseum-plan.js). Both LODs share the
// tower clocks, the spire steps and the south roof; near adds dormers and cresting.
import { ARCH, H, TOWER } from './rijksmuseum-plan.js';
import { meshKit } from './rijksmuseum-kit.js';

const S = 14; // passage-arch segments, near
const SF = 8;

export function buildRijksmuseum(b, near) {
  const k = meshKit();
  const steps = near ? S : SF;

  // --- street dressing -------------------------------------------------------
  const bandNS = (mat, u0, u1, v, sign, y, h, proud) => {
    const vo = v + sign * proud, vi = v - sign * 0.08;
    k.box(mat, u0, u1, Math.min(vo, vi), Math.max(vo, vi), y, y + h);
  };
  const bandEW = (mat, v0, v1, u, sign, y, h, proud) => {
    const uo = u + sign * proud, ui = u - sign * 0.08;
    k.box(mat, Math.min(uo, ui), Math.max(uo, ui), v0, v1, y, y + h);
  };
  // A row of windows, or one band on the far model. `sign` −1 faces north / west.
  function rowNS(u0, u1, v, sign, y0, y1) {
    const face = v + sign * 0.12;
    if (!near || u1 - u0 < 6) { k.panelNS('light', u0 + 0.4, u1 - 0.4, y0, y1, face, sign); return; }
    const n = Math.max(1, Math.round((u1 - u0) / 3.5));
    const step = (u1 - u0) / n, w = Math.min(1.55, step * 0.48);
    for (let i = 0; i < n; i++) {
      const c = u0 + (i + 0.5) * step;
      k.panelNS('light', c - w / 2, c + w / 2, y0, y1, face, sign);
    }
  }
  function rowEW(v0, v1, u, sign, y0, y1) {
    const face = u + sign * 0.12;
    if (!near || v1 - v0 < 6) { k.panelEW('light', v0 + 0.4, v1 - 0.4, y0, y1, face, sign); return; }
    const n = Math.max(1, Math.round((v1 - v0) / 3.5));
    const step = (v1 - v0) / n, w = Math.min(1.55, step * 0.48);
    for (let i = 0; i < n; i++) {
      const c = v0 + (i + 0.5) * step;
      k.panelEW('light', c - w / 2, c + w / 2, y0, y1, face, sign);
    }
  }
  // Plinth, string courses, cornice and window rows. `gap` is an opening none
  // of the window rows may cross (the passage and the great window).
  function dressNS(u0, u1, v, sign, top, gap) {
    const spans = gap ? [[u0, gap[0]], [gap[1], u1]] : [[u0, u1]];
    for (const [a, b] of spans) {
      if (b - a < 0.5) continue;
      bandNS('plinth', a, b, v, sign, 0.15, H.plinth, 0.34);
      bandNS('stone', a + 0.08, b - 0.08, v, sign, 7.7, 0.32, 0.16);
      bandNS('stone', a + 0.08, b - 0.08, v, sign, 11.2, 0.3, 0.16);
      rowNS(a, b, v, sign, 4.55, 7.35);
      if (top > 16) rowNS(a, b, v, sign, 8.2, 10.85);
      if (top > 16) rowNS(a, b, v, sign, 12.15, Math.min(top - 1.6, top > 30 ? 21.5 : 16.4));
    }
    bandNS('stone', u0, u1, v, sign, top - 0.55, 0.48, 0.32);
  }
  function dressEW(v0, v1, u, sign, top) {
    bandEW('plinth', v0, v1, u, sign, 0.15, H.plinth, 0.34);
    bandEW('stone', v0, v1, u, sign, 7.55, 0.38, 0.16);
    bandEW('stone', v0, v1, u, sign, 11.05, 0.36, 0.16);
    bandEW('stone', v0, v1, u, sign, top - 0.7, 0.62, 0.36);
    rowEW(v0, v1, u, sign, 4.75, 7.2);
    rowEW(v0, v1, u, sign, 11.6, top - 1.35);
  }

  // Dormer on a u-ridge slope. `sign` −1 means the eave is the north edge.
  function dormer(u, vEave, vRidge, ye, yr, sign) {
    const t = 0.4;
    const v = vEave + (vRidge - vEave) * t;
    const y = ye + (yr - ye) * t - 0.2;
    const du = 1.05, dv = 0.62, h = 2.05;
    k.box('brick', u - du, u + du, v - dv, v + dv, y, y + h, 'bt');
    const vf = v + sign * (dv + 0.02);
    k.panelNS('light', u - du + 0.22, u + du - 0.22, y + 0.32, y + h - 0.2, vf, sign);
    k.box('slate', u - du - 0.12, u + du + 0.12, v - dv - 0.1, v + dv + 0.1, y + h - 0.08, y + h + 0.42, 'b');
  }
  function dormers(u0, u1, vEave, vRidge, ye, yr, sign) {
    if (!near) return;
    const n = Math.max(2, Math.round((u1 - u0) / 9));
    for (let i = 0; i < n; i++) dormer(u0 + (i + 0.5) * (u1 - u0) / n, vEave, vRidge, ye, yr, sign);
  }

  // Segmented glass on a u-ridge slope, lifted off the slate, with a slate
  // mullion in each gap. `bands` are fractions from the eave up to the ridge.
  // The Museumplein slope runs toward −v and needs the flipped winding.
  function slopeGlassU(u0, u1, vEave, vRidge, ye, yr, bands) {
    const pane = near ? 4.6 : 9.5, gap = 0.32;
    const at = (t, u, lift) => {
      const v = vEave + (vRidge - vEave) * t;
      const y = ye + (yr - ye) * t + lift;
      return [u, y, v];
    };
    const put = (mat, a, c, ua, ub, lift) => {
      if (ub - ua < 0.15) return;
      if (vRidge >= vEave) k.quad(mat, at(a, ua, lift), at(c, ua, lift), at(c, ub, lift), at(a, ub, lift));
      else k.quad(mat, at(a, ua, lift), at(a, ub, lift), at(c, ub, lift), at(c, ua, lift));
    };
    for (const [a, c] of bands) {
      let u = u0;
      while (u < u1 - 0.2) {
        const ub = Math.min(u + pane, u1);
        put('glass', a, c, u, ub, 0.55);
        const m1 = ub + gap;
        if (m1 < u1 - 0.15) put('slate', a, c, ub, m1, 0.72);
        u = m1;
      }
    }
  }

  // Continuous semicircular stone ring. `sign` −1 faces north. Outer face is
  // the same on both LODs. Inner radius is half the opening; the ring stands
  // proud of the brick.
  function archivolt(u0, u1, ySpring, vFace, sign, thick, feet = false) {
    const uc = (u0 + u1) / 2, r = (u1 - u0) / 2, R = r + thick;
    const vOut = vFace + sign * 0.22;
    const vIn = vOut - sign * (near ? 1.25 : 0.85);
    const n = Math.max(steps, 2);
    const pt = (rad, i) => {
      const a = Math.PI * (1 - i / n);
      return [uc + rad * Math.cos(a), ySpring + rad * Math.sin(a)];
    };
    for (let i = 0; i < n; i++) {
      const a0 = pt(r, i), a1 = pt(r, i + 1);
      const b0 = pt(R, i), b1 = pt(R, i + 1);
      if (sign < 0) {
        k.quad('stone', [a0[0], a0[1], vOut], [b0[0], b0[1], vOut], [b1[0], b1[1], vOut], [a1[0], a1[1], vOut]);
        k.quad('stone', [a0[0], a0[1], vIn], [a1[0], a1[1], vIn], [a1[0], a1[1], vOut], [a0[0], a0[1], vOut]);
        k.quad('stone', [b0[0], b0[1], vOut], [b1[0], b1[1], vOut], [b1[0], b1[1], vIn], [b0[0], b0[1], vIn]);
      } else {
        k.quad('stone', [a0[0], a0[1], vOut], [a1[0], a1[1], vOut], [b1[0], b1[1], vOut], [b0[0], b0[1], vOut]);
        k.quad('stone', [a0[0], a0[1], vOut], [a0[0], a0[1], vIn], [a1[0], a1[1], vIn], [a1[0], a1[1], vOut]);
        k.quad('stone', [b0[0], b0[1], vIn], [b1[0], b1[1], vIn], [b1[0], b1[1], vOut], [b0[0], b0[1], vOut]);
      }
    }
    if (!feet) return;
    const vv0 = Math.min(vOut, vIn), vv1 = Math.max(vOut, vIn);
    k.box('stone', u0 - thick, u0 + 0.06, vv0, vv1, 0.08, ySpring + 0.12, 'bt');
    k.box('stone', u1 - 0.06, u1 + thick, vv0, vv1, 0.08, ySpring + 0.12, 'bt');
  }

  // Tall arched window: glass, stone ring, mullions and a transom. Near adds
  // an oculus in the head. The glass sits in front of the brick.
  function traceryWindow(u0, u1, ySill, ySpring, vFace, sign) {
    const uc = (u0 + u1) / 2, r = (u1 - u0) / 2, thick = near ? 0.42 : 0.34;
    const vGlass = vFace + sign * 0.16;
    const segs = near ? 12 : 6;
    const pts = [[u0, ySill], [u0, ySpring]];
    for (let i = 1; i < segs; i++) {
      const a = Math.PI * (1 - i / segs);
      pts.push([uc + r * Math.cos(a), ySpring + r * Math.sin(a)]);
    }
    pts.push([u1, ySpring], [u1, ySill]);
    const c = [uc, (ySill + ySpring) / 2];
    for (let i = 0; i < pts.length; i++) {
      const A = pts[i], B = pts[(i + 1) % pts.length];
      if (sign < 0) k.tri('glass', [A[0], A[1], vGlass], [B[0], B[1], vGlass], [c[0], c[1], vGlass]);
      else k.tri('glass', [A[0], A[1], vGlass], [c[0], c[1], vGlass], [B[0], B[1], vGlass]);
    }
    archivolt(u0, u1, ySpring, vFace, sign, thick);
    const vv0 = Math.min(vFace, vFace + sign * 0.42);
    const vv1 = Math.max(vFace, vFace + sign * 0.42);
    k.box('stone', u0 - thick, u0 + 0.02, vv0, vv1, ySill - 0.15, ySpring, 'bt');
    k.box('stone', u1 - 0.02, u1 + thick, vv0, vv1, ySill - 0.15, ySpring, 'bt');
    k.box('stone', u0 - thick, u1 + thick, vv0, vv1, ySill - 0.28, ySill + 0.08, 'bt');
    const mullions = near ? [-0.62, -0.22, 0.22, 0.62] : [-0.38, 0.38];
    for (const f of mullions) {
      const mu = uc + f * r;
      k.box('stone', mu - 0.1, mu + 0.1, vv0, vv1, ySill, ySpring + r * 0.78, 'bt');
    }
    const ty = ySill + (ySpring - ySill) * 0.46;
    k.box('stone', u0 + 0.05, u1 - 0.05, vv0, vv1, ty, ty + 0.24, 'bt');
    if (!near) return;
    const oy = ySpring + r * 0.62, orad = r * 0.2, nR = 8, vR = vFace + sign * 0.36;
    for (let i = 0; i < nR; i++) {
      const a0 = (i / nR) * Math.PI * 2, a1 = ((i + 1) / nR) * Math.PI * 2;
      const ring = (rad, a) => [uc + rad * Math.cos(a), oy + rad * Math.sin(a)];
      const p0 = ring(orad, a0), p1 = ring(orad, a1);
      const q0 = ring(orad + 0.16, a0), q1 = ring(orad + 0.16, a1);
      if (sign < 0) k.quad('stone', [p0[0], p0[1], vR], [q0[0], q0[1], vR], [q1[0], q1[1], vR], [p1[0], p1[1], vR]);
      else k.quad('stone', [p0[0], p0[1], vR], [p1[0], p1[1], vR], [q1[0], q1[1], vR], [q0[0], q0[1], vR]);
    }
  }

  // Crow-stepped stone coping. Both LODs share the outer corners; near adds a
  // pinnacle on every other step, kept inside that corner.
  function crowSteps(u0, u1, vFace, sign, ye, yr) {
    const um = (u0 + u1) / 2;
    const n = near ? 7 : 4;
    const du = (um - u0) / n, dy = (yr - ye) / n;
    const vOut = vFace + sign * 0.48;
    const vBack = vFace + sign * 0.08;
    const vv0 = Math.min(vOut, vBack), vv1 = Math.max(vOut, vBack);
    for (const side of [-1, 1]) {
      for (let i = 0; i < n; i++) {
        const uOuter = um + side * (n - i) * du;
        const uInner = um + side * (n - i - 1) * du;
        const y0 = ye + i * dy, y1 = ye + (i + 1) * dy;
        const ua = Math.min(uOuter, uInner), ub = Math.max(uOuter, uInner);
        k.box('stone', ua, ub, vv0, vv1, y1 - 0.08, y1 + 0.32, 'b');
        const pu0 = side < 0 ? ua : ub - 0.55, pu1 = side < 0 ? ua + 0.55 : ub;
        k.box('stone', pu0, pu1, vv0, vv1, y0, y1 + 0.32, 'b');
        if (near && i % 2 === 0) k.pyramid('stone', pu0, pu1, vv0, vv1, y1 + 0.2, y1 + 1.05);
      }
    }
  }

  // A row of arched windows. The outer stone crown stays under the caller’s
  // cornice; far uses fewer, slightly wider arches inside the same span.
  function archRowNS(u0, u1, v, sign, ySill, ySpring, n) {
    const step = (u1 - u0) / n;
    const r = Math.min(step * 0.3, 1.4);
    const segs = near ? 4 : 3;
    const vGlass = v + sign * 0.16;
    const vStone = v + sign * 0.3;
    const vv0 = Math.min(v, v + sign * 0.36), vv1 = Math.max(v, v + sign * 0.36);
    for (let i = 0; i < n; i++) {
      const c = u0 + (i + 0.5) * step;
      const uL = c - r, uR = c + r;
      k.panelNS('glass', uL, uR, ySill, ySpring, vGlass, sign);
      for (let s = 0; s < segs; s++) {
        const a0 = Math.PI * (1 - s / segs), a1 = Math.PI * (1 - (s + 1) / segs);
        const i0 = [c + r * Math.cos(a0), ySpring + r * Math.sin(a0)];
        const i1 = [c + r * Math.cos(a1), ySpring + r * Math.sin(a1)];
        const o0 = [c + (r + 0.26) * Math.cos(a0), ySpring + (r + 0.26) * Math.sin(a0)];
        const o1 = [c + (r + 0.26) * Math.cos(a1), ySpring + (r + 0.26) * Math.sin(a1)];
        const g0 = [c + r * Math.cos(a0), ySpring + r * Math.sin(a0)];
        const g1 = [c + r * Math.cos(a1), ySpring + r * Math.sin(a1)];
        if (sign < 0) {
          k.tri('glass', [g0[0], g0[1], vGlass], [g1[0], g1[1], vGlass], [c, ySpring, vGlass]);
          k.quad('stone', [i0[0], i0[1], vStone], [o0[0], o0[1], vStone], [o1[0], o1[1], vStone], [i1[0], i1[1], vStone]);
        } else {
          k.tri('glass', [g0[0], g0[1], vGlass], [c, ySpring, vGlass], [g1[0], g1[1], vGlass]);
          k.quad('stone', [i0[0], i0[1], vStone], [i1[0], i1[1], vStone], [o1[0], o1[1], vStone], [o0[0], o0[1], vStone]);
        }
      }
      k.box('stone', uL - 0.2, uL + 0.02, vv0, vv1, ySill - 0.08, ySpring, 'bt');
      k.box('stone', uR - 0.02, uR + 0.2, vv0, vv1, ySill - 0.08, ySpring, 'bt');
    }
  }

  // Stepped slate spire on both LODs: hip, lantern, shoulder, slender needle,
  // and a pinnacle on each corner. The tip is yt. Near adds cresting posts
  // inside that outline. `matTip` is metal near and slate far.
  function spire(u0, u1, v0, v1, yb, yt, matTip) {
    const um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
    const wu = u1 - u0, wv = v1 - v0, rise = yt - yb;
    const ps = Math.min(0.62, wu * 0.07);
    const ph = Math.min(rise * 0.22, 4.6);
    const inset = 0.22;
    for (const [pu, pv] of [
      [u0 + inset, v0 + inset],
      [u1 - inset - ps * 2, v0 + inset],
      [u0 + inset, v1 - inset - ps * 2],
      [u1 - inset - ps * 2, v1 - inset - ps * 2],
    ]) k.pyramid('slate', pu, pu + ps * 2, pv, pv + ps * 2, yb + 0.12, yb + ph);
    const nu = wu * 0.22, nv = wv * 0.22;
    const yN = yb + rise * 0.32;
    k.hip('slate', u0, u1, v0, v1, yb, um - nu, um + nu, vm - nv, vm + nv, yN);
    const yL = yN + Math.min(rise * 0.16, 3.8);
    k.box('brick', um - nu, um + nu, vm - nv, vm + nv, yN - 0.05, yL, 'bt');
    k.box('stone', um - nu - 0.1, um + nu + 0.1, vm - nv - 0.1, vm + nv + 0.1, yL - 0.08, yL + 0.2, 'b');
    k.panelNS('light', um - nu * 0.55, um + nu * 0.55, yN + 0.4, yL - 0.4, vm - nv - 0.12, -1);
    k.panelNS('light', um - nu * 0.55, um + nu * 0.55, yN + 0.4, yL - 0.4, vm + nv + 0.12, 1);
    const yS = yL + rise * 0.14;
    const su = Math.min(0.7, nu * 0.42), sv = Math.min(0.7, nv * 0.42);
    k.hip('slate', um - nu, um + nu, vm - nv, vm + nv, yL + 0.08, um - su, um + su, vm - sv, vm + sv, yS);
    const ns = Math.min(0.38, su * 0.7);
    k.pyramid(matTip, um - ns, um + ns, vm - ns, vm + ns, yS - 0.06, yt);
    if (!near) return;
    for (const [su2, sv2] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const cu = um + su2 * (nu - 0.16), cv = vm + sv2 * (nv - 0.16);
      k.box('stone', cu - 0.1, cu + 0.1, cv - 0.1, cv + 0.1, yL + 0.05, yL + 0.7, 'b');
    }
  }

  // Clock dial on a north or south face. The stone frame and the dark face
  // are the same on both LODs; the hands sit inside the dial.
  function clockNS(uc, v, sign, y0, y1) {
    const s = (y1 - y0) * 0.42;
    const vf = v + sign * 0.28, vb = v + sign * 0.1;
    k.panelNS('stone', uc - s - 0.4, uc + s + 0.4, y0 - 0.32, y1 + 0.32, vb, sign);
    k.panelNS('clock', uc - s, uc + s, y0, y1, vf, sign);
    const mid = (y0 + y1) / 2;
    k.panelNS('stone', uc - 0.07, uc + 0.07, mid, mid + s * 0.62, vf + sign * 0.06, sign);
    k.panelNS('stone', uc - s * 0.42, uc + 0.07, mid - 0.07, mid + 0.07, vf + sign * 0.06, sign);
  }

  // --- north corner pavilions (38 m, pyramidal) ------------------------------
  const corners = [
    { u0: -61.4, u1: -43.35, v0: -38.75, v1: -19.15, face: 'w' },
    { u0: 55.85, u1: 73.2, v0: -38.0, v1: -18.6, face: 'e' },
  ];
  for (const c of corners) {
    k.box('brick', c.u0, c.u1, c.v0, c.v1, 0, H.cornerWall, 'bt');
    k.pyramid('slate', c.u0, c.u1, c.v0, c.v1, H.cornerWall, H.corner);
    dressNS(c.u0 + 0.4, c.u1 - 0.4, c.v0, -1, H.cornerWall);
    if (c.face === 'w') dressEW(c.v0 + 0.4, c.v1 - 0.4, c.u0, -1, H.cornerWall);
    else dressEW(c.v0 + 0.4, c.v1 - 0.4, c.u1, 1, H.cornerWall);
  }

  // --- north galleries, set back from the towers -----------------------------
  const wings = [
    { u0: -43.15, u1: -14.45, v0: -36.9, v1: -19.05 },
    { u0: 16.45, u1: 55.65, v0: -36.45, v1: -18.65 },
  ];
  for (const w of wings) {
    k.box('brick', w.u0, w.u1, w.v0, w.v1, 0, H.wall, 'bt');
    k.gableU('brick', 'slate', w.u0, w.u1, w.v0, w.v1, H.wall, H.gallery, true, false);
    dressNS(w.u0, w.u1, w.v0, -1, H.wall);
    dormers(w.u0 + 1, w.u1 - 1, w.v0, (w.v0 + w.v1) / 2, H.wall, H.gallery, -1);
    slopeGlassU(w.u0 + 1.2, w.u1 - 1.2, w.v0, (w.v0 + w.v1) / 2, H.wall, H.gallery, [[0.64, 0.86]]);
  }

  // --- the two north towers --------------------------------------------------
  for (const t of [TOWER.west, TOWER.east]) {
    k.box('brick', t.u0, t.u1, t.v0, t.v1, 0, H.towerWall, 'bt');
    // back of the tower part, under the gallery roof line, no second spire
    k.box('brick', t.u0, t.u1, t.v1 - 0.3, t.v1 + 3.6, 0, H.towerWall - 0.4, 'bt');
    spire(t.u0, t.u1, t.v0, t.v1, H.towerWall, H.tower, near ? 'metal' : 'slate');
    dressNS(t.u0 + 0.3, t.u1 - 0.3, t.v0, -1, H.towerWall);
    bandNS('stone', t.u0 + 0.2, t.u1 - 0.2, t.v0, -1, 22.2, 0.36, 0.18);
    bandNS('stone', t.u0 + 0.15, t.u1 - 0.15, t.v0, -1, 28.55, 0.34, 0.2);
    archRowNS(t.u0 + 0.85, t.u1 - 0.85, t.v0, -1, 23.5, 26.5, near ? 3 : 2);
    clockNS((t.u0 + t.u1) / 2, t.v0, -1, 29.55, 32.45);
    for (const u of [t.u0, t.u1 - 0.48]) {
      k.box('stone', u, u + 0.48, t.v0 - 0.16, t.v0 + 0.08, 4.3, 33.5, 'bt');
    }
    // outer side of each tower
    const west = t === TOWER.west;
    dressEW(t.v0 + 0.6, t.v1 - 0.4, west ? t.u0 : t.u1, west ? -1 : 1, H.towerWall);
  }

  // --- passage: piers, soffit, arches, the gable between the spires ----------
  // Jambs stay (the void is the gap between the piers). One soffit runs the
  // whole passage so the ceiling does not stop at a court wall.
  const pierV0 = ARCH.north, pierV1 = -28.85;
  const jamb0 = ARCH.u0 - 0.02, jamb1 = ARCH.u1 + 0.02;
  k.box('brick', -3.95, ARCH.u0, pierV0, pierV1, 0, H.bayWall, 'bt');
  k.box('brick', ARCH.u1, 16.25, pierV0, pierV1, 0, H.bayWall, 'bt');
  // Brick above the outer archivolt only, so the semicircle stays open.
  k.box('brick', ARCH.u0 - 0.35, ARCH.u1 + 0.35, ARCH.north + 0.04, ARCH.north + 1.15, H.crown + 0.95, H.bayWall, 'ewb');
  // Ceiling just above the inner crown, narrower than the opening at mid-height.
  k.box('stone', ARCH.mid - 1.5, ARCH.mid + 1.5, ARCH.north + 1.05, ARCH.south - 1.05, H.crown + 0.12, H.crown + 0.46, 'ns');
  k.gableV('brick', 'slate', -3.95, 16.25, pierV0, pierV1, H.bayWall, 30.6, true, true);
  archivolt(ARCH.u0, ARCH.u1, H.spring, ARCH.north, -1, 1.05, true);
  traceryWindow(2.15, 10.25, 9.05, 16.4, ARCH.north, -1);
  crowSteps(-3.95, 16.25, ARCH.north, -1, 19.6, 30.6);
  rowNS(-3.7, jamb0, pierV0, -1, 4.9, 9.4);
  rowNS(jamb1, 16.0, pierV0, -1, 4.9, 9.4);
  bandNS('stone', -3.9, jamb0, pierV0, -1, 12.15, 0.4, 0.18);
  bandNS('stone', jamb1, 16.2, pierV0, -1, 12.15, 0.4, 0.18);
  bandNS('plinth', -3.9, jamb0, pierV0, -1, 0.15, H.plinth, 0.34);
  bandNS('plinth', jamb1, 16.2, pierV0, -1, 0.15, H.plinth, 0.34);
  // the gable statue, buried in the peak and standing proud of it
  k.box('stone', ARCH.mid - 0.45, ARCH.mid + 0.45, ARCH.north - 0.85, ARCH.north + 0.15, 29.4, 33.1, 'b');

  // passage sides through the courts, then the lower ridge
  k.box('brick', -3.95, ARCH.u0, -28.7, 11.25, 0, H.wall, 'bt');
  k.box('brick', ARCH.u1, 16.2, -28.7, 11.25, 0, H.wall, 'bt');
  k.gableV('brick', 'slate', -3.95, 16.2, -28.55, 11.35, H.wall, H.gallery, false, false);

  // --- east and west ranges --------------------------------------------------
  // West range runs south past the Museumplein front (the Phillips wing side).
  k.box('brick', -55.75, -43.55, -19.0, 44.6, 0, H.wall, 'bt');
  k.gableV('brick', 'slate', -55.75, -43.55, -19.0, 44.6, H.wall, H.gallery, false, true);
  dressEW(-18.6, 20.5, -55.75, -1, H.wall);
  // East range
  k.box('brick', 55.95, 67.65, -18.45, 20.2, 0, H.wall, 'bt');
  k.gableV('brick', 'slate', 55.95, 67.65, -18.45, 20.2, H.wall, H.gallery, false, true);
  dressEW(-17.8, 19.6, 67.65, 1, H.wall);

  // --- south galleries -------------------------------------------------------
  const southWings = [
    { u0: -49.1, u1: -14.6, v0: 11.35, v1: 21.5 },
    { u0: 16.5, u1: 55.7, v0: 11.3, v1: 21.55 },
  ];
  for (const w of southWings) {
    k.box('brick', w.u0, w.u1, w.v0, w.v1, 0, H.wall, 'bt');
    k.gableU('brick', 'slate', w.u0, w.u1, w.v0, w.v1, H.wall, H.gallery, false, false);
    dressNS(w.u0, w.u1, w.v1, 1, H.wall);
    dormers(w.u0 + 1, w.u1 - 1, w.v1, (w.v0 + w.v1) / 2, H.wall, H.gallery, 1);
    const ridge = (w.v0 + w.v1) / 2;
    const bands = near ? [[0.1, 0.4], [0.48, 0.82]] : [[0.12, 0.8]];
    slopeGlassU(w.u0 + 0.8, w.u1 - 0.8, w.v1, ridge, H.wall, H.gallery, bands);
  }

  // --- Museumplein central pavilion -----------------------------------------
  // The south front is not the north gable. A continuous slate roof (ridge
  // along the facade) meets a horizontal arcade; a rectangular lantern sits
  // on the ridge. The same shell is on both LODs.
  k.box('brick', -14.45, ARCH.u0, 11.2, ARCH.south, 0, 22, 'bt');
  k.box('brick', ARCH.u1, 26.75, 11.2, ARCH.south, 0, 22, 'bt');
  k.box('brick', ARCH.u0 - 0.35, ARCH.u1 + 0.35, ARCH.south - 1.15, ARCH.south - 0.04, H.crown + 0.95, 22, 'ewb');
  const southEave = ARCH.south - 0.2;
  const southRidgeV = (11.5 + southEave) / 2;
  k.gableU('brick', 'slate', -14.45, 26.75, 11.5, southEave, 22, 29.2, true, true);
  archivolt(ARCH.u0, ARCH.u1, H.spring, ARCH.south, 1, 1.05, true);
  bandNS('plinth', -14.2, jamb0, ARCH.south, 1, 0.15, H.plinth, 0.34);
  bandNS('plinth', jamb1, 26.5, ARCH.south, 1, 0.15, H.plinth, 0.34);
  rowNS(-13.6, jamb0, ARCH.south, 1, 4.7, 7.5);
  rowNS(jamb1, 26.1, ARCH.south, 1, 4.7, 7.5);
  bandNS('stone', -14.2, 26.6, ARCH.south, 1, 10.7, 0.36, 0.18);
  archRowNS(-13.2, 25.4, ARCH.south, 1, 14.4, 18.5, near ? 9 : 5);
  bandNS('stone', -14.3, 26.6, ARCH.south, 1, 21.25, 0.5, 0.26);
  slopeGlassU(-7.2, 19.4, southEave, southRidgeV, 22, 29.2, near ? [[0.12, 0.36], [0.46, 0.68]] : [[0.14, 0.7]]);
  k.box('glass', 0.6, 12.2, southRidgeV - 1.45, southRidgeV + 1.45, 29.05, 31.25, 'b');
  k.box('slate', 0.42, 12.38, southRidgeV - 1.62, southRidgeV - 1.28, 31.32, 31.68, 'b');
  k.box('slate', 0.42, 12.38, southRidgeV + 1.28, southRidgeV + 1.62, 31.32, 31.68, 'b');
  k.box('slate', 0.42, 0.78, southRidgeV - 1.62, southRidgeV + 1.62, 31.32, 31.68, 'b');
  k.box('slate', 12.02, 12.38, southRidgeV - 1.62, southRidgeV + 1.62, 31.32, 31.68, 'b');
  for (const u of (near ? [2.8, 5.2, 7.6, 10.0] : [4.0, 8.6])) {
    k.box('slate', u - 0.08, u + 0.08, southRidgeV + 1.48, southRidgeV + 1.66, 29.25, 31.12, 'bt');
  }

  // south turrets flanking the arch, and the two outer ones
  const turrets = [
    { u0: -14.95, u1: -8.55, v0: 20.55, v1: 27.4 },
    { u0: 20.3, u1: 26.75, v0: 20.55, v1: 27.55 },
    { u0: -62.6, u1: -55.95, v0: 20.45, v1: 27.25 },
    { u0: 67.7, u1: 74.45, v0: 21.0, v1: 28.65 },
  ];
  for (const t of turrets) {
    k.box('brick', t.u0, t.u1, t.v0, t.v1, 0, H.turretWall, 'bt');
    spire(t.u0, t.u1, t.v0, t.v1, H.turretWall, H.turret, near ? 'metal' : 'slate');
    dressNS(t.u0 + 0.25, t.u1 - 0.25, t.v1, 1, Math.min(H.turretWall, 22));
  }

  // southeast block between the east range and the outer turret (tagged 31 m)
  k.box('brick', 55.75, 67.5, 20.45, 28.5, 0, 24, 'bt');
  k.pyramid('slate', 55.75, 67.5, 20.45, 28.5, 24, 31);
  // southwest annexes tagged on the Phillips side, so the outline is not a hole
  k.box('brick', -61.45, -56.05, 27.15, 44.65, 0, 16, 'bt');
  k.pyramid('slate', -61.45, -56.05, 27.15, 44.65, 16, 20);
  k.box('brick', -43.6, -40.8, 26.6, 44.7, 0, 8, 'b');
  k.box('brick', -43.5, -39.55, 22.1, 26.35, 0, 10, 'b');

  // garden step in front of the arch: the mapped 17 m part is not a wall in the
  // Museumplein photograph, so it stays a low plinth and the arch stays open
  k.box('plinth', -4.3, ARCH.u0 - 0.2, 27.2, 37.2, 0, 1.35, 'b');
  k.box('plinth', ARCH.u1 + 0.2, 16.05, 27.2, 37.2, 0, 1.35, 'b');

  // courtyard atria: glass gables in the courts, under the slate ridges
  const atrium = (u0, u1, v0, v1) => {
    const ye = 18.2, yr = 22.4, vm = (v0 + v1) / 2;
    k.gableU('glass', 'glass', u0, u1, v0, v1, ye, yr, false, false);
    if (!near) return;
    k.box('slate', u0 + 0.4, u1 - 0.4, vm - 0.16, vm + 0.16, yr + 0.04, yr + 0.38, 'b');
  };
  atrium(-41.6, -6.2, -16.8, 9.2);
  atrium(18.2, 53.6, -16.4, 9.4);

  // Asian pavilion. The OSM ring is not a rectangle; this box is inscribed in it
  // (way 517791046), tagged 7 m, white with a glass cap.
  k.box('white', -33.3, -25.5, 32.4, 41.4, 0, 6.35, 'bt');
  k.box('glass', -32.5, -26.3, 33.2, 40.6, 6.15, 7.0, 'b');
  if (near) {
    rowNS(-32.6, -26.2, 41.4, 1, 1.6, 4.3);
    rowEW(33.4, 40.0, -33.3, -1, 1.6, 4.3);
  } else {
    k.panelNS('light', -32.4, -26.4, 1.6, 4.3, 41.52, 1);
  }

  k.flush(b);
}
