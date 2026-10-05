import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ANGLE } from './palace-of-the-parliament-plan.js';
import { build } from './palace-of-the-parliament-kit.js';

// Palace of the Parliament. Built in the plan frame and turned once so the Unirii front faces east.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  build(b, detail === 'near');
  const g = b.finish();
  g.rotation.y = ANGLE;
  return g;
}
