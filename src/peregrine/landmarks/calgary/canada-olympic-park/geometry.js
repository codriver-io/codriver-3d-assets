import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { inrun, supports, tower90, tower70, tower50, hut38 } from './canada-olympic-park-parts.js';

// Canada Olympic Park ski jumps, original procedural model. near adds the stairways, trestle bracing, the lattice mast
// and the Olympic rings; far keeps the towers, both inrun girders on their profiles, the pier and trestle legs (the open
// space under the inruns) and the glazed bands, in four materials.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const ctx = { near: detail === 'near' };
  for (const key of ['k114', 'k89', 'k63', 'k38']) { inrun(b, ctx, key); supports(b, ctx, key); }
  tower90(b, ctx); tower70(b, ctx); tower50(b, ctx); hut38(b, ctx);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
