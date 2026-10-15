import { deckHeight as h, TOWER_S, CENTRE_S, MAIN_SPAN, ABUTMENT_S, GIRDER_OUT, COLUMN_D } from './albert-bridge-london-profile.js';

// Cable layout shared by the geometry and its contact tests. Points are [station, lateral, y].
// Heights above the roadway at a tower (photographic estimates scaled from the mapped span):
export const COL = { pierTop: -1.3, plinth: 1.4, capital: 17.9, capitalTop: 18.8, lantern: 21.0, spire: 21.2, spireTop: 23.6, finial: 28.4 };
export const GIRDER_TOP = 1.15, GIRDER_BOTTOM = -1.3;
export const CHAIN_TOP = 17.6; // chains meet the column just under the capital
// Ordish's 32 stays: four flat bars per column into each span, fanning from under the capital.
export const STAYS_MAIN = [12, 24, 36, 48], STAYS_SIDE = [10.5, 21, 31.5, 42];
export const STAY_TOPS = [14.4, 15.4, 16.4, 17.4];
const GIRDER_D = GIRDER_OUT - 0.2; // girder centreline

export function stays() {
  const out = [];
  for (const sT of TOWER_S) {
    const yD = h(sT), river = sT === TOWER_S[0] ? 1 : -1;
    for (const o of [-1, 1]) for (const [list, dir] of [[STAYS_MAIN, river], [STAYS_SIDE, -river]]) list.forEach((dist, i) => {
      const s = sT + dir * dist;
      out.push({ top: [sT, o * COLUMN_D, yD + STAY_TOPS[i]], foot: [s, o * GIRDER_D, h(s) + GIRDER_TOP - 0.25] });
    });
  }
  return out;
}

// Bazalgette's chains (1884-87): over the main span they hang from the column heads and meet the
// girder at mid-span; over each side span they run from the column head to the girder end at
// the abutment. u runs 0..1 from the first end to the second.
const yTop = () => h(TOWER_S[0]) + CHAIN_TOP;
export function mainChain(u, o) {
  const k = (2 * u - 1) ** 2, s = TOWER_S[0] + u * MAIN_SPAN, low = h(CENTRE_S) + GIRDER_TOP - 0.15;
  return [s, o * (GIRDER_D + (COLUMN_D - GIRDER_D) * k), low + (yTop() - low) * k];
}
export function sideChain(u, o, side) {
  const sT = TOWER_S[side], sE = ABUTMENT_S[side] + (side ? -1.0 : 1.0), s = sT + (sE - sT) * u;
  const y = yTop() + (h(sE) + GIRDER_TOP - 0.15 - yTop()) * u - 1.2 * 4 * u * (1 - u);
  return [s, o * (COLUMN_D + (GIRDER_D - COLUMN_D) * u), y];
}
export function chains(detail = 'near') {
  const n = detail === 'near' ? 24 : 10, m = detail === 'near' ? 12 : 6, out = [];
  for (const o of [-1, 1]) {
    out.push({ name: 'main', o, f: u => mainChain(u, o), segments: n });
    for (const side of [0, 1]) out.push({ name: side ? 'south' : 'north', o, f: u => sideChain(u, o, side), segments: m });
  }
  return out;
}
// A point on the chain as drawn: straight eyebar segments between the curve samples.
export function chainPoint(c, u) {
  const i = Math.min(c.segments - 1, Math.floor(u * c.segments)), t = u * c.segments - i;
  const a = c.f(i / c.segments), b = c.f((i + 1) / c.segments);
  return a.map((v, k) => v + (b[k] - v) * t);
}
// Vertical hangers every ~3 m from each chain to its girder (every other one in far).
export function hangers(detail = 'near') {
  const out = [];
  for (const c of chains(detail)) {
    const len = Math.abs(c.f(1)[0] - c.f(0)[0]), count = Math.round(len / 3);
    for (let k = 1; k < count; k++) {
      if (detail !== 'near' && k % 2) continue;
      const p = chainPoint(c, k / count), yG = h(p[0]) + GIRDER_TOP;
      if (p[2] - yG < 0.8) continue;
      out.push({ chain: c, top: [p[0], p[1], p[2] - 0.05], foot: [p[0], c.o * GIRDER_D, yG - 0.1] });
    }
  }
  return out;
}
