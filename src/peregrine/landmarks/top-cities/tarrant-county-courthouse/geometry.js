// Original procedural geometry; mapped footprint © OpenStreetMap contributors, ODbL 1.0.
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './tarrant-county-courthouse-kit.js';
import { buildBody } from './tarrant-county-courthouse-body.js';
import { buildTower } from './tarrant-county-courthouse-tower.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = makeKit(b, detail === 'near');
  buildBody(k); buildTower(k);
  return b.finish();
}
