#!/usr/bin/env node
// Deterministic QA for exported landmark GLBs: no LLM needed, so reviewers only judge looks.
//   node .agents/skills/build-3d-landmarks/scripts/qa-metrics.mjs [--city Toronto] [--ids a,b] [--out tmp/landmark-qa/metrics.json]
// Per variant: triangles / draws / bytes against the budgets, removable bytes (bridgeLift on a
// free-standing structure), far-vs-near bounds, parts below grade, coplanar overlapping faces of
// different materials (z-fighting candidates) and an outside-in ray sweep for back-face hits
// (holes, inside-out or missing faces). Prints one compact line per landmark; JSON for details.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadAssetCatalog, glbMetrics } from '../../../../scripts/asset-catalog.mjs';

const ROOT = resolve(process.cwd());
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
export const BUDGET = {
  building: { near: { triangles: 60000, draws: 14, bytes: 2.5e6 }, far: { triangles: 12000, draws: 8, bytes: 0.5e6 } },
  bridge: { near: { triangles: 120000, draws: 40, bytes: 4.5e6 }, far: { triangles: 30000, draws: 10, bytes: 1.2e6 } },
};
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const cityOf = (e) => e.city || ['Montréal', 'Paris', 'Toronto', 'San Francisco'].find((c) => norm(e.location).includes(norm(c))) || '?';

