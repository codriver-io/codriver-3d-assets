import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { shaft, base, pod, crown } from './calgary-tower-parts.js';

// Calgary Tower, original procedural model. near carries the flutes on the red cladding, the ribs under the
// soffit, the glazing mullions, the railing, the skylights and the rotunda's mullions; far keeps the same
// silhouette (the flared soffit, the overhanging rim, the dome, the drum, the cauldron and the mast) at
// roughly a fifth of the triangles and 7 materials.
const FAR_MATERIAL = { metal: 'white', lamp: 'light' };

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const near = detail === 'near', ctx = { near, m: (name) => (near ? name : FAR_MATERIAL[name] ?? name) };
  base(b, ctx); shaft(b, ctx); pod(b, ctx); crown(b, ctx);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
