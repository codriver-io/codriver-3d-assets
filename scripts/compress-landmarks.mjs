#!/usr/bin/env node
// Explicit pilot: node scripts/compress-landmarks.mjs --ids samuel-de-champlain,pont-jacques-cartier --write
// All registered variants: node scripts/compress-landmarks.mjs --all --write
// Without --write, measures and validates but does not replace any public asset.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { brotliCompress, constants } from 'node:zlib';
import { promisify } from 'node:util';
import { createLandmarkGLTFLoader } from '../src/peregrine/landmarks/landmark-loader.js';
import { sceneMemory } from '../src/peregrine/facade/memory-account.js';
import { compressLandmarkGLB, validateLandmarkConversion, readLandmarkGLB, LANDMARK_CODEC } from './lib/landmark-codec.mjs';
import { loadAssetCatalog, glbMetrics, ROOT } from './asset-catalog.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const loader = createLandmarkGLTFLoader();
const decode = async bytes => (await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '')).scene;
const dispose = scene => scene.traverse(o => { o.geometry?.dispose(); for (const material of Array.isArray(o.material) ? o.material : [o.material]) material?.dispose(); });
const compressBrotli = promisify(brotliCompress);
const compressedBytes = async bytes => (await compressBrotli(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } })).length;
export async function landmarkCompressionMetrics(bytes) {
  const scene = await decode(bytes);
  // The exact authoring sideband is CPU-only, never a vertex upload.
  scene.traverse(o => o.geometry?.deleteAttribute('_codriver_position'));
  const memory = sceneMemory(scene); dispose(scene);
  return { ...glbMetrics(bytes), brotliQ11Bytes: await compressedBytes(bytes), geometryBytes: memory.geometryBytes, sha256: digest(bytes) };
}

/** Promote a completed measurement run without recomputing Brotli. */
export async function applyLandmarkCompression(out) {
  out = resolve(ROOT, out);
  const report = JSON.parse(await readFile(join(out, 'metrics.json')));
  if (report.complete !== true || report.codec !== LANDMARK_CODEC || report.errors?.length || !report.results?.length) throw new Error('A complete, successful codec report is required');
  const catalog = await loadAssetCatalog(), registered = new Map(), manifests = new Map();
  for (const entry of catalog.assets) if (entry.model) for (const [variant, asset] of Object.entries(entry.model.assets)) registered.set(asset.url, { entry, variant });
  const seen = new Set(), staged = [];
  // Validate every source, snapshot and registration before the first write.
  for (const row of report.results) {
    const registration = registered.get(row.url);
    if (row.error || !registration || registration.entry.id !== row.id || registration.variant !== row.variant || seen.has(row.url)) throw new Error(`Registration changed or duplicate result: ${row.url}`);
    seen.add(row.url);
    const relative = row.url.slice('/models/'.length), before = await readFile(join(out, 'before', relative)), after = await readFile(join(out, 'after', relative));
    if (digest(before) !== row.before?.sha256 || digest(after) !== row.after?.sha256) throw new Error(`Snapshot digest mismatch: ${row.url}`);
    const current = digest(await readFile(join(ROOT, 'public', row.url)));
    if (current !== row.before.sha256 && current !== row.after.sha256) throw new Error(`Source changed since measurement: ${row.url}`);
    await validateLandmarkConversion(before, after);
    const metrics = glbMetrics(after);
    for (const key of ['bytes', 'triangles', 'drawCalls']) if (metrics[key] !== row.after[key]) throw new Error(`Reported ${key} mismatch: ${row.url}`);
    const { entry, variant } = registration;
    if (!manifests.has(entry.manifest)) {
      const original = await readFile(join(ROOT, 'public', entry.manifest));
      manifests.set(entry.manifest, { sourceHash: digest(original), value: JSON.parse(original) });
    }
    Object.assign(manifests.get(entry.manifest).value.assets[variant], metrics);
    staged.push({ url: row.url, current, path: join(out, 'after', relative), afterHash: row.after.sha256 });
  }
  // A concurrent builder cannot slip between the long validation and promotion.
  for (const row of staged) if (digest(await readFile(join(ROOT, 'public', row.url))) !== row.current) throw new Error(`Source changed during validation: ${row.url}`);
  for (const [path, manifest] of manifests) if (digest(await readFile(join(ROOT, 'public', path))) !== manifest.sourceHash) throw new Error(`Manifest changed during validation: ${path}`);
  for (const row of staged) if (row.current !== row.afterHash) {
    const bytes = await readFile(row.path);
    if (digest(bytes) !== row.afterHash) throw new Error(`Candidate changed during promotion: ${row.url}`);
    await writeFile(join(ROOT, 'public', row.url), bytes);
  }
  for (const [path, manifest] of manifests) await writeFile(join(ROOT, 'public', path), JSON.stringify(manifest.value, null, 2) + '\n');
  await loadAssetCatalog();
  console.log(JSON.stringify({ applied: out, variants: staged.length, manifests: manifests.size, totals: report.totals }));
}

