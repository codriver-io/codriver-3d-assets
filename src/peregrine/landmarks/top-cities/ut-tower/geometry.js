import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './ut-tower-kit.js';
import { buildMain } from './ut-tower-main.js';
import { buildTower } from './ut-tower-shaft.js';
export function create({ detail='near' }={}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const k=makeKit(b,detail==='near');
  buildMain(k);buildTower(k);
  return b.finish();
}
