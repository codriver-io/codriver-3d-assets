import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './texas-state-capitol-kit.js';
import { buildBody } from './texas-state-capitol-body.js';
import { buildDome } from './texas-state-capitol-dome.js';
export function create({ detail = 'near' } = {}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const k=makeKit(b,detail==='near');
  buildBody(k); buildDome(k);
  return b.finish();
}
