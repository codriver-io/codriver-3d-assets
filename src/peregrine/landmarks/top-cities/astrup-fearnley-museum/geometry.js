import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// One swept glass sail over three timber volumes, with the canal kept open.
// Metres, +X east, +Y up, +Z south. Rotation is the mapped footprint; the
// layer does not rotate the model again.
const localOf = ([lng, lat]) => {
  const k = mercStretch(SPEC.origin[1]);
  return [
    (lngToMercX(lng) - lngToMercX(SPEC.origin[0])) / k,
    (latToMercY(SPEC.origin[1]) - latToMercY(lat)) / k,
  ];
};
const R = FOOTPRINTS.map((ring) => ring.map(localOf));
const [roofN, roofS, museumOutline, northOutline, part8, part4, part20, part16] = R;
const VOLUMES = [[part20, 20], [part16, 16], [part8, 8], [part4, 4]];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const centroid = (ring) => {
  let x = 0, z = 0;
  for (const p of ring) { x += p[0]; z += p[1]; }
  return [x / ring.length, z / ring.length];
};
const signedArea = (ring) => {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
};

function inside(ring, x, z) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j], [bx, bz] = ring[i];
    if ((az > z) !== (bz > z) && x < (bx - ax) * (z - az) / (bz - az) + ax) hit = !hit;
  }
  return hit;
}
function insideRoof(x, z) { return inside(roofN, x, z) || inside(roofS, x, z); }
function wallTop(x, z) {
  for (const [ring, h] of VOLUMES) if (inside(ring, x, z)) return h;
  return 0;
}
function boundaryDistance(ring, x, z) {
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const dx = b[0] - a[0], dz = b[1] - a[1], len = dx * dx + dz * dz;
    const t = len ? clamp(((x - a[0]) * dx + (z - a[1]) * dz) / len, 0, 1) : 0;
    best = Math.min(best, Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t));
  }
  return best;
}
function onOutline(outline, x, z) {
  return inside(outline, x, z) && boundaryDistance(outline, x, z) < 1.15;
}

// Along the peninsula: south park lip → north glass peaks. t = 0 at the lip.
const SOUTH = roofS.reduce((a, p) => (p[1] > a[1] ? p : a));
const GABLE_N = roofN.reduce((a, p) => (p[0] - p[1] > a[0] - a[1] ? p : a));
const GABLE_S = roofS.reduce((a, p) => (p[0] - p[1] > a[0] - a[1] ? p : a));
const AXIS_LEN = Math.max(1, SOUTH[1] - GABLE_N[1]);

// Smooth bump, zero at the radius, so neighbouring peaks do not ripple the eave.
function bump(x, z, p, amp, radius) {
  const d = Math.hypot(x - p[0], z - p[1]);
  if (d >= radius) return 0;
  const u = 1 - d / radius;
  return amp * u * u;
}

function sail(x, z) {
  const t = clamp((SOUTH[1] - z) / AXIS_LEN, 0, 1);
  // 3.6 m at the sculpture-park lip. The rise is already above the office by the time
  // it gets there, so the sheet stays one slope instead of a flat lid on the parapet.
  let h = 3.6 + 17.4 * Math.pow(t, 0.62);
  h += bump(x, z, GABLE_N, 3.0, 36);
  h += bump(x, z, GABLE_S, 4.2, 32);
  // Narrow sky slot between the two canal gables.
  h -= bump(x, z, mid(GABLE_N, GABLE_S), 3.2, 11);
  h += bump(x, z, [-8, 20], 2.4, 28);
  // Broad lift over the five-storey block so the glass clears 20 m without a crease.
  h += bump(x, z, [-4, -8], 5.0, 45);
  const dLip = Math.hypot(x - SOUTH[0], z - SOUTH[1]);
  if (dLip < 14) h = Math.min(h, 3.6 + dLip * 0.38);
  const wall = wallTop(x, z);
  if (wall && h < wall + 0.45) h = wall + 0.45;
  return h;
}

