// The crown of the Royal York: the setback block with its little arcade, the crown storeys, four corner
// turrets, the steep verdigris hipped roof with its dormers, the stone stack with the flag mast, and
// the "Fairmont / ROYAL YORK" roof sign. Positions come from the OSM crown (way 231977103), the step
// (290194022) and the stack (231977104); the roof pitch follows OSM (8.7 m over 7 m of half-width),
// the rest is read from photographs.
import { RINGS, U, V, at, along, across, centroid } from './fairmont-royal-york-site.js';
import { smallArch } from './fairmont-royal-york-facade.js';
import { royalYork, fairmont } from './fairmont-royal-york-sign.js';

const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const U3 = [U[0], 0, U[1]], V3 = [V[0], 0, V[1]];

export function crown(ctx) {
  const { kit, slab, near, L } = ctx;
  const C = centroid(RINGS.CROWN), cu = along(C), cv = across(C);
  const hu = 13.65, hv = 7.0, ov = 0.55; // half sizes of the crown block; roof overhang
  const yEave = L.crownWalls, yTop = L.roofTop, rise = yTop - yEave;
  const P = (u, v, y) => { const p = at(u, v); return [p[0], y, p[1]]; };

  // --- the little arcade of the setback block (D, 87..94), small round arches all round ---
  if (near) for (const e of slab.D.edges) {
    const n = Math.max(2, Math.round(e.L / 1.65)), pitch = e.L / n;
    for (let i = 0; i < n; i++) smallArch(ctx, e, pitch * (i + 0.5), 1.0, 89.6, 91.6, { frame: 0.2, dFrame: 0.3 });
  } else for (const e of slab.D.edges) kit.slab('glass', e.p, e.t, e.n, 1.2, e.L - 1.2, 89.6, 92.4, 0.15, { bottom: false });
  // --- crown storeys (E, 94..100.4): paired arched windows ---
  for (const e of slab.E.edges) {
    if (!near) { kit.slab('glass', e.p, e.t, e.n, 1.6, e.L - 1.6, 95.2, 99.0, 0.15, { bottom: false }); continue; }
    const n = Math.max(2, Math.round(e.L / 2.4)), pitch = e.L / n;
    for (let i = 0; i < n; i++) smallArch(ctx, e, pitch * (i + 0.5), 1.2, 95.3, 97.4, { frame: 0.3, dFrame: 0.35 });
    for (const [y0, y1, d] of [[93.9, 94.4, 0.55], [99.5, 100.4, 0.7]]) kit.slab('limestone', e.p, e.t, e.n, -0.6, e.L + 0.6, y0, y1, d, { bottom: false });
  }
  if (!near) for (const e of slab.E.edges) kit.slab('limestone', e.p, e.t, e.n, -0.6, e.L + 0.6, 99.5, 100.4, 0.7, { bottom: false });

  // --- corner turrets on the crown: stone shafts with copper spires ---
  const tur = (u, v, yBase, size, top, spire) => {
    const c = at(u, v), r = kit.block('limestone', c[0], yBase, top, c[1], size / 2, size / 2, Math.atan2(U[1], U[0]), { top: false });
    const a = [c[0], top + spire, c[1]];
    kit.cone('copper', r, top, a);
    if (near) { const w = size / 2 + 0.25; kit.block('limestone', c[0], top - 0.4, top, c[1], w, w, Math.atan2(U[1], U[0]), { top: false }); }
    return r;
  };
  for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    tur(cu + su * (hu - 0.5), cv + sv * (hv - 0.5), 96, 1.9, 104.2, near ? 3.8 : 3.4);
    if (near && sv < 0) tur(cu + su * (hu * 0.56), cv + sv * (hv - 0.4), 96.5, 1.3, 102.6, 2.4); // north side only: the south slope carries the sign
  }
  // pinnacles on the setback block D
  if (near) for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) tur(cu + su * 15.0, cv + sv * 8.8, 94, 1.2, 96.4, 1.9);

  // --- the hipped copper roof ---
  const rhu = hu + ov, rhv = hv + ov, rh = rhu - rhv;
  const c00 = P(cu - rhu, cv - rhv, yEave - 0.3), c10 = P(cu + rhu, cv - rhv, yEave - 0.3), c11 = P(cu + rhu, cv + rhv, yEave - 0.3), c01 = P(cu - rhu, cv + rhv, yEave - 0.3);
  const R0 = P(cu - rh, cv, yTop), R1 = P(cu + rh, cv, yTop);
  const tilt = rise / rhv, up = 0.7;
  kit.quad('copper', c01, c11, R1, R0, [V3[0] * tilt, up, V3[2] * tilt]); // south slope
  kit.quad('copper', c10, c00, R0, R1, [-V3[0] * tilt, up, -V3[2] * tilt]); // north slope
  kit.tri('copper', c00, c01, R0, [-U3[0], up, -U3[2]]); // west hip
  kit.tri('copper', c11, c10, R1, [U3[0], up, U3[2]]); // east hip
  const cosT = Math.cos(Math.atan2(rise, rhv)), sinT = Math.sin(Math.atan2(rise, rhv));

  // --- dormers: small gabled copper dormers with a glass face ---
  // dir +1 / -1: south / north slope, u along the ridge; 'E' / 'W': the hips, u across the roof.
  const dormer = (u, f, dir) => {
    const hip = dir === 'E' || dir === 'W', sgn = dir === 'E' ? 1 : -1;
    const nrm = hip ? [U3[0] * sgn, 0, U3[2] * sgn] : [V3[0] * dir, 0, V3[2] * dir], tan = hip ? V3 : U3;
    const y0 = yEave - 0.3 + (rise + 0.3) * f;
    const base = hip ? P(cu + sgn * (rhu - f * rhv), cv + u, y0) : P(cu + u, cv + dir * rhv * (1 - f), y0);
    const w = 1.0, wallH = 1.9, gable = 0.8, depth = 2.4, Y = [0, 1, 0];
    const fl = add(base, tan, -w), fr = add(base, tan, w), tl = add(fl, Y, wallH), tr = add(fr, Y, wallH), pk = add(base, Y, wallH + gable);
    const back = (p) => add(p, nrm, -depth), neg = (v) => v.map((x) => -x);
    kit.fan('copper', [fl, fr, tr, pk, tl], nrm);
    kit.quad('glass', add(add(base, tan, -0.55), nrm, 0.05, 0), add(add(base, tan, 0.55), nrm, 0.05), add(add(add(base, tan, 0.55), Y, 1.55), nrm, 0.05), add(add(add(base, tan, -0.55), Y, 1.55), nrm, 0.05), nrm);
    kit.quad('copper', fl, back(fl), back(tl), tl, neg(tan));
    kit.quad('copper', fr, back(fr), back(tr), tr, tan);
    kit.quad('copper', tl, back(tl), back(pk), pk, add(neg(tan), Y));
    kit.quad('copper', tr, back(tr), back(pk), pk, add(tan, Y));
  };
  if (near) {
    for (const u of [-11.0, 11.0]) dormer(u, 0.18, 1); // outboard of the sign
    for (const u of [-9, -3, 3, 9]) dormer(u, 0.2, -1);
    dormer(0, 0.22, 'W'); dormer(0, 0.22, 'E');
  }

  // --- the stack ---
  const S = RINGS.STACK, sc = centroid(S);
  kit.walls('limestone', S, 104, 117.6);
  for (const e of kit.edges(S)) {
    kit.slab('limestone', e.p, e.t, e.n, -0.35, e.L + 0.35, 116.6, 118.4, 0.4, { bottom: near });
    if (near) for (const k of [0.3, 0.7]) kit.slab('glass', e.p, e.t, e.n, e.L * k - 0.28, e.L * k + 0.28, 108, 115.4, 0.06, { bottom: false, top: false });
  }
  // The stack's crown: a corbelled parapet, a copper pyramid, a small stone lantern with its own copper
  // spirelet and a short finial, so the top of the tower ends in a crown and not a needle (124 m in all).
  const yaw = Math.atan2(U[1], U[0]), su0 = along(sc), sv0 = across(sc);
  const corners = (hu2, hv2) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => at(su0 + a * hu2, sv0 + b * hv2));
  kit.cone('copper', corners(2.0, 2.45), 118.4, [sc[0], 120.6, sc[1]]);
  kit.block('limestone', sc[0], 120.4, 121.8, sc[1], 0.62, 0.62, yaw, { top: false });
  kit.cone('copper', corners(0.72, 0.72), 121.8, [sc[0], 123.0, sc[1]]);
  kit.block('metal', sc[0], 123.0, 124.0, sc[1], 0.09, 0.09, yaw, { top: true });
  if (near) for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { // four corner pinnacles on the parapet
    const c = at(su0 + a * 1.85, sv0 + b * 2.3);
    kit.block('limestone', c[0], 118.2, 119.2, c[1], 0.3, 0.3, yaw, { top: false });
    kit.cone('copper', [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, z]) => at(su0 + a * 1.85 + x * 0.34, sv0 + b * 2.3 + z * 0.34)), 119.2, [c[0], 120.5, c[1]]);
  }

  sign(ctx, { cu, cv, rhv, yEave, rise, sinT, cosT });
}

