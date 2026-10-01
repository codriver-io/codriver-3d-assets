import { centroid } from './oracle-park-mesh.js';
import { F_E } from './oracle-park-plan.js';
import { FIELD_CENTRE_LOCAL } from './oracle-park-site.js';

// Lattice light frames, the scoreboard, the brick towers, the Coca-Cola bottle and the glove.
const rot = (yaw) => { const co = Math.cos(yaw), si = Math.sin(yaw); return (u, v) => [u * co + v * si, -u * si + v * co]; };

// A square lattice mast: four legs that taper in, a diagonal on every face of every bay, and
// horizontal rings on alternate bays. (cx, cz) is its centre, `along` x `depth` its footprint at the
// base, yaw rotates the footprint about +y.
export function mast(b, cx, cz, yaw, along, depth, h, near, top = 0.62) {
  const R = rot(yaw), nb = near ? Math.max(3, Math.round(h / 8.5)) : 1;
  const corner = (k, y) => {
    const f = 1 - (1 - top) * (y / h), sx = (k === 0 || k === 3) ? -1 : 1, sz = k < 2 ? -1 : 1;
    const [dx, dz] = R(sx * along / 2 * f, sz * depth / 2 * f);
    return [cx + dx, y, cz + dz];
  };
  for (let k = 0; k < 4; k++) near ? b.bar('steel', corner(k, 0.2), corner(k, h), 0.55, 0.55) : b.bar('steel', corner(k, 0.2), corner(k, h), 0.5, 0.5, 0, true);
  if (!near) return;
  for (let j = 0; j < nb; j++) {
    const y0 = j === 0 ? 0.3 : h * j / nb, y1 = h * (j + 1) / nb;
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4, up = (j + k) % 2 === 0;
      b.bar('steel', corner(up ? k : k2, y0), corner(up ? k2 : k, y1), 0.2, 0.2, 0, true);
    }
    if (j % 2 === 1) for (let k = 0; k < 4; k++) b.bar('steel', corner(k, y0), corner((k + 1) % 4, y0), 0.2, 0.2, 0, true);
  }
}

// Bank of floodlights: three rows of lamp panels on a dark backing, facing `face` (unit 2D).
export function lampBank(b, B, cx, y, cz, width, face, near) {
  const yaw = -Math.atan2(face[1], face[0]) + Math.PI / 2, off = 0.5;
  const px = cx + face[0] * off, pz = cz + face[1] * off;
  B('steel').box([cx, y, cz], [width, near ? 6.2 : 6, 1.0], yaw);
  if (near) for (let r = 0; r < 3; r++) B('light').box([px + face[0] * 0.2, y - 2 + r * 2, pz + face[1] * 0.2], [width - 0.8, 1.4, 0.3], yaw);
  else B('light').box([px + face[0] * 0.2, y, pz + face[1] * 0.2], [width - 0.8, 4.4, 0.3], yaw);
}

function quadAxis(q) {
  const e = q.map((p, i) => [p, q[(i + 1) % 4]]), len = e.map(([a, c]) => Math.hypot(c[0] - a[0], c[1] - a[1]));
  const short = len[0] + len[2] < len[1] + len[3] ? [0, 2] : [1, 3];
  const mid = (i) => [(e[i][0][0] + e[i][1][0]) / 2, (e[i][0][1] + e[i][1][1]) / 2];
  const a = mid(short[0]), c = mid(short[1]), w = (len[short[0]] + len[short[1]]) / 2, L = Math.hypot(c[0] - a[0], c[1] - a[1]);
  return { a, c, w, L, u: [(c[0] - a[0]) / L, (c[1] - a[1]) / L] };
}

