import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './library-of-congress-jefferson-kit.js';
import { buildJefferson } from './library-of-congress-jefferson-build.js';
import { ROTATION_DEG } from './library-of-congress-jefferson-plan.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const kit = makeKit(b, ROTATION_DEG * Math.PI / 180, detail !== 'far');
  buildJefferson(kit);
  return b.finish();
}
