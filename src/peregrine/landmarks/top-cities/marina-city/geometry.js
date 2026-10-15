import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildMarinaCity } from './marina-city-parts.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  buildMarinaCity(b, detail);
  return b.finish();
}