// A wide frame: a mast at each end, chords and a bank of floodlights between them.
export function lightFrame(b, B, quad, h, near) {
  const q = quadAxis(quad), yaw = -Math.atan2(q.u[1], q.u[0]), mw = 7.2;
  const mid = [(q.a[0] + q.c[0]) / 2, (q.a[1] + q.c[1]) / 2];
  let face = [q.u[1], -q.u[0]];
  const toField = [FIELD_CENTRE_LOCAL[0] - mid[0], FIELD_CENTRE_LOCAL[1] - mid[1]];
  if (face[0] * toField[0] + face[1] * toField[1] < 0) face = [-face[0], -face[1]];
  const sh = 1.6, dist = (t) => [q.a[0] + q.u[0] * t + face[0] * sh, q.a[1] + q.u[1] * t + face[1] * sh];
  for (const t of [mw / 2, q.L - mw / 2]) { const p = dist(t); mast(b, p[0], p[1], yaw, mw, Math.max(3.2, q.w), h - 6, near); }
  // bank across the full width at the top, truss chords below it
  lampBank(b, B, mid[0] + face[0] * 1.6, h - 3, mid[1] + face[1] * 1.6, q.L, face, near);
  if (near) {
    for (const y of [h - 7, h - 15]) b.bar('steel', [dist(mw)[0], y, dist(mw)[1]], [dist(q.L - mw)[0], y, dist(q.L - mw)[1]], 0.35, 0.35);
    const nb = Math.max(2, Math.round((q.L - 2 * mw) / 8));
    for (let k = 0; k < nb; k++) {
      const p0 = dist(mw + (q.L - 2 * mw) * k / nb), p1 = dist(mw + (q.L - 2 * mw) * (k + 1) / nb);
      b.bar('steel', [p0[0], h - 15, p0[1]], [p1[0], h - 7, p1[1]], 0.16, 0.16, 0, true);
      b.bar('steel', [p0[0], h - 7, p0[1]], [p1[0], h - 15, p1[1]], 0.16, 0.16, 0, true);
    }
  } else {
    const p0 = dist(mw), p1 = dist(q.L - mw);
    b.bar('steel', [p0[0], h - 8, p0[1]], [p1[0], h - 8, p1[1]], 0.45, 0.45, 0, true);
  }
}

// The centre-field scoreboard between its two towers (OSM way 499568649, 65 m).
export function scoreboard(b, B, near) {
  const q = quadAxis(F_E), yaw = -Math.atan2(q.u[1], q.u[0]), mw = 8.4, h = 65;
  const dist = (t) => [q.a[0] + q.u[0] * t, q.a[1] + q.u[1] * t];
  const face = [-q.u[1], q.u[0]]; // toward the field (west)
  const f = face[0] < 0 ? face : [-face[0], -face[1]];
  for (const t of [mw / 2, q.L - mw / 2]) {
    const p = dist(t); mast(b, p[0], p[1], yaw, mw, 4.6, h - 7, near, 0.7);
    lampBank(b, B, p[0], h - 3.5, p[1], mw + 1.2, f, near);
  }
  const bl = q.L - mw * 2 + 2, c = dist(q.L / 2), y0 = 17, bh = 14, dep = 2.8;
  B('steel').box([c[0], y0 + bh / 2, c[1]], [bl, bh, dep], yaw);
  const sx = f[0] * (dep / 2 + 0.08), sz = f[1] * (dep / 2 + 0.08);
  B('glow').box([c[0] + sx, y0 + 7.2, c[1] + sz], [bl * 0.62, 8.4, 0.16], yaw);
  for (const side of [-1, 1]) {
    const pc = dist(q.L / 2 + side * bl * 0.4);
    B('glow').box([pc[0] + sx, y0 + 7.2, pc[1] + sz], [bl * 0.16, 8.4, 0.16], yaw);
    if (near) B('sign').box([pc[0] + sx, y0 + 1.5, pc[1] + sz], [bl * 0.16, 1.7, 0.16], yaw);
  }
  if (near) {
    B('sign').box([c[0] + sx, y0 + 12.4, c[1] + sz], [bl * 0.9, 1.6, 0.16], yaw);
    B('sign').box([c[0] + sx, y0 + 1.5, c[1] + sz], [bl * 0.62, 1.7, 0.16], yaw);
  }
  // the clock on its small frame above the board
  B('steel').box([c[0], y0 + bh + 2.4, c[1]], [9, 4.8, 1.6], yaw);
  clockDisc(B, [c[0] + f[0] * 0.9, y0 + bh + 2.6, c[1] + f[1] * 0.9], f, 2.1, near);
  b.bar('steel', [c[0], y0 + bh + 4.8, c[1]], [c[0], y0 + bh + 10, c[1]], 0.18, 0.18, 0, true);
}

