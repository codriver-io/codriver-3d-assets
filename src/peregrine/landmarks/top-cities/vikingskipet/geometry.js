import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildVikingskipet } from './vikingskipet-hull.js';

// Vikingskipet: the upturned hull, longitudinal planks, glazed skirt and gable ends.
// See docs/3d-top-cities-vikingskipet.md for what is sourced and what is estimated.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  buildVikingskipet(b, detail);
  return b.finish();
}
