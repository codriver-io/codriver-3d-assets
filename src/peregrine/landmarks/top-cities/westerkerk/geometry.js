import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { makeKit, THETA } from './westerkerk-parts.js';
import { buildWesterkerk } from './westerkerk-build.js';
export function create({ detail = 'near' } = {}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  buildWesterkerk(makeKit(b,detail==='near'));
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(THETA);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  root.userData.elevationDatum=MANIFEST.elevationDatum;
  return root;
}
