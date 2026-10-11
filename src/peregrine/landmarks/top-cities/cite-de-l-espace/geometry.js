import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { parts } from './cite-de-l-espace-parts.js';
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  parts(b, detail === 'near');
  const model = b.finish();
  model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  return model;
}
