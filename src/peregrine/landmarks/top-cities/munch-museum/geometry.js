import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildParts } from './munch-museum-parts.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  for (const [name, bucket] of Object.entries(buildParts(detail))) {
    if (!bucket.indices.length) continue;
    b.put(bucket.geometry(), name);
  }
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
