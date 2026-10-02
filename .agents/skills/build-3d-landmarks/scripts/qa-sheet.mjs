#!/usr/bin/env node
// One contact sheet per landmark from its EXPORTED GLBs: the token-cheap way to review looks.
//   node .agents/skills/build-3d-landmarks/scripts/qa-sheet.mjs [--city Paris] [--ids a,b] [--out tmp/landmark-qa/sheets]
// Tiles (480x300 each, 4x2 = one 1920x600 image, ~1.5k tokens to read):
//   reference photo (Wikipedia lead image) | near SW 3/4 | near NE 3/4 | near street level (south)
//   near top (north up)                   | near west, closer | far SW 3/4 | far NE 3/4 (same framing as near)
// Cameras are framed automatically from the model bounds, so the sheet needs no per-landmark views.
// Reference photos are cached under tmp/landmark-qa/refs/ for local comparison only (never commit).
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, mkdtempSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, extname } from 'node:path';
import { loadAssetCatalog } from '../../../../scripts/asset-catalog.mjs';
import { cityOf } from './qa-metrics.mjs';

const ROOT = resolve(process.cwd());
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const out = resolve(ROOT, opt('out', 'tmp/landmark-qa/sheets')), refs = resolve(ROOT, 'tmp/landmark-qa/refs');
mkdirSync(out, { recursive: true }); mkdirSync(refs, { recursive: true });
const FONT = ['/System/Library/Fonts/Supplemental/Arial.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'].find(existsSync);
const norm = (v) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const UA = { 'user-agent': 'codriver-dev (+https://codriver.io)' };

const catalog = await loadAssetCatalog(ROOT);
const wanted = opt('ids')?.split(','), city = opt('city');
const entries = catalog.assets.filter((e) => e.model && (!wanted || wanted.includes(e.id)) && (!city || cityOf(e) === city));
// Before/after comparisons: --no-ref puts a name tile (with --tag text, e.g. "Before") where the reference photo goes,
// so the sheet can be shared; --bounds <json> ({ id: { near: {min,max}, far: {min,max} } }) frames every version alike.
const noRef = args.includes('--no-ref'), tag = opt('tag', ''), frame = opt('bounds') ? JSON.parse(readFileSync(resolve(ROOT, opt('bounds')), 'utf8')) : {};
const metrics = existsSync(join(ROOT, 'tmp/landmark-qa/metrics.json')) ? JSON.parse(readFileSync(join(ROOT, 'tmp/landmark-qa/metrics.json'), 'utf8')) : [];

// Reference photo: the lead image of the best English Wikipedia match for "name city" (cached).
async function referencePhoto(e) {
  const file = join(refs, `${e.id}.jpg`);
  // A cached file must really be an image (JPEG/PNG header); anything else is refetched over.
  if (existsSync(file)) { const h = readFileSync(file).subarray(0, 4); if ((h[0] === 0xff && h[1] === 0xd8) || (h[0] === 0x89 && h[1] === 0x50)) return file; }
  try {
    // Up to three search hits; accept the first lead image that is a JPEG photograph, not a logo,
    // seal, flag or map, and not a tall portrait crop (e.g. a bell instead of the cathedral).
    const q = encodeURIComponent(`${e.name} ${cityOf(e)}`);
    const s = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=3&format=json`, { headers: UA })).json();
    let sum = null, base = null;
    // The landmark's own name as an exact title first (summary follows redirects), then the search hits.
    // A search hit counts only if its title shares a significant word with the landmark name (no 'Pont de l'Alma' for Iéna).
    const words = norm(e.name).split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !['pont', 'tour', 'musee', 'palais', 'place', 'saint', 'paris', 'montreal'].includes(w));
    const hits = (s.query?.search || []).map((h) => h.title).filter((t) => words.some((w) => norm(t).includes(w)));
    const tries = [['en', e.name], ['fr', e.name], ...hits.map((t) => ['en', t])];
    for (const [lang, title] of tries) {
      const r = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`, { headers: UA });
      if (!r.ok) continue;
      const cand = await r.json();
      if (cand.type === 'disambiguation') continue;
      const t = cand.thumbnail;
      if (!t?.source || !/\.jpe?g/i.test(t.source) || /logo|seal|coat_of_arms|emblem|flag|map|diagram|plan/i.test(t.source) || t.width < t.height * 0.6) continue;
      sum = cand; base = t.source; break;
    }
    if (!base) return null;
    // Wikimedia serves only standard thumbnail widths (e.g. 330, 500, 960); try 500 then the API's own.
    let img = null;
    for (const url of [base.replace(/\/\d+px-/, '/500px-'), base]) {
      const r = await fetch(url, { headers: UA });
      if (r.ok && /^image\//.test(r.headers.get('content-type') || '')) { img = Buffer.from(await r.arrayBuffer()); break; }
    }
    if (!img) return null;
    writeFileSync(file, img); writeFileSync(file + '.txt', `${sum.title}\n${sum.content_urls?.desktop?.page || ''}\n${base}\n`);
    await new Promise((r) => setTimeout(r, 800)); // polite
    return file;
  } catch { return null; }
}

