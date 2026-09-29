import { SITE_ANGLE, PARTS, PART_TAGS } from './royal-ontario-museum-site.js';
import { skillion, to2, clipConvex, hull2, area2 } from './royal-ontario-museum-solids.js';

// Michael Lee-Chin Crystal (Daniel Libeskind, 2007): five interlocking prismatic volumes clad in champagne-coloured
// anodised aluminium, about a fifth glass. The OSM building parts split it into nine skillion-roofed prisms; each keeps
// its mapped ring, roof plane and height (scaled 37/39 to the published apex). The walls are not vertical: each prism is a
// sheared extrusion whose foot sits back from the roof edge, which is the Crystal's cantilever over Bloor Street.

const C = Math.cos(SITE_ANGLE), S = Math.sin(SITE_ANGLE);
const bearingToUV = (deg) => { const t = deg * Math.PI / 180, x = Math.sin(t), z = -Math.cos(t); return [x * C - z * S, x * S + z * C]; };
export const HS = 37 / 39;

export function crystalRoof(name) {
  const t = PART_TAGS[name], ring = PARTS[name];
  return skillion(ring, +t.height * HS, +t['roof:height'] * HS, bearingToUV(+t['roof:direction']));
}

/** Lean of each prism: metres the wall foot sits inside the roof edge, per metre of height (u, v). */
export const CRYSTALS = {
  cA: { shear: [0, -0.5] },
  cB: { shear: [0, -0.45], wall: 'aluMid' },
  cC: { shear: [0, -0.5] },
  cD: { shear: [0, -0.3] },
  cE: { shear: [0, -0.2] },
  cF: { shear: [0, -0.2] },
  cG: { shear: [0, -0.2] },
  cH: { shear: [0, 0] },
  cI: { shear: [0, 0], y0: 23.7 },
};

/** Bilinear parameterisation of a quad given by four 3D corners: Q(a, b). */
export const quadQ = (P1, P2, P3, P4) => (a, b) => [0, 1, 2].map((k) => (1 - a) * (1 - b) * P1[k] + a * (1 - b) * P2[k] + a * b * P3[k] + (1 - a) * b * P4[k]);
export const wallQ = (f, i) => { const j = (i + 1) % f.foot.length; return quadQ(f.foot[i], f.foot[j], f.top[j], f.top[i]); };

