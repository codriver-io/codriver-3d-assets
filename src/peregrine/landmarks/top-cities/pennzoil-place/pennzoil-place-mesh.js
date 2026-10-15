// Pennzoil Place curtain wall, 45° crowns and the two glass atrium pyramids.
// One batched mesh per material. Panes and mullions tile a single plane (no
// stacked skins), so the grid cannot z-fight. Far keeps the same shell with
// a coarser bay.

import * as THREE from 'three';
import { solve, PITCH, ATRIUM, ENTRY, RIDGE } from './pennzoil-place-plan.js';

const DETAIL = {
  near: { bay: 1.524, mullion: 0.12, spandrel: 0.32, band: 1, roofBay: 3.05, courtBay: 2.15 },
  far: { bay: 4.57, mullion: 0.28, spandrel: 0.5, band: 2, roofBay: 7.6, courtBay: 5.2 },
};

function batch() {
  const mats = new Map();
  function sink(mat) {
    let g = mats.get(mat);
    if (!g) { g = { p: [], n: [], i: [] }; mats.set(mat, g); }
    return g;
  }
  function push(mat, pts, normal) {
    const g = sink(mat), base = g.p.length / 3;
    for (const p of pts) { g.p.push(p[0], p[1], p[2]); g.n.push(normal[0], normal[1], normal[2]); }
    if (pts.length === 3) g.i.push(base, base + 1, base + 2);
    else g.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  // pts are CCW when the hint points at the viewer; otherwise they are flipped.
  function face(mat, pts, hint) {
    const a = pts[0], b = pts[1], c = pts[2];
    let nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]);
    let ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
    let nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const L = Math.hypot(nx, ny, nz);
    if (L < 1e-5) return;
    if (nx * hint[0] + ny * hint[1] + nz * hint[2] < 0) {
      pts = pts.length === 4 ? [pts[0], pts[3], pts[2], pts[1]] : [pts[0], pts[2], pts[1]];
      nx = -nx; ny = -ny; nz = -nz;
    }
    push(mat, pts, [nx / L, ny / L, nz / L]);
  }
  function flush(builder) {
    for (const [mat, g] of mats) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(g.p, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(g.n, 3));
      const Index = g.p.length / 3 > 65535 ? Uint32Array : Uint16Array;
      geo.setIndex(new THREE.BufferAttribute(new Index(g.i), 1));
      builder.put(geo, mat);
    }
  }
  return { face, flush };
}

const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// Scattered office panes. A linear modulus lined them up on diagonals.
function litPane(floor, bay) {
  const h = Math.imul(floor + 3, 0x9e3779b1) ^ Math.imul(bay + 11, 0x85ebca6b);
  return (h >>> 0) % 19 === 0;
}

function clipHeights(y0, y1, top0, top1) {
  if (y0 >= top0 - 0.03 && y0 >= top1 - 0.03) return null;
  const b0 = y0, b1 = y0;
  const t0 = Math.min(y1, top0), t1 = Math.min(y1, top1);
  if (t0 < b0 + 0.04 && t1 < b1 + 0.04) return null;
  return [b0, b1, Math.max(b0 + 0.02, t0), Math.max(b1 + 0.02, t1)];
}

/** Vertical curtain wall along a plan edge. yAt(planPoint) is the roof line. */
function curtain(batch, spec, a, b, yAt, outward, street) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
  const yTop = (s) => yAt([a[0] + dx * (s / L), a[1] + dz * (s / L)]);
  const at = (s, y) => [a[0] + dx * (s / L), y, a[1] + dz * (s / L)];
  const hint = [outward[0], 0, outward[1]];
  const n = Math.max(1, Math.round(L / spec.bay));
  const w = L / n, mw = Math.min(spec.mullion, w * 0.42);
  const band = PITCH * spec.band;
  const emit = (mat, s0, s1, y0, y1) => {
    const h = clipHeights(y0, y1, yTop(s0), yTop(s1));
    if (!h) return;
    const pts = [at(s0, h[0]), at(s1, h[1]), at(s1, h[3]), at(s0, h[2])];
    if (h[2] < h[0] + 0.05) batch.face(mat, [pts[0], pts[1], pts[2]], hint);
    else if (h[3] < h[1] + 0.05) batch.face(mat, [pts[0], pts[1], pts[3]], hint);
    else batch.face(mat, pts, hint);
  };
  for (let i = 0; i <= n; i++) {
    const c = i * w;
    const s0 = Math.max(0, c - mw / 2), s1 = Math.min(L, c + mw / 2);
    if (s1 - s0 > 0.02) emit('mullion', s0, s1, 0, RIDGE + 2);
  }
  for (let i = 0; i < n; i++) {
    const s0 = Math.min(L, i * w + mw / 2), s1 = Math.max(0, (i + 1) * w - mw / 2);
    if (s1 - s0 < 0.05) continue;
    let floor = 0;
    for (let y = 0; y < RIDGE + 0.01; y += band, floor++) {
      emit('mullion', s0, s1, y, y + spec.spandrel);
      let mat = 'glass';
      if (street && floor === 0 && i > n * 0.2 && i < n * 0.8) mat = 'lobby';
      else if (floor > 1 && litPane(floor, i)) mat = 'light';
      emit(mat, s0, s1, y + spec.spandrel, y + band);
    }
  }
}

