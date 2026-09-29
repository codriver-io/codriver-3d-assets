import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { meshKit, vec } from './sharp-centre-for-design-mesh.js';
import { pixelPattern, resample, rng, WHITE, BLACK, WINDOW } from './sharp-centre-for-design-skin.js';
import {
  pt, TABLE, PLANT, BLOCK, WINGS, BLOCK_TOP, STEM, CORES, CORE_TOP, SLAB, LEG, LEGS,
} from './sharp-centre-for-design-site.js';

// Sharp Centre for Design: the pixel-skinned tabletop, its twelve coloured legs, the red
// stair slab and the brick Main Building beneath. See docs/3d-toronto-sharp-centre-for-design.md.

/** The tabletop's four walls, soffit and roof. Black pixels and windows are holes in the
 *  white skin filled by their own quads, so the material split is exact and nothing
 *  overlaps (no z-fighting at any distance). */
function tabletop(k, near) {
  const { u0, u1, v0, v1, y0, y1 } = TABLE, H = y1 - y0;
  const MODULE = 0.75; // the skin's module, metres: 12 rows on the 9 m wall
  const skin = near ? { wallRows: 12, module: MODULE } : { wallRows: 6, module: 1.5 };
  const dirU = pt(1, 0, 0), dirV = pt(0, 0, 1);
  const cols = (length) => Math.max(2, Math.round(length / skin.module));
  // Each wall: where column 0 starts (u, v), which way the columns run in (u, v), and the outward normal.
  const walls = [
    { seed: 0x5c01, from: [u0, v0], along: [1, 0], length: u1 - u0, n: vec.mul(dirV, -1) }, // east, McCaul Street
    { seed: 0x5c02, from: [u1, v1], along: [-1, 0], length: u1 - u0, n: dirV }, // west, Grange Park
    { seed: 0x5c03, from: [u0, v1], along: [0, -1], length: v1 - v0, n: vec.mul(dirU, -1) }, // north end
    { seed: 0x5c04, from: [u1, v0], along: [0, 1], length: v1 - v0, n: dirU }, // south end
  ];
  const pick = rng(0x5c77);
  const litWindow = () => (pick() < 0.58 ? 'glow' : 'glass');
  for (const wall of walls) {
    // The fine pattern is always generated at the 0.75 m module; the far model point-samples it.
    const fine = pixelPattern({ nu: Math.round(wall.length / MODULE), nv: 12, seed: wall.seed, kind: 'wall' });
    const p = near ? fine : resample(fine, cols(wall.length), skin.wallRows);
    const cu = wall.length / p.nu, cv = H / p.nv;
    const P = (i, j, recess = 0) => {
      const q = pt(wall.from[0] + wall.along[0] * i * cu, y0 + j * cv, wall.from[1] + wall.along[1] * i * cu);
      return recess ? vec.add(q, vec.mul(wall.n, -recess)) : q;
    };
    // Rows of cells become runs: one quad per run of equal material.
    for (let j = 0; j < p.nv; j++) {
      let i = 0;
      while (i < p.nu) {
        const c = p.cells[j * p.nu + i];
        let e = i + 1; while (e < p.nu && p.cells[j * p.nu + e] === c) e++;
        if (c === WHITE) k.quad('panel_white', P(i, j), P(e, j), P(e, j + 1), P(i, j + 1), wall.n);
        else if (c === BLACK) k.quad('panel_black', P(i, j), P(e, j), P(e, j + 1), P(i, j + 1), wall.n);
        else if (!near) k.quad(litWindow(), P(i, j), P(e, j), P(e, j + 1), P(i, j + 1), wall.n);
        i = e;
      }
    }
    if (near) for (const w of p.windows) {
      // A window is set back 0.25 m with four black reveals, as in the photographs.
      const rec = 0.25, i0 = w.i, i1 = w.i + w.w, j0 = w.j, j1 = w.j + w.h;
      k.quad(litWindow(), P(i0, j0, rec), P(i1, j0, rec), P(i1, j1, rec), P(i0, j1, rec), wall.n);
      const along = pt(wall.along[0], 0, wall.along[1]);
      k.quad('panel_black', P(i0, j0), P(i1, j0), P(i1, j0, rec), P(i0, j0, rec), [0, 1, 0]);
      k.quad('panel_black', P(i0, j1), P(i1, j1), P(i1, j1, rec), P(i0, j1, rec), [0, -1, 0]);
      k.quad('panel_black', P(i0, j0), P(i0, j1), P(i0, j1, rec), P(i0, j0, rec), along);
      k.quad('panel_black', P(i1, j0), P(i1, j1), P(i1, j1, rec), P(i1, j0, rec), vec.mul(along, -1));
    }
  }
  // Soffit: the underside is skinned like the walls, with bigger black patches.
  {
    const fine = pixelPattern({ nu: 100, nv: 37, seed: 0x5c05, kind: 'soffit' });
    const p = near ? fine : resample(fine, 56, 21);
    const cu = (u1 - u0) / p.nu, cv = (v1 - v0) / p.nv, n = [0, -1, 0];
    const P = (i, j) => pt(u0 + i * cu, y0, v0 + j * cv);
    for (let j = 0; j < p.nv; j++) {
      let i = 0;
      while (i < p.nu) {
        const c = p.cells[j * p.nu + i];
        let e = i + 1; while (e < p.nu && p.cells[j * p.nu + e] === c) e++;
        k.quad(c === BLACK ? 'panel_black' : 'panel_white', P(i, j), P(e, j), P(e, j + 1), P(i, j + 1), n);
        i = e;
      }
    }
  }
  // Roof: a light flat deck, and the black-clad plant enclosure photographs show above the parapet.
  k.quad('roof', pt(u0, y1, v0), pt(u1, y1, v0), pt(u1, y1, v1), pt(u0, y1, v1), [0, 1, 0]);
  k.ubox('panel_black', PLANT.u0, PLANT.u1, PLANT.y0, PLANT.y1, PLANT.v0, PLANT.v1, ['bottom']);
}
/** Twelve tapered steel legs (914 mm to 450 mm at both ends, 28 m long), each on a small footing. */
function legs(k, near) {
  const { rMid, rEnd, taper } = LEG, profile = [[0, rEnd], [taper, rMid], [1 - taper, rMid], [1, rEnd]];
  for (const leg of LEGS) {
    const foot = pt(...[leg.foot[0], 0, leg.foot[2]]), top = pt(leg.top[0], leg.top[1], leg.top[2]);
    k.spindle(leg.color, foot, top, profile, near ? 14 : 8);
    if (near) k.spindle('concrete', [foot[0], 0, foot[2]], [foot[0], 0.35, foot[2]], [[0, 0.9], [1, 0.9]], 10);
  }
}

