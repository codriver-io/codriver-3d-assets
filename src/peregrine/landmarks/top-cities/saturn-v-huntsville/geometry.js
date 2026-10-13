import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildRocket, buildSupport } from './saturn-v-huntsville-parts.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  buildRocket(b, detail === 'near'); buildSupport(b, detail === 'near');
  const model = b.finish();
  model.traverse(o => { if (o.isMesh) { o.geometry.rotateY(SPEC.rotationRad); o.geometry.deleteAttribute('bridgeLift'); } });
  return model;
}
