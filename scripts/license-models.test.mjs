import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { licenseModels } from './license-models.mjs';
import { glbMetrics } from './asset-catalog.mjs';

test('publishing preserves outside creators, data licenses and mesh bytes across repeated builds', async () => {
  const root = await mkdtemp(join(tmpdir(), 'landmark-license-'));
  try {
    await mkdir(join(root, 'prototypes/assets3d'), { recursive: true });
    await mkdir(join(root, 'public/models'), { recursive: true });
    const catalog = JSON.parse(await readFile(new URL('../prototypes/assets3d/catalog.json', import.meta.url)));
    const sourceManifest = JSON.parse(await readFile(new URL('../public' + catalog.assets[0].manifest, import.meta.url)));
    const original = await readFile(new URL('../public' + sourceManifest.assets.far.url, import.meta.url));
    const tail = original.subarray(20 + original.readUInt32LE(12));
    const entries = ['none', 'CC0-1.0', 'ODbL-1.0'].map((license, i) => ({
      id: 'fixture-' + i, manifest: '/models/fixture-' + i + '.json', license: 'CC-BY-4.0', codeLicense: 'MIT',
      copyright: '© 2026 Independent Model Author', attribution: 'Independent Model Author; data: ' + license,
      source: { url: 'https://example.org/original-source' }, geographicDataLicense: license,
      geographicDataUrl: license === 'none' ? undefined : license === 'ODbL-1.0' ? 'https://www.openstreetmap.org/copyright' : 'https://creativecommons.org/publicdomain/zero/1.0/',
    }));
    await writeFile(join(root, 'prototypes/assets3d/catalog.json'), JSON.stringify({ assets: entries }));
    for (const e of entries) {
      await writeFile(join(root, 'public' + e.manifest), JSON.stringify({ id: e.id, assets: { near: { url: '/models/' + e.id + '.glb' } } }));
      await writeFile(join(root, 'public/models/' + e.id + '.glb'), original);
    }
    await licenseModels(root);
    const first = [];
    for (const e of entries) {
      const m = JSON.parse(await readFile(join(root, 'public' + e.manifest)));
      const bytes = await readFile(join(root, 'public' + m.assets.near.url)); first.push(bytes);
      const gltf = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)));
      assert.equal(m.copyright, e.copyright); assert.equal(m.attribution, e.attribution);
      assert.equal(m.geographicDataLicense, e.geographicDataLicense);
      assert.equal(gltf.asset.extras.attribution, e.attribution);
      assert.equal(gltf.asset.extras.geographicDataLicense, e.geographicDataLicense);
      assert.equal(gltf.asset.extras.geographicDataUrl, e.geographicDataUrl);
      assert.ok(gltf.asset.copyright.startsWith(e.copyright)); assert.ok(!gltf.asset.copyright.includes('Codriver'));
      assert.equal(gltf.asset.copyright.includes('OpenStreetMap'), e.geographicDataLicense === 'ODbL-1.0');
      assert.deepEqual(bytes.subarray(20 + bytes.readUInt32LE(12)), tail);
      assert.deepEqual(glbMetrics(bytes), { bytes: m.assets.near.bytes, triangles: m.assets.near.triangles, drawCalls: m.assets.near.drawCalls });
    }
    await licenseModels(root);
    for (const [i, e] of entries.entries()) assert.deepEqual(await readFile(join(root, 'public/models/' + e.id + '.glb')), first[i]);
    delete entries[0].copyright;
    await writeFile(join(root, 'prototypes/assets3d/catalog.json'), JSON.stringify({ assets: entries }));
    await assert.rejects(licenseModels(root), /missing copyright/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
