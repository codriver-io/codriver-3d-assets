// CN Tower: the four things a driver reads from the road, each a function of the builder.
// shaft() the hexagonal core with its three elevator glass slots, legs() the three fins,
// pod() the main pod and SkyPod, antenna() the mast. Numbers live in cn-tower-shape.js.
import { lathe, quads, beamList, at } from './cn-tower-mesh.js';
import { HEX, hexRadius, LEG, legCrestRadius, legWidth, LEG_BEARINGS, STRIP_BEARINGS, BASE, POD, SKYPOD, ANTENNA, TIP } from './cn-tower-shape.js';

const RAD = Math.PI / 180;

/** The outline of the core at unit radius: six vertices; with `t`, the three glass-slot vertices are cut back into chamfers `t` along each face. */
function coreOutline(t) {
  const pts = []; // { p: [x, z], slot: true when the edge STARTING at this point is a glass chamfer }
  for (let k = 0; k < 6; k++) {
    const bearing = HEX.vertex0 + 60 * k, v = at(bearing, 1, 0), vp = at(bearing - 60, 1, 0), vn = at(bearing + 60, 1, 0);
    const isSlot = t > 0 && STRIP_BEARINGS.some((s) => Math.abs(((s - bearing + 540) % 360) - 180) < 1);
    if (!isSlot) { pts.push({ p: [v[0], v[2]], slot: false }); continue; }
    pts.push({ p: [v[0] + (vp[0] - v[0]) * t, v[2] + (vp[2] - v[2]) * t], slot: true });
    pts.push({ p: [v[0] + (vn[0] - v[0]) * t, v[2] + (vn[2] - v[2]) * t], slot: false });
  }
  return pts;
}
// The glass slot is ~12% of the core wide and narrows with it: 4.4 m at grade, 2.2 m under the pod (photographs).
const SLOT_T0 = 0.245, SLOT_T1 = 0.15, slotT = (h) => SLOT_T0 + (SLOT_T1 - SLOT_T0) * Math.min(1, h / HEX.hPod);

/** The hexagonal concrete core, grade to the SkyPod, and its three glazed slots with their LED lines. */
export function shaft(b) {
  const concrete = [], glass = [], glow = [];
  // the tapering, slotted part of the core: outlines at grade and at the pod (chamfers differ, faces stay planar)
  const lo = coreOutline(SLOT_T0), hi = coreOutline(SLOT_T1);
  for (let i = 0; i < lo.length; i++) {
    const a = lo[i], e = lo[(i + 1) % lo.length], a2 = hi[i], e2 = hi[(i + 1) % hi.length];
    const face = [[a.p[0] * HEX.r0, 0, a.p[1] * HEX.r0], [e.p[0] * HEX.r0, 0, e.p[1] * HEX.r0], [e2.p[0] * HEX.rPod, HEX.hPod, e2.p[1] * HEX.rPod], [a2.p[0] * HEX.rPod, HEX.hPod, a2.p[1] * HEX.rPod], [(a.p[0] + e.p[0]) / 2, 0, (a.p[1] + e.p[1]) / 2]];
    (a.slot ? glass : concrete).push(face);
    if (a.slot) {
      // the LED line down the middle of the slot, a few centimetres proud of the glass
      const row = (h, sgn) => {
        const o = coreOutline(slotT(h)), j = i, pa = o[j].p, pe = o[(j + 1) % o.length].p, R = hexRadius(h);
        const m = [(pa[0] + pe[0]) / 2, (pa[1] + pe[1]) / 2], mLen = Math.hypot(...m), d = [pe[0] - pa[0], pe[1] - pa[1]], dLen = Math.hypot(...d);
        return [m[0] * R + (m[0] / mLen) * 0.03 + (d[0] / dLen) * 0.42 * sgn, h, m[1] * R + (m[1] / mLen) * 0.03 + (d[1] / dLen) * 0.42 * sgn];
      };
      glow.push([row(2, -1), row(2, 1), row(HEX.hPod - 13, 1), row(HEX.hPod - 13, -1), [(a.p[0] + e.p[0]) / 2, 0, (a.p[1] + e.p[1]) / 2]]);
    }
  }
  const plain = coreOutline(0), ring = (outline, h0, h1, ra, rb) => {
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], e = outline[(i + 1) % outline.length];
      concrete.push([[a.p[0] * ra, h0, a.p[1] * ra], [e.p[0] * ra, h0, e.p[1] * ra], [e.p[0] * rb, h1, e.p[1] * rb], [a.p[0] * rb, h1, a.p[1] * rb], [(a.p[0] + e.p[0]) / 2, 0, (a.p[1] + e.p[1]) / 2]]);
    }
  };
  ring(coreOutline(SLOT_T1), HEX.hPod, HEX.hStep, HEX.rPod, HEX.rPod);
  ring(plain, HEX.hStep, 440.6, HEX.rTop, HEX.rTop);
  quads(b, 'concrete_dark', concrete);
  quads(b, 'glass', glass);
  quads(b, 'glow', glow);
}

