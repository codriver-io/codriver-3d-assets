// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { SHAFT, SHOULDER, SHOULDER_SHARED, PODIUM } from './stantec-tower-plan.js';
import { Mesh, edgesOf, chamfer, offsetPoly, cap, clipRange, intersect, hash01 } from './stantec-tower-parts.js';

// Stantec Tower is three stacked masses on the OSM outline (see the plan file):
//   0 to 16.8 m    podium: blue glass in 3 m bays with a white mullion line, a grey roof, a canopy over the south entrance
//   16.8 to 125 m  the block: the east and south-east shoulder of the shaft, a floor-line band every 4.2 m
//   16.8 to 250.8  the shaft: a 20.5 x 52 m slab with chamfered corners; blue glass, a dark floor-line band at every
//                  floor, thin white mullions on the wide (west / east) faces and white fins on the narrow (north / south)
//                  faces and the chamfers; a white rim and a crown that is cut on a slope, 5.5 m lower at the south end;
//                  a dark louvre band across the north face 9 m under the top; two stacks of balcony windows on the west face.
const PODIUM_Y = SPEC.podiumY, BLOCK_Y = SPEC.blockY, PITCH = SPEC.floorPitch;
const TOP_Y = SPEC.height, CROWN_DROP = 5.5, SHAFT_LEN = 52; // the roof falls 5.5 m from the north to the south end (photographs: 4 to 6 m)
const CHAMFER = 2.6, RIM_H = 2.2, RIM_OUT = 0.3, RIM_IN = 0.2;
const SH_DROP = 0.06, SH_CHAMFER = 3, SH_PITCH = 4.2, SH_RIM_H = 1.0; // the block roof falls 0.06 m per metre toward the south

