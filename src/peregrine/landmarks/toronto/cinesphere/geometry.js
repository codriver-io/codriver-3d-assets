import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { DOME_AT, PODS, SITE, inside, signedArea } from './cinesphere-site.js';
import { buildDome } from './cinesphere-dome.js';
import { frame, pipe, ramp, stairTower, walkway } from './cinesphere-parts.js';

// Levels (metres above lake level, y = 0). Pods hang from four 32 m masts (OSM height=32); the body's
// underside at 7.5 m and roof at 21 m are photo estimates (OSM: 5 levels, first 3 empty), the glazed
// spine's deck at 6 m follows OSM min_height=6.
export const LEVELS = Object.freeze({ podBottom: 7.5, podRoof: 21, mastTop: 32, spineDeck: 6.5 });

const extrude = (b, material, ring, y0, y1) => {
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(ring.map(([x, z]) => new THREE.Vector2(x, -z))), { depth: y1 - y0, bevelEnabled: false });
  g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); b.put(g, material);
};
const scaled = (ring, centre, k) => ring.map(([x, z]) => [centre[0] + (x - centre[0]) * k, centre[1] + (z - centre[1]) * k]);

function pod(b, detail, p) {
  const near = detail === 'near', { ring, centre, yaw: edgeAngle, tabs, masts } = p;
  const { podBottom: y0, podRoof: y1, mastTop } = LEVELS, fy = -edgeAngle, f = frame(centre, fy);
  const orient = signedArea(ring) > 0 ? 1 : -1;
  // Open frame: floor plates on the mapped outline, posts and spandrels round it, glazing in most bays and
  // open bays showing the core and the floors behind; short chamfer and stair-bump faces stay solid.
  const floors = [[y0, y0 + 0.65], [11.95, 12.4], [16.45, 16.9], [y1 - 0.5, y1]];
  // Far keeps the lowest and the roof plate: the two between show through glass at a few pixels.
  for (const [fa, fb] of near ? floors : [floors[0], floors[3]]) extrude(b, 'white', ring, fa, fb);
  const roof = scaled(ring, centre, 0.94);
  extrude(b, 'concrete', roof, y1, y1 + 0.15);
  const storeys = [[y0 + 0.65, 11.95], [12.4, 16.45], [16.9, y1 - 0.5]];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], c = ring[(i + 1) % ring.length], dx = c[0] - a[0], dz = c[1] - a[1], L = Math.hypot(dx, dz);
    const n = [orient * dz / L, -orient * dx / L], th = Math.atan2(-dz, dx), ux = dx / L, uz = dz / L;
    const at = (s, off) => [a[0] + ux * s + n[0] * off, a[1] + uz * s + n[1] * off];
    if (L < 6.5) { // solid corner / stair-core face
      const m = at(L / 2, 0);
      b.box('white', [m[0], (y0 + y1) / 2, m[1]], [L, y1 - y0, 0.35], th);
      continue;
    }
    const bays = near ? Math.max(2, Math.round(L / 3)) : Math.max(1, Math.round(L / 20)); // far: one glazed run and two posts per ~20 m
    for (let k = 0; k <= bays; k++) { // posts, corner to corner
      const q = at(L * k / bays, 0.1);
      b.box('white', [q[0], (y0 + y1) / 2, q[1]], [0.24, y1 - y0, 0.24], th);
    }
    storeys.forEach(([sa, sb], s) => {
      // spandrel above each floor plate, then glazing
      const m = at(L / 2, 0.1);
      b.box('white', [m[0], sa + 0.45, m[1]], [L, 0.9, 0.2], th);
      for (let k = 0; k < bays; k++) {
        const open = !near ? false : s === 0 ? (k > 0 && k < bays - 1) : k % 3 === 1, mid = at(L * (k + 0.5) / bays, 0.08), w = L / bays - 0.3;
        if (open) {
          if (near) b.bar('white', [mid[0] - ux * w / 2, sa + 1.1, mid[1] - uz * w / 2], [mid[0] + ux * w / 2, sa + 1.1, mid[1] + uz * w / 2], 0.03, 0.05);
          continue;
        }
        b.box('glass', [mid[0], (sa + 0.9 + sb) / 2, mid[1]], [w, sb - sa - 0.95, 0.1], th);
        if (near && k % 2 === 0) { // tension rods, as photographed across the upper storeys
          const k2 = Math.min(bays, k + 3), s0 = L * k / bays, s1 = L * k2 / bays;
          if (s > 0) {
            const pa = at(s0, 0.22), pc = at(s1, 0.22);
            b.bar('white', [pa[0], sa + 0.9, pa[1]], [pc[0], sb - 0.1, pc[1]], 0.03, 0.03, 0, true);
          }
        }
      }
    });
  }
  // The core the masts stand in, and four interior posts: what shows through the open bays.
  b.box('deck', [centre[0], (y0 + y1) / 2, centre[1]], [6.4, y1 - y0, 6.4], fy);
  for (const [su, sv] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
    const q = f.p(su * 9, 0, sv * 9);
    b.box('white', [q[0], (y0 + y1) / 2, q[2]], [0.3, y1 - y0, 0.3], fy);
  }

  // Roof deck parapet: a rail loop just inside the edge.
  const rr = scaled(ring, centre, 0.96);
  for (let i = 0; i < rr.length; i++) {
    const a = rr[i], c = rr[(i + 1) % rr.length], L = Math.hypot(c[0] - a[0], c[1] - a[1]);
    if (L < (near ? 1 : 4)) continue;
    b.bar('white', [a[0], y1 + 1.15, a[1]], [c[0], y1 + 1.15, c[1]], 0.04, 0.07);
    if (near) {
      b.bar('white', [a[0], y1 + 0.6, a[1]], [c[0], y1 + 0.6, c[1]], 0.025, 0.04);
      const posts = Math.max(1, Math.round(L / 2.4));
      for (let k = 0; k < posts; k++) { const t = k / posts, x = a[0] + (c[0] - a[0]) * t, z = a[1] + (c[1] - a[1]) * t; b.bar('white', [x, y1 + 0.1, z], [x, y1 + 1.15, z], 0.03, 0.05); }
    }
  }

  // Masts: the four mapped pipe columns, lake bed to 32 m, tied by ring braces and a top platform.
  const mc = [masts.reduce((s, m) => s + m[0], 0) / 4, masts.reduce((s, m) => s + m[1], 0) / 4];
  for (const m of masts) pipe(b, 'white', [m[0], 0, m[1]], [m[0], mastTop, m[1]], 0.5, near ? 10 : 6, near);
  const braces = near ? [12, 16, 24, 27.5, 31] : [26];
  for (const y of braces) for (let i = 0; i < 4; i++) {
    const m = masts[i], o = masts[(i + 1) % 4];
    if (Math.hypot(m[0] - o[0], m[1] - o[1]) > 4.5) continue;
    b.bar('white', [m[0], y, m[1]], [o[0], y, o[1]], 0.1, 0.1);
  }
  if (near) for (const y of [24, 27.5]) { // diagonal ties between the pipes
    for (let i = 0; i < 4; i++) { const m = masts[i], o = masts[(i + 1) % 4]; if (Math.hypot(m[0] - o[0], m[1] - o[1]) < 4.5) b.bar('white', [m[0], y, m[1]], [o[0], y + 3.5, o[1]], 0.06, 0.06, 0, true); }
  }
  b.box('white', [mc[0], mastTop - 0.9, mc[1]], [5.4, 0.3, 5.4], fy);

  // Stay cables from the mast heads to the roof edge, in the pod's own two axes.
  const halfU = Math.max(...ring.map(([x, z]) => Math.abs((x - centre[0]) * Math.cos(edgeAngle) + (z - centre[1]) * Math.sin(edgeAngle))));
  const halfV = Math.max(...ring.map(([x, z]) => Math.abs(-(x - centre[0]) * Math.sin(edgeAngle) + (z - centre[1]) * Math.cos(edgeAngle))));
  const u = [Math.cos(edgeAngle), Math.sin(edgeAngle)], v = [-Math.sin(edgeAngle), Math.cos(edgeAngle)];
  const heads = near ? [31.6, 28.6, 25.6] : [31.6, 27];
  for (const [d, per, half] of [[u, v, halfU], [[-u[0], -u[1]], v, halfU], [v, u, halfV], [[-v[0], -v[1]], u, halfV]]) {
    heads.forEach((h, k) => {
      const lat = (k - (heads.length - 1) / 2) * (near ? 5.5 : 8);
      const top = [mc[0] + per[0] * lat * 0.22 + d[0] * 1.6, h, mc[1] + per[1] * lat * 0.22 + d[1] * 1.6];
      const foot = [mc[0] + d[0] * (half - 2.2 - k * 1.5) + per[0] * lat, y1 + 0.7, mc[1] + d[1] * (half - 2.2 - k * 1.5) + per[1] * lat];
      b.bar('cable', top, foot, near ? 0.04 : 0.09, near ? 0.04 : 0.09, 0, true);
    });
  }

  // Support pipes under the body: a 3x3 grid inside the outline (the middle is the mast cluster).
  for (const su of [-1, 0, 1]) for (const sv of [-1, 0, 1]) {
    if (!su && !sv) continue;
    const q = f.p(su * (halfU - 3.2), 0, sv * (halfV - 3.2));
    pipe(b, 'white', [q[0], 0, q[2]], [q[0], y0 + 0.3, q[2]], 0.36, near ? 8 : 5, near);
  }
  // A glazed core between the mast pipes, down to the lake (lifts and stairs).
  b.box('glass', [mc[0], y0 / 2, mc[1]], [3.0, y0, 2.8], fy);

  // Stair cores on the mapped bumps, lake to roof.
  for (const t of tabs) {
    if (Math.hypot(t.tip[0] - t.attach[0], t.tip[1] - t.attach[1]) > 5) continue;
    const q = frame(t.centre, fy);
    if (near) { stairTower(b, q, 0, 0, 0.3, y1, { width: 1.5, run: 2.6 }); }
    else { for (const dx of [-1.3, 1.3]) for (const dz of [-1.3, 1.3]) q.box(b, 'white', dx, (y1 + 1) / 2, dz, 0.3, y1 + 1, 0.3); q.box(b, 'white', 0, y1 / 2 + 2, 0, 2.4, 0.3, 2.4); }
  }
  // Two trussed stair ramps up the lake face (the face that looks into the complex), one storey each.
  for (const r of rampsFor(p)) ramp(b, r.a, r.c, { width: 2, near });
  for (const r of rampsFor(p)) if (near) for (const e of [r.a, r.c]) pipe(b, 'white', [e[0], 0, e[2]], [e[0], e[1] - 0.2, e[2]], 0.15, 6);
}

