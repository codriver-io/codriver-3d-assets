// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
// Biodôme de Montréal: Taillibert's concrete velodrome shell, four abutments, arches between them, the spindle
// of skylights along its spine and lens skylights near the edges. See biodome-de-montreal-shell.js.
import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { RING, FEET, AXIS } from './biodome-de-montreal-plan.js';
import {
  shellParts, ribStrip, lens, toWorld, pointAtSigma, FOOT_SIGMA, BUBBLE_RISE, SPINDLE_POINTS as SPINDLE, spindleHalfWidth,
} from './biodome-de-montreal-shell.js';

// Lens skylights lie across the axis (along v).
const ACROSS = Math.atan2(AXIS.v[1], AXIS.v[0]);

/** Layout of every skylight lens: { kind, c: [x, z], angle, hl (half length), hw (half width) }. */
export function skylightLayout() {
  const out = [];
  // The spine: sixteen long lenses across the spindle.
  for (let i = 0; i < 16; i++) {
    const s = -34 + 6.9 * i, [cx, cz] = toWorld(s, 0);
    out.push({ kind: 'spine', c: [cx, cz], angle: ACROSS, hl: spindleHalfWidth(s) - 2.0, hw: 2.7 });
  }
  // Four shorter lenses on each flank, between the spindle and the abutment ribs.
  for (const side of [-1, 1]) for (let i = 0; i < 4; i++) {
    const [cx, cz] = toWorld(-4 + 5.6 * i, 30 * side);
    out.push({ kind: 'flank', c: [cx, cz], angle: ACROSS, hl: 7.2, hw: 2.0 });
  }
  // Eleven lenses along each long back edge, set about 11 m inside it and pointing at the centre.
  for (const side of ['AB', 'DA']) for (let i = 0; i < 11; i++) {
    const sigma = side === 'DA' ? FOOT_SIGMA.D + 34 + 6.5 * i : FOOT_SIGMA.B - 34 - 6.5 * i;
    const [bx, bz] = pointAtSigma(sigma), R = Math.hypot(bx, bz), tc = 1 - 11.5 / R;
    out.push({ kind: 'edge', c: [bx * tc, bz * tc], angle: Math.atan2(bz, bx), hl: 8.2, hw: 2.1 });
  }
  return out;
}

/** Plan polylines of the heavy ribs: [{ points, ...ribStrip options }]. */
export function ribLayout() {
  const ribs = [];
  const mirror = (pts, opts) => { for (const side of [1, -1]) ribs.push({ points: pts.map(([s, w]) => toWorld(s, w * side)), ...opts }); };
  // The two spindle ribs from the nose (south-west foot) to the back (north-east foot).
  mirror(SPINDLE, { wb: 2.8, wt: 1.0, hr: 1.5, taper: 6 });
  // Heavy ribs from the west and south feet up toward the crown, between the flank lenses and the edge lenses.
  for (const [name, side] of [['D', 1], ['B', -1]]) {
    const [fx, fz] = RING[FEET[name]], r = Math.hypot(fx, fz), t = 1 - 2.2 / r;
    ribs.push({
      points: [[fx * t, fz * t], toWorld(-38, 61 * side), toWorld(-15, 52 * side), toWorld(10, 43 * side), toWorld(40, 32 * side), toWorld(72, 17.5 * side)],
      wb: 2.6, wt: 0.9, hr: 1.4, taper: 6,
    });
  }
  return ribs;
}