export function buildCrystal(K, { near }) {
  const solids = {};
  for (const [name, opt] of Object.entries(CRYSTALS)) {
    solids[name] = K.slab({ ring: PARTS[name], y0: opt.y0 || 0, roof: crystalRoof(name), shear: opt.shear, mats: { wall: opt.wall || 'alu', roof: 'alu', base: 'aluDark' } });
  }

  /** Glass laid on a face: the polygon is clipped to the face (a band can never poke past the edge it runs into). */
  const lay = (F, pts3, o) => {
    const c = clipConvex(pts3.map((p) => to2(F, p)), hull2(F.ring));
    if (c.length < 3 || Math.abs(area2(c)) < 0.5) return null;
    return K.glaze(F, c, { is2: true, ...o });
  };
  /** A glazed strip along the line a->b in face parameter space, `w` metres wide. */
  const strip = (F, Q, a, b, w, o = {}) => {
    const X = Q(...a), Y = Q(...b), d = [Y[0] - X[0], Y[1] - X[1], Y[2] - X[2]], l = Math.hypot(...d);
    const nrm = F.n, p = [nrm[1] * d[2] - nrm[2] * d[1], nrm[2] * d[0] - nrm[0] * d[2], nrm[0] * d[1] - nrm[1] * d[0]], pl = Math.hypot(...p) || 1;
    const q = p.map((v) => v / pl * w / 2);
    return lay(F, [[X[0] - q[0], X[1] - q[1], X[2] - q[2]], [Y[0] - q[0], Y[1] - q[1], Y[2] - q[2]], [Y[0] + q[0], Y[1] + q[1], Y[2] + q[2]], [X[0] + q[0], X[1] + q[1], X[2] + q[2]]], { grid: near && l > 6, gridStep: 2.4, gridAngle: Math.PI / 2 + 0.0, ...o });
  };
  const poly = (F, Q, pts, o = {}) => lay(F, pts.map((p) => Q(...p)), o);

  // ---- cladding seams --------------------------------------------------------------------------------------------
  if (near) for (const f of Object.values(solids)) {
    K.seams(f.roof, { step: 0.62, width: 0.06, angle: 0 });
    f.walls.forEach((w, i) => { if (w) K.seams(w, { step: 0.62, width: 0.06, angle: (i % 2) * Math.PI / 2 }); });
  }

  // ---- A: the tallest prism, beside the 1933 gable. Its roof plane (about 46 x 30 m) carries the crossed glazed bands. ----
  const A = solids.cA, QAr = quadQ(A.top[2], A.top[3], A.top[4], A.top[0]);
  strip(A.roof, QAr, [0.03, 0.09], [0.97, 0.05], 1.3);
  strip(A.roof, QAr, [0.05, 0.30], [0.80, 0.16], 0.9);
  for (const a of [0.14, 0.31, 0.47, 0.62]) strip(A.roof, QAr, [a, 0.12], [a + 0.07, 0.62], 0.85);
  poly(A.roof, QAr, [[0.55, 0.44], [0.66, 0.38], [0.74, 0.52], [0.62, 0.60]], { grid: near, gridStep: 2.2, frame: 0.3 });
  poly(A.roof, QAr, [[0.16, 0.66], [0.27, 0.60], [0.33, 0.74], [0.22, 0.80]], { grid: near, gridStep: 2.2, frame: 0.3 });
  const QAn = wallQ(A, 3);
  strip(A.walls[3], QAn, [0.03, 0.97], [0.17, 0.05], 3.4, { grid: near, gridStep: 3, gridAngle: 0.9, frame: 0.3 });
  // the big glazed plane at the foot of A's leaning north wall, beside the entrance
  poly(A.walls[3], QAn, [[0.24, 0.0], [0.97, 0.0], [0.90, 0.36], [0.62, 0.52], [0.30, 0.34]], { grid: near, gridStep: 2.8, gridAngle: 0.7, frame: 0.3 });
  strip(A.walls[3], QAn, [0.40, 0.66], [0.80, 0.50], 1.6, { grid: near, gridStep: 3 });

  // ---- B: the entrance prism, dark-clad, with a big lozenge window on its north face --------------------------------
  const B = solids.cB, QB0 = wallQ(B, 0);
  poly(B.walls[0], QB0, [[0.06, 0.26], [0.60, 0.17], [0.96, 0.58], [0.34, 0.80]], { grid: near, gridStep: 2.6, frame: 0.32 });
  // The main entrance: a glazed opening at the foot of B's north wall under a dark canopy, and a glazed lobby wall beside it.
  poly(B.walls[0], QB0, [[0.04, 0.0], [0.70, 0.0], [0.70, 0.15], [0.04, 0.15]], { mat: 'glow', grid: near, gridStep: 2.6, gridAngle: Math.PI / 2, frame: 0.25 });
  K.patch(B.walls[0], [QB0(0.06, 0.155), QB0(0.68, 0.155), QB0(0.68, 0.19), QB0(0.06, 0.19)], 'aluDark', 0.35);
  const QB1 = wallQ(B, 1);
  poly(B.walls[1], QB1, [[0.03, 0.0], [0.96, 0.0], [0.88, 0.44], [0.50, 0.62], [0.10, 0.50]], { mat: 'glow', grid: near, gridStep: 2.6, frame: 0.28 });

  // ---- C: the Crystal Court, a white prism with a triangulated glass front --------------------------------------------
  const Cc = solids.cC, QC4 = wallQ(Cc, 4);
  poly(Cc.walls[4], QC4, [[0.05, 0.04], [0.95, 0.04], [0.90, 0.62], [0.10, 0.70]], { mat: 'glow', grid: near, gridStep: 3.2, gridAngle: 0.6, gridWidth: 0.16, frame: 0.3 });
  // ---- more street-facing glass: C's other faces, the west prism G, D's overhanging north face, B's west face -------------
  poly(Cc.walls[3], wallQ(Cc, 3), [[0.08, 0.04], [0.92, 0.04], [0.88, 0.58], [0.14, 0.66]], { mat: 'glow', grid: near, gridStep: 3.2, gridAngle: -0.6, gridWidth: 0.16, frame: 0.3 });
  poly(Cc.walls[2], wallQ(Cc, 2), [[0.06, 0.05], [0.94, 0.05], [0.90, 0.55], [0.12, 0.62]], { grid: near, gridStep: 3, gridAngle: 0.6, frame: 0.3 });
  poly(Cc.walls[1], wallQ(Cc, 1), [[0.10, 0.06], [0.90, 0.06], [0.86, 0.50], [0.16, 0.56]], { grid: near, gridStep: 3, gridAngle: -0.5, frame: 0.3 });
  const Gs = solids.cG, QG3 = wallQ(Gs, 3);
  poly(Gs.walls[3], QG3, [[0.05, 0.04], [0.55, 0.03], [0.56, 0.42], [0.10, 0.30]], { grid: near, gridStep: 3.2, gridAngle: 0.8, frame: 0.32 });
  strip(Gs.walls[3], QG3, [0.62, 0.12], [0.96, 0.66], 2.6, { grid: near, gridStep: 3 });
  poly(solids.cD.walls[4], wallQ(solids.cD, 4), [[0.05, 0.05], [0.95, 0.05], [0.90, 0.60], [0.10, 0.75]], { grid: near, gridStep: 3, gridAngle: 0.6, frame: 0.3 });
  poly(B.walls[2], wallQ(B, 2), [[0.10, 0.06], [0.90, 0.06], [0.84, 0.62], [0.16, 0.72]], { grid: near, gridStep: 3, gridAngle: -0.7, frame: 0.3 });
  poly(solids.cF.walls[3], wallQ(solids.cF, 3), [[0.10, 0.10], [0.90, 0.05], [0.70, 0.60], [0.25, 0.70]], { grid: near, gridStep: 2.8, frame: 0.28 });

  // ---- the remaining roofs: a long glazed band and a crossing band or two per prism, as on the photographs --------------
  const G = (f, items, o) => f && K.faceGlass(f, items.map((it) => (it.w ? { ...it, w: it.w * 1.5 } : it)), o);
  G(solids.cB.roof, [{ band: [[0.05, 0.30], [0.95, 0.42]], w: 1.1 }, { band: [[0.32, 0.05], [0.52, 0.95]], w: 0.8 }, { band: [[0.66, 0.05], [0.80, 0.95]], w: 0.8 }], { grid: true, gridStep: 2.4 });
  G(solids.cC.roof, [{ band: [[0.08, 0.5], [0.92, 0.5]], w: 2.0, o: { grid: true, gridStep: 2.2 } }], {});
  G(solids.cD.roof, [{ band: [[0.05, 0.42], [0.95, 0.58]], w: 1.2 }, { band: [[0.5, 0.05], [0.62, 0.95]], w: 0.8 }], { grid: true });
  G(solids.cE.roof, [{ band: [[0.1, 0.5], [0.9, 0.45]], w: 1.3 }, { band: [[0.45, 0.08], [0.55, 0.92]], w: 0.8 }], { grid: true });
  G(solids.cG.roof, [{ band: [[0.1, 0.35], [0.9, 0.55]], w: 1.3 }, { band: [[0.55, 0.05], [0.7, 0.95]], w: 0.8 }], { grid: true });
  G(solids.cH.roof, [{ band: [[0.08, 0.3], [0.92, 0.3]], w: 1.4 }, { band: [[0.08, 0.7], [0.92, 0.7]], w: 1.4 }, { band: [[0.5, 0.05], [0.5, 0.95]], w: 0.9 }], { grid: true });
  G(solids.cI.roof, [{ band: [[0.1, 0.4], [0.9, 0.5]], w: 1.3 }], { grid: true });
  return { solids, strip, poly };
}
