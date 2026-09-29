import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { createKit } from './casa-loma-kit.js';
import { ANGLE, REF_UV } from './casa-loma-site.js';
import { buildCastle } from './casa-loma-castle.js';
import { buildStables } from './casa-loma-stables.js';

/**
 * Casa Loma: the castle (mapped outline extruded, upper storeys, roofs, three kinds of tower,
 * conservatory dome) and the stables with the water tower. One group, real metres,
 * +X east +Y up +Z south around SPEC.origin, y = 0 flat grade (the hillside is not modelled).
 * Both LODs keep the silhouette; `far` drops windows, merlons and small ornament.
 */
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = createKit(b, detail === 'near');
  // Plan (u, v) is written relative to the castle centre; shift onto the model origin, rotate onto east/south.
  k.frame(ANGLE, REF_UV[0], REF_UV[1]);
  buildCastle(k);
  buildStables(k);
  const model = b.finish();
  // No bridge-fitting weights on a building.
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
