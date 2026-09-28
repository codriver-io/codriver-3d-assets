import { mkdir, writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createOratoire } from '../src/peregrine/landmarks/oratoire-saint-joseph-geometry.js';
import { ORATOIRE } from '../src/peregrine/landmarks/oratoire-saint-joseph-config.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics, loadAssetCatalog } from './asset-catalog.mjs';

globalThis.FileReader ??= class { readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }); } };
const out = new URL('../public/models/buildings/', import.meta.url), assets = {};
await mkdir(out, { recursive: true });
for (const detail of ['near', 'far']) {
  const model = createOratoire({ detail }), data = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true }));
  const name = `${ORATOIRE.id}-${detail}.glb`; await writeFile(new URL(name, out), data);
  assets[detail] = { url: `/models/buildings/${name}`, ...glbMetrics(data) }; disposeChamplain(model);
}
await writeFile(new URL(`${ORATOIRE.id}.json`, out), JSON.stringify({
  id: ORATOIRE.id, name: ORATOIRE.name, origin: ORATOIRE.origin, units: 'metres', axes: { x: 'east', y: 'up', z: 'south' },
  dimensions: { length: 105, transeptWidth: 65, domeDiameter: 39, exteriorAboveFloor: 97 },
  elevation: { datum: 'Peregrine flat ground = 0; not a geodetic elevation', basilicaFloor: 24, crossTop: 121, foundationBottom: -.4,
    published: 'Oratory states outer dome 155 m above Queen Mary Road and 263 m above sea level, exterior height 97 m. No named geodetic vertical datum; do not use 263 as model height.',
    approximation: 'Local rise compressed to 24 m, from implied roughly 58 m (155 minus 97); solid supports stay within building/pedestrian axis. Access roads retain provider height.' },
  alignmentAttribution: '© OpenStreetMap contributors — https://www.openstreetmap.org/copyright',
  note: 'Original texture-free procedural exterior. Roof, crypt, stairs and decorative details simplified; no survey accuracy or third-party geometry.', assets,
}, null, 2) + '\n');
console.log(ORATOIRE.id, assets); await loadAssetCatalog();
