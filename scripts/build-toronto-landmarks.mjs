// Export near/far GLBs and the runtime manifest for Toronto registry landmarks.
//   pnpm build:toronto-landmarks cn-tower rogers-centre   (named landmarks)
//   pnpm build:toronto-landmarks --all                    (every registry entry)
// A landmark is exported whether or not its spec is `ready`; `ready` only gates
// the runtime. Afterwards the catalog is revalidated against the fresh bytes.
import { mkdir, writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Box3 } from 'three';
import { TORONTO_LANDMARKS } from '../src/peregrine/landmarks/toronto/authoring.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics } from './asset-catalog.mjs';
import { licenseModels } from './license-models.mjs';

globalThis.FileReader ??= class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
const args = process.argv.slice(2), all = args.includes('--all');
const wanted = args.filter((a) => !a.startsWith('--'));
const unknown = wanted.filter((id) => !TORONTO_LANDMARKS.some((l) => l.id === id));
if (unknown.length || (!all && !wanted.length)) { console.error(`Usage: build-toronto-landmarks <id...> | --all${unknown.length ? `\nUnknown: ${unknown.join(', ')}` : ''}`); process.exit(2); }

for (const landmark of TORONTO_LANDMARKS.filter((l) => all || wanted.includes(l.id))) {
  const { id, spec, manifest, dir } = landmark;
  const out = new URL(`../public/models/${dir}/`, import.meta.url), assets = {};
  await mkdir(out, { recursive: true });
  for (const detail of ['near', 'far']) {
    const model = landmark.create({ detail }), bounds = new Box3().setFromObject(model);
    // Buildings drop `bridgeLift` (only a host's road-fitted bridge reads it): 4 bytes per vertex.
    if (spec.kind !== 'bridge') model.traverse((o) => { if (o.isMesh && o.geometry.getAttribute('bridgeLift')) o.geometry.deleteAttribute('bridgeLift'); });
    const bytes = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true }));
    const file = `${id}-${detail}.glb`; await writeFile(new URL(file, out), bytes);
    assets[detail] = { url: `/models/${dir}/${file}`, ...glbMetrics(bytes), bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() } };
    disposeChamplain(model);
  }
  const { ready, ...frame } = spec; // `ready` is a runtime gate, not model data
  await writeFile(new URL(`${id}.json`, out), JSON.stringify({
    ...frame, units: 'metres', axes: { x: 'east', y: 'up', z: 'south' },
    elevationDatum: manifest.elevationDatum, attribution: manifest.attribution, note: manifest.note, assets,
  }, null, 2) + '\n');
  console.log(id, JSON.stringify(Object.fromEntries(Object.entries(assets).map(([k, a]) => [k, [a.triangles, a.drawCalls, a.bytes]]))));
}
if (!process.env.CODRIVER_ASSET_BATCH) await licenseModels();
