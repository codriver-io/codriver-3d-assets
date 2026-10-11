import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { makeKit, THETA } from './cathedrale-de-bayeux-kit.js';
import { buildCathedral } from './cathedrale-de-bayeux-parts.js';
export function create({detail='near'}={}){
 const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 buildCathedral(makeKit(b,detail==='near'));
 const root=b.finish();root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(THETA);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
 root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}