// A straight bar of square section between two 3D points.
function bar3(kit, mat, a, b, w) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], len = Math.hypot(...d);
  if (len < 1e-6) return;
  const dn = d.map((x) => x / len), ref = Math.abs(dn[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
  const p1 = norm(cross(dn, ref)), p2 = cross(dn, p1);
  const c = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [p1.map((x) => x * s * w / 2), p2.map((x) => x * t * w / 2)].reduce((acc, v) => add(acc, v), [0, 0, 0]));
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4, ma = add(a, c[i]), mb = add(a, c[j]), mc = add(b, c[j]), md = add(b, c[i]);
    kit.quad(mat, ma, mb, mc, md, add(c[i], c[j]));
  }
  kit.quad(mat, add(a, c[0]), add(a, c[1]), add(a, c[2]), add(a, c[3]), dn.map((x) => -x));
  kit.quad(mat, add(b, c[0]), add(b, c[1]), add(b, c[2]), add(b, c[3]), dn);
}
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); };

// The sign stands off the south slope, parallel to it, so from Front Street the lettering reads upright.
function sign(ctx, { cu, cv, rhv, yEave, rise, sinT, cosT }) {
  const { kit, near } = ctx;
  const E0 = (u) => { const p = at(u, cv + rhv); return [p[0], yEave - 0.3, p[1]]; };
  const dirUp = [-V3[0] * cosT, sinT, -V3[2] * cosT], N = [V3[0] * sinT, cosT, V3[2] * sinT];
  const pt = (su, sh, off = 0.95) => add(add(add(E0(cu), U3, su), dirUp, sh), N, off);
  const lines = [[royalYork(1.85), 0.8], [fairmont(2.6), 3.7]];
  const weight = near ? 0.4 : 0.7;
  for (const [{ strokes, width }, sh0] of lines) {
    if (!near) { // far: two solid bands of light
      kit.quad('sign', pt(-width / 2, sh0), pt(width / 2, sh0), pt(width / 2, sh0 + 1.6), pt(-width / 2, sh0 + 1.6), N);
      continue;
    }
    for (const line of strokes) for (let i = 0; i < line.length - 1; i++) {
      bar3(kit, 'sign', pt(line[i][0] - width / 2, sh0 + line[i][1]), pt(line[i + 1][0] - width / 2, sh0 + line[i + 1][1]), weight);
    }
  }
  if (near) for (const su of [-6.5, -2, 2.2, 6.5]) bar3(kit, 'metal', add(add(E0(cu), U3, su), dirUp, 1.6), pt(su, 1.6), 0.18);
  if (near) for (const su of [-4.5, 4.5]) bar3(kit, 'metal', add(add(E0(cu), U3, su), dirUp, 6.4), pt(su, 6.4), 0.18);
}
