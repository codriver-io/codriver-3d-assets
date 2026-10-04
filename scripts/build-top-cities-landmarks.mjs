// Export near/far GLBs and the runtime manifest for the top-cities registry landmarks (London, Amsterdam, Madrid, Dallas, Washington, Medellín, Orange County, Bucharest, Rome, San José, Lyon, Bogotá, Kansas City).
//   pnpm build:top-cities-landmarks tower-bridge rijksmuseum (named landmarks)
//   pnpm build:top-cities-landmarks --all     (every released, i.e. ready, entry)
// Named landmarks are exported whether or not their spec is `ready`; --all exports only released ones, since
// the library publishes each landmark once it is reviewed. Afterwards the catalog is revalidated.
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Box3 } from 'three';
import { TOP_CITIES_LANDMARKS } from '../src/peregrine/landmarks/top-cities/authoring.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics } from './asset-catalog.mjs';
import { licenseModels } from './license-models.mjs';

globalThis.FileReader ??= class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
const args = process.argv.slice(2), all = args.includes('--all');
const wanted = args.filter((a) => !a.startsWith('--'));
const unknown = wanted.filter((id) => !TOP_CITIES_LANDMARKS.some((l) => l.id === id));
if (unknown.length || (!all && !wanted.length)) { console.error(`Usage: build-top-cities-landmarks <id...> | --all${unknown.length ? `\nUnknown: ${unknown.join(', ')}` : ''}`); process.exit(2); }

for (const landmark of TOP_CITIES_LANDMARKS.filter((l) => (all && l.spec.ready) || wanted.includes(l.id))) {
  const { id, spec, manifest, dir } = landmark;
  const out = new URL(`../public/models/${dir}/`, import.meta.url), assets = {};
  await mkdir(out, { recursive: true });
  for (const detail of ['near', 'far']) {
    const model = landmark.create({ detail }), bounds = new Box3().setFromObject(model);
    // Only road-fitted bridges (those with a layer.js) keep the app-only `bridgeLift` attribute, as the app export does.
    if (!existsSync(new URL(`../src/peregrine/landmarks/top-cities/${id}/layer.js`, import.meta.url))) model.traverse((o) => { if (o.isMesh && o.geometry.getAttribute('bridgeLift')) o.geometry.deleteAttribute('bridgeLift'); });
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
