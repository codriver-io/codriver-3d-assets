import { LEVELS as L, PLAN } from './san-francisco-city-hall-plan.js';

// Facade pieces in a wall frame (see the kit): s along the wall, y up, d outward from the
// wing plane. `p` is the depth of the plane a piece stands on, `q` the depth of a pavilion's front.

/** Colonnaded wing: rusticated base, recessed wall, free columns, entablature, parapet, windows. */
export function wing(F, near, s0, s1, p = 0) {
  const n = Math.max(1, Math.round((s1 - s0) / PLAN.bay)), bw = (s1 - s0) / n;
  F.box('stone', s0, s1, 0, L.base, p - 8, p);
  F.box('stone', s0, s1, L.base - 0.2, L.base + 0.3, p - 3.6, p + 0.2); // belt course
  F.box('stone2', s0, s1, L.base - 0.2, L.cornice, p - 8, p - 3.4); // shaded wall behind the colonnade
  F.box('stone', s0, s1, L.colTop, L.cornice, p - 3.6, p + 0.3); // entablature
  F.box('stone', s0, s1, L.cornice - 0.2, L.parapet, p - 3.0, p - 0.6); // parapet
  if (near) for (let y = 1.1; y < L.base - 0.5; y += 1.08) F.quad('stone2', s0, s1, y, y + 0.1, p + 0.08); // rustication joints
  for (let i = 1; i < n; i++) {
    const s = s0 + i * bw;
    F.col('stone', s, p - 1.4, L.base, L.colTop, 0.62);
    if (near) F.box('stone', s - 0.85, s + 0.85, L.colTop - 0.8, L.colTop + 0.2, p - 2.25, p - 0.55); // capital
  }
  for (let i = 0; i < n && bw > 2.5; i++) {
    const sc = s0 + (i + 0.5) * bw, hw = Math.min(0.85, bw * 0.21);
    F.quad('glass', sc - hw, sc + hw, 8.4, 13.2, p - 3.34);
    F.quad('glass', sc - hw, sc + hw, 14.8, 19.4, p - 3.34);
    if (near) {
      for (const y of [13.2, 19.4]) F.box('stone', sc - hw - 0.25, sc + hw + 0.25, y, y + 0.45, p - 3.5, p - 3.2); // lintel
      F.box('stone', sc - hw - 0.2, sc + hw + 0.2, 8.0, 8.4, p - 3.5, p - 3.2); // sill
      F.quad('glass', sc - 0.8, sc + 0.8, 1.9, 5.2, p + 0.12);
      F.quad('glass', sc - 0.8, sc + 0.8, 24.0, 25.2, p - 0.54);
    }
  }
}

/** Pedimented pavilion with `cols` free columns between two piers (end pavilions of the E/W fronts, corner pavilions of the long sides). */
export function pavilion(F, near, s0, s1, q, { cols = 2, rise = 2.2 } = {}) {
  const pier = 1.5, inner = s1 - s0 - 2 * pier, gap = inner / (cols + 1);
  F.box('stone', s0, s1, 0, L.base, q - 8, q);
  F.box('stone', s0, s1, L.base - 0.2, L.base + 0.3, q - 3.4, q + 0.2);
  F.box('stone2', s0, s1, L.base - 0.2, L.cornice, q - 8, q - 3.0);
  F.box('stone', s0, s0 + pier, L.base - 0.2, L.cornice, q - 3.2, q - 0.4);
  F.box('stone', s1 - pier, s1, L.base - 0.2, L.cornice, q - 3.2, q - 0.4);
  F.box('stone', s0, s1, L.colTop, L.cornice, q - 3.4, q + 0.3);
  F.pediment('stone', s0 - 0.2, s1 + 0.2, L.cornice - 0.2, rise + 0.2, q - 3.4, q + 0.3);
  if (near) F.pediment('stone2', s0 + 1.4, s1 - 1.4, L.cornice + 0.3, rise * 0.5, q + 0.25, q + 0.38);
  for (let j = 0; j < cols; j++) {
    const s = s0 + pier + gap * (j + 1);
    F.col('stone', s, q - 1.1, L.base, L.colTop, 0.66);
    if (near) F.box('stone', s - 0.9, s + 0.9, L.colTop - 0.8, L.colTop + 0.2, q - 2.0, q - 0.2);
  }
  for (let j = 0; j <= cols; j++) {
    const sc = s0 + pier + gap * (j + 0.5), hw = Math.min(0.9, gap * 0.26);
    F.quad('glass', sc - hw, sc + hw, 8.4, 13.2, q - 3.0 + 0.06);
    F.quad('glass', sc - hw, sc + hw, 14.8, 19.4, q - 3.0 + 0.06);
    if (near) F.quad('glass', sc - 0.8, sc + 0.8, 1.9, 5.2, q + 0.12);
  }
}

