import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { digest, verifyScenePackage } from './scenes/scene-package.js';

export async function checkSceneReleases(root) {
  const catalog = JSON.parse(await readFile(resolve(root, 'scenes/catalog.json')));
  assert.equal(catalog.version, 1);
  for (const scene of catalog.scenes) {
    assert.match(scene.url, /^\/scenes\/[a-z0-9-]+\.zip$/);
    const file = resolve(root, '.' + scene.url), bytes = await readFile(file);
    assert.equal(bytes.length, scene.bytes); assert.equal(digest(bytes), scene.sha256);
    const names = execFileSync('unzip', ['-Z1', file], { encoding: 'utf8' }).trim().split('\n');
    assert.equal(new Set(names).size, names.length, 'Duplicate archive paths');
    assert.ok(names.every(name => name.split('/').every(p => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(p))), 'Unsafe archive path');
    const extracted = await mkdtemp(join(tmpdir(), 'codriver-public-scene-'));
    try {
      execFileSync('unzip', ['-q', file, '-d', extracted]);
      const manifest = JSON.parse(await readFile(join(extracted, 'scene.json'))), report = await verifyScenePackage(extracted);
      assert.deepEqual(new Set(names), new Set(['scene.json', ...Object.keys(manifest.files)]));
      assert.deepEqual(scene.validation, manifest.validation); assert.equal(scene.id, manifest.id);
      assert.equal(report.verifiedFiles, scene.verifiedFiles);
      assert.deepEqual(report.geometry, scene.geometry);
      const notices = JSON.parse(await readFile(join(extracted, manifest.notices)));
      assert.equal(notices.modelLicense.license, 'CC-BY-4.0'); assert.equal(notices.alignment.license, 'ODbL-1.0'); assert.ok(notices.terrain.licenseUrl);
      for (const name of names.filter(n => n.endsWith('.json'))) assert.ok(!/\/Users\/|op:\/\/|gh[op]_[A-Za-z0-9]{30,}/.test(await readFile(join(extracted, name), 'utf8')), 'Private scene material');
    } finally { await rm(extracted, { recursive: true }); }
  }
  console.log(`PASS ${catalog.scenes.length} extracted scene archives, hashes, offline GLBs and source notices`);
}
