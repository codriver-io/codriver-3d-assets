import * as THREE from 'three';
import { PLAN } from './notre-dame-de-quebec-plan.js';
import { facetedFrustum, facetedLathe } from './notre-dame-de-quebec-kit.js';

// The west front (Thomas Baillairgé, 1843-44): a Neoclassical screen with a pedimented centre bay between the two tower bases, the stepped
// attic above it, and the two towers behind. The north tower stops under a low hipped roof; the south tower carries the octagonal belfry,
// its cap, two lanterns and the cross. Authoring frame: see notre-dame-de-quebec-plan.js.
const P = PLAN;
const CENTRE_W = (P.bayN + P.bayS) / 2; // -2.75, the axis of the centre bay

/** A vertical dressed-stone strip (pilaster) proud of a wall; `p` is the wall plane, `a` the along-wall centre. */
function strip(K, face, p, a, y0, y1, wd, proud) {
  const h = wd / 2;
  if (face === 'W') K.box('trim', p - proud, p + 0.1, y0, y1, a - h, a + h);
  else if (face === 'E') K.box('trim', p - 0.1, p + proud, y0, y1, a - h, a + h);
  else if (face === 'N') K.box('trim', a - h, a + h, y0, y1, p - proud, p + 0.1);
  else K.box('trim', a - h, a + h, y0, y1, p - 0.1, p + proud);
}

/** Alternating quoins up a tower corner (near only): flat dressed-stone blocks on the two faces that meet there, long on one face where short on the other. */
function quoins(K, uFace, uC, wFace, wC, inU, inW, y0, y1) {
  if (!K.near) return;
  let i = 0;
  for (let y = y0; y + 0.5 <= y1 + 1e-6; y += 0.6, i++) {
    const [lw, lu] = i % 2 ? [0.55, 1.0] : [1.0, 0.55];
    K.quad(uFace, uC, wC + (inW * lw) / 2, y, lw, 0.5, 'trim'); // on the face at plane u = uC, running along w
    K.quad(wFace, wC, uC + (inU * lu) / 2, y, lu, 0.5, 'trim'); // on the face at plane w = wC, running along u
  }
}

/** A plain Latin cross standing on y0: upright, one arm and (near) a short upper arm. */
export function cross(K, u, w, y0, height, arm) {
  const t = 0.16;
  K.box('metal', u - t / 2, u + t / 2, y0, y0 + height, w - t / 2, w + t / 2);
  K.box('metal', u - t / 2 - 0.01, u + t / 2 + 0.01, y0 + height * 0.62 - t / 2, y0 + height * 0.62 + t / 2, w - arm / 2, w + arm / 2);
  if (K.near) K.box('metal', u - t / 2 - 0.01, u + t / 2 + 0.01, y0 + height * 0.84 - t / 2, y0 + height * 0.84 + t / 2, w - arm * 0.3, w + arm * 0.3);
}

