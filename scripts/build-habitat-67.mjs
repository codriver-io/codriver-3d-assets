import { mkdir, writeFile } from 'node:fs/promises';
import { Box3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createHabitat67 } from '../src/peregrine/landmarks/habitat-67-geometry.js';
import { HABITAT } from '../src/peregrine/landmarks/habitat-67-config.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics } from './asset-catalog.mjs';

globalThis.FileReader ??= class { readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }); } };
const out = new URL('../public/models/buildings/', import.meta.url), assets = {};
await mkdir(out, { recursive: true });
for (const detail of ['near', 'far']) {
  const model = createHabitat67({ detail }), box = new Box3().setFromObject(model);
  const bytes = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true }));
  const filename = `habitat-67-${detail}.glb`;
  await writeFile(new URL(filename, out), bytes);
  assets[detail] = { url: `/models/buildings/${filename}`, ...glbMetrics(bytes), bounds: { min: box.min.toArray(), max: box.max.toArray() } };
  disposeChamplain(model);
}
await writeFile(new URL('habitat-67.json', out), JSON.stringify({
  id: HABITAT.id, name: HABITAT.name, origin: HABITAT.origin, units: 'metres', axes: { x: 'east', y: 'up', z: 'south' },
  gridBearingDegrees: HABITAT.bearing, moduleDimensions: HABITAT.module, moduleCount: 354,
  elevationDatum: HABITAT.datum, footprint: { osmWay: HABITAT.osmWay, source: 'https://www.openstreetmap.org/way/440195613' },
  alignmentAttribution: '© OpenStreetMap contributors — https://www.openstreetmap.org/copyright (ODbL 1.0)',
  note: 'Original procedural exterior. Three pyramids, L-paired modules, low saddles, terraces, core slots and street girders interpreted from primary references. Module positions, glazing and foundations are approximate; not a survey or apartment-level reconstruction.',
  assets,
}, null, 2) + '\n');
console.log('habitat-67', assets);
