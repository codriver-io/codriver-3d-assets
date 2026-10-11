import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { createKit } from './conservatory-of-flowers-kit.js';
import { buildConservatory } from './conservatory-of-flowers-parts.js';

// The Conservatory of Flowers: octagonal domed pavilion with a gabled vestibule, two L-shaped
// vaulted wings ending in cupola-crowned lobes, and the low service houses behind the alley.
// Authored in the building frame (p along the long axis, q toward the entrance), rotated once by
// the mapped 5.9 deg axis inside the kit. Glass and frames are merged geometry, not panes.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = createKit();
  buildConservatory(k, detail === 'near');
  k.flush(b);
  return b.finish();
}
