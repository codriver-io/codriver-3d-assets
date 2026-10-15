import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Kit, buildGeneric } from './palais-bourbon-parts.js';
import { buildTemple, buildSouth } from './palais-bourbon-temple.js';

// Original procedural model: mapped palace parts plus the two authored porticoes.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const kit = new Kit();
  buildGeneric(kit, near);
  buildTemple(kit, near);
  buildSouth(kit, near);
  kit.flush(b);
  return b.finish();
}