/** Centre-line ends of the pod's two ramps: the long face that looks most toward the other pods. */
export function rampsFor(p) {
  const { ring, centre } = p, orient = signedArea(ring) > 0 ? 1 : -1, target = complexCentre();
  const want = [target[0] - centre[0], target[1] - centre[1]], wl = Math.hypot(...want) || 1;
  let best = null;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], c = ring[(i + 1) % ring.length], dx = c[0] - a[0], dz = c[1] - a[1], L = Math.hypot(dx, dz);
    if (L < 18) continue;
    const n = [orient * dz / L, -orient * dx / L], score = (n[0] * want[0] + n[1] * want[1]) / wl;
    if (!best || score > best.score) best = { a, ux: dx / L, uz: dz / L, n, L, score };
  }
  if (!best) return [];
  const at = (s, off, y) => [best.a[0] + best.ux * s + best.n[0] * off, y, best.a[1] + best.uz * s + best.n[1] * off];
  const off = 1.7, s0 = 3.2, s1 = best.L - 3.2;
  return [{ a: at(s0, off, LEVELS.podBottom + 0.5), c: at(s1, off, 12.2) }, { a: at(s0, off, 12.6), c: at(s1, off, 16.7) }];
}
const complexCentre = () => PODS.reduce((s, q) => [s[0] + q.centre[0] / PODS.length, s[1] + q.centre[1] / PODS.length], [0, 0]);

