import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Stub placeholder until this landmark is released.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  b.box('stone', [0, SPEC.height / 2, 0], [20, SPEC.height, 20]);
  return b.finish();
}