/** The long red stair slab from the block's roof up to the soffit. */
function slab(k) {
  const a = pt(SLAB.from.u, SLAB.from.y, SLAB.from.v), b = pt(SLAB.to.u, SLAB.to.y, SLAB.to.v);
  k.orientedBox('slab_red', a, b, SLAB.width, SLAB.depth, [0, 1, 0]);
}

/** A facade of storeys, each: brick sill, a run of windows between piers, brick head. Near
 *  windows are set back 0.18 m with brick reveals, so the walls have depth in the shading. */
function facade(k, o) {
  const { from, along, length, n, base, storeys, storeyH, sill, winH, winW, pier, brick, near, pick } = o;
  const P = (s, y, recess = 0) => {
    const q = pt(from[0] + along[0] * s, y, from[1] + along[1] * s);
    return recess ? vec.add(q, vec.mul(n, -recess)) : q;
  };
  const alongW = pt(along[0], 0, along[1]);
  const window = (s0, s1, ysill, yhead, mat) => {
    if (!near) { k.quad(mat, P(s0, ysill), P(s1, ysill), P(s1, yhead), P(s0, yhead), n); return; }
    const r = 0.18;
    k.quad(mat, P(s0, ysill, r), P(s1, ysill, r), P(s1, yhead, r), P(s0, yhead, r), n);
    k.quad(brick, P(s0, ysill), P(s1, ysill), P(s1, ysill, r), P(s0, ysill, r), [0, 1, 0]);
    k.quad(brick, P(s0, yhead), P(s1, yhead), P(s1, yhead, r), P(s0, yhead, r), [0, -1, 0]);
    k.quad(brick, P(s0, ysill), P(s0, yhead), P(s0, yhead, r), P(s0, ysill, r), alongW);
    k.quad(brick, P(s1, ysill), P(s1, yhead), P(s1, yhead, r), P(s1, ysill, r), vec.mul(alongW, -1));
  };
  for (let st = 0; st < storeys; st++) {
    const y0 = base + st * storeyH, y1 = y0 + storeyH;
    const cfg = o.storey?.(st) || {};
    const sillH = cfg.sill ?? sill, wh = cfg.winH ?? winH, ww = cfg.winW ?? winW, pw = cfg.pier ?? pier;
    const ysill = y0 + sillH, yhead = ysill + wh;
    if (!near || !wh) { k.quad(brick, P(0, y0), P(length, y0), P(length, y1), P(0, y1), n); continue; }
    k.quad(brick, P(0, y0), P(length, y0), P(length, ysill), P(0, ysill), n);
    k.quad(brick, P(0, yhead), P(length, yhead), P(length, y1), P(0, y1), n);
    const step = ww + pw, first = (length % step) / 2 || pw / 2;
    let s = 0;
    if (first > 0) { k.quad(brick, P(0, ysill), P(first, ysill), P(first, yhead), P(0, yhead), n); s = first; }
    while (s + ww <= length + 1e-6) {
      window(s, s + ww, ysill, yhead, cfg.glass || (pick() < 0.35 ? 'glow' : 'glass'));
      s += ww;
      const e = Math.min(length, s + pw);
      if (e > s) k.quad(brick, P(s, ysill), P(e, ysill), P(e, yhead), P(s, yhead), n);
      s = e;
    }
  }
}