/** Centre-line polyline of the spine from the mapped outline: midpoints of the opposite vertex pairs. */
function spineCentreline() {
  const r = SITE.spine, mid = (i, j) => [(r[i][0] + r[j][0]) / 2, (r[i][1] + r[j][1]) / 2];
  const width = [[1, 0], [2, 16], [3, 15], [4, 14], [5, 13], [6, 12], [7, 11], [8, 9]].reduce((s, [i, j]) => s + Math.hypot(r[i][0] - r[j][0], r[i][1] - r[j][1]), 0) / 8;
  return { points: [mid(1, 0), mid(2, 16), mid(3, 15), mid(4, 14), mid(5, 13), mid(6, 12), mid(7, 11), mid(8, 9)], width };
}
const inAnyPod = (pt) => PODS.some((p) => inside(pt, p.ring));

/** Pieces of a straight run that lie outside every pod body (plus a little overlap into it). */
function exposed(a, c, overlap = 0.6) {
  const L = Math.hypot(c[0] - a[0], c[1] - a[1]), step = 0.25, n = Math.max(1, Math.round(L / step)), pieces = [];
  let start = null;
  for (let i = 0; i <= n; i++) {
    const t = i / n, pt = [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t], out = !inAnyPod(pt);
    if (out && start === null) start = t;
    if ((!out || i === n) && start !== null) { pieces.push([start, out ? t : (i - 1) / n]); start = null; }
  }
  return pieces.map(([s, e]) => {
    const s2 = Math.max(0, s - overlap / L), e2 = Math.min(1, e + overlap / L);
    return [[a[0] + (c[0] - a[0]) * s2, a[1] + (c[1] - a[1]) * s2], [a[0] + (c[0] - a[0]) * e2, a[1] + (c[1] - a[1]) * e2]];
  }).filter(([p, q]) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 1.2);
}

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), near = detail === 'near';
  buildDome(b, detail, DOME_AT[0], DOME_AT[1]);
  // The pedestal wall the ball sits on: 2.4 m of battered concrete (the ball overhangs it), lake level to the cut.
  const drum = new THREE.CylinderGeometry(13.9, 14.7, 2.4, near ? 48 : 24, 1, false);
  drum.translate(DOME_AT[0], 1.2, DOME_AT[1]); b.put(drum, 'concrete');

  for (const p of PODS) pod(b, detail, p);

  // The glazed spine from the north shore to the Cinesphere, cut where it passes through pods.
  const { points, width } = spineCentreline();
  const D = DOME_AT;
  const opt = { width, near, spacing: near ? 15 : 30, height: 3.2 };
  for (let i = 0; i < points.length - 1; i++) for (const [p, q] of exposed(points[i], points[i + 1])) walkway(b, p, q, LEVELS.spineDeck, opt);
  // Short links between pods: along the long axis of each mapped link outline.
  for (const name of ['link21', 'link13', 'link34', 'link45']) {
    const r = SITE[name], e = r.map((pt, i) => ({ i, l: Math.hypot(r[(i + 1) % 4][0] - pt[0], r[(i + 1) % 4][1] - pt[1]) }));
    const shortEdges = e.slice().sort((x, y) => x.l - y.l).slice(0, 2).sort((x, y) => x.i - y.i);
    const mid = ({ i }) => [(r[i][0] + r[(i + 1) % 4][0]) / 2, (r[i][1] + r[(i + 1) % 4][1]) / 2];
    if (name === 'link13') continue; // lies on the spine
    for (const [p, q] of exposed(mid(shortEdges[0]), mid(shortEdges[1]), 1.2)) walkway(b, p, q, LEVELS.spineDeck, { width: shortEdges[0].l, near, spacing: 30, height: 3.2 });
  }
  // The mapped walkway stops about 5 m short of the ring round the ball. A short connector of the same
  // kind turns from its end straight to the sphere and stops at the cladding, with a door frame there.
  const end = points[0], back = [points[1][0] - end[0], points[1][1] - end[1]], bl = Math.hypot(...back);
  const start = [end[0] + back[0] / bl * 1.4, end[1] + back[1] / bl * 1.4];
  const toBall = [end[0] - D[0], end[1] - D[1]], tl = Math.hypot(...toBall), onShell = (r) => [D[0] + toBall[0] / tl * r, D[1] + toBall[1] / tl * r];
  walkway(b, start, end, LEVELS.spineDeck, opt);
  walkway(b, end, onShell(16.9), LEVELS.spineDeck, { ...opt, width: 3.6, spacing: 30 });
  const door = onShell(17.35);
  b.box('white', [door[0], LEVELS.spineDeck + 1.7, door[1]], [2.9, 3.4, 0.5], Math.atan2(toBall[0], toBall[1]));
  return b.finish();
}
