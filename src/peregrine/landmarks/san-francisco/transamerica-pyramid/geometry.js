import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { SHAPE, surfaces } from './transamerica-pyramid-mesh.js';
import { base, facade, wings, spire } from './transamerica-pyramid-parts.js';

// Transamerica Pyramid, original procedural model. Near carries every window pocket (a 1.4 m module,
// 0.6 m deep, piers and jambs), the pocket glazing with a scatter of lit floors, the A-frame arcade,
// the wings and the louvred spire; far keeps the same silhouette, spandrel bands, arcade, wings and
// spire at a fraction of the cost. The building is authored on its own axes and rotated once into
// the mapped footprint (faces at bearings 80.8 / 170.8 / 260.8 / 350.8 degrees).
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const S = surfaces();
  const ctx = { S, near: detail === 'near', pitch: 1.37, pier: 0.22, windows: 0 };
  for (let f = 0; f < 4; f++) { base(ctx, f); facade(ctx, f); spire(ctx, f); if (f === 0 || f === 2) wings(ctx, f); }
  S.flush(b, SHAPE.rotation);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  model.userData.windows = ctx.windows;
  return model;
}
