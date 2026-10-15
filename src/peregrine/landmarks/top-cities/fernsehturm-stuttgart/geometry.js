import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildParts } from './fernsehturm-stuttgart-parts.js';
export function create({ detail = 'near' } = {}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const {parts}=buildParts(detail);
  for(const p of parts)b.put(p.geometry,p.material);
  const model=b.finish();
  model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  return model;
}
