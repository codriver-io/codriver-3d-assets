import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT, glbMetrics } from './asset-catalog.mjs';

export function licenseMetadata(entry) {
  for (const key of ['copyright', 'attribution', 'geographicDataLicense'])
    assert.ok(typeof entry[key] === 'string' && entry[key].trim(), `${entry.id}: missing ${key}`);
  assert.equal(entry.license, 'CC-BY-4.0');
  assert.equal(entry.codeLicense, 'MIT');
  if (entry.geographicDataLicense !== 'none')
    assert.match(entry.geographicDataUrl || '', /^https?:\/\//, `${entry.id}: geographic-data license URL required`);
  return {
    license: entry.license,
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    copyright: entry.copyright,
    attribution: entry.attribution,
    sourceUrl: entry.source.url,
    geographicDataLicense: entry.geographicDataLicense,
    geographicDataUrl: entry.geographicDataLicense === 'none' ? undefined : entry.geographicDataUrl,
  };
}

export function stampGlbLicense(original, metadata) {
  glbMetrics(original);
  const oldLength = original.readUInt32LE(12);
  const gltf = JSON.parse(original.subarray(20, 20 + oldLength));
  // Preserve creator credit. OSM credit belongs only on OSM-derived assets.
  const osm = metadata.geographicDataLicense === 'ODbL-1.0' && metadata.geographicDataUrl === 'https://www.openstreetmap.org/copyright';
  gltf.asset.copyright = metadata.copyright + ' — CC BY 4.0' + (osm ? '; geographic data © OpenStreetMap contributors' : '');
  gltf.asset.extras = {
    ...gltf.asset.extras, license: metadata.license, licenseUrl: metadata.licenseUrl,
    source: metadata.sourceUrl, attribution: metadata.attribution,
    geographicDataLicense: metadata.geographicDataLicense, geographicDataUrl: metadata.geographicDataUrl,
  };
  const json = Buffer.from(JSON.stringify(gltf));
  const padded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20); json.copy(padded);
  const tail = original.subarray(20 + oldLength), header = Buffer.from(original.subarray(0, 20));
  header.writeUInt32LE(20 + padded.length + tail.length, 8); header.writeUInt32LE(padded.length, 12);
  return Buffer.concat([header, padded, tail]);
}

export async function licenseModels(root = ROOT) {
  const catalog = JSON.parse(await readFile(resolve(root, 'prototypes/assets3d/catalog.json')));
  const entries = catalog.assets.map(entry => [entry, licenseMetadata(entry)]);
  for (const [entry, metadata] of entries) {
    const path = resolve(root, 'public' + entry.manifest);
    const manifest = JSON.parse(await readFile(path));
    Object.assign(manifest, metadata);
    for (const variant of Object.values(manifest.assets)) {
      const file = resolve(root, 'public' + variant.url);
      const output = stampGlbLicense(await readFile(file), metadata);
      await writeFile(file, output);
      Object.assign(variant, glbMetrics(output));
    }
    await writeFile(path, JSON.stringify(manifest, null, 2) + '\n');
  }
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(ROOT, 'scripts/license-models.mjs')) await licenseModels();
