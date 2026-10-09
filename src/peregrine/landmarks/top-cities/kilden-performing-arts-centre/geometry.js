import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  LENGTH, ALONG, LAND, WATER, ROOF, GLASS_DEPTH, LIP_KEYS, END,
  lipHeight, place, depthOf, skinPoint, soffitPoint, sectionUp, HALL,
} from './kilden-performing-arts-centre-plan.js';

const span = LENGTH - 2 * END;

function tOf(along) { return (along - END) / span; }

function withKeys(n) {
  const s = new Set(LIP_KEYS.map(([t]) => t));
  for (let i = 0; i < n; i++) s.add(i / (n - 1));
  return [...s].sort((a, b) => a - b);
}

function depthUs(n) {
  const u = [];
  for (let i = 0; i < n; i++) u.push(Math.pow(i / (n - 1), 1.45));
  u[0] = 0;
  u[n - 1] = 1;
  return u;
}

function facing(a, b, c, toward) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
  return n[0] * toward[0] + n[1] * toward[1] + n[2] * toward[2] >= 0;
}

function tri(pos, idx, a, b, c, toward) {
  if (!facing(a, b, c, toward)) [b, c] = [c, b];
  const i = pos.length / 3;
  pos.push(...a, ...b, ...c);
  idx.push(i, i + 1, i + 2);
}

function quad(pos, idx, a, b, c, d, toward) {
  tri(pos, idx, a, b, c, toward);
  tri(pos, idx, a, c, d, toward);
}

function putMesh(b, pos, idx, material) {
  if (idx.length < 3) return;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  b.put(g, material);
}

function outward(a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
  let nx = dz / L, nz = -dx / L;
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const inside = place(LENGTH * 0.5, 52);
  if ((inside[0] - mid[0]) * nx + (inside[1] - mid[1]) * nz > 0) { nx = -nx; nz = -nz; }
  return [nx, nz];
}

function proud3(up, sign) {
  // Section "up" is (depth component, y). sign +1 faces the top skin, -1 the soffit.
  return [LAND[0] * up.nd * sign, up.ny * sign, LAND[1] * up.nd * sign];
}

// One indexed grid. Vertices are shared so the oak shades as a single curtain
// instead of a stack of flat bands. Winding is constant along the parameter.
function pushGrid(pos, idx, pts, soffit) {
  const nS = pts.length, nK = pts[0].length;
  const base = pos.length / 3;
  for (let s = 0; s < nS; s++) for (let k = 0; k < nK; k++) pos.push(pts[s][k][0], pts[s][k][1], pts[s][k][2]);
  const id = (s, k) => base + s * nK + k;
  for (let s = 0; s < nS - 1; s++) for (let k = 0; k < nK - 1; k++) {
    const a = id(s, k), b = id(s + 1, k), c = id(s + 1, k + 1), d = id(s, k + 1);
    if (soffit) idx.push(a, c, b, a, d, c);
    else idx.push(a, b, c, a, c, d);
  }
}