/** The Main Building: brick block under the tabletop, pale-brick north wing, gabled stem, black cores. */
function block(k, near) {
  const dirU = pt(1, 0, 0), dirV = pt(0, 0, 1), pick = rng(0x5c99);
  const west = dirV, east = vec.mul(dirV, -1), south = dirU, north = vec.mul(dirU, -1);
  const wing = ({ u0, u1, h, brick, storeys }) => {
    const storeyH = h / storeys, common = { base: 0, storeys, storeyH, sill: 1.1, winH: storeyH > 4 ? 2.1 : 1.9, winW: 2.2, pier: 1.25, brick, near, pick };
    const uSpan = u1 - u0, vSpan = BLOCK.v1 - BLOCK.v0;
    // East (McCaul Street) and west long walls, then the two end walls.
    facade(k, { ...common, from: [u0, BLOCK.v0], along: [1, 0], length: uSpan, n: east,
      storey: brick === 'brick' && storeys > 3 ? (st) => (st === 0 ? { sill: 0.5, winH: 3.3, winW: 3.0, pier: 0.7 } : {}) : undefined });
    facade(k, { ...common, from: [u1, BLOCK.v1], along: [-1, 0], length: uSpan, n: west });
    facade(k, { ...common, from: [u0, BLOCK.v1], along: [0, -1], length: vSpan, n: north });
    facade(k, { ...common, from: [u1, BLOCK.v0], along: [0, 1], length: vSpan, n: south });
    k.quad(near ? 'roof_dark' : 'roof', pt(u0, h, BLOCK.v0), pt(u1, h, BLOCK.v0), pt(u1, h, BLOCK.v1), pt(u0, h, BLOCK.v1), [0, 1, 0]);
    if (near) { // a low brick parapet round the roof edge
      const t = 0.35, p = 0.6;
      k.ubox(brick, u0, u1, h, h + p, BLOCK.v0, BLOCK.v0 + t, ['bottom']);
      k.ubox(brick, u0, u1, h, h + p, BLOCK.v1 - t, BLOCK.v1, ['bottom']);
      k.ubox(brick, u0, u0 + t, h, h + p, BLOCK.v0 + t, BLOCK.v1 - t, ['bottom']);
      k.ubox(brick, u1 - t, u1, h, h + p, BLOCK.v0 + t, BLOCK.v1 - t, ['bottom']);
    }
  };
  WINGS.forEach(wing);
  for (const c of CORES) k.ubox('panel_black', c.u0, c.u1, BLOCK_TOP, CORE_TOP, c.v0, c.v1, ['bottom']);
  // The stem toward Grange Park: two storeys of brick under a dark gable roof.
  {
    const { u0, u1, v0, v1, wallH, ridgeH } = STEM, um = (u0 + u1) / 2, roofMat = near ? 'roof_dark' : 'roof';
    k.ubox('brick', u0, u1, 0, wallH, v0, v1, ['top', 'bottom']);
    const up = [0, 1, 0], rise = ridgeH - wallH, half = (u1 - u0) / 2, m = Math.hypot(half, rise);
    // Roof slopes lean away from the ridge (toward +/-u) and up.
    const nSouth = vec.norm(vec.add(vec.mul(dirU, rise / m), vec.mul(up, half / m)));
    const nNorth = vec.norm(vec.add(vec.mul(dirU, -rise / m), vec.mul(up, half / m)));
    k.quad(roofMat, pt(u1, wallH, v0), pt(u1, wallH, v1), pt(um, ridgeH, v1), pt(um, ridgeH, v0), nSouth);
    k.quad(roofMat, pt(u0, wallH, v0), pt(u0, wallH, v1), pt(um, ridgeH, v1), pt(um, ridgeH, v0), nNorth);
    k.tri('brick', pt(u0, wallH, v1), pt(u1, wallH, v1), pt(um, ridgeH, v1), west);
    k.tri('brick', pt(u0, wallH, v0), pt(u1, wallH, v0), pt(um, ridgeH, v0), east);
  }
  if (near) {
    // The three-colour band along the McCaul parapet.
    const y0 = BLOCK_TOP - 1.4, y1 = y0 + 0.55, off = 0.09;
    [['band_orange', -30, -21], ['band_blue', -21, -12], ['band_pink', -12, -3]].forEach(([m, a, b]) => k.ubox(m, a, b, y0, y1, BLOCK.v0 - off, BLOCK.v0, ['+v']));
  }
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = meshKit(b);
  tabletop(k, near); legs(k, near); slab(k); block(k, near);
  k.flush();
  const root = b.finish();
  // Buildings have no road/deformation contract.
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return root;
}
