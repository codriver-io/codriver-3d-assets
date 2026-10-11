import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { legs, plates, crossbars, masts, cables, equipment, lamps } from './sutro-tower-parts.js';

// Sutro Tower, original procedural model. near carries the lattice posts, the guy cables, the X bracing
// and finer cylinders; far keeps the same silhouette and negative space (the open space between the legs,
// the three crossarms, the three masts) at a fraction of the triangles.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const ctx = { near: detail === 'near' };
  legs(b, ctx); plates(b, ctx); crossbars(b, ctx); masts(b, ctx);
  cables(b, ctx);
  if (ctx.near) equipment(b, ctx);
  lamps(b, ctx);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
