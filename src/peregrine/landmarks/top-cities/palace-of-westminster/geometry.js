import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PLAN as P } from './palace-of-westminster-plan.js';
import { kit } from './palace-of-westminster-kit.js';

// Palace of Westminster in the building frame (+x toward Elizabeth Tower, +z toward the Thames).
// Finished meshes are rotated once onto east/up/south. Courts stay open: Lords (x -116..-83, z 3..29),
// the central-north court (x 50..86, z -3..10) and the north court (x 98..131, z -16..15).
// Heights other than the three tower tips are estimated; see the landmark doc.

const CLOCK_HALF = 6.5;

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = kit(b, near);
  const trim = near ? 'trim' : 'stone';
  const sides = near ? 8 : 6;

  // A range. Roofs are inset 0.85 m, so a wall overlap under that leaves the pitches clear of each other.
  const block = (x0, x1, z0, z1, wall, ridge) => {
    if (x1 - x0 < 0.4 || z1 - z0 < 0.4) return;
    if (!ridge || ridge < wall + 0.6) k.box('stone', x0, x1, 0, wall, z0, z1, 'd');
    else k.house(x0, x1, z0, z1, wall, ridge);
  };

  // Ranges follow the mapped outline. The river edge is 3.1° off +x, so that screen is a prism;
  // the other ranges are axis-aligned and stop inside the west edge, which steps in and out.
  block(-122, -105.4, -22.0, 2.2, 22, 29);          // south-west, beside Victoria Tower
  block(-122, -116.2, 1.8, 28.6, 24, 31);           // west side of the Lords court
  block(-122, -96.2, 28.2, 50.0, 26, 35);           // Lords river front; the outline steps in at u -95
  block(-97.4, -81.6, 28.0, 39.2, 26, 34);          // step down, tucked under the high front
  block(-104, -82.2, -42.4, 1.6, 23, 30);           // yard range, south of the Lords court
  block(-81.4, -76.6, -42.4, 39.2, 24, 32);         // wall east of the Lords court
  block(-77.8, -3.6, -42.4, 16.8, 23, 30);          // yard range behind the river front
  slopedRange(-78.2, 115.2, 16.2, 26, 36.2);        // river screen; back is a flat v, front follows the outline
  block(-14.5, 22.5, -21.2, 18.5, 31, 39);          // central block
  block(-2.2, 33.2, -22.0, 16.8, 23, 30);           // yard, where the outline steps east
  block(32.8, 52.8, -25.0, 16.8, 23, 30);
  block(56.2, 83.6, -48.4, -40.4, 16, 22);          // range in the island between the hall and the spine
  block(52.6, 92.6, -25.4, -3.6, 23, 30);           // south of the central-north court
  block(85.2, 91.5, -52.0, -24.8, 20, 28);          // where the hall joins the palace
  block(52.6, 86.0, 10.6, 16.8, 22, 0);             // north of that court
  block(85.8, 92.8, -3.8, 16.8, 23, 30);            // east of that court
  block(92.4, 97.4, -27.8, 16.8, 23, 30);           // between the northern courts
  block(97.2, 131.4, -27.8, -16.4, 22, 28);         // south of the north court
  block(97.2, 131.4, 14.6, 16.9, 20, 0);            // lip on the court's river side; the court stays open
  block(114.15, 140.4, 16.0, 37.2, 26, 35.5);       // north river pavilion, where the outline steps out
  block(135.5, 147.6, -30.2, -22.3, 25, 33);        // link into Elizabeth Tower, inside the neck
  block(18.2, 87.8, -74.6, -52.5, 16.5, 30);        // Westminster Hall
  block(-0.8, 12.4, -50.6, -26.6, 18, 27);          // St Stephen's Hall
  porch();

  const riverRows = [[1.2, 5.5, 1.55], [8.4, 7.2, 1.85], [17.2, 5.5, 1.55]];
  slopedBays(P.river.u0, P.river.u1, 26, riverRows);
  k.bays('s', -116, -98, 50.0, 26, { step: 5.4, rows: riverRows });
  k.bays('s', 117, 136, 37.2, 26, { step: 5.4, rows: riverRows });
  k.bays('n', -76, -6, -42.4, 23, { step: near ? 8 : 16, rows: near ? [[6.2, 6.2, 1.5]] : [], pins: true });
  k.bays('n', 24, 82, -74.6, 16.5, { step: P.hall.step, rows: [[2.3, 11.2, 2.15]], pins: true, butts: true });
  k.box(trim, -116, -98, 25.6, 26.45, 49.85, 50.5, 'n');

  elizabeth();
  victoria();
  central();

  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.userData = {};
    o.geometry.deleteAttribute('bridgeLift');
    o.geometry.rotateY(P.angle);
    o.geometry.computeBoundingBox();
    o.geometry.computeBoundingSphere();
  });
  return root;

  // v of the river edge in this frame. The mapped wall is straight, 3.1° off +x.
  function frontV(u) {
    return P.river.frontV + P.river.slope * (u - P.river.frontU);
  }

  function slopedRange(u0, u1, back, wall, ridge) {
    const f0 = frontV(u0), f1 = frontV(u1), b0 = back, b1 = back;
    const midU = (u0 + u1) / 2;
    k.poly('stone', [[u0, 0, f0], [u1, 0, f1], [u1, wall, f1], [u0, wall, f0]], [midU, wall / 2, (f0 + f1) / 2 - 2]);
    k.poly('stone', [[u1, 0, b1], [u0, 0, b0], [u0, wall, b0], [u1, wall, b1]], [midU, wall / 2, (b0 + b1) / 2 + 2]);
    k.poly('stone', [[u0, 0, b0], [u0, 0, f0], [u0, wall, f0], [u0, wall, b0]], [u0 - 2, wall / 2, (b0 + f0) / 2]);
    k.poly('stone', [[u1, 0, f1], [u1, 0, b1], [u1, wall, b1], [u1, wall, f1]], [u1 + 2, wall / 2, (b1 + f1) / 2]);
    const i = 0.85, ye = wall + 0.06, uu0 = u0 + i, uu1 = u1 - i;
    const rf0 = frontV(uu0) - 0.7, rf1 = frontV(uu1) - 0.7;
    const rb0 = back + 0.7, rb1 = back + 0.7;
    const rm0 = (rf0 + rb0) / 2, rm1 = (rf1 + rb1) / 2;
    k.poly('roof', [[uu0, ye, rf0], [uu1, ye, rf1], [uu1, ridge, rm1], [uu0, ridge, rm0]], [midU, ye - 2, (rm0 + rm1) / 2]);
    k.poly('roof', [[uu1, ye, rb1], [uu0, ye, rb0], [uu0, ridge, rm0], [uu1, ridge, rm1]], [midU, ye - 2, (rm0 + rm1) / 2]);
    k.poly('roof', [[uu0, ye, rf0], [uu0, ridge, rm0], [uu0, ye, rb0]], [midU, ye, rm0]);
    k.poly('roof', [[uu1, ye, rb1], [uu1, ridge, rm1], [uu1, ye, rf1]], [midU, ye, rm1]);
    slopedBand(u0, u1, 25.6, 26.45, 0.04, 0.4);
    slopedBand(u0, u1, 7.15, 7.48, 0.05, 0.26);
    slopedBand(u0, u1, 16.05, 16.38, 0.05, 0.26);
  }

  function slopedBand(u0, u1, y0, y1, o0, o1) {
    const p = (u, y, o) => [u, y, frontV(u) + o];
    const face = (pts, ref) => k.poly(trim, pts, ref);
    face([p(u0, y0, o1), p(u1, y0, o1), p(u1, y1, o1), p(u0, y1, o1)], p((u0 + u1) / 2, y0, 0));
    face([p(u1, y0, o0), p(u0, y0, o0), p(u0, y1, o0), p(u1, y1, o0)], p((u0 + u1) / 2, y0, o1 + 1));
    face([p(u0, y1, o1), p(u1, y1, o1), p(u1, y1, o0), p(u0, y1, o0)], [(u0 + u1) / 2, y1 + 1, 0]);
    face([p(u0, y0, o0), p(u1, y0, o0), p(u1, y0, o1), p(u0, y0, o1)], [(u0 + u1) / 2, y0 - 1, 0]);
  }

  function slopedBays(u0, u1, wall, rows) {
    const slope = P.river.slope, len = Math.hypot(1, slope);
    const du = 1 / len, dv = slope / len;
    const nu = -slope / len, nv = 1 / len;
    const n = Math.max(1, Math.round(Math.abs(u1 - u0) / P.river.step));
    const dress = near ? 'trim' : 'stone';
    for (let i = 0; i < n; i++) {
      const u = u0 + (u1 - u0) * (i + 0.5) / n;
      const v = frontV(u);
      const put = (mat, proud, a0, a1, y0, y1) => {
        const cu = u + nu * proud, cv = v + nv * proud;
        const q = (a, yy) => [cu + du * a, yy, cv + dv * a];
        k.poly(mat, [q(a0, y0), q(a1, y0), q(a1, y1), q(a0, y1)], [u, y0, v - nv]);
      };
      for (const [y, h, w] of rows) {
        const hw = w / 2, head = near ? Math.min(w * 0.5, h * 0.25) : 0;
        const y1 = y + h - head;
        put('glass', 0.22, -hw, hw, y, y1);
        if (head > 0.2) {
          const cu = u + nu * 0.22, cv = v + nv * 0.22;
          const q = (a, yy) => [cu + du * a, yy, cv + dv * a];
          k.poly('glass', [q(-hw, y1), q(hw, y1), q(0, y + h)], [u, y1, v - nv]);
        }
        if (near) {
          const t = 0.18, p = 0.4;
          put(dress, p, -hw - t, -hw, y, y + h);
          put(dress, p, hw, hw + t, y, y + h);
          put(dress, p, -hw, hw, y - t, y);
          put(dress, p, -hw, hw, y + h, y + h + t);
          const m = Math.min(0.42, w * 0.26);
          for (const s of [-1, 1]) put(dress, 0.36, s * m - 0.05, s * m + 0.05, y + 0.08, y1 - 0.04);
        }
      }
    }
    for (let i = 0; i <= n; i++) {
      const u = u0 + (u1 - u0) * i / n;
      const v = frontV(u);
      k.box('stone', u - 0.28, u + 0.28, 0.4, wall, v + 0.08, v + 0.5, 'n');
      k.pinnacle(u - nu * 0.85, v - nv * 0.85, wall - 0.15, wall + (near ? 6.0 : 5.4));
    }
  }

  function porch() {
    const x0 = 0.6, x1 = 12.4, z0 = -82.2, z1 = -52.8, wall = 16, ridge = 24;
    k.box('stone', x0, x1, 0, wall, z0, z1, 'd');
    const i = 0.85, y = wall + 0.06;
    const a0 = x0 + i, a1 = x1 - i, b0 = z0 + i, b1 = z1 - i, xm = (a0 + a1) / 2;
    const mid = [xm, y - 1, (b0 + b1) / 2];
    k.poly('roof', [[a0, y, b0], [a0, y, b1], [xm, ridge, b1], [xm, ridge, b0]], mid);
    k.poly('roof', [[a1, y, b1], [a1, y, b0], [xm, ridge, b0], [xm, ridge, b1]], mid);
    k.poly('roof', [[a0, y, b0], [xm, ridge, b0], [a1, y, b0]], [xm, y, 0]);
    k.poly('roof', [[a1, y, b1], [xm, ridge, b1], [a0, y, b1]], [xm, y, -80]);
    k.window('n', xm, z0, 1.4, 3.4, near ? 11 : 9);
    if (near) k.bays('n', a0 + 1, a1 - 1, z0, wall, { step: 4, rows: [], pins: true, butts: true });
    else k.buttress('n', xm, z0, 0.4, wall);
  }

  // Blind stone panels in the solid parts of a shaft. Frames sit just off the wall, clear of the ribs.
  function blindPanels(side, at, axis, spans, bands) {
    if (!near) return;
    for (const [a, b] of spans) {
      const a0 = a + 0.08, b0 = b - 0.08;
      if (b0 - a0 < 0.45) continue;
      for (const [y0, y1] of bands) {
        k.onFace(side, axis + a0, axis + a0 + 0.1, at, y0, y1, 0.05, 0.15, 'trim');
        k.onFace(side, axis + b0 - 0.1, axis + b0, at, y0, y1, 0.05, 0.15, 'trim');
        k.onFace(side, axis + a0, axis + b0, at, y0, y0 + 0.1, 0.05, 0.15, 'trim');
        k.onFace(side, axis + a0, axis + b0, at, y1 - 0.1, y1, 0.05, 0.15, 'trim');
      }
    }
  }

  function elizabeth() {
    const c = P.et, x = c.u, z = c.v, h = c.half;
    const O = 6.35;
    // Plinth, ribbed shaft, clock stage. The belfry is an open arcade, not a solid storey.
    k.box('stone', x - 6.7, x + 6.7, 0, 3.6, z - 6.7, z + 6.7, 'd');
    k.box('stone', x - h, x + h, 3.3, 49.2, z - h, z + h, 'du');
    k.box('stone', x - CLOCK_HALF, x + CLOCK_HALF, 49.2, 60.85, z - CLOCK_HALF, z + CLOCK_HALF, '');
    for (const [yy0, yy1, proud] of [[3.5, 3.85, 0.16], [13.05, 13.4, 0.16], [23.35, 23.7, 0.16], [37.55, 37.9, 0.16], [48.45, 48.85, 0.14]]) {
      k.band(trim, x, z, h, yy0, yy1, proud);
    }
    k.band(trim, x, z, CLOCK_HALF, 49.15, 49.7, 0.16);
    k.band('gold', x, z, CLOCK_HALF, 59.9, 60.55, 0.2);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      k.box('stone', x + sx * 5.75 - 0.42, x + sx * 5.75 + 0.42, 3.4, 49.5, z + sz * 5.75 - 0.42, z + sz * 5.75 + 0.42, 'd');
    }
    const rows = [[6.2, 6.2], [14.6, 8], [29.2, 7.2], [42.2, 5.4]];
    const ribAt = [-4.55, -3.15, -0.62, 0.62, 3.15, 4.55];
    const faces = [['s', z + h, x], ['n', z - h, x], ['e', x + h, z], ['w', x - h, z]];
    const etSpans = [[-5.85, -4.72], [-4.38, -3.32], [-0.45, 0.45], [3.32, 4.38], [4.72, 5.85]];
    const etBands = [[4.05, 5.9], [12.7, 14.3], [23.95, 28.9], [37.15, 41.9]];
    for (const [side, at, axis] of faces) {
      for (const col of ribAt) k.onFace(side, axis + col - 0.11, axis + col + 0.11, at, 4.0, 48.7, 0.12, 0.3, 'stone');
      blindPanels(side, at, axis, etSpans, etBands);
      for (const col of [-1.55, 1.55]) for (const [y, ht] of rows) k.window(side, axis + col, at, y, 1.42, ht);
    }
    belfry(x, z, O);
    elizabethRoof(x, z, c.top);
    for (const face of ['s', 'n', 'e', 'w']) clock(face, x, z);
  }

  // Paired louvred arches. Corner piers and a centre pier; the slats sit half a metre behind them.
  function belfry(x, z, O) {
    const T = 1.45, pierY0 = 60.95, pierY1 = 73.6;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const px = x + sx * (O - T / 2), pz = z + sz * (O - T / 2);
      k.box('stone', px - T / 2, px + T / 2, pierY0, pierY1, pz - T / 2, pz + T / 2, 'd');
      k.pinnacle(x + sx * 5.65, z + sz * 5.65, 72.8, near ? 84.2 : 83.4);
      k.spire('gold', x + sx * 5.65, z + sz * 5.65, near ? 83.6 : 82.9, near ? 86.4 : 85.2, 0.38, 0, 6);
      if (near) {
        k.pinnacle(x + sx * 4.55, z + sz * 5.85, 72.8, 80.5);
        k.pinnacle(x + sx * 5.85, z + sz * 4.55, 72.8, 80.5);
      }
    }
    const arch = near ? 'trim' : 'stone';
    const slats = near ? 7 : 4;
    for (const [side, at, axis] of [['s', z + O, x], ['n', z - O, x], ['e', x + O, z], ['w', x - O, z]]) {
      k.onFace(side, axis - 0.42, axis + 0.42, at, 61.7, 73.2, -0.05, 0.32, 'stone');
      for (const col of [-1.7, 1.7]) k.louvreBay(side, axis + col, at, 62.3, 70.4, 2.35, slats, arch, arch);
    }
    k.band(trim, x, z, O - 0.15, 72.7, 74.05, 0.32);
  }

  // Stepped slate roofs. Gold is the hip ribs, four corner finials and the cross-orb. The tip stays at 96.3 m.
  function elizabethRoof(x, z, top) {
    const ribs = [near ? 8 : 4, near ? 6 : 4, 4];
    // Each stage ends in a short eave so the setback reads, then the next roof starts inside it.
    k.spire('roof', x, z, 73.8, 80.6, 5.0, 3.05, sides);
    roofRibs(x, z, 73.8, 80.6, 5.0, 3.05, ribs[0]);
    k.spire('roof', x, z, 80.15, 81.15, 3.2, 2.5, sides);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      k.spire('gold', x + Math.cos(a) * 2.9, z + Math.sin(a) * 2.9, 80.6, near ? 83.3 : 82.5, 0.16, 0, 4);
    }
    k.spire('roof', x, z, 80.95, 87.2, 2.28, 1.32, sides);
    roofRibs(x, z, 80.95, 87.2, 2.28, 1.32, ribs[1]);
    k.spire('roof', x, z, 86.85, 87.7, 1.48, 1.18, sides);
    k.spire('roof', x, z, 87.45, 92.5, 1.08, 0.4, sides);
    roofRibs(x, z, 87.45, 92.5, 1.08, 0.4, ribs[2]);
    // The lamp and the orb sit under the spike. A ray 15 cm off centre still meets gold above 96.05 m.
    k.box('glow', x - 0.1, x + 0.1, 92.6, 93.2, z - 0.1, z + 0.1);
    k.spire('gold', x, z, 92.95, 95.15, 0.32, 0.32, 6);
    k.spire('gold', x, z, 95.4, top, 0.64, 0, 6);
  }

  function roofRibs(x, z, y0, y1, r0, r1, n) {
    const push = 0.24;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.PI / n;
      k.bar('gold',
        [x + Math.cos(a) * (r0 + push), y0, z + Math.sin(a) * (r0 + push)],
        [x + Math.cos(a) * (r1 + push), y1, z + Math.sin(a) * (r1 + push)],
        near ? 0.38 : 0.32, near ? 0.22 : 0.2);
    }
  }

  function clock(face, x, z) {
    const H = 4.15, bar = 0.55, depth = 0.16, gap = 0.1;
    const y = P.et.dialY;
    const outer = CLOCK_HALF + gap;
    if (face === 's' || face === 'n') {
      const sign = face === 's' ? 1 : -1;
      const z0 = z + sign * outer, z1 = z + sign * (outer + depth);
      const za = Math.min(z0, z1), zb = Math.max(z0, z1);
      const back = face === 's' ? 'n' : 's';
      k.box('gold', x - H, x + H, y + (H - bar), y + H, za, zb, back);
      k.box('gold', x - H, x + H, y - H, y - (H - bar), za, zb, back);
      k.box('gold', x - H, x - (H - bar), y - (H - bar), y + (H - bar), za, zb, back);
      k.box('gold', x + (H - bar), x + H, y - (H - bar), y + (H - bar), za, zb, back);
    } else {
      const sign = face === 'e' ? 1 : -1;
      const x0 = x + sign * outer, x1 = x + sign * (outer + depth);
      const xa = Math.min(x0, x1), xb = Math.max(x0, x1);
      const back = face === 'e' ? 'w' : 'e';
      k.box('gold', xa, xb, y + (H - bar), y + H, z - H, z + H, back);
      k.box('gold', xa, xb, y - H, y - (H - bar), z - H, z + H, back);
      k.box('gold', xa, xb, y - (H - bar), y + (H - bar), z - H, z - (H - bar), back);
      k.box('gold', xa, xb, y - (H - bar), y + (H - bar), z + (H - bar), z + H, back);
    }
    const seg = near ? 28 : 16;
    k.disc('glow', x, y, z, face, P.et.dialR, CLOCK_HALF + 0.4, seg);
    k.disc('gold', x, y, z, face, 0.28, CLOCK_HALF + 0.5, 10);
    k.ring('iron', x, y, z, face, 3.28, 3.42, CLOCK_HALF + 0.58, seg);
    for (let i = 0; i < 12; i++) {
      const major = i % 3 === 0;
      k.tick('iron', x, y, z, face, i * 30, major ? 1.85 : 2.25, major ? 3.25 : 3.12, major ? 0.48 : 0.26, CLOCK_HALF + 0.7);
    }
    if (!near) return;
    // 10:10. Hands run clockwise from 12 toward 3, so a ray at 6 o'clock meets the dial.
    k.hand('iron', x, y, z, face, -55, 2.15, 0.2, CLOCK_HALF + 0.58);
    k.hand('iron', x, y, z, face, 60, 3.05, 0.14, CLOCK_HALF + 0.72);
  }

  // One grouped pointed opening: a glass light, stone mullions, and a frame. The frame is trim on the
  // near model and stone on the far model, so the far draw count does not grow.
  function gothicBay(side, along, at, y, w, h) {
    const head = Math.min(w * 0.36, 2.2);
    const body = h - head;
    const a = along - w / 2, c = along + w / 2;
    const proud = 0.24;
    const pane = (y0, y1, xL, xR) => {
      if (side === 's' || side === 'n') {
        const zz = at + (side === 's' ? proud : -proud);
        k.poly('glass', [[xL, y0, zz], [xR, y0, zz], [xR, y1, zz], [xL, y1, zz]], [along, (y0 + y1) / 2, at]);
      } else {
        const xx = at + (side === 'e' ? proud : -proud);
        k.poly('glass', [[xx, y0, xL], [xx, y0, xR], [xx, y1, xR], [xx, y1, xL]], [at, (y0 + y1) / 2, along]);
      }
    };
    pane(y, y + body, a, c);
    if (side === 's' || side === 'n') {
      const zz = at + (side === 's' ? proud : -proud);
      k.poly('glass', [[a, y + body, zz], [c, y + body, zz], [along, y + h, zz]], [along, y + body, at]);
    } else {
      const xx = at + (side === 'e' ? proud : -proud);
      k.poly('glass', [[xx, y + body, a], [xx, y + body, c], [xx, y + h, along]], [at, y + body, along]);
    }
    const jamb = trim, t = 0.24, p0 = 0.38, p1 = 0.56;
    k.onFace(side, a - t, a, at, y, y + h, p0, p1, jamb);
    k.onFace(side, c, c + t, at, y, y + h, p0, p1, jamb);
    k.onFace(side, a, c, at, y - t, y, p0, p1, jamb);
    k.onFace(side, a, c, at, y + h, y + h + 0.26, p0, p1, jamb);
    const lights = near ? 3 : 2;
    const mw = near ? 0.09 : 0.16;
    for (let i = 1; i < lights; i++) {
      const m = a + (c - a) * i / lights;
      k.onFace(side, m - mw, m + mw, at, y + 0.08, y + body - 0.04, 0.32, 0.5, 'stone');
    }
  }

  function victoria() {
    const c = P.vt, x = c.u, z = c.v, h = c.half;
    k.box('stone', x - h, x + h, 0, 76.2, z - h, z + h, 'du');
    k.box('stone', x - 11.05, x + 11.05, 73.4, 77.4, z - 11.05, z + 11.05, 'd');
    // Floor of the crown, inside the parapet. The flagstaff rises through the open middle.
    k.box('stone', x - 7.6, x + 7.6, 76.8, 80.4, z - 7.6, z + 7.6, 'd');
    // Stringcourses between the window stages. None of them crosses the y=40 centre ray.
    for (const [y0, y1] of [[6.4, 7.2], [22.0, 22.85], [36.7, 37.6], [54.9, 55.75], [69.0, 69.85]]) {
      k.band(trim, x, z, h, y0, y1, 0.34);
    }
    // Two grouped lights a stage. They sit off the face centre, so the shaft ray still hits stone.
    const stages = [[9.0, 12.2, 5.15], [24.0, 11.8, 5.25], [42.2, 11.8, 5.15], [56.6, 11.4, 4.75]];
    const centres = [-3.5, 3.5];
    const piers = [[-9.15, -6.55], [6.55, 9.15]];
    const gaps = [[3.6, 8.5], [22.9, 23.6], [37.7, 41.6], [55.8, 56.3], [68.4, 72.4]];
    for (const [side, at, axis] of [['s', z + h, x], ['n', z - h, x], ['e', x + h, z], ['w', x - h, z]]) {
      if (near) blindPanels(side, at, axis, piers, gaps);
      for (const [i, [y, ht, w]] of stages.entries()) {
        // The west face keeps the Sovereign's Entrance in the lowest stage.
        if (side === 'w' && i === 0) continue;
        for (const col of centres) gothicBay(side, axis + col, at, y, w, ht);
      }
    }
    victoriaCrown(x, z);
    k.band(trim, x, z, h, 0.3, 1.15, 0.35);
    k.window('w', z, x - h, 1.5, 5.2, near ? 13.5 : 12);
    k.bar('iron', [x, 98.5, z], [x, 119.35, z], 0.22, 0.22);
    k.spire('gold', x, z, 119.1, c.finial, 0.5, 0, 8);
    flag(x, z);
  }

  // Four square stone turrets, each with a setback and a pyramidal cap, and an open stone parapet
  // between them. No gilded cage. The flagstaff is the only thing on the centre line.
  function victoriaCrown(x, z) {
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const px = x + sx * 9.4, pz = z + sz * 9.4;
      k.box('stone', px - 1.35, px + 1.35, 0, 76.6, pz - 1.35, pz + 1.35, 'd');
      k.box('stone', px - 2.15, px + 2.15, 74.6, 86.6, pz - 2.15, pz + 2.15, 'd');
      k.box('stone', px - 1.62, px + 1.62, 85.5, 93.6, pz - 1.62, pz + 1.62, 'd');
      k.band('stone', px, pz, 1.62, 85.2, 86.15, 0.22);
      k.spire('stone', px, pz, 93.1, 98.4, 2.15, 0, 4);
      k.spire('stone', px, pz, 98.05, 99.7, 0.26, 0, 4);
      k.pinnacle(px + sx * 1.65, pz + sz * 1.65, 85.0, near ? 91.2 : 89.6);
      const slot = (side, along, at, y0, y1) => k.onFace(side, along - 0.4, along + 0.4, at, y0, y1, -0.58, -0.26, 'iron');
      slot('s', px, pz + 2.15, 77.4, 82.6);
      slot('n', px, pz - 2.15, 77.4, 82.6);
      slot('e', pz, px + 2.15, 77.4, 82.6);
      slot('w', pz, px - 2.15, 77.4, 82.6);
      slot('s', px, pz + 1.62, 87.2, 91.4);
      slot('n', px, pz - 1.62, 87.2, 91.4);
      slot('e', pz, px + 1.62, 87.2, 91.4);
      slot('w', pz, px - 1.62, 87.2, 91.4);
    }
    const half = 8.85, a0 = -6.7, a1 = 6.7;
    const piers = near ? 5 : 3;
    for (const [side, at, axis] of [['s', z + half, x], ['n', z - half, x], ['e', x + half, z], ['w', x - half, z]]) {
      const from = axis + a0, to = axis + a1, span = to - from;
      for (let i = 0; i < piers; i++) {
        const t = from + span * (i + 0.5) / piers;
        const w = near ? 0.74 : 1.15;
        k.onFace(side, t - w / 2, t + w / 2, at, 79.8, 87.4, 0.02, 0.7, 'stone');
      }
      k.onFace(side, from, to, at, 79.8, 80.7, 0.0, 0.58, 'stone');
      k.onFace(side, from, to, at, 86.6, 88.3, 0.0, 0.78, 'stone');
    }
  }

  function flag(x, z) {
    const y0 = 105.2, y1 = 111.0, x0 = x - 7.3, x1 = x - 0.45;
    if (near) {
      k.box('sign', x0, x1, y0, y1, z - 0.05, z + 0.05);
      const my = (y0 + y1) / 2, mx = (x0 + x1) / 2, a = 0.5;
      k.box('red', x0, x1, my - a / 2, my + a / 2, z - 0.16, z + 0.16);
      k.box('red', mx - a / 2, mx + a / 2, y0, my - a / 2, z - 0.16, z + 0.16, 'u');
      k.box('red', mx - a / 2, mx + a / 2, my + a / 2, y1, z - 0.16, z + 0.16, 'd');
    } else {
      k.box('sign', x0, x1, y0, y1, z - 0.1, z + 0.1);
    }
  }

  function central() {
    const c = P.ct, x = c.u, z = c.v;
    k.spire('stone', x, z, 33, 60, 4.5, 4.15, 8);
    k.spire('stone', x, z, 59.4, 62.2, 4.35, 3.55, 8);
    k.spire('glass', x, z, 62.2, 68.4, 3.05, 2.75, 8);
    k.spire('stone', x, z, 68.1, 71.2, 3.45, 2.95, 8);
    k.box('stone', x - 2.2, x + 2.2, 70.5, 71.15, z - 2.2, z + 2.2, 'd');
    k.spire('stone', x, z, 70.7, c.top, 2.7, 0, sides);
    for (const i of [0, 1, 2, 3]) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 8;
      k.pinnacle(x + Math.cos(a) * 4.3, z + Math.sin(a) * 4.3, 59, near ? 66 : 64.5);
    }
  }
}