/** The three buttress legs: a tapering fin on alternate faces whose outer crest slopes into the core at 330 m. */
export function legs(b, { near }) {
  const n = near ? 26 : 10, left = [], right = [], crest = [];
  for (const bearing of LEG_BEARINGS) {
    const u = [Math.sin(bearing * RAD), 0, -Math.cos(bearing * RAD)], l = [Math.cos(bearing * RAD), 0, Math.sin(bearing * RAD)];
    const st = [];
    for (let k = 0; k <= n; k++) {
      const h = LEG.hTop * (k / n) ** 1.0, r = legCrestRadius(h), w = legWidth(r, h);
      st.push({ h, r, w, l0: [u[0] * r - l[0] * w / 2, u[2] * r - l[2] * w / 2], r0: [u[0] * r + l[0] * w / 2, u[2] * r + l[2] * w / 2] });
    }
    for (let k = 0; k < n; k++) {
      const s = st[k], t = st[k + 1];
      left.push([[s.l0[0], 0, s.l0[1]], [t.l0[0], 0, t.l0[1]], [t.l0[0], t.h, t.l0[1]], [s.l0[0], s.h, s.l0[1]], [-l[0], 0, -l[2]]]);
      right.push([[s.r0[0], 0, s.r0[1]], [t.r0[0], 0, t.r0[1]], [t.r0[0], t.h, t.r0[1]], [s.r0[0], s.h, s.r0[1]], [l[0], 0, l[2]]]);
      crest.push([[s.l0[0], s.h, s.l0[1]], [t.l0[0], t.h, t.l0[1]], [t.r0[0], t.h, t.r0[1]], [s.r0[0], s.h, s.r0[1]], [u[0], 0.12, u[2]]]);
    }
  }
  quads(b, 'concrete', left); quads(b, 'concrete', right); quads(b, 'concrete', crest);
}

/** The round base the legs rise from (mapped: a 23.2 m radius circle). */
export function base(b, { near }) {
  const seg = near ? 96 : 32;
  lathe(b, 'concrete', [[BASE.r, 0], [BASE.r, BASE.h]], seg);
  lathe(b, 'dark', [[BASE.r, BASE.h], [7.0, BASE.h]], seg);
  if (near) lathe(b, 'metal', [[BASE.r, BASE.h], [BASE.r, BASE.h + 0.9]], seg);
}

const closed = (b, mat, r, h0, h1, seg) => {
  lathe(b, mat, [[r, h0], [r, h1]], seg);
  lathe(b, mat, [[r, h1], [0.02, h1]], seg);
  lathe(b, mat, [[0.02, h0], [r, h0]], seg);
};

