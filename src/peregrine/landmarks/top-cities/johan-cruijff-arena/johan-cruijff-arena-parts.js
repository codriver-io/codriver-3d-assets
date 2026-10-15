import { site, BOWL, RINGS, LEVELS, ARCH, ARCH_V, MAST, seRing, roofY, archBottom } from './johan-cruijff-arena-site.js';

// The members that must touch a named support, as terminal points in world metres, shared by geometry.js
// (which draws them) and the tests (which check each terminal against the surface that carries it).
export const segmentsFor = (detail) => (detail === 'near' ? 144 : 72);
export const archPanels = (detail) => (detail === 'near' ? ARCH.panels : ARCH.panelsFar);
export const archU = (detail, i) => -ARCH.footU + (i * 2 * ARCH.footU) / archPanels(detail);

/** Roof hangers: from the arch's tie bar down into the roof panel they carry. */
export function hangers(detail) {
  const ids = detail === 'near' ? [3, 5, 9, 13, 17, 21, 23] : [2, 6, 10];
  const out = [];
  for (const vA of ARCH_V) for (const i of ids) {
    const u = archU(detail, i);
    out.push({ vA, u, top: site(u, archBottom(u), vA), bottom: site(u, roofY(u, vA) - 0.4, vA) });
  }
  return out;
}

/** Arch ends: the tie bar at each end of an arch runs through the corner mast that carries it. */
export function archFeet() {
  const out = [];
  for (const vA of ARCH_V) for (const sgn of [-1, 1]) out.push({ vA, sgn, tie: site(sgn * ARCH.footU, archBottom(ARCH.footU), vA), top: site(sgn * ARCH.footU, 48, vA), mast: site(sgn * MAST.tallU, 30, vA) });
  return out;
}

/** Y-struts: a foot on the forecourt and two heads under the promenade deck's edge. */
export function struts(detail) {
  const N = segmentsFor(detail), n = detail === 'near' ? 48 : 24, foot = seRing(RINGS.foot, N), deck = seRing(RINGS.deck, N), out = [];
  for (let k = 0; k < n; k++) {
    const i = Math.round((k * N) / n), [fu, fv] = foot[i];
    for (const d of [-1, 1]) {
      const [tu, tv] = deck[(i + d + N) % N];
      out.push({ foot: site(fu, detail === 'near' ? 0.45 : 1.1, fv), head: site(tu * 0.992, LEVELS.deckBottom + 0.1, BOWL.cv + (tv - BOWL.cv) * 0.992), under: [tu * 0.992, tv] });
    }
  }
  return out;
}

/** Long stairs hugging the deck edge: the upper end lands on the deck, the lower on the forecourt. */
export function stairs(detail) {
  const N = segmentsFor(detail), foot = seRing({ a: 111.7, b: 92.5 }, N);
  return [6, 52, 64, 78, 131, 139].map((k) => {
    const i = Math.round((k / 144) * N), [u0, v0] = foot[i], [u1, v1] = foot[(i + 5) % N];
    return { top: site(u0, 9.1, v0), bottom: site(u1, 0.85, v1), topUV: [u0, v0] };
  });
}
