import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildPalace } from './royal-palace-amsterdam-build.js';

// +x east/front, +z south/along the facade; geographic skew is baked.
export function toWorld([x, y, z]) {
  const a = SPEC.frontageBearing * Math.PI / 180;
  return [x * Math.cos(a) - z * Math.sin(a) - 1.5, y, x * Math.sin(a) + z * Math.cos(a) + 2.7];
}
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  buildPalace(b, detail === 'near');
  const root = b.finish();
  const matrix = new THREE.Matrix4().makeRotationY(-SPEC.frontageBearing * Math.PI / 180);
  matrix.setPosition(-1.5, 0, 2.7);
  root.traverse(o => { if (o.isMesh) { o.geometry.applyMatrix4(matrix); o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere(); } });
  return root;
}
