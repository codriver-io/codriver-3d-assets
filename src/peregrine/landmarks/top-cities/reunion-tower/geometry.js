import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildReunionTower } from './reunion-tower-parts.js';

// Reunion Tower. Near is an 8-frequency geodesic (the published subdivision) with the
// banded shafts and elevator glass; far keeps the same ball, open underside, crown and
// four shafts at 4-frequency, about a quarter of the triangles.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  buildReunionTower(b, detail);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