const meshesOf = (scene) => { const out = []; scene.updateMatrixWorld(true); scene.traverse((o) => { if (o.isMesh) out.push(o); }); return out; };
function triangles(meshes) {
  const tris = [], a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (const m of meshes) {
    const p = m.geometry.attributes.position, idx = m.geometry.index;
    const n = idx ? idx.count : p.count;
    for (let i = 0; i < n; i += 3) {
      const [i0, i1, i2] = idx ? [idx.getX(i), idx.getX(i + 1), idx.getX(i + 2)] : [i, i + 1, i + 2];
      a.fromBufferAttribute(p, i0).applyMatrix4(m.matrixWorld); b.fromBufferAttribute(p, i1).applyMatrix4(m.matrixWorld); c.fromBufferAttribute(p, i2).applyMatrix4(m.matrixWorld);
      const nrm = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)), area = nrm.length() / 2;
      if (area < 1e-6) continue;
      nrm.normalize();
      tris.push({ a: a.clone(), b: b.clone(), c: c.clone(), n: nrm, area, mat: m.material.name });
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
  let pairs = 0, area = 0;
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
    for (let i = 0; i < g.length; i++) for (let j = 0; j < g.length; j++) {
      if (i === j || g[i].mat === g[j].mat || g[j].area > g[i].area) continue;
      if (PAINT.test(g[i].mat) && PAINT.test(g[j].mat)) continue; // deck lane paint over asphalt: drawn with offsets/HD overlay
      // the smaller face j sits inside the bigger face i, in the same plane, in another material
      if (inside(cen[j], g[i])) { pairs++; area += g[j].area; }
    }
  }
  return { pairs, areaM2: Math.round(area) };
}
// Rays from a sphere round the model at random points inside its box: a first hit on a face whose
// normal points away from the ray origin is a hole, an inside-out face or a missing cap.
function backfaceSweep(scene, box, rays = 500) {
  const meshes = meshesOf(scene); for (const m of meshes) { m.material = m.material.clone(); m.material.side = THREE.DoubleSide; }
  const rc = new THREE.Raycaster(), center = box.getCenter(new THREE.Vector3()), r = box.getSize(new THREE.Vector3()).length() * 0.75 + 5;
  let hits = 0, back = 0, s = 12345; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < rays; k++) {
    const u = rnd() * 2 - 1, phi = rnd() * Math.PI * 2, up = Math.max(0.05, Math.abs(u)); // origins above grade
    const o = center.clone().add(new THREE.Vector3(Math.sqrt(1 - up * up) * Math.cos(phi), up, Math.sqrt(1 - up * up) * Math.sin(phi)).multiplyScalar(r));
    const t = new THREE.Vector3(box.min.x + rnd() * (box.max.x - box.min.x), box.min.y + rnd() * (box.max.y - box.min.y), box.min.z + rnd() * (box.max.z - box.min.z));
    rc.set(o, t.sub(o).normalize());
    const hit = rc.intersectObjects(meshes, false)[0];
    if (!hit || !hit.face) continue;
    hits++;
    const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    if (n.dot(rc.ray.direction) > 0.2) back++;
  }
  return { rays: hits, backfacePct: hits ? Math.round((back / hits) * 1000) / 10 : 0 };
}
async function loadGlb(file) {
  const data = await readFile(file);
  const scene = (await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength), '')).scene;
  const len = data.readUInt32LE(12), json = JSON.parse(data.subarray(20, 20 + len));
  let liftBytes = 0; const attrs = new Set();
  for (const m of json.meshes || []) for (const p of m.primitives) for (const [k, i] of Object.entries(p.attributes)) {
    attrs.add(k); if (/bridgelift/i.test(k)) { const a = json.accessors[i]; liftBytes += a.count * 4; }
  }
  return { scene, metrics: glbMetrics(data), liftBytes, attrs: [...attrs] };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.url.replace('file://', ''))) {
  globalThis.self ??= globalThis;
  const catalog = await loadAssetCatalog(ROOT);
  const wanted = opt('ids')?.split(','), city = opt('city');
  const entries = catalog.assets.filter((e) => e.model && (!wanted || wanted.includes(e.id)) && (!city || cityOf(e) === city));
  const out = [];
  for (const e of entries) {
    const variants = Object.entries(e.model.assets), near = variants.find(([k]) => k === 'near') || variants[0], far = variants.find(([k]) => k === 'far');
    const row = { id: e.id, city: cityOf(e), kind: e.kind, issues: [] }, sizes = {};
    for (const [label, v] of [['near', near], ['far', far]].filter(([, v]) => v)) {
      const g = await loadGlb(join(ROOT, 'public', v[1].url)), b = BUDGET[e.kind][label], box = new THREE.Box3().setFromObject(g.scene), size = box.getSize(new THREE.Vector3());
      sizes[label] = size;
      const m = { tris: g.metrics.triangles, draws: g.metrics.drawCalls, kb: Math.round(g.metrics.bytes / 1024), liftKB: Math.round(g.liftBytes / 1024), minY: +box.min.y.toFixed(2), top: +box.max.y.toFixed(1) };
      for (const [k, lim, val] of [['tris', b.triangles, m.tris], ['draws', b.draws, m.draws], ['bytes', b.bytes, g.metrics.bytes]]) if (val > lim) row.issues.push(`${label} ${k} ${val} > ${lim}`);
      if (e.kind === 'building' && g.liftBytes) row.issues.push(`${label} removable bridgeLift ${m.liftKB} KB`);
      if (box.min.y < -3) row.issues.push(`${label} below grade ${m.minY} m`);
      if (label === 'near') {
        const tris = triangles(meshesOf(g.scene));
        m.coplanar = coplanarOverlaps(tris); m.sweep = backfaceSweep(g.scene, box);
        if (m.coplanar.pairs > 20 && m.coplanar.areaM2 >= 5) row.issues.push(`near coplanar overlaps ${m.coplanar.pairs} (${m.coplanar.areaM2} m²)`);
        if (m.sweep.backfacePct > 2) row.issues.push(`near back-face hits ${m.sweep.backfacePct}%`);
      }
      row[label] = m;
    }
    if (sizes.near && sizes.far) for (const ax of ['x', 'y', 'z']) if (Math.abs(sizes.far[ax] - sizes.near[ax]) > Math.max(1.5, sizes.near[ax] * 0.05)) row.issues.push(`far silhouette ${ax} ${sizes.far[ax].toFixed(1)} vs ${sizes.near[ax].toFixed(1)} m`);
    out.push(row);
    const n = row.near, f = row.far;
    console.log(`${row.id.padEnd(32)} near ${n.tris}t/${n.draws}d/${n.kb}KB${f ? `  far ${f.tris}t/${f.draws}d/${f.kb}KB` : ''}  ${row.issues.length ? 'ISSUES: ' + row.issues.join('; ') : 'ok'}`);
  }
  const file = resolve(ROOT, opt('out', 'tmp/landmark-qa/metrics.json'));
  await mkdir(dirname(file), { recursive: true }); await writeFile(file, JSON.stringify(out, null, 1));
}