export function buildFront(K) {
  const { near, box, solid, opening, archBand, disc, discRing, b } = K;
  const [cf, sf, tf] = [P.centreFrontU, P.sideFrontU, P.towerFrontU];
  const back = tf + 0.3; // the screen's boxes sink 0.3 m into the tower fronts
  const tb = back - 0.2; // the dressed-stone plinth and entablatures end inside the stone, never on its back plane
  // --- walls of the screen (stone) ---
  box('stone', cf, back, 0, P.centreTop, P.bayN, P.bayS);
  box('stone', sf, back, 0, P.sideTop, P.wNorth, P.bayN + 0.1);
  box('stone', sf, back, 0, P.sideTop, P.bayS - 0.1, P.wSouth);
  // plinth and entablatures (dressed stone, proud of the wall by 0.25 to 0.4 m, never flush with it)
  box('trim', cf - 0.25, tb, 0, 0.8, P.bayN + 0.1, P.bayS - 0.1);
  box('trim', sf - 0.25, tb, 0, 0.8, P.wNorth - 0.1, P.bayN - 0.05);
  box('trim', sf - 0.25, tb, 0, 0.8, P.bayS + 0.05, P.wSouth + 0.1);
  for (const [w0, w1] of [[P.wNorth - 0.12, P.bayN - 0.05], [P.bayS + 0.05, P.wSouth + 0.12]]) box('trim', sf - 0.38, tb, P.sideTop - 0.3, P.sideTop + 0.6, w0, w1);
  box('trim', cf - 0.38, tb, P.centreTop - 0.3, P.pedimentBase, P.bayN - 0.18, P.bayS + 0.18);
  // volutes (ailerons) stepping from the side bays up to the centre bay, one on each side
  for (const s of [-1, 1]) {
    const wEdge = s < 0 ? P.bayN : P.bayS, wOut = wEdge + s * 1.4, yb = P.sideTop + 0.5, yt = P.centreTop - 0.3, uA = sf - 0.2, uB = back;
    const wIn = wEdge - s * 0.2;
    const A = [uA, yb, wOut], B = [uB, yb, wOut], C = [uB, yb, wIn], D = [uA, yb, wIn], E = [uA, yt, wIn], F = [uB, yt, wIn];
    solid('stone', [[A, B, C, D], [A, B, F, E], [D, C, F, E], [A, D, E], [B, C, F]], [(uA + uB) / 2, yb + 0.5, (wOut + wIn) / 2]);
  }
  // --- pediment over the centre bay: stone tympanum, raking cornice, oculus ---
  const pw0 = P.bayN - 0.2, pw1 = P.bayS + 0.2, ub = cf - 0.2, ue = back, yb0 = P.pedimentBase - 0.2, ya = P.pedimentApex;
  solid('stone', [[[ub, yb0, pw0], [ub, yb0, pw1], [ub, ya, CENTRE_W]], [[ue, yb0, pw0], [ue, yb0, pw1], [ue, ya, CENTRE_W]],
    [[ub, yb0, pw0], [ub, yb0, pw1], [ue, yb0, pw1], [ue, yb0, pw0]], [[ub, yb0, pw0], [ub, ya, CENTRE_W], [ue, ya, CENTRE_W], [ue, yb0, pw0]],
    [[ub, yb0, pw1], [ub, ya, CENTRE_W], [ue, ya, CENTRE_W], [ue, yb0, pw1]]], [(ub + ue) / 2, yb0 + 0.8, CENTRE_W]);
  for (const s of [-1, 1]) b.bar('trim', [cf - 0.33, P.pedimentBase + 0.12, CENTRE_W + s * (pw1 - CENTRE_W - 0.1)], [cf - 0.33, ya + 0.12, CENTRE_W], 0.45, 0.5, 0, false, 0);
  disc('W', ub, CENTRE_W, 15.0, 0.75, 'glass');
  if (near) discRing('W', ub, CENTRE_W, 15.0, 0.75, 0.22);
  // --- the centre bay: pilasters, the great stained-glass window, the portal ---
  if (near) {
    for (const dw of [-5.85, 5.85]) strip(K, 'W', cf, CENTRE_W + dw, 0.8, P.centreTop - 0.3, 0.8, 0.32);
    for (const dw of [-3.3, 3.3]) strip(K, 'W', cf, CENTRE_W + dw, 0.8, P.centreTop - 0.3, 0.6, 0.26);
    box('trim', cf - 0.22, cf + 0.1, 4.4, 5.0, CENTRE_W - 1.3, CENTRE_W + 1.3); // the plaque under the window
  }
  if (near) archBand('W', cf, CENTRE_W, 3.0, 5.6, 8.9, 0.3); // the great blind arch round the window, between the inner pilasters
  opening('W', cf, CENTRE_W, 5.4, 2.8, 5.2, { mat: 'glow', ring: 0.4 });
  opening('W', cf, CENTRE_W, 0.8, 2.8, 3.0, { mat: 'glass', ring: 0.35 });
  // --- the side bays (the tower bases): a small door under a canopy, a tall arched window, a window on each end wall ---
  for (const wc of [(P.wNorth + P.bayN) / 2, (P.bayS + P.wSouth) / 2]) {
    opening('W', sf, wc, 3.4, 2.4, 4.6, { ring: 0.35 });
    opening('W', sf, wc, 0.8, 1.4, 1.7, { arch: false, ring: 0 });
    if (near) box('slate', sf - 0.7, sf + 0.1, 2.5, 2.7, wc - 1.1, wc + 1.1);
  }
  opening('N', P.wNorth, -39.35, 3.4, 1.4, 4.4, { ring: 0.3 });
  opening('S', P.wSouth, -39.35, 3.4, 1.4, 4.4, { ring: 0.3 });
  // --- stepped attic behind the pediment, then the small cross-bearing block ---
  const au0 = -39.6, au1 = -37.2;
  box('stone', au0, au1, P.pedimentBase - 0.4, P.atticTop, CENTRE_W - 5.2, CENTRE_W + 5.2);
  box('trim', au0 - 0.3, au1 - 0.2, P.atticTop - 0.55, P.atticTop + 0.2, CENTRE_W - 5.4, CENTRE_W + 5.4); // ends inside the attic's stone, not on its back plane
  box('stone', -39.2, -37.4, P.atticTop + 0.2, P.blockTop, CENTRE_W - 1.7, CENTRE_W + 1.7);
  box('trim', -39.45, -37.4, P.blockTop, P.blockTop + 0.3, CENTRE_W - 2.0, CENTRE_W + 2.0);
  if (near) disc('W', au0, CENTRE_W, 18.3, 0.5, 'glass');
  cross(K, -38.6, CENTRE_W, P.blockTop + 0.3, 3.4, 1.2);
  // urns at the outer ends of the side bays' cornices
  if (near) for (const wu of [P.wNorth + 0.9, P.wSouth - 0.9]) {
    const g = new THREE.CylinderGeometry(0.38, 0.28, 1.0, 8); g.translate(-40.5, P.sideTop + 0.6 + 0.45, wu); K.put(g, 'trim');
  }
}

