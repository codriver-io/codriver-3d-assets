import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { THETA } from './ghirardelli-square-plan.js';
import { makeKit } from './ghirardelli-square-kit.js';
import { buildBlocks } from './ghirardelli-square-blocks.js';
import { buildTower } from './ghirardelli-square-tower.js';
import { buildSign } from './ghirardelli-square-sign.js';

// Ghirardelli Square: the red-brick factory complex round the terraced plaza, the Clock Tower and,
// above all, the "Ghirardelli" rooftop sign. Far keeps the silhouette (masses, roofs, tower, lettering)
// and drops windows, string courses, merlons, dormers and most of the scaffold.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const kit = makeKit(b);
  const G = kit.frame(THETA.G, 'G'), W = kit.frame(THETA.W, 'W');
  buildBlocks(G, W, detail);
  buildTower(G, detail);
  buildSign(G, detail);
  kit.flush();
  const root = b.finish();
  root.userData.provenance = 'Original procedural geometry; mapped footprints © OpenStreetMap contributors (ODbL 1.0)';
  return root;
}
