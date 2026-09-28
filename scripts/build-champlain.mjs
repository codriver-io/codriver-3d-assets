#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { loadAssetCatalog } from './asset-catalog.mjs';
import { buildAssetCatalogPreview } from './build-asset-catalog.mjs';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createChamplain, disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { CHAMPLAIN, BRIDGE_LENGTH, TOWER_STATION } from '../src/peregrine/landmarks/champlain-profile.js';

// The exporter uses FileReader for binary buffers, even for texture-free scenes.
globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then((result) => { this.result = result; this.onloadend?.(); }); }
};
const out = new URL('../public/models/landmarks/', import.meta.url);
await mkdir(out, { recursive: true });
const assets = {};
for (const detail of ['near', 'far']) {
  const model = createChamplain({ detail });
  const data = await new GLTFExporter().parseAsync(model, { binary: true });
  const name = `samuel-de-champlain-${detail}.glb`;
  await writeFile(new URL(name, out), new Uint8Array(data));
  assets[detail] = { url: `/models/landmarks/${name}`, bytes: data.byteLength, triangles: model.userData.triangles, drawCalls: model.userData.drawCalls };
  disposeChamplain(model);
}
await writeFile(new URL('samuel-de-champlain.json', out), JSON.stringify({
  ...CHAMPLAIN, length: BRIDGE_LENGTH, towerStation: TOWER_STATION,
  units: 'metres', axes: { x: 'east', y: 'up', z: 'south' },
  alignmentAttribution: '© OpenStreetMap contributors — https://www.openstreetmap.org/copyright',
  note: 'Original procedural visual approximation. Elevations and small details are not surveyed. No Flight Simulator assets.', assets,
}, null, 2) + '\n');
// Validate registration and measured export costs before reporting a successful build.
await loadAssetCatalog();
if (process.argv.includes('--preview')) await buildAssetCatalogPreview();
console.log(JSON.stringify(assets, null, 2));