/** The six-column portico of a main front: three arched doors, three tall arched windows, a gilded string course, a pediment, steps. */
export function centralPavilion(F, near, q, steps) {
  const h = PLAN.centralHalf, back = q - 4.6;
  F.box('stone', -h, h, 0, L.base, q - 12, q);
  F.box('stone', -h, h, L.base - 0.2, L.base + 0.3, q - 5, q + 0.2);
  F.box('gold', -13.2, 13.2, L.base - 0.05, L.base + 0.2, q + 0.1, q + 0.3); // gilded frieze over the doors
  F.box('stone2', -h, h, L.base - 0.2, L.pavCornice, q - 12, back); // loggia back wall, in shade
  for (const sg of [-1, 1]) F.box('stone', sg > 0 ? h - 1.7 : -h, sg > 0 ? h : -h + 1.7, L.base - 0.2, L.pavCornice, back, q - 0.3);
  F.box('stone', -h, h, L.pavColTop, L.pavCornice, back - 0.2, q + 0.05);
  for (const s of [-12.3, -9.6, -3.4, 3.4, 9.6, 12.3]) {
    F.col('stone', s, q - 1.0, L.base, L.pavColTop, 0.95, near ? 10 : 5);
    if (near) F.box('stone', s - 1.25, s + 1.25, L.pavColTop - 1.0, L.pavColTop + 0.2, q - 2.25, q + 0.25);
  }
  for (const s of [-6.5, 0, 6.5]) {
    if (near) F.disc('stone', s, 21.4, 1.15, back + 0.06); // medallion over each window
    F.arch('glass', s, 8.2, 3.7, 11.8, back + 0.06); // tall windows behind the columns
    F.arch('glass', s, steps.top, 3.4, L.base - 0.1 - steps.top, q + 0.06); // doors
    if (near) { // gilded grilles
      for (let j = -3; j <= 3; j++) F.box('gold', s + j * 0.42 - 0.04, s + j * 0.42 + 0.04, steps.top, L.base - 1.7, q + 0.1, q + 0.2);
      F.box('gold', s - 1.7, s + 1.7, L.base - 1.8, L.base - 1.65, q + 0.1, q + 0.22);
    }
  }
  F.pediment('stone', -h - 0.3, h + 0.3, L.pavCornice - 0.2, L.pediment + 0.2, back - 0.2, q + 0.05);
  F.pediment('stone2', -11.4, 11.4, L.pavCornice + 0.6, 2.9, q - 0.1, q + 0.12); // tympanum, in shadow
  steps.list.forEach(([hy, depth], i) => F.box('stone', -12.4 + 0.15 * i, 12.4 - 0.15 * i, 0, hy, q - 0.2, q + depth));
}

/** Parapet alone, behind a pavilion that stops lower than the wings. */
export function parapet(F, s0, s1) { F.box('stone', s0, s1, L.cornice - 0.2, L.parapet, -3.0, -0.6); }
