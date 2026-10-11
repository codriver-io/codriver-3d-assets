import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ROT } from './united-states-capitol-plan.js';
import { makeKit } from './united-states-capitol-kit.js';
import { buildBody } from './united-states-capitol-body.js';
import { buildDome } from './united-states-capitol-dome.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const kit = makeKit(b, ROT, detail === 'near');
  buildBody(kit);
  buildDome(kit);
  return b.finish();
}
