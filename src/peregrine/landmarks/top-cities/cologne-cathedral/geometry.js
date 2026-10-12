import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { THETA } from './cologne-cathedral-plan.js';
import { kit } from './cologne-cathedral-parts.js';
import { build } from './cologne-cathedral-build.js';
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  build(kit(b, detail === 'near'));
  const root = b.finish();
  root.traverse(o => {
    if (!o.isMesh) return;
    const old = o.geometry; old.deleteAttribute('bridgeLift');
    o.geometry = mergeVertices(old, 1e-4); old.dispose();
    o.geometry.rotateY(THETA);
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
  });
  root.userData.elevationDatum = MANIFEST.elevationDatum;
  return root;
}
