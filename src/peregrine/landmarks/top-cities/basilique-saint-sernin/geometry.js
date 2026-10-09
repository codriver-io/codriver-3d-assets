import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { THETA } from './basilique-saint-sernin-plan.js';
import { makeKit } from './basilique-saint-sernin-kit.js';
import { buildBasilica } from './basilique-saint-sernin-build.js';

export function create({ detail = 'near' } = {}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  buildBasilica(makeKit(b,detail==='near'));
  const root=b.finish();
  root.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(THETA);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();});
  root.userData.elevationDatum=MANIFEST.elevationDatum;
  return root;
}