const tmpBox = (cx, cy, cz, sx, sy, sz, angle) => {
  const g = new THREE.BoxGeometry(sx, sy, sz);
  g.rotateY(angle); g.translate(cx, cy, cz);
  return g;
};

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const shell = shellParts(detail);
  b.put(shell.top, 'concrete');
  b.put(shell.rim, 'concrete');
  b.put(shell.soffit, 'concrete');
  if (shell.solid) b.put(shell.solid, 'concrete');
  if (shell.glass) b.put(shell.glass, 'glass');

  // Ribs: heavy ones always, fine fins on the two arches facing the stadium (near only).
  for (const { points, ...opts } of ribLayout()) b.put(ribStrip(points, { step: near ? 3 : 5.5, ...opts }), 'rib');
  if (near) {
    for (const [from, to] of [['B', 'C'], ['C', 'D']]) for (const f of [0.22, 0.5, 0.78]) {
      const sigma = FOOT_SIGMA[from] + (FOOT_SIGMA[to] - FOOT_SIGMA[from]) * f, [bx, bz] = pointAtSigma(sigma);
      b.put(ribStrip([[bx * 0.985, bz * 0.985], [bx * 0.86, bz * 0.86], [bx * 0.7, bz * 0.7], [bx * 0.52, bz * 0.52]], { wb: 1.3, wt: 0.5, hr: 0.55, taper: 4 }), 'rib');
    }
  }

  // Skylights, each with two white louvre bars across it in the near model.
  for (const l of skylightLayout()) {
    b.put(lens(l.c[0], l.c[1], l.angle, l.hl, l.hw, near ? { nu: 12, nv: 4 } : { nu: 6, nv: 2 }), 'skylight');
    if (near && l.hl > 5) for (const xi of (l.hl > 10 ? [-0.6, -0.2, 0.2, 0.6] : [-0.4, 0.4])) {
      const dx = Math.cos(l.angle), dz = Math.sin(l.angle);
      const cx = l.c[0] + dx * l.hl * xi, cz = l.c[1] + dz * l.hl * xi, half = l.hw * Math.pow(1 - xi * xi, 0.8) * 1.02;
      b.put(ribStrip([[cx + dz * half, cz - dx * half], [cx, cz], [cx - dz * half, cz + dx * half]], { step: half, wb: 0.5, wt: 0.3, hr: BUBBLE_RISE + 0.24, taper: 0.4, sink: 0.05, lift: 0.16 }), 'rib');
    }
  }

  if (near) {
    // Mullions every ~3.8 m on the glazed walls under the arches.
    const wi = shell.wallInfo, K = wi.length;
    for (let k = 0; k < K; k++) {
      const p = wi[k], q = wi[(k + 1) % K];
      if ((p.arch + q.arch) / 2 <= 2.8) continue;
      const tx = q.x - p.x, tz = q.z - p.z, len = Math.hypot(tx, tz), n = Math.max(1, Math.round(len / 3.8));
      let nx = tz / len, nz = -tx / len;
      if (nx * (p.x + q.x) + nz * (p.z + q.z) < 0) { nx = -nx; nz = -nz; }
      const angle = -Math.atan2(tz, tx);
      for (let i = 0; i < n; i++) {
        const f = i / n, top = p.top + (q.top - p.top) * f - 0.45;
        if (top < 1.2) continue;
        b.put(tmpBox(p.x + tx * f + nx * 0.05, top / 2, p.z + tz * f + nz * 0.05, 0.26, top, 0.3, angle), 'frame');
      }
    }
    // Entrance: a flat canopy over the middle of the west-south-west arch with its sign and two slim posts.
    const sigma = (FOOT_SIGMA.B + FOOT_SIGMA.C) / 2, [ex, ez] = pointAtSigma(sigma);
    const [ax, az] = pointAtSigma(sigma - 5), [cx2, cz2] = pointAtSigma(sigma + 5);
    let tx = cx2 - ax, tz = cz2 - az; const tl = Math.hypot(tx, tz); tx /= tl; tz /= tl;
    let nx = tz, nz = -tx; if (nx * ex + nz * ez < 0) { nx = -nx; nz = -nz; }
    const R = Math.hypot(ex, ez), tin = 1 - 3.6 / R, wx = ex * tin, wz = ez * tin, ang = -Math.atan2(tz, tx);
    const canopy = { x: wx + nx * 1.55, z: wz + nz * 1.55 };
    b.put(tmpBox(canopy.x, 5.6, canopy.z, 17, 0.5, 3.1, ang), 'concrete');
    for (const side of [-1, 1]) b.put(tmpBox(canopy.x + tx * 8 * side + nx * 1.2, 2.75, canopy.z + tz * 8 * side + nz * 1.2, 0.45, 5.5, 0.45, ang), 'concrete');
    b.put(tmpBox(canopy.x - tx * 3.2 + nx * 0.5, 6.45, canopy.z - tz * 3.2 + nz * 0.5, 6.4, 1.3, 0.2, ang), 'sign');
  }
  return b.finish();
}
