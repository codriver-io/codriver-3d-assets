import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { build } from './casa-presei-libere-kit.js';

// Casa Presei Libere. Parts are already in east/up/south metres; boxes are turned once by plan.ANGLE.
// Quads are emitted as two triangles; welding the shared edge cuts the GLB without changing the mesh.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  build(b, detail === 'near');
  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    const old = o.geometry;
    o.geometry = mergeVertices(old, 1e-4);
    old.dispose();
  });
  return root;
}
