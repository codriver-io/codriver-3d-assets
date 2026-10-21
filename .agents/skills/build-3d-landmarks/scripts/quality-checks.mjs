// Conservative geometry-only review candidates; host terrain and visual QA remain separate.
import * as THREE from 'three';
const WINDOW = /glass|glaz|window|fenestr|glow/i;
const MEMBER = /cable|stay|hanger|suspender|rail|beam|girder|walkway/i;
const median = (xs) => xs.length ? xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)] : 0;
const at = (v) => v.toArray().map((x) => +x.toFixed(2));

// Compare outward vertical window faces in eight bearing bins. Counts alone do not fail:
// a coarse grid is valid. Require lost coverage, oversized panes or excessive dark area too.
export function windowFacades(tris) {
  const bins = new Map();
  for (const t of tris) {
    if (Math.abs(t.n.y) > 0.2) continue;
    const key = (Math.round(Math.atan2(t.n.z, t.n.x) * 4 / Math.PI) + 8) % 8;
    const r = bins.get(key) || { area: 0, windowArea: 0, faces: 0, heights: [], widths: [] };
    r.area += t.area;
    if (WINDOW.test(t.mat || '')) {
      const ps = [t.a, t.b, t.c], u = new THREE.Vector3(-t.n.z, 0, t.n.x).normalize();
      r.windowArea += t.area; r.faces++;
      r.heights.push(Math.max(...ps.map(p => p.y)) - Math.min(...ps.map(p => p.y)));
      r.widths.push(Math.max(...ps.map(p => p.dot(u))) - Math.min(...ps.map(p => p.dot(u))));
    }
    bins.set(key, r);
  }
  return [...bins].map(([bearingBin, r]) => ({ bearingBin, faces: r.faces, windowAreaM2: +r.windowArea.toFixed(2), areaShare: r.windowArea / Math.max(r.area, 1), medianHeightM: median(r.heights), medianWidthM: median(r.widths) }));
}
export function windowRhythm(near, far) {
  const flags = [];
  for (const n of near) {
    if (n.faces < 32 || n.windowAreaM2 < 10) continue;
    const f = far.find(r => r.bearingBin === n.bearingBin) || { faces: 0, windowAreaM2: 0, areaShare: 0, medianHeightM: 0, medianWidthM: 0 };
    const countRatio = f.faces / n.faces, reasons = [];
    if (f.windowAreaM2 < n.windowAreaM2 * 0.15) reasons.push('window coverage lost');
    if (countRatio < 0.35) {
      if (f.medianHeightM > Math.max(6, n.medianHeightM * 3)) reasons.push('tall window stripes');
      if (f.medianWidthM > Math.max(10, n.medianWidthM * 4)) reasons.push('wide window bands');
      if (f.areaShare > Math.max(0.45, n.areaShare * 2.5)) reasons.push('excessive window area');
    }
    if (reasons.length) flags.push({ bearingBin: n.bearingBin, reasons, near: n, far: f });
  }
  return { facades: flags.length, flags };
}

