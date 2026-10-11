import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { makeKit } from './couvent-des-jacobins-kit.js';
import { buildChurch, buildConvent } from './couvent-des-jacobins-build.js';
import { THETA } from './couvent-des-jacobins-plan.js';
export function create({detail='near'}={}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const kit=makeKit(b,detail==='near');buildChurch(kit);buildConvent(kit);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');const old=o.geometry;o.geometry=mergeVertices(old,1e-5);old.dispose();o.geometry.rotateY(THETA);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  root.userData.elevationDatum=MANIFEST.elevationDatum;
  return root;
}
