import { FIELD_OPENING, GRASS, T, Tpts, fld, AXIS, RIGHT, HOME } from './oracle-park-site.js';

// The playing surface: warning-track clay (the mapped field opening), the mapped baseball grass,
// the infield skin and lawn, the mound, bases and foul lines. Standard diamond: 90 ft bases,
// mound 60.5 ft from the plate, skin radius 95 ft from the mound. Layers sit 6 cm apart.
const FT = 0.3048, BASE = 90 * FT, MOUND = 60.5 * FT, SKIN_R = 95 * FT;
const arc = (cu, cv, r, a0, a1, n) => Array.from({ length: n + 1 }, (_, k) => { const a = a0 + (a1 - a0) * k / n; return fld(cu + r * Math.cos(a), cv + r * Math.sin(a)); });

export function buildField(B, near) {
  const Y = { clay: 0.1, grass: 0.16, skin: 0.22, lawn: 0.28, mound: 0.34, chalk: 0.4 };
  B('clay').cap(FIELD_OPENING, Y.clay);
  B('grass').cap(GRASS, Y.grass);
  // infield skin: plate circle plus the arc around the mound, bounded by the foul lines
  const diag = BASE / Math.SQRT2, footPoint = 12.8, h = Math.SQRT1_2;
  const reach = (() => { const b = -2 * MOUND * h, c = MOUND * MOUND - SKIN_R * SKIN_R; return (-b + Math.sqrt(b * b - 4 * c)) / 2; })(); // foul-line distance where the arc meets it
  const m1 = reach * h, aEnd = Math.atan2(m1, m1 - MOUND);
  const skin = [
    ...arc(MOUND, 0, SKIN_R, -aEnd, aEnd, near ? 14 : 8),                       // third-base line -> over centre -> first-base line
    ...arc(0, 0, footPoint, Math.PI / 4, 2 * Math.PI - Math.PI / 4, near ? 14 : 8), // round the back of the plate
  ];
  B('clay').cap(skin, Y.skin);
  if (!near) return;
  const lawn = [[13.4, -11.5], [diag, -(diag - 1.9)], [BASE * Math.SQRT2 - 1.9, 0], [diag, diag - 1.9], [13.4, 11.5], [12.2, 6], [11.5, 0], [12.2, -6]].map(([u, v]) => fld(u, v));
  B('grass').cap(lawn, Y.lawn);
  B('clay').cap(arc(MOUND, 0, 2.7, 0, Math.PI * 2, 12).slice(0, -1), Y.mound);
  // bases, plate and foul lines in chalk
  const bags = [[diag, diag], [BASE * Math.SQRT2, 0], [diag, -diag]];
  for (const [u, v] of bags) { const c = fld(u, v); B('stone').box([c[0], Y.chalk + 0.07, c[1]], [0.45, 0.14, 0.45], Math.atan2(AXIS[1], AXIS[0]) * -1 + Math.PI / 4); }
  { const c = fld(0, 0); B('stone').box([c[0], Y.chalk + 0.07, c[1]], [0.5, 0.14, 0.5], -Math.atan2(AXIS[1], AXIS[0])); }
  for (const side of [-1, 1]) {
    const a = fld(0, 0), far = fld(100 * h, side * 100 * h), dx = far[0] - a[0], dz = far[1] - a[1], L = Math.hypot(dx, dz);
    const n = [-dz / L * 0.07, dx / L * 0.07];
    B('stone').quad([a[0] - n[0], Y.chalk, a[1] - n[1]], [far[0] - n[0], Y.chalk, far[1] - n[1]], [far[0] + n[0], Y.chalk, far[1] + n[1]], [a[0] + n[0], Y.chalk, a[1] + n[1]], [0, 1, 0]);
  }
  void RIGHT; void HOME; void T; void Tpts;
}