// A clock face: pale disc facing `f` (unit 2D), centred on c.
export function clockDisc(B, c, f, r, near) {
  const n = near ? 14 : 6, buf = B('light'), t = [-f[1], f[0]], hint = [f[0], 0, f[1]];
  const pt = (a) => [c[0] + t[0] * Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2] + t[1] * Math.cos(a) * r];
  for (let k = 0; k < n; k++) buf.tri(c, pt(k / n * Math.PI * 2), pt((k + 1) / n * Math.PI * 2), hint);
}

// A square brick tower with a stone cornice and either a hip roof or a flat parapet.
export function brickTower(B, quad, shaft, roof, near, clocks) {
  const c = centroid(quad), e = [quad[1][0] - quad[0][0], quad[1][1] - quad[0][1]], side = Math.hypot(...e) * 0.82, yaw = -Math.atan2(e[1], e[0]);
  B('brick').box([c[0], shaft / 2, c[1]], [side, shaft, side], yaw);
  B('stone').box([c[0], shaft + 0.5, c[1]], [side + 1.1, 1.0, side + 1.1], yaw);
  if (clocks) {
    const co = Math.cos(yaw), si = Math.sin(yaw);
    for (const [dir, size] of [[[co, -si], [0.3, 5.4, 5.4]], [[-co, si], [0.3, 5.4, 5.4]], [[si, co], [5.4, 5.4, 0.3]], [[-si, -co], [5.4, 5.4, 0.3]]]) {
      const o = side / 2 + 0.15;
      B('stone').box([c[0] + dir[0] * o, shaft - 5.6, c[1] + dir[1] * o], size, yaw);
      clockDisc(B, [c[0] + dir[0] * (o + 0.18), shaft - 5.6, c[1] + dir[1] * (o + 0.18)], dir, 2.3, near);
    }
  }
  if (!clocks && near) {
    // plain brick tower: two window slits per face on two levels above the facade
    const co = Math.cos(yaw), si = Math.sin(yaw), glass = B('glass');
    for (const dir of [[co, -si], [-co, si], [si, co], [-si, -co]]) {
      const t = [-dir[1], dir[0]], o = side / 2 + 0.1;
      for (const [y0, y1] of [[24.6, 28.4], [29.6, 33]]) for (const sgn of [-1, 1]) {
        const cx = c[0] + dir[0] * o + t[0] * sgn * side * 0.22, cz = c[1] + dir[1] * o + t[1] * sgn * side * 0.22, w = 0.9;
        glass.quad([cx - t[0] * w, y0, cz - t[1] * w], [cx + t[0] * w, y0, cz + t[1] * w], [cx + t[0] * w, y1, cz + t[1] * w], [cx - t[0] * w, y1, cz - t[1] * w], [dir[0], 0, dir[1]]);
      }
    }
  }
  const base = shaft + 1;
  if (roof > 0) {
    const half = (side + 0.8) / 2, co = Math.cos(yaw), si = Math.sin(yaw);
    const P = (u, v, y) => [c[0] + u * co + v * si, y, c[1] - u * si + v * co];
    const apex = P(0, 0, base + roof), cs = [P(-half, -half, base), P(half, -half, base), P(half, half, base), P(-half, half, base)];
    for (let k = 0; k < 4; k++) B('copper').tri(cs[k], cs[(k + 1) % 4], apex, [(cs[k][0] + cs[(k + 1) % 4][0]) / 2 - c[0], 0.5, (cs[k][2] + cs[(k + 1) % 4][2]) / 2 - c[1]]);
    return { c, apex };
  }
  return { c, apex: [c[0], base, c[1]] };
}
