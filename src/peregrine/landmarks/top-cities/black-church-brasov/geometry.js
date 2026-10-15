import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { ALPHA } from './black-church-brasov-plan.js';
import { kit } from './black-church-brasov-parts.js';
import { build } from './black-church-brasov-build.js';

// The church is authored in its own axis frame (u along the nave); rotated once to the mapped bearing here.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  build(kit(b, detail === 'near'));
  const root = b.finish();
  root.traverse(o => {
    if (!o.isMesh) return;
    const old = o.geometry; old.deleteAttribute('bridgeLift');
    o.geometry = mergeVertices(old, 1e-4); old.dispose();
    o.geometry.rotateY(ALPHA);
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
  });
  root.userData.elevationDatum = MANIFEST.elevationDatum;
  return root;
}
