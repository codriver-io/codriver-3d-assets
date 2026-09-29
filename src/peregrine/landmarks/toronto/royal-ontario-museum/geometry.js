import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { SITE_ANGLE } from './royal-ontario-museum-site.js';
import { kit } from './royal-ontario-museum-solids.js';
import { buildHeritage } from './royal-ontario-museum-heritage.js';
import { buildCrystal } from './royal-ontario-museum-crystal.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // Overlays (glazing, seams) are offset along face normals; on the leaning walls that dips a few centimetres under the
  // ground line, so anything below grade is lifted onto it.
  const put = (g, m) => {
    const p = g.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) < 0) p.setY(i, 0);
    g.rotateY(SITE_ANGLE); b.put(g, m);
  };
  const K = kit(put, { near });

  buildHeritage(K, { near });

  buildCrystal(K, { near });
  return b.finish();
}
