import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const MODEL_ROOTS = ['landmarks', 'bridges', 'buildings'];
export const CATALOG_PATH = 'prototypes/assets3d/catalog.json';

function requireValue(ok, message) { if (!ok) throw new Error(message); }
function relativePath(root, name) {
  requireValue(typeof name === 'string' && name.length > 0 && !name.includes('\\'), 'Invalid asset path');
  const path = resolve(root, name);
  requireValue(path.startsWith(resolve(root) + sep), `Path must stay inside ${root}: ${name}`);
  return path;
}
function publicPath(root, url) {
  requireValue(typeof url === 'string' && /^\/models\/(landmarks|bridges|buildings)\//.test(url), `Invalid model URL: ${url}`);
  requireValue(!/[?#%]/.test(url) && !url.split('/').includes('..'), `Invalid model URL: ${url}`);
  return relativePath(join(root, 'public'), url.slice(1));
}
function localPage(url) {
  requireValue(typeof url === 'string' && /^\/[a-z0-9-]+\.html(?:\?[^#]*)?$/.test(url), `Invalid local inspection URL: ${url}`);
}
function text(value) { return typeof value === 'string' && value.trim().length > 0; }

// Count the default scene's actual draw instances, not unused meshes/accessors.
export function glbMetrics(data) {
  requireValue(data.length >= 20 && data.readUInt32LE(0) === 0x46546c67 && data.readUInt32LE(4) === 2 && data.readUInt32LE(8) === data.length, 'Invalid GLB 2.0 header');
  const length = data.readUInt32LE(12);
  requireValue(data.readUInt32LE(16) === 0x4e4f534a && length + 20 <= data.length, 'Invalid GLB JSON chunk');
  const gltf = JSON.parse(data.subarray(20, 20 + length).toString('utf8'));
  requireValue(!gltf.extensionsRequired?.some((name) => name.startsWith('ASOBO_')), 'Compiled simulator assets require conversion before registration');
  requireValue(!(gltf.buffers || []).some((b) => b.uri) && !(gltf.images || []).some((i) => i.uri && !i.uri.startsWith('data:')), 'Catalog GLBs must be self-contained');
  let triangles = 0, drawCalls = 0;
  const walk = (index, ancestors = new Set()) => {
    requireValue(!ancestors.has(index), 'Cyclic GLB scene');
    const node = gltf.nodes?.[index];
    requireValue(node, `Missing GLB node ${index}`);
    const next = new Set(ancestors).add(index);
    if (node.mesh != null) for (const primitive of gltf.meshes[node.mesh].primitives) {
      const count = gltf.accessors[primitive.indices ?? primitive.attributes.POSITION].count;
      const mode = primitive.mode ?? 4;
      triangles += mode === 4 ? count / 3 : (mode === 5 || mode === 6) ? Math.max(0, count - 2) : 0;
      drawCalls++;
    }
    for (const child of node.children || []) walk(child, next);
  };
  const scene = gltf.scenes?.[gltf.scene ?? 0];
  requireValue(scene, 'GLB has no default scene');
  for (const node of scene.nodes || []) walk(node);
  return { bytes: data.length, triangles, drawCalls };
}

export async function loadAssetCatalog(root = ROOT) {
  // Full regeneration may start without any exports. Validate after all
  // generators finish; individual generators still validate normally.
  if (process.env.CODRIVER_ASSET_BATCH === '1') return { version: 1, assets: [] };
  const catalog = JSON.parse(await readFile(join(root, CATALOG_PATH), 'utf8'));
  requireValue(catalog.version === 1 && Array.isArray(catalog.assets), 'Unsupported 3D catalog');
  const ids = new Set(), registered = new Set(), assets = [];
  for (const entry of catalog.assets) {
    const id = entry.id;
    requireValue(typeof id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && !ids.has(id), `Invalid or duplicate asset id: ${id}`);
    ids.add(id);
    requireValue(['bridge', 'building'].includes(entry.kind), `${id}: kind must be bridge or building`);
    requireValue(['ready', 'draft', 'reference-only'].includes(entry.status), `${id}: invalid status`);
    for (const key of ['name', 'location', 'description', 'notes']) requireValue(text(entry[key]), `${id}: missing ${key}`);
    requireValue(text(entry.source?.provenance), `${id}: missing provenance`);
    requireValue(Array.isArray(entry.source.references) && entry.source.references.length > 0, `${id}: missing references`);
    for (const ref of entry.source.references) requireValue(text(ref.label) && /^https?:\/\//.test(ref.url), `${id}: invalid reference`);
    for (const path of [entry.source.path, entry.documentation].filter(Boolean)) {
      requireValue((await stat(relativePath(root, path))).isFile(), `${id}: missing source/documentation ${path}`);
    }
    if (entry.inspection) {
      localPage(entry.inspection.url);
      requireValue(Array.isArray(entry.inspection.views), `${id}: missing inspection views`);
      for (const view of entry.inspection.views) { requireValue(text(view.label), `${id}: missing view label`); localPage(view.url); }
    }
    if (entry.status === 'reference-only' || !entry.manifest) {
      requireValue(entry.status !== 'ready' && !entry.manifest && !entry.inspection, `${id}: reference-only or unexported assets cannot expose runtime models or previews`);
      assets.push(entry);
      continue;
    }
    const manifestPath = publicPath(root, entry.manifest);
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    requireValue(manifest.id === id && manifest.units === 'metres', `${id}: manifest id/units mismatch`);
    requireValue(Array.isArray(manifest.origin) && manifest.origin.length === 2 && manifest.origin.every(Number.isFinite) && Math.abs(manifest.origin[0]) <= 180 && Math.abs(manifest.origin[1]) <= 90, `${id}: invalid geographic anchor`);
    requireValue(manifest.axes?.x === 'east' && manifest.axes?.y === 'up' && manifest.axes?.z === 'south', `${id}: expected east/up/south frame`);
    requireValue(Object.keys(manifest.assets || {}).length > 0, `${id}: no exported variants`);
    for (const [variant, asset] of Object.entries(manifest.assets)) {
      requireValue(/^[a-z0-9-]+$/.test(variant) && asset.url?.endsWith('.glb'), `${id}: invalid variant`);
      requireValue(!registered.has(asset.url), `Duplicate exported asset: ${asset.url}`);
      registered.add(asset.url);
      const metrics = glbMetrics(await readFile(publicPath(root, asset.url)));
      for (const key of ['bytes', 'triangles', 'drawCalls']) requireValue(asset[key] === metrics[key], `${id}/${variant}: stale ${key}; expected ${metrics[key]}, got ${asset[key]}`);
    }
    assets.push({ ...entry, model: manifest });
  }
  // Every retained landmark/building/bridge export needs an entry, including nested captures.
  async function inspect(dir, prefix) {
    const files = await readdir(dir, { withFileTypes: true }).catch((e) => { if (e.code === 'ENOENT') return []; throw e; });
    for (const file of files) {
      const url = `${prefix}/${file.name}`;
      if (file.isDirectory()) await inspect(join(dir, file.name), url);
      else if (/\.(glb|gltf)$/i.test(file.name)) requireValue(registered.has(url), `Unregistered 3D asset: ${url}. Add it to ${CATALOG_PATH}; use self-contained GLB exports.`);
    }
  }
  for (const dir of MODEL_ROOTS) await inspect(join(root, 'public/models', dir), `/models/${dir}`);
  return { version: 1, assets };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalog = await loadAssetCatalog();
  console.log(`3D catalog valid: ${catalog.assets.length} entries, ${catalog.assets.reduce((n, e) => n + Object.keys(e.model?.assets || {}).length, 0)} GLB variants`);
}