function canopy(batch, a, b, outward) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
  const s0 = L * 0.32, s1 = L * 0.68, y = 4.15, reach = 0.6, thick = 0.14;
  const at = (s, y, out) => [a[0] + dx * (s / L) + outward[0] * out, y, a[1] + dz * (s / L) + outward[1] * out];
  const q = (y0, y1, out0, out1, hint) => batch.face('mullion', [at(s0, y0, out0), at(s1, y0, out1), at(s1, y1, out1), at(s0, y1, out0)], hint);
  q(y, y, reach, reach, [0, 1, 0]);
  q(y - thick, y - thick, reach, reach, [0, -1, 0]);
  batch.face('mullion', [at(s0, y - thick, reach), at(s1, y - thick, reach), at(s1, y, reach), at(s0, y, reach)], [outward[0], 0, outward[1]]);
}

function skillion(batch, spec, tower, drop) {
  const { slot, ring } = tower;
  const n = ring.length;
  const partner = (end, otherEnd) => {
    const i = ring.indexOf(end);
    const nxt = ring[(i + 1) % n], prv = ring[(i - 1 + n) % n];
    return nxt === otherEnd ? prv : nxt;
  };
  // Each slot end shares a leg with exactly one street corner.
  const streetA = partner(slot.a, slot.b), streetB = partner(slot.b, slot.a);
  const along = Math.hypot(slot.b[0] - slot.a[0], slot.b[1] - slot.a[1]);
  const nu = Math.max(2, Math.round(along / spec.roofBay));
  const nv = Math.max(2, Math.round(tower.rise / spec.roofBay));
  const P = (u, v) => {
    const s = lerp2(slot.a, slot.b, u);
    const t = lerp2(streetA, streetB, u);
    const p = lerp2(s, t, v);
    return [p[0], tower.height(p) - drop, p[1]];
  };
  const hint = [0, drop ? -1 : 1, 0];
  const du = 1 / nu, dv = 1 / nv;
  const cellW = along / nu;
  const uFrac = Math.min(0.28, spec.mullion / cellW);
  const cell = (mat, u0, u1, v0, v1) => {
    if (u1 - u0 < 1e-4 || v1 - v0 < 1e-4) return;
    batch.face(mat, [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)], hint);
  };
  for (let i = 0; i <= nu; i++) {
    const u = i * du, half = (uFrac * du) / 2;
    cell('mullion', Math.max(0, u - half), Math.min(1, u + half), 0, 1);
  }
  for (let i = 0; i < nu; i++) {
    const u0 = i * du + (uFrac * du) / 2, u1 = (i + 1) * du - (uFrac * du) / 2;
    for (let j = 0; j < nv; j++) {
      const v0 = j * dv, v1 = (j + 1) * dv, g = dv * 0.1;
      cell('mullion', u0, u1, v0, Math.min(v1, v0 + g));
      cell('glass', u0, u1, v0 + g, v1);
    }
  }
}

function ruled(batch, spec, court, soffit) {
  const { ridgeA, ridgeB, outerA, outerB } = court;
  const along = Math.hypot(outerB[0] - outerA[0], outerB[1] - outerA[1]);
  const run = Math.hypot((outerA[0] + outerB[0]) / 2 - (ridgeA[0] + ridgeB[0]) / 2, (outerA[1] + outerB[1]) / 2 - (ridgeA[1] + ridgeB[1]) / 2);
  const nu = Math.max(2, Math.round(Math.max(along, 4) / spec.courtBay));
  const nv = Math.max(2, Math.round(Math.max(run, 4) / spec.courtBay));
  const drop = soffit ? 0.62 : 0;
  const P = (u, v) => {
    const r = lerp2(ridgeA, ridgeB, u);
    const o = lerp2(outerA, outerB, u);
    const p = lerp2(r, o, v);
    const y = ATRIUM + (ENTRY - ATRIUM) * v - drop;
    return [p[0], y, p[1]];
  };
  const hint = [0, soffit ? -1 : 1, 0];
  const du = 1 / nu, dv = 1 / nv;
  const f = du * 0.1, g = dv * 0.1;
  const cell = (mat, u0, u1, v0, v1) => {
    if (u1 - u0 < 1e-4 || v1 - v0 < 1e-4) return;
    batch.face(mat, [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)], hint);
  };
  for (let i = 0; i <= nu; i++) {
    const u = i * du;
    cell('frame', Math.max(0, u - f / 2), Math.min(1, u + f / 2), 0, 1);
  }
  for (let i = 0; i < nu; i++) {
    const u0 = i * du + f / 2, u1 = (i + 1) * du - f / 2;
    for (let j = 0; j < nv; j++) {
      const v0 = j * dv, v1 = (j + 1) * dv;
      cell('frame', u0, u1, v0, Math.min(v1, v0 + g));
      cell('atrium', u0, u1, v0 + g, v1);
    }
  }
}

