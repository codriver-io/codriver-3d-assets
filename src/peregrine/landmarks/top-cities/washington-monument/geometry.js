import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { build } from './washington-monument-parts.js';

// Washington Monument. Near keeps the door reveal and the window jambs.
// Far keeps the same silhouette, the 150 ft colour break, the eight windows,
// the red beacons and the east lobby, and folds the aluminium apex into the upper marble.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  build(b, { near: detail === 'near' });
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
