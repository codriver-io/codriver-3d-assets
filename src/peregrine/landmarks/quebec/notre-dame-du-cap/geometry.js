import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ROT, TAN, COS, Soup, flat, octPrism, lancet, parabola, towerBlock, stair, hash, boxAB } from './notre-dame-du-cap-parts.js';

const { octApothem: Ra, wallTop: He, gableApex: Ga, gableHalf: hw, roofTop: Yr, lanternHalf: Lh, lanternTop: Yl, spireTip: Ys, crossTip: Yc, portalZ: Zp, floorY: Yf } = SPEC;
const RECESS = Zp - 3.2; // the tympanum plane, set back inside the arch
const FACET = (i) => (i * Math.PI) / 4;
const FAR_MAP = { stoneDark: 'stone', wood: 'dark', glass: 'dark', roofFlat: 'copperDark' };
const SLOPE = (Yr - He) / (Ra - Lh); // rise per metre of run of the pyramid faces
const apAt = (y) => Ra - (y - He) / SLOPE; // apothem of the pyramid at height y

// Authored in the building frame (x to the viewer's right in front of the portal, z toward the portal); `add` turns it onto the mapped outline.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const mat = (m) => (near ? m : (FAR_MAP[m] ?? m));
  const add = (g, m) => { g.rotateY(ROT); g.translate(SPEC.anchor[0], 0, SPEC.anchor[1]); b.put(g, mat(m)); };
  const put = (soup, m) => { if (!soup.empty) add(soup.geometry(), m); };
  const box = (m, x0, y0, z0, x1, y1, z1) => add(boxAB(x0, y0, z0, x1, y1, z1), m);
  const mirror = (fn) => { fn(1); fn(-1); };

  // Faces of a pyramid in patches of light and dark copper: rows of runs, merged where neighbours share a colour. The patches are
  // streaks along the fall line (the noise is stretched about 5:1 down the face and the occasional flips are whole 6-row runs), not
  // square cells; the far roof is one mid colour (`copperMid`, the near mean) so the level of detail does not pop.
  const noise = (f, r, j) => { const x = j / 1.7, y = r / 9, x0 = Math.floor(x), y0 = Math.floor(y), tx = x - x0, ty = y - y0; const v = (i, k) => hash(f, y0 + k, x0 + i); return (v(0, 0) * (1 - tx) + v(1, 0) * tx) * (1 - ty) + (v(0, 1) * (1 - tx) + v(1, 1) * tx) * ty; };
  function patches(light, dark, f, { a0, y0, a1, y1, rows, segs, seed = 0, share = 0.4 }) {
    light.phi = dark.phi = FACET(f);
    for (let r = 0; r < rows; r++) {
      const t0 = r / rows, t1 = (r + 1) / rows, ya = y0 + (y1 - y0) * t0, yb = y0 + (y1 - y0) * t1;
      const aa = a0 + (a1 - a0) * t0, ab = a0 + (a1 - a0) * t1, ha = aa * TAN, hb = ab * TAN;
      let run = null;
      const emit = () => { if (run) (run.dark ? dark : light).poly([[run.u0 * ha, ya, aa], [run.u1 * ha, ya, aa], [run.u1 * hb, yb, ab], [run.u0 * hb, yb, ab]], [0, 1, 1]); };
      for (let j = 0; j < segs; j++) {
        const u0 = -1 + (2 * j) / segs, u1 = -1 + (2 * (j + 1)) / segs;
        const isDark = (noise(f + seed, r, j) > share) !== (hash(Math.floor(r / 6), j, f + 9 + seed) < 0.08);
        if (run && run.dark === isDark) run.u1 = u1; else { emit(); run = { dark: isDark, u0, u1 }; }
      }
      emit();
    }
  }
  // A gable on a facet: the wall triangle and two roof planes meeting the facet along a valley.
  function gable(wall, roof, f, { half, y0, apex, aWall, rise, slope }) {
    wall.phi = roof.phi = FACET(f);
    const t = (apex - y0) / (slope - rise), yB = apex + rise * t, aB = aWall - t;
    const El = [-half, y0, aWall], Er = [half, y0, aWall], A = [0, apex, aWall], B = [0, yB, aB], C = [0, (2 * y0 + apex + yB) / 4, (3 * aWall + aB) / 4];
    wall.tri(El, Er, A, C, 'in'); roof.tri(El, A, B, C, 'in'); roof.tri(Er, A, B, C, 'in');
  }

  // --- The octagon: plinth, eight walls, a stone pilaster at every corner, a cornice under the roof.
  add(octPrism(Ra + 0.3, 0, 1.0, true), 'stoneDark');
  add(octPrism(Ra, 0, He), 'stone');
  add(octPrism(Ra + 0.3, He - 0.6, He + 0.1, true), 'stoneDark');
  const Rc = Ra / COS;
  for (let i = 0; i < 8; i++) {
    const a = FACET(i) + Math.PI / 8, g = boxAB(-0.6, 0, -0.6, 0.6, He + 0.8, 0.6);
    g.rotateY(a); g.translate(Math.sin(a) * Rc, 0, Math.cos(a) * Rc); add(g, 'stone');
  }

  // --- The pyramidal roof: eight faces from the eaves to the lantern, dark slate-green with verdigris patches.
  const copper = new Soup(), copperDark = new Soup();
  const rows = near ? 30 : 1, segs = near ? 10 : 1, copperMid = new Soup();
  for (let f = 0; f < 8; f++) patches(near ? copper : copperMid, near ? copperDark : copperMid, f, { a0: Ra, y0: He, a1: Lh, y1: Yr, rows, segs });
  // a belt course round the roof under the dormers
  const yBelt = 38.2;
  if (near) add(octPrism(apAt(yBelt) + 0.15, yBelt, yBelt + 0.7), 'stoneDark');
  // eight triangular glazed dormers above the belt, one on every face
  const dStone = new Soup(), dRoof = new Soup(), dGlass = new Soup();
  const yD = 41.3, aD = apAt(yD);
  for (let f = 0; f < 8; f++) {
    gable(dStone, dRoof, f, { half: 2.3, y0: yD, apex: yD + 3.9, aWall: aD, rise: 0.6, slope: SLOPE });
    dGlass.phi = FACET(f); dGlass.tri([-1.65, yD + 0.45, aD + 0.1], [1.65, yD + 0.45, aD + 0.1], [0, yD + 2.7, aD + 0.1], [0, 0, 1]);
  }
  put(dStone, 'stone'); put(dRoof, 'copperDark'); put(dGlass, 'glow');

  // --- The four transept arms stand on the diagonal faces: each is a stone gable with a rose and three mitre windows over two roof planes.
  // The side faces and the choir face are plain walls under the roof, with three tall stained-glass windows each.
  const gableStone = new Soup(), gableRoof = new Soup(), glow = new Soup(), trim = new Soup();
  for (let f = 1; f < 8; f++) {
    if (f % 2 === 1) gable(gableStone, gableRoof, f, { half: hw, y0: He, apex: Ga, aWall: Ra, rise: 0.8, slope: SLOPE });
    glow.phi = trim.phi = FACET(f);
    if (near && f % 2 === 1) for (const sg of [-1, 1]) { // a stone coping along each raking edge of the gable
      const L = Math.hypot(hw, Ga - He), nx = (-sg * (Ga - He)) / L * 0.7, ny = (-hw / L) * 0.7, cz = Ra + 0.1;
      trim.poly([[sg * hw, He, cz], [0, Ga, cz], [nx, Ga + ny, cz], [sg * hw + nx, He + ny, cz]], [0, 0, 1]);
    }
    const z = Ra + 0.16, rose = f % 2 === 1;
    const win = (pts) => glow.poly(pts.map(([x, y]) => [x, y, z]), [0, 0, 1]);
    const framed = (x, w, y0, yS) => { // a lancet of glass in a stone frame
      win(lancet(w, y0, yS, near ? 4 : 2).map(([px, py]) => [px + x, py]));
      if (near) trim.poly(lancet(w + 0.7, y0 - 0.35, yS, 4).map(([px, py]) => [px + x, py, Ra + 0.1]), [0, 0, 1]);
    };
    const roseAt = (yc, rr, n, spokes) => {
      for (let k = 0; k < n; k++) {
        const a0 = (k / n) * 2 * Math.PI, a1 = ((k + 1) / n) * 2 * Math.PI, ri = rr - 0.55;
        glow.tri([0, yc, z], [ri * Math.cos(a0), yc + ri * Math.sin(a0), z], [ri * Math.cos(a1), yc + ri * Math.sin(a1), z], [0, 0, 1]);
        if (spokes) trim.poly([[ri * Math.cos(a0), yc + ri * Math.sin(a0), z + 0.04], [rr * Math.cos(a0), yc + rr * Math.sin(a0), z + 0.04], [rr * Math.cos(a1), yc + rr * Math.sin(a1), z + 0.04], [ri * Math.cos(a1), yc + ri * Math.sin(a1), z + 0.04]], [0, 0, 1]);
      }
      if (spokes) for (let k = 0; k < 4; k++) {
        const a = (k * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a), w = 0.1, l = rr - 0.5;
        trim.poly([[-l * c - w * s, yc - l * s + w * c, z + 0.06], [l * c - w * s, yc + l * s + w * c, z + 0.06], [l * c + w * s, yc + l * s - w * c, z + 0.06], [-l * c + w * s, yc - l * s - w * c, z + 0.06]], [0, 0, 1]);
      }
    };
    if (rose) {
      roseAt(15.9, 2.9, near ? 16 : 8, near);
      for (const x of [-2.7, 0, 2.7]) framed(x, 1.3, 6.8, 9.2);
    } else {
      const lowY = f === 4 ? 12.6 : 4.6, springY = f === 4 ? 17.2 : 14.6, w = f === 4 ? 2.3 : 2.6;
      for (const x of [-5.2, 0, 5.2]) {
        framed(x, w, lowY, springY);
        if (near) { // a mullion and a transom
          const m = (lowY + springY) / 2;
          trim.poly([[x - 0.07, lowY, z + 0.04], [x + 0.07, lowY, z + 0.04], [x + 0.07, springY + 0.9, z + 0.04], [x - 0.07, springY + 0.9, z + 0.04]], [0, 0, 1]);
          trim.poly([[x - w / 2, m - 0.07, z + 0.04], [x + w / 2, m - 0.07, z + 0.04], [x + w / 2, m + 0.07, z + 0.04], [x - w / 2, m + 0.07, z + 0.04]], [0, 0, 1]);
        }
      }
    }
  }
  put(gableStone, 'stone'); put(gableRoof, 'copper'); put(copper, 'copper'); put(copperDark, 'copperDark'); put(copperMid, 'copperMid'); put(glow, 'glow'); put(trim, 'stoneDark');

  // --- The portal tower: a tapering block with the parabolic arch cut through it, the tympanum, doors, statues and belfry stage.
  const archN = near ? 20 : 8;
  add(towerBlock({ z0: 15, z1: Zp, baseHalf: SPEC.towerBaseHalf, topHalf: SPEC.towerTopHalf, top: SPEC.towerTop, archHalf: SPEC.archHalf, floorY: Yf, archApex: SPEC.archApex, archN }), 'stone');
  const arch = parabola(SPEC.archHalf, Yf, SPEC.archApex, archN);
  const tym = new Soup(); tym.poly(arch.map(([x, y]) => [x, y, RECESS]), [0, 0, 1]); put(tym, 'plaster');
  const zf = Zp + 0.12;
  if (near) { // the framed band round the arch, a little proud of the front
    const outer = parabola(SPEC.archHalf + 1.5, Yf, SPEC.archApex + 1.5, 20), inner = [...arch].reverse();
    const band = new Soup(); band.shape([...outer, ...inner].map(([x, y]) => [x, y]), zf); put(band, 'stoneDark');
  }
  if (near) { // ashlar courses on the tower front, every 1.8 m, stopping at the arch band
    const courses = new Soup(), half = (y) => SPEC.towerBaseHalf + (SPEC.towerTopHalf - SPEC.towerBaseHalf) * (y / SPEC.towerTop);
    const outerTop = SPEC.archApex + 1.5, outerHalf = SPEC.archHalf + 1.5;
    for (let y = 3.6; y < SPEC.towerTop - 0.9; y += 1.8) {
      const ao = y < outerTop ? outerHalf * Math.sqrt((outerTop - y) / (outerTop - Yf)) + 0.15 : 0, w = half(y) - 0.25, zc = Zp + 0.15;
      for (const s of ao > 0 ? [-1, 1] : [0]) {
        const x0 = s === 0 ? -w : s * ao, x1 = s === 0 ? w : s * w;
        courses.poly([[Math.min(x0, x1), y - 0.035, zc], [Math.max(x0, x1), y - 0.035, zc], [Math.max(x0, x1), y + 0.035, zc], [Math.min(x0, x1), y + 0.035, zc]], [0, 0, 1]);
      }
    }
    put(courses, 'stoneDark');
  }
  // doors on the tympanum plane: a pointed central door under a frame, a rectangular door each side
  const doors = new Soup(), frames = new Soup();
  const zd = RECESS + 0.12, zfr = RECESS + 0.07;
  frames.poly(lancet(3.9, Yf, 6.6, near ? 4 : 2).map(([x, y]) => [x, y, zfr]), [0, 0, 1]);
  doors.poly(lancet(3.1, Yf, 6.0, near ? 4 : 2).map(([x, y]) => [x, y, zd]), [0, 0, 1]);
  for (const s of [-1, 1]) doors.poly([[s * 3.4, Yf, zd], [s * 5.2, Yf, zd], [s * 5.2, Yf + 4.7, zd], [s * 3.4, Yf + 4.7, zd]], [0, 0, 1]);
  put(frames, 'stoneDark'); put(doors, 'wood');
  for (const s of [-1, 1]) { // the two tall statues in their pillars beside the central door
    box('stone', s * 2.7 - 0.45, Yf, RECESS, s * 2.7 + 0.45, Yf + 8.6, RECESS + 0.8);
    const cap = new Soup(), p = [[s * 2.7 - 0.45, Yf + 8.6, RECESS], [s * 2.7 + 0.45, Yf + 8.6, RECESS], [s * 2.7 + 0.45, Yf + 8.6, RECESS + 0.8], [s * 2.7 - 0.45, Yf + 8.6, RECESS + 0.8]];
    for (let i = 0; i < 4; i++) cap.tri(p[i], p[(i + 1) % 4], [s * 2.7, Yf + 9.8, RECESS + 0.4], [s * 2.7, Yf + 8.6, RECESS + 0.4], 'in'); put(cap, 'stone');
  }
  // the statue of Mary (7.3 m) on a bracket, high on the tympanum
  const prof = [[0, 0], [0.95, 0], [0.9, 0.5], [0.75, 2.2], [0.95, 3.7], [0.7, 4.9], [0.55, 5.7], [0.5, 6.1], [0.36, 6.3], [0.42, 6.8], [0.3, 7.15], [0, 7.3]];
  const fig = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), near ? 8 : 5);
  fig.translate(0, 11.9, RECESS + 0.6); add(flat(fig), 'stone');
  box('stoneDark', -1.1, 11.4, RECESS, 1.1, 11.9, RECESS + 1.6);
  // belfry stage: a row of slit windows, then five louvred lancets under the pointed crown
  const slits = new Soup(), louvres = new Soup();
  for (let k = -2; k <= 2; k++) {
    slits.poly([[k * 1.75 - 0.22, 26.2, zf], [k * 1.75 + 0.22, 26.2, zf], [k * 1.75 + 0.22, 28.4, zf], [k * 1.75 - 0.22, 28.4, zf]], [0, 0, 1]);
    louvres.poly(lancet(1.1, 30.4, 32.4, near ? 3 : 2).map(([x, y]) => [x + k * 1.75, y, zf]), [0, 0, 1]);
  }
  put(slits, 'dark'); put(louvres, 'dark');
  for (let k = -2; k <= 2; k++) { // five pointed crown gablets, one over each louvre
    const x = k * 1.75;
    box('stone', x - 0.65, 35.9, Zp - 1.3, x + 0.65, 36.9, Zp - 0.2);
    const cap = new Soup(), p = [[x - 0.65, 36.9, Zp - 1.3], [x + 0.65, 36.9, Zp - 1.3], [x + 0.65, 36.9, Zp - 0.2], [x - 0.65, 36.9, Zp - 0.2]];
    for (let i = 0; i < 4; i++) cap.tri(p[i], p[(i + 1) % 4], [x, 38.3, Zp - 0.75], [x, 36.9, Zp - 0.75], 'in');
    put(cap, 'stone');
  }
  // the stair up to the portal
  add(stair({ zBack: Zp - 0.05, width: 17, top: Yf, steps: near ? 12 : 4, tread: near ? 0.34 : 1.02 }), 'stone');

  // --- The two covered galleries (ramps) with their end pavilions (edicules).
  const [gz0, gz1] = SPEC.galleryZ, [px0, px1] = SPEC.pavilionX, gt = SPEC.galleryTop;
  mirror((s) => {
    const bx = (m, a, y0, z0, c, y1, z1) => box(m, s > 0 ? a : -c, y0, z0, s > 0 ? c : -a, y1, z1);
    bx('stoneDark', 10.5, 0, gz0, px0, 0.6, gz1 + 0.4);
    bx('glass', 10.5, 0.6, gz0, px0, gt - 0.7, gz0 + 0.4);
    bx('plaster', 10.5, gt - 0.7, gz0 - 0.2, px0 + 0.4, gt - 0.1, gz1 + 0.4);
    bx('roofFlat', 10.9, gt - 0.15, gz0 + 0.1, px0 - 0.1, gt, gz1);
    for (let k = 0; k < (near ? 7 : 4); k++) {
      const x = near ? 12.8 + 2.3 * k : 13 + 4.6 * k, g = new THREE.CylinderGeometry(0.26, 0.26, gt - 0.7 - 0.6, near ? 6 : 4, 1, true);
      g.translate(s * x, (0.6 + gt - 0.7) / 2, gz1 - 0.3); add(flat(g), 'plaster');
      if (near) { box('plaster', s * x - 0.36, 0.55, gz1 - 0.66, s * x + 0.36, 0.85, gz1 + 0.06); box('plaster', s * x - 0.38, gt - 1.05, gz1 - 0.68, s * x + 0.38, gt - 0.65, gz1 + 0.08); }
    }
    if (near) { const q = new Soup(); for (let x = 11.9; x < px0 - 0.5; x += 2.3) q.poly([[s * x - 0.07, 0.7, gz0 + 0.46], [s * (x + 0.14) - 0.07, 0.7, gz0 + 0.46], [s * (x + 0.14) - 0.07, gt - 0.75, gz0 + 0.46], [s * x - 0.07, gt - 0.75, gz0 + 0.46]], [0, 0, 1]); put(q, 'plaster'); }
    // pavilion: stone walls, a cornice, a copper pyramid, a pointed door in front
    const cx = s * (px0 + px1) / 2, hx = (px1 - px0) / 2, cz = (gz0 - 2.5 + gz1 + 0.5) / 2, hz = (gz1 + 0.5 - (gz0 - 2.5)) / 2;
    bx('stone', px0, 0, gz0 - 2.5, px1, 6.9, gz1 + 0.5);
    bx('stoneDark', px0 - 0.25, 6.4, gz0 - 2.75, px1 + 0.25, 7.0, gz1 + 0.75);
    const base = [[cx - hx - 0.25, 7.0, cz - hz - 0.25], [cx + hx + 0.25, 7.0, cz - hz - 0.25], [cx + hx + 0.25, 7.0, cz + hz + 0.25], [cx - hx - 0.25, 7.0, cz + hz + 0.25]], apex = [cx, 14.6, cz];
    const roofG = new Soup(); for (let i = 0; i < 4; i++) roofG.tri(base[i], base[(i + 1) % 4], apex, [cx, 7.0, cz], 'in');
    put(roofG, 'copper');
    const door = new Soup(); door.poly(lancet(2.4, 0.1, 4.4, near ? 4 : 2).map(([x, y]) => [cx + x, y, gz1 + 0.5 + 0.1]), [0, 0, 1]); put(door, 'dark');
  });

  // --- The choir and sacristy block behind the octagon.
  const [cx0, cx1, cz1] = [-17.5, 13.5, SPEC.choirZ];
  box('stone', cx0, 0, cz1, cx1, 11.0, -26.0);
  box('roofFlat', cx0 + 0.5, 10.95, cz1 + 0.5, cx1 - 0.5, 11.1, -26.6);
  if (near) {
    const win = new Soup();
    for (let k = 0; k < 6; k++) { const x = cx0 + 3 + k * 5.0; win.poly([[x - 0.8, 3.4, cz1 - 0.1], [x - 0.8, 7.6, cz1 - 0.1], [x + 0.8, 7.6, cz1 - 0.1], [x + 0.8, 3.4, cz1 - 0.1]], [0, 0, -1]); }
    for (const [x, d] of [[cx0 - 0.1, -1], [cx1 + 0.1, 1]]) for (let k = 0; k < 3; k++) { const z = cz1 + 3.2 + k * 4.6; win.poly([[x, 3.4, z - 0.8], [x, 7.6, z - 0.8], [x, 7.6, z + 0.8], [x, 3.4, z + 0.8]], [d, 0, 0]); }
    put(win, 'glass');
  }

  // --- Lantern, spire and cross.
  add(octPrism(Lh, Yr, Yl), 'stone'); add(octPrism(Lh + 0.5, Yl, Yl + 0.5, true), 'stoneDark');
  const lantW = new Soup();
  for (let f = 0; f < 8; f++) { lantW.phi = FACET(f); lantW.poly(lancet(2.2, Yr + 1.1, Yr + 4.2, near ? 4 : 2).map(([x, y]) => [x, y, Lh + 0.1]), [0, 0, 1]); }
  put(lantW, 'dark');
  if (near) { // eight small pinnacles on the lantern cornice
    const pin = new Soup(), rP = (Lh + 0.35) / COS;
    for (let f = 0; f < 8; f++) {
      const a = FACET(f) + Math.PI / 8, cx = Math.sin(a) * rP, cz = Math.cos(a) * rP, h = 0.3;
      box('stone', cx - h, Yl + 0.4, cz - h, cx + h, Yl + 1.6, cz + h);
      const p = [[cx - h, Yl + 1.6, cz - h], [cx + h, Yl + 1.6, cz - h], [cx + h, Yl + 1.6, cz + h], [cx - h, Yl + 1.6, cz + h]];
      for (let i = 0; i < 4; i++) pin.tri(p[i], p[(i + 1) % 4], [cx, Yl + 2.6, cz], [cx, Yl + 1.6, cz], 'in');
    }
    put(pin, 'stone');
  }
  const baseY = Yl + 0.5, aS = Lh + 0.4, spL = new Soup(), spD = new Soup();
  for (let f = 0; f < 8; f++) { // an octagonal pyramid: rows of trapezoids that end in a point
    spL.phi = spD.phi = FACET(f);
    const rowsS = near ? 5 : 1;
    for (let r = 0; r < rowsS; r++) {
      const t0 = r / rowsS, t1 = (r + 1) / rowsS, ya = baseY + (Ys - baseY) * t0, yb = baseY + (Ys - baseY) * t1, aa = aS * (1 - t0), ab = aS * (1 - t1), ha = aa * TAN, hb = ab * TAN;
      const dark = near ? hash(f, r, 77) < 0.72 : true;
      (dark ? spD : spL).poly(hb > 1e-6 ? [[-ha, ya, aa], [ha, ya, aa], [hb, yb, ab], [-hb, yb, ab]] : [[-ha, ya, aa], [ha, ya, aa], [0, yb, ab]], [0, 1, 1]);
    }
  }
  put(spL, 'copper'); put(spD, 'copperDark');
  if (near) { // four small dormers at the foot of the spire
    const dg = new Soup(), dw = new Soup(), dd = new Soup(), ap = (y) => (aS * (Ys - y)) / (Ys - baseY);
    for (let f = 0; f < 8; f += 2) {
      for (const s of [dg, dw, dd]) s.phi = FACET(f);
      const a = ap(baseY), El = [-0.65, baseY, a], Er = [0.65, baseY, a], A = [0, baseY + 2.2, a], B = [0, baseY + 3.4, ap(baseY + 3.4)], Cc = [0, baseY + 1.4, (3 * a + ap(baseY + 3.4)) / 4];
      dg.tri(El, Er, A, Cc, 'in'); dw.tri(El, A, B, Cc, 'in'); dw.tri(Er, A, B, Cc, 'in');
      dd.poly(lancet(0.7, baseY + 0.2, baseY + 0.9, 2).map(([x, y]) => [x, y, a + 0.08]), [0, 0, 1]);
    }
    put(dg, 'stone'); put(dw, 'copper'); put(dd, 'dark');
  }
  const t = near ? 0.34 : 0.6;
  box('metal', -t / 2, Ys - 0.1, -t / 2, t / 2, Yc, t / 2);
  box('metal', -1.2, Yc - 1.9, -t / 2, 1.2, Yc - 1.9 + t, t / 2);
  return b.finish();
}