function entryWall(batch, spec, a, b, outward) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
  const n = Math.max(2, Math.round(L / spec.courtBay));
  const w = L / n, rows = 2, rh = ENTRY / rows;
  const at = (s, y) => [a[0] + dx * (s / L), y, a[1] + dz * (s / L)];
  const hint = [outward[0], 0, outward[1]];
  const f = w * 0.08;
  for (let i = 0; i <= n; i++) {
    const c = i * w;
    const s0 = Math.max(0, c - f / 2), s1 = Math.min(L, c + f / 2);
    batch.face('frame', [at(s0, 0), at(s1, 0), at(s1, ENTRY), at(s0, ENTRY)], hint);
  }
  for (let i = 0; i < n; i++) {
    const s0 = i * w + f / 2, s1 = (i + 1) * w - f / 2;
    for (let r = 0; r < rows; r++) {
      const y0 = r * rh, y1 = (r + 1) * rh, g = rh * 0.1;
      batch.face('frame', [at(s0, y0), at(s1, y0), at(s1, y0 + g), at(s0, y0 + g)], hint);
      const mat = r === 0 && i > n * 0.3 && i < n * 0.7 ? 'lobby' : 'atrium';
      batch.face(mat, [at(s0, y0 + g), at(s1, y0 + g), at(s1, y1), at(s0, y1)], hint);
    }
  }
}

function outwardOf(a, b, awayFrom) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
  let px = -dz / L, pz = dx / L;
  const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
  if (px * (awayFrom[0] - mx) + pz * (awayFrom[1] - mz) > 0) { px = -px; pz = -pz; }
  return [px, pz];
}

export function buildPennzoil(builder, detail) {
  const S = solve();
  const spec = DETAIL[detail] || DETAIL.near;
  const batcher = batch();
  const throatMid = [(S.throat.a[0] + S.throat.b[0]) / 2, (S.throat.a[1] + S.throat.b[1]) / 2];
  for (const tower of [S.louisiana, S.milam]) {
    const { street, slot, legs, height, streetOut, slotOut } = tower;
    curtain(batcher, spec, street.a, street.b, height, streetOut, true);
    curtain(batcher, spec, slot.a, slot.b, height, slotOut, false);
    const cen = towerCentroid(tower);
    for (const leg of legs) {
      curtain(batcher, spec, leg.a, leg.b, height, outwardOf(leg.a, leg.b, cen), false);
    }
    canopy(batcher, street.a, street.b, streetOut);
    skillion(batcher, spec, tower, 0);
    skillion(batcher, spec, tower, 0.45);
  }
  for (const court of [S.south, S.north]) {
    ruled(batcher, spec, court, false);
    ruled(batcher, spec, court, true);
    const out = outwardOf(court.outerA, court.outerB, throatMid);
    entryWall(batcher, spec, court.outerA, court.outerB, out);
  }
  batcher.flush(builder);
  const sample = (tower) => {
    const high = tower.height(tower.street.a) >= tower.height(tower.street.b) ? tower.street.a : tower.street.b;
    return {
      eave: tower.eave,
      rise: tower.rise,
      bearing: tower.streetBearing,
      high: [high[0], tower.height(high), high[1]],
      streetMid: (() => { const m = midPoint(tower.street.a, tower.street.b); return [m[0], tower.height(m), m[1]]; })(),
      slotMid: (() => { const m = midPoint(tower.slot.a, tower.slot.b); return [m[0], tower.eave, m[1]]; })(),
      out: tower.streetOut,
      slotOut: tower.slotOut,
    };
  };
  return {
    ridge: RIDGE,
    slot: S.slot,
    atrium: ATRIUM,
    entry: ENTRY,
    louisiana: sample(S.louisiana),
    milam: sample(S.milam),
    throat: { a: [...S.throat.a], b: [...S.throat.b], mid: throatMid },
    // Ridge members of the two pyramids. Each end is a throat corner, which
    // sits on that tower's slot wall; the span crosses the open court.
    members: [
      { name: 'atrium-ridge', a: [S.throat.a[0], ATRIUM, S.throat.a[1]], b: [S.throat.b[0], ATRIUM, S.throat.b[1]] },
    ],
  };
}

function towerCentroid(tower) {
  let x = 0, z = 0;
  for (const p of tower.ring) { x += p[0]; z += p[1]; }
  return [x / tower.ring.length, z / tower.ring.length];
}
function midPoint(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
