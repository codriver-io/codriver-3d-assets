import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { THETA } from './abbaye-aux-dames-plan.js';
import { makeKit } from './abbaye-aux-dames-kit.js';
import { buildChurch } from './abbaye-aux-dames-church.js';
import { buildConvent } from './abbaye-aux-dames-convent.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k=makeKit(b,detail==='near');buildChurch(k);buildConvent(k);
  const root=b.finish();
  root.traverse(o=>{if(!o.isMesh)return;const old=o.geometry;old.deleteAttribute('bridgeLift');o.geometry=mergeVertices(old,1e-5);old.dispose();o.geometry.rotateY(THETA);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();});
  root.userData.elevationDatum=MANIFEST.elevationDatum;
  return root;
}