async function main() {
  const args = process.argv.slice(2), option = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
  if (args.includes('--apply')) {
    if (!option('--apply') || args.some(arg => ['--all', '--ids', '--write', '--out'].includes(arg))) throw new Error('Usage: compress-landmarks.mjs --apply <completed-output-directory>');
    await applyLandmarkCompression(option('--apply')); return;
  }
  const ids = option('--ids')?.split(',').filter(Boolean), all = args.includes('--all'), write = args.includes('--write');
  if ((!all && !ids?.length) || (all && ids)) throw new Error('Usage: compress-landmarks.mjs (--ids id,id | --all) [--write] [--out tmp/landmark-meshopt/<run>]');
  const out = resolve(ROOT, option('--out') || `tmp/landmark-meshopt/${new Date().toISOString().replaceAll(':', '-')}`);
  const catalog = await loadAssetCatalog(), entries = catalog.assets.filter(e => e.model && (all || ids.includes(e.id)));
  if (ids) for (const id of ids) if (!entries.some(e => e.id === id)) throw new Error(`Unknown exported catalog id ${id}`);
  await mkdir(out, { recursive: true });
  const results = [], manifests = new Map(), jobs = [], errors = [];
  for (const entry of entries) {
    const manifest = JSON.parse(await readFile(join(ROOT, 'public', entry.manifest)));
    manifests.set(entry.manifest, manifest);
    for (const [variant, asset] of Object.entries(manifest.assets)) jobs.push({ entry, variant, asset });
  }
  jobs.sort((a, b) => a.asset.url.localeCompare(b.asset.url));
  let cursor = 0, printed = 0, report = Promise.resolve();
  const queueReport = () => {
    // Serialize report writes: four workers must never race on the same file.
    const body = JSON.stringify({ codec: LANDMARK_CODEC, write, complete: false, errors, results: results.filter(Boolean) }, null, 2) + '\n';
    report = report.then(() => writeFile(join(out, 'metrics.json'), body));
    return report;
  };
  const worker = async () => {
    for (;;) {
      const index = cursor++; if (index >= jobs.length) return;
      const { entry, variant, asset } = jobs[index];
      try {
      const path = join(ROOT, 'public', asset.url), before = await readFile(path), after = await compressLandmarkGLB(before);
      await validateLandmarkConversion(before, after);
      const beforeMetrics = await landmarkCompressionMetrics(before), afterMetrics = await landmarkCompressionMetrics(after);
      if (beforeMetrics.triangles !== afterMetrics.triangles || beforeMetrics.drawCalls !== afterMetrics.drawCalls) throw new Error(`Topology changed: ${asset.url}`);
      const snapshot = join(out, 'before', asset.url.slice('/models/'.length));
      await mkdir(dirname(snapshot), { recursive: true }); await writeFile(snapshot, before);
      const candidate = join(out, 'after', asset.url.slice('/models/'.length));
      await mkdir(dirname(candidate), { recursive: true }); await writeFile(candidate, after);
      results[index] = { id: entry.id, variant, url: asset.url, before: beforeMetrics, after: afterMetrics, quantization: readLandmarkGLB(after).json.asset.extras.quantization };
      } catch (error) { errors.push({ url: asset.url, message: error.message }); results[index] = { id: entry.id, variant, url: asset.url, error: error.message }; }
      // Print/report in sorted input order, independently of compression timing.
      while (printed < jobs.length && results[printed]) {
        const row = results[printed++];
        if (row.error) console.error(`${row.id}/${row.variant}: ERROR ${row.error}`);
        else console.log(`${row.id}/${row.variant}: ${row.before.bytes} → ${row.after.bytes} bytes; br ${row.before.brotliQ11Bytes} → ${row.after.brotliQ11Bytes}; GPU geometry ${row.before.geometryBytes} → ${row.after.geometryBytes}`);
      }
      await queueReport();
    }
  };
  // Brotli runs on the native thread pool, with at most four jobs in flight.
  await Promise.all(Array.from({ length: Math.min(4, jobs.length) }, worker));
  await report;
  errors.sort((a, b) => a.url.localeCompare(b.url));
  if (errors.length) throw new Error(`${errors.length} landmark conversions failed; no public assets changed. See ${join(out, 'metrics.json')}`);
  if (write) {
    // Validate the entire batch and recheck the original digests before the
    // first mutation, so invalid or concurrently edited assets cannot promote.
    for (const row of results) if (digest(await readFile(join(ROOT, 'public', row.url))) !== row.before.sha256) throw new Error(`Source changed during conversion: ${row.url}`);
    for (const row of results) await writeFile(join(ROOT, 'public', row.url), await readFile(join(out, 'after', row.url.slice('/models/'.length))));
    for (const { asset } of jobs) Object.assign(asset, glbMetrics(await readFile(join(out, 'after', asset.url.slice('/models/'.length)))));
    for (const [path, manifest] of manifests) await writeFile(join(ROOT, 'public', path), JSON.stringify(manifest, null, 2) + '\n');
    await loadAssetCatalog();
  }
  const totals = Object.fromEntries(['before', 'after'].map(phase => [phase, Object.fromEntries(['bytes', 'brotliQ11Bytes', 'geometryBytes'].map(key => [key, results.reduce((sum, row) => sum + row[phase][key], 0)]))]));
  await writeFile(join(out, 'metrics.json'), JSON.stringify({ codec: LANDMARK_CODEC, write, complete: true, errors, totals, results }, null, 2) + '\n');
  console.log(JSON.stringify({ out, variants: results.length, manifests: write ? manifests.size : 0, totals }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
