import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { shaft, legs, base, pod, antenna } from './cn-tower-parts.js';

// CN Tower, original procedural model. near carries the glazing mullions, roof corrugation,
// brackets, rails and cabinets; far keeps the same silhouette and negative space (the open
// pod underside, the leg fins, the three-section mast) at about a fifth of the triangles.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const ctx = { near: detail === 'near' };
  base(b, ctx); shaft(b, ctx); legs(b, ctx); pod(b, ctx); antenna(b, ctx);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