export function buildTowers(K) {
  const { near, box, hip, opening, disc } = K;
  const N = P.northTower, S = P.southTower;
  // ---------- north tower: the unfinished one, square masonry under a low hipped roof ----------
  const wcN = (N.w0 + N.w1) / 2, ucN = (N.u0 + N.u1) / 2;
  box('stone', N.u0, N.u1, 0, N.top - 0.3, N.w0, N.w1); // its top sits inside the cornice and roof
  box('trim', N.u0 - 0.45, N.u1 + 0.45, N.top - 0.8, N.top, N.w0 - 0.45, N.w1 + 0.45);
  hip('slate', N.u0 - 0.45, N.u1 + 0.45, N.w0 - 0.45, N.w1 + 0.45, N.top, N.roofApex - N.top, 0, 0.2);
  box('trim', N.u0 - 0.2, N.u1 + 0.2, P.sideTop + 0.35, P.sideTop + 0.7, N.w0 - 0.2, N.w1 + 0.2); // string courses
  box('trim', N.u0 - 0.2, N.u1 + 0.2, 25.0, 25.35, N.w0 - 0.2, N.w1 + 0.2);
  quoins(K, 'W', N.u0, 'N', N.w0, 1, 1, P.sideTop + 0.8, N.top - 1.0); // north-west corner
  quoins(K, 'E', N.u1, 'N', N.w0, -1, 1, 19.3, N.top - 1.0); // north-east corner (above the aisle roof)
  for (const [face, p, a] of [['W', N.u0, -13.2], ['N', N.w0, ucN]]) { // the west face is partly fronted by the centre bay, so its windows sit toward the outer end
    opening(face, p, a, 10.4, 2.0, 4.8, { ring: 0.3 });
    opening(face, p, a, 19.6, 2.4, 4.4, { ring: 0.35 });
    opening(face, p, a, 26.4, 2.4, 4.4, { ring: 0.35 }); // the tall upper stage under the cornice
    disc(face, p, a, 17.4, 0.6);
  }
  opening('E', N.u1, wcN, 19.6, 2.4, 4.4, { ring: 0.35 });
  opening('E', N.u1, wcN, 26.4, 2.4, 4.4, { ring: 0.35 });

  // ---------- south tower: square base under a low hipped roof, then the octagonal belfry ----------
  const cu = (S.u0 + S.u1) / 2, cw = (S.w0 + S.w1) / 2;
  box('stone', S.u0, S.u1, 0, S.top - 0.3, S.w0, S.w1);
  box('trim', S.u0 - 0.45, S.u1 + 0.45, S.top - 0.7, S.top, S.w0 - 0.45, S.w1 + 0.45);
  hip('slate', S.u0 - 0.45, S.u1 + 0.45, S.w0 - 0.45, S.w1 + 0.45, S.top, S.roofApex - S.top, 0, 0.2, S.apothem - 0.1);
  box('trim', S.u0 - 0.2, S.u1 + 0.2, P.sideTop + 0.35, P.sideTop + 0.7, S.w0 - 0.2, S.w1 + 0.2);
  quoins(K, 'W', S.u0, 'S', S.w1, 1, -1, P.sideTop + 0.8, S.top - 0.9); // south-west corner
  quoins(K, 'E', S.u1, 'S', S.w1, -1, -1, P.sideTop + 0.8, S.top - 0.9); // south-east corner
  for (const w of [6.1, 8.9]) opening('W', S.u0, w, 10.2, 1.4, 3.2, { ring: 0.28 });
  for (const du of [-1.8, 1.8]) opening('S', S.w1, cu + du, 10.2, 1.4, 3.2, { ring: 0.28 });
  buildBelfry(K, cu, cw);
}

