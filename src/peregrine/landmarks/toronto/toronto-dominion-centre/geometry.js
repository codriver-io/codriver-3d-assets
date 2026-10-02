import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { TOWERS, PAVILION, PLINTH, LAWNS, SOUTH_PLATFORM, offsetConvex } from './toronto-dominion-centre-site.js';
import { kit } from './toronto-dominion-centre-kit.js';
import { buildTower } from './toronto-dominion-centre-tower.js';
import { buildPavilion } from './toronto-dominion-centre-pavilion.js';

// Authoring only: imported by the exporter, inspector, screenshot harness and tests, never the map.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', p = SPEC.plinth;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), k = kit(b);

  // The raised granite plaza (a 0.9 m plinth) with a low stone step round its edge, the
  // south tower's own platform across Wellington Street, and the two mapped lawns.
  for (const outline of [PLINTH, SOUTH_PLATFORM]) {
    k.prism('granite', outline, 0, p);
    if (near) k.prism('stone', offsetConvex(outline, () => 1.3), 0, p * 0.5);
  }
  for (const lawn of LAWNS) k.prism('lawn', lawn, p, p + 0.08);

  for (const tower of TOWERS) buildTower(k, tower, near);
  buildPavilion(k, PAVILION, near);
  const root = b.finish();
  root.traverse((o) => { // flat faces share their corners: 4 vertices a quad, not 6 (a free-standing building carries no bridgeLift)
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift');
    o.geometry = mergeVertices(o.geometry, 1e-4); o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
  });
  return root;
}