const NEAR = { band: 0.7, glass: 0.15 };

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const M = { glass: new Mesh(), spandrel: new Mesh(), fin: new Mesh(), louvre: new Mesh(), podium: new Mesh(), roof: new Mesh(), metal: new Mesh(), glow: new Mesh() };
  const out = (side, f) => side; // keeps call sites readable

  // ---- the shaft's roof plane and the block's
  const shaftOct = chamfer(SHAFT, CHAMFER);
  const rimOuter = offsetPoly(shaftOct, RIM_OUT);
  const zMin = Math.min(...rimOuter.map((p) => p[1]));
  const roofY = (x, z) => TOP_Y - (CROWN_DROP / SHAFT_LEN) * (z - zMin);
  const zSh = Math.min(...SHOULDER.map((p) => p[1]));
  const blockRoof = (x, z) => BLOCK_Y - SH_DROP * (z - zSh);
  const blockCap = (x, z) => blockRoof(x, z) - 0.3; // the roof deck, 0.3 m under the rim top

  // ---- geometry helpers over a plan edge: u is the distance along it from `a`
  const at = (e, u) => [e.a[0] + e.t[0] * u, e.a[1] + e.t[1] * u];
  const sub = (e, u0, u1) => ({ ...e, a: at(e, u0), b: at(e, u1), len: u1 - u0 });
  const panel = (m, e, u0, u1, lo, hi, off = 0) => {
    const p = at(e, u0), q = at(e, u1), o = [e.n[0] * off, e.n[1] * off];
    m.quad([p[0] + o[0], lo(p[0], p[1]), p[1] + o[1]], [q[0] + o[0], lo(q[0], q[1]), q[1] + o[1]], [q[0] + o[0], hi(q[0], q[1]), q[1] + o[1]], [p[0] + o[0], hi(p[0], p[1]), p[1] + o[1]], [e.n[0], 0, e.n[1]]);
  };
  // a vertical bar standing out of a wall: the outer face and both sides (no top or bottom: they end against a floor or a rim)
  const bar = (m, e, u, w, outD, y0, y1) => {
    const p = at(e, u - w / 2), q = at(e, u + w / 2), n = e.n, s = 0.03;
    const p0 = [p[0] - n[0] * s, p[1] - n[1] * s], q0 = [q[0] - n[0] * s, q[1] - n[1] * s];
    const p1 = [p[0] + n[0] * outD, p[1] + n[1] * outD], q1 = [q[0] + n[0] * outD, q[1] + n[1] * outD];
    m.quad([p1[0], y0, p1[1]], [q1[0], y0, q1[1]], [q1[0], y1, q1[1]], [p1[0], y1, p1[1]], [n[0], 0, n[1]]);
    m.quad([p0[0], y0, p0[1]], [p1[0], y0, p1[1]], [p1[0], y1, p1[1]], [p0[0], y1, p0[1]], [-e.t[0], 0, -e.t[1]]);
    m.quad([q1[0], y0, q1[1]], [q0[0], y0, q0[1]], [q0[0], y1, q0[1]], [q1[0], y1, q1[1]], [e.t[0], 0, e.t[1]]);
  };
  // the range of u where  y0 + k (floor line) fits between the wall's bottom and top lines (given as functions of the plan point)
  const fits = (e, lo, hi, yLo, yHi) => {
    const p = e.a, q = e.b;
    return intersect(clipRange(yLo - lo(p[0], p[1]), yLo - lo(q[0], q[1])), clipRange(hi(p[0], p[1]) - yHi, hi(q[0], q[1]) - yHi));
  };

  // One wall's glass, floor-line bands, mullions or fins and lit panes. `lo`/`hi` are the visible bottom and top as functions of the plan point;
  // `top` leaves room for the rim above the highest band and pane.
  function facade(e, o) {
    const { lo, hi, floor0, pitch, bayPitch, finW, finOut, lit, seed, top, windows } = o;
    panel(M.glass, e, 0, e.len, lo, hi);
    const floors = [];
    for (let k = 1; floor0 + k * pitch < Math.max(hi(...e.a), hi(...e.b)); k++) floors.push(floor0 + k * pitch);
    const step = near ? 1 : 2;
    floors.forEach((y, k) => {
      if (k % step) return;
      const r = fits(e, lo, (x, z) => hi(x, z) - top, y, y + NEAR.band);
      if (r) panel(M.spandrel, e, r[0] * e.len, r[1] * e.len, () => y, () => y + NEAR.band, NEAR.glass);
    });
    const bays = Math.max(1, Math.round(e.len / bayPitch)), pitchU = e.len / bays;
    if (finW > 0) {
      for (let j = 1; j < bays; j++) {
        const u = j * pitchU, p = at(e, u), y0 = Math.max(lo(p[0], p[1]), PODIUM_Y), y1 = hi(p[0], p[1]) - top;
        if (y1 > y0 + 2) bar(M.fin, e, u, finW, finOut, y0, y1);
      }
    }
    if (lit > 0) {
      floors.forEach((y, k) => {
        if (k % step) return;
        const busy = 0.55 + hash01(k + seed, 3);
        for (let j = 0; j < bays; j++) {
          if (hash01(k + seed * 7, j + seed) > lit * busy) continue;
          if (windows && windows.some(([uc, wh]) => Math.abs(uc - (j + 0.5) * pitchU) < wh / 2 + pitchU / 2)) continue; // the balcony stacks carry their own panes
          const u0 = j * pitchU + pitchU * 0.12, u1 = (j + 1) * pitchU - pitchU * 0.12, y0 = y + NEAR.band + 0.45, y1 = y + pitch * (near ? 1 : 1.5) - 0.4;
          const r = fits(sub(e, u0, u1), lo, (x, z) => hi(x, z) - top, y, y1);
          if (r && r[0] < 1e-6 && r[1] > 1 - 1e-6) panel(M.glow, e, u0, u1, () => y0, () => y1, NEAR.glass);
        }
      });
    }
    if (windows) for (const [uc, wh, y0w, y1w] of windows) {
      floors.forEach((y, k) => {
        if (y < y0w || y + pitch > y1w) return;
        const u0 = uc - wh / 2, u1 = uc + wh / 2;
        if (k % step) return;
        panel(M.spandrel, e, u0, u1, () => y + NEAR.band + 0.3, () => y + pitch - 0.35, NEAR.glass);
      });
    }
  }

  // Sweep a closed profile of [offset, dy] pairs around a plan polygon (mitred, so corners close). Profiles run so that the face normal
  // is the segment rotated a quarter turn clockwise in the (offset, dy) plane.
  function sweep(m, poly, y, profile, edgeFilter = () => true) {
    const ring = new Map();
    const at2 = (d) => { if (!ring.has(d)) ring.set(d, offsetPoly(poly, d)); return ring.get(d); };
    for (let s = 0; s + 1 < profile.length; s++) {
      const [d0, dy0] = profile[s], [d1, dy1] = profile[s + 1], r0 = at2(d0), r1 = at2(d1);
      const hintOut = (dy1 - dy0), hintUp = -(d1 - d0);
      for (let i = 0; i < poly.length; i++) {
        if (!edgeFilter(i)) continue;
        const j = (i + 1) % poly.length, e = edgesOf(poly)[i];
        const A0 = r0[i], B0 = r0[j], A1 = r1[i], B1 = r1[j];
        m.quad([A0[0], y(...A0) + dy0, A0[1]], [B0[0], y(...B0) + dy0, B0[1]], [B1[0], y(...B1) + dy1, B1[1]], [A1[0], y(...A1) + dy1, A1[1]], [e.n[0] * hintOut, hintUp, e.n[1] * hintOut]);
      }
    }
  }

  // ======================================================== the shaft
  const edges = edgesOf(shaftOct);
  // edge j: 0 SE chamfer, 1 south, 2 SW chamfer, 3 west, 4 NW chamfer, 5 north, 6 NE chamfer, 7 east (shoulder wraps 0, 1 east of x = 0.7, 6, 7)
  const split = SHOULDER[1][0]; // x where the block's south bulge begins
  const shaftBottom = (buried) => (buried ? blockCap : () => PODIUM_Y);
  const shaftEdges = [];
  edges.forEach((e, j) => {
    if (j === 1) { // the south wall: free west of the block's bulge, buried east of it
      const u = (e.a[0] - split) / -e.t[0];
      shaftEdges.push({ e: sub(e, 0, u), j, buried: true }, { e: sub(e, u, e.len), j, buried: false });
    } else shaftEdges.push({ e, j, buried: [0, 6, 7].includes(j) });
  });
  const shaftHi = (x, z) => roofY(x, z);
  const kinds = (j) => (j % 2 === 0 ? 'chamfer' : (j === 1 || j === 5 ? 'narrow' : 'wide'));
  for (const { e, j, buried } of shaftEdges) {
    const kind = kinds(j), wide = kind === 'wide', lo = shaftBottom(buried);
    facade(e, {
      lo, hi: shaftHi, floor0: PODIUM_Y, pitch: PITCH, top: RIM_H + 0.2, seed: j * 3 + (buried ? 1 : 0),
      bayPitch: wide ? (near ? 3.1 : 8) : kind === 'narrow' ? (near ? 1.3 : 2.6) : (near ? 1.75 : 2.6),
      finW: wide ? (near ? 0.1 : 0) : (near ? 0.22 : 0.35), finOut: wide ? 0.12 : 0.32,
      lit: wide ? (near ? 0.2 : 0.26) : (kind === 'narrow' ? (near ? 0.12 : 0) : 0),
      // two stacks of balcony windows on the west face, 14 and 37 m from its north end (30 % and 79 % of the face in the photographs), 146 to 234 m up
      windows: j === 3 ? [[14, 3.0, 146, 234], [37, 3.0, 146, 234]].map(([uc, w, a, c]) => [e.len - uc, w, a, c]) : null,
    });
  }
  // the lower end of the north-east corner column: the chamfer starts above the block roof, so the north wall runs on to the square corner
  {
    const a = shaftOct[5], r3 = SHAFT[3], ne = edgesOf([a, r3, [r3[0], r3[1] + 10], [a[0], a[1] + 10]])[0];
    panel(M.glass, ne, 0, ne.len, () => PODIUM_Y, (x, z) => blockRoof(x, z));
    // and the wedge of block roof it leaves beside the chamfers
  }
  const wedge = (corner, p, q) => { // roof deck at the cut corner, level with the block roof
    const f = (x, z) => blockCap(x, z);
    const tris = [[corner, p, q]];
    for (const [c, d, e] of tris) M.roof.tri([c[0], f(...c), c[1]], [d[0], f(...d), d[1]], [e[0], f(...e), e[1]], [0, 1, 0]);
  };
  wedge(SHAFT[3], shaftOct[5], shaftOct[6]); // north-east
  wedge(SHAFT[0], shaftOct[0], shaftOct[1]); // south-east

  // dark louvre band: the plant floor under the crown, across the north face and its chamfers
  for (const j of [4, 5, 6]) panel(M.louvre, edges[j], 0, edges[j].len, (x, z) => roofY(x, z) - RIM_H - 6.6, (x, z) => roofY(x, z) - RIM_H - 2.6, 0.3);

  // rim, roof deck and plant
  sweep(M.fin, shaftOct, roofY, [[0, -RIM_H], [RIM_OUT, -RIM_H], [RIM_OUT, 0], [-RIM_IN, 0], [-RIM_IN, -0.3]]);
  cap(M.roof, offsetPoly(shaftOct, -RIM_IN), (x, z) => roofY(x, z) - 0.3);
  const plant = (x0, x1, z0, z1, h) => {
    const y0 = roofY(0, z1) - 0.5, y1 = roofY(0, z0) - 0.3 + h; // stands on the sloping deck: the high end is the deck plus h, the low end sinks into the deck
    const c = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]], ed = edgesOf(c);
    ed.forEach((e) => M.metal.quad([e.a[0], y0, e.a[1]], [e.b[0], y0, e.b[1]], [e.b[0], y1, e.b[1]], [e.a[0], y1, e.a[1]], [e.n[0], 0, e.n[1]]));
    M.metal.quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0]);
  };
  plant(-6, 3, -4, 6, 2.2); plant(-2, 7, 10, 15, 1.4);

  // ======================================================== the block's shoulder
  const sh = [];
  SHOULDER.forEach((p, i) => {
    if (i !== 3) { sh.push(p); return; }
    const q = SHOULDER[2], r = SHOULDER[4];
    for (const o of [q, r]) { const d = Math.hypot(o[0] - p[0], o[1] - p[1]); sh.push([p[0] + (o[0] - p[0]) * SH_CHAMFER / d, p[1] + (o[1] - p[1]) * SH_CHAMFER / d]); }
  });
  // edge i of `sh` runs from sh[i] to sh[i + 1]; the shared ones (to the shaft's walls) are the first and the last
  const shared = new Set([0, sh.length - 1]);
  edgesOf(sh).forEach((e, i) => {
    if (shared.has(i)) return;
    const lo = () => PODIUM_Y;
    facade(e, { lo, hi: blockRoof, floor0: PODIUM_Y, pitch: SH_PITCH, top: SH_RIM_H + 0.2, seed: 40 + i, bayPitch: near ? 3.1 : 8, finW: near && e.len > 6 ? 0.1 : 0, finOut: 0.12, lit: near ? 0.22 : 0.26 });
    if (i === 2) panel(M.louvre, e, e.len * 0.12, e.len * 0.7, (x, z) => blockRoof(x, z) - SH_RIM_H - 6.4, (x, z) => blockRoof(x, z) - SH_RIM_H - 2.4, 0.3); // the dark band under the block's top, on its south face
  });
  sweep(M.fin, sh, blockRoof, [[0, -SH_RIM_H], [RIM_OUT, -SH_RIM_H], [RIM_OUT, 0], [-RIM_IN, 0], [-RIM_IN, -0.3]], (i) => !shared.has(i));
  cap(M.roof, sh, blockCap);

  // ======================================================== the podium
  const podEdges = edgesOf(PODIUM);
  const podBands = [[7.4, 8.6], [15.4, 16.6]];
  podEdges.forEach((e) => {
    panel(M.podium, e, 0, e.len, () => 0, () => PODIUM_Y);
    for (const [y0, y1] of podBands) panel(M.spandrel, e, 0, e.len, () => y0, () => y1, 0.15);
    if (e.len > 4) panel(M.spandrel, e, 0.4, e.len - 0.4, () => 0.3, () => 5.1, 0.15); // the shopfront storey, a deeper glass
    if (near) {
      const bays = Math.max(1, Math.round(e.len / 3));
      for (let j = 1; j < bays; j++) bar(M.fin, e, (j * e.len) / bays, 0.18, 0.2, 0, PODIUM_Y);
      // lit shopfront bays at night (a share of them), standing 0.15 m proud of the shopfront glass
      const w = e.len / bays;
      for (let j = 0; j < bays; j++) if (hash01(j + e.a[0], e.a[1] + 5) < 0.55) panel(M.glow, e, j * w + 0.5, (j + 1) * w - 0.5, () => 0.8, () => 4.4, 0.3);
    }
  });
  cap(M.roof, PODIUM, () => PODIUM_Y);
  // the entrance canopy over the south lobby (the podium's notch faces 103 Avenue)
  const lobby = podEdges.find((e) => Math.abs(e.n[1] - 1) < 0.1 && e.a[0] < -3 && e.b[0] < -3 + 12 && e.len > 7 && Math.abs(e.a[1] - 20.7) < 0.5);
  if (lobby) {
    const ex = -2.2, w = 9, z0 = lobby.a[1] - 0.2, z1 = lobby.a[1] + 2.6, y0 = 5.2, y1 = 5.7; // canopy slab: x from ex - w to ex
    const xa = ex - w, c = [[xa, z0], [ex, z0], [ex, z1], [xa, z1]];
    for (const e of edgesOf(c)) M.fin.quad([e.a[0], y0, e.a[1]], [e.b[0], y0, e.b[1]], [e.b[0], y1, e.b[1]], [e.a[0], y1, e.a[1]], [e.n[0], 0, e.n[1]]);
    M.fin.quad([xa, y1, z0], [ex, y1, z0], [ex, y1, z1], [xa, y1, z1], [0, 1, 0]);
    M.fin.quad([xa, y0, z0], [ex, y0, z0], [ex, y0, z1], [xa, y0, z1], [0, -1, 0]);
    panel(M.louvre, lobby, 0.5, lobby.len - 0.5, () => 0.3, () => 4.9, 0.3); // the lobby's dark glazing under the canopy
  }

  for (const [name, m] of Object.entries(M)) if (!m.empty) b.put(m.geometry(), name === 'metal' && !near ? 'roof' : name);
  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // a building carries no road contract
  root.userData.elevationDatum = 'Y=0 is local flat-map grade, not sea level; the podium stands on it.';
  return root;
}
