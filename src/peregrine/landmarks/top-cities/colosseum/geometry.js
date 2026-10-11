import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildColosseum } from './colosseum-parts.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  for (const { material, geometry } of buildColosseum(detail)) b.put(geometry, material);
  return b.finish();
}