// Split same-material triangles into welded components: exporters merge many cables in one mesh.
function components(tris) {
  const parent = tris.map((_, i) => i), seen = new Map();
  const find = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  tris.forEach((t, i) => { for (const p of [t.a, t.b, t.c]) {
    const key = t.mat + ':' + p.toArray().map(x => Math.round(x * 1e4)).join(',');
    if (seen.has(key)) parent[find(i)] = find(seen.get(key)); else seen.set(key, i);
  } });
  const groups = new Map();
  tris.forEach((t, i) => { const k = find(i); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i); });
  return [...groups.values()];
}
export function memberEnds(tris, { contactM = 0.75, groundY = 0 } = {}) {
  // Spatial hash of triangle bounds; large surfaces stay in a short fallback list.
  const cell = 4, grid = new Map(), large = [], boxes = [], triangle = new THREE.Triangle();
  const xyz = ['x', 'y', 'z'];
  tris.forEach((t, i) => {
    const b = new THREE.Box3().setFromPoints([t.a, t.b, t.c]); boxes.push(b);
    const lo = xyz.map(k => Math.floor(b.min[k] / cell)), hi = xyz.map(k => Math.floor(b.max[k] / cell));
    if (hi.reduce((n, x, k) => n * (x - lo[k] + 1), 1) > 512) { large.push(i); return; }
    for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) {
      const k = `${x},${y},${z}`; if (!grid.has(k)) grid.set(k, []); grid.get(k).push(i);
    }
  });
  const flags = []; let tested = 0;
  for (const ids of components(tris)) {
    const mat = tris[ids[0]].mat || '';
    if (!MEMBER.test(mat)) continue;
    const points = [...new Map(ids.flatMap(i => [tris[i].a, tris[i].b, tris[i].c]).map(p => [p.toArray().map(x => Math.round(x * 1e4)).join(','), p])).values()];
    const center = points.reduce((v, p) => v.add(p), new THREE.Vector3()).divideScalar(points.length);
    const box = new THREE.Box3().setFromPoints(points), size = box.getSize(new THREE.Vector3());
    let axis = new THREE.Vector3().setComponent(size.toArray().indexOf(Math.max(size.x, size.y, size.z)), 1);
    // Principal axis avoids diagonal-member axis-aligned box false negatives.
    for (let k = 0; k < 12; k++) { const next = new THREE.Vector3(); for (const p of points) { const q = p.clone().sub(center); next.addScaledVector(q, q.dot(axis)); } if (next.lengthSq() < 1e-12) break; axis = next.normalize(); }
    const ds = points.map(p => p.clone().sub(center).dot(axis)), lo = ds.reduce((a, b) => Math.min(a, b), Infinity), hi = ds.reduce((a, b) => Math.max(a, b), -Infinity), length = hi - lo;
    const radius = points.reduce((r, p, i) => Math.max(r, p.clone().sub(center).addScaledVector(axis, -ds[i]).length()), 0);
    if (length < 4 || radius > 1.5 || length / Math.max(radius * 2, 0.01) < 12) continue;
    tested++; const own = new Set(ids), tolerance = Math.max(contactM, radius * 1.5);
    for (const end of [lo, hi]) {
      const cap = points.filter((_, i) => Math.abs(ds[i] - end) < Math.max(0.02, length * 0.001));
      const p = cap.reduce((v, q) => v.add(q), new THREE.Vector3()).divideScalar(cap.length);
      if (p.y <= groundY + tolerance) continue; // actual DEM contact is a host check
      const candidates = new Set(large), lower = xyz.map(k => Math.floor((p[k] - tolerance) / cell)), upper = xyz.map(k => Math.floor((p[k] + tolerance) / cell));
      for (let x = lower[0]; x <= upper[0]; x++) for (let y = lower[1]; y <= upper[1]; y++) for (let z = lower[2]; z <= upper[2]; z++) for (const i of grid.get(`${x},${y},${z}`) || []) candidates.add(i);
      let distance = Infinity;
      for (const i of candidates) {
        if (own.has(i) || boxes[i].distanceToPoint(p) > tolerance) continue;
        const t = tris[i]; triangle.set(t.a, t.b, t.c);
        distance = Math.min(distance, triangle.closestPointToPoint(p, new THREE.Vector3()).distanceTo(p));
      }
      if (distance > tolerance) flags.push({ material: mat, at: at(p), lengthM: +length.toFixed(1), contactM: +tolerance.toFixed(2) });
    }
  }
  return { tested, ends: flags.length, flags };
}

// GLB extras every load parses and a host keeps on its objects. QA-only data (contacts, supports)
// belongs on non-enumerable userData; asset.extras (license metadata) is expected and excluded.
export function extrasBytes(json) {
  const keys = new Map(); let bytes = 0;
  const walk = (o, path) => {
    if (!o || typeof o !== 'object') return;
    for (const [k, v] of Object.entries(o)) {
      if (k === 'extras' && path !== 'asset') {
        bytes += JSON.stringify(v).length;
        if (v && typeof v === 'object') for (const [ek, ev] of Object.entries(v)) keys.set(ek, (keys.get(ek) || 0) + JSON.stringify(ev).length);
      } else walk(v, path ? path + '.' + k : k);
    }
  };
  walk(json, '');
  const top = [...keys].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([key, n]) => ({ key, kb: +(n / 1024).toFixed(1) }));
  return { bytes, top };
}

// Smooth-shading skew: a vertex normal pointing behind its own face (vertices shared with a hidden
// face, back-to-back faces sharing vertices, inverted normals) renders slopes as dark, rounded
// loaves. Area-weighted smoothing of box edges stays under 90° and is not counted.
export function shadingSkew(tris, { maxDeg = 90 } = {}) {
  const cos = Math.cos(maxDeg * Math.PI / 180), byMat = new Map(); let area = 0;
  for (const t of tris) {
    if (!t.vn) continue;
    const e = byMat.get(t.mat) || { material: t.mat, area: 0, skewed: 0, at: null, max: 0 };
    e.area += t.area;
    if (t.vn.some((v) => v.dot(t.n) < cos)) {
      e.skewed += t.area; area += t.area;
      if (t.area > e.max) { e.max = t.area; e.at = at(t.a.clone().add(t.b).add(t.c).divideScalar(3)); }
    }
    byMat.set(t.mat, e);
  }
  const top = [...byMat.values()].filter((e) => e.skewed > 0).sort((a, b) => b.skewed - a.skewed).slice(0, 3)
    .map((e) => ({ material: e.material, areaM2: +e.skewed.toFixed(1), share: +(e.skewed / e.area).toFixed(2), at: e.at }));
  return { areaM2: Math.round(area), top };
}

