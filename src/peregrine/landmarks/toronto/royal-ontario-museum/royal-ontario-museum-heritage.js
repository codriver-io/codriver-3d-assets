import { PARTS } from './royal-ontario-museum-site.js';
import { inside2, area2 } from './royal-ontario-museum-solids.js';

// The heritage wings: Darling & Pearson's 1914 west wing (Romanesque-Italianate, grey-brown stone, slate roof),
// Chapman & Oxley's 1933 east wing (Byzantine-Romanesque, buff stone, copper roofs, gabled naves, domed rotunda)
// and the 1960s concrete curatorial block. Masses and heights are the OSM building parts; facade rhythm (bay pitch,
// window rows, courses) is read from photographs and is estimated.

const bbox = (ring) => ({ u0: Math.min(...ring.map((p) => p[0])), u1: Math.max(...ring.map((p) => p[0])), v0: Math.min(...ring.map((p) => p[1])), v1: Math.max(...ring.map((p) => p[1])) });

export function buildHeritage(K, { near }) {
  const outward = (ring, a, b) => { const ccw = area2(ring) > 0, du = b[0] - a[0], dv = b[1] - a[1], l = Math.hypot(du, dv); return ccw ? [dv / l, -du / l] : [-dv / l, du / l]; };

  /** Dressing helpers bound to one vertical wall face F running a -> b with outward normal n (in u,v). */
  function wall(F, a, b, n) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const P = (t, y) => [a[0] + (b[0] - a[0]) * t, y, a[1] + (b[1] - a[1]) * t];
    const x = (m) => m / L; // metres along the wall -> t
    const rect = (t0, y0, t1, y1) => [P(t0, y0), P(t1, y0), P(t1, y1), P(t0, y1)];
    /** Window centred at metre `c` along the wall, width w, from y to y+h, round-headed when `arch`. */
    const win = (c, y, w, h, { arch = false, surround = true, mat = 'window', frame = 0.12 } = {}) => {
      const tc = x(c), hw = x(w / 2), rise = arch ? w / 2 : 0, top = y + h - rise;
      const shape = (grow) => {
        const g = grow, pts = [P(tc - hw - x(g), y - g), P(tc + hw + x(g), y - g), P(tc + hw + x(g), top)];
        if (arch) { const N = near ? 8 : 4; for (let i = 1; i < N; i++) { const th = Math.PI * i / N; pts.push(P(tc + (hw + x(g)) * Math.cos(th), top + (rise + g) * Math.sin(th))); } pts.push(P(tc - hw - x(g), top)); } else { pts.push(P(tc + hw + x(g), top + g)); pts.push(P(tc - hw - x(g), top + g)); }
        return pts;
      };
      if (surround && near) K.patch(F, shape(0.32), 'stoneDeep', 0.05);
      K.glaze(F, shape(0), { mat, frame: near ? frame : 0, off: 0.1 });
    };
    /** A horizontal course (plinth, string course, cornice): projects `out` metres. */
    const course = (y, h, out = 0.25, mat = 'stoneDeep', t0 = 0, t1 = 1) => near && K.patch(F, rect(t0, y, t1, y + h), mat, out);
    /** Regular rows of windows: `rows` [{ y, h, w, arch }], every `pitch` metres, keeping `margin` from the ends. */
    const rows = (rs, pitch, margin = 2.6) => {
      const bays = Math.max(1, Math.floor((L - 2 * margin) / pitch)), start = (L - (bays - 1) * pitch) / 2;
      for (let k = 0; k < bays; k++) for (const r of rs) win(start + k * pitch, r.y, r.w, r.h, r);
    };
    return { L, P, x, rect, win, course, rows };
  }

  // A wall is exterior when nothing else of the museum stands 1.5 m out from its midpoint.
  const solidParts = Object.entries(PARTS).filter(([k]) => !/^c[A-I]$|cBase|steps1|canopy|ePorchB|eRotDrum|eRotCap/.test(k));
  const exterior = (self, ring, a, b, n) => {
    const m = [(a[0] + b[0]) / 2 + n[0] * 1.5, (a[1] + b[1]) / 2 + n[1] * 1.5];
    for (const [k, r] of solidParts) if (k !== self && inside2(r, m[0], m[1])) return false;
    return !inside2(ring, m[0], m[1]);
  };

  /** A flat-roofed masonry block; `dress(Wall, face)` is called for every exterior wall longer than 5 m. */
  function block(name, h, { wallMat = 'stone', roofMat = 'roofFlat', dress = null } = {}) {
    const ring = PARTS[name], f = K.slab({ ring, y0: 0, roof: () => h, mats: { wall: wallMat, roof: roofMat } });
    if (dress) f.walls.forEach((F) => {
      if (!F) return; const a = F.a, b = F.b, n = outward(ring, a, b);
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 5 && exterior(name, ring, a, b, n)) dress(wall(F, a, b, n), F, h);
    });
    return f;
  }

  // ---------- 1933 east wing --------------------------------------------------------------------------------------------
  // Three-bay masonry rhythm: 3 rows of windows, string courses between, heavy plinth and cornice.
  const eastRows = [{ y: 3.4, h: 4.6, w: 3.0 }, { y: 9.6, h: 5.0, w: 3.0 }, { y: 15.4, h: 2.4, w: 2.2, arch: true }];
  const eastDress = (W, F, h) => { W.course(0, 1.5, 0.22); W.course(8.7, 0.5, 0.15); W.course(14.6, 0.5, 0.15); W.course(h - 0.9, 0.9, 0.35); W.rows(eastRows, 5.6); };

  /** Gabled nave: long walls, two gable ends, copper roof. Returns the two gable-end walls for dressing. */
  function nave(name, eave, ridge) {
    const { u0, u1, v0, v1 } = bbox(PARTS[name]), um = (u0 + u1) / 2;
    const Wl = K.face([[u0, 0, v1], [u0, 0, v0], [u0, eave, v0], [u0, eave, v1]], 'stone', [-1, 0, 0]);
    const We = K.face([[u1, 0, v0], [u1, 0, v1], [u1, eave, v1], [u1, eave, v0]], 'stone', [1, 0, 0]);
    const Gn = K.face([[u1, 0, v0], [u0, 0, v0], [u0, eave, v0], [um, ridge, v0], [u1, eave, v0]], 'stone', [0, 0, -1]);
    const Gs = K.face([[u0, 0, v1], [u1, 0, v1], [u1, eave, v1], [um, ridge, v1], [u0, eave, v1]], 'stone', [0, 0, 1]);
    const ov = 0.6, ex = 0.35;
    K.face([[u0 - ov, eave - 0.1, v1 + ex], [u0 - ov, eave - 0.1, v0 - ex], [um, ridge + 0.05, v0 - ex], [um, ridge + 0.05, v1 + ex]], 'copper', [-0.5, 1, 0]);
    K.face([[u1 + ov, eave - 0.1, v0 - ex], [u1 + ov, eave - 0.1, v1 + ex], [um, ridge + 0.05, v1 + ex], [um, ridge + 0.05, v0 - ex]], 'copper', [0.5, 1, 0]);
    return { u0, u1, v0, v1, um, Gn, Gs, Wl, We };
  }

  const aisleDress = (W, F, h) => { W.course(0, 1.4, 0.2); W.course(h - 0.9, 0.9, 0.3); if (W.L < 9) W.rows([{ y: 3.6, h: 4.4, w: 2.2 }, { y: 9.8, h: 4.8, w: 2.2 }, { y: 15.6, h: 1.6, w: 1.6, arch: true }], 6, 1.2); };
  // North block, facing Bloor Street: the gable end is the postcard face.
  const eN = nave('eNaveN', 20, 24);
  block('eAisleNW', 18, { dress: aisleDress });
  block('eAisleNE', 18, { dress: (W, F, h) => { eastDress(W, F, h); } });
  {
    const W = wall(eN.Gn, [eN.u1, eN.v0], [eN.u0, eN.v0], [0, -1]), c = W.L / 2;
    W.course(0, 1.5, 0.25); W.course(8.4, 0.45, 0.18);
    W.win(c, 9.8, 6.6, 9.6, { arch: true, frame: 0.2 });       // the tall round-headed window under a carved arch
    if (near) for (const k of [-1.1, 1.1]) K.patch(eN.Gn, W.rect(W.x(c + k - 0.13), 9.8, W.x(c + k + 0.13), 17.6), 'stoneDeep', 0.2);
    W.win(c, 3.3, 6.6, 4.2, { frame: 0.2 });                   // the three-light window below it
    if (near) K.patch(eN.Gn, W.rect(W.x(c - 0.7), 21.2, W.x(c + 0.7), 22.8), 'stoneDeep', 0.08);
  }
  block('eRot', 26);
  block('eAisleSW', 18, { dress: aisleDress });
  block('eAisleSE', 18, { dress: (W, F, h) => eastDress(W, F, h) });
  const eS = nave('eNaveS', 20, 24);
  {
    const W = wall(eS.Gs, [eS.u0, eS.v1], [eS.u1, eS.v1], [0, 1]), c = W.L / 2;
    W.course(0, 1.5, 0.25); W.win(c, 3.3, 5.0, 4.4); W.win(c, 9.6, 5.0, 5.8, { arch: true }); K.patch(eS.Gs, W.rect(W.x(c - 0.7), 21.2, W.x(c + 0.7), 22.8), 'stoneDeep', 0.08);
  }

  // ---------- Rotunda: octagonal drum and copper pyramid ------------------------------------------------------------------
  K.slab({ ring: PARTS.eRotDrum, y0: 26, roof: () => 30, mats: { wall: 'stone', roof: 'stoneDeep', base: 'stone' } });
  const cap = PARTS.eRotCap, cx = cap.reduce((s, p) => s + p[0], 0) / cap.length, cz = cap.reduce((s, p) => s + p[1], 0) / cap.length;
  for (let i = 0; i < cap.length; i++) { const a = cap[i], b = cap[(i + 1) % cap.length]; K.face([[a[0], 30, a[1]], [b[0], 30, b[1]], [cx, 33.6, cz]], 'copper', [(a[0] + b[0]) / 2 - cx, 1, (a[1] + b[1]) / 2 - cz]); }
  // East entrance porch (Weston wing) on the Queen's Park face: a grand round-headed window over the doors, flanking piers, steps.
  {
    const bb = bbox(PARTS.ePorchA), u1 = bb.u1 - 0.2, v0 = bb.v0 + 0.3, v1 = bb.v1 - 0.3, h = 23.5;
    K.face([[47.3, 0, v0], [u1, 0, v0], [u1, h, v0], [47.3, h, v0]], 'stone', [0, 0, -1]);
    K.face([[u1, 0, v1], [47.3, 0, v1], [47.3, h, v1], [u1, h, v1]], 'stone', [0, 0, 1]);
    K.face([[47.3, h, v0], [u1, h, v0], [u1, h, v1], [47.3, h, v1]], 'roofFlat', [0, 1, 0]);
    const F = K.face([[u1, 0, v0], [u1, 0, v1], [u1, h, v1], [u1, h, v0]], 'stone', [1, 0, 0]);
    {
      const W = wall(F, [u1, v0], [u1, v1], [1, 0]), c = W.L / 2;
      W.course(0, 1.8, 0.3); W.course(6.4, 0.8, 0.4); W.course(h - 1.3, 1.3, 0.5);
      W.win(c, 8.6, 7.0, 12.4, { arch: true, frame: 0.2 });                  // the tall stained-glass window under the carved arch
      if (near) for (const k of [-1.2, 1.2]) K.patch(F, W.rect(W.x(c + k - 0.14), 8.6, W.x(c + k + 0.14), 18.5), 'stoneDeep', 0.2); // stone mullions between the three lights
      for (const k of [-2.6, 0, 2.6]) W.win(c + k, 1.9, 2.0, 4.2, { mat: 'glass', frame: 0.14 }); // the three doors
      for (const k of [-6.8, 6.8]) W.course(0, h - 1.3, 0.35, 'stoneDeep', W.x(c + k - 0.7), W.x(c + k + 0.7)); // flanking piers
    }
    K.slab({ ring: PARTS.steps1, y0: 0, roof: () => 1.5, mats: { wall: 'concrete', roof: 'concrete' } });
  }

  // ---------- 1914 west wing, central range, concrete block --------------------------------------------------------------
  const westRows = [{ y: 3.6, h: 4.8, w: 2.6, arch: true }, { y: 10.4, h: 5.2, w: 2.6, arch: true }, { y: 17.4, h: 4.6, w: 2.4, arch: true }];
  const westDress = (W, F, h) => { W.course(0, 1.6, 0.22); W.course(9.0, 0.45, 0.14); W.course(16.2, 0.45, 0.14); W.course(h - 1.1, 1.1, 0.4); W.rows(westRows, 5.0); };
  block('west', 25, { wallMat: 'stoneWest', roofMat: 'slate', dress: westDress });
  block('central', 25, { wallMat: 'stoneWest', dress: westDress });
  const slits = (W, F, h) => { W.course(h - 0.6, 0.6, 0.2, 'roofFlat'); const bays = Math.floor(W.L / 4.2); for (let k = 0; k < bays; k++) W.win(2.1 + k * 4.2, 8, 0.9, 12, { surround: false }); };
  block('curatorial', 28, { wallMat: 'concrete', dress: slits });
  // Rooftop plant on the flat roofs (estimated positions): keeps the big roofs from reading as blank plates from above.
  for (const [u, v, w, d, h] of [[-8, 34, 9, 5, 3], [4, 46, 6, 6, 2.4], [-36, 60, 8, 5, 2.6], [8, 58, 5, 3, 2]]) {
    const y = u === -36 ? 25 : 28;
    K.face([[u - w / 2, y, v - d / 2], [u + w / 2, y, v - d / 2], [u + w / 2, y + h, v - d / 2], [u - w / 2, y + h, v - d / 2]], 'concrete', [0, 0, -1]);
    K.face([[u + w / 2, y, v + d / 2], [u - w / 2, y, v + d / 2], [u - w / 2, y + h, v + d / 2], [u + w / 2, y + h, v + d / 2]], 'concrete', [0, 0, 1]);
    K.face([[u - w / 2, y, v + d / 2], [u - w / 2, y, v - d / 2], [u - w / 2, y + h, v - d / 2], [u - w / 2, y + h, v + d / 2]], 'concrete', [-1, 0, 0]);
    K.face([[u + w / 2, y, v - d / 2], [u + w / 2, y, v + d / 2], [u + w / 2, y + h, v + d / 2], [u + w / 2, y + h, v - d / 2]], 'concrete', [1, 0, 0]);
    K.face([[u - w / 2, y + h, v - d / 2], [u + w / 2, y + h, v - d / 2], [u + w / 2, y + h, v + d / 2], [u - w / 2, y + h, v + d / 2]], 'roofFlat', [0, 1, 0]);
  }
  block('pavA', 15, { wallMat: 'concrete' });
  block('pavB', 15, { wallMat: 'concrete' });
  block('pavC', 5, { wallMat: 'concrete' });
}
