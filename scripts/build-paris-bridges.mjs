import { mkdir, writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { PARIS_BRIDGES, createParisBridge, metricFrame } from '../src/peregrine/landmarks/paris-bridges-geometry.js';
import { glbMetrics } from './asset-catalog.mjs';
import { buildAssetCatalogPreview } from './build-asset-catalog.mjs';
import { licenseModels } from './license-models.mjs';

globalThis.FileReader ??= class { readAsArrayBuffer(blob) { blob.arrayBuffer().then(value => { this.result = value; this.onloadend?.(); }); } };
const out = new URL('../public/models/bridges/', import.meta.url);
await mkdir(out, { recursive: true });
for (const spec of PARIS_BRIDGES) {
  const assets = {};
  for (const detail of ['near', 'far']) {
    const model = createParisBridge(spec, { detail });
    const bytes = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true }));
    const name = `${spec.id}-${detail}.glb`;
    await writeFile(new URL(name, out), bytes);
    assets[detail] = { url: `/models/bridges/${name}`, ...glbMetrics(bytes) };
    model.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  }
  const frame = metricFrame(spec);
  await writeFile(new URL(`${spec.id}.json`, out), JSON.stringify({
    id: spec.id, name: spec.name, origin: spec.origin, units: 'metres',
    axes: { x: 'east', y: 'up', z: 'south' }, yZero: 'local river/support datum; no DEM, sea-level or scene datum baked',
    centerline: spec.centerline, mappedLengthM: Math.round(frame.length * 10) / 10,
    publishedOrSecondaryLengthM: spec.structuralLength, widthM: spec.width, deckHeightM: spec.deck,
    roadEdgesM: spec.roadEdges, pedestrian: !!spec.pedestrian,
    geographicData: '© OpenStreetMap contributors — ODbL 1.0; centerlines fitted to current named bridge highway/footway ways (29 September 2026); widths, supports and abutment footprints remain visual estimates',
    note: 'Original procedural visual approximation, not a structural survey. Supports require local terrain fitting in the host.', assets,
  }, null, 2) + '\n');
  console.log(spec.id, assets);
}
if (!process.env.CODRIVER_ASSET_BATCH) await licenseModels();
if (process.argv.includes('--preview')) await buildAssetCatalogPreview();