const work = mkdtempSync(join(tmpdir(), 'qa-sheet-'));
writeFileSync(join(work, 'entry.js'), `
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true });
renderer.setSize(480, 300); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
document.body.style.margin = '0'; document.body.append(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xdce7e6);
scene.add(new THREE.HemisphereLight(0xe6f3ff, 0x8c9488, 2.6));
const sun = new THREE.DirectionalLight(0xfff1dc, 3.0); sun.position.set(-400, 900, 600); scene.add(sun);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(40000, 40000).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xbec8c1 }));
ground.position.y = -0.05; scene.add(ground);
const camera = new THREE.PerspectiveCamera(35, 480 / 300, 0.5, 60000);
let model = null;
window.__load = async (url) => {
  if (model) scene.remove(model);
  model = (await new GLTFLoader().loadAsync(url)).scene; scene.add(model);
  const b = new THREE.Box3().setFromObject(model); return { min: b.min.toArray(), max: b.max.toArray() };
};
window.__shot = (eye, target, up) => {
  camera.position.set(...eye); camera.up.set(...(up || [0, 1, 0])); camera.lookAt(...target);
  camera.near = Math.max(0.5, camera.position.distanceTo(new THREE.Vector3(...target)) / 2000); camera.updateProjectionMatrix();
  renderer.render(scene, camera); return true;
};
`);
await build({ entryPoints: [join(work, 'entry.js')], bundle: true, format: 'iife', outfile: join(work, 'bundle.js'), logLevel: 'error', absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')] });
writeFileSync(join(work, 'index.html'), '<!doctype html><meta charset=utf-8><body><script src="/bundle.js"></script>');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'model/gltf-binary' };
const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  const file = path.startsWith('/models/') ? join(ROOT, 'public', path) : join(work, path === '/' ? 'index.html' : path);
  if (!existsSync(file) || !statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(readFileSync(file));
}).listen(0, '127.0.0.1');
await new Promise((r) => server.once('listening', r));
const cached = process.env.CHROMIUM_PATH || `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = await chromium.launch({ ...(existsSync(cached) ? { executablePath: cached } : {}), args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 480, height: 300 } });
await page.goto(`http://127.0.0.1:${server.address().port}/`);

const fit = (b, dir, k = 1) => { // eye on a unit direction, far enough to frame the bounds
  const c = b.min.map((v, i) => (v + b.max[i]) / 2), r = Math.hypot(...b.max.map((v, i) => v - b.min[i])) / 2;
  const d = (r / Math.tan((35 / 2) * Math.PI / 180)) * 0.62 * k, n = Math.hypot(...dir);
  return [[c[0] + dir[0] / n * d, Math.max(1.7, c[1] + dir[1] / n * d), c[2] + dir[2] / n * d], c];
};
try {
  for (const e of entries) {
    const v = Object.entries(e.model.assets), near = (v.find(([k]) => k === 'near') || v[0])[1].url, far = v.find(([k]) => k === 'far')?.[1].url;
    const tiles = [], tile = (name) => join(work, `${e.id}-${name}.png`);
    const ref = noRef ? null : await referencePhoto(e);
    if (noRef) { execFileSync('magick', ['-size', '480x300', 'xc:#e9ecea', ...(FONT ? ['-font', FONT] : []), '-fill', '#333', '-gravity', 'center', '-pointsize', '28', '-annotate', '+0-24', e.name, '-pointsize', '22', '-fill', '#666', '-annotate', '+0+24', tag, tile('ref')]); tiles.push(tile('ref')); }
    else if (ref) { execFileSync('magick', [ref, '-resize', '480x300^', '-gravity', 'center', '-extent', '480x300', tile('ref')]); tiles.push(tile('ref')); }
    else { execFileSync('magick', ['-size', '480x300', 'xc:#eeeeee', tile('ref')]); tiles.push(tile('ref')); }
    let b = await page.evaluate((u) => window.__load(u), near);
    if (frame[e.id]?.near) b = frame[e.id].near;
    const h = b.max[1] - b.min[1], c = b.min.map((x, i) => (x + b.max[i]) / 2), span = Math.max(b.max[0] - b.min[0], b.max[2] - b.min[2]);
    const shots = [
      ['nsw', ...fit(b, [-1, 0.55, 1])], ['nne', ...fit(b, [1, 0.55, -1])],
      ['street', [c[0], 1.7, b.max[2] + Math.max(25, span * 0.45)], [c[0], Math.min(h * 0.45, 60), c[2]]],
      ['top', [c[0], b.max[1] + span * 1.45 + 10, c[2] + 0.01], c, [0, 0, -1]], ['nw', ...fit(b, [-1, 0.22, 0.25], 0.7)],
    ];
    for (const [name, eye, target, up] of shots) { await page.evaluate(([a, t, u]) => window.__shot(a, t, u), [eye, target, up]); await page.screenshot({ path: tile(name) }); tiles.push(tile(name)); }
    if (far) {
      b = await page.evaluate((u) => window.__load(u), far);
      if (frame[e.id]?.far) b = frame[e.id].far;
      for (const [name, dir] of [['fsw', [-1, 0.55, 1]], ['fne', [1, 0.55, -1]]]) { const [eye, target] = fit(b, dir, 1); await page.evaluate(([a, t]) => window.__shot(a, t), [eye, target]); await page.screenshot({ path: tile(name) }); tiles.push(tile(name)); }
    }
    const m = metrics.find((x) => x.id === e.id);
    const label = `${e.id}  near ${m?.near ? `${m.near.tris}t ${m.near.draws}d ${m.near.kb}KB` : ''}  far ${m?.far ? `${m.far.tris}t ${m.far.draws}d ${m.far.kb}KB` : ''}`;
    const sheet = join(out, `${e.id}.jpg`);
    execFileSync('magick', ['montage', ...(FONT ? ['-font', FONT] : []), ...tiles, '-tile', '4x2', '-geometry', '+2+2', '-background', 'white', join(work, `${e.id}-m.png`)]);
    execFileSync('magick', [join(work, `${e.id}-m.png`), '-gravity', 'north', '-background', 'white', '-splice', '0x30', ...(FONT ? ['-font', FONT] : []), '-pointsize', '18', '-annotate', '+0+6', label, '-quality', '82', sheet]);
    console.log(sheet);
  }
} finally { await browser.close(); server.close(); }
