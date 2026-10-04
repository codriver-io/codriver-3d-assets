import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildRijksmuseum } from './rijksmuseum-build.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  buildRijksmuseum(b, detail === 'near');
  return b.finish();
}
