import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildCathedral } from './st-pauls-cathedral-build.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // The two masonry tones use one stone surface; deep orders supply the shadow.
  const api = { ...b, put: (g,m,...r) => b.put(g,m==='stone2'?'stone':m,...r) };
  buildCathedral(api, detail === 'near');
  return b.finish();
}
