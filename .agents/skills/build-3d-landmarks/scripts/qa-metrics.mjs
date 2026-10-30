#!/usr/bin/env node
// Deterministic QA for exported landmark GLBs: no LLM needed, so reviewers only judge looks.
//   node .agents/skills/build-3d-landmarks/scripts/qa-metrics.mjs [--city Toronto] [--ids a,b] [--out tmp/landmark-qa/metrics.json]
// Per variant: triangles / draws / bytes against the budgets, removable bytes (bridgeLift on a
// free-standing structure), far-vs-near bounds, parts below grade, coplanar overlapping faces of
// different materials (z-fighting candidates), an outside-in ray sweep for back-face hits
// (holes, inside-out or missing faces) on both LODs, window-rhythm loss, unsupported member-end
// candidates, GLB extras (QA data leaking into the export), smooth-shading skew, faces lying on
// host grade and far faces bridging ground the near model leaves open.
// Prints one compact line per landmark; JSON for details.
// A coplanar flag names the worst material pairs ("small on big") and where their largest overlap is.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import * as THREE from 'three';
import { windowFacades, windowRhythm, memberEnds, extrasBytes, shadingSkew, gradeFaces, farOverhang } from './quality-checks.mjs';
export { windowFacades, windowRhythm, memberEnds, extrasBytes, shadingSkew, gradeFaces, farOverhang } from './quality-checks.mjs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadAssetCatalog, glbMetrics } from '../../../../scripts/asset-catalog.mjs';

const ROOT = resolve(process.cwd());
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
export const BUDGET = {
  building: { near: { triangles: 60000, draws: 14, bytes: 2.5e6 }, far: { triangles: 12000, draws: 8, bytes: 0.5e6 } },
  bridge: { near: { triangles: 120000, draws: 40, bytes: 4.5e6 }, far: { triangles: 30000, draws: 10, bytes: 1.2e6 } },
};
// Review-candidate thresholds for the checks added after the October 2026 review, calibrated on the
// whole catalog: each fired on the defects that review found and is clean on their fixes.
export const LIMITS = { backfacePct: 0.5, extrasKB: 4, skewDeg: 90, skewM2: 10, gradeM2: 10, overhangM2: 100 };
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const cityOf = (e) => e.city || ['Montréal', 'Paris', 'Toronto', 'San Francisco'].find((c) => norm(e.location).includes(norm(c))) || '?';