/** The main pod (radome, coffered ring, two glazed public levels, EdgeWalk ledge, sloping roof, drum) and the SkyPod. */
export function pod(b, { near }) {
  const seg = near ? 96 : 40, tangent = (deg) => [Math.cos(deg * RAD), 0, Math.sin(deg * RAD)];
  lathe(b, 'dark', POD.soffit, seg);
  lathe(b, 'white', POD.radome, seg);
  lathe(b, 'concrete', POD.ring, seg);
  for (const [mat, r0, h0, r1, h1] of POD.bands) lathe(b, mat, [[r0, h0], [r1, h1]], seg);
  lathe(b, 'metal', [[POD.rMax, POD.ledge], [POD.ledgeIn, POD.ledge]], seg); // ledge top (EdgeWalk deck)
  lathe(b, 'dark', POD.roofCone, seg);
  // the drum: a red stripe on its foot, white above (two runs, never a proud ring: no coplanar overlap)
  {
    const d = POD.drum, r = (h) => d[0][0] + (d[1][0] - d[0][0]) * (h - d[0][1]) / (d[1][1] - d[0][1]);
    const h1 = d[0][1] + POD.redBand;
    lathe(b, 'red', [[d[0][0], d[0][1]], [r(h1), h1]], seg);
    lathe(b, 'white', [[r(h1), h1], ...d.slice(1)], seg, { crease: [1] });
  }
  lathe(b, 'metal', [[14.5, POD.roofH], [4.0, POD.roofH]], seg);

  // roof cabinets: the grey equipment boxes against the shaft that read against the sky
  const cabinets = near ? [[46.4, 6.9, 4.4, 6.2, 3.6], [286.4, 6.9, 4.4, 6.2, 3.6], [166.4, 6.7, 3.6, 4.6, 3.2]] : [[46.4, 6.9, 4.4, 6.2, 3.6], [286.4, 6.9, 4.4, 6.2, 3.6]];
  for (const [bearing, r, w, h, d] of cabinets) {
    const c = at(bearing, r, POD.roofH + 0.4);
    beamList(b, 'metal', [{ from: c, to: [c[0], POD.roofH + 0.4 + h, c[2]], side: tangent(bearing), width: w, thick: d }]);
  }

  if (near) {
    // twelve concrete brackets carrying the pod, sloping from the shaft up to the bowl
    const ribs = [];
    for (let i = 0; i < 12; i++) {
      const bearing = 16.4 + 30 + i * 30;
      ribs.push({ from: at(bearing, 6.8, 319.6), to: at(bearing, 15.6, 329.6), side: tangent(bearing), width: 1.1, thick: 0.9 });
    }
    beamList(b, 'dark', ribs);
    // twelve diagonal struts across the coffered ring
    const struts = [];
    for (let i = 0; i < 12; i++) {
      const bearing = i * 30;
      struts.push({ from: at(bearing, 21.7, 338.5), to: at(bearing, 24.0, 342.6), side: tangent(bearing), width: 0.9, thick: 0.7 });
    }
    beamList(b, 'concrete', struts);
    // vertical mullions across the two dark glass levels
    for (const [mat, r0, h0, r1, h1] of POD.bands) {
      if (mat !== 'glass') continue;
      const list = [], N = 96;
      for (let i = 0; i < N; i++) {
        const bearing = i * 360 / N;
        list.push({ from: at(bearing, r0 + 0.04, h0), to: at(bearing, r1 + 0.04, h1), side: tangent(bearing), width: 0.22, thick: 0.2 });
      }
      beamList(b, 'dark', list);
    }
    // EdgeWalk: guard-rail posts and top rail on the ledge
    const posts = [];
    for (let i = 0; i < 60; i++) { const bearing = i * 6; posts.push({ from: at(bearing, POD.rMax + 0.1, POD.ledge), to: at(bearing, POD.rMax + 0.1, POD.ledge + 1.25), side: tangent(bearing), width: 0.16, thick: 0.16 }); }
    beamList(b, 'metal', posts);
    lathe(b, 'metal', [[POD.rMax + 0.18, POD.ledge + 1.1], [POD.rMax + 0.18, POD.ledge + 1.25]], 96);
  }

  // SkyPod: white bowl, glazed rim, white cone that carries the antenna
  lathe(b, 'white', SKYPOD.bowl, seg);
  lathe(b, 'glass', SKYPOD.rim, seg);
  lathe(b, 'white', SKYPOD.cone, seg);
  if (near) {
    const list = [];
    for (let i = 0; i < 48; i++) list.push({ from: at(i * 7.5, SKYPOD.rim[0][0] + 0.03, SKYPOD.rim[0][1]), to: at(i * 7.5, SKYPOD.rim[1][0] + 0.03, SKYPOD.rim[1][1]), side: tangent(i * 7.5), width: 0.2, thick: 0.16 });
    beamList(b, 'white', list);
  }
}

/** The 102 m broadcast mast: three telescoping white sections with red and dark bands, and a red-tipped spire. */
export function antenna(b, { near }) {
  const seg = near ? 32 : 12, A = ANTENNA;
  lathe(b, 'white', [[A.base.r, A.base.h0], [A.base.r, A.base.h1]], seg);
  closed(b, 'dark', A.collar.r, A.collar.h0, A.collar.h1, seg);
  closed(b, 'red', A.redRing.r, A.redRing.h0, A.redRing.h1, seg);
  lathe(b, 'white', [[A.mid.r, A.mid.h0], [A.mid.r, A.mid.h1]], seg);
  closed(b, 'dark', A.midCollar.r, A.midCollar.h0, A.midCollar.h1, seg);
  closed(b, 'red', A.midRed.r, A.midRed.h0, A.midRed.h1, seg);
  lathe(b, 'white', [[A.mast.r, A.mast.h0], [A.mast.r, A.mast.h1]], seg);
  for (const [h0, h1, mat] of A.bands) closed(b, mat, A.mast.r + 0.1, h0, h1, seg);
  lathe(b, 'red', [[A.spire.r * 1.6, A.spire.h0], [A.spire.r, TIP]], Math.max(6, seg / 2));
  lathe(b, 'red', [[A.spire.r, TIP], [0.02, TIP]], Math.max(6, seg / 2));
}