function pushStrip(pos, idx, left, right, toward) {
  const base = pos.length / 3;
  for (let k = 0; k < left.length; k++) pos.push(left[k][0], left[k][1], left[k][2], right[k][0], right[k][1], right[k][2]);
  const flip = left.length > 1 && !facing(left[0], left[1], right[1], toward);
  for (let k = 0; k < left.length - 1; k++) {
    const i = base + k * 2;
    if (flip) idx.push(i, i + 3, i + 2, i, i + 1, i + 3);
    else idx.push(i, i + 2, i + 3, i, i + 3, i + 1);
  }
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const oak = [], oakIdx = [];
  const oakLine = [], oakLineIdx = [];
  const metal = [], metalIdx = [];
  const seam = [], seamIdx = [];
  const frame = [], frameIdx = [];
  const glow = [], glowIdx = [];

  const ts = withKeys(near ? 96 : 60);
  const us = depthUs(near ? 20 : 14);
  const A = ts.map((t) => END + t * span);
  const soffit = A.map((along) => us.map((u) => soffitPoint(along, u)));
  const skin = A.map((along) => us.map((u) => skinPoint(along, u)));
  const S = A.length, K = us.length;

  pushGrid(oak, oakIdx, soffit, true);
  pushGrid(oak, oakIdx, skin, false);

  for (let s = 0; s < S - 1; s++) {
    quad(oak, oakIdx, soffit[s][0], soffit[s + 1][0], skin[s + 1][0], skin[s][0], [WATER[0], -0.15, WATER[1]]);
    quad(oak, oakIdx, skin[s][K - 1], skin[s + 1][K - 1], soffit[s + 1][K - 1], soffit[s][K - 1], [LAND[0], 0.1, LAND[1]]);
  }
  for (const s of [0, S - 1]) {
    const hint = s === 0 ? [-ALONG[0], 0.1, -ALONG[1]] : [ALONG[0], 0.1, ALONG[1]];
    for (let k = 0; k < K - 1; k++) quad(oak, oakIdx, skin[s][k], skin[s][k + 1], soffit[s][k + 1], soffit[s][k], hint);
  }

  // Boards run lip-to-back and stop short of the lip, the hall and both ends,
  // so the silhouette stays the shell and the end view is not a row of teeth.
  if (near) {
    const ribbon = (fn, sign, spacing, lift) => {
      const margin = 1.4;
      const n = Math.max(1, Math.floor((span - 2 * margin) / spacing));
      const w = 0.045;
      const u0 = 0.06, u1 = 0.94, nU = 10;
      for (let i = 0; i < n; i++) {
        const along = END + margin + (i + 0.5) * ((span - 2 * margin) / n);
        const lip = lipHeight(tOf(along));
        const left = [], right = [];
        for (let k = 0; k < nU; k++) {
          const u = u0 + (u1 - u0) * (k / (nU - 1));
          const p = fn(along, u);
          const pr = proud3(sectionUp(u, lip), sign);
          const pm = Math.hypot(pr[0], pr[1], pr[2]) || 1;
          const px = pr[0] / pm, py = pr[1] / pm, pz = pr[2] / pm;
          left.push([p[0] - ALONG[0] * w + px * lift, p[1] + py * lift, p[2] - ALONG[1] * w + pz * lift]);
          right.push([p[0] + ALONG[0] * w + px * lift, p[1] + py * lift, p[2] + ALONG[1] * w + pz * lift]);
        }
        const mid = sectionUp(0.4, lip);
        pushStrip(oakLine, oakLineIdx, left, right, proud3(mid, sign));
      }
    };
    ribbon(soffitPoint, -1, 0.58, 0.055);
    ribbon(skinPoint, 1, 1.05, 0.04);
  }

  // Pleated dark cladding. The harbour cut is left open for the glass.
  for (let i = 0; i < HALL.length; i++) {
    const a = HALL[i], c = HALL[(i + 1) % HALL.length];
    if ((depthOf(a) + depthOf(c)) / 2 < GLASS_DEPTH + 0.3) continue;
    const dx = c[0] - a[0], dz = c[1] - a[1], L = Math.hypot(dx, dz);
    if (L < 0.3) continue;
    const ux = dx / L, uz = dz / L;
    const [nx, nz] = outward(a, c);
    let nSeg = Math.max(2, Math.round(L / (near ? 7.4 : 15)));
    if (nSeg % 2) nSeg += 1;
    const amp = 0.28, inset = 0.45;
    const line = [];
    for (let s = 0; s <= nSeg; s++) {
      const inn = inset + (s % 2 ? amp : 0);
      line.push([a[0] + ux * L * s / nSeg - nx * inn, a[1] + uz * L * s / nSeg - nz * inn]);
    }
    for (let s = 0; s < nSeg; s++) {
      const p = line[s], q = line[s + 1];
      quad(metal, metalIdx, [p[0], 0, p[1]], [q[0], 0, q[1]], [q[0], ROOF, q[1]], [p[0], ROOF, p[1]], [nx, 0, nz]);
      if (!near) continue;
      const face = outward(p, q);
      for (let y = 3.15; y < ROOF - 0.5; y += 3.15) {
        const o = 0.14;
        quad(seam, seamIdx,
          [p[0] + face[0] * o, y, p[1] + face[1] * o],
          [q[0] + face[0] * o, y, q[1] + face[1] * o],
          [q[0] + face[0] * o, y + 0.07, q[1] + face[1] * o],
          [p[0] + face[0] * o, y + 0.07, p[1] + face[1] * o],
          [face[0], 0, face[1]]);
      }
    }
  }

  {
    const c = HALL.reduce((s, p) => [s[0] + p[0], s[1] + p[1]], [0, 0]).map((v) => v / HALL.length);
    let roof = HALL.map((p) => {
      const dx = c[0] - p[0], dz = c[1] - p[1], L = Math.hypot(dx, dz) || 1;
      return [p[0] + (dx / L) * 0.9, p[1] + (dz / L) * 0.9];
    });
    let area = 0;
    for (let i = 0; i < roof.length; i++) {
      const q = roof[(i + 1) % roof.length];
      area += roof[i][0] * q[1] - q[0] * roof[i][1];
    }
    if (area < 0) roof = roof.slice().reverse();
    const tris = THREE.ShapeUtils.triangulateShape(roof.map((p) => new THREE.Vector2(p[0], p[1])), []);
    const y = ROOF - 0.4;
    for (const [i, j, m] of tris) {
      tri(metal, metalIdx,
        [roof[i][0], y, roof[i][1]], [roof[j][0], y, roof[j][1]], [roof[m][0], y, roof[m][1]],
        [0, 1, 0]);
    }
  }

  const alongOf = (p) => (p[0] - place(0, 0)[0]) * ALONG[0] + (p[1] - place(0, 0)[1]) * ALONG[1];
  let g0 = END, g1 = LENGTH - END;
  const cuts = [];
  for (let i = 0; i < HALL.length; i++) {
    const a = HALL[i], c = HALL[(i + 1) % HALL.length];
    if ((depthOf(a) + depthOf(c)) / 2 < GLASS_DEPTH + 0.3) cuts.push(a, c);
  }
  if (cuts.length) {
    const as = cuts.map(alongOf);
    g0 = Math.min(...as) + 0.12;
    g1 = Math.max(...as) - 0.12;
  }
  const head = ROOF - 1.15 - 0.2;
  const glassDepth = GLASS_DEPTH - 0.08;
  const bay = near ? 1.9 : 5.8;
  const nBay = Math.max(2, Math.round((g1 - g0) / bay));
  for (let i = 0; i < nBay; i++) {
    const a0 = g0 + (g1 - g0) * (i / nBay);
    const a1 = g0 + (g1 - g0) * ((i + 1) / nBay);
    const p = place(a0, glassDepth), q = place(a1, glassDepth);
    quad(glow, glowIdx, [p[0], 0.4, p[1]], [q[0], 0.4, q[1]], [q[0], head, q[1]], [p[0], head, p[1]], [WATER[0], 0, WATER[1]]);
  }

  const beam = (p, q, across, proud, w, d) => {
    const cnr = (pt, su, pu) => [
      pt[0] + across[0] * su * w + proud[0] * pu * d,
      pt[1] + across[1] * su * w + proud[1] * pu * d,
      pt[2] + across[2] * su * w + proud[2] * pu * d,
    ];
    const ring = [cnr(p, -1, 0), cnr(p, 1, 0), cnr(q, 1, 0), cnr(q, -1, 0)];
    const outer = [cnr(p, -1, 1), cnr(p, 1, 1), cnr(q, 1, 1), cnr(q, -1, 1)];
    quad(frame, frameIdx, outer[1], outer[2], outer[3], outer[0], proud);
    quad(frame, frameIdx, ring[0], ring[3], ring[2], ring[1], [-proud[0], -proud[1], -proud[2]]);
    quad(frame, frameIdx, ring[1], outer[1], outer[2], ring[2], across);
    quad(frame, frameIdx, outer[0], ring[0], ring[3], outer[3], [-across[0], -across[1], -across[2]]);
  };
  const acrossU = [ALONG[0], 0, ALONG[1]];
  const proudW = [WATER[0], 0, WATER[1]];
  const mw = near ? 0.055 : 0.09, md = near ? 0.16 : 0.2;
  for (let i = 0; i <= nBay; i++) {
    const a = g0 + (g1 - g0) * (i / nBay);
    const p = place(a, glassDepth - 0.02);
    beam([p[0], 0.4, p[1]], [p[0], head, p[1]], acrossU, proudW, mw, md);
  }
  for (const y of (near ? [2.6, 5.4, 8.2, 11.0, 13.8, 16.6] : [4.4, 9.6, 14.8])) {
    for (let i = 0; i < nBay; i++) {
      const a0 = g0 + (g1 - g0) * (i / nBay);
      const a1 = g0 + (g1 - g0) * ((i + 1) / nBay);
      const p = place(a0, glassDepth - 0.02), q = place(a1, glassDepth - 0.02);
      beam([p[0], y, p[1]], [q[0], y, q[1]], [0, 1, 0], proudW, near ? 0.05 : 0.08, md);
    }
  }
  {
    const p = place(g0, glassDepth - 0.34), q = place(g1, glassDepth - 0.34);
    const p2 = place(g0, glassDepth + 0.02), q2 = place(g1, glassDepth + 0.02);
    quad(metal, metalIdx, [p[0], 0, p[1]], [q[0], 0, q[1]], [q[0], 0.4, q[1]], [p[0], 0.4, p[1]], [WATER[0], 0, WATER[1]]);
    quad(metal, metalIdx, [p2[0], 0.4, p2[1]], [q2[0], 0.4, q2[1]], [q[0], 0.4, q[1]], [p[0], 0.4, p[1]], [0, 1, 0]);
  }

  putMesh(b, oak, oakIdx, 'oak');
  if (near) putMesh(b, oakLine, oakLineIdx, 'oakLine');
  putMesh(b, metal, metalIdx, 'metal');
  if (near) putMesh(b, seam, seamIdx, 'seam');
  putMesh(b, frame, frameIdx, 'frame');
  putMesh(b, glow, glowIdx, 'glow');
  return b.finish();
}