/** The belfry on the south tower: octagonal louvred shaft, flared cap, two arcaded lanterns under domed roofs, the cross. */
function buildBelfry(K, cu, cw) {
  const { near, put, openingOct } = K, S = P.southTower, a = S.apothem, top = S.shaftTop;
  const R = (apo) => apo / Math.cos(Math.PI / 8); // circumradius of an octagon with the given apothem
  put(facetedFrustum(R(a), R(a), S.top - 0.5, top - 0.6, cu, cw), 'stone'); // the shaft
  for (let k = 0; k < 8; k++) { // louvred openings: four large on the cardinal faces, four narrower on the diagonals (far: cardinal only)
    if (!near && k % 2) continue;
    openingOct(k, cu, cw, a, 16.8, k % 2 ? 1.6 : 1.9, 8.0, { ring: near ? 0.3 : 0 });
  }
  if (near) for (let k = 0; k < 8; k++) { // slender corner pilasters up the shaft
    const th = ((k + 0.5) * Math.PI) / 4, y0 = S.top + 0.9, y1 = top - 0.7;
    K.b.box('trim', [cu + Math.sin(th) * R(a), (y0 + y1) / 2, cw + Math.cos(th) * R(a)], [0.42, y1 - y0, 0.42], th, 0, 0);
  }
  put(facetedFrustum(R(a + 0.4), R(a + 0.4), top - 0.6, top, cu, cw), 'trim'); // cornice
  // flared cap, then the first lantern (open arcade, balustrade course) under its dome
  const r1 = 2.0, cap = top;
  put(facetedLathe([[R(a + 0.2), cap], [R(a), cap + 0.5], [R(3.4), cap + 1.8], [R(2.9), cap + 2.9], [R(r1 + 0.3), cap + 3.6], [0.001, cap + 3.8]], cu, cw), 'slate');
  const l1 = cap + 3.7, l1Top = l1 + 6.6;
  put(facetedFrustum(R(r1), R(r1), l1 - 0.1, l1Top, cu, cw), 'slate');
  if (near) {
    put(facetedFrustum(R(r1 + 0.22), R(r1 + 0.22), l1 - 0.1, l1 + 0.6, cu, cw), 'trim');
    for (let k = 0; k < 8; k++) openingOct(k, cu, cw, r1, l1 + 1.2, 0.85, 3.9, { ring: 0.2, d: 0.1 });
  } else for (const k of [0, 2, 4, 6]) openingOct(k, cu, cw, r1, l1 + 1.2, 0.95, 3.9, { ring: 0, d: 0.1 });
  const d1 = l1Top;
  put(facetedLathe([[R(r1 + 0.65), d1 - 0.1], [R(r1 + 0.75), d1 + 0.3], [R(2.2), d1 + 1.2], [R(1.6), d1 + 2.2], [R(1.1), d1 + 2.9], [R(0.9), d1 + 3.2], [0.001, d1 + 3.2]], cu, cw), 'slate');
  // second lantern and its pointed dome
  const l2 = d1 + 3.2, l2Top = l2 + 3.8, r2 = 1.1;
  put(facetedFrustum(R(r2), R(r2), l2 - 0.1, l2Top, cu, cw), 'slate');
  for (const k of [0, 2, 4, 6]) openingOct(k, cu, cw, r2, l2 + 0.7, 0.6, 2.4, { ring: near ? 0.12 : 0, d: 0.1 });
  const d2 = l2Top;
  put(facetedLathe([[R(r2 + 0.45), d2 - 0.1], [R(r2 + 0.45), d2 + 0.25], [R(0.95), d2 + 0.95], [R(0.55), d2 + 1.8], [R(0.2), d2 + 2.4], [0.001, d2 + 2.7]], cu, cw), 'slate');
  cross(K, cu, cw, d2 + 2.6, 5.4, 1.4);
}
