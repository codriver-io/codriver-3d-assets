// Class I icosahedral geodesic. Reunion Tower's ball is described as an eight-frequency
// icosahedron (Dallas Morning News, 2015) whose strut joints carry the light housings.
// Frequency 1 is the icosahedron (12 vertices). Vertices are unit-sphere, +Y at a
// pentagon vertex, so the tower's crown sits on a node.
import * as THREE from 'three';

const PHI = (1 + Math.sqrt(5)) / 2;
const RAW = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
].map((v) => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
});

// Outward faces of the unit icosahedron (checked again below; a reversed triple is swapped).
const FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

function outward(faces) {
  return faces.map(([a, b, c]) => {
    const va = RAW[a], vb = RAW[b], vc = RAW[c];
    const ab = [vb[0] - va[0], vb[1] - va[1], vb[2] - va[2]];
    const ac = [vc[0] - va[0], vc[1] - va[1], vc[2] - va[2]];
    const nx = ab[1] * ac[2] - ab[2] * ac[1];
    const ny = ab[2] * ac[0] - ab[0] * ac[2];
    const nz = ab[0] * ac[1] - ab[1] * ac[0];
    const dot = nx * (va[0] + vb[0] + vc[0]) + ny * (va[1] + vb[1] + vc[1]) + nz * (va[2] + vb[2] + vc[2]);
    return dot >= 0 ? [a, b, c] : [a, c, b];
  });
}

const cache = new Map();

// `{ verts, edges }` on the unit sphere. `minNy` drops the south cap so the basket stays
// open around the concrete shafts (a full sphere would cut through them).
export function geodesic(freq, minNy = -1) {
  const key = freq + ':' + minNy;
  if (cache.has(key)) return cache.get(key);
  const faces = outward(FACES);
  const verts = [];
  const index = new Map();
  const add = (x, y, z) => {
    const l = Math.hypot(x, y, z);
    x /= l; y /= l; z /= l;
    const k = `${Math.round(x * 1e5)},${Math.round(y * 1e5)},${Math.round(z * 1e5)}`;
    let i = index.get(k);
    if (i === undefined) { i = verts.length; verts.push([x, y, z]); index.set(k, i); }
    return i;
  };
  const edgeSet = new Set();
  const link = (a, b) => {
    if (a === b) return;
    edgeSet.add(a < b ? `${a}:${b}` : `${b}:${a}`);
  };
  for (const [ia, ib, ic] of faces) {
    const A = RAW[ia], B = RAW[ib], C = RAW[ic];
    const grid = [];
    for (let i = 0; i <= freq; i++) {
      grid[i] = [];
      for (let j = 0; j <= freq - i; j++) {
        const k = freq - i - j;
        grid[i][j] = add(
          (A[0] * k + B[0] * i + C[0] * j) / freq,
          (A[1] * k + B[1] * i + C[1] * j) / freq,
          (A[2] * k + B[2] * i + C[2] * j) / freq,
        );
      }
    }
    for (let i = 0; i < freq; i++) {
      for (let j = 0; j < freq - i; j++) {
        const v00 = grid[i][j], v10 = grid[i + 1][j], v01 = grid[i][j + 1];
        link(v00, v10); link(v10, v01); link(v01, v00);
        if (i + j < freq - 1) {
          const v11 = grid[i + 1][j + 1];
          link(v10, v11); link(v11, v01);
        }
      }
    }
  }
  let top = 0;
  for (let i = 1; i < verts.length; i++) if (verts[i][1] > verts[top][1]) top = i;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(...verts[top]), new THREE.Vector3(0, 1, 0));
  const spun = verts.map(([x, y, z]) => {
    const p = new THREE.Vector3(x, y, z).applyQuaternion(q);
    return [p.x, p.y, p.z];
  });
  const keep = spun.map((v) => v[1] >= minNy - 1e-6);
  const edges = [];
  for (const s of edgeSet) {
    const [a, b] = s.split(':').map(Number);
    if (keep[a] && keep[b]) edges.push([a, b]);
  }
  const result = { verts: spun, edges, keep };
  cache.set(key, result);
  return result;
}
