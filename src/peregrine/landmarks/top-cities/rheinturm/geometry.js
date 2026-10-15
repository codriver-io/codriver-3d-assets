import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { shaft, pod, clock, mast } from './rheinturm-parts.js';

// Rheinturm. Near carries the cone panel joints, both storeys of mullions, the full
// porthole column and the roof aerials. Far keeps the same silhouette, the two glass
// bands, the clock and the stepped mast at about a quarter of the triangles.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const near = detail === 'near';
  shaft(b, near);
  pod(b, near);
  clock(b, near);
  mast(b, near);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