function insetRing(ring, d) {
  const c = centroid(ring);
  return ring.map(([x, z]) => {
    const dx = c[0] - x, dz = c[1] - z, L = Math.hypot(dx, dz) || 1;
    return [x + dx / L * d, z + dz / L * d];
  });
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const fold = (m) => !near && m === 'board' ? 'timber' : !near && m === 'glassDeep' ? 'glass' : m;
  const soups = new Map();
  const add = (mat, a, c, d) => {
    mat = fold(mat);
    const ab = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const ac = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
    const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
    if (n[0] * n[0] + n[1] * n[1] + n[2] * n[2] < 1e-10) return;
    if (!soups.has(mat)) soups.set(mat, []);
    soups.get(mat).push(...a, ...c, ...d);
  };
  const tri = (mat, a, c, d, out) => {
    const ab = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const ac = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
    const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
    const ox = out[0] - a[0], oy = out[1] - a[1], oz = out[2] - a[2];
    if (n[0] * ox + n[1] * oy + n[2] * oz < 0) [c, d] = [d, c];
    add(mat, a, c, d);
  };
  const quad = (mat, a, c, d, e, out) => { tri(mat, a, c, d, out); tri(mat, a, d, e, out); };

  function lid(mat, ring, y, dir) {
    const area = signedArea(ring);
    const poly = area < 0 ? [...ring].reverse() : ring;
    const idx = THREE.ShapeUtils.triangulateShape(poly.map((p) => new THREE.Vector2(p[0], p[1])), []);
    const c = centroid(poly);
    for (const ids of idx) {
      const p = ids.map((i) => [poly[i][0], y, poly[i][1]]);
      tri(mat, p[0], p[1], p[2], [c[0], y + dir * 20, c[1]]);
    }
  }

  function extrude(mat, ring, y0, y1, outline) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], d = ring[(i + 1) % ring.length];
      const m = mid(a, d);
      if (outline && inside(outline, m[0], m[1]) && !onOutline(outline, m[0], m[1])) continue;
      const ex = d[0] - a[0], ez = d[1] - a[1], el = Math.hypot(ex, ez) || 1;
      let nx = -ez / el, nz = ex / el;
      // Away from the ring, not the centroid: a concave office plan folds the centroid test inward.
      if (inside(ring, m[0] + nx * 0.5, m[1] + nz * 0.5)) { nx = -nx; nz = -nz; }
      quad(mat,
        [a[0], y0, a[1]], [d[0], y0, d[1]], [d[0], y1, d[1]], [a[0], y1, a[1]],
        [m[0] + nx * 4, (y0 + y1) / 2, m[1] + nz * 4]);
    }
    lid(mat, ring, y1, 1);
  }

  // Timber volumes on a quay plinth. Interior part-joins are omitted.
  for (const [ring, top, outline] of [[part20, 20, northOutline], [part16, 16, northOutline], [part8, 8, museumOutline], [part4, 4, museumOutline]]) {
    const plinth = insetRing(ring, 0.28);
    const wall = insetRing(ring, 0.62);
    extrude('concrete', plinth, 0, 0.58, null);
    extrude('timber', wall, 0.42, top, outline);
    if (!near) continue;
    for (let i = 0; i < wall.length; i++) {
      const a = wall[i], d = wall[(i + 1) % wall.length];
      const len = dist(a, d);
      if (len < 6) continue;
      const m = mid(a, d);
      if (outline && inside(outline, m[0], m[1]) && !onOutline(outline, m[0], m[1])) continue;
      const ex = d[0] - a[0], ez = d[1] - a[1], el = Math.hypot(ex, ez) || 1;
      let ox = -ez / el, oz = ex / el;
      if (inside(wall, m[0] + ox * 0.4, m[1] + oz * 0.4)) { ox = -ox; oz = -oz; }
      // Vertical board groups on the long timber faces. Canal curtain walls stay clear of them.
      const canal = Math.abs(ox) + Math.abs(oz) > 0 && (m[0] - GABLE_S[0]) * ox + (m[1] - GABLE_S[1]) * oz > 0 && top <= 8;
      if (canal) continue;
      const nBoards = Math.max(2, Math.round(len / 2.05));
      for (let k = 0; k < nBoards; k++) {
        const t = (k + 0.5) / nBoards;
        const px = lerp(a[0], d[0], t) + ox * 0.12;
        const pz = lerp(a[1], d[1], t) + oz * 0.12;
        const tx = (d[0] - a[0]) / len, tz = (d[1] - a[1]) / len;
        quad('board',
          [px - tx * 0.2, 0.7, pz - tz * 0.2],
          [px + tx * 0.2, 0.7, pz + tz * 0.2],
          [px + tx * 0.2, top - 0.28, pz + tz * 0.2],
          [px - tx * 0.2, top - 0.28, pz - tz * 0.2],
          [px + ox, top / 2, pz + oz]);
      }
    }
  }

  // Tall dark office glazing, with a few muted amber blinds among the timber bays.
  punched(part20, northOutline, 20, [2.15, 5.75, 9.35, 12.95, 16.5]);
  punched(part16, northOutline, 16, [2.35, 6.15, 9.95, 13.55]);

  function punched(ring, outline, top, sills) {
    const wall = insetRing(ring, 0.62);
    const c = centroid(wall);
    for (let i = 0; i < wall.length; i++) {
      const a = wall[i], d = wall[(i + 1) % wall.length];
      const len = dist(a, d);
      if (len < 9) continue;
      const m = mid(a, d);
      if (!onOutline(outline, m[0], m[1])) continue;
      const nx = m[0] - c[0], nz = m[1] - c[1], nL = Math.hypot(nx, nz) || 1;
      const ox = nx / nL * 0.28, oz = nz / nL * 0.28;
      const tx = (d[0] - a[0]) / len, tz = (d[1] - a[1]) / len;
      const pitch = near ? 3.25 : 6.4;
      const n = Math.max(1, Math.round((len - 2.2) / pitch));
      const w = near ? 1.45 : 2.5;
      for (let k = 0; k < n; k++) {
        const t = (k + 0.5) / n;
        const cx = lerp(a[0], d[0], t), cz = lerp(a[1], d[1], t);
        for (const [row, y] of sills.entries()) {
          const h = Math.min(2.4, top - 0.4 - y);
          if (h < 1.2) continue;
          const x0 = cx - tx * w / 2 + ox, z0 = cz - tz * w / 2 + oz;
          const x1 = cx + tx * w / 2 + ox, z1 = cz + tz * w / 2 + oz;
          const mat = (k * 3 + row * 5 + i) % 11 === 0 ? 'glow' : 'windowGlass';
          quad(mat, [x0, y, z0], [x1, y, z1], [x1, y + h, z1], [x0, y + h, z0], [cx + ox * 4, y + h / 2, cz + oz * 4]);
        }
      }
    }
  }

  // Glass entrance and curtain wall on the canal edges of the museum, where the sail lifts off the timber.
  curtain(part8, museumOutline, 8);
  curtain(part4, museumOutline, 4);
  function curtain(ring, outline, top) {
    const wall = insetRing(ring, 0.62);
    const c = centroid(wall);
    for (let i = 0; i < wall.length; i++) {
      const a = wall[i], d = wall[(i + 1) % wall.length];
      const len = dist(a, d);
      if (len < 7) continue;
      const m = mid(a, d);
      if (!onOutline(outline, m[0], m[1])) continue;
      const nx = m[0] - c[0], nz = m[1] - c[1], nL = Math.hypot(nx, nz) || 1;
      // Faces the canal / the other pavilion, not the fjord.
      const toward = (GABLE_N[0] - m[0]) * nx + (GABLE_N[1] - m[1]) * nz;
      if (toward < 0) continue;
      const ox = nx / nL * 0.12, oz = nz / nL * 0.12;
      const y1 = Math.min(top + 0.05, sail(m[0], m[1]) - 0.7);
      if (y1 < 2.2) continue;
      quad('glass',
        [a[0] + ox, 0.7, a[1] + oz], [d[0] + ox, 0.7, d[1] + oz],
        [d[0] + ox, y1, d[1] + oz], [a[0] + ox, y1, a[1] + oz],
        [m[0] + ox * 6, y1 / 2, m[1] + oz * 6]);
      if (!near) continue;
      const nMull = Math.max(2, Math.round(len / 2.4));
      for (let k = 1; k < nMull; k++) {
        const t = k / nMull;
        const px = lerp(a[0], d[0], t) + ox, pz = lerp(a[1], d[1], t) + oz;
        b.bar('steel', [px, 0.75, pz], [px, y1, pz], 0.06, 0.08);
      }
    }
  }

  // Glass sail: top sheet, soffit 0.58 m below, steel fascia on the boundary.
  const step = near ? 2.2 : 5.8;
  function roofTriangles(ring) {
    const area = signedArea(ring);
    const poly = area < 0 ? [...ring].reverse() : ring;
    const idx = THREE.ShapeUtils.triangulateShape(poly.map((p) => new THREE.Vector2(p[0], p[1])), []);
    const out = [];
    const split = (a, c, d, depth) => {
      const ab = dist(a, c), bc = dist(c, d), ca = dist(d, a), m = Math.max(ab, bc, ca);
      if (m <= step || depth > 9) { out.push([a, c, d]); return; }
      if (ab >= bc && ab >= ca) { const p = mid(a, c); split(a, p, d, depth + 1); split(p, c, d, depth + 1); }
      else if (bc >= ca) { const p = mid(c, d); split(a, c, p, depth + 1); split(a, p, d, depth + 1); }
      else { const p = mid(d, a); split(a, c, p, depth + 1); split(p, c, d, depth + 1); }
    };
    for (const ids of idx) split(poly[ids[0]], poly[ids[1]], poly[ids[2]], 0);
    return out;
  }
  const yTop = (p) => sail(p[0], p[1]);
  const THICK = 0.58;
  for (const ring of [roofN, roofS]) {
    for (const [a, c, d] of roofTriangles(ring)) {
      const A = [a[0], yTop(a), a[1]], C = [c[0], yTop(c), c[1]], D = [d[0], yTop(d), d[1]];
      const mx = (a[0] + c[0] + d[0]) / 3, mz = (a[1] + c[1] + d[1]) / 3;
      tri('glass', A, C, D, [mx, 80, mz]);
      tri('glass', [a[0], A[1] - THICK, a[1]], [d[0], D[1] - THICK, d[1]], [c[0], C[1] - THICK, c[1]], [mx, -20, mz]);
    }
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], d = ring[(i + 1) % ring.length];
      const n = Math.max(1, Math.ceil(dist(a, d) / step));
      for (let k = 0; k < n; k++) {
        const p = [lerp(a[0], d[0], k / n), lerp(a[1], d[1], k / n)];
        const q = [lerp(a[0], d[0], (k + 1) / n), lerp(a[1], d[1], (k + 1) / n)];
        const yp = yTop(p), yq = yTop(q);
        const mx = (p[0] + q[0]) / 2, mz = (p[1] + q[1]) / 2;
        const ex = q[0] - p[0], ez = q[1] - p[1], el = Math.hypot(ex, ez) || 1;
        let nx = -ez / el, nz = ex / el;
        if (insideRoof(mx + nx, mz + nz)) { nx = -nx; nz = -nz; }
        const out = [mx + nx * 4, (yp + yq) / 2, mz + nz * 4];
        quad('steel',
          [p[0], yp, p[1]], [q[0], yq, q[1]], [q[0], yq - THICK, q[1]], [p[0], yp - THICK, p[1]],
          out);
      }
    }
  }

  // Steel lattice on the glass and glulam beams under it. Same stations in both LODs; far is coarser.
  const rib = near ? 6.4 : 12;
  const xs0 = Math.min(...roofN.map((p) => p[0]), ...roofS.map((p) => p[0]));
  const xs1 = Math.max(...roofN.map((p) => p[0]), ...roofS.map((p) => p[0]));
  const zs0 = Math.min(...roofN.map((p) => p[1]), ...roofS.map((p) => p[1]));
  const zs1 = Math.max(...roofN.map((p) => p[1]), ...roofS.map((p) => p[1]));
  function polylines(horizontal) {
    const lines = [];
    const span = horizontal ? (xs1 - xs0) : (zs1 - zs0);
    const n = Math.max(2, Math.round(span / rib));
    for (let i = 0; i <= n; i++) {
      const fixed = horizontal ? lerp(zs0, zs1, i / n) : lerp(xs0, xs1, i / n);
      const run = [];
      const samples = Math.ceil((horizontal ? xs1 - xs0 : zs1 - zs0) / rib);
      for (let s = 0; s <= samples; s++) {
        const t = s / samples;
        const x = horizontal ? lerp(xs0, xs1, t) : fixed;
        const z = horizontal ? fixed : lerp(zs0, zs1, t);
        if (insideRoof(x, z)) run.push([x, z]);
        else if (run.length > 1) { lines.push(run.splice(0, run.length)); }
        else run.length = 0;
      }
      if (run.length > 1) lines.push(run);
    }
    return lines;
  }
  for (const line of [...polylines(true), ...polylines(false)]) {
    for (let i = 0; i < line.length - 1; i++) {
      const p = line[i], q = line[i + 1];
      if (dist(p, q) < rib * 0.35) continue;
      const mp = mid(p, q);
      if (!insideRoof(mp[0], mp[1])) continue;
      b.bar('steel', [p[0], yTop(p) + 0.22, p[1]], [q[0], yTop(q) + 0.22, q[1]], near ? 0.04 : 0.07, near ? 0.07 : 0.09);
    }
  }
  // Glulam under the open sail, in short chords so a straight bar does not cut the curve.
  const beamStep = near ? 9.5 : 18;
  for (let z = zs0 + 3; z <= zs1 - 3; z += beamStep) {
    let run = [];
    const flush = () => {
      for (let i = 0; i < run.length - 1; i++) {
        const a = run[i], c = run[i + 1];
        if (dist(a, c) < 4) continue;
        const clear = [0.2, 0.5, 0.8].every((t) => {
          const x = lerp(a[0], c[0], t), z = lerp(a[1], c[1], t);
          if (!insideRoof(x, z)) return false;
          const edge = Math.min(boundaryDistance(roofN, x, z), boundaryDistance(roofS, x, z));
          return edge > 1.6;
        });
        if (!clear) continue;
        b.bar('beam',
          [a[0], sail(a[0], a[1]) - THICK - 0.72, a[1]],
          [c[0], sail(c[0], c[1]) - THICK - 0.72, c[1]],
          near ? 0.22 : 0.34, near ? 0.42 : 0.36);
      }
      run = [];
    };
    const stride = near ? 7 : 12;
    for (let x = xs0; x <= xs1; x += stride) {
      if (insideRoof(x, z) && sail(x, z) > wallTop(x, z) + 2.4) run.push([x, z]);
      else flush();
    }
    flush();
  }

  // Posts only in the open undercroft: canal, park lip, east overhang. Not in front of the timber.
  const posts = [];
  function addPost(x, z) {
    if (!insideRoof(x, z)) return;
    for (const [ring] of VOLUMES) {
      if (inside(ring, x, z) || boundaryDistance(ring, x, z) < 2.1) return;
    }
    const y = sail(x, z) - THICK - 0.02;
    if (y < 3.6) return;
    if (posts.some((p) => Math.hypot(p[0] - x, p[1] - z) < 10.5)) return;
    posts.push([x, z, y]);
    // Closed square posts. Open cylinders read as back-faces once a ray enters the tube.
    b.bar('steel', [x, 0, z], [x, y, z], near ? 0.26 : 0.32, near ? 0.26 : 0.32);
  }
  for (const ring of [roofN, roofS]) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], d = ring[(i + 1) % ring.length];
      const el = dist(a, d);
      if (el < 9) continue;
      let nx = (a[1] - d[1]) / el, nz = (d[0] - a[0]) / el;
      const m = mid(a, d);
      if (!insideRoof(m[0] + nx * 2, m[1] + nz * 2)) { nx = -nx; nz = -nz; }
      const n = Math.max(1, Math.round(el / 11.5));
      for (let k = 0; k <= n; k++) {
        const t = k / n;
        addPost(lerp(a[0], d[0], t) + nx * 2.8, lerp(a[1], d[1], t) + nz * 2.8);
      }
    }
  }

  // Footbridge at quay level and the enclosed skybridge, across the canal.
  const span = canalSpan();
  if (span) {
    const [a, c] = span;
    const dx = c[0] - a[0], dz = c[1] - a[1], L = Math.hypot(dx, dz) || 1;
    const px = -dz / L, pz = dx / L;
    const deck = (y, half, mat, thick) => {
      quad(mat,
        [a[0] + px * half, y, a[1] + pz * half],
        [c[0] + px * half, y, c[1] + pz * half],
        [c[0] - px * half, y, c[1] - pz * half],
        [a[0] - px * half, y, a[1] - pz * half],
        [mid(a, c)[0], y + 5, mid(a, c)[1]]);
      quad(mat,
        [a[0] + px * half, y - thick, a[1] + pz * half],
        [a[0] - px * half, y - thick, a[1] - pz * half],
        [c[0] - px * half, y - thick, c[1] - pz * half],
        [c[0] + px * half, y - thick, c[1] + pz * half],
        [mid(a, c)[0], y - 5, mid(a, c)[1]]);
    };
    deck(0.72, 1.7, 'timber', 0.18);
    for (const s of [1, -1]) {
      b.bar('steel', [a[0] + px * s * 1.55, 0.72, a[1] + pz * s * 1.55], [c[0] + px * s * 1.55, 0.72, c[1] + pz * s * 1.55], 0.08, 0.08);
      b.bar('steel', [a[0] + px * s * 1.55, 1.85, a[1] + pz * s * 1.55], [c[0] + px * s * 1.55, 1.85, c[1] + pz * s * 1.55], 0.06, 0.06);
    }
    // Skybridge: a glazed link at the top of the low pavilion.
    deck(8.4, 1.35, 'steel', 0.16);
    deck(10.15, 1.35, 'steel', 0.12);
    for (const s of [1, -1]) {
      quad('glassDeep',
        [a[0] + px * s * 1.35, 8.45, a[1] + pz * s * 1.35],
        [c[0] + px * s * 1.35, 8.45, c[1] + pz * s * 1.35],
        [c[0] + px * s * 1.35, 10.05, c[1] + pz * s * 1.35],
        [a[0] + px * s * 1.35, 10.05, a[1] + pz * s * 1.35],
        [mid(a, c)[0] + px * s * 4, 9.2, mid(a, c)[1] + pz * s * 4]);
    }
  }

  function canalSpan() {
    let best = null;
    const edges = (ring) => ring.map((p, i) => [p, ring[(i + 1) % ring.length]]);
    for (const [a0, a1] of edges(museumOutline)) for (const [b0, b1] of edges(northOutline)) {
      const a = mid(a0, a1), c = mid(b0, b1), d = dist(a, c);
      if (d < 9 || d > 26) continue;
      // Prefer the crossing nearest the two glass gables, where the photographs are taken.
      const score = d + dist(mid(a, c), mid(GABLE_N, GABLE_S)) * 0.35;
      if (!best || score < best.score) best = { score, span: [a, c] };
    }
    return best && best.span;
  }

  for (const [mat, list] of soups) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(list, 3));
    g.computeVertexNormals();
    b.put(g, mat);
  }
  return b.finish();
}
