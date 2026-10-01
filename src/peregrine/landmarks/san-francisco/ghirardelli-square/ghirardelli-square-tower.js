import { RECT, TOP } from './ghirardelli-square-plan.js';

// The Clock Tower (1916, after the Chateau de Blois): a 6.3 m square red-brick tower at the Larkin St
// / North Point St corner of the Clock Tower Building, four white-framed dials, a corbelled white cornice,
// and a steep slate pyramid roof with a dormer on every face, corner pinnacles and a finial.
// Heights are estimated from photographs against the sourced "over 100 ft" (the model's finial is 34.5 m).
export const TOWER_STAGES = {
  shaft: 15.0, belt: 15.7, cornice: 23.0, corbel: 23.7, attic: 24.3, roofBase: 25.3, apex: 33.0, finial: TOP,
  clockY: 19.6, dial: 1.45,
};

const FACES = [[0, -1], [0, 1], [1, 0], [-1, 0]]; // outward normals in (u, v)

export function buildTower(F, detail) {
  const near = detail === 'near', S = TOWER_STAGES, [u0, u1, v0, v1] = RECT.tower;
  const cu = (u0 + u1) / 2, cv = (v0 + v1) / 2, hw = (u1 - u0) / 2; // 3.15
  const sh = hw - 0.15; // upper shaft half width
  // shaft, belt course, upper shaft
  F.box('brick', u0, u1, 0, S.shaft, v0, v1, 'bottom,top');
  F.box('trim', cu - hw - 0.25, cu + hw + 0.25, S.shaft, S.belt, cv - hw - 0.25, cv + hw + 0.25);
  F.box('brick', cu - sh, cu + sh, S.belt, S.cornice, cv - sh, cv + sh, 'bottom,top');
  // cornice, corbel step and attic stage
  F.box('trim', cu - hw - 0.7, cu + hw + 0.7, S.cornice, S.corbel, cv - hw - 0.7, cv + hw + 0.7);
  F.box('trim', cu - hw - 0.2, cu + hw + 0.2, S.corbel, S.attic, cv - hw - 0.2, cv + hw + 0.2, 'top');
  F.box('trim', cu - sh - 0.05, cu + sh + 0.05, S.attic, S.roofBase, cv - sh - 0.05, cv + sh + 0.05, 'bottom');
  // slate pyramid roof (eaves overhang 0.4 m)
  const eave = sh + 0.45;
  F.frustum('slate', [cu - eave, cu + eave, cv - eave, cv + eave], S.roofBase, [cu, cu, cv, cv], S.apex);
  F.box('steel', cu - 0.09, cu + 0.09, S.apex - 0.1, S.finial, cv - 0.09, cv + 0.09);

  for (const n of FACES) {
    const fu = cu + n[0] * (sh + 0.0), fv = cv + n[1] * (sh + 0.0); // upper-shaft face centre
    // clock panel: white stone frame, the dial (lit at night), twelve ticks and two hands
    const y = S.clockY, r = S.dial;
    F.wallQuad('trim', fu + n[0] * 0.15, fv + n[1] * 0.15, n, 3.9, y - 2.0, y + 2.0);
    const ring = (rad, k, y0 = y) => Array.from({ length: k }, (_, i) => [rad * Math.cos(2 * Math.PI * i / k), y0 + rad * Math.sin(2 * Math.PI * i / k)]);
    F.wallPoly('glow', fu + n[0] * 0.23, fv + n[1] * 0.23, n, ring(r, near ? 18 : 10));
    if (near) {
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12, c = Math.cos(a), s = Math.sin(a), r0 = r - 0.28, r1 = r - 0.08, hwid = i % 3 === 0 ? 0.07 : 0.045;
        F.wallPoly('glass', fu + n[0] * 0.30, fv + n[1] * 0.30, n, [[r0 * c - hwid * s, y + r0 * s + hwid * c], [r1 * c - hwid * s, y + r1 * s + hwid * c], [r1 * c + hwid * s, y + r1 * s - hwid * c], [r0 * c + hwid * s, y + r0 * s - hwid * c]]);
      }
      const hand = (ang, len, wid, off) => {
        const c = Math.cos(ang), sn = Math.sin(ang), pt = (a, p) => [a * c - p * sn, y + a * sn + p * c];
        F.wallPoly('glass', fu + n[0] * off, fv + n[1] * off, n, [pt(-0.12, 0), pt(0.15, wid), pt(len, 0), pt(0.15, -wid)]);
      };
      hand((Math.PI / 180) * 150, 0.8, 0.09, 0.34); // hour hand at about ten
      hand((Math.PI / 180) * 30, 1.2, 0.07, 0.38); // minute hand at about two
    }
    // dormer: white front wall with a dark louvred opening, slate gable roof running back into the pyramid
    if (near) {
      const dist = 3.25, dh = 1.9, dw = 0.8, depth = 1.7, y0 = S.roofBase + 0.4;
      const du = n[0] ? depth / 2 : dw, dv = n[1] ? depth / 2 : dw;
      const du0 = cu + n[0] * (dist - depth / 2), dv0 = cv + n[1] * (dist - depth / 2);
      F.box('trim', du0 - du, du0 + du, y0, y0 + dh, dv0 - dv, dv0 + dv, 'bottom');
      F.gable('slate', du0 - du - 0.15 * (n[0] ? 0 : 1), du0 + du + 0.15 * (n[0] ? 0 : 1), dv0 - dv - 0.15 * (n[1] ? 0 : 1), dv0 + dv + 0.15 * (n[1] ? 0 : 1), y0 + dh, 1.0, n[0] ? 'u' : 'v');
      F.wallQuad('glass', cu + n[0] * (dist + 0.08), cv + n[1] * (dist + 0.08), n, 0.9, y0 + 0.35, y0 + dh - 0.25);
    }
  }
  // corner pinnacles on the roof eaves
  if (near) {
    for (const su of [-1, 1]) for (const sv of [-1, 1]) {
      const pu = cu + su * (eave - 0.25), pv = cv + sv * (eave - 0.25);
      F.frustum('slate', [pu - 0.3, pu + 0.3, pv - 0.3, pv + 0.3], S.roofBase + 0.1, [pu, pu, pv, pv], S.roofBase + 1.9);
    }
  }
}