export const meshesOf = (scene) => { const out = []; scene.updateMatrixWorld(true); scene.traverse((o) => { if (o.isMesh) out.push(o); }); return out; };
export function triangles(meshes) {
  const tris = [], a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (const m of meshes) {
    const p = m.geometry.attributes.position, nrmAttr = m.geometry.attributes.normal, idx = m.geometry.index;
    const n = idx ? idx.count : p.count, normalMatrix = new THREE.Matrix3().getNormalMatrix(m.matrixWorld);
    for (let i = 0; i < n; i += 3) {
      const [i0, i1, i2] = idx ? [idx.getX(i), idx.getX(i + 1), idx.getX(i + 2)] : [i, i + 1, i + 2];
      a.fromBufferAttribute(p, i0).applyMatrix4(m.matrixWorld); b.fromBufferAttribute(p, i1).applyMatrix4(m.matrixWorld); c.fromBufferAttribute(p, i2).applyMatrix4(m.matrixWorld);
      const nrm = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)), area = nrm.length() / 2;
      if (area < 1e-6) continue;
      nrm.normalize();
      // Vertex normals as exported, for the shading-skew check.
      const vn = nrmAttr ? [i0, i1, i2].map((k) => new THREE.Vector3().fromBufferAttribute(nrmAttr, k).applyMatrix3(normalMatrix).normalize()) : null;
      tris.push({ a: a.clone(), b: b.clone(), c: c.clone(), n: nrm, vn, area, mat: (Array.isArray(m.material) ? m.material[m.geometry.groups.find((g) => i >= g.start && i < g.start + g.count)?.materialIndex ?? 0] : m.material).name });
    }
  }
  return tris;
}
// Coplanar faces of DIFFERENT materials whose projected boxes overlap: the usual z-fighting cause
// (a window quad on its wall, a trim on its panel). Same-material overlaps are usually harmless.
const PAINT = /paint|asphalt|lane|marking|stripe/i;
function coplanarOverlaps(tris) {
  const groups = new Map();
  for (const t of tris) {
    const n = t.n, d = n.dot(t.a), key = `${Math.round(n.x * 50)},${Math.round(n.y * 50)},${Math.round(n.z * 50)},${Math.round(d * 25)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  }
  let pairs = 0, area = 0; const byPair = new Map();
  for (const g of groups.values()) {
    if (g.length < 2 || g.length > 4000) continue;
    const n = g[0].n, ax = Math.abs(n.x) > 0.9 ? 'y' : 'x', ay = Math.abs(n.z) > 0.9 ? 'y' : 'z';
    const P = (v) => [v[ax], v[ay]];
    const inside = (p, t) => { // p strictly inside triangle t (2D), with a 5 cm margin
      const [a, b, c] = [P(t.a), P(t.b), P(t.c)], s = (u, v, w) => (v[0] - u[0]) * (w[1] - u[1]) - (v[1] - u[1]) * (w[0] - u[0]);
      const d1 = s(a, b, p), d2 = s(b, c, p), d3 = s(c, a, p), m = 0.05 * Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), 1e-6);
      return (d1 > m && d2 > m && d3 > m) || (d1 < -m && d2 < -m && d3 < -m);
    };
    const cen = g.map((t) => [(t.a[ax] + t.b[ax] + t.c[ax]) / 3, (t.a[ay] + t.b[ay] + t.c[ay]) / 3]);
    const c3 = g.map((t) => t.a.clone().add(t.b).add(t.c).divideScalar(3));
    for (let i = 0; i < g.length; i++) for (let j = 0; j < g.length; j++) {
      if (i === j || g[i].mat === g[j].mat || g[j].area > g[i].area) continue;
      if (PAINT.test(g[i].mat) && PAINT.test(g[j].mat)) continue; // deck lane paint over asphalt: drawn with offsets/HD overlay
      // the smaller face j sits inside the bigger face i, in the same plane, in another material
      // the rounded plane key can group facets of a curved facade ~0.3 m apart: require the true plane
      if (g[i].n.dot(g[j].n) < 0.999 || Math.abs(g[i].n.dot(c3[j]) - g[i].n.dot(g[i].a)) > 0.02 || !inside(cen[j], g[i])) continue;
      pairs++; area += g[j].area;
      const k = `${g[j].mat} on ${g[i].mat}`, e = byPair.get(k) || { pair: k, pairs: 0, area: 0, maxArea: 0, at: null };
      e.pairs++; e.area += g[j].area;
      if (g[j].area > e.maxArea) { e.maxArea = g[j].area; e.at = ['x', 'y', 'z'].map((c) => +((g[j].a[c] + g[j].b[c] + g[j].c[c]) / 3).toFixed(1)); }
      byPair.set(k, e);
    }
  }
  // Where to look: the worst material pairs and the model-space centre of their biggest overlapping face.
  const top = [...byPair.values()].sort((a, b) => b.area - a.area).slice(0, 3).map(({ pair, pairs, area, at }) => ({ pair, pairs, areaM2: +area.toFixed(1), at }));
  return { pairs, areaM2: Math.round(area), top };
}
// Parallel stacked materials can flicker without being coplanar. Conservative model-metre
// screening gaps: near 20 cm, far 50 cm. Host camera precision and depth ordering still need QA.
export const LAYER_GAP = { near: 0.2, far: 0.5 };
export function layeredFaces(tris, maxGap, ranks = {}) {
  const groups = new Map();
  for (const t of tris) {
    const n = t.n, key = `${Math.round(n.x * 20)},${Math.round(n.y * 20)},${Math.round(n.z * 20)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  }
  const byPair = new Map(); let area = 0, faces = 0;
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    const n = g[0].n.clone().normalize(), u = new THREE.Vector3().crossVectors(n, Math.abs(n.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize(), v = new THREE.Vector3().crossVectors(n, u);
    const P = (p) => [p.dot(u), p.dot(v)];
    const rows = g.map((t) => { const a = P(t.a), b = P(t.b), c = P(t.c); return { t, a, b, c, d: n.dot(t.a), cen: [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3], min: [Math.min(a[0], b[0], c[0]), Math.min(a[1], b[1], c[1])], max: [Math.max(a[0], b[0], c[0]), Math.max(a[1], b[1], c[1])] }; });
    // Spatial hash of every face's 2D box (2 m cells; huge faces capped to 4000 cells).
    const C = 2, grid = new Map(), large = [];
    rows.forEach((r, i) => {
      const x0 = Math.floor(r.min[0] / C), x1 = Math.floor(r.max[0] / C), y0 = Math.floor(r.min[1] / C), y1 = Math.floor(r.max[1] / C);
      if ((x1 - x0 + 1) * (y1 - y0 + 1) > 4000) { large.push(i); return; }
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) { const k = x + ',' + y; if (!grid.has(k)) grid.set(k, []); grid.get(k).push(i); }
    });
    const inside = (p, r) => { const s = (a, b, w) => (b[0] - a[0]) * (w[1] - a[1]) - (b[1] - a[1]) * (w[0] - a[0]); const d1 = s(r.a, r.b, p), d2 = s(r.b, r.c, p), d3 = s(r.c, r.a, p); return (d1 >= 0 && d2 >= 0 && d3 >= 0) || (d1 <= 0 && d2 <= 0 && d3 <= 0); };
    for (const j of rows) {
      const cands = [...(grid.get(Math.floor(j.cen[0] / C) + ',' + Math.floor(j.cen[1] / C)) || []), ...large];
      const backing = new Set();
      for (const i of cands) {
        const r = rows[i], gap = j.d - r.d;
        // Positive outward gap is in front. Exactly coplanar faces have no geometric
        // ordering: only the strictly smaller face can be an overlay.
        if (r === j || r.t.mat === j.t.mat || r.t.area < j.t.area || gap < -1e-5 || gap >= maxGap) continue;
        if (Math.abs(gap) <= 1e-5 && r.t.area <= j.t.area + 1e-6) continue;
        if (r.t.n.dot(j.t.n) < 0.99999 || backing.has(r.t.mat)) continue;
        if ((ranks[j.t.mat] || 0) > (ranks[r.t.mat] || 0)) continue;
        if (PAINT.test(r.t.mat) && PAINT.test(j.t.mat)) continue;
        if (!inside(j.cen, r)) continue;
        faces++; area += j.t.area;
        backing.add(r.t.mat);
        const k = `${j.t.mat} on ${r.t.mat}`, e = byPair.get(k) || { pair: k, front: j.t.mat, back: r.t.mat, faces: 0, area: 0, minGap: Infinity, maxArea: 0, at: null };
        e.faces++; e.area += j.t.area; e.minGap = Math.min(e.minGap, gap);
        if (j.t.area > e.maxArea) { e.maxArea = j.t.area; e.at = ['x', 'y', 'z'].map((c) => +((j.t.a[c] + j.t.b[c] + j.t.c[c]) / 3).toFixed(1)); }
        byPair.set(k, e);
      }
    }
  }
  const edges = [...byPair.values()].sort((a, b) => b.area - a.area || a.pair.localeCompare(b.pair));
  const top = edges.slice(0, 4).map(({ pair, faces, area, minGap, at }) => ({ pair, faces, areaM2: +area.toFixed(1), gapCm: Math.round(minGap * 100), at }));
  return { faces, areaM2: Math.round(area), top, edges };
}
// Rays from a sphere round the model (always outside its box) at random points inside the box: a
// first hit on a face whose normal points away from the ray origin is a hole, an inside-out face
// or a missing cap. The first back hits are located so the part can be found in the source.
export function backfaceSweep(scene, box, rays = 500) {
  const meshes = meshesOf(scene);
  for (const m of meshes) {
    const materials = (Array.isArray(m.material) ? m.material : [m.material]).map(mat => { const copy = mat.clone(); copy.side = THREE.DoubleSide; return copy; });
    m.material = Array.isArray(m.material) ? materials : materials[0];
  }
  const rc = new THREE.Raycaster(), center = box.getCenter(new THREE.Vector3()), r = box.getSize(new THREE.Vector3()).length() * 0.75 + 5;
  let hits = 0, back = 0, s = 12345; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647), where = [];
  for (let k = 0; k < rays; k++) {
    const u = rnd() * 2 - 1, phi = rnd() * Math.PI * 2, up = Math.max(0.05, Math.abs(u)); // origins above grade
    const o = center.clone().add(new THREE.Vector3(Math.sqrt(1 - up * up) * Math.cos(phi), up, Math.sqrt(1 - up * up) * Math.sin(phi)).multiplyScalar(r));
    const t = new THREE.Vector3(box.min.x + rnd() * (box.max.x - box.min.x), box.min.y + rnd() * (box.max.y - box.min.y), box.min.z + rnd() * (box.max.z - box.min.z));
    rc.set(o, t.sub(o).normalize());
    const hit = rc.intersectObjects(meshes, false)[0];
    if (!hit || !hit.face) continue;
    hits++;
    const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    if (n.dot(rc.ray.direction) > 0.2) {
      back++;
      const mat = Array.isArray(hit.object.material) ? hit.object.material[hit.face.materialIndex] : hit.object.material;
      if (where.length < 4) where.push({ material: mat.name, at: hit.point.toArray().map((x) => +x.toFixed(1)) });
    }
  }
  return { rays: hits, back, backfacePct: hits ? Math.round((back / hits) * 1000) / 10 : 0, at: where };
}
export async function loadGlb(file) {
  const data = await readFile(file);
  const scene = (await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength), '')).scene;
  const len = data.readUInt32LE(12), json = JSON.parse(data.subarray(20, 20 + len));
  let liftBytes = 0; const attrs = new Set();
  for (const m of json.meshes || []) for (const p of m.primitives) for (const [k, i] of Object.entries(p.attributes)) {
    attrs.add(k); if (/bridgelift/i.test(k)) { const a = json.accessors[i]; liftBytes += a.count * 4; }
  }
  return { scene, json, metrics: glbMetrics(data), liftBytes, attrs: [...attrs] };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.url.replace('file://', ''))) {
  globalThis.self ??= globalThis;
  const catalog = await loadAssetCatalog(ROOT);
  const wanted = opt('ids')?.split(','), city = opt('city');
  const entries = catalog.assets.filter((e) => e.model && (!wanted || wanted.includes(e.id)) && (!city || cityOf(e) === city));
  const out = [];
  for (const e of entries) {
    const variants = Object.entries(e.model.assets), near = variants.find(([k]) => k === 'near') || variants[0], far = variants.find(([k]) => k === 'far');
    const row = { id: e.id, city: cityOf(e), kind: e.kind, issues: [] }, sizes = {}, planTris = {};
    for (const [label, v] of [['near', near], ['far', far]].filter(([, v]) => v)) {
      const g = await loadGlb(join(ROOT, 'public', v[1].url)), b = BUDGET[e.kind][label], box = new THREE.Box3().setFromObject(g.scene), size = box.getSize(new THREE.Vector3());
      sizes[label] = size;
      const m = { tris: g.metrics.triangles, draws: g.metrics.drawCalls, kb: Math.round(g.metrics.bytes / 1024), liftKB: Math.round(g.liftBytes / 1024), minY: +box.min.y.toFixed(2), top: +box.max.y.toFixed(1) };
      for (const [k, lim, val] of [['tris', b.triangles, m.tris], ['draws', b.draws, m.draws], ['bytes', b.bytes, g.metrics.bytes]]) if (val > lim) row.issues.push(`${label} ${k} ${val} > ${lim}`);
      if (e.kind === 'building' && g.liftBytes) row.issues.push(`${label} removable bridgeLift ${m.liftKB} KB`);
      if (box.min.y < -3) row.issues.push(`${label} below grade ${m.minY} m`);
      const tris = triangles(meshesOf(g.scene));
      m.layered = layeredFaces(tris, LAYER_GAP[label]);
      if (m.layered.areaM2 >= 2) row.issues.push(`${label} layered faces < ${LAYER_GAP[label] * 100} cm ${m.layered.areaM2} m² (${m.layered.top.map(t => `${t.pair} at [${t.at}]`).join(', ')})`);
      if (label === 'near') {
        m.coplanar = coplanarOverlaps(tris);
        if (m.coplanar.pairs > 20 && m.coplanar.areaM2 >= 5) row.issues.push(`near coplanar overlaps ${m.coplanar.pairs} (${m.coplanar.areaM2} m²: ${m.coplanar.top.map((t) => `${t.pair} ${t.areaM2} m² at [${t.at}]`).join(', ')})`);
      }
      m.sweep = backfaceSweep(g.scene, box);
      if (m.sweep.backfacePct > LIMITS.backfacePct) row.issues.push(`${label} back-face hits ${m.sweep.backfacePct}% (${m.sweep.at.map((h) => `${h.material} at [${h.at}]`).join(', ')})`);
      m.extras = extrasBytes(g.json);
      if (m.extras.bytes > LIMITS.extrasKB * 1024) row.issues.push(`${label} GLB extras ${Math.round(m.extras.bytes / 1024)} KB (${m.extras.top.map((t) => `${t.key} ${t.kb} KB`).join(', ')}): make QA-only userData non-enumerable`);
      m.skew = shadingSkew(tris, { maxDeg: LIMITS.skewDeg });
      if (m.skew.top[0]?.areaM2 >= LIMITS.skewM2) row.issues.push(`${label} vertex normals behind their faces ${m.skew.areaM2} m² (${m.skew.top.map((t) => `${t.material} ${t.areaM2} m² at [${t.at}]`).join(', ')})`);
      // A bridge's approach decks meet grade by design and are fitted by the host.
      m.grade = e.kind === 'bridge' ? { areaM2: 0, top: [] } : gradeFaces(tris);
      if (m.grade.areaM2 >= LIMITS.gradeM2) row.issues.push(`${label} faces on host grade (|y| ≤ 5 cm) ${m.grade.areaM2} m² (${m.grade.top.map((t) => `${t.material} ${t.areaM2} m² at [${t.at}]`).join(', ')})`);
      planTris[label] = tris;
      m.windows = windowFacades(tris);
      m.memberEnds = memberEnds(tris);
      if (m.memberEnds.ends) row.issues.push(`${label} unsupported member-end candidates ${m.memberEnds.ends} (${m.memberEnds.flags.slice(0, 4).map(t => `${t.material} at [${t.at}]`).join(', ')})`);
      row[label] = m;
    }
    if (sizes.near && sizes.far) for (const ax of ['x', 'y', 'z']) if (Math.abs(sizes.far[ax] - sizes.near[ax]) > Math.max(1.5, sizes.near[ax] * 0.05)) row.issues.push(`far silhouette ${ax} ${sizes.far[ax].toFixed(1)} vs ${sizes.near[ax].toFixed(1)} m`);
    if (planTris.near && planTris.far) {
      row.farOverhang = farOverhang(planTris.near, planTris.far);
      if (row.farOverhang.areaM2 >= LIMITS.overhangM2) row.issues.push(`far covers ${row.farOverhang.areaM2} m² the near model leaves open (${row.farOverhang.top.map((t) => `${t.material} ${t.areaM2} m² at [${t.at}]`).join(', ')})`);
    }
    if (row.near && row.far) {
      row.windowRhythm = windowRhythm(row.near.windows, row.far.windows);
      if (row.windowRhythm.facades) row.issues.push(`far window-rhythm candidates (${row.windowRhythm.flags.map(f => `bearing bin ${f.bearingBin}: ${f.reasons.join(', ')}`).join('; ')})`);
    }
    out.push(row);
    const n = row.near, f = row.far;
    console.log(`${row.id.padEnd(32)} near ${n.tris}t/${n.draws}d/${n.kb}KB${f ? `  far ${f.tris}t/${f.draws}d/${f.kb}KB` : ''}  ${row.issues.length ? 'ISSUES: ' + row.issues.join('; ') : 'ok'}`);
  }
  const file = resolve(ROOT, opt('out', 'tmp/landmark-qa/metrics.json'));
  await mkdir(dirname(file), { recursive: true }); await writeFile(file, JSON.stringify(out, null, 1));
}
