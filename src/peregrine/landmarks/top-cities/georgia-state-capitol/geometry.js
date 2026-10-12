import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './georgia-state-capitol-kit.js';
import { buildBody } from './georgia-state-capitol-body.js';
import { buildDome } from './georgia-state-capitol-dome.js';

export function create({detail='near'}={}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail), k=makeKit(b,detail==='near');
  buildBody(k);buildDome(k);
  const model=b.finish();
  // Weld repeated coplanar vertices after material batching; preserve normals and hard edges.
  for(const mesh of model.children){const original=mesh.geometry;mesh.geometry=mergeVertices(original,1e-5);original.dispose();}

  model.userData.features={westColumns:6,drumBays:16,domeDiameter:22.86,statue:'Miss Freedom, raised torch and lowered sword'};
  return model;
}
