import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { F, BOTTA as B, EXP, expTop } from './sfmoma-site.js';
import { Soup, rippleWall, zipRoof } from './sfmoma-mesh.js';

const TAU = Math.PI * 2;
const LAMBDA = 4.8, AMP = 0.45;
const sstep = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };

/**
 * San Francisco Museum of Modern Art in metres (+X east, +Y up, +Z south, origin = centroid of the OSM hull,
 * rotation baked: the Third Street frontage runs 135.4 degrees). Authoring only (exporter, inspector, tests).
 *
 * near: Botta's stepped brick masses with banding and dashes, striped round columns, the black-and-white striped
 * turret cut on the bias with its radial ring and ribbed skylight, and Snohetta's rippled white expansion with
 * recessed ribbon windows. far: same silhouette and negative space (tiers, notch, turret, sloped slab) with
 * coarse walls and no ledges, columns or ribs.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const STEEL = near ? 'steel' : 'concrete'; // far folds steel into concrete to stay within 8 draws
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const soups = new Map();
  const soup = (mat) => { if (!soups.has(mat)) soups.set(mat, new Soup()); return soups.get(mat); };

  // ---- design-frame box: [u0,u1] x [v0,v1] x [y0,y1], faces named front(v0) back(v1) left(u0) right(u1) top bottom.
  function box(mat, [u0, u1], [v0, v1], [y0, y1], skip = [], topMat = null) {
    const s = soup(mat), uc = (u0 + u1) / 2, vc = (v0 + v1) / 2, yc = (y0 + y1) / 2;
    const faces = {
      front: [F(u0, y0, v0), F(u1, y0, v0), F(u1, y1, v0), F(u0, y1, v0), F(uc, yc, v0 - 10)],
      back: [F(u0, y0, v1), F(u1, y0, v1), F(u1, y1, v1), F(u0, y1, v1), F(uc, yc, v1 + 10)],
      left: [F(u0, y0, v0), F(u0, y0, v1), F(u0, y1, v1), F(u0, y1, v0), F(u0 - 10, yc, vc)],
      right: [F(u1, y0, v0), F(u1, y0, v1), F(u1, y1, v1), F(u1, y1, v0), F(u1 + 10, yc, vc)],
      top: [F(u0, y1, v0), F(u1, y1, v0), F(u1, y1, v1), F(u0, y1, v1), F(uc, y1 + 10, vc)],
      bottom: [F(u0, y0, v0), F(u1, y0, v0), F(u1, y0, v1), F(u0, y0, v1), F(uc, y0 - 10, vc)],
    };
    for (const [k, f] of Object.entries(faces)) if (!skip.includes(k)) (k === 'top' && topMat ? soup(topMat) : s).quad(...f);
  }
  const BRICK = 'brick', DARK = 'brickDark';

  // ---------------------------------------------------------------- Botta building
  const { groundH, t1, band, t2, t3 } = B, W = B.w, D = B.depth;
  // Ground storey: glazing line 3 m behind the front, brick returns on the side streets, striped columns.
  box('glassDark', [0.3, W - 0.3], [B.glassV, B.glassV + 0.01], [0.05, groundH], ['back', 'bottom', 'top', 'left', 'right']);
  // Interior lighting under the soffit: a thin lit strip 0.15 m in front of the glazing (drawn unshaded, so it reads at night).
  box('glow', [0.6, W - 0.6], [B.glassV - 0.15, B.glassV - 0.14], [groundH - 1.1, groundH - 0.3], ['back', 'bottom', 'top', 'left', 'right']);
  box(BRICK, [0, W], [B.glassV, t1.v1], [0, groundH], ['front', 'back', 'top', 'bottom']);
  // First tier: the front wall, 3 m over the glazing, split by the central slot.
  const [s0, s1] = B.slotU;
  box(BRICK, [0, s0], [0, t1.v1], [groundH, t1.top], ['back'], 'concrete');
  box(BRICK, [s1, W], [0, t1.v1], [groundH, t1.top], ['back'], 'concrete');
  box(BRICK, [s0, s1], [0, t1.v1], [groundH, groundH + 2.4], ['back', 'top', 'left', 'right']);
  box('glassDark', [s0, s1], [1.5, 1.51], [groundH + 2.4, t1.top], ['back', 'top', 'bottom', 'left', 'right']);
  // Behind it: the full-width slab to 19.5 m, the 24.5 m band (with the notch the turret shows through), the
  // 29.5 m tier over the middle 44.6 m, then the two end towers and the dark block between them.
  const [n0, n1] = B.notch, tu = B.turret, [m0, m1] = t2.u;
  box(BRICK, [0, W], [t1.v1, D], [0, t1.top], ['front', 'back', 'top', 'bottom']);
  box('concrete', [n0, n1], [t1.v1, 22.7], [t1.top, t1.top + 0.01], ['bottom', 'back', 'front', 'left', 'right'], null);
  box(BRICK, [0, n0], [t1.v1, D], [t1.top, band.top], ['bottom', 'back'], 'concrete');
  box(BRICK, [n1, W], [t1.v1, D], [t1.top, band.top], ['bottom', 'back'], 'concrete');
  box(BRICK, [m0, n0], [t1.v1, D], [band.top, t2.top], ['bottom', 'back'], 'concrete');
  box(BRICK, [n1, m1], [t1.v1, D], [band.top, t2.top], ['bottom', 'back'], 'concrete');
  box(BRICK, [n0, n1], [22.7, D], [band.top, t2.top], ['bottom', 'back', 'front', 'left', 'right'], 'concrete');
  for (const [u0, u1] of B.towers) box(BRICK, [u0, u1], [t3.v0, D], [t2.top, t3.top], ['bottom', 'back'], 'concrete');
  box('stoneBlack', [B.slit[0], B.slit[1]], [t3.v0 + 2, D], [t2.top, t3.top], ['bottom', 'back'], 'concrete');

  // Striped round columns on the Third Street front.
  if (near) {
    const pitch = 0.8, r = 0.55, bands = Math.round(groundH / pitch);
    for (const u of B.columns) {
      for (let k = 0; k < bands; k++) {
        const g = new THREE.CylinderGeometry(r, r, groundH / bands, 12, 1, true);
        const [x, y, z] = F(u, 0.05 + (k + 0.5) * (groundH - 0.05) / bands, 1.0);
        g.translate(x, y, z); b.put(g, k % 2 ? 'stoneWhite' : 'stoneBlack');
      }
    }
  }

  // Brick banding: thin protruding courses, the stepped dash rows of the front wall and the lettering.
  if (near) {
    const P = 0.14, H = 0.3;
    const front = (mat, [u0, u1], v, y) => box(mat, [u0, u1], [v - P, v], [y, y + H], ['back']);
    const side = (u, dir, [v0, v1], y) => (dir < 0 ? box(DARK, [u - P, u], [v0, v1], [y, y + H], ['right']) : box(DARK, [u, u + P], [v0, v1], [y, y + H], ['left']));
    for (let y = groundH + 1.4; y < t1.top - 0.4; y += 1.3) {
      front(DARK, [0, s0], 0, y); front(DARK, [s1, W], 0, y);
      side(0, -1, [0, t1.v1], y); side(W, 1, [0, t1.v1], y);
    }
    for (let y = t1.top + 1.0; y < band.top - 0.3; y += 1.3) { front(DARK, [0, n0], t1.v1, y); front(DARK, [n1, W], t1.v1, y); }
    for (let y = band.top + 0.9; y < t2.top - 0.3; y += 1.3) { front(DARK, [m0, n0], t1.v1, y); front(DARK, [n1, m1], t1.v1, y); }
    for (let y = 1.0; y < band.top - 0.3; y += 1.3) { side(0, -1, [t1.v1, D], y); side(W, 1, [t1.v1, D], y); }
    for (let y = band.top + 0.9; y < t3.top - 0.3; y += 1.3) {
      side(m0, -1, [y < t2.top - 0.3 ? t1.v1 : t3.v0, D], y); side(m1, 1, [y < t2.top - 0.3 ? t1.v1 : t3.v0, D], y);
    }
    for (let y = t2.top + 0.8; y < t3.top - 0.3; y += 1.3) for (const [u0, u1] of B.towers) front(DARK, [u0, u1], t3.v0, y);
    // Dash rows: dark slots whose length steps down away from the centre slot.
    for (let k = 0; k < 6; k++) {
      const len = 26 - 4.2 * k, y = groundH + 2.2 + k * 1.3;
      box(DARK, [s1 + 2, s1 + 2 + len], [-0.07, 0], [y, y + 0.34], ['back']);
      box(DARK, [s0 - 2 - len, s0 - 2], [-0.07, 0], [y, y + 0.34], ['back']);
    }
  }

  // ---------------------------------------------------------------- the turret
  {
    const { u: cu, v: cv, r, rIn, y0, low, slope } = tu, theta = Math.atan(slope), cosT = Math.cos(theta);
    const segs = near ? 32 : 16, pitch = near ? 0.8 : 2.4, wedges = near ? 48 : 24;
    const h = (v) => low + slope * (v - (cv - r)), plane = (u, v) => F(u, h(v), v);
    const ring = (rad, n) => Array.from({ length: n + 1 }, (_, i) => { const a = i / n * TAU; return [cu + rad * Math.cos(a), cv + rad * Math.sin(a)]; });
    // Barrel: horizontal black and white bands, clipped by the slanted plane. Below the second-tier roof only
    // the strip that shows through the notch is drawn.
    const rim = ring(r, segs), ceil = rim.map(([, v]) => h(v));
    const topY = Math.max(...ceil);
    for (let k = 0, y = y0; y < topY - 0.01; y += pitch, k++) {
      const s = soup(k % 2 ? 'stoneWhite' : 'stoneBlack');
      for (let i = 0; i < segs; i++) {
        const p = rim[i], q = rim[i + 1], yb = [Math.min(y + pitch, ceil[i]), Math.min(y + pitch, ceil[i + 1])], ya = [Math.min(y, ceil[i]), Math.min(y, ceil[i + 1])];
        if (yb[0] - ya[0] < 1e-4 && yb[1] - ya[1] < 1e-4) continue;
        const um = (p[0] + q[0]) / 2;
        if (y + pitch <= t2.top + 1e-6 && (um < n0 - 0.5 || um > n1 + 0.5 || (p[1] + q[1]) / 2 > cv)) continue;
        s.quad(F(p[0], ya[0], p[1]), F(q[0], ya[1], q[1]), F(q[0], yb[1], q[1]), F(p[0], yb[0], p[1]), F(cu + (p[0] - cu) * 4, (ya[0] + yb[0]) / 2, cv + (p[1] - cv) * 4));
      }
    }
    // Ring: the slanted face of the wall, radial black and white wedges.
    const outer = ring(r, wedges), inner = ring(rIn, wedges);
    for (let i = 0; i < wedges; i++) {
      soup(i % 2 ? 'stoneWhite' : 'stoneBlack').quad(plane(...outer[i]), plane(...outer[i + 1]), plane(...inner[i + 1]), plane(...inner[i]), F(cu, 200, cv));
    }
    // Inner wall under the ring and the lit glass 0.5 m below it, with a leaf of steel ribs.
    const drop = 0.5, innerS = soup(STEEL), innerRing = ring(rIn, near ? 24 : 12);
    for (let i = 0; i + 1 < innerRing.length; i++) {
      const [p, q] = [innerRing[i], innerRing[i + 1]];
      innerS.quad(plane(...p), plane(...q), F(q[0], h(q[1]) - drop, q[1]), F(p[0], h(p[1]) - drop, p[1]), F(cu, h(cv) - 2, cv));
    }
    const glassPt = (u, v) => F(u, h(v) - drop, v), g = soup('glow'), top = F(cu, 400, cv);
    for (let i = 0; i + 1 < innerRing.length; i++) g.tri(glassPt(cu, cv), glassPt(...innerRing[i]), glassPt(...innerRing[i + 1]), top);
    if (near) {
      const rib = (t0, s0_, t1_, s1_, w) => {
        // In-plane (t across, s up the slope) to model space, 0.12 m above the glass.
        const P = (t, s, dw) => F(cu + t + dw, h(cv) - drop + 0.12 + s * Math.sin(theta), cv + s * cosT);
        const nx = -(s1_ - s0_), ny = (t1_ - t0), l = Math.hypot(nx, ny), ox = nx / l * w / 2, oy = ny / l * w / 2;
        const pt = (t, s, sg) => P(t + sg * ox, s + sg * oy, 0);
        soup('steel').quad(pt(t0, s0_, -1), pt(t1_, s1_, -1), pt(t1_, s1_, 1), pt(t0, s0_, 1), top);
      };
      const edge = (s0_, dir) => { // distance along a rib from (0, s0_) to the ellipse t^2 + (s cos)^2 = rIn^2
        const [dt, ds] = dir, a = dt * dt + ds * ds * cosT * cosT, bq = 2 * s0_ * ds * cosT * cosT, c = s0_ * s0_ * cosT * cosT - rIn * rIn;
        return (-bq + Math.sqrt(bq * bq - 4 * a * c)) / (2 * a);
      };
      const half = rIn / cosT - 0.15;
      rib(0, -half, 0, half, 0.3);
      const phi = 55 * Math.PI / 180;
      for (let k = -4; k <= 4; k++) {
        const s0_ = k * 1.15;
        for (const sg of [-1, 1]) {
          const dir = [sg * Math.sin(phi), Math.cos(phi)], len = edge(s0_, dir) - 0.15;
          rib(0, s0_, dir[0] * len, s0_ + dir[1] * len, 0.2);
        }
      }
    }
  }

  // ---------------------------------------------------------------- Snohetta expansion
  {
    const dy = near ? 1 : 2.5, du = near ? 1.8 : 5;
    const inside = [54, 64], ledgeY = EXP.ledge;
    const wave = (phase, k = 1) => near ? (t, y) => k * AMP * (0.72 + 0.28 * Math.sin(t / 14 + phase)) * Math.sin(TAU * (y + 0.15 * t + 1.8 * Math.sin(t / 11 + phase)) / LAMBDA) : () => 0;
    const lower = (y) => sstep((y - 1) / 3);
    // The slab leans: above the towers the Third Street face steps back toward the north-east (up to 4 m at the roof,
    // fading to nothing at the north-east face) and the two ends slope in (3.5 m at the Howard end, 1.5 m at Minna),
    // so the top is narrower than the base and the silhouette is not a plain block. A function of position only,
    // so walls that share a corner agree. Everything moves inward, never past the OSM hull.
    const lean = (u, v, y) => {
      const k = sstep((y - 40.5) / 21.5);
      return [k * (-3.5 * Math.max(0, Math.min(1, (u - 88) / 20.6)) + 1.5 * Math.max(0, Math.min(1, (14 - u) / 14))), k * 4 * Math.max(0, Math.min(1, (76 - v) / 27))];
    };
    const common = { F, inside, top: expTop, dy, du, lean };
    const walls = {
      sw: rippleWall({ ...common, path: EXP.sw, yBase: 0, wave: wave(0.4), skip: (u, y0, y1) => u < 65.0 && y1 <= 24.99,
        envelope: (y, p) => (p.u < 65.2 ? sstep((y - ledgeY) / 4) : lower(y)),
        windows: [{ t0: 17.5, t1: 51.6, y0: 47.5, y1: 50 }, { t0: 33.9, t1: 56.3, y0: 52.5, y1: 55 },
          { t0: 70.2, t1: 97.2, y0: 15, y1: 17.5 }, { t0: 77.2, t1: 107.2, y0: 30, y1: 32.5 }, { t0: 72.2, t1: 101.2, y0: 45, y1: 47.5 }] }),
      se: rippleWall({ ...common, path: EXP.se, yBase: 0, wave: wave(2.9), envelope: lower,
        windows: [{ t0: 4, t1: 23, y0: 0, y1: 7.5 }, { t0: 3, t1: 24, y0: 15, y1: 17.5 }, { t0: 6, t1: 26, y0: 32.5, y1: 35 }, { t0: 2, t1: 20, y0: 50, y1: 52.5 }] }),
      ne: rippleWall({ ...common, path: EXP.ne, yBase: 0, wave: wave(4.1), envelope: lower,
        windows: [{ t0: 8, t1: 58, y0: 20, y1: 22.5 }, { t0: 20, t1: 85, y0: 35, y1: 37.5 }, { t0: 40, t1: 90, y0: 45, y1: 47.5 }, { t0: 62, t1: 104, y0: 15, y1: 17.5 }] }),
      nw: rippleWall({ ...common, path: EXP.nw, yBase: 0, wave: wave(5.3), envelope: lower,
        windows: [{ t0: 4, t1: 22, y0: 20, y1: 22.5 }, { t0: 4, t1: 22, y0: 35, y1: 37.5 }] }),
    };
    for (const w of Object.values(walls)) { if (w.frp) b.put(w.frp, 'frp'); if (w.glass) b.put(w.glass, 'glass'); }
    // Roof: zipped between the south-west/east chain and the north-west/north-east chain.
    const cat = (...chains) => chains.reduce((acc, c) => acc.concat(acc.length ? c.slice(1) : c), []);
    const A = cat(walls.sw.edge, walls.se.edge);
    const Bc = cat([...walls.nw.edge].reverse(), [...walls.ne.edge].reverse());
    zipRoof(soup('concrete'), F, A, Bc);
    // Annex on the north-east face: two storeys of dark stone with a terrace roof.
    const poly = EXP.annex, top = EXP.annexTop, cx = poly.reduce((s, p) => s + p[0], 0) / poly.length, cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
    const sides = soup(STEEL);
    for (const i of [0, 1, 2, 3]) {
      const [p, q] = [poly[i], poly[i + 1]], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = mx - cx, dz = my - cy, l = Math.hypot(dx, dz);
      sides.quad(F(p[0], 0, p[1]), F(q[0], 0, q[1]), F(q[0], top, q[1]), F(p[0], top, p[1]), F(mx + dx / l * 10, top / 2, my + dz / l * 10));
    }
    const tri = THREE.ShapeUtils.triangulateShape(poly.map(([u, v]) => new THREE.Vector2(u, v)), []);
    for (const [i, j, k] of tri) soup('concrete').tri(F(poly[i][0], top, poly[i][1]), F(poly[j][0], top, poly[j][1]), F(poly[k][0], top, poly[k][1]), F(cx, 500, cy));
  }

  for (const [mat, s] of soups) if (!s.empty) b.put(s.geometry(), mat);
  return b.finish();
}