// Up-facing faces lying on local grade: the host draws its own ground at y = 0, so these
// z-fight with it (or vanish under it). Grade features stand at least 0.1 m proud.
// Road surfaces are exempt: the host fits or replaces authored approach pavement (bridgeLift, HD roads).
const ROAD = /asphalt|pavement|road|lane|marking|paint|stripe/i;
export function gradeFaces(tris, { band = 0.05, minUp = 0.9 } = {}) {
  const byMat = new Map(); let area = 0;
  for (const t of tris) {
    if (t.n.y < minUp || ROAD.test(t.mat || '') || [t.a, t.b, t.c].some((p) => Math.abs(p.y) > band)) continue;
    area += t.area;
    const e = byMat.get(t.mat) || { material: t.mat, areaM2: 0, at: null, max: 0 };
    e.areaM2 += t.area;
    if (t.area > e.max) { e.max = t.area; e.at = at(t.a.clone().add(t.b).add(t.c).divideScalar(3)); }
    byMat.set(t.mat, e);
  }
  const top = [...byMat.values()].sort((a, b) => b.areaM2 - a.areaM2).slice(0, 3).map(({ material, areaM2, at }) => ({ material, areaM2: +areaM2.toFixed(1), at }));
  return { areaM2: Math.round(area), top };
}

// Far up-facing faces over ground the near model leaves open: LOD simplification that bridges a
// courtyard or notch. Near roofs/decks/ground are rasterised in plan (1 m cells, one cell of
// tolerance); far cells with no near cover nearby are summed.
export function farOverhang(nearTris, farTris, { cell = 1, minUp = 0.3 } = {}) {
  const key = (ix, iz) => (ix + 60000) * 120000 + (iz + 60000);
  const cells = (t, visit) => {
    const P = [t.a, t.b, t.c], xs = P.map((p) => p.x), zs = P.map((p) => p.z);
    const s = (a, b, x, z) => (b.x - a.x) * (z - a.z) - (b.z - a.z) * (x - a.x);
    const inside = (x, z) => { const d1 = s(P[0], P[1], x, z), d2 = s(P[1], P[2], x, z), d3 = s(P[2], P[0], x, z); return (d1 >= 0 && d2 >= 0 && d3 >= 0) || (d1 <= 0 && d2 <= 0 && d3 <= 0); };
    let n = 0;
    for (let ix = Math.floor(Math.min(...xs) / cell); ix <= Math.floor(Math.max(...xs) / cell); ix++)
      for (let iz = Math.floor(Math.min(...zs) / cell); iz <= Math.floor(Math.max(...zs) / cell); iz++)
        if (inside((ix + 0.5) * cell, (iz + 0.5) * cell)) { visit(ix, iz); n++; }
    return n;
  };
  const cover = new Set();
  for (const t of nearTris) {
    if (t.n.y < minUp) continue;
    cells(t, (ix, iz) => cover.add(key(ix, iz)));
    // Slivers narrower than a cell still cover the cells along their edges.
    for (const [p, q] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]]) {
      const steps = Math.max(1, Math.ceil(p.distanceTo(q) / (cell / 2)));
      for (let k = 0; k <= steps; k++) cover.add(key(Math.floor((p.x + (q.x - p.x) * k / steps) / cell), Math.floor((p.z + (q.z - p.z) * k / steps) / cell)));
    }
  }
  const covered = (ix, iz) => { for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) if (cover.has(key(ix + dx, iz + dz))) return true; return false; };
  const byMat = new Map(); let area = 0;
  for (const t of farTris) {
    if (t.n.y < minUp) continue;
    let open = 0;
    if (!cells(t, (ix, iz) => { if (!covered(ix, iz)) open++; })) { const c = t.a.clone().add(t.b).add(t.c).divideScalar(3); if (!covered(Math.floor(c.x / cell), Math.floor(c.z / cell))) open = Math.min(1, t.area / (cell * cell)); }
    if (!open) continue;
    const a = open * cell * cell; area += a;
    const e = byMat.get(t.mat) || { material: t.mat, areaM2: 0, at: null, max: 0 };
    e.areaM2 += a;
    if (a > e.max) { e.max = a; e.at = at(t.a.clone().add(t.b).add(t.c).divideScalar(3)); }
    byMat.set(t.mat, e);
  }
  const top = [...byMat.values()].sort((a, b) => b.areaM2 - a.areaM2).slice(0, 3).map(({ material, areaM2, at }) => ({ material, areaM2: Math.round(areaM2), at }));
  return { areaM2: Math.round(area), top };
}
