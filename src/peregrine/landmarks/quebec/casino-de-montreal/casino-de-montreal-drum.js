import { TAU, polar, deg, cap, bar, column, inPoly } from './casino-de-montreal-mesh.js';
import { Y, FLARE, rTop, rBase, TERRACE_ARC, LINK } from './casino-de-montreal-site.js';

// The French pavilion's drum: ground-floor glazing, a fascia, the fan of flared aluminium ribs, a ring beam, the drum of
// vertical louvres in front of lit glazing, the roof with its glazed lantern, and the mast. `S(material)` returns the
// material's Soup. Rib counts and segment counts drop in the far model.

// Plan polygon of a shaft.
export const shaftPoly = ([cx, cz, hx, hz]) => [[cx - hx, cz - hz], [cx + hx, cz - hz], [cx + hx, cz + hz], [cx - hx, cz + hz]];

export function buildDrum(S, near) {
  const alu = S('alu'), glow = S('glow'), conc = S('concrete'), glass = S('glass'), roof = S('roof');
  const segs = near ? 96 : 48, N = near ? 120 : 60;
  const th = (i, n) => i / n * TAU;
  const at = (r, t, y) => { const [x, z] = polar(r, t); return [x, y, z]; };
  const ground = (t) => t >= TERRACE_ARC[0] && t <= TERRACE_ARC[1];

  // Ground-floor glazing (dark glass), recessed under the fan. Not where the link or the terrace tower hides it.
  for (let i = 0; i < segs; i++) {
    const t0 = th(i, segs), t1 = th(i + 1, segs), tm = (t0 + t1) / 2, rb = rBase(tm) - 1.0;
    const [mx, mz] = polar(rb, tm);
    if (inPoly(LINK, mx, mz) || ground(tm)) continue;
    const a = rBase(t0) - 1.0, b = rBase(t1) - 1.0;
    glass.quad(at(a, t0, 0), at(b, t1, 0), at(b, t1, Y.fan0 - 1.2), at(a, t0, Y.fan0 - 1.2), at(rb + 5, tm, 4));
  }
  // Fascia ring under the fan: outer wall, top annulus the ribs stand on, underside.
  for (let i = 0; i < segs; i++) {
    const t0 = th(i, segs), t1 = th(i + 1, segs), tm = (t0 + t1) / 2, y0 = Y.fan0 - 1.2, y1 = Y.fan0;
    const o0 = rBase(t0) + 0.6, o1 = rBase(t1) + 0.6, i0 = rBase(t0) - 1.0, i1 = rBase(t1) - 1.0, rm = rBase(tm) + 0.6;
    conc.quad(at(o0, t0, y0), at(o1, t1, y0), at(o1, t1, y1), at(o0, t0, y1), at(rm + 5, tm, (y0 + y1) / 2));
    conc.quad(at(i0, t0, y1), at(o0, t0, y1), at(o1, t1, y1), at(i1, t1, y1), at(rm, tm, y1 + 5));
    conc.quad(at(i0, t0, y0), at(o0, t0, y0), at(o1, t1, y0), at(i1, t1, y0), at(rm, tm, y0 - 5));
  }
  // Lit glazing behind the ribs: a cone behind the fan and a cylinder behind the louvres.
  for (let i = 0; i < segs; i++) {
    const t0 = th(i, segs), t1 = th(i + 1, segs), tm = (t0 + t1) / 2;
    const b0 = rBase(t0) - 0.9, b1 = rBase(t1) - 0.9, u0 = rTop(t0) - 0.9, u1 = rTop(t1) - 0.9;
    glow.quad(at(b0, t0, Y.fan0), at(b1, t1, Y.fan0), at(u1, t1, Y.fan1), at(u0, t0, Y.fan1), at(rTop(tm) + 8, tm, (Y.fan0 + Y.fan1) / 2));
    glow.quad(at(29.4, t0, Y.beam), at(29.4, t1, Y.beam), at(29.4, t1, Y.roof), at(29.4, t0, Y.roof), at(40, tm, (Y.beam + Y.roof) / 2));
  }
  // Ring beam on top of the fan: the white band the louvres stand on.
  for (let i = 0; i < segs; i++) {
    const t0 = th(i, segs), t1 = th(i + 1, segs), tm = (t0 + t1) / 2, y0 = Y.fan1, y1 = Y.beam;
    const o0 = rTop(t0), o1 = rTop(t1), rm = rTop(tm);
    conc.quad(at(o0, t0, y0), at(o1, t1, y0), at(o1, t1, y1), at(o0, t0, y1), at(rm + 5, tm, (y0 + y1) / 2));
    conc.quad(at(29.8, t0, y1), at(o0, t0, y1), at(o1, t1, y1), at(29.8, t1, y1), at(rm, tm, y1 + 5));
    conc.quad(at(29.8, t0, y0), at(o0, t0, y0), at(o1, t1, y0), at(29.8, t1, y0), at(rm, tm, y0 - 5));
  }
  // Two slab edges seen between the louvres (the layered floors).
  for (const [y0, y1] of near ? [[24.2, 24.9], [27.4, 28.1]] : []) {
    for (let i = 0; i < segs; i++) {
      const t0 = th(i, segs), t1 = th(i + 1, segs), tm = (t0 + t1) / 2;
      conc.quad(at(29.8, t0, y0), at(29.8, t1, y0), at(29.8, t1, y1), at(29.8, t0, y1), at(40, tm, (y0 + y1) / 2));
      conc.quad(at(29.8, t0, y1), at(29.8, t1, y1), at(29.2, t1, y1), at(29.2, t0, y1), at(29.5, tm, y1 + 5));
    }
  }
  // The fan: flared ribs from the fascia to the ring beam, and the vertical louvres above it.
  const hw = near ? 0.42 : 0.85, hu = near ? 0.4 : 0.8;
  for (let i = 0; i < N; i++) {
    const t = th(i + 0.5, N), c = Math.cos(t), s = Math.sin(t);
    const rt = rTop(t), rb = rt - FLARE;
    const [bx, bz] = polar(rb - 0.2, t), [tx, tz] = polar(rt - 0.35, t);
    const [lx, lz] = polar(30.6, t);
    bar(alu, [bx, Y.fan0, bz], [tx, Y.fan1, tz], hw * 2, 0.5, [c, 0, s], true);
    bar(alu, [lx, Y.beam, lz], [lx, Y.crown, lz], hu * 2, 0.55, [c, 0, s], true);
  }
  // Roof, and the glazed lantern with its conical cap.
  const rr = near ? 48 : 24;
  const disc = Array.from({ length: rr }, (_, i) => polar(29.6, i / rr * TAU));
  cap(roof, disc, Y.roof);
  const ln = near ? 16 : 10, lr = 12;
  for (let i = 0; i < ln; i++) {
    const t0 = th(i, ln), t1 = th(i + 1, ln), tm = (t0 + t1) / 2;
    glow.quad(at(lr, t0, Y.roof), at(lr, t1, Y.roof), at(lr, t1, Y.lantern), at(lr, t0, Y.lantern), at(lr + 6, tm, Y.lantern - 1));
    alu.tri(at(lr + 0.4, t0, Y.lantern), at(lr + 0.4, t1, Y.lantern), [0, Y.lanternTop, 0], [0, Y.lantern + 8, 0]);
  }
  // The mast on the roof, behind the terrace tower.
  const [mx, mz] = polar(25.5, deg(197));
  column(alu, mx, mz, 0.85, 0.12, Y.roof, Y.mast, 4, true);
  if (near) { // two collars on the mast
    const mastR = (y) => 0.85 - 0.73 * (y - Y.roof) / (Y.mast - Y.roof);
    for (const y of [Y.roof + 4, Y.roof + 8.5]) column(alu, mx, mz, mastR(y) + 0.2, mastR(y + 0.4) + 0.2, y, y + 0.4, 4, true);
  }
  return { mast: [mx, mz] };
}
